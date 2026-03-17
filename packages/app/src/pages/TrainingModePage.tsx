import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, MessageSquare, BookOpen, Trophy, Database, Target, Star } from 'lucide-react'
import { useAppStore } from '../stores/useAppStore'
import { TRAINING_METHODS } from '@soulbuilder/shared'

// 方法图标
const methodIcons: Record<string, React.ReactNode> = {
  describe: <MessageSquare size={20} />,
  methodology: <BookOpen size={20} />,
  'case-study': <Trophy size={20} />,
  knowledge: <Database size={20} />,
  scenario: <Target size={20} />,
}

export default function TrainingModePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentAgent, startTraining } = useAppStore()

  const handleSelectMethod = async (methodId: string) => {
    await startTraining('upgrade', methodId as any)
    navigate(`/agents/${id}/train/session`)
  }

  if (!currentAgent) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin w-8 h-8 border-2 border-gray-200 border-t-black rounded-full" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      {/* 返回按钮 */}
      <button
        onClick={() => navigate(`/agents/${id}`)}
        className="flex items-center gap-1.5 text-gray-500 hover:text-black
                   transition-colors mb-6 group"
      >
        <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
        <span className="text-xs font-semibold uppercase tracking-wider">返回详情</span>
      </button>

      {/* 标题 */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">选择训练方式</h1>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>当前 Agent：</span>
          <span className="font-semibold text-gray-700">{currentAgent.name}</span>
          <span className="text-gray-300">|</span>
          <span>{currentAgent.rank} 级 · {currentAgent.score} 分</span>
        </div>
      </div>

      {/* 训练方式列表 */}
      <div className="space-y-4">
        {TRAINING_METHODS.map((method, index) => (
          <motion.div
            key={method.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => handleSelectMethod(method.id)}
            className="bg-white rounded-2xl border border-gray-200 p-5 cursor-pointer
                       hover:border-gray-300 hover:shadow-md transition-all group"
          >
            <div className="flex items-start gap-4">
              {/* 图标 */}
              <div className="w-10 h-10 rounded-xl bg-gray-50 group-hover:bg-black
                              flex items-center justify-center text-gray-600 group-hover:text-white
                              transition-colors shrink-0">
                {methodIcons[method.id]}
              </div>

              {/* 内容 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900">{method.name}</h3>
                  {method.id === 'describe' && (
                    <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-50
                                     text-amber-700 text-[10px] font-bold rounded-full">
                      <Star size={10} />
                      推荐
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mb-2">{method.description}</p>
                <p className="text-xs text-gray-400">
                  示例：{method.example}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
