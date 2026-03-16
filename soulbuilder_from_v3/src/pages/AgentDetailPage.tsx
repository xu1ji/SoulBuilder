import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Download, Zap } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { useStore } from '../stores/useStore';
import { RankBadge } from '../components/ui/RankBadge';
import { ProgressBar } from '../components/ui/ProgressBar';

const AgentDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const agent = useStore((state) => state.agents.find(a => a.id === id));

  if (!agent) return <div>Agent not found</div>;

  const assessment = {
    dimensions: [
      { subject: '身份档案', value: agent.dimensions.identity, weight: 22 },
      { subject: '灵魂深度', value: agent.dimensions.soul, weight: 22 },
      { subject: '雇主信息', value: agent.dimensions.user, weight: 17 },
      { subject: '工具配置', value: agent.dimensions.tools, weight: 17 },
      { subject: '协作关系', value: agent.dimensions.agents, weight: 11 },
      { subject: '记忆管理', value: agent.dimensions.memory, weight: 11 },
    ],
    details: {
      identityFields: ['姓名', '岗位', '性格特质', '沟通风格', '背景故事'],
      soulFields: ['使命', '价值观', '边界底线'],
      userFields: ['行业', '场景', '目标'],
      suggestions: [
        '可以添加更多行业场景细节，让 Agent 更了解你的业务',
        '建议为 Agent 配置更多协作关系，形成 Agent 团队协作'
      ]
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <header className="flex justify-between items-center mb-12">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate('/')} 
            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-4">
            {agent.avatar ? (
              <img src={agent.avatar} alt={agent.name} className="w-12 h-12 rounded-xl object-cover" />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg">
                {agent.name[0]}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{agent.name} · {agent.title}</h1>
              <p className="text-sm text-gray-500">{agent.rank} 级 · {agent.score} 分 · 上次训练 {agent.lastTrained || '从未训练'}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary flex items-center gap-2">
            <Download size={18} />
            导出
          </button>
          <Link to={`/agents/${agent.id}/train`} className="btn-primary flex items-center gap-2">
            <Zap size={18} />
            训练
          </Link>
        </div>
      </header>

      <div className="grid lg:grid-cols-5 gap-8 mb-12">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 card h-[400px] flex flex-col"
        >
          <h3 className="font-bold text-gray-900 mb-4">能力画像</h3>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={assessment.dimensions}>
                <PolarGrid stroke="#E5E7EB" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#6B7280', fontSize: 12 }} />
                <Radar
                  name={agent.name}
                  dataKey="value"
                  stroke="#000000"
                  fill="#000000"
                  fillOpacity={0.1}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-3 card"
        >
          <h3 className="font-bold text-gray-900 mb-8">评估详情</h3>
          <div className="space-y-8">
            {assessment.dimensions.map((dim) => (
              <div key={dim.subject}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-bold text-gray-700">{dim.subject}</span>
                  <span className="text-gray-400">权重 {dim.weight}%</span>
                </div>
                <ProgressBar value={dim.value} showValue />
              </div>
            ))}
          </div>
          <div className="mt-10 pt-6 border-t border-gray-100 flex justify-between items-center">
            <span className="text-gray-500 font-medium">综合评估得分</span>
            <span className="text-3xl font-bold text-black">{agent.score} 分</span>
          </div>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="card">
          <h3 className="font-bold text-gray-900 mb-6">已配置内容</h3>
          <div className="space-y-6">
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">身份档案</h4>
              <div className="flex flex-wrap gap-2">
                {assessment.details.identityFields.map(f => (
                  <span key={f} className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-600">{f}</span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">灵魂深度</h4>
              <div className="flex flex-wrap gap-2">
                {assessment.details.soulFields.map(f => (
                  <span key={f} className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-600">{f}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="font-bold text-gray-900 mb-6">改进建议</h3>
          <ul className="space-y-4">
            {assessment.details.suggestions.map((s, i) => (
              <li key={i} className="flex gap-4 text-sm text-gray-600 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-black mt-2 shrink-0" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AgentDetailPage;
