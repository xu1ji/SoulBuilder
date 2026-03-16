import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, MessageSquare, BookOpen, Trophy, Library, Clapperboard, Check, Sparkles } from 'lucide-react';
import { useStore } from '../stores/useStore';
import { ProgressBar } from '../components/ui/ProgressBar';

const trainingMethods = [
  { 
    id: 'describe', 
    name: 'Describe the Ideal', 
    icon: MessageSquare,
    desc: 'Describe your ideal agent in natural language, AI will shape it.', 
    example: 'I want a sales director who can lead teams and close big deals.', 
    recommended: true 
  },
  { 
    id: 'methodology', 
    name: 'Industry Standards', 
    icon: BookOpen,
    desc: 'Inject industry-standard methodologies based on the role.', 
    example: 'Sales Director → SPIN, Challenger Sale, Consultative Selling' 
  },
  { 
    id: 'case-study', 
    name: 'Case Analysis', 
    icon: Trophy,
    desc: 'Reference industry benchmarks and learn from their success.', 
    example: 'Reference Alibaba Iron Army sales system' 
  },
  { 
    id: 'knowledge', 
    name: 'Knowledge Base', 
    icon: Library,
    desc: 'Inject domain-specific professional knowledge.', 
    example: 'Inject cross-border e-commerce industry knowledge' 
  },
  { 
    id: 'scenario', 
    name: 'Scenario Optimization', 
    icon: Clapperboard,
    desc: 'Optimize for specific use cases and environments.', 
    example: 'Mainly used for supplier negotiations' 
  },
];

const TrainingModePage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const agent = useStore((state) => state.agents.find(a => a.id === id));
  const [selectedMethod, setSelectedMethod] = useState('describe');

  if (!agent) return <div className="flex items-center justify-center h-screen">Agent not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <header className="flex items-center gap-6 mb-12">
        <button 
          onClick={() => navigate(`/agents/${id}`)} 
          className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Training: {agent.name}</h1>
          <p className="text-sm text-gray-500">Select a methodology to refine the agent's capabilities.</p>
        </div>
      </header>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card bg-gray-50 border-none mb-12"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-gray-900">Current Status</h3>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-1 bg-black text-white rounded-md">{agent.rank}</span>
            <span className="text-sm font-bold text-black">{agent.score} PTS</span>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          <ProgressBar label="Identity" value={95} />
          <ProgressBar label="Soul" value={92} />
          <ProgressBar label="Employer" value={88} />
          <ProgressBar label="Tools" value={98} />
          <ProgressBar label="Collab" value={85} />
          <ProgressBar label="Memory" value={94} />
        </div>
      </motion.div>

      <h3 className="font-bold text-gray-900 mb-6">Training Methods</h3>
      <div className="grid gap-4 mb-12">
        {trainingMethods.map((m, index) => {
          const Icon = m.icon;
          const isSelected = selectedMethod === m.id;
          
          return (
            <motion.div 
              key={m.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedMethod(m.id)}
              className={`card cursor-pointer flex items-start gap-6 border-2 transition-all duration-200 ${
                isSelected ? 'border-black bg-gray-50' : 'border-gray-100 hover:border-gray-200'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                isSelected ? 'bg-black text-white' : 'bg-white border border-gray-100 text-gray-400'
              }`}>
                <Icon size={24} />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-bold text-lg text-gray-900">{m.name}</span>
                  {m.recommended && (
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-gray-100 rounded text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                      <Sparkles size={10} />
                      Recommended
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-500 mb-3">{m.desc}</p>
                <div className="bg-white/50 rounded-lg p-2 border border-gray-100/50">
                  <p className="text-[11px] text-gray-400 italic">Example: "{m.example}"</p>
                </div>
              </div>

              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                isSelected ? 'bg-black border-black' : 'border-gray-200'
              }`}>
                {isSelected && <Check size={14} className="text-white" />}
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="flex gap-4">
        <button 
          onClick={() => navigate(`/agents/${id}`)} 
          className="btn-secondary flex-1"
        >
          Cancel
        </button>
        <button 
          onClick={() => navigate(`/agents/${id}/train/session`)}
          className="btn-primary flex-1"
        >
          Start Training
        </button>
      </div>
    </div>
  );
};

export default TrainingModePage;
