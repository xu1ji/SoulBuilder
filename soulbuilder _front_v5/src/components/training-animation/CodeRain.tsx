/**
 * 代码雨组件 - Canvas 中文金句
 * 迁移自 matrix-kungfu-demo.html
 */

import { useEffect, useRef } from 'react'
import { QUOTES, WHITE_WORDS } from './quotes'

interface CodeRainProps {
  fontSize?: number
  speed?: number
  opacity?: number
}

export function CodeRain({ fontSize = 27, speed = 1, opacity = 1 }: CodeRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const dropsRef = useRef<number[]>([])
  const columnQuotesRef = useRef<string[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 设置画布尺寸
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initDrops()
    }

    // 初始化列
    const initDrops = () => {
      const columns = Math.floor(canvas.width / fontSize * 0.7)
      dropsRef.current = []
      columnQuotesRef.current = []

      for (let i = 0; i < columns; i++) {
        dropsRef.current.push(Math.floor(Math.random() * -50))
        columnQuotesRef.current.push(QUOTES[Math.floor(Math.random() * QUOTES.length)])
      }
    }

    resize()
    window.addEventListener('resize', resize)

    // 获取金句中白色字符的位置
    const getWhiteIndices = (quote: string, keyword: string): Set<number> => {
      const indices = new Set<number>()
      const startIdx = quote.indexOf(keyword)
      if (startIdx !== -1) {
        for (let i = 0; i < keyword.length; i++) {
          indices.add(startIdx + i)
        }
      }
      return indices
    }

    // 绘制代码雨
    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.font = `${fontSize}px monospace`

      for (let i = 0; i < dropsRef.current.length; i++) {
        const currentQuote = columnQuotesRef.current[i]
        const charIndex = Math.floor(dropsRef.current[i]) - 1

        const x = i * fontSize * 1.82
        const y = dropsRef.current[i] * fontSize * 1.5

        if (charIndex >= 0 && charIndex < currentQuote.length) {
          const char = currentQuote[charIndex]
          const quoteIndex = QUOTES.indexOf(currentQuote)
          const keyword = WHITE_WORDS[quoteIndex] || ''
          const whiteIndices = getWhiteIndices(currentQuote, keyword)

          // 判断当前字符是否在关键词位置
          if (whiteIndices.has(charIndex)) {
            ctx.fillStyle = '#FFF'
          } else {
            ctx.fillStyle = '#00FF41'
          }
          ctx.fillText(char, x, y)
        }

        // 当金句完全离开屏幕后，重置并换新金句
        if ((dropsRef.current[i] - 1) > currentQuote.length && y > canvas.height) {
          dropsRef.current[i] = 0
          columnQuotesRef.current[i] = QUOTES[Math.floor(Math.random() * QUOTES.length)]
        }

        dropsRef.current[i] += 1 * speed
      }
    }

    const interval = setInterval(draw, 75)

    return () => {
      window.removeEventListener('resize', resize)
      clearInterval(interval)
    }
  }, [fontSize, speed])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity,
        zIndex: 1,
      }}
    />
  )
}

export default CodeRain
