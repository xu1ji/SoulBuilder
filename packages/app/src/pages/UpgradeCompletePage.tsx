import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle2, ArrowRight, Folder, Home, Sparkles } from 'lucide-react'
import { useAppStore } from '../stores/useAppStore'

export default function UpgradeCompletePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentAgent } = useAppStore()
  const [displayScore, setDisplayScore] = useState(0)

  const beforeScore = currentAgent?.score || 85
  const afterScore = Math.min(beforeScore + 9, 100)
  const boost = afterScore - beforeScore

  // 分数跳动动画
  useEffect(() => {
    const duration = 1500
    const startTime = Date.now()
    const startValue = beforeScore

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easeOut = 1 - Math.pow(1 - progress, 3)
      setDisplayScore(Math.round(startValue + (afterScore - startValue) * easeOut))

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [beforeScore, afterScore])

  if (!currentAgent) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin w-8 h-8 border-2 border-gray-200 border-t-black rounded-full" />
      </div>
    )
  }

  const backupPath = `~/.openclaw/workspace-${currentAgent.id}/backup/${new Date().toISOString().slice(0, 16).replace(/[:-]/g, '')}`

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-lg mx-auto px-6">
        {/* 成功状态 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="w-20 h-20 bg-black rounded-full flex items-center justify-center
                       mx-auto mb-6 shadow-xl"
          >
            <CheckCircle2 className="w-10 h-10 text-white" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-gray-900 mb-2"
          >
            升级成功！
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-sm text-gray-500"
          >
            Agent 配置已成功更新
          </motion.p>
        </motion.div>

        {/* 新分数卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 text-center"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500
                            flex items-center justify-center text-white font-bold">
              {currentAgent.name[0]}
            </div>
            <div className="text-left">
              <h3 className="font-bold text-gray-900">{currentAgent.name}</h3>
              <p className="text-xs text-gray-500">{currentAgent.title}</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded bg-gradient-to-r from-violet-400 to-purple-500
                             text-white text-sm font-bold">
              {currentAgent.rank}+ 级
            </span>
            <span className="text-3xl font-bold text-gray-900">{displayScore}</span>
            <span className="text-sm text-gray-400">/100</span>
          </div>

          <div className="flex items-center justify-center gap-2">
            <span className="text-green-600 font-bold">+{boost}</span>
            <span className="text-sm text-gray-500">分提升</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
        </motion.div>

        {/* 备份信息 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-50 rounded-2xl p-5 mb-8"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0">
              <Folder className="w-5 h-5 text-gray-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-1">备份信息</h4>
              <p className="text-xs text-gray-500 mb-2">旧版本已保存到：</p>
              <code className="text-[10px] text-gray-600 bg-white px-2 py-1 rounded block break-all">
                {backupPath}/
              </code>
              <p className="text-xs text-gray-400 mt-2">
                如需回滚，可在设置中找到此备份
              </p>
            </div>
          </div>
        </motion.div>

        {/* 返回按钮 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center justify-center gap-2 py-4 bg-black
                       text-white rounded-xl text-sm font-bold
                       hover:bg-gray-800 transition-colors"
          >
            <Home size={18} />
            返回 Agent 列表
          </button>

          <button
            onClick={() => navigate(`/agents/${id}`)}
            className="w-full py-3 text-gray-500 text-sm font-medium
                       hover:text-black transition-colors mt-3"
          >
            查看 Agent 详情
          </button>
        </motion.div>
      </div>
    </div>
  )
}
