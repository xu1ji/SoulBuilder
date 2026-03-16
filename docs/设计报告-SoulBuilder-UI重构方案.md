# SoulBuilder UI 重构设计报告

> 本报告基于 GetDraft.ai 和 HelloIM 项目设计语言分析，制定 SoulBuilder 的交互设计与设计宪法

---

## 一、设计目标

### 1.1 核心目标

| 目标 | 描述 |
|-----|------|
| **视觉一致性** | 与 HelloIM 项目保持统一设计语言，为未来合并做准备 |
| **用户体验** | 简洁、专业、流畅的苹果风格体验 |
| **品牌调性** | 专业可信赖、轻量化、不喧宾夺主 |
| **交互体验** | 引导式对话感、渐进式信息收集、即时反馈 |

### 1.2 设计哲学

```
┌─────────────────────────────────────────────────────────────┐
│                     设计哲学三原则                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. Less is More                                            │
│     ├── 去除不必要的装饰元素                                   │
│     ├── 留白是最好的分割线                                     │
│     └── 内容优先，UI 服务于内容                                │
│                                                             │
│  2. Calm Technology                                          │
│     ├── 界面不抢戏，让用户专注于对话                            │
│     ├── 动画克制，只在有意义的地方使用                          │
│     └── 颜色内敛，避免视觉疲劳                                 │
│                                                             │
│  3. Progressive Disclosure                                   │
│     ├── 渐进式展示信息，不一次性轰炸用户                        │
│     ├── 步骤清晰，用户始终知道自己在哪里                        │
│     └── 即时反馈，每个操作都有回应                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 二、设计宪法

### 2.1 色彩系统

```css
/* 主色调 - 白色苹果风（与 HelloIM 完全一致）*/
--bg-primary: #ffffff;        /* 主背景 */
--bg-secondary: #F8F9FA;      /* 次级背景（卡片、侧边栏）*/
--bg-tertiary: #f3f4f6;       /* 三级背景（hover、选中态）*/

/* 文字层次 */
--text-primary: #111827;      /* 主文字 - 标题、重点内容 */
--text-secondary: #6b7280;    /* 次级文字 - 描述、说明 */
--text-tertiary: #9ca3af;     /* 三级文字 - 辅助信息、时间戳 */

/* 边框与分割 */
--border-subtle: #e5e7eb;     /* 细边框 */
--border-light: #f3f4f6;      /* 更浅的边框 */

/* 强调色 - 与 HelloIM 保持一致 */
--accent-primary: #000000;    /* 主强调色 - 黑色（主要按钮）*/
--accent-gradient: linear-gradient(135deg, #8b5cf6, #3b82f6);  /* 紫蓝渐变 - 装饰 */
--accent-blue: #3b82f6;       /* 蓝色 - 链接、对话状态 */
--accent-purple: #8b5cf6;     /* 紫色 - 思考状态、渐变装饰 */
--accent-amber: #f59e0b;      /* 琥珀色 - 工作状态、警示 */
--accent-green: #10b981;      /* 绿色 - 成功、完成 */
--accent-red: #ef4444;        /* 红色 - 忙碌状态、错误 */

/* 消息气泡 - 与 HelloIM Chat.tsx 一致 */
--message-bg-human: #000000;  /* 用户消息 - 黑色 */
--message-bg-agent: #ffffff;  /* AI 消息 - 白色 */
--message-text-human: #ffffff;
--message-text-agent: #1f2937;
```

**关键变更**：
- ❌ 之前错误：主强调色用紫色 `#8b5cf6`
- ✅ 现在正确：主强调色用黑色 `#000000`，与 HelloIM 一致
- ✅ 紫蓝渐变保留：仅用于头像、装饰性元素

### 2.2 字体系统

```css
/* 主字体 - 系统字体栈 */
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
             'Helvetica Neue', Arial, sans-serif;

/* 代码字体 */
font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

/* 字体大小 */
--text-xs: 0.75rem;     /* 12px - 辅助信息 */
--text-sm: 0.875rem;    /* 14px - 正文、描述 */
--text-base: 1rem;      /* 16px - 主要内容 */
--text-lg: 1.125rem;    /* 18px - 小标题 */
--text-xl: 1.25rem;     /* 20px - 标题 */
--text-2xl: 1.5rem;     /* 24px - 大标题 */

/* 字重 */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### 2.3 间距系统

```css
/* 基于 4px 的间距系统 */
--space-0.5: 0.125rem;  /* 2px */
--space-1: 0.25rem;     /* 4px */
--space-1.5: 0.375rem;  /* 6px */
--space-2: 0.5rem;      /* 8px */
--space-3: 0.75rem;     /* 12px */
--space-4: 1rem;        /* 16px */
--space-5: 1.25rem;     /* 20px */
--space-6: 1.5rem;      /* 24px */
--space-8: 2rem;        /* 32px */
--space-10: 2.5rem;     /* 40px */
```

### 2.4 圆角系统

```css
--radius-sm: 0.25rem;    /* 4px - 小元素（标签） */
--radius-md: 0.5rem;     /* 8px - 中等元素（按钮） */
--radius-lg: 0.75rem;    /* 12px - 大元素（输入框） */
--radius-xl: 1rem;       /* 16px - 卡片 */
--radius-2xl: 1.5rem;    /* 24px - 大卡片、模态框 */
--radius-full: 9999px;   /* 圆形 */
```

### 2.5 阴影系统

```css
/* 克制的阴影 - 只在必要处使用 */
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
```

### 2.6 动画规范

```css
/* 弹性动画 - Spring 效果 */
--spring-stiffness: 200;
--spring-damping: 20;

/* 标准过渡 */
--transition-fast: 150ms ease;
--transition-normal: 200ms ease;
--transition-slow: 300ms ease;

/* 动画原则 */
1. 只在有意义的地方使用动画（状态变化、引导注意）
2. 避免纯装饰性动画
3. hover 效果要微妙（轻微位移、阴影变化）
4. 重要状态变化使用 spring 动画
5. 页面切换使用 fade + slide 组合
```

---

## 三、交互设计

### 3.1 页面结构

```
┌─────────────────────────────────────────────────────────────┐
│  ┌───────┐                                                  │
│  │ Logo  │  SoulBuilder                      [? 帮助]      │
│  └───────┘                                   48px Header   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────┐               │
│  │                                         │               │
│  │         对话区域 (Chat Panel)            │    预览区域    │
│  │                                         │    Preview    │
│  │    [Phase 进度指示器]                    │    Panel      │
│  │                                         │               │
│  │    AI: 你好！我是灵魂赋能师...           │   ┌─────┐    │
│  │                                         │   │ 画  │    │
│  │    User: 我想创建一个销售总监            │   │ 像  │    │
│  │                                         │   │ 预  │    │
│  │    AI: 好的！让我来帮你...              │   │ 览  │    │
│  │                                         │   │     │    │
│  │    [...对话消息流...]                   │   └─────┘    │
│  │                                         │               │
│  │    ┌─────────────────────────────┐     │               │
│  │    │ 输入框                       │ 📎  │               │
│  │    └─────────────────────────────┘     │               │
│  │                                         │               │
│  └─────────────────────────────────────────┘               │
│                                                             │
└─────────────────────────────────────────────────────────────┘

响应式布局：
- 桌面端：左侧对话 60%，右侧预览 40%
- 平板端：左侧对话 100%，预览为滑出面板
- 移动端：全屏对话，预览通过底部按钮触发
```

### 3.2 六阶段对话流程

```
┌─────────────────────────────────────────────────────────────┐
│                    6-Phase 对话流程                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Phase 1: 破冰识别                                          │
│  ├── 触发：用户首次输入岗位描述                              │
│  ├── AI 行为：识别岗位类型 + 生成初步名字                    │
│  ├── 用户操作：确认或修正                                    │
│  └── 产出：v1.0 骨架版画像                                   │
│                                                             │
│  Phase 2: 愿景引导                                          │
│  ├── 触发：岗位确认后                                        │
│  ├── AI 行为：追问 2-3 个愿景类问题                          │
│  ├── 问题示例："在你心目中，这个岗位做到顶级是什么样子？"      │
│  └── 产出：v1.5 血肉版画像                                   │
│                                                             │
│  Phase 3: 方法论注入                                        │
│  ├── 触发：愿景收集完成                                      │
│  ├── AI 行为：展示搜索过程 + 注入方法论                      │
│  ├── 可视化：搜索动画 + 来源卡片                             │
│  └── 产出：v1.8 方法论版画像                                 │
│                                                             │
│  Phase 4: 业务注入                                          │
│  ├── 触发：方法论注入完成                                    │
│  ├── AI 行为：询问雇主/业务信息                              │
│  ├── 收集：行业、团队规模、特殊要求                          │
│  └── 产出：v2.0 灵魂版画像                                   │
│                                                             │
│  Phase 5: 打磨优化                                          │
│  ├── 触发：业务注入完成                                      │
│  ├── AI 行为：展示画像 + 询问调整                            │
│  ├── 用户操作：微调或确认                                    │
│  └── 产出：v3.0 打磨版画像                                   │
│                                                             │
│  Phase 6: 导出交付                                          │
│  ├── 触发：用户确认满意                                      │
│  ├── AI 行为：展示导出选项                                   │
│  ├── 用户操作：选择导出格式                                  │
│  └── 产出：MD 报告 / ZIP 配置包                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 3.3 核心组件设计

#### 3.3.1 Phase 进度指示器

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   ●━━━━━●━━━━━○━━━━━○━━━━━○━━━━━○                          │
│   破冰   愿景   方法   业务   打磨   导出                     │
│                                                             │
│   ● 已完成阶段（黑色填充）                                   │
│   ○ 未完成阶段（灰色空心）                                   │
│   当前阶段有脉冲动画                                         │
│                                                             │
│   交互：点击已完成阶段可回看对话                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### 3.3.2 消息气泡设计

```
用户消息（右对齐，黑色背景）：
┌────────────────────────────────────┐
│                                    │
│  我想创建一个销售总监的 AI 员工     │  ← 白色文字
│                                    │
└────────────────────────────────────┘
  border-radius: 16px 16px 4px 16px
  background: #000000

AI 消息（左对齐，白色背景，带头像）：
┌────┐
│ 🎭 │ ┌────────────────────────────────────┐
│    │ │ 好的！让我来帮你创建销售总监...     │  ← 深色文字
└────┘ │                                    │
       │ 我有几个问题想先了解：              │
       │ 1. 这个岗位主要负责什么？           │
       └────────────────────────────────────┘
         border-radius: 16px 16px 16px 4px
         background: #ffffff
         border: 1px solid #e5e7eb
```

#### 3.3.3 画像预览卡片

```
┌─────────────────────────────────────────────────────────────┐
│  ┌────┐                                                    │
│  │ 🎭 │  Trumind                              v2.0 灵魂版  │
│  └────┘  CEO 影子分身                                      │
│  ─────────────────────────────────────────────────────────  │
│                                                            │
│  【基础档案】                                               │
│  • 职位：CEO 战略分身                                       │
│  • 职责：ROI 审判、战略咨询、镜像对话                        │
│  • 性格：极简、ROI 导向、直言不讳                           │
│                                                            │
│  【灵魂准则】                          [展开 ▼]            │
│  • 非机器人宣言：我即是你...                                │
│  • 核心信仰：零执行政策                                     │
│                                                            │
│  【独门方法论】                        [展开 ▼]            │
│  • ROI 4D 审判法                                          │
│  • 镜像对话技术                                            │
│                                                            │
│  ─────────────────────────────────────────────────────────  │
│  画像质量：⭐⭐⭐⭐⭐ 95 分                                 │
│                                                            │
└─────────────────────────────────────────────────────────────┘
```

#### 3.3.4 搜索动画

```
方法论搜索中：

┌─────────────────────────────────────────────────────────────┐
│  🔍 正在搜索"销售总监"最佳实践...                           │
│                                                            │
│  [████████████░░░░░░░░░░░░░░░░░░░░] 45%                    │
│                                                            │
│  已找到：                                                   │
│  ✓ SPIN 销售法 (Neil Rackham)                             │
│  ✓ Challenger Sale (CEB/Gartner)                          │
│  ○ 正在分析...                                             │
│                                                            │
└─────────────────────────────────────────────────────────────┘
```

#### 3.3.5 导出选项

```
┌─────────────────────────────────────────────────────────────┐
│                                                            │
│   📄 画像报告 (Markdown)                                   │
│   ├── 完整的五层架构文档                                   │
│   └── 适合阅读和分享                                       │
│                                                            │
│   📦 配置文件包 (ZIP)                                      │
│   ├── IDENTITY.md  - 身份档案                              │
│   ├── SOUL.md      - 灵魂宪法                              │
│   ├── HEARTBEAT.md - 心跳引擎                              │
│   ├── AGENT.md     - 运行协议                              │
│   └── USER.md      - 雇主索引                              │
│                                                            │
│                    [导出画像报告]  [导出配置包]             │
│                                                            │
└─────────────────────────────────────────────────────────────┘
```

### 3.4 启动屏设计

```
┌─────────────────────────────────────────────────────────────┐
│                                                            │
│                                                            │
│                                                            │
│                     ┌────────────┐                         │
│                     │     🎭     │                         │
│                     │ SoulBuilder│                         │
│                     └────────────┘                         │
│                                                            │
│              5-15 分钟，打造 80-90 分的 AI 数字员工          │
│                                                            │
│                                                            │
│         ┌─────────────────────────────────────────┐        │
│         │                                         │        │
│         │  描述你想创建的 AI 员工...               │        │
│         │                                         │        │
│         └─────────────────────────────────────────┘        │
│                                                            │
│                     [开始创建 →]                           │
│                                                            │
│                                                            │
│         示例：销售总监、产品经理、CEO 分身...              │
│                                                            │
│                                                            │
└─────────────────────────────────────────────────────────────┘
```

---

## 四、技术实现建议

### 4.1 技术栈选型

与 HelloIM 保持一致：

| 类别 | 技术选型 |
|-----|---------|
| **框架** | React 19 + Vite |
| **样式** | Tailwind CSS 4.x |
| **动画** | Motion (Framer Motion) |
| **状态管理** | Zustand |
| **图标** | Lucide React |
| **Markdown** | react-markdown + remark-gfm |
| **工具函数** | clsx + tailwind-merge |

### 4.2 目录结构

```
soulbuilder/
├── src/
│   ├── components/
│   │   ├── chat/
│   │   │   ├── ChatPanel.tsx       # 对话主面板
│   │   │   ├── MessageBubble.tsx   # 消息气泡
│   │   │   ├── InputArea.tsx       # 输入区域
│   │   │   ├── PhaseIndicator.tsx  # 阶段指示器
│   │   │   └── TypingIndicator.tsx # 打字指示器
│   │   ├── preview/
│   │   │   ├── PreviewPanel.tsx    # 预览主面板
│   │   │   ├── PortraitCard.tsx    # 画像卡片
│   │   │   ├── SoulSection.tsx     # 灵魂准则折叠
│   │   │   └── MethodologySection.tsx
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── ProgressBar.tsx
│   │   └── layout/
│   │       ├── Header.tsx
│   │       └── SplashScreen.tsx
│   ├── stores/
│   │   ├── chatStore.ts     # 对话状态
│   │   └── portraitStore.ts # 画像状态
│   ├── lib/
│   │   ├── api.ts           # API 调用
│   │   └── utils.ts         # 工具函数
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css            # 全局样式 + CSS 变量
├── package.json
├── vite.config.ts
└── tailwind.config.ts
```

### 4.3 关键组件代码示例

#### Button 组件

```tsx
import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center font-medium transition-all',
        'rounded-lg disabled:opacity-50 disabled:cursor-not-allowed',
        // Variants
        variant === 'primary' && 'bg-black text-white hover:bg-gray-800 shadow-lg shadow-black/10',
        variant === 'secondary' && 'border border-gray-200 text-gray-700 hover:bg-gray-50',
        variant === 'ghost' && 'text-gray-600 hover:bg-gray-100',
        // Sizes
        size === 'sm' && 'px-3 py-1.5 text-sm',
        size === 'md' && 'px-4 py-2 text-sm',
        size === 'lg' && 'px-6 py-3 text-base'
      )}
      disabled={props.disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </button>
  );
}
```

#### MessageBubble 组件

```tsx
import { motion } from 'motion/react';
import { clsx } from 'clsx';

interface MessageBubbleProps {
  type: 'user' | 'assistant';
  children: React.ReactNode;
  avatar?: string;
}

export function MessageBubble({ type, children, avatar }: MessageBubbleProps) {
  const isUser = type === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={clsx(
        'flex gap-3 mb-4',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white shrink-0">
          {avatar || '🎭'}
        </div>
      )}
      <div
        className={clsx(
          'max-w-[70%] px-4 py-3',
          isUser
            ? 'bg-black text-white rounded-2xl rounded-br-sm'
            : 'bg-white border border-gray-200 text-gray-800 rounded-2xl rounded-bl-sm shadow-sm'
        )}
      >
        {children}
      </div>
    </motion.div>
  );
}
```

---

## 五、与 HelloIM 的兼容性

### 5.1 设计语言对齐

| 维度 | HelloIM | SoulBuilder | 兼容性 |
|-----|---------|-------------|-------|
| **主色调** | 白色 + 黑色强调 | 白色 + 黑色强调 | ✅ 完全一致 |
| **字体** | 系统字体栈 | 系统字体栈 | ✅ 完全一致 |
| **圆角** | 16px 大圆角 | 16px 大圆角 | ✅ 完全一致 |
| **阴影** | 轻微阴影 | 轻微阴影 | ✅ 完全一致 |
| **动画** | Motion spring | Motion spring | ✅ 完全一致 |
| **图标** | Lucide React | Lucide React | ✅ 完全一致 |

### 5.2 合并路径

```
Phase 1: 独立开发（当前）
├── SoulBuilder 作为独立 Web 应用
└── 共享设计系统，但独立部署

Phase 2: 嵌入模式
├── SoulBuilder 作为 HelloIM 的子模块
├── 在 HelloIM 中创建 Agent 时调用 SoulBuilder
└── 生成配置文件直接注入 HelloIM

Phase 3: 深度整合
├── 统一代码库
├── 共享组件库
└── 统一用户体系
```

---

## 六、实施计划

### Phase 1: 基础框架（2-3 天）

- [ ] 搭建 React + Vite + Tailwind 项目
- [ ] 实现设计系统（CSS 变量、基础组件）
- [ ] 实现启动屏
- [ ] 实现对话面板基础布局

### Phase 2: 核心交互（3-4 天）

- [ ] 实现消息气泡组件
- [ ] 实现 Phase 进度指示器
- [ ] 实现输入区域
- [ ] 实现打字指示器
- [ ] 实现画像预览卡片

### Phase 3: 对话引擎（3-4 天）

- [ ] 接入后端 API
- [ ] 实现流式响应
- [ ] 实现六阶段对话逻辑
- [ ] 实现方法论搜索动画

### Phase 4: 导出功能（1-2 天）

- [ ] 实现 MD 报告导出
- [ ] 实现 ZIP 配置包导出
- [ ] 实现导出成功动画

### Phase 5: 打磨优化（1-2 天）

- [ ] 响应式适配
- [ ] 动画细节调整
- [ ] 性能优化
- [ ] 无障碍优化

---

## 七、总结

### 7.1 设计宪法核心要点

1. **颜色**：白色为主，**黑色强调**（主要按钮），紫蓝渐变装饰
2. **字体**：系统字体栈，苹果风格
3. **圆角**：大圆角（16px），柔和友好
4. **阴影**：轻微克制，只在必要处使用
5. **动画**：Motion spring，流畅自然
6. **间距**：基于 4px，留白充足

### 7.2 交互核心要点

1. **渐进式**：6 阶段逐步深入，不一次性展示
2. **即时反馈**：每个操作都有明确回应
3. **可视化**：搜索过程、画像生成过程可见
4. **可控性**：用户可随时查看、调整画像

### 7.3 下一步行动

1. **确认设计宪法**：用户审核并确认本报告
2. **开始 Phase 1**：搭建项目框架
3. **逐步迭代**：按实施计划推进

---

*报告版本：v1.0*
*创建日期：2026-03-15*
*作者：Claude Code*

---

## 附录：标杆设计参考

### A. GetDraft.ai 设计借鉴

从 GetDraft.ai 学习的设计元素：

1. **角色团队展示**：清晰的专家角色卡片（Alex、Sam、Blake、Maya、Olivia）
2. **简洁导航**：顶部简洁的导航结构
3. **渐变按钮**：紫色到蓝色的渐变（适度使用）
4. **FAQ 折叠**：可展开的信息区块
5. **定价卡片**：清晰的功能对比

### B. HelloIM 设计借鉴

从 HelloIM 学习的设计元素：

1. **Modal 设计**：`bg-black/40 backdrop-blur-sm` + 白色卡片 `rounded-2xl shadow-2xl`
2. **步骤向导**：圆点进度指示器 + 阶段标题
3. **状态指示**：彩色小圆点 + 脉冲/呼吸动画
4. **卡片 Hover**：`whileHover={{ y: -4, scale: 1.02, boxShadow: '0 12px 24px -6px rgba(0,0,0,0.12)' }}`
5. **表格/列表**：交替背景 + hover 高亮
6. **按钮渐变**：`bg-gradient-to-r from-purple-500 to-blue-500`

### C. 当前设计 vs 目标设计

| 维度 | 当前设计 | 目标设计 |
|-----|---------|---------|
| **主题** | 深色玻璃拟态 | 白色苹果风 |
| **强调色** | 黑色主按钮 + 紫蓝渐变装饰 | 黑色主按钮 + 紫蓝渐变装饰 | ✅ 完全一致 |
| **圆角** | 较大 (24px+) | 适中 (12-16px) |
| **阴影** | 多层玻璃效果 | 轻微阴影 |
| **动画** | 简单 CSS 过渡 | Spring 弹性动画 |
| **图标** | Emoji | Lucide React |
| **字体** | Inter | 系统字体栈 |
| **卡片** | 发光边框 | 简洁白卡 + 细边框 |
| **整体风格** | 赛博朋克感 | 专业清爽感 |
