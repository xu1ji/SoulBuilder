import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Check } from 'lucide-react';
import { useStore } from '../stores/useStore';

// 彩色图标配置
const methodIconConfig: Record<string, { icon: string; gradient: string; bgLight: string }> = {
  describe: {
    icon: '💬',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    bgLight: '#f0f4ff',
  },
  methodology: {
    icon: '📚',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    bgLight: '#fff0f6',
  },
  'case-study': {
    icon: '🏆',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    bgLight: '#e6fbff',
  },
  knowledge: {
    icon: '🧠',
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    bgLight: '#fffbeb',
  },
  scenario: {
    icon: '🎯',
    gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    bgLight: '#f0fdfa',
  },
};

const TrainingModePage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const agent = useStore((state) => state.agents.find(a => a.id === id));
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  if (!agent) return <div className="flex items-center justify-center h-screen">未找到 Agent</div>;

  const methods = [
    { id: 'describe', name: '描述更强的样子', desc: '口述理想 Agent 的样子，AI 帮你实现', recommended: true },
    { id: 'methodology', name: '注入方法论', desc: 'AI 根据岗位自动推荐行业最佳实践' },
    { id: 'case-study', name: '分析优秀案例', desc: '参考行业标杆，学习他们的长处' },
    { id: 'knowledge', name: '知识库增强', desc: '注入特定领域的专业知识' },
    { id: 'scenario', name: '场景化调优', desc: '针对具体使用场景进行优化' },
  ];

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      {/* 返回 */}
      <button onClick={() => navigate(`/agents/${id}`)} className="flex items-center gap-1.5 text-gray-500 hover:text-black mb-8 group">
        <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
        <span className="text-xs font-semibold uppercase tracking-wider">返回</span>
      </button>

      {/* 头部 */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">选择训练方式</h1>
        <p className="text-sm text-gray-500">为 {agent.name} 选择进化路径</p>
      </div>

      {/* 当前状态 */}
      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-8">
        <div className={`px-2 py-0.5 rounded text-xs font-bold ${
          agent.rank === 'S' ? 'bg-amber-100 text-amber-700' :
          agent.rank === 'A' ? 'bg-violet-100 text-violet-700' :
          'bg-gray-200 text-gray-700'
        }`}>
          {agent.rank} 级
        </div>
        <span className="text-sm font-semibold text-gray-700">{agent.score} 分</span>
        <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-black" 
            initial={{ width: 0 }}
            animate={{ width: `${agent.score}%` }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </div>

      {/* 方法卡片 - 紧凑版 */}
      <div className="space-y-3 mb-8">
        {methods.map((method) => {
          const config = methodIconConfig[method.id]

          return (
            <motion.div
              key={method.id}
              whileHover={{ scale: 1.005 }}
              whileTap={{ scale: 0.995 }}
              onClick={() => setSelectedMethod(method.id)}
              className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${
                selectedMethod === method.id
                  ? 'border-black bg-gray-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                {/* 彩色图标 */}
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 text-xl"
                  style={{ background: config.bgLight }}
                >
                  {config.icon}
                </div>

                {/* 内容 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-gray-900">{method.name}</h3>
                    {method.recommended && (
                      <span
                        className="px-1.5 py-0.5 text-white text-[9px] font-bold rounded"
                        style={{ background: config.gradient }}
                      >
                        推荐
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{method.desc}</p>
                </div>

                {/* 选中指示 */}
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                  selectedMethod === method.id ? 'border-black bg-black' : 'border-gray-300'
                }`}>
                  {selectedMethod === method.id && (
                    <Check size={12} className="text-white" />
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* 开始按钮 */}
      <button
        disabled={!selectedMethod}
        onClick={() => navigate(`/agents/${id}/train/session`)}
        className="w-full py-3 bg-black text-white text-sm font-semibold rounded-xl
                   hover:bg-gray-800 transition-colors disabled:bg-gray-200 disabled:text-gray-400"
      >
        开始训练
      </button>
    </div>
  );
};

export default TrainingModePage;
