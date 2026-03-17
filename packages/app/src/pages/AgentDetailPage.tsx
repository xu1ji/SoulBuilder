import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts'
import { ArrowLeft, ChevronRight, Sparkles, Target, Zap } from 'lucide-react'
import { useAppStore } from '../stores/useAppStore'
import type { AgentRank } from '@soulbuilder/shared'

// 等级阈值
const RANK_THRESHOLDS: Record<AgentRank, number> = {
  S: 95, A: 85, B: 70, C: 55, D: 40, E: 0,
}

// 等级百分位描述
const RANK_PERCENTILES: Record<AgentRank, string> = {
  S: '行业顶尖 1%',
  A: '行业前 15%',
  B: '行业前 40%',
  C: '中等水平',
  D: '需要加强',
  E: '刚刚起步',
}

// 等级渐变配色
const rankGradients: Record<AgentRank, string> = {
  S: 'from-amber-400 to-orange-500',
  A: 'from-violet-400 to-purple-500',
  B: 'from-blue-400 to-cyan-500',
  C: 'from-gray-300 to-gray-400',
  D: 'from-gray-200 to-gray-300',
  E: 'from-gray-100 to-gray-200',
}

export default function AgentDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentAgent, currentAssessment, selectAgent, agents } = useAppStore()

  useEffect(() => {
    if (id) {
      selectAgent(id)
    }
  }, [id, selectAgent])

  if (!currentAgent) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin w-8 h-8 border-2 border-gray-200 border-t-black rounded-full" />
      </div>
    )
  }

  const agent = currentAgent
  const dimensions = currentAssessment?.dimensions || {
    identity: agent.score + 5,
    soul: agent.score + 2,
    user: agent.score - 5,
    tools: agent.score,
    agents: agent.score - 2,
    memory: agent.score - 8,
  }

  const radarData = [
    { subject: '身份', value: dimensions.identity, fullMark: 100 },
    { subject: '灵魂', value: dimensions.soul, fullMark: 100 },
    { subject: '用户', value: dimensions.user, fullMark: 100 },
    { subject: '工具', value: dimensions.tools, fullMark: 100 },
    { subject: '协作', value: dimensions.agents, fullMark: 100 },
    { subject: '记忆', value: dimensions.memory, fullMark: 100 },
  ]

  // 生成 Agent 摘要
  const summary = generateAgentSummary(agent, dimensions)

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      {/* 返回按钮 */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-1.5 text-gray-500 hover:text-black
                   transition-colors mb-6 group"
      >
        <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
        <span className="text-xs font-semibold uppercase tracking-wider">返回列表</span>
      </button>

      {/* 头部信息 */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500
                          flex items-center justify-center text-white font-bold text-xl">
            {agent.name[0]}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {agent.name} · {agent.title}
            </h1>
            <div className="flex items-center gap-3 mt-1">
              <div className={`px-2 py-0.5 rounded bg-gradient-to-r ${rankGradients[agent.rank]} text-white text-xs font-bold`}>
                {agent.rank} 级
              </div>
              <span className="text-sm text-gray-500">{agent.score} 分</span>
              {agent.lastTrained && (
                <span className="text-xs text-gray-400">
                  上次训练 {formatDate(agent.lastTrained)}
                </span>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate(`/agents/${id}/train`)}
          className="flex items-center gap-2 px-5 py-2.5 bg-black text-white
                     rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors"
        >
          <Zap size={16} />
          开始训练
        </button>
      </div>

      {/* 主体：雷达图 + 维度详情 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* 雷达图卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-5 bg-white rounded-2xl border border-gray-200 p-6"
        >
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
            能力维度
          </h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#E5E5E5" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: '#525252', fontSize: 11, fontWeight: 600 }}
                />
                <Radar
                  name="能力值"
                  dataKey="value"
                  stroke="#000000"
                  fill="#000000"
                  fillOpacity={0.06}
                  strokeWidth={2}
                  animationDuration={1000}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* 维度详情卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-7 bg-white rounded-2xl border border-gray-200 p-6"
        >
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
            评估详情
          </h3>

          <div className="space-y-4">
            <DimensionRow label="身份档案" value={dimensions.identity} weight={22} />
            <DimensionRow label="灵魂深度" value={dimensions.soul} weight={22} />
            <DimensionRow label="雇主信息" value={dimensions.user} weight={17} />
            <DimensionRow label="工具配置" value={dimensions.tools} weight={17} />
            <DimensionRow label="协作关系" value={dimensions.agents} weight={11} />
            <DimensionRow label="记忆管理" value={dimensions.memory} weight={11} />
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
            <span className="text-sm text-gray-500">综合评分</span>
            <span className="text-2xl font-bold text-gray-900">{agent.score}</span>
          </div>
        </motion.div>
      </div>

      {/* Agent 摘要 - 新增 */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 p-6 mb-8"
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-sm font-bold text-gray-900">Agent 摘要</h3>
        </div>

        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
          {summary}
        </p>
      </motion.div>

      {/* 已配置内容 + 改进建议 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">已配置内容</h3>
          <div className="space-y-3">
            <ConfigItem label="身份档案" items={['姓名', '岗位', '性格特质', '沟通风格']} />
            <ConfigItem label="灵魂深度" items={['使命', '价值观', '边界底线']} />
          </div>
        </div>

        <div className="bg-gray-50 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">改进建议</h3>
          <div className="space-y-3">
            <SuggestionItem text="可以添加更多行业场景细节" />
            <SuggestionItem text="建议配置更多协作关系" />
            <SuggestionItem text="记忆管理策略可以更丰富" />
          </div>
        </div>
      </div>
    </div>
  )
}

// 维度行组件
function DimensionRow({ label, value, weight }: { label: string; value: number; weight: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-600 w-20">{label}</span>
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-black rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        />
      </div>
      <span className="text-sm font-semibold text-gray-900 w-6 text-right">{value}</span>
      <span className="text-[10px] text-gray-400 w-12 text-right">权重 {weight}%</span>
    </div>
  )
}

// 配置项组件
function ConfigItem({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="flex items-start gap-2">
      <div className="w-1 h-1 rounded-full bg-black mt-2 shrink-0" />
      <p className="text-sm text-gray-600">
        <span className="font-semibold text-gray-900">{label}:</span> {items.join(', ')}
      </p>
    </div>
  )
}

// 建议项组件
function SuggestionItem({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2">
      <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
        <ChevronRight size={10} className="text-gray-400" />
      </div>
      <p className="text-sm text-gray-600">{text}</p>
    </div>
  )
}

// 生成 Agent 摘要
function generateAgentSummary(
  agent: { name: string; title: string; rank: AgentRank; score: number },
  dimensions: Record<string, number>
): string {
  const sorted = Object.entries(dimensions).sort((a, b) => b[1] - a[1])
  const strengths = sorted.slice(0, 2)
  const weaknesses = sorted.slice(-2)

  const strengthNames: Record<string, string> = {
    identity: '身份定位清晰',
    soul: '使命感和方法论扎实',
    user: '对雇主偏好的理解深入',
    tools: '工具使用规范',
    agents: '协作关系明确',
    memory: '记忆管理策略完善',
  }

  const weaknessNames: Record<string, string> = {
    identity: '身份定义可以更清晰',
    soul: '使命感可以更明确',
    user: '对雇主偏好的理解可以更深入',
    tools: '工具配置可以更丰富',
    agents: '协作关系可以更广泛',
    memory: '记忆管理策略可以加强',
  }

  const improvement = agent.rank === 'A' ? '有望冲击 S 级' : '可以显著提升能力'
  const boost = agent.rank === 'A' ? '10~15' : agent.rank === 'B' ? '15~25' : '20~30'

  return `这是一位 ${agent.rank} 级${agent.title} Agent，目前处于${RANK_PERCENTILES[agent.rank]}水平。

优势：${strengths.map(([k]) => strengthNames[k] || k).join('，')}，是个"有灵魂"的专家。

提升空间：${weaknesses.map(([k]) => weaknessNames[k] || k).join('。')}

建议通过训练加强个性化服务能力，${improvement}。

预计提升空间：+${boost} 分`
}

// 格式化日期
function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diff = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24))

  if (diff === 0) return '今天'
  if (diff === 1) return '昨天'
  if (diff < 7) return `${diff} 天前`
  if (diff < 30) return `${Math.floor(diff / 7)} 周前`
  return d.toLocaleDateString('zh-CN')
}
