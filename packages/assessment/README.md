# @soulbuilder/assessment

> SoulBuilder 2.0 Agent 评估引擎

## 🎯 项目职责

开发一个能够客观评估 Agent 能力水平的评估系统，就像给 Agent 做"体检"。

### 核心功能
1. 读取 OpenClaw 的 Agent 配置文件
2. 分析 6 层文件的完整度和质量
3. 生成 0-100 分的评估结果
4. 生成雷达图数据

---

## ❓ 已确认的问题答案

### 1. 技术栈确认
**后端**：纯 TypeScript 函数库，不需要提供 HTTP API
- 导出 `AssessmentEngine` 类和相关函数
- 由 `app` 包负责包装成 API

**雷达图库**：使用 **Recharts**
- 已经在 HelloIM 项目中使用
- `npm install recharts`

### 2. 评分标准细化
**评分方式**：纯规则匹配，不调用 LLM
- 原因：评估需要快速、可预测、低成本
- 通过字段存在性、内容长度、关键词匹配来评分

**"有深度"的定义**：
```typescript
// IDENTITY.md 评分标准
// 0-20: 文件不存在或 < 100 字符
// 20-40: 有 name + title，但 traits/style 缺失或 < 3 条
// 40-60: 基本信息完整，traits 有 3+ 条
// 60-80: traits 有深度描述（每条 > 20 字），style 明确
// 80-100: 有哲学底色，与其他 Agent 的关系明确

// SOUL.md 评分标准
// 0-20: 文件不存在或 < 100 字符
// 20-40: 有 mission 但模糊（< 50 字）
// 40-60: mission 清晰，values 有 3+ 条
// 60-80: 有 boundaries，有哲学底色
// 80-100: 完整的灵魂宪法，有独特的 Vibe 定义
```

### 3. 文件结构确认
**按照 README 建议的结构**：
```
assessment/
├── src/
│   ├── index.ts                 # 导出入口
│   ├── AssessmentEngine.ts      # 主引擎
│   ├── parsers/
│   │   ├── OpenClawParser.ts    # 配置解析
│   │   └── MarkdownParser.ts    # MD 文件解析
│   ├── scorers/
│   │   ├── ScoringEngine.ts     # 评分引擎
│   │   ├── identityScorer.ts    # IDENTITY 评分
│   │   ├── soulScorer.ts        # SOUL 评分
│   │   ├── userScorer.ts
│   │   ├── toolsScorer.ts
│   │   ├── agentsScorer.ts
│   │   └── memoryScorer.ts
│   └── components/
│       └── RadarChart.tsx       # 雷达图组件
├── tests/
│   └── assessment.test.ts
└── package.json
```

### 4. 测试数据
**确认存在**，可以直接使用：
```bash
# 高分 Agent（Truman 的数字分身）
~/.openclaw/workspace-trumind/

# 中等分 Agent（CEO 助理）
~/.openclaw/workspace-emily/

# 高分 Agent（全栈工程师）
~/.openclaw/workspace-gates/

# 其他可用 Agent
~/.openclaw/workspace-grace/
~/.openclaw/workspace-olivia/
~/.openclaw/workspace-summer/
```

### 5. RadarChart 组件归属
**放在 assessment 包里**
- 原因：雷达图是评估结果的专属展示
- `app` 包直接 import 使用
- 使用 Recharts 的 `RadarChart` 组件

---

## 📦 交付物

### 1. 评估引擎类
```typescript
// src/AssessmentEngine.ts
import { Agent, Assessment, AssessmentConfig } from '@soulbuilder/shared'

export class AssessmentEngine {
  private config: AssessmentConfig
  private openclawPath: string

  constructor(openclawPath?: string, config?: Partial<AssessmentConfig>)

  // 评估单个 Agent
  async assess(agentId: string): Promise<Assessment>

  // 批量评估
  async assessAll(): Promise<Assessment[]>

  // 获取 Agent 列表
  async getAgents(): Promise<Agent[]>

  // 获取单个 Agent 信息
  async getAgent(agentId: string): Promise<Agent | null>
}
```

### 2. 评分器示例
```typescript
// src/scorers/identityScorer.ts
export function scoreIdentity(content: string): {
  score: number
  fields: string[]
  suggestions: string[]
} {
  const fields: string[] = []
  const suggestions: string[] = []
  let score = 0

  // 检查基础字段
  if (/name[:：]\s*\w+/i.test(content)) {
    fields.push('name')
    score += 10
  }
  if (/title|岗位|职位/i.test(content)) {
    fields.push('title')
    score += 10
  }
  if (/trait|特质|特点/i.test(content)) {
    fields.push('traits')
    score += 15
  }
  if (/style|风格|语态/i.test(content)) {
    fields.push('style')
    score += 15
  }

  // 内容深度
  const wordCount = content.length
  if (wordCount > 500) score += 20
  else if (wordCount > 200) score += 10

  if (wordCount < 200) {
    suggestions.push('建议补充更多身份描述')
  }
  if (!fields.includes('traits')) {
    suggestions.push('建议添加核心特质')
  }

  return { score: Math.min(100, score), fields, suggestions }
}
```

### 3. RadarChart 组件
```tsx
// src/components/RadarChart.tsx
import { RadarChart as RechartsRadar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts'
import { MATRIX_COLORS } from '@soulbuilder/shared'

interface RadarChartProps {
  data: number[]  // [identity, soul, user, tools, agents, memory]
  labels?: string[]
  color?: string
  size?: number
}

export function RadarChart({ data, labels, color = MATRIX_COLORS.green, size = 300 }: RadarChartProps) {
  const chartData = (labels || DIMENSION_LABELS).map((label, i) => ({
    dimension: label,
    score: data[i] || 0,
  }))

  return (
    <ResponsiveContainer width={size} height={size}>
      <RechartsRadar data={chartData}>
        <PolarGrid stroke={MATRIX_COLORS.greenDark} />
        <PolarAngleAxis dataKey="dimension" tick={{ fill: MATRIX_COLORS.green, fontSize: 12 }} />
        <PolarRadiusAxis angle={30} domain={[0, 100]} />
        <Radar name="Score" dataKey="score" stroke={color} fill={color} fillOpacity={0.3} />
      </RechartsRadar>
    </ResponsiveContainer>
  )
}

const DIMENSION_LABELS = ['身份', '灵魂', '雇主', '工具', '协作', '记忆']
```

---

## 🔧 技术要求

### 依赖
```json
{
  "dependencies": {
    "@soulbuilder/shared": "workspace:*",
    "recharts": "^2.10.0",
    "react": "^18.2.0"
  }
}
```

### 导出
```typescript
// src/index.ts
export { AssessmentEngine } from './AssessmentEngine'
export { RadarChart } from './components/RadarChart'
export * from './scorers'
export * from './parsers'
```

---

## 📊 完成标准

- [ ] AssessmentEngine 类实现完成
- [ ] 6 个评分器全部实现
- [ ] 能读取真实 OpenClaw 配置
- [ ] 评估结果符合预期（用本地 Agent 测试）
- [ ] RadarChart 组件可用
- [ ] 有基本的单元测试

---

## 🚀 快速开始

```bash
# 安装依赖
npm install

# 运行测试
npm test

# 本地调试
npx ts-node -e "
const { AssessmentEngine } = require('./src')
const engine = new AssessmentEngine()
engine.assess('trumind').then(console.log)
"
```

---

*文档更新于 2025-03-17*
