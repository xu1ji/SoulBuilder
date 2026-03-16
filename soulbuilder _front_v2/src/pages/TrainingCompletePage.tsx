import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle2, Sparkles, Target, Briefcase, ArrowRight, ChevronRight, Save, User } from 'lucide-react';
import { useStore } from '../stores/useStore';
import { RankBadge } from '../components/ui/RankBadge';
import { getStars } from '../utils/theme';

const TrainingCompletePage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const agent = useStore((state) => state.agents.find(a => a.id === id));
  const updateAgent = useStore((state) => state.updateAgent);
  const [confirmed, setConfirmed] = useState(false);

  if (!agent) return <div className="flex items-center justify-center h-screen">Agent not found</div>;

  const handleSave = () => {
    if (!confirmed) return;
    updateAgent(agent.id, {
      score: 98,
      status: 'trained',
      lastTrained: new Date().toISOString().split('T')[0]
    });
    navigate(`/agents/${id}`);
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-6">
          <CheckCircle2 className="w-8 h-8 text-black" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-2">Training Complete</h1>
        <p className="text-gray-500">The agent has successfully integrated new neural patterns.</p>
      </motion.div>

      <div className="space-y-8">
        {/* Comparison Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <div className="flex items-center gap-3 mb-8">
            <Sparkles className="w-5 h-5 text-black" />
            <h2 className="text-xl font-bold">Performance Evolution</h2>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-12 py-4">
            <div className="text-center">
              <div className="text-[10px] uppercase tracking-widest text-gray-400 mb-4">Baseline</div>
              <RankBadge rank={agent.rank} score={agent.score} />
              <div className="text-[10px] text-gray-400 mt-3 tracking-widest">{getStars(agent.rank)}</div>
            </div>
            
            <div className="flex flex-col items-center">
              <ArrowRight className="w-8 h-8 text-gray-200 hidden md:block" />
              <div className="md:hidden w-px h-8 bg-gray-100 my-4" />
              <div className="bg-gray-100 px-3 py-1 rounded-full text-[10px] font-bold mt-2">+12 PTS</div>
            </div>

            <div className="text-center">
              <div className="text-[10px] uppercase tracking-widest text-black font-bold mb-4">Optimized</div>
              <RankBadge rank={agent.rank} score={98} />
              <div className="text-[10px] text-gray-400 mt-3 tracking-widest">{getStars(agent.rank)}</div>
            </div>
          </div>
        </motion.div>

        {/* Insights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
          >
            <div className="flex items-center gap-3 mb-4">
              <Briefcase className="w-5 h-5 text-gray-400" />
              <h3 className="font-bold">Methodology Injection</h3>
            </div>
            <div className="space-y-2">
              {['SPIN Selling', 'Challenger Sale', 'Consultative Approach'].map((m) => (
                <div key={m} className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-1 h-1 rounded-full bg-black" />
                  {m}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="card"
          >
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-5 h-5 text-gray-400" />
              <h3 className="font-bold">Skill Reinforcement</h3>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500">Key Account Management</span>
                  <span className="font-bold text-black">+7%</span>
                </div>
                <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-black w-[92%]" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Summary Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card bg-gray-50 border-none"
        >
          <h3 className="font-bold mb-4">Training Summary</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            The training session focused on defining the "ideal state" for {agent.name}. 
            We successfully injected the standard sales methodology framework, specifically targeting 
            high-level account management and strategic negotiation. The agent's persona has been 
            refined to be more authoritative yet consultative, aligning with your request for a 
            "strong, team-leading style."
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
            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">
              <Save className="w-5 h-5 text-gray-400" />
            </div>
            <div>
              <h3 className="font-bold text-sm mb-1">Configuration Updates</h3>
              <p className="text-xs text-gray-500">The following files will be updated in the agent's core:</p>
              <div className="flex gap-2 mt-3">
                <span className="px-2 py-1 bg-gray-100 rounded text-[10px] font-mono text-gray-600">IDENTITY.md</span>
                <span className="px-2 py-1 bg-gray-100 rounded text-[10px] font-mono text-gray-600">SOUL.md</span>
              </div>
            </div>
          </div>

          <label className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 cursor-pointer group transition-all hover:bg-gray-100">
            <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${confirmed ? 'bg-black border-black' : 'border-gray-300 group-hover:border-gray-400'}`}>
              {confirmed && <CheckCircle2 className="w-4 h-4 text-white" />}
            </div>
            <input 
              type="checkbox" 
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="hidden"
            />
            <span className="text-sm text-gray-700 font-medium">I understand and confirm these modifications</span>
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
            className="btn-secondary flex-1 flex items-center justify-center gap-2"
          >
            <User className="w-4 h-4" />
            View Profile
          </button>
          <button 
            onClick={handleSave}
            disabled={!confirmed}
            className="btn-primary flex-1 flex items-center justify-center gap-2"
          >
            <ChevronRight className="w-4 h-4" />
            Confirm & Save
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default TrainingCompletePage;
