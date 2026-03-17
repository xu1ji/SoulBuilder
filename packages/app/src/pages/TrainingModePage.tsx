import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Star } from 'lucide-react'
import { useAppStore } from '../stores/useAppStore'
import { TRAINING_METHODS } from '@soulbuilder/shared'

// 彩色渐变图标配置
const methodIconConfig: Record<string, { icon: string; gradient: string; bgLight: string }> = {
  describe: {
    icon: '💬',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    bgLight: '#f0f4ff',
  },
  methodology: {
    icon: '📚',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    bgLight: '#fff0f6',
  },
  'case-study': {
    icon: '🏆',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    bgLight: '#e6fbff',
  },
  knowledge: {
    icon: '🧠',
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    bgLight: '#fffbeb',
  },
  scenario: {
    icon: '🎯',
    gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    bgLight: '#f0fdfa',
  },
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
      <div className="space-y-3">
        {TRAINING_METHODS.map((method, index) => {
          const config = methodIconConfig[method.id] || methodIconConfig.describe

          return (
            <motion.div
              key={method.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handleSelectMethod(method.id)}
              className="bg-white rounded-2xl border border-gray-100 p-5 cursor-pointer
                         hover:border-gray-200 hover:shadow-md transition-all group"
            >
              <div className="flex items-start gap-4">
                {/* 图标 - 彩色背景 */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                  style={{ background: config.bgLight }}
                >
                  {config.icon}
                </div>

                {/* 内容 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{method.name}</h3>
                    {method.id === 'describe' && (
                      <span
                        className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full text-white"
                        style={{ background: config.gradient }}
                      >
                        <Star size={10} />
                        推荐
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mb-1">{method.description}</p>
                  <p className="text-xs text-gray-400">
                    示例：{method.example}
                  </p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
