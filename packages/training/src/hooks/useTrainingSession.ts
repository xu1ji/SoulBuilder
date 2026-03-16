/**
 * 训练会话 Hook
 *
 * 整合 SSE、消息管理和 API 调用的完整训练流程
 */

import { useState, useCallback, useRef, useEffect } from 'react'
import {
  TrainingSession,
  TrainingResult,
  TrainingMode,
  TrainingMethod,
  Agent,
  generateSessionId,
} from '@soulbuilder/shared'
import { startTraining, sendMessage, completeTraining, abandonSession } from '../api/training'
import { useMessages } from './useMessages'
import { extractJSON, TrainingOutputJSON } from '../utils/json-parser'

interface UseTrainingSessionOptions {
  agent: Agent
  mode: TrainingMode
  method: TrainingMethod
  onComplete?: (result: TrainingResult) => void
  onError?: (error: string) => void
}

interface UseTrainingSessionReturn {
  // 状态
  session: TrainingSession | null
  messages: ReturnType<typeof useMessages>['messages']
  isStreaming: boolean
  error: string | null
  currentRound: number
  totalRounds: number

  // 操作
  initialize: () => Promise<void>
  send: (message: string) => void
  finish: () => Promise<TrainingResult | null>
  abort: () => void

  // 解析结果
  parsedOutput: TrainingOutputJSON | null
}

export function useTrainingSession(options: UseTrainingSessionOptions): UseTrainingSessionReturn {
  const { agent, mode, method, onComplete, onError } = options

  const [session, setSession] = useState<TrainingSession | null>(null)
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [parsedOutput, setParsedOutput] = useState<TrainingOutputJSON | null>(null)

  const messages = useMessages()
  const abortRef = useRef<(() => void) | null>(null)

  // 清理
  useEffect(() => {
    return () => {
      abortRef.current?.()
    }
  }, [])

  // 初始化会话
  const initialize = useCallback(async () => {
    try {
      setError(null)
      setParsedOutput(null)
      messages.clearMessages()

      const result = await startTraining({
        agentId: agent.id,
        mode,
        method,
      })

      setSession(result.session)

      // 添加 AI 的欢迎消息（如果后端返回了）
      if (result.session.messages.length > 0) {
        const lastMessage = result.session.messages[result.session.messages.length - 1]
        if (lastMessage.role === 'assistant') {
          messages.appendAssistantMessage(lastMessage.content)
        }
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to initialize session'
      setError(errorMsg)
      onError?.(errorMsg)
    }
  }, [agent.id, mode, method, messages, onError])

  // 发送消息
  const send = useCallback((message: string) => {
    if (!session || isStreaming) return

    // 添加用户消息
    messages.addUserMessage(message)
    setIsStreaming(true)
    setError(null)

    // 发送到后端
    abortRef.current = sendMessage({
      sessionId: session.sessionId,
      message,
      onChunk: (content) => {
        messages.appendAssistantMessage(content)
      },
      onDone: () => {
        setIsStreaming(false)

        // 检查是否包含 JSON 输出
        const lastAssistantMessage = messages.getLastAssistantMessage()
        if (lastAssistantMessage) {
          const json = extractJSON(lastAssistantMessage.content)
          if (json) {
            setParsedOutput(json)
          }
        }
      },
      onError: (err) => {
        setError(err)
        setIsStreaming(false)
        onError?.(err)
      },
      onJSON: (data) => {
        // 如果后端直接返回解析好的 JSON
        if (data && typeof data === 'object') {
          setParsedOutput(data as TrainingOutputJSON)
        }
      },
    })
  }, [session, isStreaming, messages, onError])

  // 完成训练
  const finish = useCallback(async (): Promise<TrainingResult | null> => {
    if (!session) return null

    try {
      setError(null)
      const result = await completeTraining(session.sessionId)
      onComplete?.(result)
      return result
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to complete training'
      setError(errorMsg)
      onError?.(errorMsg)
      return null
    }
  }, [session, onComplete, onError])

  // 中止
  const abort = useCallback(() => {
    abortRef.current?.()
    abortRef.current = null
    setIsStreaming(false)

    // 如果有会话，通知后端放弃
    if (session) {
      abandonSession(session.sessionId).catch(console.error)
    }
  }, [session])

  return {
    session,
    messages: messages.messages,
    isStreaming,
    error,
    currentRound: session?.currentRound || 1,
    totalRounds: session?.totalRounds || 5,
    initialize,
    send,
    finish,
    abort,
    parsedOutput,
  }
}
