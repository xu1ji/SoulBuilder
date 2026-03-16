/**
 * 训练完成页面组件
 *
 * 显示训练结果反馈
 */

import React from 'react'
import { TrainingFeedback } from '../types/feedback'

interface TrainingCompleteProps {
  agentName: string
  agentTitle: string
  feedback: TrainingFeedback
  onViewProfile: () => void
  onExport: () => void
  onContinue: () => void
}

export const TrainingComplete: React.FC<TrainingCompleteProps> = ({
  agentName,
  agentTitle,
  feedback,
  onViewProfile,
  onExport,
  onContinue,
}) => {
  const { rankUp, oldRank, newRank, oldScore, newScore, scoreDiff, improvements, surprises, title, message, nextStepSuggestion } = feedback

  // 星级显示
  const getStars = (rank: string) => {
    const starMap: Record<string, string> = {
      E: '☆☆☆☆☆',
      D: '★☆☆☆☆',
      C: '★★★☆☆',
      B: '★★★★☆',
      A: '★★★★★',
      S: '★★★★★✨',
    }
    return starMap[rank] || '☆☆☆☆☆'
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
      }}
    >
      <div
        style={{
          maxWidth: '600px',
          width: '100%',
        }}
      >
        {/* 训练完成标题 */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: '32px',
          }}
        >
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>✅ 训练完成</div>
        </div>

        {/* 主卡片 */}
        <div
          style={{
            backgroundColor: '#F9FAFB',
            borderRadius: '16px',
            padding: '32px',
            marginBottom: '24px',
          }}
        >
          {/* 状态标题 */}
          <div
            style={{
              textAlign: 'center',
              marginBottom: '24px',
            }}
          >
            <div style={{ fontSize: '28px', fontWeight: 600, marginBottom: '8px' }}>
              {rankUp ? '🎉' : '📊'} {title}
            </div>
            <div style={{ color: '#666' }}>
              {rankUp ? `${agentName} 从 ${oldRank} 级 → ${newRank} 级` : message}
            </div>
          </div>

          {/* 分数对比 */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '32px',
              marginBottom: '24px',
            }}
          >
            {/* 训练前 */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '14px', color: '#999', marginBottom: '8px' }}>训练前</div>
              <div style={{ fontSize: '20px', fontWeight: 600, marginBottom: '4px' }}>
                {oldRank} 级
              </div>
              <div style={{ fontSize: '16px', color: '#666' }}>{oldScore} 分</div>
              <div style={{ fontSize: '20px', marginTop: '8px' }}>{getStars(oldRank)}</div>
            </div>

            {/* 箭头 */}
            <div style={{ display: 'flex', alignItems: 'center', fontSize: '24px' }}>
              →
            </div>

            {/* 训练后 */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '14px', color: '#999', marginBottom: '8px' }}>训练后</div>
              <div style={{ fontSize: '20px', fontWeight: 600, marginBottom: '4px', color: '#00FF41' }}>
                {newRank} 级
              </div>
              <div style={{ fontSize: '16px', color: '#666' }}>{newScore} 分 (+{scoreDiff})</div>
              <div style={{ fontSize: '20px', marginTop: '8px' }}>{getStars(newRank)}</div>
            </div>
          </div>

          {/* 提升点 */}
          {improvements.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '16px', fontWeight: 500, marginBottom: '12px' }}>
                📊 本次提升：
              </div>
              {improvements.map((imp, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '8px',
                    marginBottom: '8px',
                    padding: '12px',
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                  }}
                >
                  <span style={{ fontSize: '18px' }}>{imp.icon}</span>
                  <div>
                    <div style={{ fontWeight: 500 }}>{imp.label}</div>
                    <div style={{ fontSize: '14px', color: '#666' }}>{imp.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 惊喜 */}
          {surprises.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              {surprises.map((s, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    backgroundColor: '#FEF3C7',
                    borderRadius: '8px',
                    marginBottom: '8px',
                  }}
                >
                  <span style={{ fontSize: '24px' }}>{s.icon}</span>
                  <div>
                    <div style={{ fontWeight: 500 }}>{s.name}</div>
                    <div style={{ fontSize: '14px', color: '#92400E' }}>{s.description}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 下一步建议 */}
          <div
            style={{
              padding: '16px',
              backgroundColor: '#fff',
              borderRadius: '8px',
              borderLeft: '4px solid #00FF41',
            }}
          >
            <div style={{ fontWeight: 500, marginBottom: '4px' }}>💡 下一步建议</div>
            <div style={{ color: '#666' }}>{nextStepSuggestion}</div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '12px',
          }}
        >
          <button
            onClick={onViewProfile}
            style={{
              padding: '12px 24px',
              backgroundColor: '#fff',
              color: '#1a1a1a',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '15px',
              cursor: 'pointer',
            }}
          >
            查看画像
          </button>
          <button
            onClick={onExport}
            style={{
              padding: '12px 24px',
              backgroundColor: '#fff',
              color: '#1a1a1a',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '15px',
              cursor: 'pointer',
            }}
          >
            导出配置
          </button>
          <button
            onClick={onContinue}
            style={{
              padding: '12px 24px',
              backgroundColor: '#00FF41',
              color: '#000',
              border: 'none',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            继续训练
          </button>
        </div>
      </div>
    </div>
  )
}

export default TrainingComplete
