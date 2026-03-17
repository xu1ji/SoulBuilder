import { memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts'
import type { Agent } from '@soulbuilder/shared'

// 等级渐变配色
const rankGradients: Record<string, string> = {
  S: 'from-amber-400 to-orange-500',
  A: 'from-violet-400 to-purple-500',
  B: 'from-blue-400 to-cyan-500',
  C: 'from-gray-300 to-gray-400',
  D: 'from-gray-200 to-gray-300',
  E: 'from-gray-100 to-gray-200',
}

// 状态文案
const statusLabels: Record<string, { text: string; color: string }> = {
  new: { text: '新 Agent', color: 'text-blue-600 bg-blue-50' },
  trained: { text: '已训练', color: 'text-gray-600 bg-gray-50' },
  upgradable: { text: '可升级 ↑', color: 'text-green-600 bg-green-50' },
}

interface AgentCardProps {
  agent: Agent
}

export const AgentCard = memo(function AgentCard({ agent }: AgentCardProps) {
  const navigate = useNavigate()
  const statusInfo = statusLabels[agent.status] || statusLabels.trained

  // 雷达图数据
  const radarData = [
    { subject: '身份', value: agent.score - 3, fullMark: 100 },
    { subject: '灵魂', value: agent.score + 2, fullMark: 100 },
    { subject: '用户', value: agent.score - 8, fullMark: 100 },
    { subject: '工具', value: agent.score - 1, fullMark: 100 },
    { subject: '协作', value: agent.score + 1, fullMark: 100 },
    { subject: '记忆', value: agent.score - 5, fullMark: 100 },
  ]

  const handleClick = () => {
    navigate(`/agents/${agent.id}`)
  }

  return (
    <motion.div
      onClick={handleClick}
      className="relative bg-white rounded-2xl border border-gray-100 p-5 cursor-pointer
                 hover:border-gray-200 hover:shadow-lg transition-all duration-200"
      whileHover={{ y: -2 }}
    >
      {/* 等级角标 */}
      <div className="absolute -top-1 -right-1 z-10">
        <div className={`p-[2px] rounded-lg bg-gradient-to-br ${rankGradients[agent.rank]}`}>
          <div className="bg-white rounded-[6px] px-2 py-1 text-center min-w-[44px]">
            <div className="text-sm font-bold text-gray-900 leading-none">{agent.rank}</div>
            <div className="text-[9px] text-gray-500 font-medium mt-0.5">{agent.score}</div>
          </div>
        </div>
      </div>

      {/* 头部信息 */}
      <div className="flex items-center gap-3 mb-4 pr-12">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500
                        flex items-center justify-center text-white font-bold text-sm">
          {agent.name[0]}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{agent.name}</h3>
          <p className="text-xs text-gray-500 truncate">{agent.title}</p>
        </div>
      </div>

      {/* 雷达图 - 方形容器 */}
      <div className="w-[160px] h-[160px] shrink-0 mx-auto mb-4">
        <ResponsiveContainer width={160} height={160}>
          <RadarChart cx="50%" cy="50%" outerRadius="65%" data={radarData}>
            <PolarGrid stroke="#E5E5E5" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: '#525252', fontSize: 9, fontWeight: 500 }}
            />
            <Radar
              name="能力值"
              dataKey="value"
              stroke="#000000"
              fill="#000000"
              fillOpacity={0.06}
              strokeWidth={1.5}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* 维度迷你条 - 2列布局 */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4">
        <DimensionMiniBar label="身份" value={radarData[0].value} />
        <DimensionMiniBar label="灵魂" value={radarData[1].value} />
        <DimensionMiniBar label="用户" value={radarData[2].value} />
        <DimensionMiniBar label="工具" value={radarData[3].value} />
        <DimensionMiniBar label="协作" value={radarData[4].value} />
        <DimensionMiniBar label="记忆" value={radarData[5].value} />
      </div>

      {/* 状态标签 */}
      <div className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusInfo.color}`}>
        {statusInfo.text}
      </div>
    </motion.div>
  )
})

// 维度迷你条组件
function DimensionMiniBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[9px] text-gray-500 w-6">{label}</span>
      <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gray-800 rounded-full"
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-[9px] text-gray-400 w-5 text-right">{value}</span>
    </div>
  )
}

export default AgentCard
