/**
 * 进度指示器组件
 *
 * 显示当前训练进度
 */

import React from 'react'

interface ProgressIndicatorProps {
  currentRound: number
  totalRounds: number
  onExit?: () => void
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  currentRound,
  totalRounds,
  onExit,
}) => {
  const progress = (currentRound / totalRounds) * 100

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 0',
        borderTop: '1px solid #eee',
      }}
    >
      {/* 进度条 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '14px', color: '#666' }}>
          Round {currentRound}/{totalRounds}
        </span>

        <div
          style={{
            width: '120px',
            height: '4px',
            backgroundColor: '#eee',
            borderRadius: '2px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: '100%',
              backgroundColor: '#00FF41',
              transition: 'width 0.3s ease',
            }}
          />
        </div>
      </div>

      {/* 退出按钮 */}
      {onExit && (
        <button
          onClick={onExit}
          style={{
            padding: '8px 16px',
            backgroundColor: 'transparent',
            color: '#999',
            border: '1px solid #ddd',
            borderRadius: '6px',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#999'
            e.currentTarget.style.color = '#666'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#ddd'
            e.currentTarget.style.color = '#999'
          }}
        >
          退出
        </button>
      )}
    </div>
  )
}

export default ProgressIndicator
