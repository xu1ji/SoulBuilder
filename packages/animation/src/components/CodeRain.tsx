/**
 * Matrix 代码雨组件
 */

import { useRef, useEffect, memo } from 'react'
import { MATRIX_COLORS } from '@soulbuilder/shared'
import type { CodeRainProps } from '../types'

// 日文片假名 + 数字
const KATAKANA = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン'
const NUMBERS = '0123456789'
const CHARS = KATAKANA + NUMBERS

/**
 * 随机字符
 */
function getRandomChar(): string {
  return CHARS[Math.floor(Math.random() * CHARS.length)]
}

/**
 * 代码雨组件
 */
export const CodeRain = memo(function CodeRain({
  opacity = 1,
  speed = 1,
  density = 1,
}: CodeRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 设置 canvas 尺寸
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // 初始化列
    const fontSize = 14
    const columns = Math.floor((canvas.width / fontSize) * density)
    const drops: number[] = Array(columns).fill(0).map(() => Math.random() * -50)

    // 动画速度调整
    const baseSpeed = 0.5 * speed
    let lastTime = 0
    const frameInterval = 16 // ~60fps

    // 绘制函数
    const draw = (timestamp: number) => {
      if (timestamp - lastTime < frameInterval) {
        requestAnimationFrame(draw)
        return
      }
      lastTime = timestamp

      // 半透明黑色覆盖（拖尾效果）
      ctx.fillStyle = `rgba(13, 2, 8, ${0.05 / speed})`
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // 绿色字符
      ctx.font = `${fontSize}px monospace`

      for (let i = 0; i < drops.length; i++) {
        const char = getRandomChar()

        // 头部字符（更亮）
        const y = drops[i] * fontSize
        if (y > 0 && y < canvas.height) {
          // 头部 - 白色
          ctx.fillStyle = MATRIX_COLORS.white
          ctx.fillText(char, i * fontSize, y)

          // 尾部 - 绿色渐变
          const tailLength = 20
          for (let t = 1; t < tailLength; t++) {
            const tailY = y - t * fontSize
            if (tailY > 0) {
              const alpha = 1 - t / tailLength
              ctx.fillStyle = `rgba(0, 255, 65, ${alpha * 0.8})`
              ctx.fillText(getRandomChar(), i * fontSize, tailY)
            }
          }
        }

        // 重置或继续下落
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i] += baseSpeed
      }

      requestAnimationFrame(draw)
    }

    const animationId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [opacity, speed, density])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity,
        pointerEvents: 'none',
      }}
    />
  )
})

export default CodeRain
