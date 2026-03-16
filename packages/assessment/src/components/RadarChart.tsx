/**
 * 雷达图组件
 * 使用 Chart.js 渲染 6 维评估结果
 */

import React, { useRef, useEffect, useCallback } from 'react'
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js'
import { Radar } from 'react-chartjs-2'
import { MATRIX_COLORS } from '@soulbuilder/shared'

// 注册 Chart.js 组件
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
)

// 默认标签
const DEFAULT_LABELS = ['Identity', 'Soul', 'User', 'Tools', 'Agents', 'Memory']

// 自定义 Tooltip 外部处理
const externalTooltipHandler = (context: any) => {
  const { chart, tooltip } = context

  if (tooltip.opacity === 0) {
    return
  }

  // Chart.js 会自动处理 tooltip
}

export interface RadarChartProps {
  /** 当前状态数据，长度必须为 6 */
  data: number[]
  /** 目标状态数据（可选），长度必须为 6 */
  target?: number[]
  /** 维度标签（可选） */
  labels?: string[]
  /** 图表大小 */
  size?: number
  /** 主色调 */
  color?: string
  /** 目标色调 */
  targetColor?: string
  /** 是否显示图例 */
  showLegend?: boolean
  /** 是否显示动画 */
  animated?: boolean
  /** 自定义类名 */
  className?: string
  /** Tooltip 自定义渲染 */
  renderTooltip?: (dimension: string, current: number, target?: number) => React.ReactNode
}

export function RadarChart({
  data,
  target,
  labels = DEFAULT_LABELS,
  size = 300,
  color = MATRIX_COLORS.green,
  targetColor = MATRIX_COLORS.gold,
  showLegend = true,
  animated = true,
  className,
}: RadarChartProps): JSX.Element {
  const chartRef = useRef<ChartJS>(null)

  // 数据校验
  if (data.length !== 6) {
    console.warn('RadarChart: data must have 6 elements')
  }

  // 构建数据集
  const datasets = [
    {
      label: '当前状态',
      data: data,
      backgroundColor: hexToRgba(color, 0.25),
      borderColor: color,
      borderWidth: 2,
      pointBackgroundColor: color,
      pointBorderColor: color,
      pointRadius: 4,
      pointHoverRadius: 6,
      pointHoverBackgroundColor: color,
      pointHoverBorderColor: MATRIX_COLORS.white,
      pointHoverBorderWidth: 2,
    },
  ]

  if (target && target.length === 6) {
    datasets.push({
      label: '目标状态',
      data: target,
      backgroundColor: hexToRgba(targetColor, 0.08),
      borderColor: targetColor,
      borderWidth: 2,
      borderDash: [6, 4],
      pointBackgroundColor: targetColor,
      pointBorderColor: targetColor,
      pointRadius: 4,
      pointHoverRadius: 6,
      pointHoverBackgroundColor: targetColor,
      pointHoverBorderColor: MATRIX_COLORS.white,
      pointHoverBorderWidth: 2,
    })
  }

  const chartData = {
    labels,
    datasets,
  }

  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    animation: animated
      ? {
          duration: 800,
          easing: 'easeInOutQuart',
        }
      : false,
    interaction: {
      mode: 'nearest' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        display: showLegend,
        position: 'bottom' as const,
        labels: {
          color: color,
          font: {
            family: "'SF Mono', Monaco, monospace",
            size: 11,
          },
          padding: 15,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(13, 2, 8, 0.95)',
        titleColor: color,
        bodyColor: color,
        borderColor: hexToRgba(color, 0.3),
        borderWidth: 1,
        padding: 10,
        displayColors: true,
        callbacks: {
          label: (context: any) => {
            const label = context.dataset.label || ''
            const value = context.parsed.r
            return `${label}: ${value} 分`
          },
        },
      },
    },
    scales: {
      r: {
        max: 100,
        min: 0,
        beginAtZero: true,
        grid: {
          color: hexToRgba(color, 0.15),
          lineWidth: 1,
        },
        angleLines: {
          color: hexToRgba(color, 0.15),
          lineWidth: 1,
        },
        pointLabels: {
          color: color,
          font: {
            family: "'SF Mono', Monaco, monospace",
            size: 11,
            weight: '500' as const,
          },
          padding: 15,
        },
        ticks: {
          display: true,
          stepSize: 20,
          color: hexToRgba(color, 0.5),
          backdropColor: 'transparent',
          font: {
            size: 9,
          },
        },
      },
    },
    onHover: (event: any, elements: any[]) => {
      if (event.native?.target) {
        event.native.target.style.cursor = elements.length ? 'pointer' : 'default'
      }
    },
  }

  return (
    <div
      className={className}
      style={{ width: size, height: size, position: 'relative' }}
    >
      <Radar ref={chartRef} data={chartData} options={options} />
    </div>
  )
}

/**
 * HEX 转 RGBA
 */
function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export default RadarChart
