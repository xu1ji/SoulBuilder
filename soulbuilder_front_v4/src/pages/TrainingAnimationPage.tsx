import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

const TrainingAnimationPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [phase, setPhase] = useState<'enter' | 'transfer' | 'training' | 'awakening'>('enter');
  const [skills, setSkills] = useState<string[]>([]);

  const skillPool = [
    "SPIN 销售法",
    "团队管理",
    "商务谈判",
    "大客户策略",
    "市场洞察",
    "危机处理",
    "跨部门协作",
    "情商领导力",
    "战略思维",
    "数据分析"
  ];

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase('transfer'), 2000),
      setTimeout(() => setPhase('training'), 4000),
      setTimeout(() => setPhase('awakening'), 12000),
      setTimeout(() => navigate(`/agents/${id}/train/complete`), 14000),
    ];

    const skillInterval = setInterval(() => {
      if (phase === 'training') {
        setSkills(prev => [skillPool[Math.floor(Math.random() * skillPool.length)], ...prev].slice(0, 6));
      }
    }, 800);

    return () => {
      timers.forEach(clearTimeout);
      clearInterval(skillInterval);
    };
  }, [phase, id, navigate]);

  const getPhaseText = () => {
    switch (phase) {
      case 'enter': return '正在接入 CONSTRUCT...';
      case 'transfer': return '正在传输神经数据...';
      case 'training': return '正在注入方法论...';
      case 'awakening': return '正在完成觉醒...';
      default: return '';
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] bg-matrix-black text-matrix-green font-mono flex flex-col items-center justify-center overflow-hidden">
      {/* Code Rain Background */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div 
            key={i} 
            className="code-column" 
            style={{ 
              left: `${i * 3.33}%`, 
              animationDuration: `${Math.random() * 2 + 1.5}s`,
              animationDelay: `${Math.random() * 2}s`,
              fontSize: `${Math.random() * 10 + 12}px`
            }}
          >
            {Math.random().toString(36).substring(2, 15).toUpperCase()}
          </div>
        ))}
      </div>

      <div className="relative z-10 w-full max-w-4xl px-8 flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs mb-12 tracking-[0.8em] uppercase text-matrix-green/70"
        >
          {getPhaseText()}
        </motion.div>

        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-4xl md:text-7xl font-bold mb-16 tracking-tighter text-center"
        >
          <pre className="leading-none inline-block text-left text-[8px] md:text-[12px]">
            {`
    ████████╗███████╗ ██████╗██████╗ ██████╗ 
    ╚══██╔══╝██╔════╝██╔════╝██╔══██╗██╔══██╗
       ██║   █████╗  ██║     ██████╔╝██████╔╝
       ██║   ██╔══╝  ██║     ██╔══██╗██╔══██╗
       ██║   ███████╗╚██████╗██║  ██║██████╔╝
       ╚═╝   ╚══════╝ ╚═════╝╚═╝  ╚═╝╚═════╝ 
            `}
          </pre>
          <div className="text-xl md:text-2xl mt-4 tracking-[0.4em] font-light">SOUL_BUILDER_v4.0</div>
        </motion.div>

        <div className="h-64 w-full flex flex-col items-center justify-start overflow-hidden">
          <AnimatePresence mode="popLayout">
            {phase === 'training' && (
              <div className="space-y-3 text-center">
                {skills.map((s, i) => (
                  <motion.div 
                    key={`${s}-${i}`}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="text-lg md:text-xl font-bold tracking-widest"
                  >
                    {`> 已掌握 ${s}`}
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
          
          {phase !== 'training' && (
            <motion.div 
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-48 h-1 bg-matrix-green/20 rounded-full overflow-hidden mt-8"
            >
              <motion.div 
                className="h-full bg-matrix-green"
                animate={{ x: [-200, 200] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              />
            </motion.div>
          )}
        </div>
      </div>

      <motion.button 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        whileHover={{ opacity: 1, scale: 1.05 }}
        onClick={() => navigate(`/agents/${id}/train/complete`)}
        className="absolute bottom-12 border border-matrix-green/30 px-8 py-3 rounded-full text-[10px] tracking-[0.3em] uppercase transition-all hover:bg-matrix-green hover:text-matrix-black hover:border-matrix-green"
      >
        跳过动画
      </motion.button>
    </div>
  );
};

export default TrainingAnimationPage;
