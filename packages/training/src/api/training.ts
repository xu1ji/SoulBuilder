/**
 * 训练 API 调用
 *
 * 与后端 BFF 层通信的接口
 */

import { TrainingSession, TrainingResult, TrainingMode, TrainingMethod } from '@soulbuilder/shared'
import { createSSEParser, parseSSEData, TrainingSSEData } from './sse-parser'

const API_BASE = '/api/soulbuilder'

/**
 * 开始训练会话
 */
export async function startTraining(params: {
  agentId: string
  mode: TrainingMode
  method: TrainingMethod
}): Promise<{ sessionId: string; session: TrainingSession }> {
  const response = await fetch(`${API_BASE}/train/start`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  })

  if (!response.ok) {
    throw new Error(`Failed to start training: ${response.statusText}`)
  }

  return response.json()
}

/**
 * 发送训练消息（SSE 流式）
 *
 * @returns abort 函数，用于中断连接
 */
export function sendMessage(params: {
  sessionId: string
  message: string
  onChunk: (content: string) => void
  onDone: () => void
  onError: (error: string) => void
  onJSON?: (data: unknown) => void
}): () => void {
  const { sessionId, message, onChunk, onDone, onError, onJSON } = params

  const controller = new AbortController()
  const { signal } = controller

  // 创建 SSE 解析器
  const parser = createSSEParser(
    (sseMessage) => {
      const data = parseSSEData(sseMessage.data) as TrainingSSEData

      if (data.error) {
        onError(data.error)
        return
      }

      if (data.done) {
        onDone()
        return
      }

      if (data.content) {
        onChunk(data.content)
      }

      if (data.json && onJSON) {
        onJSON(data.json)
      }
    },
    (error) => {
      onError(error.message)
    }
  )

  // 发起请求
  fetch(`${API_BASE}/train/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'text/event-stream',
    },
    body: JSON.stringify({ sessionId, message }),
    signal,
  })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.statusText}`)
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('No response body')
      }

      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        parser.parse(chunk)
      }

      parser.finish()
      onDone()
    })
    .catch((error) => {
      if (error.name !== 'AbortError') {
        onError(error.message)
      }
    })

  // 返回 abort 函数
  return () => {
    controller.abort()
  }
}

/**
 * 完成训练
 */
export async function completeTraining(sessionId: string): Promise<TrainingResult> {
  const response = await fetch(`${API_BASE}/train/complete`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sessionId }),
  })

  if (!response.ok) {
    throw new Error(`Failed to complete training: ${response.statusText}`)
  }

  const data = await response.json()
  return data.result
}

/**
 * 获取训练会话状态
 */
export async function getSessionStatus(sessionId: string): Promise<TrainingSession> {
  const response = await fetch(`${API_BASE}/train/session/${sessionId}`)

  if (!response.ok) {
    throw new Error(`Failed to get session status: ${response.statusText}`)
  }

  return response.json()
}

/**
 * 放弃训练会话
 */
export async function abandonSession(sessionId: string): Promise<void> {
  const response = await fetch(`${API_BASE}/train/abandon`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sessionId }),
  })

  if (!response.ok) {
    throw new Error(`Failed to abandon session: ${response.statusText}`)
  }
}
