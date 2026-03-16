/**
 * 消息管理 Hook
 *
 * 用于管理训练对话消息
 */

import { useState, useCallback } from 'react'
import { ChatMessage, generateMessageId } from '@soulbuilder/shared'

interface UseMessagesReturn {
  messages: ChatMessage[]
  addUserMessage: (content: string) => void
  appendAssistantMessage: (content: string) => void
  clearMessages: () => void
  getLastUserMessage: () => ChatMessage | undefined
  getLastAssistantMessage: () => ChatMessage | undefined
}

export function useMessages(): UseMessagesReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([])

  const addUserMessage = useCallback((content: string) => {
    const message: ChatMessage = {
      id: generateMessageId(),
      role: 'user',
      content,
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, message])
    return message
  }, [])

  const appendAssistantMessage = useCallback((content: string) => {
    setMessages(prev => {
      const lastMessage = prev[prev.length - 1]

      // 如果最后一条是 assistant 消息，追加内容
      if (lastMessage?.role === 'assistant') {
        return [
          ...prev.slice(0, -1),
          { ...lastMessage, content: lastMessage.content + content },
        ]
      }

      // 否则创建新的 assistant 消息
      const message: ChatMessage = {
        id: generateMessageId(),
        role: 'assistant',
        content,
        timestamp: new Date(),
      }
      return [...prev, message]
    })
  }, [])

  const clearMessages = useCallback(() => {
    setMessages([])
  }, [])

  const getLastUserMessage = useCallback(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === 'user') {
        return messages[i]
      }
    }
    return undefined
  }, [messages])

  const getLastAssistantMessage = useCallback(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === 'assistant') {
        return messages[i]
      }
    }
    return undefined
  }, [messages])

  return {
    messages,
    addUserMessage,
    appendAssistantMessage,
    clearMessages,
    getLastUserMessage,
    getLastAssistantMessage,
  }
}
