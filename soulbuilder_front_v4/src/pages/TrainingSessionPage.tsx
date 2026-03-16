import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Send, X, Bot, User as UserIcon, ChevronRight } from 'lucide-react';
import { useStore } from '../stores/useStore';

const phases = [
  { id: 'definition', label: '岗位定义' },
  { id: 'personality', label: '性格塑造' },
  { id: 'methodology', label: '方法论' },
  { id: 'business', label: '业务对齐' },
  { id: 'polish', label: '细节打磨' },
];

const MessageBubble: React.FC<{ message: { role: string; content: string }; isStreaming?: boolean }> = ({ message, isStreaming }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className={`flex gap-4 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
  >
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
      message.role === 'assistant' ? 'bg-gray-100 text-gray-400' : 'bg-black-pure text-white-pure'
    }`}>
      {message.role === 'assistant' ? <Bot size={20} /> : <UserIcon size={20} />}
    </div>
    
    <div className={`max-w-[80%] px-6 py-4 text-sm leading-relaxed shadow-sm ${
      message.role === 'assistant' 
        ? 'bg-gray-50 text-gray-900 rounded-2xl rounded-tl-none' 
        : 'bg-black-pure text-white-pure rounded-2xl rounded-tr-none'
    }`}>
      <div className="whitespace-pre-wrap">
        {message.content}
        {isStreaming && (
          <motion.span
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="inline-block w-1 h-4 bg-gray-400 ml-0.5 align-middle"
          />
        )}
      </div>
    </div>
  </motion.div>
);

const TypingIndicator = () => (
  <div className="flex gap-1.5 px-4 py-3 bg-gray-100 rounded-2xl rounded-bl-md w-fit shadow-sm">
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        className="w-2 h-2 bg-gray-400 rounded-full"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
      />
    ))}
  </div>
);

const TrainingSessionPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const agent = useStore((state) => state.agents.find(a => a.id === id));
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "你好！我是你的训练教练。让我们一起打造更强的销售总监。\n\n首先，请告诉我你希望小明具备哪些核心特质？你可以描述他的沟通风格、决策方式或领导力表现..."
    }
  ]);
  const [input, setInput] = useState('');
  const [step, setStep] = useState(1);
  const [isAITyping, setIsAITyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isAITyping]);

  if (!agent) return <div className="flex items-center justify-center h-screen">未找到 Agent</div>;

  const handleSend = () => {
    if (!input.trim() || isAITyping) return;

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsAITyping(true);

    // Mock AI response
    setTimeout(() => {
      setIsAITyping(false);
      const aiMsg = {
        role: 'assistant',
        content: `很好！我来帮你完善一下：\n\n核心特质：\n• 团队领导力：能带领销售团队完成业绩目标\n• 强势谈判风格：在商务谈判中占据主导地位\n• 大客户攻坚：擅长开发和维护 KA 客户关系\n\n这些特质是否符合你对 ${agent.name} 的期望？`
      };
      setMessages(prev => [...prev, aiMsg]);
      setStep(prev => Math.min(prev + 1, 5));
      
      if (step >= 5) {
        setTimeout(() => {
          navigate(`/agents/${id}/train/animation`);
        }, 2000);
      }
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-white flex flex-col">
      {/* Header */}
      <header className="h-16 px-6 flex items-center justify-between border-b border-gray-100 shrink-0 bg-white/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-black-pure rounded-lg flex items-center justify-center text-white-pure font-bold text-sm shadow-md">
              S
            </div>
            <span className="font-bold text-sm tracking-tight">Construct 空间</span>
          </div>
          
          <div className="hidden lg:flex items-center gap-2">
            {phases.map((p, i) => (
              <React.Fragment key={p.id}>
                <div 
                  className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all duration-300 ${
                    i + 1 === step 
                      ? 'bg-black-pure text-white-pure scale-110 shadow-lg' 
                      : i + 1 < step 
                        ? 'bg-gray-100 text-gray-600' 
                        : 'text-gray-300'
                  }`}
                >
                  {i + 1 < step && '✓ '}{p.label}
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
            第 {step}/5 轮
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
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-12 space-y-10 scroll-smooth bg-white">
        <div className="max-w-3xl mx-auto space-y-10">
          <AnimatePresence mode="popLayout">
            {messages.map((m, i) => (
              <MessageBubble key={`${m.role}-${i}`} message={m} />
            ))}
            {isAITyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 shadow-sm text-gray-400">
                  <Bot size={20} />
                </div>
                <TypingIndicator />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Input Area */}
      <div className="p-8 border-t border-gray-100 bg-white/80 backdrop-blur-md">
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
                placeholder="输入你的回答..."
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-5 pl-6 pr-16 outline-none focus:border-black-pure focus:bg-white transition-all resize-none min-h-[64px] max-h-40 text-sm shadow-inner"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isAITyping}
                className="absolute right-3 bottom-3 w-10 h-10 bg-black-pure text-white-pure rounded-xl flex items-center justify-center hover:bg-gray-800 transition-all disabled:bg-gray-100 disabled:text-gray-300 shadow-lg"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
          <div className="mt-4 flex justify-between items-center px-2">
            <div className="flex gap-2 items-center">
              <div className="w-1.5 h-1.5 rounded-full bg-black-pure animate-pulse" />
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                AI 教练正在倾听
              </span>
            </div>
            <span className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">
              Enter 发送 · Shift + Enter 换行
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingSessionPage;
