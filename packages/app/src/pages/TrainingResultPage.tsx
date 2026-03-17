import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react'
import { useAppStore } from '../stores/useAppStore'

export default function TrainingResultPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentAgent } = useAppStore()

  const beforeScore = currentAgent?.score || 85
  const afterScore = Math.min(beforeScore + 9, 100)
  const skills = ['SPIN 销售法', 'Challenger Sale', '大客户管理策略', 'Pipeline Management']

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-2xl mx-auto px-6">
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-black
                          rounded-2xl mb-4 shadow-xl">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">训练完成</h1>
          <p className="text-sm text-gray-500">Agent 已成功集成新的神经模式</p>
        </motion.div>

        {/* Before/After 对比 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-gray-200 p-6 mb-8"
        >
          <div className="flex items-center justify-between">
            {/* Before */}
            <div className="flex-1 text-center">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                训练前
              </p>
              <div className="text-4xl font-bold text-gray-300">{beforeScore}</div>
              <p className="text-xs text-gray-400 mt-1">{currentAgent?.rank} 级</p>
            </div>

            {/* Arrow */}
            <div className="px-4">
              <ArrowRight className="w-6 h-6 text-gray-300" />
            </div>

            {/* After */}
            <div className="flex-1 text-center">
              <p className="text-xs font-bold text-black uppercase tracking-widest mb-2">
                训练后
              </p>
              <div className="text-4xl font-bold text-black">{afterScore}</div>
              <p className="text-xs text-black font-semibold mt-1">{currentAgent?.rank} 级</p>
            </div>
          </div>

          {/* 提升幅度 */}
          <div className="mt-6 pt-4 border-t border-gray-100 text-center">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50
                            text-green-700 text-sm font-bold rounded-full">
              +{afterScore - beforeScore} 分提升
            </span>
          </div>
        </motion.div>

        {/* 新增技能 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-gray-200 p-6 mb-8"
        >
          <h3 className="text-sm font-bold text-gray-900 mb-4">新增技能</h3>
          <div className="space-y-3">
            {skills.map((skill, index) => (
              <motion.div
                key={skill}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
              >
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium text-gray-700">{skill}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 操作按钮 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-3"
        >
          <button
            onClick={() => navigate(`/agents/${id}/train/confirm`)}
            className="w-full py-4 bg-black text-white rounded-xl text-sm font-bold
                       hover:bg-gray-800 transition-colors"
          >
            继续保存配置
          </button>
          <button
            onClick={() => navigate(`/agents/${id}`)}
            className="w-full py-3 text-gray-500 text-sm font-medium hover:text-black transition-colors"
          >
            暂不保存，返回详情
          </button>
        </motion.div>
      </div>
    </div>
  )
}
