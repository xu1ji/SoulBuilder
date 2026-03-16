import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle2, ArrowRight, ChevronRight, Save, User, Share2 } from 'lucide-react';
import { useStore } from '../stores/useStore';

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
      score: Math.min(agent.score + 2, 100),
      status: 'trained',
      lastTrained: new Date().toISOString().split('T')[0]
    });
    navigate(`/agents/${id}`);
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      {/* 成功状态 */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center mb-12"
      >
        <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
          <CheckCircle2 className="text-white" size={32} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">训练已完成</h1>
        <p className="text-sm text-gray-500">Agent 已成功集成新的神经模式</p>
      </motion.div>

      {/* 进化对比 */}
      <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100">
        <div className="flex items-center justify-between mb-8">
          <div className="text-center flex-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">训练前</p>
            <div className="text-2xl font-bold text-gray-400">{agent.score}</div>
          </div>
          <ArrowRight className="text-gray-300" size={20} />
          <div className="text-center flex-1">
            <p className="text-[10px] font-bold text-black uppercase tracking-widest mb-2">训练后</p>
            <div className="text-2xl font-bold text-black">{Math.min(agent.score + 2, 100)}</div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-white rounded-xl border border-gray-100">
            <span className="text-xs font-medium text-gray-600">方法论注入</span>
            <span className="text-xs font-bold text-black">SPIN 销售法</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-white rounded-xl border border-gray-100">
            <span className="text-xs font-medium text-gray-600">性格调整</span>
            <span className="text-xs font-bold text-black">权威型 + 顾问式</span>
          </div>
        </div>
      </div>

      {/* 确认保存 */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
            <Save size={20} className="text-gray-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-1">配置变更确认</h3>
            <p className="text-xs text-gray-500">将修改 IDENTITY.md 和 SOUL.md</p>
          </div>
        </div>

        <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
          <input 
            type="checkbox" 
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
          />
          <span className="text-xs font-semibold text-gray-700">我已了解，确认保存并自动备份</span>
        </label>
      </div>

      {/* 操作按钮 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <button onClick={() => navigate(`/agents/${id}`)} className="flex items-center justify-center gap-2 py-3 bg-white border border-gray-200 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-gray-50 transition-all">
          <User size={14} />
          查看画像
        </button>
        <button className="flex items-center justify-center gap-2 py-3 bg-white border border-gray-200 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-gray-50 transition-all">
          <Share2 size={14} />
          导出配置
        </button>
        <button 
          onClick={handleSave}
          disabled={!confirmed}
          className="col-span-2 sm:col-span-1 flex items-center justify-center gap-2 py-3 bg-black text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-gray-800 transition-all disabled:bg-gray-100 disabled:text-gray-300"
        >
          确认保存
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default TrainingCompletePage;
