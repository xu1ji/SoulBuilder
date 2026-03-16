import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { ArrowLeft, Share2, Zap, Target, Briefcase, Sparkles, ChevronRight } from 'lucide-react';
import { useStore } from '../stores/useStore';
import { RankBadge } from '../components/ui/RankBadge';
import { getStars } from '../utils/theme';

const DimensionBar: React.FC<{ label: string; value: number; weight: number }> = ({ label, value, weight }) => (
  <div className="flex items-center gap-4 py-3">
    <span className="w-20 text-sm font-medium text-gray-600">{label}</span>
    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
      <motion.div
        className="h-full bg-black-pure rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      />
    </div>
    <span className="w-8 text-sm font-bold text-gray-900 text-right">{value}</span>
    <span className="w-16 text-[10px] font-bold text-gray-400 text-right uppercase tracking-tighter">权重 {weight}%</span>
  </div>
);

const AgentDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const agent = useStore((state) => state.agents.find(a => a.id === id));

  if (!agent) return <div className="flex items-center justify-center h-screen">未找到 Agent</div>;

  const radarData = [
    { subject: '身份', value: agent.dimensions.identity },
    { subject: '灵魂', value: agent.dimensions.soul },
    { subject: '用户', value: agent.dimensions.user },
    { subject: '工具', value: agent.dimensions.tools },
    { subject: '协作', value: agent.dimensions.agents },
    { subject: '记忆', value: agent.dimensions.memory },
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <button 
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors mb-12 group"
      >
        <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
        <span className="text-sm font-bold uppercase tracking-widest">返回列表</span>
      </button>

      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-3xl bg-gray-100 flex items-center justify-center text-gray-400 overflow-hidden shadow-sm">
            {agent.avatar ? (
              <img src={agent.avatar} alt={agent.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-4xl font-bold text-gray-300">{agent.name[0]}</span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight">{agent.name} · {agent.title}</h1>
            </div>
            <div className="flex items-center gap-4">
              <RankBadge rank={agent.rank} score={agent.score} />
              <div className="text-sm text-gray-400 font-medium">
                上次训练: {agent.lastTrained || '从未'} · {getStars(agent.rank)}
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
            <Share2 size={16} />
            导出配置
          </button>
          <button 
            onClick={() => navigate(`/agents/${id}/train`)}
            className="btn-primary flex items-center gap-2 text-xs font-bold uppercase tracking-widest"
          >
            <Zap size={16} />
            立即训练
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        {/* Radar Chart Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-5 card flex flex-col items-center justify-center min-h-[400px]"
        >
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-8">能力维度分析</h3>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#E5E5E5" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#737373', fontSize: 12, fontWeight: 600 }} />
                <Radar
                  name="能力值"
                  dataKey="value"
                  stroke="#000000"
                  fill="#000000"
                  fillOpacity={0.05}
                  strokeWidth={2}
                  animationDuration={1500}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Assessment Details Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-7 card"
        >
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">评估详情</h3>
          <div className="space-y-1">
            <DimensionBar label="身份档案" value={agent.dimensions.identity} weight={22} />
            <DimensionBar label="灵魂深度" value={agent.dimensions.soul} weight={22} />
            <DimensionBar label="雇主信息" value={agent.dimensions.user} weight={17} />
            <DimensionBar label="工具配置" value={agent.dimensions.tools} weight={17} />
            <DimensionBar label="协作关系" value={agent.dimensions.agents} weight={11} />
            <DimensionBar label="记忆管理" value={agent.dimensions.memory} weight={11} />
          </div>
          <div className="mt-8 pt-8 border-t border-gray-100 flex items-center justify-between">
            <span className="text-gray-500 font-medium">综合评分</span>
            <span className="text-4xl font-bold text-gray-900">{agent.score} <span className="text-lg text-gray-400 font-medium">/ 100</span></span>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Configured Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <div className="flex items-center gap-3 mb-6">
            <Briefcase className="text-gray-400" size={20} />
            <h3 className="text-lg font-bold text-gray-900">已配置内容</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-black mt-2 shrink-0" />
              <p className="text-sm text-gray-600 leading-relaxed">
                <span className="font-bold text-gray-900">身份档案:</span> 姓名, 岗位, 性格特质, 沟通风格, 背景故事
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-black mt-2 shrink-0" />
              <p className="text-sm text-gray-600 leading-relaxed">
                <span className="font-bold text-gray-900">灵魂深度:</span> 使命, 价值观, 边界底线
              </p>
            </div>
          </div>
        </motion.div>

        {/* Suggestions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card bg-gray-50 border-none"
        >
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="text-black" size={20} />
            <h3 className="text-lg font-bold text-gray-900">改进建议</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
                <ChevronRight size={14} className="text-gray-400" />
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                可以添加更多行业场景细节，让 Agent 更了解你的业务
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
                <ChevronRight size={14} className="text-gray-400" />
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                建议配置更多协作关系，形成 Agent 团队协作
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AgentDetailPage;
