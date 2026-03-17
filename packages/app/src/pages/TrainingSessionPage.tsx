import { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Send, Bot, User, Loader2, CheckCircle2, Circle } from 'lucide-react'
import { useAppStore } from '../stores/useAppStore'

// 阶段名称
const PHASE_NAMES = [
  '了解阶段',
  '身份定义',
  '特质塑造',
  '能力训练',
  '整合确认',
]

// 模拟 AI 响应
const AI_RESPONSES = [
  '很好，让我先了解一下你的 Agent 使用场景。你主要是用它来做什么的？',
  '明白了。那你觉得一个好的销售总监，最重要的特质是什么？',
  '懂了。沟通风格方面，你喜欢直接一点的，还是温和委婉的？',
  '好的，最后一个问题：有什么是你绝对不能接受的吗？比如某些底线？',
  '完美！我已经收集了足够的信息。让我来为你注入 SPIN 销售法和 Challenger Sale 方法论...',
]

export default function TrainingSessionPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentAgent, currentSession, trainingFeedback, updateTrainingFeedback } = useAppStore()
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([])
  const [isTyping, setIsTyping] = useState(false)
  const [currentRound, setCurrentRound] = useState(1)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // 反馈数据
  const [collected, setCollected] = useState<string[]>([])
  const [pending] = useState(['岗位定位', '沟通风格', '行业场景', '方法论偏好', '边界底线'])

  useEffect(() => {
    // 初始 AI 消息
    if (messages.length === 0) {
      setMessages([{ role: 'assistant', content: AI_RESPONSES[0] }])
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isTyping) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])

    // 更新已收集信息
    if (currentRound <= 5) {
      const items = ['岗位定位', '沟通风格', '行业场景', '方法论偏好', '边界底线']
      setCollected(prev => [...prev, items[currentRound - 1]])
    }

    // 模拟 AI 响应
    setIsTyping(true)
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000))
    setIsTyping(false)

    const nextRound = currentRound + 1
    if (nextRound <= 5) {
      setMessages(prev => [...prev, { role: 'assistant', content: AI_RESPONSES[nextRound - 1] }])
      setCurrentRound(nextRound)
    } else {
      // 训练完成，跳转到动画页
      setMessages(prev => [...prev, { role: 'assistant', content: AI_RESPONSES[4] }])
      setTimeout(() => {
        navigate(`/agents/${id}/train/animation`)
      }, 1500)
    }
  }

  if (!currentAgent) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin w-8 h-8 border-2 border-gray-200 border-t-black rounded-full" />
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-56px)] flex flex-col bg-white">
      {/* 顶部导航 */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <button
          onClick={() => navigate(`/agents/${id}/train`)}
          className="flex items-center gap-1.5 text-gray-500 hover:text-black transition-colors"
        >
          <ArrowLeft size={16} />
          <span className="text-xs font-semibold uppercase tracking-wider">返回</span>
        </button>

        {/* 进度指示器 */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">第 {currentRound} 轮 / 共 5 轮</span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(i => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i < currentRound ? 'bg-black' :
                  i === currentRound ? 'bg-gray-400' :
                  'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* 主对话区 */}
        <div className="flex-1 flex flex-col">
          {/* 消息列表 */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="max-w-2xl mx-auto space-y-4">
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  {/* 头像 */}
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    msg.role === 'assistant'
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {msg.role === 'assistant' ? <Bot size={16} /> : <User size={16} />}
                  </div>

                  {/* 消息内容 */}
                  <div className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                    msg.role === 'assistant'
                      ? 'bg-gray-50 text-gray-800'
                      : 'bg-black text-white'
                  }`}>
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                  </div>
                </motion.div>
              ))}

              {/* AI 输入中 */}
              <AnimatePresence>
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex gap-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center">
                      <Bot size={16} />
                    </div>
                    <div className="bg-gray-50 px-4 py-3 rounded-2xl">
                      <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* 输入框 */}
          <div className="border-t border-gray-100 px-6 py-4">
            <div className="max-w-2xl mx-auto flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="输入你的回答..."
                className="flex-1 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl
                           focus:outline-none focus:ring-2 focus:ring-gray-200 text-sm"
                disabled={isTyping}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="px-4 py-3 bg-black text-white rounded-xl
                           disabled:bg-gray-100 disabled:text-gray-300
                           hover:bg-gray-800 transition-colors"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* 实时反馈区 - 新增 */}
        <div className="w-72 border-l border-gray-100 p-4 bg-gray-50/50 overflow-y-auto">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
            实时反馈
          </h3>

          {/* 已收集的信息 */}
          <div className="mb-6">
            <p className="text-xs text-gray-500 mb-2">已收集的信息</p>
            <div className="space-y-2">
              {['岗位定位', '沟通风格', '行业场景', '方法论偏好', '边界底线'].map((item, i) => (
                <div key={item} className="flex items-center gap-2">
                  {collected.includes(item) ? (
                    <CheckCircle2 size={14} className="text-green-500" />
                  ) : (
                    <Circle size={14} className="text-gray-300" />
                  )}
                  <span className={`text-xs ${
                    collected.includes(item) ? 'text-gray-700' : 'text-gray-400'
                  }`}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* AI 将自动补充 */}
          <div className="bg-white rounded-xl p-3 border border-gray-100">
            <p className="text-xs text-gray-500 mb-2">💡 AI 会自动补充</p>
            <div className="space-y-1">
              <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded">
                SPIN 销售法
              </span>
              <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded">
                大客户管理策略
              </span>
              <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded">
                Challenger Sale
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
