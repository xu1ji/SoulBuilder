/**
 * Construct 训练空间组件
 *
 * Matrix 风格的纯白训练空间
 */

import React, { useEffect, useState } from 'react'
import { Agent, TrainingMode, TrainingMethod, TrainingResult } from '@soulbuilder/shared'
import { useTrainingSession } from '../hooks/useTrainingSession'
import { TrainingChat } from './TrainingChat'

interface ConstructSpaceProps {
  agent: Agent
  mode: TrainingMode
  method: TrainingMethod
  onComplete: (result: TrainingResult) => void
  onExit: () => void
}

export const ConstructSpace: React.FC<ConstructSpaceProps> = ({
  agent,
  mode,
  method,
  onComplete,
  onExit,
}) => {
  const [isInitialized, setIsInitialized] = useState(false)

  const {
    messages,
    isStreaming,
    error,
    currentRound,
    totalRounds,
    initialize,
    send,
    finish,
    abort,
    parsedOutput,
  } = useTrainingSession({
    agent,
    mode,
    method,
    onComplete,
    onError: (err) => {
      console.error('Training error:', err)
    },
  })

  // 初始化会话
  useEffect(() => {
    if (!isInitialized) {
      setIsInitialized(true)
      initialize()
    }
  }, [isInitialized, initialize])

  // 当检测到 JSON 输出时，自动完成训练
  useEffect(() => {
    if (parsedOutput && !isStreaming) {
      // 等待一小段时间让用户看到完成的消息
      const timer = setTimeout(() => {
        finish()
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [parsedOutput, isStreaming, finish])

  // 处理退出
  const handleExit = () => {
    abort()
    onExit()
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#FFFFFF',
        zIndex: 1000,
      }}
    >
      {/* 错误提示 */}
      {error && (
        <div
          style={{
            position: 'absolute',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '12px 24px',
            backgroundColor: '#fee2e2',
            color: '#dc2626',
            borderRadius: '8px',
            zIndex: 10,
          }}
        >
          {error}
          <button
            onClick={() => window.location.reload()}
            style={{
              marginLeft: '12px',
              padding: '4px 12px',
              backgroundColor: '#dc2626',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            重试
          </button>
        </div>
      )}

      {/* 训练对话 */}
      <TrainingChat
        agentName={agent.name}
        messages={messages}
        currentRound={currentRound}
        totalRounds={totalRounds}
        isStreaming={isStreaming}
        onSend={send}
        onExit={handleExit}
      />

      {/* 加载状态 */}
      {!isInitialized && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                border: '3px solid #f3f3f3',
                borderTop: '3px solid #00FF41',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 16px',
              }}
            />
            <div style={{ color: '#666' }}>进入 Construct 空间...</div>
          </div>

          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}
    </div>
  )
}

export default ConstructSpace
