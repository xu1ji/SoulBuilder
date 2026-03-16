/**
 * 消息气泡组件
 *
 * 用于显示训练对话中的消息
 */

import React from 'react'
import { ChatMessage } from '@soulbuilder/shared'

interface MessageBubbleProps {
  message: ChatMessage
  isStreaming?: boolean
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isStreaming = false,
}) => {
  const isUser = message.role === 'user'

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        marginBottom: '16px',
      }}
    >
      <div
        style={{
          maxWidth: '80%',
          padding: '12px 16px',
          borderRadius: '16px',
          backgroundColor: isUser ? '#00FF41' : '#F5F5F5',
          color: isUser ? '#000' : '#1a1a1a',
          fontSize: '15px',
          lineHeight: '1.5',
          position: 'relative',
        }}
      >
        {message.content}

        {/* 流式输出的光标 */}
        {isStreaming && !isUser && (
          <span
            style={{
              display: 'inline-block',
              width: '8px',
              height: '16px',
              backgroundColor: '#00FF41',
              marginLeft: '2px',
              animation: 'blink 1s infinite',
            }}
          />
        )}
      </div>

      <style>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </div>
  )
}

export default MessageBubble
