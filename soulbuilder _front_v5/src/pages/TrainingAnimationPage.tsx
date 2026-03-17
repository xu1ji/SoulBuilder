import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TrainingAnimation } from '@soulbuilder/animation';
import type { AnimationPhase, AgentRank } from '@soulbuilder/shared';

const TrainingAnimationPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // 动画配置
  const config = {
    skills: ['SPIN 销售法', 'Challenger Sale', '大客户管理策略'],
    beforeScore: 85,
    afterScore: 94,
    beforeRank: 'A' as AgentRank,
    afterRank: 'A' as AgentRank,
  };

  const handlePhaseChange = (_phase: AnimationPhase, _progress: number) => {
    // 可以在这里添加阶段变化的处理逻辑
  };

  const handleComplete = () => {
    navigate(`/agents/${id}/train/complete`);
  };

  // 直接返回 TrainingAnimation 组件
  // 它内部已经设置了 position: fixed 和全屏样式
  return (
    <TrainingAnimation
      config={config}
      onComplete={handleComplete}
      onPhaseChange={handlePhaseChange}
      skippable={true}
    />
  );
};

export default TrainingAnimationPage;
