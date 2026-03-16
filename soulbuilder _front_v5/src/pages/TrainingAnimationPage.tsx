import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

const TrainingAnimationPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [phase, setPhase] = useState<'init' | 'sync' | 'evolve' | 'done'>('init');
  const [logs, setLogs] = useState<string[]>([]);

  const logPool = [
    "注入 SPIN 销售模型...",
    "同步 团队管理 神经元...",
    "优化 商务谈判 逻辑链...",
    "加载 大客户 策略库...",
    "校准 市场洞察 维度...",
    "重构 危机处理 模块...",
    "强化 战略思维 核心...",
    "激活 情商领导力 协议..."
  ];

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase('sync'), 1500),
      setTimeout(() => setPhase('evolve'), 3000),
      setTimeout(() => setPhase('done'), 10000),
      setTimeout(() => navigate(`/agents/${id}/train/complete`), 11500),
    ];

    const logInterval = setInterval(() => {
      if (phase === 'evolve') {
        setLogs(prev => [logPool[Math.floor(Math.random() * logPool.length)], ...prev].slice(0, 5));
      }
    }, 600);

    return () => {
      timers.forEach(clearTimeout);
      clearInterval(logInterval);
    };
  }, [phase, id, navigate]);

  return (
    <div className="fixed inset-0 bg-black text-[#00FF41] font-mono flex flex-col items-center justify-center z-[2000] overflow-hidden">
      {/* 背景矩阵 */}
      <div className="absolute inset-0 opacity-5 pointer-events-none select-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="absolute top-0 text-[10px] whitespace-nowrap animate-matrix-fall" style={{ left: `${i * 5}%`, animationDelay: `${Math.random() * 2}s` }}>
            {Array(50).fill(0).map(() => Math.random() > 0.5 ? '1' : '0').join('')}
          </div>
        ))}
      </div>

      <div className="relative z-10 w-full max-w-lg px-6 text-center">
        {/* 状态 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[10px] tracking-[0.4em] uppercase mb-12 opacity-60"
        >
          {phase === 'init' && 'Initializing Construct...'}
          {phase === 'sync' && 'Syncing Neural Data...'}
          {phase === 'evolve' && 'Evolving Agent Core...'}
          {phase === 'done' && 'Evolution Complete.'}
        </motion.div>

        {/* 核心动画 */}
        <div className="relative h-40 flex items-center justify-center mb-16">
          <motion.div
            animate={{ 
              scale: phase === 'evolve' ? [1, 1.1, 1] : 1,
              rotate: phase === 'evolve' ? [0, 90, 180, 270, 360] : 0
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="w-24 h-24 border border-[#00FF41] rounded-full flex items-center justify-center"
          >
            <div className="w-16 h-16 border border-[#00FF41]/30 rounded-full animate-pulse" />
          </motion.div>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold tracking-tighter">SOUL v5.0</span>
          </div>
        </div>

        {/* 日志流 */}
        <div className="h-32 overflow-hidden">
          <AnimatePresence mode="popLayout">
            {logs.map((log, i) => (
              <motion.div
                key={log + i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-xs mb-2 opacity-80"
              >
                {`> ${log}`}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* 进度条 */}
        <div className="mt-8 w-48 h-0.5 bg-[#00FF41]/10 mx-auto rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-[#00FF41]"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 10, ease: "linear" }}
          />
        </div>
      </div>

      {/* 跳过 */}
      <button
        onClick={() => navigate(`/agents/${id}/train/complete`)}
        className="absolute bottom-10 text-[10px] tracking-widest opacity-40 hover:opacity-100 transition-opacity uppercase"
      >
        Skip Animation
      </button>
    </div>
  );
};

export default TrainingAnimationPage;
