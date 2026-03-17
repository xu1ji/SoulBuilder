import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, AlertTriangle, ArrowLeft, Save } from 'lucide-react'
import { useAppStore } from '../stores/useAppStore'

export default function SaveConfirmPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentAgent, updateAgent } = useAppStore()
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const beforeScore = currentAgent?.score || 85
  const afterScore = Math.min(beforeScore + 9, 100)
  const skills = ['SPIN 销售法', 'Challenger Sale', '大客户管理策略']

  // 主操作：立即升级
  const handleUpgrade = async () => {
    setIsSaving(true)
    // 模拟保存
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsSaving(false)
    navigate(`/agents/${id}/train/done`)
  }

  // 次操作：暂不升级
  const handleSkip = () => {
    setShowConfirmDialog(true)
  }

  // 确认放弃
  const handleConfirmSkip = () => {
    navigate(`/agents/${id}`)
  }

  // 继续升级
  const handleContinueUpgrade = () => {
    setShowConfirmDialog(false)
  }

  if (!currentAgent) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin w-8 h-8 border-2 border-gray-200 border-t-black rounded-full" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-lg mx-auto px-6">
        {/* 成功状态 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-8"
        >
          <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
            <Check className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">训练已完成！</h1>
          <p className="text-sm text-gray-500">
            {currentAgent.name} 从 {currentAgent.rank} 级 升级到 {currentAgent.rank}+ 级
          </p>
          <p className="text-sm text-gray-500">
            能力值 {beforeScore} → {afterScore} (+{afterScore - beforeScore})
          </p>
        </motion.div>

        {/* 配置变更预览 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-gray-200 p-5 mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
              <Save className="w-5 h-5 text-gray-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">配置变更确认</h3>
              <p className="text-xs text-gray-500">将修改以下配置文件</p>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <FileChangeItem file="IDENTITY.md" change="新增沟通风格描述、方法论引用" />
            <FileChangeItem file="SOUL.md" change="新增大客户服务的使命宣言" />
            <FileChangeItem file="USER.md" change="新增对「数据驱动」风格的适配" />
            <FileChangeItem file="TOOLS.md" change="无变更" noChange />
            <FileChangeItem file="AGENTS.md" change="无变更" noChange />
          </div>

          <div className="pt-3 border-t border-gray-100 text-xs text-gray-400">
            💾 升级时自动备份当前版本到 backup/ 目录
          </div>
        </motion.div>

        {/* 操作按钮 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          {/* 主按钮：立即升级 */}
          <button
            onClick={handleUpgrade}
            disabled={isSaving}
            className="w-full flex items-center justify-center gap-2 py-4 bg-black
                       text-white rounded-xl text-sm font-bold
                       hover:bg-gray-800 transition-colors
                       disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                正在保存...
              </>
            ) : (
              <>
                <Check size={18} />
                立即升级到新版本
              </>
            )}
          </button>

          {/* 次按钮：暂不升级 */}
          <button
            onClick={handleSkip}
            className="w-full py-2 text-gray-400 text-xs font-medium
                       hover:text-gray-600 transition-colors"
          >
            暂不升级
          </button>
        </motion.div>
      </div>

      {/* 二次确认弹窗 */}
      <AnimatePresence>
        {showConfirmDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setShowConfirmDialog(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
            >
              {/* 警告图标 */}
              <div className="flex items-center justify-center w-12 h-12 bg-amber-50
                              rounded-xl mx-auto mb-4">
                <AlertTriangle className="w-6 h-6 text-amber-500" />
              </div>

              <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
                确认放弃？
              </h3>

              <p className="text-sm text-gray-600 text-center mb-4">
                你刚才的训练内容将不会保存，Agent 配置保持不变。
              </p>

              {/* 将丢失的内容 */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <p className="text-xs text-gray-500 mb-2">这次训练的成果包括：</p>
                <div className="space-y-1">
                  {skills.map(skill => (
                    <p key={skill} className="text-xs text-gray-700">• {skill}</p>
                  ))}
                </div>
              </div>

              <p className="text-xs text-gray-500 text-center mb-6">
                如果放弃，这些内容将丢失，需要重新训练。
              </p>

              {/* 按钮组 */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleContinueUpgrade}
                  className="py-3 bg-black text-white rounded-xl text-sm font-bold
                             hover:bg-gray-800 transition-colors"
                >
                  继续训练，我要升级
                </button>
                <button
                  onClick={handleConfirmSkip}
                  className="py-3 border-2 border-red-200 text-red-500 rounded-xl
                             text-sm font-bold hover:bg-red-50 transition-colors"
                >
                  确认放弃
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// 文件变更项
function FileChangeItem({
  file,
  change,
  noChange = false,
}: {
  file: string
  change: string
  noChange?: boolean
}) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className={`font-mono ${noChange ? 'text-gray-400' : 'text-gray-700'}`}>
        {file}
      </span>
      <span className={noChange ? 'text-gray-400' : 'text-gray-500'}>
        {change}
      </span>
    </div>
  )
}
