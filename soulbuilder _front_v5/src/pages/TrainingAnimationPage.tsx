import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TrainingAnimation } from '../components/training-animation';
import { useStore } from '../stores/useStore';

const TrainingAnimationPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentAgent } = useStore();

  const handleComplete = () => {
    navigate(`/agents/${id}/train/complete`);
  };

  // 计算训练后的分数和等级
  const beforeScore = currentAgent?.score || 85;
  const afterScore = Math.min(beforeScore + 9, 100); // 最多加9分
  const beforeRank = currentAgent?.rank || 'A';

  // 根据分数计算训练后等级
  const calculateRank = (score: number): string => {
    if (score >= 95) return 'S';
    if (score >= 85) return 'A';
    if (score >= 70) return 'B';
    if (score >= 55) return 'C';
    if (score >= 40) return 'D';
    return 'E';
  };

  const afterRank = calculateRank(afterScore);

  // 训练获得的技能
  const skills = ['SPIN 销售法', 'Challenger Sale', '大客户管理策略'];

  return (
    <TrainingAnimation
      onComplete={handleComplete}
      duration={30}
      agentName={currentAgent?.name || 'SoloBrave'}
      beforeScore={beforeScore}
      afterScore={afterScore}
      beforeRank={beforeRank}
      afterRank={afterRank}
      skills={skills}
    />
  );
};

export default TrainingAnimationPage;
