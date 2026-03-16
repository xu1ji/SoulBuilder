import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../stores/useStore';

const TrainingSessionPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const agent = useStore((state) => state.agents.find(a => a.id === id));
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '你好！我是你的训练教练。让我们一起打造更强的销售总监。\n\n首先，请告诉我你希望小明具备哪些核心特质？比如沟通风格、决策方式、团队管理能力等...\n\n💡 你可以说："我希望他..."'
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

  if (!agent) return <div>Agent not found</div>;

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Mock AI response
    setTimeout(() => {
      const aiMsg = {
        role: 'assistant',
        content: `很好！我来帮你完善一下：\n\n**核心特质**\n• 团队领导力：能带领销售团队完成业绩目标\n• 强势谈判风格：在商务谈判中占据主导地位\n• 大客户攻坚：擅长开发和维护KA客户关系\n\n这样描述是否符合你的期望？\n\n📊 **实时反馈**\n+8分 身份档案（添加了核心特质）\n当前进度: ████████░░░░ 40%`
      };
      setMessages(prev => [...prev, aiMsg]);
      setStep(prev => prev + 1);
      
      if (step >= 2) {
        setTimeout(() => {
          navigate(`/agents/${id}/train/animation`);
        }, 2000);
      }
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-white flex flex-col font-sans">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🤖</span>
          <div>
            <div className="font-bold text-gray-900">{agent.name}</div>
            <div className="text-xs text-gray-500">{agent.title}</div>
          </div>
        </div>
        
        <div className="flex-1 max-w-md mx-8">
          <div className="flex justify-between text-[10px] text-gray-400 mb-1">
            <span>训练进度</span>
            <span>第 {step}/5 轮</span>
          </div>
          <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-matrix-green transition-all duration-500" 
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>

        <button 
          onClick={() => navigate(`/agents/${id}/train`)}
          className="text-sm text-gray-400 hover:text-gray-600"
        >
          退出
        </button>
      </header>

      {/* Messages Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-4 max-w-3xl ${m.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}>
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xl shrink-0">
              {m.role === 'assistant' ? '🤖' : '👤'}
            </div>
            <div className={`p-4 rounded-xl whitespace-pre-wrap text-sm leading-relaxed ${
              m.role === 'assistant' 
                ? 'bg-gray-50 border-l-4 border-matrix-green text-gray-800' 
                : 'bg-gray-100 text-gray-900'
            }`}>
              {m.content}
              {m.role === 'assistant' && m.content.includes('实时反馈') && (
                <div className="mt-4 p-3 bg-matrix-green/10 rounded-lg border border-matrix-green/20 text-matrix-green-dark font-medium">
                  ✨ 实时反馈: +8分 身份档案
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-6 bg-gray-50 border-t border-gray-100">
        <div className="max-w-3xl mx-auto relative">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="💬 输入你的想法..."
            className="w-full bg-white border-none rounded-full py-4 pl-6 pr-16 shadow-sm focus:ring-2 focus:ring-matrix-green outline-none"
          />
          <button 
            onClick={handleSend}
            className="absolute right-2 top-2 w-12 h-12 bg-matrix-green rounded-full flex items-center justify-center hover:shadow-lg transition-all active:scale-90"
          >
            <span className="text-black font-bold">↑</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrainingSessionPage;
