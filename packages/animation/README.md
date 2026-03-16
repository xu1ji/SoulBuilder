# @soulbuilder/animation

> SoulBuilder 2.0 仪式感训练动画

## 🎯 项目职责

开发一个 Matrix 风格的训练动画，让用户感受到 "我的 Agent 瞬间变强了" 的仪式感。

### 核心功能
1. 代码雨背景（Matrix 经典元素）
2. 像素风功夫小人动画
3. 5 阶段训练动画序列
4. 升级完成反馈动画

---

## ❓ 已确认的问题答案

### 1. 像素小人实现方式
**Canvas 绘制**
- 使用 Canvas API 绘制像素风格小人
- 不需要外部 sprite 素材
- 用代码绘制简单的像素形状

**示例代码**：
```typescript
// 像素小人绘制
function drawPixelFighter(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number) {
  const pixels = FIGHTER_FRAMES[frame % FIGHTER_FRAMES.length]
  ctx.fillStyle = MATRIX_COLORS.green
  pixels.forEach(([px, py]) => {
    ctx.fillRect(x + px * 4, y + py * 4, 4, 4)
  })
}

// 帧数据（简单像素坐标）
const FIGHTER_FRAMES = [
  // 站立帧
  [[2,0],[1,1],[2,1],[3,1],[2,2],[1,3],[3,3],[1,4],[3,4]],
  // 出拳帧
  [[2,0],[1,1],[2,1],[3,1],[2,2],[1,3],[3,3],[4,3],[5,3],[1,4],[3,4]],
  // ... 更多帧
]
```

### 2. 音效范围
**MVP 范围内不包含音效**
- 标注为可选功能
- 如果有时间可以添加，但不是必须
- 优先保证动画效果

### 3. 跳过按钮交互
**跳过后仍需触发 onComplete**
- 跳过 = 快进到完成状态
- 不跳过任何数据，只是跳过动画展示
- onComplete 必须被调用

```tsx
// 实现方式
const handleSkip = () => {
  setIsSkipped(true)
  // 立即显示完成状态
  setCurrentPhase('complete')
  // 500ms 后触发 onComplete
  setTimeout(() => {
    onComplete()
  }, 500)
}
```

### 4. 响应式适配
**最小支持 375px 宽度**
- 适配 iPhone SE 及以上
- 移动端优先

**断点**：
- Mobile: 375px - 767px
- Tablet: 768px - 1023px
- Desktop: 1024px+

**响应式策略**：
```tsx
// 画布尺寸
const getCanvasSize = () => {
  const width = Math.min(window.innerWidth, 800)
  const height = Math.min(window.innerHeight * 0.6, 500)
  return { width, height }
}
```

---

## 🎬 视觉参考

### 电影场景
- **Neo 学功夫** - Tank 说 "I know Kung Fu"
- **数据下载** - 后脑插管，数据流动
- **技能注入** - "Jujitsu... I'm going to learn Jujitsu."

### 设计风格
- 8-bit / 像素风格小人
- Matrix 绿色代码雨
- 极简科幻感

---

## 📦 交付物

### 1. 主动画组件
```tsx
// src/components/TrainingAnimation.tsx
import { AnimationProps, AnimationPhase, MATRIX_COLORS } from '@soulbuilder/shared'

export function TrainingAnimation({
  config,
  onComplete,
  onPhaseChange,
  skipable = true
}: AnimationProps) {
  const [currentPhase, setCurrentPhase] = useState<AnimationPhase>('enter')
  const [progress, setProgress] = useState(0)
  const [isSkipped, setIsSkipped] = useState(false)

  // 阶段切换逻辑
  // 动画播放逻辑
  // 跳过逻辑

  return (
    <div className="training-animation">
      <CodeRain />
      <PixelFighter action={getActionForPhase(currentPhase)} />
      <ProgressOverlay phase={currentPhase} progress={progress} />
      {skipable && <SkipButton onClick={handleSkip} />}
    </div>
  )
}
```

### 2. 代码雨组件
```tsx
// src/components/CodeRain.tsx
import { MATRIX_COLORS } from '@soulbuilder/shared'

export function CodeRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    let animationId: number

    const columns = initColumns(canvas)
    const fontSize = 14

    function draw() {
      // 半透明黑色覆盖（拖尾效果）
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // 绿色字符
      ctx.fillStyle = MATRIX_COLORS.green
      ctx.font = `${fontSize}px monospace`

      columns.forEach((y, i) => {
        const char = getRandomChar()
        ctx.fillText(char, i * fontSize, y * fontSize)

        if (y * fontSize > canvas.height && Math.random() > 0.975) {
          columns[i] = 0
        }
        columns[i]++
      })

      animationId = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(animationId)
  }, [])

  return <canvas ref={canvasRef} className="code-rain" />
}

function getRandomChar(): string {
  // 日文片假名 + 数字
  const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789'
  return chars[Math.floor(Math.random() * chars.length)]
}
```

### 3. 像素小人组件
```tsx
// src/components/PixelFighter.tsx
import { MATRIX_COLORS } from '@soulbuilder/shared'

type FighterAction = 'idle' | 'punch' | 'kick' | 'stance' | 'flip' | 'meditate' | 'awaken'

interface PixelFighterProps {
  action: FighterAction
}

export function PixelFighter({ action }: PixelFighterProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [frame, setFrame] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame(f => (f + 1) % getFrameCount(action))
    }, 100)
    return () => clearInterval(interval)
  }, [action])

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawFighter(ctx, action, frame)
  }, [action, frame])

  return <canvas ref={canvasRef} width={120} height={160} />
}

function drawFighter(ctx: CanvasRenderingContext2D, action: FighterAction, frame: number) {
  const frames = FIGHTER_ACTIONS[action]
  const pixels = frames[frame % frames.length]

  ctx.fillStyle = MATRIX_COLORS.green
  pixels.forEach(([x, y]) => {
    ctx.fillRect(40 + x * 4, 40 + y * 4, 4, 4)
  })
}

// 像素帧数据
const FIGHTER_ACTIONS: Record<FighterAction, number[][][]> = {
  idle: [
    [[2,0],[1,1],[2,1],[3,1],[2,2],[1,3],[3,3],[1,4],[3,4],[2,5],[2,6]],
    [[2,0],[1,1],[2,1],[3,1],[2,2],[1,3],[3,3],[1,4],[3,4],[2,5],[2,6],[2,7]],
  ],
  punch: [
    [[2,0],[1,1],[2,1],[3,1],[2,2],[1,3],[3,3],[4,3],[5,3],[1,4],[3,4]],
  ],
  // ... 更多动作
}
```

### 4. 进度覆盖层
```tsx
// src/components/ProgressOverlay.tsx
import { AnimationPhase, MATRIX_COLORS } from '@soulbuilder/shared'

interface ProgressOverlayProps {
  phase: AnimationPhase
  progress: number
  skill?: string
}

const PHASE_LABELS: Record<AnimationPhase, string> = {
  enter: 'Entering Construct...',
  transfer: 'Transferring data...',
  training: 'Training in progress...',
  awakening: 'Awakening...',
  complete: 'I know',
}

export function ProgressOverlay({ phase, progress, skill }: ProgressOverlayProps) {
  return (
    <div className="progress-overlay">
      <div className="phase-label" style={{ color: MATRIX_COLORS.green }}>
        {phase === 'complete' ? `I know ${skill}.` : PHASE_LABELS[phase]}
      </div>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${progress}%`, backgroundColor: MATRIX_COLORS.green }}
        />
      </div>
      <div className="progress-text" style={{ color: MATRIX_COLORS.green }}>
        {Math.round(progress)}%
      </div>
    </div>
  )
}
```

### 5. Before/After 对比组件
```tsx
// src/components/BeforeAfterComparison.tsx
import { AgentRank, MATRIX_COLORS } from '@soulbuilder/shared'

interface BeforeAfterComparisonProps {
  before: { score: number; rank: AgentRank }
  after: { score: number; rank: AgentRank }
  skills: string[]
}

export function BeforeAfterComparison({ before, after, skills }: BeforeAfterComparisonProps) {
  return (
    <div className="comparison">
      <div className="before">
        <div className="label">BEFORE</div>
        <div className="rank">{before.rank}</div>
        <div className="score">{before.score}%</div>
      </div>
      <div className="arrow">→</div>
      <div className="after">
        <div className="label">AFTER</div>
        <div className="rank" style={{ color: MATRIX_COLORS.gold }}>{after.rank}</div>
        <div className="score" style={{ color: MATRIX_COLORS.success }}>{after.score}%</div>
      </div>
      <div className="boost" style={{ color: MATRIX_COLORS.success }}>
        +{after.score - before.score}% Boost
      </div>
      <div className="skills">
        {skills.map(skill => (
          <span key={skill} className="skill-tag">I know {skill}</span>
        ))}
      </div>
    </div>
  )
}
```

---

## 🎬 动画阶段

| 阶段 | 时长 | 小人动作 | 显示文字 |
|------|------|---------|---------|
| enter | 3s | 不可见 | Entering Construct... |
| transfer | 5s | meditate | Transferring data... |
| training | 15s | punch/kick/stance/flip | Training in progress... X% |
| awakening | 5s | awaken | Awakening... |
| complete | 2s | idle | I know [skill]. |

---

## 📁 文件结构

```
animation/
├── src/
│   ├── index.ts                    # 导出入口
│   ├── components/
│   │   ├── TrainingAnimation.tsx   # 主组件
│   │   ├── CodeRain.tsx            # 代码雨
│   │   ├── PixelFighter.tsx        # 像素小人
│   │   ├── ProgressOverlay.tsx     # 进度显示
│   │   ├── BeforeAfterComparison.tsx
│   │   └── SkipButton.tsx          # 跳过按钮
│   ├── hooks/
│   │   ├── useAnimation.ts         # 动画控制
│   │   └── useCanvas.ts            # Canvas hook
│   ├── constants/
│   │   └── frames.ts               # 像素帧数据
│   └── styles/
│       └── animation.css
├── tests/
│   └── animation.test.tsx
├── package.json
└── README.md
```

---

## 🎨 样式

```css
/* src/styles/animation.css */
.training-animation {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.code-rain {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.progress-overlay {
  position: relative;
  z-index: 10;
  text-align: center;
}

.phase-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.progress-bar {
  width: 300px;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  transition: width 0.1s ease;
}

.skip-button {
  position: absolute;
  bottom: 2rem;
  right: 2rem;
  padding: 0.5rem 1rem;
  background: transparent;
  border: 1px solid #00FF41;
  color: #00FF41;
  cursor: pointer;
  font-family: monospace;
}

.skip-button:hover {
  background: rgba(0, 255, 65, 0.1);
}
```

---

## 📊 完成标准

- [ ] CodeRain 代码雨动画流畅（60fps）
- [ ] PixelFighter 有 5+ 种动作
- [ ] 5 阶段动画序列完整
- [ ] ProgressOverlay 显示正确
- [ ] BeforeAfterComparison 动画
- [ ] SkipButton 可跳过并触发 onComplete
- [ ] 响应式适配 375px+

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
npm install
npm run dev
```

---

*文档更新于 2025-03-17*
