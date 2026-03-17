/**
 * 像素小人组件 - 使用 CSS box-shadow 实现
 * 迁移自 matrix-kungfu-demo.html
 */

import { useEffect, useState } from 'react'
import './PixelFighter.css'

export type FighterAction = 'idle' | 'punch' | 'kick' | 'training' | 'awakening'

interface PixelFighterProps {
  action: FighterAction
  scale?: number
}

export function PixelFighter({ action, scale = 1 }: PixelFighterProps) {
  const [glowIntensity, setGlowIntensity] = useState(0)

  // 觉醒时的发光强度变化
  useEffect(() => {
    if (action === 'awakening') {
      const interval = setInterval(() => {
        setGlowIntensity((g) => (g + 0.1) % 1)
      }, 50)
      return () => clearInterval(interval)
    } else {
      setGlowIntensity(0)
    }
  }, [action])

  return (
    <div
      className={`pixel-fighter ${action}`}
      style={{
        transform: `scale(${scale * 0.5})`,
        marginLeft: `-${100 * scale}px`,
        filter: action === 'awakening'
          ? `drop-shadow(0 0 ${60 + glowIntensity * 40}px #FBBF24) drop-shadow(0 0 ${100 + glowIntensity * 80}px #FBBF24)`
          : `drop-shadow(0 0 25px #00FF41)`
      }}
    />
  )
}

export default PixelFighter
