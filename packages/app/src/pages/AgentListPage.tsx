import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search } from 'lucide-react'
import { useAppStore } from '../stores/useAppStore'
import { AgentCard } from '../components/AgentCard'

export default function AgentListPage() {
  const { agents, loading, fetchAgents } = useAppStore()

  useEffect(() => {
    fetchAgents()
  }, [fetchAgents])

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* 头部 */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">你的 Agent 团队</h1>
          <p className="text-sm text-gray-500 mt-1">共 {agents.length} 个 Agent</p>
        </div>

        <div className="flex items-center gap-3">
          {/* 搜索框 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索 Agent..."
              className="pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-100 rounded-xl
                         focus:outline-none focus:ring-2 focus:ring-gray-200 w-48"
            />
          </div>

          {/* 新建按钮 */}
          <button className="flex items-center gap-2 px-4 py-2 bg-black text-white
                            rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors">
            <Plus size={16} />
            新建 Agent
          </button>
        </div>
      </div>

      {/* Agent 网格 */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-2 border-gray-200 border-t-black rounded-full" />
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {agents.map((agent, index) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <AgentCard agent={agent} />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* 空状态 */}
      {!loading && agents.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4">
            <Plus className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">还没有 Agent</h3>
          <p className="text-sm text-gray-500">点击"新建 Agent"开始创建你的第一个 AI 助手</p>
        </div>
      )}
    </div>
  )
}
