import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

const TrainingAnimationPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [phase, setPhase] = useState('enter');
  const [skills, setSkills] = useState<string[]>([]);

  const skillPool = [
    "SPIN SELLING",
    "TEAM MANAGEMENT",
    "NEGOTIATION",
    "KEY ACCOUNT STRATEGY",
    "MARKET INSIGHTS",
    "CRISIS MANAGEMENT",
    "CROSS-FUNCTIONAL COLLAB",
    "EMOTIONAL INTELLIGENCE",
    "STRATEGIC THINKING",
    "DATA ANALYSIS"
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
      case 'enter': return 'INITIALIZING CONSTRUCT...';
      case 'transfer': return 'TRANSFERRING NEURAL DATA...';
      case 'training': return 'INJECTING METHODOLOGIES...';
      case 'awakening': return 'FINALIZING AWAKENING...';
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
          <pre className="leading-none inline-block text-left">
            {`
   _____  ____  _    _ _      
  / ____|/ __ \\| |  | | |     
 | (___ | |  | | |  | | |     
  \\___ \\| |  | | |  | | |     
  ____) | |__| | |__| | |____ 
 |_____/ \\____/ \\____/|______|
            `}
          </pre>
          <div className="text-xl md:text-2xl mt-4 tracking-[0.4em] font-light">BUILDER_v2.0</div>
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
                    {`> ${s}`}
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
        Skip Animation
      </motion.button>
    </div>
  );
};

export default TrainingAnimationPage;
