import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Send, X, Bot, User as UserIcon } from 'lucide-react';
import { useStore } from '../stores/useStore';

const phases = [
  { id: 'icebreak', label: 'Role' },
  { id: 'personality', label: 'Persona' },
  { id: 'method', label: 'Methods' },
  { id: 'scenario', label: 'Context' },
  { id: 'confirm', label: 'Finalize' },
];

const TrainingSessionPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const agent = useStore((state) => state.agents.find(a => a.id === id));
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I'm your training coach. Let's shape a more powerful version of your agent.\n\nFirst, tell me about the core traits you want for this role. Think about communication style, decision-making, and leadership approach..."
    }
  ]);
  const [input, setInput] = useState('');
  const [step, setStep] = useState(1);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (!agent) return <div className="flex items-center justify-center h-screen">Agent not found</div>;

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Mock AI response
    setTimeout(() => {
      const aiMsg = {
        role: 'assistant',
        content: `Understood. I'm refining the neural weights now:\n\n• Leadership: Driven by performance and team growth\n• Style: Authoritative yet consultative\n• Focus: High-stakes negotiation and relationship building\n\nDoes this align with your vision for ${agent.name}?`
      };
      setMessages(prev => [...prev, aiMsg]);
      setStep(prev => Math.min(prev + 1, 5));
      
      if (step >= 2) {
        setTimeout(() => {
          navigate(`/agents/${id}/train/animation`);
        }, 2500);
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-white flex flex-col">
      {/* Header */}
      <header className="h-16 px-6 flex items-center justify-between border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold text-sm">
              S
            </div>
            <span className="font-bold text-sm tracking-tight">Construct</span>
          </div>
          
          <div className="hidden md:flex items-center gap-1">
            {phases.map((p, i) => (
              <React.Fragment key={p.id}>
                <div className="flex flex-col items-center">
                  <div 
                    className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all duration-300 ${
                      i + 1 === step 
                        ? 'bg-black text-white scale-110' 
                        : i + 1 < step 
                          ? 'bg-gray-100 text-gray-400' 
                          : 'text-gray-200'
                    }`}
                  >
                    {p.label}
                  </div>
                </div>
                {i < phases.length - 1 && (
                  <div className={`w-4 h-px ${i + 1 < step ? 'bg-gray-100' : 'bg-gray-50'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Phase {step}/5
          </div>
          <button 
            onClick={() => navigate(`/agents/${id}/train`)}
            className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </header>

      {/* Messages Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-12 space-y-10 scroll-smooth">
        <div className="max-w-3xl mx-auto space-y-10">
          <AnimatePresence mode="popLayout">
            {messages.map((m, i) => (
              <motion.div 
                key={`${m.role}-${i}`}
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  m.role === 'assistant' ? 'bg-gray-100 text-gray-400' : 'bg-black text-white'
                }`}>
                  {m.role === 'assistant' ? <Bot size={16} /> : <UserIcon size={16} />}
                </div>
                
                <div className={`max-w-[80%] px-6 py-4 text-sm leading-relaxed shadow-sm ${
                  m.role === 'assistant' 
                    ? 'bg-gray-50 text-gray-900 rounded-2xl rounded-tl-none' 
                    : 'bg-black text-white rounded-2xl rounded-tr-none'
                }`}>
                  <div className="whitespace-pre-wrap">{m.content}</div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Input Area */}
      <div className="p-8 border-t border-gray-100 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="relative flex items-end gap-3">
            <div className="flex-1 relative">
              <textarea 
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Type your response..."
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-5 pl-6 pr-16 outline-none focus:border-gray-200 focus:bg-white transition-all resize-none min-h-[64px] max-h-40 text-sm"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim()}
                className="absolute right-3 bottom-3 w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center hover:bg-gray-800 transition-all disabled:bg-gray-100 disabled:text-gray-300"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
          <div className="mt-4 flex justify-between items-center px-2">
            <div className="flex gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                AI Coach is listening
              </span>
            </div>
            <span className="text-[10px] text-gray-300 font-medium">
              Enter to send · Shift + Enter for new line
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingSessionPage;
