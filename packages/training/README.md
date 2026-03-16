# @soulbuilder/training

> SoulBuilder 2.0 Construct 训练对话系统

## 🎯 项目职责

开发一个能够通过对话式交互训练 Agent 的系统，就像黑客帝国里的 Construct 训练空间。

### 核心功能
1. 纯白训练空间 UI（Matrix Construct 风格）
2. SSE 流式对话界面
3. 5 种训练模式支持
4. 训练结果结构化输出
5. 游戏化反馈系统

---

## 📦 已实现模块

### 1. 组件 (src/components/)
- `ConstructSpace.tsx` - 纯白训练空间容器
- `TrainingChat.tsx` - 训练对话界面
- `TrainingComplete.tsx` - 训练完成反馈页
- `MessageBubble.tsx` - 消息气泡
- `InputBar.tsx` - 输入栏
- `ProgressIndicator.tsx` - 进度指示器

### 2. Hooks (src/hooks/)
- `useTrainingSession.ts` - 训练会话管理（整合 SSE、消息、API）
- `useSSE.ts` - SSE 流式连接管理
- `useMessages.ts` - 消息列表管理

### 3. API (src/api/)
- `training.ts` - 后端 API 调用封装
- `sse-parser.ts` - SSE 数据解析器

### 4. 提示词 (src/prompts/)
- `system-prompt.ts` - 训练教练系统提示词

### 5. 工具函数 (src/utils/)
- `score-calculator.ts` - 分数计算器（渐进式增长模型）
- `surprise-detector.ts` - 惊喜检测器（10 个触点）
- `feedback-generator.ts` - 反馈生成器
- `json-parser.ts` - AI 输出 JSON 解析

### 6. 类型 (src/types/)
- `feedback.ts` - 反馈相关类型定义

---

## 🚀 使用方式

```tsx
import { ConstructSpace, TrainingComplete } from '@soulbuilder/training'
import { Agent, TrainingMode, TrainingMethod, TrainingResult } from '@soulbuilder/shared'

function TrainingPage() {
  const [result, setResult] = useState<TrainingResult | null>(null)

  if (result) {
    return (
      <TrainingComplete
        agentName={agent.name}
        agentTitle={agent.title}
        feedback={feedback}
        onViewProfile={() => {}}
        onExport={() => {}}
        onContinue={() => setResult(null)}
      />
    )
  }

  return (
    <ConstructSpace
      agent={agent}
      mode="new"
      method="describe"
      onComplete={(result) => setResult(result)}
      onExit={() => {}}
    />
  )
}
```

---

## 📊 API 接口

### POST /api/soulbuilder/train/start
开始训练会话

```typescript
Request: {
  agentId: string
  mode: TrainingMode
  method: TrainingMethod
}

Response: {
  sessionId: string
  session: TrainingSession
}
```

### POST /api/soulbuilder/train/chat
发送训练消息（SSE 流式）

```typescript
Request: {
  sessionId: string
  message: string
}

Response: SSE stream
  data: { content: "..." }
  data: { content: "..." }
  data: { json: {...} }  // 当训练完成时
  data: [DONE]
```

### POST /api/soulbuilder/train/complete
完成训练

```typescript
Request: {
  sessionId: string
}

Response: {
  success: boolean
  result: TrainingResult
}
```

---

## 🎨 UI 设计

### Construct 空间
- 背景：纯白 `#FFFFFF`
- 文字：深灰 `#1a1a1a`
- 强调：Matrix 绿 `#00FF41`

### 训练完成页
- 专业 SaaS 风格
- 参考：Notion、Linear、Figma

---

## 📁 文件结构

```
training/
├── src/
│   ├── index.ts                    # 导出入口
│   ├── components/
│   │   ├── index.ts
│   │   ├── ConstructSpace.tsx      # 纯白训练空间
│   │   ├── TrainingChat.tsx        # 对话组件
│   │   ├── TrainingComplete.tsx    # 完成页面
│   │   ├── MessageBubble.tsx       # 消息气泡
│   │   ├── InputBar.tsx            # 输入栏
│   │   └── ProgressIndicator.tsx   # 进度指示
│   ├── prompts/
│   │   ├── index.ts
│   │   └── system-prompt.ts        # 系统提示词
│   ├── api/
│   │   ├── index.ts
│   │   ├── training.ts             # API 调用
│   │   └── sse-parser.ts           # SSE 解析
│   ├── hooks/
│   │   ├── index.ts
│   │   ├── useTrainingSession.ts   # 训练会话
│   │   ├── useSSE.ts               # SSE 连接
│   │   └── useMessages.ts          # 消息管理
│   ├── utils/
│   │   ├── index.ts
│   │   ├── score-calculator.ts     # 分数计算
│   │   ├── surprise-detector.ts    # 惊喜检测
│   │   ├── feedback-generator.ts   # 反馈生成
│   │   └── json-parser.ts          # JSON 解析
│   └── types/
│       ├── index.ts
│       └── feedback.ts             # 反馈类型
├── package.json
├── tsconfig.json
├── tsup.config.ts
└── README.md
```

---

## 🔗 依赖

```json
{
  "dependencies": {
    "@soulbuilder/shared": "workspace:*",
    "react": "^18.2.0"
  }
}
```

---

## 🚀 快速开始

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建
npm run build

# 类型检查
npm run typecheck
```

---

## 📝 核心设计文档

- 训练系统学习报告：`02 训练系统/训练系统学习报告.md`
- 用户旅程模拟：`02 训练系统/用户使用旅程模拟.md`
- 游戏化进阶系统：`02 训练系统/游戏化进阶系统设计.md`
- 游戏化反馈设计：`02 训练系统/游戏化反馈设计.md`

---

*文档更新于 2026-03-17*
