import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { X } from 'lucide-react';
import { useStore } from '../stores/useStore';

const TrainingSessionPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const agent = useStore((state) => state.agents.find(a => a.id === id));
  const [messages, setMessages] = useState([
    { role: 'assistant', content: `你好！我是你的训练教练。让我们一起打造更强的${agent?.title}。\n\n首先，请告诉我你希望${agent?.name}具备哪些核心特质？` }
  ]);
  const [input, setInput] = useState('');
  const [step, setStep] = useState(1);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const phases = [
    { id: 'role', label: '岗位' },
    { id: 'persona', label: '性格' },
    { id: 'method', label: '方法' },
    { id: 'business', label: '业务' },
    { id: 'polish', label: '打磨' },
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim() || isTyping) return;

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Mock AI response
    setTimeout(() => {
      setIsTyping(false);
      const aiMsg = { 
        role: 'assistant', 
        content: `收到。基于你的描述，我建议为 ${agent?.name} 注入以下特质：\n\n• 专业度：深厚的行业背景\n• 亲和力：优秀的沟通技巧\n• 执行力：结果导向的工作风格\n\n接下来，我们来聊聊他的性格细节。` 
      };
      setMessages(prev => [...prev, aiMsg]);
      setStep(prev => Math.min(prev + 1, 5));
      
      if (step >= 5) {
        setTimeout(() => {
          navigate(`/agents/${id}/train/animation`);
        }, 1500);
      }
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-white flex flex-col z-[1000]">
      {/* 顶部栏 */}
      <header className="h-14 px-4 flex items-center justify-between border-b border-gray-100 bg-white shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold text-sm">
            S
          </div>
          <span className="text-xs font-medium text-gray-600">Construct</span>

          {/* 阶段指示 */}
          <div className="hidden md:flex items-center gap-1.5 ml-4">
            {phases.map((p, i) => (
              <React.Fragment key={p.id}>
                <span className={`px-2 py-1 rounded-full text-[10px] font-medium transition-all ${
                  i + 1 === step ? 'bg-black text-white' :
                  i + 1 < step ? 'bg-gray-100 text-gray-600' : 'text-gray-300'
                }`}>
                  {i + 1 < step && '✓'}{p.label}
                </span>
                {i < phases.length - 1 && <div className="w-3 h-px bg-gray-100" />}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[10px] text-gray-400 font-medium">第 {step}/5 轮</span>
          <button onClick={() => navigate(`/agents/${id}/train`)} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={18} />
          </button>
        </div>
      </header>

      {/* 消息区域 */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 scroll-smooth">
        <div className="max-w-2xl mx-auto space-y-4">
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                m.role === 'user'
                  ? 'bg-black text-white rounded-2xl rounded-br-md'
                  : 'bg-gray-100 text-gray-900 rounded-2xl rounded-bl-md'
              }`}>
                {m.content}
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <div className="flex gap-1.5 px-4 py-3 bg-gray-100 rounded-2xl w-fit">
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-gray-400 rounded-full"
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 输入区域 */}
      <div className="p-4 border-t border-gray-100 bg-white">
        <div className="max-w-3xl mx-auto flex gap-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="请充分表达和发挥你的想象力、创造力，建议用语音自由表达效果最佳，不用怕错别字和废话，放心交给我，都会处理好..."
            rows={4}
            className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl
                       text-sm focus:bg-white focus:border-black focus:outline-none transition-all
                       resize-none leading-relaxed"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="px-6 py-3 bg-black text-white rounded-xl text-sm font-medium
                       hover:bg-gray-800 transition-colors disabled:bg-gray-100 disabled:text-gray-300
                       self-end"
          >
            发送
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrainingSessionPage;
