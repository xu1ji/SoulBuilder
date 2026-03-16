# @soulbuilder/shared

> SoulBuilder 2.0 共享类型定义和接口契约

## 🎯 职责

这个包定义了所有子项目共用的：
- TypeScript 接口和类型
- 常量定义
- 工具函数

**所有其他子项目必须依赖这个包。**

---

## 📦 使用方法

```typescript
// 导入类型
import {
  Agent,
  Assessment,
  TrainingResult,
  AnimationPhase,
  MATRIX_COLORS
} from '@soulbuilder/shared'

// 导入工具函数
import {
  calculateRank,
  calculateTotalScore,
  generateSessionId
} from '@soulbuilder/shared'
```

---

## 📁 文件结构

```
shared/
├── index.ts       # 统一导出入口（包含所有类型、常量、工具）
└── README.md
```

---

## 📋 核心类型

### Agent 相关
```typescript
interface Agent {
  id: string
  name: string
  title: string
  level: number        // 1-5
  score: number        // 0-100
  rank: AgentRank
  status: AgentStatus
  workspace: string
}

type AgentRank = 'E' | 'D' | 'C' | 'B' | 'A' | 'S'
type AgentStatus = 'new' | 'trained' | 'upgradable'
```

### 评估相关
```typescript
interface Assessment {
  agentId: string
  totalScore: number
  rank: AgentRank
  dimensions: AssessmentDimensions
  radarData: number[]
  assessedAt: Date
}

interface AssessmentDimensions {
  identity: number    // 0-100
  soul: number
  user: number
  tools: number
  agents: number
  memory: number
}
```

### 训练相关
```typescript
interface TrainingSession {
  sessionId: string
  agentId: string
  mode: TrainingMode
  method: TrainingMethod
  messages: ChatMessage[]
  currentRound: number
  status: 'active' | 'completed' | 'abandoned'
}

interface TrainingResult {
  agentId: string
  sessionId: string
  oldScore: number
  newScore: number
  skills: string[]
  files: TrainingResultFiles
}
```

### 动画相关
```typescript
type AnimationPhase = 'enter' | 'transfer' | 'training' | 'awakening' | 'complete'

interface AnimationConfig {
  phases: AnimationPhaseConfig[]
  totalDuration: number
  skills: string[]
  beforeScore: number
  afterScore: number
}
```

---

## 🎨 常量

### 评估权重 (v1.1 - 6维模型)
```typescript
const ASSESSMENT_WEIGHTS = {
  identity: 22,    // 22%
  soul: 22,        // 22%
  user: 17,        // 17%
  tools: 17,       // 17%
  agents: 11,      // 11%
  memory: 11,      // 11%
}
```

### 等级阈值
```typescript
const RANK_THRESHOLDS = {
  S: 95, A: 85, B: 70, C: 55, D: 40, E: 0
}
```

### Matrix 颜色
```typescript
const MATRIX_COLORS = {
  green: '#00FF41',
  greenDark: '#008F11',
  white: '#FFFFFF',
  black: '#0D0208',
  success: '#4ADE80',
  gold: '#FBBF24',
}
```

### 动画阶段
```typescript
const ANIMATION_PHASES = [
  { phase: 'enter', duration: 3000, label: 'Entering Construct...' },
  { phase: 'transfer', duration: 5000, label: 'Transferring data...' },
  { phase: 'training', duration: 15000, label: 'Training in progress...' },
  { phase: 'awakening', duration: 5000, label: 'Awakening...' },
  { phase: 'complete', duration: 2000, label: 'Training complete.' },
]
```

---

## 🔧 工具函数

```typescript
// 根据分数计算等级
function calculateRank(score: number): AgentRank

// 计算总分
function calculateTotalScore(dimensions: AssessmentDimensions): number

// 生成雷达图数据
function generateRadarData(dimensions: AssessmentDimensions): number[]

// 生成 sessionId
function generateSessionId(): string

// 生成消息 ID
function generateMessageId(): string
```

---

## 📊 完成标准

- [x] 所有类型定义完整
- [x] 常量定义完整
- [x] 工具函数实现
- [ ] 添加单元测试

---

## 🔗 依赖关系

```
shared (无外部依赖)
  ↑
  ├── assessment
  ├── training
  ├── animation
  └── app
```

---

## ⚠️ 注意事项

1. **接口变更需通知所有子项目**
2. **保持向后兼容**
3. **不要添加运行时依赖**
4. **修改后需重新构建所有子项目**

---

*文档更新于 2025-03-17*
