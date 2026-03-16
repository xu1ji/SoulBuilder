/**
 * 训练对话组件
 *
 * 显示训练对话内容，支持 SSE 流式显示
 */

import React, { useRef, useEffect } from 'react'
import { ChatMessage } from '@soulbuilder/shared'
import { MessageBubble } from './MessageBubble'
import { InputBar } from './InputBar'
import { ProgressIndicator } from './ProgressIndicator'

interface TrainingChatProps {
  agentName: string
  messages: ChatMessage[]
  currentRound: number
  totalRounds: number
  isStreaming: boolean
  onSend: (message: string) => void
  onExit: () => void
}

export const TrainingChat: React.FC<TrainingChatProps> = ({
  agentName,
  messages,
  currentRound,
  totalRounds,
  isStreaming,
  onSend,
  onExit,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      {/* 消息列表 */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px',
        }}
      >
        {/* Agent 名称 */}
        <div
          style={{
            fontSize: '24px',
            fontWeight: 600,
            color: '#1a1a1a',
            marginBottom: '8px',
          }}
        >
          {agentName}
        </div>

        {/* 分隔线 */}
        <div
          style={{
            height: '1px',
            backgroundColor: '#eee',
            marginBottom: '24px',
          }}
        />

        {/* 消息 */}
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isStreaming={isStreaming && message === messages[messages.length - 1]}
          />
        ))}

        {/* 滚动锚点 */}
        <div ref={messagesEndRef} />
      </div>

      {/* 进度指示器 */}
      <div style={{ padding: '0 24px' }}>
        <ProgressIndicator
          currentRound={currentRound}
          totalRounds={totalRounds}
          onExit={onExit}
        />
      </div>

      {/* 输入栏 */}
      <div style={{ padding: '16px 24px 24px' }}>
        <InputBar
          onSend={onSend}
          disabled={isStreaming}
          placeholder={isStreaming ? 'AI 正在思考...' : '输入你的想法...'}
        />
      </div>
    </div>
  )
}

export default TrainingChat
