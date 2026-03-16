# @soulbuilder/app

> SoulBuilder 2.0 主应用 - 整合所有子项目

## 🎯 项目职责

作为"胶水层"，整合所有子项目的功能，提供完整的用户旅程。

### 核心功能
1. 路由配置和页面结构
2. 状态管理
3. 整合 assessment、training、animation 组件
4. OpenClaw 配置写入

## 📦 交付物

### 1. 页面组件

```
src/pages/
├── AgentListPage.tsx        # Agent 列表页（模块 A）
├── AssessmentPage.tsx       # 评估详情页（模块 B）
├── TrainingModePage.tsx     # 训练模式选择（模块 C）
├── ConstructPage.tsx        # 训练对话页（模块 D）
├── AnimationPage.tsx        # 训练动画页（模块 E）
├── CompletePage.tsx         # 完成反馈页（模块 F）
└── NotFoundPage.tsx         # 404 页面
```

### 2. 路由配置

```tsx
// src/router.tsx
const routes = [
  { path: '/', redirect: '/agents' },
  { path: '/agents', component: AgentListPage },
  { path: '/agents/:id', component: AssessmentPage },
  { path: '/agents/:id/train', component: TrainingModePage },
  { path: '/agents/:id/train/construct', component: ConstructPage },
  { path: '/agents/:id/train/animation', component: AnimationPage },
  { path: '/agents/:id/train/complete', component: CompletePage },
]
```

### 3. 状态管理

```tsx
// src/store/trainingStore.ts
interface TrainingStore {
  // 当前 Agent
  currentAgent: Agent | null

  // 评估结果
  assessment: Assessment | null

  // 训练会话
  session: TrainingSession | null

  // 训练结果
  result: TrainingResult | null

  // 当前阶段
  phase: 'list' | 'assessment' | 'mode' | 'training' | 'animation' | 'complete'

  // Actions
  selectAgent: (agent: Agent) => void
  setAssessment: (assessment: Assessment) => void
  setTrainingResult: (result: TrainingResult) => void
  reset: () => void
}
```

### 4. 主布局

```tsx
// src/layouts/MainLayout.tsx
const MainLayout = () => (
  <div className="app-container">
    <header>
      <h1>SoulBuilder</h1>
      <span className="tagline">Construct Your Agent</span>
    </header>
    <main>
      <Outlet />
    </main>
  </div>
)
```

### 5. 配置写入功能

```tsx
// src/services/configWriter.ts
class ConfigWriter {
  // 备份原配置
  async backup(agentId: string): Promise<string>

  // 写入新配置
  async write(agentId: string, result: TrainingResult): Promise<void>

  // 验证配置
  async validate(agentId: string): Promise<boolean>

  // 回滚
  async rollback(agentId: string, backupPath: string): Promise<void>
}
```

## 🔧 用户旅程

```
┌─────────────────────────────────────────────────────────────────┐
│                        用户旅程                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. /agents                                                     │
│     └── Agent 列表页                                            │
│         └── 卡片展示所有 Agent                                   │
│         └── 显示能力值/等级                                      │
│         └── 点击进入评估                                         │
│                                                                 │
│  2. /agents/:id                                                 │
│     └── 评估详情页                                               │
│         └── 显示雷达图                                           │
│         └── 显示各维度分数                                       │
│         └── 点击"训练升级"                                       │
│                                                                 │
│  3. /agents/:id/train                                           │
│     └── 训练模式选择                                             │
│         └── New Training / Level Up / Skill Inject              │
│         └── 选择训练方式（5种）                                   │
│         └── 点击"进入 Construct"                                 │
│                                                                 │
│  4. /agents/:id/train/construct                                 │
│     └── 训练对话页                                               │
│         └── 纯白训练空间                                         │
│         └── SSE 流式对话                                         │
│         └── 5 轮对话完成                                         │
│                                                                 │
│  5. /agents/:id/train/animation                                 │
│     └── 训练动画页                                               │
│         └── 30秒 Matrix 风格动画                                 │
│         └── 代码雨 + 功夫小人                                    │
│         └── 自动跳转到完成页                                     │
│                                                                 │
│  6. /agents/:id/train/complete                                  │
│     └── 完成反馈页                                               │
│         └── Before/After 对比                                   │
│         └── "I know [skill]"                                    │
│         └── "保存" / "预览"                                      │
│                                                                 │
│  7. 保存成功                                                     │
│     └── 跳回 Agent 列表                                          │
│         └── 显示能力值变化                                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 📁 建议的文件结构

```
app/
├── src/
│   ├── main.tsx                   # 入口
│   ├── App.tsx                    # 根组件
│   ├── router.tsx                 # 路由配置
│   ├── layouts/
│   │   └── MainLayout.tsx
│   ├── pages/
│   │   ├── AgentListPage.tsx
│   │   ├── AssessmentPage.tsx
│   │   ├── TrainingModePage.tsx
│   │   ├── ConstructPage.tsx
│   │   ├── AnimationPage.tsx
│   │   └── CompletePage.tsx
│   ├── store/
│   │   ├── index.ts
│   │   ├── agentStore.ts
│   │   └── trainingStore.ts
│   ├── services/
│   │   ├── api.ts                 # API 调用
│   │   └── configWriter.ts        # 配置写入
│   ├── components/
│   │   └── (从子项目导入，或本地组件)
│   └── styles/
│       └── globals.css
├── public/
│   └── favicon.ico
├── index.html
├── vite.config.ts
├── package.json
└── README.md
```

## 🔗 整合其他子项目

### 导入评估组件
```tsx
// 从 assessment 包导入
import { AssessmentEngine, RadarChart } from '@soulbuilder/assessment'

// 使用
const assessment = await AssessmentEngine.assess(agentId)
<RadarChart data={assessment.radarData} />
```

### 导入训练组件
```tsx
// 从 training 包导入
import { ConstructSpace, TrainingChat } from '@soulbuilder/training'

// 使用
<ConstructSpace
  agent={currentAgent}
  mode="upgrade"
  method="methodology"
  onComplete={handleTrainingComplete}
/>
```

### 导入动画组件
```tsx
// 从 animation 包导入
import { TrainingAnimation } from '@soulbuilder/animation'

// 使用
<TrainingAnimation
  skills={result.skills}
  beforeScore={assessment.totalScore}
  afterScore={result.newScore}
  onComplete={() => navigate('/complete')}
/>
```

## 🔧 技术选型建议

### 前端框架
- **React 18+** - 组件化
- **TypeScript** - 类型安全
- **Vite** - 构建工具

### 状态管理
- **Zustand** - 轻量级状态管理
- 或 **Jotai** - 原子化状态

### 路由
- **React Router v6**

### 样式
- **Tailwind CSS** - 快速开发
- 或 **CSS Modules**

### 后端（如果需要）
- 复用 HelloIM 的 Bun + Hono 架构

## ⚠️ 注意事项

1. **最后整合** - 等其他子项目完成后再整合
2. **接口一致** - 确保所有子项目遵循 shared 的接口
3. **错误处理** - 统一的错误提示
4. **加载状态** - 统一的 Loading 组件
5. **响应式** - 适配桌面和移动端

## 📊 完成标准

- [ ] 所有页面组件完成
- [ ] 路由配置正确
- [ ] 状态管理工作正常
- [ ] 整合 assessment 组件
- [ ] 整合 training 组件
- [ ] 整合 animation 组件
- [ ] 配置写入功能可用
- [ ] 完整的用户旅程可走通
- [ ] 基本的错误处理

## 🔗 依赖

- `@soulbuilder/shared` - 类型定义
- `@soulbuilder/assessment` - 评估组件
- `@soulbuilder/training` - 训练组件
- `@soulbuilder/animation` - 动画组件

## 🚀 启动开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建
npm run build
```

## 📦 package.json 依赖示例

```json
{
  "dependencies": {
    "@soulbuilder/shared": "workspace:*",
    "@soulbuilder/assessment": "workspace:*",
    "@soulbuilder/training": "workspace:*",
    "@soulbuilder/animation": "workspace:*",
    "react": "^18.2.0",
    "react-router-dom": "^6.0.0",
    "zustand": "^4.0.0"
  }
}
```
