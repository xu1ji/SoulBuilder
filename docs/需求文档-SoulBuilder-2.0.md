# SoulBuilder 2.0 产品需求文档

> **版本**：2.0
> **代号**：Construct
> **核心理念**：Matrix 风格的 AI Agent 训练系统
> **目标**：让用户在 5-10 分钟内体验 "我的 Agent 瞬间变强了"

---

## 一、产品概述

### 1.1 一句话描述

> **像黑客帝国一样，给你的 AI Agent 注入技能包。**
> **几轮对话，从 60 分到 85 分。**

### 1.2 核心价值

| 传统方式 | SoulBuilder 2.0 |
|---------|-----------------|
| 手写 Prompt，反复调试 | 对话式训练，自然表达 |
| 不知道写得好不好 | 客观评估体系，量化分数 |
| 改完没感觉 | 仪式感升级动画，"真的变强了" |
| 枯燥填表 | Matrix 风格，科幻体验 |

### 1.3 目标用户

- OpenClaw 本地用户
- 有多个 Agent 需要管理/优化
- 不想手写 Prompt，但想要高质量 Agent

---

## 二、核心流程

```
┌─────────────────────────────────────────────────────────────────┐
│                        用户旅程                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. Agent 列表 ──→ 选择要训练的 Agent                           │
│        ↓                                                        │
│  2. 能力评估 ──→ 展示当前成熟度、各项指标                        │
│        ↓                                                        │
│  3. 选择模式 ──→ 全新训练 / 基于现有版本升级                     │
│        ↓                                                        │
│  4. 进入 Construct ──→ 纯白训练空间                             │
│        ↓                                                        │
│  5. 对话训练 ──→ 3-5 轮交互，收集信息                           │
│        ↓                                                        │
│  6. 训练动画 ──→ 20-30秒像素风小人练功夫                         │
│        ↓                                                        │
│  7. 升级完成 ──→ 仪式感反馈，能力值提升展示                      │
│        ↓                                                        │
│  8. 保存注入 ──→ 更新 Agent 配置文件                            │
│        ↓                                                        │
│  9. 返回列表 ──→ 看到能力值变化                                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2.5 OpenClaw 集成架构

### 与 OpenClaw 的关系

SoulBuilder 是 OpenClaw 的训练插件，负责生成和优化 Agent 的配置文件。

### OpenClaw 7层架构

```
┌─────────────────────────────────────────────────────────────────┐
│                    OpenClaw Agent 7层架构                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Layer 1: JSON (神经总线)                                        │
│  └── ~/.openclaw/openclaw.json                                  │
│      └── agents.list[] → id, workspace, model                   │
│                                                                 │
│  Layer 2: USER (雇主索引)                                        │
│  └── workspace-{id}/USER.md                                     │
│      └── 雇主信息、协作关系、沟通偏好                              │
│                                                                 │
│  Layer 3: AGENT (运行协议)                                       │
│  └── workspace-{id}/AGENTS.md                                   │
│      └── 与其他 Agent 的协作关系                                  │
│                                                                 │
│  Layer 4: IDENTITY (谈吐人设)                                    │
│  └── workspace-{id}/IDENTITY.md                                 │
│      └── 名字、岗位、特质、语态、性格                              │
│                                                                 │
│  Layer 5: TOOLS (工具地图)                                       │
│  └── workspace-{id}/TOOLS.md                                    │
│      └── 可用工具及使用规范                                       │
│                                                                 │
│  Layer 6: SOUL (元灵魂)                                          │
│  └── workspace-{id}/SOUL.md                                     │
│      └── 使命、价值观、哲学底色、边界                              │
│                                                                 │
│  Layer 7: HEARTBEAT (心跳)                                       │
│  └── workspace-{id}/HEARTBEAT.md                                │
│      └── 周期性行为定义（可为空）                                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### SoulBuilder 训练输出映射

| SoulBuilder 训练结果 | 写入的 OpenClaw 文件 |
|---------------------|---------------------|
| 名字、岗位、特质、语态 | IDENTITY.md |
| 使命、价值观、方法论 | SOUL.md |
| 雇主信息、协作关系 | USER.md |
| 工具定义 | TOOLS.md |
| Agent 协作关系 | AGENTS.md |
| 周期性任务（高级） | HEARTBEAT.md |

---

## 三、功能模块拆分

### 模块 A：Agent 列表与选择

**功能描述**：
- 读取 `~/.openclaw/openclaw.json` 获取 Agent 列表
- 读取每个 Agent 的 workspace 目录下的配置文件
- 展示所有 Agent 及其当前能力值
- 支持选择进入训练

**读取路径**：
```
~/.openclaw/
├── openclaw.json           # 主配置（agents.list 获取 Agent 列表）
└── workspace-{id}/         # 每个 Agent 的配置目录
    ├── IDENTITY.md         # 解析提取 name, title, traits
    ├── SOUL.md             # 解析评估完整度
    └── ... (其他配置文件)
```

**核心字段**：
```
Agent {
  id: string           # 来自 openclaw.json
  name: string         # 解析 IDENTITY.md
  title: string        # 岗位，解析 IDENTITY.md
  level: number        // 能力等级 1-5（基于评估计算）
  score: number        // 能力值 0-100（基于评估计算）
  lastTrained: date    // workspace 目录修改时间
  status: 'new' | 'trained' | 'upgradable'
}
```

**界面要点**：
- 卡片式列表，类似游戏角色选择
- 能力值用进度条/雷达图展示
- 状态标识（新/已训练/可升级）

---

### 模块 B：能力评估体系

**功能描述**：
- 客观评估 Agent 的成熟度
- 生成多维度能力报告
- 对比升级前后的变化

**评估维度（对应 OpenClaw 7层架构）**：

| 维度 | 权重 | 对应文件 | 评估方式 |
|------|------|---------|---------|
| **身份完整性** | 20% | IDENTITY.md | name, title, traits, vibe 是否完整 |
| **灵魂深度** | 20% | SOUL.md | 使命、价值观、哲学底色是否有深度 |
| **心跳活跃度** | 10% | HEARTBEAT.md | 是否有定义周期性任务（可为空） |
| **雇主映射** | 15% | USER.md | 雇主信息、协作关系是否完整 |
| **工具配置** | 15% | TOOLS.md | 工具定义是否完整 |
| **协作网络** | 10% | AGENTS.md | 与其他 Agent 协作关系是否定义 |
| **记忆管理** | 10% | MEMORY.md | 记忆策略是否有定义 |

**评分逻辑**：
- 读取 Agent 的 workspace 目录下所有 .md 文件
- 分析字段完整性
- 分析内容深度（是否有实质性定义 vs 空壳）
- 可选：跑测试用例打分

**输出**：
- 总分：0-100
- 等级：E/D/C/B/A/S
- 雷达图

---

### 模块 C：训练模式选择

**功能描述**：
- 全新训练：从零开始
- 迭代升级：基于现有版本提升

**训练模式**：

| 模式 | 描述 | 适用场景 |
|------|------|---------|
| **New Training** | 从头创建 | 新 Agent |
| **Level Up** | 基于现有提升 | 已有 Agent 优化 |
| **Skill Inject** | 注入特定方法论 | 需要补强某方面 |

**游戏化元素**：
- 段位系统：Bronze → Silver → Gold → Diamond
- 升级需要"训练点数"
- 每次升级有经验值增长

---

### 模块 D：Construct 训练空间（对话）

**功能描述**：
- 纯白背景的训练界面
- 3-5 轮对话收集信息
- AI 引导式提问

**对话流程**：
```
Round 1: 岗位确认 + 核心特质收集
Round 2: 沟通风格 + 做事方式
Round 3: 边界底线 + 行业场景
Round 4: 确认 + 补充
Round 5: 最终确认
```

**训练方式选择**：
1. 描述更强的样子（用户口述理想状态）
2. 注入行业标准方法论（AI 推荐）
3. 分析优秀案例（参考标杆）
4. 知识库增强（注入领域知识）
5. 场景化调优（针对具体场景）

**输出**：
- 更新后的系统提示词
- 方法论列表
- 风格定义

---

### 模块 E：训练动画（核心亮点）

**功能描述**：
- 20-30 秒的训练动画
- 像素风小人练功夫
- 黑客帝国代码雨背景

**动画阶段**：

| 阶段 | 时长 | 内容 |
|------|------|------|
| **接入** | 3s | 进入 Construct，白空间加载 |
| **传输** | 5s | 代码流/数据流注入 |
| **训练** | 15s | 像素小人练功夫（多种动作） |
| **觉醒** | 5s | 睁眼，能力值飙升动画 |
| **完成** | 2s | "I know [skill]." 提示 |

**视觉效果**：
- 背景：Matrix 绿色代码雨
- 主体：8-bit/像素风格的功夫小人
- 动作：出拳、踢腿、扎马步、翻跟头
- 进度条：Injecting skills... 0% → 100%

**音效**（可选）：
- 接入音效
- 数据传输声
- 训练节奏音
- 完成提示音

---

### 模块 F：升级完成反馈

**功能描述**：
- 展示升级前后的对比
- 仪式感完成提示
- 引导保存

**反馈元素**：

```
┌─────────────────────────────────────────┐
│                                         │
│         ╔═════════════════════╗         │
│         ║  TRAINING COMPLETE  ║         │
│         ╚═════════════════════╝         │
│                                         │
│         "I know SPIN Sales."            │
│                                         │
│  ┌──────────────┬──────────────┐        │
│  │   BEFORE     │    AFTER     │        │
│  │   Lv.2 45%   │   Lv.4 78%   │        │
│  │    ◇         │     ◆        │        │
│  └──────────────┴──────────────┘        │
│                                         │
│  [+33% Capability Boost]                │
│  [段位提升: Bronze → Gold]              │
│                                         │
│         [ Show me ]  [ Save ]           │
│                                         │
└─────────────────────────────────────────┘
```

**台词彩蛋**：
- "I know [methodology]."
- "Show me" 按钮
- "+X% Capability Boost"

---

### 模块 G：配置文件写入

**功能描述**：
- 将训练结果写入 Agent 配置文件
- 支持 OpenClaw 的文件结构

**写入文件（OpenClaw 7层架构）**：
```
~/.openclaw/workspace-{agent-id}/
├── IDENTITY.md        # 身份档案（名字、岗位、特质、语态）
├── SOUL.md            # 灵魂宪法（使命、价值观、哲学底色）
├── HEARTBEAT.md       # 心跳任务（周期性行为定义）
├── USER.md            # 雇主档案（服务对象、协作关系）
├── TOOLS.md           # 工具定义（可用工具及使用规范）
├── AGENTS.md          # Agent 协作（与其他 Agent 的关系）
├── MEMORY.md          # 记忆管理（存储策略）
└── README.md          # 概述文档
```

**配置主文件**：
```
~/.openclaw/openclaw.json
├── agents.list[]      # Agent 列表配置（id, workspace, model）
├── agents.defaults    # 默认配置
└── bindings[]         # 通道绑定（钉钉、AgentLink 等）
```

**写入逻辑**：
1. 备份原文件
2. 生成新内容
3. 写入文件
4. 验证格式

---

## 四、技术架构

### 4.1 模块依赖关系

```
┌─────────────┐
│ 模块 A      │ Agent 列表
│ (前端)      │
└──────┬──────┘
       │
       ▼
┌─────────────┐     ┌─────────────┐
│ 模块 B      │────→│ 模块 C      │
│ 能力评估    │     │ 模式选择    │
│ (后端)      │     │ (前端)      │
└─────────────┘     └──────┬──────┘
                          │
                          ▼
                   ┌─────────────┐
                   │ 模块 D      │
                   │ Construct   │
                   │ (前后端)    │
                   └──────┬──────┘
                          │
                          ▼
                   ┌─────────────┐
                   │ 模块 E      │
                   │ 训练动画    │
                   │ (纯前端)    │
                   └──────┬──────┘
                          │
                          ▼
                   ┌─────────────┐
                   │ 模块 F      │
                   │ 完成反馈    │
                   │ (前端)      │
                   └──────┬──────┘
                          │
                          ▼
                   ┌─────────────┐
                   │ 模块 G      │
                   │ 配置写入    │
                   │ (后端)      │
                   └─────────────┘
```

### 4.2 可并行开发的模块

| 并行组 | 模块 | 说明 |
|--------|------|------|
| **Group 1** | A + B | 列表与评估可并行 |
| **Group 2** | E | 动画完全独立 |
| **Group 3** | D | 对话系统独立 |
| **Group 4** | G | 文件写入独立 |
| **串行** | C → F | 依赖上游 |

---

## 五、子任务拆分

### 子任务 1：Agent 列表页（模块 A）

**负责人**：独立开发
**预估工时**：2 天
**依赖**：无

**任务清单**：
- [ ] 读取 OpenClaw Agent 目录
- [ ] 设计 Agent 卡片组件
- [ ] 实现能力值展示（进度条）
- [ ] 实现选择交互
- [ ] 路由到评估页

**交付物**：
- AgentList.tsx
- AgentCard.tsx
- /agents 路由

---

### 子任务 2：能力评估系统（模块 B）

**负责人**：独立开发
**预估工时**：3 天
**依赖**：无

**任务清单**：
- [ ] 设计评估维度和权重
- [ ] 实现配置文件解析器
- [ ] 实现评分算法
- [ ] 生成雷达图组件
- [ ] 设计等级系统（E-S）

**交付物**：
- evaluateAgent() 函数
- RadarChart.tsx
- AssessmentReport.tsx

---

### 子任务 3：训练模式选择（模块 C）

**负责人**：独立开发
**预估工时**：1 天
**依赖**：模块 A、B

**任务清单**：
- [ ] 设计模式选择界面
- [ ] 实现 New/Upgrade/Inject 选项
- [ ] 显示当前等级和目标等级
- [ ] 路由到 Construct

**交付物**：
- TrainingModeSelector.tsx

---

### 子任务 4：Construct 对话系统（模块 D）

**负责人**：独立开发
**预估工时**：4 天
**依赖**：无

**任务清单**：
- [ ] 设计纯白训练空间 UI
- [ ] 实现对话界面
- [ ] 接入 LLM API（SSE 流式）
- [ ] 实现 5 种训练方式选择
- [ ] 对话状态管理
- [ ] 生成训练结果数据

**交付物**：
- Construct.tsx
- TrainingChat.tsx
- /api/train API
- system prompt 模板

---

### 子任务 5：训练动画（模块 E）⭐ 核心亮点

**负责人**：独立开发
**预估工时**：4 天
**依赖**：无

**任务清单**：
- [ ] 设计像素风功夫小人 sprite
- [ ] 实现代码雨背景动画
- [ ] 实现小人动作序列（出拳、踢腿等）
- [ ] 实现进度条动画
- [ ] 实现阶段切换（接入→传输→训练→觉醒）
- [ ] 可选：音效集成

**交付物**：
- TrainingAnimation.tsx
- PixelFighter.tsx
- CodeRain.tsx
- /assets/sprites/

**技术选型**：
- Canvas / CSS Animation / Lottie
- 像素素材：Aseprite 或现成资源

---

### 子任务 6：升级完成反馈（模块 F）

**负责人**：独立开发
**预估工时**：2 天
**依赖**：模块 B（雷达图复用）

**任务清单**：
- [ ] 设计完成页面 UI
- [ ] 实现 Before/After 对比
- [ ] 实现能力值提升动画
- [ ] 实现台词彩蛋
- [ ] 引导保存操作

**交付物**：
- TrainingComplete.tsx
- BeforeAfterComparison.tsx

---

### 子任务 7：配置文件写入（模块 G）

**负责人**：独立开发
**预估工时**：2 天
**依赖**：模块 D（训练结果）

**任务清单**：
- [ ] 实现 OpenClaw 7层文件结构解析
- [ ] 实现 backup 机制（复制到 workspace-{id}/backup/）
- [ ] 实现各层文件内容生成器（IDENTITY/SOUL/HEARTBEAT/USER/TOOLS/AGENTS）
- [ ] 实现文件写入
- [ ] 实现验证逻辑（确保 markdown 格式正确）

**交付物**：
- writeAgentConfig() 函数 - 写入 7层配置文件
- backupAgent() 函数 - 备份原配置
- /api/save API

---

## 六、接口定义

### 6.1 API 接口

```typescript
// 获取 Agent 列表
GET /api/agents
Response: Agent[]

// 获取 Agent 评估
GET /api/agents/:id/assessment
Response: Assessment

// 开始训练
POST /api/train/start
Request: { agentId: string, mode: 'new' | 'upgrade' | 'inject' }
Response: { sessionId: string }

// 训练对话
POST /api/train/chat
Request: { sessionId: string, message: string }
Response: SSE stream

// 完成训练
POST /api/train/complete
Request: { sessionId: string }
Response: { success: boolean, newScore: number }

// 保存配置
POST /api/agents/:id/save
Request: { config: AgentConfig }
Response: { success: boolean }
```

### 6.2 数据结构

```typescript
interface Agent {
  id: string
  name: string
  title: string
  level: number        // 1-5
  score: number        // 0-100
  rank: 'E' | 'D' | 'C' | 'B' | 'A' | 'S'
  lastTrained?: Date
  status: 'new' | 'trained' | 'upgradable'
}

interface Assessment {
  completeness: number  // 0-100
  accuracy: number
  professionalism: number
  maturity: number
  totalScore: number
  rank: string
  radarData: number[]
}

interface TrainingResult {
  agentId: string
  oldScore: number
  newScore: number
  skills: string[]
  // OpenClaw 7层配置文件
  identity: string      // IDENTITY.md 内容
  soul: string          // SOUL.md 内容
  heartbeat: string     // HEARTBEAT.md 内容
  user: string          // USER.md 内容
  tools: string         // TOOLS.md 内容
  agents: string        // AGENTS.md 内容
}

// OpenClaw 配置结构
interface OpenClawConfig {
  agents: {
    list: Array<{
      id: string
      workspace: string
      model: string
      tools?: object
      sandbox?: object
    }>
    defaults: object
  }
  bindings: Array<{
    agentId: string
    match: { channel: string, accountId: string }
  }>
}

// 评估维度映射到 OpenClaw 文件
interface AssessmentDimensions {
  identity: number      // IDENTITY.md 完整度
  soul: number          // SOUL.md 完整度
  heartbeat: number     // HEARTBEAT.md 完整度
  user: number          // USER.md 完整度
  tools: number         // TOOLS.md 完整度
  agents: number        // AGENTS.md 完整度
  memory: number        // MEMORY.md 完整度
}
```

---

## 七、视觉规范

### 7.1 色彩方案

| 用途 | 颜色 | 色值 |
|------|------|------|
| Matrix 绿 | 主强调色 | `#00FF41` |
| Construct 白 | 训练空间背景 | `#FFFFFF` |
| 深空黑 | 暗色模式背景 | `#0D0208` |
| 能力提升 | 正向变化 | `#4ADE80` |
| 等级金 | 高等级标识 | `#FBBF24` |

### 7.2 动画时长

| 动画 | 时长 |
|------|------|
| 页面切换 | 300ms |
| 卡片 hover | 200ms |
| 能力值变化 | 1000ms |
| 训练动画 | 25-30s |

---

## 八、里程碑

| 阶段 | 目标 | 预计完成 |
|------|------|---------|
| **M1** | 模块 A + B 完成，可看列表和评估 | Day 3 |
| **M2** | 模块 D 完成，可进行对话训练 | Day 7 |
| **M3** | 模块 E 完成，训练动画可用 | Day 11 |
| **M4** | 模块 F + G 完成，完整流程可用 | Day 14 |
| **M5** | 联调 + 优化 + 彩蛋 | Day 16 |

---

## 九、风险与依赖

| 风险 | 影响 | 缓解措施 |
|------|------|---------|
| 动画素材制作耗时 | M3 延期 | 先用占位动画，后期替换 |
| 评估体系不够客观 | 用户体验差 | 预留调优时间 |
| OpenClaw 文件格式变化 | 写入失败 | 做格式兼容 |

---

*文档创建于 2025-03-17，SoulBuilder 2.0 需求文档*
