/**
 * 像素小人组件
 */

import { useRef, useEffect, useState, memo } from 'react'
import { MATRIX_COLORS } from '@soulbuilder/shared'
import type { PixelFighterProps } from '../types'
import { FIGHTER_FRAMES, FRAME_CONFIG } from '../constants/frames'

/**
 * 像素小人组件
 */
export const PixelFighter = memo(function PixelFighter({
  action,
  visible = true,
  scale = 1,
}: PixelFighterProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [frameIndex, setFrameIndex] = useState(0)
  const [glowIntensity, setGlowIntensity] = useState(0)

  const frames = FIGHTER_FRAMES[action] || FIGHTER_FRAMES.idle
  const frameCount = frames.length

  // 帧切换
  useEffect(() => {
    const interval = setInterval(() => {
      setFrameIndex((f) => (f + 1) % frameCount)
    }, FRAME_CONFIG.frameInterval)

    return () => clearInterval(interval)
  }, [frameCount])

  // 觉醒时的发光效果
  useEffect(() => {
    if (action === 'awaken') {
      const interval = setInterval(() => {
        setGlowIntensity((g) => (g + 0.1) % 1)
      }, 50)
      return () => clearInterval(interval)
    } else {
      setGlowIntensity(0)
    }
  }, [action])

  // 绘制
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { width, height } = canvas
    ctx.clearRect(0, 0, width, height)

    if (!visible) return

    const currentFrame = frames[frameIndex % frameCount]
    const pixelSize = FRAME_CONFIG.pixelSize * scale

    // 计算居中偏移
    const offsetX = (width - 8 * pixelSize) / 2
    const offsetY = (height - 12 * pixelSize) / 2

    // 发光效果
    if (action === 'awaken') {
      ctx.shadowColor = MATRIX_COLORS.gold
      ctx.shadowBlur = 20 + glowIntensity * 30
      ctx.fillStyle = MATRIX_COLORS.gold
    } else if (action === 'meditate') {
      ctx.shadowColor = MATRIX_COLORS.green
      ctx.shadowBlur = 15
      ctx.fillStyle = MATRIX_COLORS.green
    } else {
      ctx.shadowColor = MATRIX_COLORS.green
      ctx.shadowBlur = 10
      ctx.fillStyle = MATRIX_COLORS.green
    }

    // 绘制像素
    currentFrame.forEach(([x, y]) => {
      ctx.fillRect(
        offsetX + x * pixelSize,
        offsetY + y * pixelSize,
        pixelSize - 1,
        pixelSize - 1
      )
    })

    // 重置阴影
    ctx.shadowBlur = 0
  }, [action, frameIndex, frames, visible, scale, glowIntensity])

  if (!visible) return null

  return (
    <canvas
      ref={canvasRef}
      width={120 * scale}
      height={160 * scale}
      style={{
        position: 'relative',
        zIndex: 10,
      }}
    />
  )
})

export default PixelFighter
