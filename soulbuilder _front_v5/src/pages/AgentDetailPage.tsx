import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { ArrowLeft, Share2, Zap, Target, Briefcase, Sparkles, ChevronRight } from 'lucide-react';
import { useStore } from '../stores/useStore';
import { RankBadge } from '../components/ui/RankBadge';

// 根据分数返回颜色
const getScoreColor = (value: number): string => {
  if (value >= 90) return 'bg-emerald-500';
  if (value >= 75) return 'bg-blue-500';
  if (value >= 60) return 'bg-amber-500';
  if (value >= 50) return 'bg-orange-500';
  return 'bg-red-500';
};

const AgentDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const agent = useStore((state) => state.agents.find(a => a.id === id));

  if (!agent) return <div className="flex items-center justify-center h-screen">未找到 Agent</div>;

  const radarData = [
    { subject: '身份', value: agent.dimensions.identity, fullMark: 100 },
    { subject: '灵魂', value: agent.dimensions.soul, fullMark: 100 },
    { subject: '用户', value: agent.dimensions.user, fullMark: 100 },
    { subject: '工具', value: agent.dimensions.tools, fullMark: 100 },
    { subject: '协作', value: agent.dimensions.agents, fullMark: 100 },
    { subject: '记忆', value: agent.dimensions.memory, fullMark: 100 },
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      {/* 返回按钮 */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-1.5 text-gray-500 hover:text-black
                   transition-colors mb-6 group"
      >
        <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
        <span className="text-xs font-semibold uppercase tracking-wider">返回</span>
      </button>

      {/* 头部信息 - 紧凑 */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          {/* 头像 */}
          <img
            src={agent.avatar}
            alt={agent.name}
            className="w-14 h-14 rounded-xl object-cover"
          />

          {/* 名称和等级 */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {agent.name} · {agent.title}
            </h1>
            <div className="flex items-center gap-3 mt-1">
              {/* 等级标签 */}
              <div className={`px-2 py-0.5 rounded bg-gradient-to-r ${
                agent.rank === 'S' ? 'from-amber-400 to-orange-500 text-white' :
                agent.rank === 'A' ? 'from-violet-400 to-purple-500 text-white' :
                'from-gray-200 to-gray-300 text-gray-700'
              } text-xs font-bold`}>
                {agent.rank} 级
              </div>
              <span className="text-sm text-gray-500">{agent.score} 分</span>
              <span className="text-xs text-gray-400">上次训练 {agent.lastTrained || '从未'}</span>
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-2">
          <button className="px-4 py-2 text-xs font-semibold text-gray-600
                            bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
            导出
          </button>
          <button
            onClick={() => navigate(`/agents/${id}/train`)}
            className="px-4 py-2 text-xs font-semibold text-white
                       bg-black rounded-xl hover:bg-gray-800 transition-colors"
          >
            训练
          </button>
        </div>
      </div>

      {/* 主体：雷达图 + 维度详情 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* 雷达图卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-5 bg-white rounded-2xl border border-gray-200 p-6"
        >
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
            能力维度
          </h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#E5E5E5" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: '#525252', fontSize: 11, fontWeight: 600 }}
                />
                <Radar
                  name="能力值"
                  dataKey="value"
                  stroke="#000000"
                  fill="#000000"
                  fillOpacity={0.06}
                  strokeWidth={2}
                  animationDuration={1000}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* 维度详情卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-7 bg-white rounded-2xl border border-gray-200 p-6"
        >
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
            评估详情
          </h3>

          <div className="space-y-4">
            <DimensionRow label="身份档案" value={agent.dimensions.identity} weight={22} />
            <DimensionRow label="灵魂深度" value={agent.dimensions.soul} weight={22} />
            <DimensionRow label="雇主信息" value={agent.dimensions.user} weight={17} />
            <DimensionRow label="工具配置" value={agent.dimensions.tools} weight={17} />
            <DimensionRow label="协作关系" value={agent.dimensions.agents} weight={11} />
            <DimensionRow label="记忆管理" value={agent.dimensions.memory} weight={11} />
          </div>

          {/* 总分 */}
          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
            <span className="text-sm text-gray-500">综合评分</span>
            <span className="text-2xl font-bold text-gray-900">{agent.score}</span>
          </div>
        </motion.div>
      </div>

      {/* 底部两列 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 已配置 */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">已配置内容</h3>
          <div className="space-y-3">
            <ConfigItem label="身份档案" items={['姓名', '岗位', '性格特质', '沟通风格']} />
            <ConfigItem label="灵魂深度" items={['使命', '价值观', '边界底线']} />
          </div>
        </div>

        {/* 建议 */}
        <div className="bg-gray-50 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">改进建议</h3>
          <div className="space-y-3">
            <SuggestionItem text="可以添加更多行业场景细节" />
            <SuggestionItem text="建议配置更多协作关系" />
          </div>
        </div>
      </div>
    </div>
  );
};

// 维度行组件
const DimensionRow: React.FC<{ label: string; value: number; weight: number }> = ({
  label, value, weight
}) => (
  <div className="flex items-center gap-3">
    <span className="text-sm text-gray-600 w-20">{label}</span>
    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
      <motion.div
        className={`h-full rounded-full ${getScoreColor(value)}`}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      />
    </div>
    <span className="text-sm font-semibold text-gray-900 w-6 text-right">{value}</span>
    <span className="text-[10px] text-gray-400 w-12 text-right">权重 {weight}%</span>
  </div>
);

// 配置项组件
const ConfigItem: React.FC<{ label: string; items: string[] }> = ({ label, items }) => (
  <div className="flex items-start gap-2">
    <div className="w-1 h-1 rounded-full bg-black mt-2 shrink-0" />
    <p className="text-sm text-gray-600">
      <span className="font-semibold text-gray-900">{label}:</span> {items.join(', ')}
    </p>
  </div>
);

// 建议项组件
const SuggestionItem: React.FC<{ text: string }> = ({ text }) => (
  <div className="flex items-start gap-2">
    <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
      <ChevronRight size={10} className="text-gray-400" />
    </div>
    <p className="text-sm text-gray-600">{text}</p>
  </div>
);

export default AgentDetailPage;
