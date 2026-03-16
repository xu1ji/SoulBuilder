/**
 * Canvas hook - 管理 Canvas 生命周期和响应式
 */

import { useEffect, useRef, useState, useCallback } from 'react'

interface CanvasSize {
  width: number
  height: number
}

interface UseCanvasOptions {
  onDraw?: (ctx: CanvasRenderingContext2D, size: CanvasSize) => void
  fps?: number
}

interface UseCanvasReturn {
  canvasRef: React.RefObject<HTMLCanvasElement>
  ctx: CanvasRenderingContext2D | null
  size: CanvasSize
}

/**
 * 获取响应式 Canvas 尺寸
 */
function getCanvasSize(): CanvasSize {
  const width = Math.min(window.innerWidth, 800)
  const height = Math.min(window.innerHeight * 0.6, 500)
  return { width, height }
}

/**
 * Canvas hook
 */
export function useCanvas(options: UseCanvasOptions = {}): UseCanvasReturn {
  const { onDraw, fps = 60 } = options
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null)
  const [size, setSize] = useState<CanvasSize>(getCanvasSize)
  const animationRef = useRef<number>()

  // 初始化 Canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext('2d')
    if (!context) return

    setCtx(context)

    // 设置初始尺寸
    const initialSize = getCanvasSize()
    canvas.width = initialSize.width
    canvas.height = initialSize.height
    setSize(initialSize)
  }, [])

  // 响应式调整
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current
      if (!canvas) return

      const newSize = getCanvasSize()
      canvas.width = newSize.width
      canvas.height = newSize.height
      setSize(newSize)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // 绘制循环
  useEffect(() => {
    if (!ctx || !onDraw) return

    const frameInterval = 1000 / fps
    let lastTime = 0

    const draw = (currentTime: number) => {
      if (currentTime - lastTime >= frameInterval) {
        onDraw(ctx, size)
        lastTime = currentTime
      }
      animationRef.current = requestAnimationFrame(draw)
    }

    animationRef.current = requestAnimationFrame(draw)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [ctx, onDraw, fps, size])

  return { canvasRef, ctx, size }
}

/**
 * 简化版 Canvas hook - 只提供 ref 和 context
 */
export function useCanvasRef() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext('2d')
    if (context) {
      setCtx(context)
    }
  }, [])

  return { canvasRef, ctx }
}
