import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { MessageSquare, BookOpen, Trophy, Library, Target, ArrowLeft, ChevronRight } from 'lucide-react';
import { useStore } from '../stores/useStore';
import { RankBadge } from '../components/ui/RankBadge';

interface TrainingMethod {
  id: string;
  name: string;
  desc: string;
  example: string;
  recommended?: boolean;
  icon: React.ElementType;
}

const trainingMethods: TrainingMethod[] = [
  {
    id: 'describe',
    name: '描述更强的样子',
    desc: '你口述理想 Agent 的样子，AI 帮你实现',
    example: '我想要一个能带团队、能谈大客户、风格强势的销售总监',
    recommended: true,
    icon: MessageSquare,
  },
  {
    id: 'methodology',
    name: '注入行业标准方法论',
    desc: 'AI 根据岗位自动推荐行业最佳实践',
    example: '销售总监 → SPIN销售法、Challenger Sale、顾问式销售',
    icon: BookOpen,
  },
  {
    id: 'case-study',
    name: '分析优秀案例',
    desc: '参考行业标杆，学习他们的长处',
    example: '参考阿里铁军的销售体系',
    icon: Trophy,
  },
  {
    id: 'knowledge',
    name: '知识库增强',
    desc: '注入特定领域的专业知识',
    example: '注入跨境电商的行业知识',
    icon: Library,
  },
  {
    id: 'scenario',
    name: '场景化调优',
    desc: '针对具体使用场景进行优化',
    example: '主要用于跟供应商谈判',
    icon: Target,
  },
];

const TrainingMethodCard: React.FC<{
  method: TrainingMethod;
  isSelected: boolean;
  onSelect: () => void;
}> = ({ method, isSelected, onSelect }) => (
  <motion.div
    whileHover={{ scale: 1.01 }}
    whileTap={{ scale: 0.99 }}
    onClick={onSelect}
    className={`
      relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200
      ${isSelected
        ? 'border-black-pure bg-gray-50 shadow-md'
        : 'border-gray-200 bg-white hover:border-gray-300'}
    `}
  >
    {/* Recommended Tag */}
    {method.recommended && (
      <span className="absolute top-4 right-12 px-2.5 py-1 bg-black-pure text-white-pure text-[10px] font-bold rounded-full uppercase tracking-widest">
        推荐
      </span>
    )}

    {/* Selection Indicator */}
    <div className={`
      absolute top-4 right-4 w-5 h-5 rounded-full border-2 flex items-center justify-center
      transition-all duration-200
      ${isSelected
        ? 'border-black-pure bg-black-pure'
        : 'border-gray-300 bg-white'}
    `}>
      {isSelected && (
        <motion.svg
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-3 h-3 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </motion.svg>
      )}
    </div>

    {/* Icon */}
    <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mb-4">
      <method.icon className="w-6 h-6 text-gray-700" />
    </div>

    {/* Content */}
    <h3 className="text-lg font-bold text-gray-900 mb-1">{method.name}</h3>
    <p className="text-sm text-gray-500 mb-4 leading-relaxed">{method.desc}</p>
    <div className="bg-white rounded-lg p-3 border border-gray-100">
      <p className="text-xs text-gray-400 italic">"{method.example}"</p>
    </div>
  </motion.div>
);

const TrainingModePage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const agent = useStore((state) => state.agents.find(a => a.id === id));
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  if (!agent) return <div className="flex items-center justify-center h-screen">未找到 Agent</div>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <button 
        onClick={() => navigate(`/agents/${id}`)}
        className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors mb-12 group"
      >
        <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
        <span className="text-sm font-bold uppercase tracking-widest">返回详情</span>
      </button>

      <header className="mb-16">
        <div className="flex items-center gap-6 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 overflow-hidden shadow-sm">
            {agent.avatar ? (
              <img src={agent.avatar} alt={agent.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl font-bold text-gray-300">{agent.name[0]}</span>
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">选择训练模式</h1>
            <p className="text-gray-500 font-medium">为 {agent.name} 选择最适合的进化路径</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
          <RankBadge rank={agent.rank} score={agent.score} />
          <div className="h-10 w-px bg-gray-200" />
          <div className="flex-1">
            <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
              <span>当前状态</span>
              <span>{agent.score}% 进化程度</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${agent.score}%` }}
                className="h-full bg-black-pure"
              />
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        {trainingMethods.map((method) => (
          <TrainingMethodCard
            key={method.id}
            method={method}
            isSelected={selectedMethod === method.id}
            onSelect={() => setSelectedMethod(method.id)}
          />
        ))}
      </div>

      <div className="flex justify-center">
        <button 
          disabled={!selectedMethod}
          onClick={() => navigate(`/agents/${id}/train/session`)}
          className="btn-primary w-full max-w-md flex items-center justify-center gap-3 py-4 text-sm font-bold uppercase tracking-widest shadow-xl hover:shadow-2xl transition-all disabled:shadow-none"
        >
          开始训练
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default TrainingModePage;
