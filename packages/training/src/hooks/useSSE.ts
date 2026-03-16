/**
 * SSE 连接 Hook
 *
 * 用于管理 SSE 流式连接
 */

import { useState, useCallback, useRef } from 'react'

interface UseSSEOptions {
  onChunk?: (content: string) => void
  onDone?: () => void
  onError?: (error: string) => void
  onJSON?: (data: unknown) => void
}

interface UseSSEReturn {
  isStreaming: boolean
  error: string | null
  connect: (url: string, body: object) => void
  abort: () => void
}

export function useSSE(options: UseSSEOptions = {}): UseSSEReturn {
  const { onChunk, onDone, onError, onJSON } = options

  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const abortControllerRef = useRef<AbortController | null>(null)

  const abort = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    setIsStreaming(false)
  }, [])

  const connect = useCallback((url: string, body: object) => {
    // 中断之前的连接
    abort()

    setError(null)
    setIsStreaming(true)

    const controller = new AbortController()
    abortControllerRef.current = controller

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/event-stream',
      },
      body: JSON.stringify(body),
      signal: controller.signal,
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
        let buffer = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })

          // 解析 SSE 数据
          const lines = buffer.split('\n')
          buffer = lines.pop() || ''

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6)

              if (data === '[DONE]') {
                onDone?.()
                continue
              }

              try {
                const parsed = JSON.parse(data)

                if (parsed.error) {
                  setError(parsed.error)
                  onError?.(parsed.error)
                  continue
                }

                if (parsed.content) {
                  onChunk?.(parsed.content)
                }

                if (parsed.json) {
                  onJSON?.(parsed.json)
                }

                if (parsed.done) {
                  onDone?.()
                }
              } catch {
                // 如果不是 JSON，当作普通文本
                onChunk?.(data)
              }
            }
          }
        }

        setIsStreaming(false)
        onDone?.()
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setError(err.message)
          onError?.(err.message)
        }
        setIsStreaming(false)
      })
  }, [abort, onChunk, onDone, onError, onJSON])

  return {
    isStreaming,
    error,
    connect,
    abort,
  }
}
