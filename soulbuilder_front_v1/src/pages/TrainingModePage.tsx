import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useStore } from '../stores/useStore';
import { ProgressBar } from '../components/ui/ProgressBar';

const trainingMethods = [
  { id: 'describe', name: '🗣️ 描述更强的样子', desc: '你口述理想 Agent 的样子，AI 帮你实现', example: '我想要一个能带团队、能谈大客户、风格强势的销售总监', recommended: true },
  { id: 'methodology', name: '📚 注入行业标准方法论', desc: 'AI 根据岗位自动推荐行业最佳实践', example: '销售总监 → SPIN销售法、Challenger Sale、顾问式销售' },
  { id: 'case-study', name: '🏆 分析优秀案例', desc: '参考行业标杆，学习他们的长处', example: '参考阿里铁军的销售体系' },
  { id: 'knowledge', name: '📖 知识库增强', desc: '注入特定领域的专业知识', example: '注入跨境电商的行业知识' },
  { id: 'scenario', name: '🎬 场景化调优', desc: '针对具体使用场景进行优化', example: '主要用于跟供应商谈判' },
];

const TrainingModePage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const agent = useStore((state) => state.agents.find(a => a.id === id));
  const [selectedMethod, setSelectedMethod] = useState('describe');

  if (!agent) return <div>Agent not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <header className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(`/agents/${id}`)} className="text-2xl">←</button>
        <h1 className="text-2xl font-bold">训练 {agent.name} - {agent.title}</h1>
      </header>

      <div className="matrix-card mb-8 bg-gray-50 border-none">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold">当前状态</h3>
          <span className="text-matrix-green font-bold">{agent.rank} 级 · {agent.score} 分</span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <ProgressBar label="身份" value={95} />
          <ProgressBar label="灵魂" value={92} />
          <ProgressBar label="雇主" value={88} />
          <ProgressBar label="工具" value={98} />
          <ProgressBar label="协作" value={85} />
          <ProgressBar label="记忆" value={94} />
        </div>
      </div>

      <h3 className="font-bold mb-4">选择训练方式</h3>
      <div className="space-y-4 mb-8">
        {trainingMethods.map((m) => (
          <div 
            key={m.id}
            onClick={() => setSelectedMethod(m.id)}
            className={`matrix-card cursor-pointer flex justify-between items-center border-2 transition-all ${
              selectedMethod === m.id ? 'border-matrix-green bg-green-50/30' : 'border-gray-200'
            }`}
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-lg">{m.name}</span>
                {m.recommended && (
                  <span className="text-[10px] bg-matrix-green/20 text-matrix-green-dark px-1.5 py-0.5 rounded font-bold">推荐</span>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-2">{m.desc}</p>
              <p className="text-xs text-gray-400 italic">示例: "{m.example}"</p>
            </div>
            {selectedMethod === m.id && (
              <div className="text-matrix-green text-2xl">✓</div>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-between">
        <button onClick={() => navigate(`/agents/${id}`)} className="matrix-btn-secondary">取消</button>
        <button 
          onClick={() => navigate(`/agents/${id}/train/session`)}
          className="matrix-btn-primary"
        >
          开始训练 →
        </button>
      </div>
    </div>
  );
};

export default TrainingModePage;
