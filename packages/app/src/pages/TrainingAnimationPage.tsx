import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { TrainingAnimation } from '@soulbuilder/animation'
import type { AnimationPhase, AgentRank } from '@soulbuilder/shared'
import { useAppStore } from '../stores/useAppStore'

export default function TrainingAnimationPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentAgent } = useAppStore()

  // 动画配置
  const config = {
    skills: ['SPIN 销售法', 'Challenger Sale', '大客户管理策略'],
    beforeScore: currentAgent?.score || 85,
    afterScore: Math.min((currentAgent?.score || 85) + 9, 100),
    beforeRank: (currentAgent?.rank || 'A') as AgentRank,
    afterRank: 'A' as AgentRank,
  }

  const handlePhaseChange = (_newPhase: AnimationPhase, _newProgress: number) => {
    // 可以在这里添加阶段变化的处理逻辑
  }

  const handleComplete = () => {
    navigate(`/agents/${id}/train/result`)
  }

  // 直接返回 TrainingAnimation，不需要额外的容器
  // TrainingAnimation 内部已经设置了 position: fixed
  return (
    <TrainingAnimation
      config={config}
      onComplete={handleComplete}
      onPhaseChange={handlePhaseChange}
      skippable={true}
    />
  )
}
