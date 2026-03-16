import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../stores/useStore';
import { RankBadge } from '../components/ui/RankBadge';
import { getStars } from '../utils/theme';

const TrainingCompletePage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const agent = useStore((state) => state.agents.find(a => a.id === id));
  const updateAgent = useStore((state) => state.updateAgent);
  const [confirmed, setConfirmed] = useState(false);

  if (!agent) return <div>Agent not found</div>;

  const handleSave = () => {
    if (!confirmed) return;
    updateAgent(agent.id, {
      score: 98,
      status: 'trained',
      lastTrained: new Date().toISOString().split('T')[0]
    });
    navigate(`/agents/${id}`);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <div className="text-5xl mb-4">✅</div>
        <h1 className="text-3xl font-bold">训练完成</h1>
      </div>

      <div className="bg-gray-50 rounded-2xl p-8 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-2xl">🎉</span>
          <div>
            <h2 className="text-xl font-bold">能力进一步提升！</h2>
            <p className="text-sm text-gray-500">{agent.name} 从 {agent.rank} 级 → {agent.rank} 级 (分数提升)</p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-8 mb-8">
          <div className="matrix-card border-none bg-white p-6 text-center w-40">
            <div className="text-xs text-gray-400 mb-2">训练前</div>
            <RankBadge rank={agent.rank} score={agent.score} />
            <div className="text-xs text-yellow-500 mt-2">{getStars(agent.rank)}</div>
          </div>
          
          <div className="text-3xl text-gray-300">→</div>

          <div className="matrix-card border-matrix-green bg-white p-6 text-center w-40 shadow-[0_0_20px_rgba(0,255,65,0.1)]">
            <div className="text-xs text-matrix-green font-bold mb-2">训练后</div>
            <RankBadge rank={agent.rank} score={98} />
            <div className="text-xs text-yellow-500 mt-2">{getStars(agent.rank)}</div>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex gap-4 items-start">
            <span className="text-xl">💼</span>
            <div>
              <div className="font-bold text-sm">方法论注入</div>
              <div className="text-xs text-gray-500">新增: SPIN销售法、Challenger Sale、顾问式销售</div>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <span className="text-xl">🎯</span>
            <div>
              <div className="font-bold text-sm">技能强化</div>
              <div className="text-xs text-gray-500">大客户关系: 85 → 92 (+7)</div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 mb-8">
          <div className="flex gap-2 items-center mb-1">
            <span>✨</span>
            <span className="font-bold text-yellow-800 text-sm">惊喜发现</span>
          </div>
          <p className="text-xs text-yellow-700">发现小明具备「跨部门协调」的潜力，建议进一步培养</p>
        </div>

        <div className="border-l-4 border-matrix-green bg-white p-4 rounded-r-xl text-sm text-gray-600">
          <span className="font-bold text-gray-900">下一步建议：</span>
          当前已达到 S 级，可以考虑拓展场景或注入更多行业知识
        </div>
      </div>

      <div className="matrix-card mb-8">
        <h3 className="font-bold mb-3">训练摘要</h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          本次训练通过「描述更强的样子」方式，为销售总监小明注入了标准销售方法论体系。小明现在掌握了 SPIN销售法、Challenger Sale 和顾问式销售三大方法论，并强化了大客户关系管理能力。训练过程中，你提到希望小明「能带团队、风格强势、能搞定大客户」，这些特质已被融入到 Agent 的身份档案中。
        </p>
      </div>

      <div className="matrix-card border-yellow-200 bg-yellow-50/30 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-yellow-600 font-bold">⚠️ 确认配置修改</span>
        </div>
        <ul className="text-xs text-gray-500 space-y-1 mb-6">
          <li>• IDENTITY.md - 添加方法论描述</li>
          <li>• SOUL.md - 强化价值观</li>
        </ul>
        <label className="flex items-center gap-3 cursor-pointer">
          <input 
            type="checkbox" 
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="w-5 h-5 accent-matrix-green"
          />
          <span className="text-sm text-gray-700 font-medium">我已了解，确认保存（会自动备份原配置）</span>
        </label>
      </div>

      <div className="flex gap-4">
        <button onClick={() => navigate(`/agents/${id}`)} className="matrix-btn-secondary flex-1">查看画像</button>
        <button 
          onClick={handleSave}
          disabled={!confirmed}
          className="matrix-btn-primary flex-1"
        >
          确认并保存
        </button>
      </div>
    </div>
  );
};

export default TrainingCompletePage;
