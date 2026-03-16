import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle2, Sparkles, Target, Briefcase, ArrowRight, ChevronRight, Save, User, Share2 } from 'lucide-react';
import { useStore } from '../stores/useStore';
import { RankBadge } from '../components/ui/RankBadge';
import { getStars } from '../utils/theme';

const TrainingCompletePage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const agent = useStore((state) => state.agents.find(a => a.id === id));
  const updateAgent = useStore((state) => state.updateAgent);
  const [confirmed, setConfirmed] = useState(false);

  if (!agent) return <div className="flex items-center justify-center h-screen">未找到 Agent</div>;

  const handleSave = () => {
    if (!confirmed) return;
    updateAgent(agent.id, {
      score: 98,
      status: 'trained',
      lastTrained: new Date().toISOString().split('T')[0]
    });
    navigate(`/agents/${id}`);
  };

  const improvements = [
    { title: '方法论注入', detail: '新增: SPIN销售法、Challenger Sale、顾问式销售' },
    { title: '技能强化', detail: '大客户关系: 85 → 92 (+7)' },
  ];

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-6 shadow-sm">
          <CheckCircle2 className="w-8 h-8 text-black-pure" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-2 text-gray-900">训练完成</h1>
        <p className="text-gray-500 font-medium">Agent 已成功集成新的神经模式与方法论。</p>
      </motion.div>

      <div className="space-y-8">
        {/* Comparison Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card bg-gray-50 border-none p-8"
        >
          <div className="text-center mb-8">
            <p className="text-lg text-gray-600 mb-2 font-medium">能力进一步提升！</p>
            <p className="text-2xl font-bold text-gray-900">
              {agent.name} <span className="text-black-pure">{agent.rank} 级</span> → <span className="text-black-pure">{agent.rank} 级</span>
              <span className="text-success ml-2 font-bold">(+2分)</span>
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-12 py-4">
            <div className="text-center">
              <div className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-4">训练前</div>
              <RankBadge rank={agent.rank} score={agent.score} />
              <div className="text-[10px] text-gray-400 mt-3 font-bold tracking-widest">{getStars(agent.rank)}</div>
            </div>
            
            <div className="flex flex-col items-center">
              <ArrowRight className="w-8 h-8 text-gray-200 hidden md:block" />
              <div className="md:hidden w-px h-8 bg-gray-100 my-4" />
            </div>

            <div className="text-center">
              <div className="text-[10px] uppercase tracking-widest text-black-pure font-bold mb-4">训练后</div>
              <RankBadge rank={agent.rank} score={98} />
              <div className="text-[10px] text-gray-400 mt-3 font-bold tracking-widest">{getStars(agent.rank)}</div>
            </div>
          </div>
        </motion.div>

        {/* Improvements */}
        <div className="space-y-4">
          {improvements.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="bg-white rounded-2xl p-6 border border-gray-100 border-l-4 border-l-black-pure shadow-sm"
            >
              <p className="font-bold text-gray-900">{item.title}</p>
              <p className="text-sm text-gray-500 mt-1 font-medium">{item.detail}</p>
            </motion.div>
          ))}
        </div>

        {/* Summary Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card bg-gray-50 border-none"
        >
          <h3 className="font-bold text-gray-900 mb-4">训练总结</h3>
          <p className="text-sm text-gray-600 leading-relaxed font-medium">
            本次训练重点定义了 {agent.name} 的“理想状态”。
            我们成功注入了标准销售方法论框架，特别针对高层账户管理和战略谈判进行了强化。
            Agent 的性格已被调整为更具权威性且兼具顾问特质，符合你对“强有力、具备团队领导力”风格的要求。
          </p>
        </motion.div>

        {/* Confirmation Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card border-gray-100"
        >
          <div className="flex items-start gap-4 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0 shadow-sm">
              <Save className="w-5 h-5 text-gray-400" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-gray-900 mb-1">配置变更确认</h3>
              <p className="text-xs text-gray-500 font-medium">将修改: IDENTITY.md, SOUL.md</p>
              <div className="flex gap-2 mt-3">
                <span className="px-2 py-1 bg-gray-100 rounded text-[10px] font-mono font-bold text-gray-600">IDENTITY.md</span>
                <span className="px-2 py-1 bg-gray-100 rounded text-[10px] font-mono font-bold text-gray-600">SOUL.md</span>
              </div>
            </div>
          </div>

          <label className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 cursor-pointer group transition-all hover:bg-gray-100">
            <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${confirmed ? 'bg-black-pure border-black-pure' : 'border-gray-300 bg-white'}`}>
              {confirmed && <CheckCircle2 className="w-4 h-4 text-white" />}
            </div>
            <input 
              type="checkbox" 
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="hidden"
            />
            <span className="text-sm text-gray-700 font-bold">我已了解，确认保存（自动备份原配置）</span>
          </label>
        </motion.div>

        {/* Actions */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <button 
            onClick={() => navigate(`/agents/${id}`)} 
            className="btn-secondary flex-1 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest"
          >
            <User className="w-4 h-4" />
            查看画像
          </button>
          <button 
            className="btn-secondary flex-1 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest"
          >
            <Share2 className="w-4 h-4" />
            导出配置
          </button>
          <button 
            onClick={handleSave}
            disabled={!confirmed}
            className="btn-primary flex-1 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest shadow-xl hover:shadow-2xl transition-all disabled:shadow-none"
          >
            <ChevronRight className="w-4 h-4" />
            确认并保存
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default TrainingCompletePage;
