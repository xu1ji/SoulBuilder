import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const TrainingAnimationPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [phase, setPhase] = useState('enter');
  const [skills, setSkills] = useState<string[]>([]);

  const skillPool = [
    "I know SPIN销售法",
    "I know 团队管理",
    "I know 商务谈判",
    "I know 大客户攻坚",
    "I know 市场洞察",
    "I know 危机处理",
    "I know 跨部门协作"
  ];

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase('transfer'), 2000),
      setTimeout(() => setPhase('training'), 5000),
      setTimeout(() => setPhase('awakening'), 15000),
      setTimeout(() => navigate(`/agents/${id}/train/complete`), 18000),
    ];

    const skillInterval = setInterval(() => {
      if (phase === 'training') {
        setSkills(prev => [skillPool[Math.floor(Math.random() * skillPool.length)], ...prev].slice(0, 5));
      }
    }, 1500);

    return () => {
      timers.forEach(clearTimeout);
      clearInterval(skillInterval);
    };
  }, [phase, id, navigate]);

  const getPhaseText = () => {
    switch (phase) {
      case 'enter': return 'Entering Construct...';
      case 'transfer': return 'Transferring data...';
      case 'training': return 'Training in progress...';
      case 'awakening': return 'Awakening...';
      default: return '';
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] bg-matrix-black text-matrix-green font-mono flex flex-col items-center justify-center overflow-hidden">
      {/* Code Rain Background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i} 
            className="code-column" 
            style={{ 
              left: `${i * 5}%`, 
              animationDuration: `${Math.random() * 3 + 2}s`,
              animationDelay: `${Math.random() * 2}s`
            }}
          >
            {Math.random().toString(36).substring(2, 15)}
          </div>
        ))}
      </div>

      <div className="relative z-10 text-center">
        <div className="text-sm mb-8 tracking-[0.5em] uppercase animate-pulse">
          {getPhaseText()}
        </div>

        <div className="text-6xl font-bold mb-12 tracking-tighter">
          <pre className="leading-none">
            {`
  _______ _____            _____ _   _ _____ _   _  _____ 
 |__   __|  __ \\     /\\   |_   _| \\ | |_   _| \\ | |/ ____|
    | |  | |__) |   /  \\    | | |  \\| | | | |  \\| | |  __ 
    | |  |  _  /   / /\\ \\   | | | . \` | | | | . \` | | |_ |
    | |  | | \\ \\  / ____ \\ _| |_| |\\  |_| |_| |\\  | |__| |
    |_|  |_|  \\_\\/_/    \\_\\_____|_| \\_|_____|_| \\_|\\_____|
            `}
          </pre>
        </div>

        <div className="h-40 flex flex-col items-center justify-center">
          {phase === 'training' ? (
            <div className="space-y-2">
              {skills.map((s, i) => (
                <div key={i} className="text-lg opacity-80 animate-bounce" style={{ animationDelay: `${i * 0.1}s` }}>
                  {s}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-4xl animate-bounce">🏃</div>
          )}
        </div>
      </div>

      <button 
        onClick={() => navigate(`/agents/${id}/train/complete`)}
        className="absolute bottom-12 border border-matrix-green/50 px-6 py-2 rounded text-xs hover:bg-matrix-green hover:text-black transition-all"
      >
        跳过动画
      </button>
    </div>
  );
};

export default TrainingAnimationPage;
