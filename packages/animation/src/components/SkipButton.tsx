/**
 * 跳过按钮组件
 */

import { memo, useState } from 'react'
import { MATRIX_COLORS } from '@soulbuilder/shared'
import type { SkipButtonProps } from '../types'

/**
 * 跳过按钮
 */
export const SkipButton = memo(function SkipButton({
  onClick,
  visible = true,
}: SkipButtonProps) {
  const [isHovered, setIsHovered] = useState(false)

  if (!visible) return null

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        ...styles.button,
        backgroundColor: isHovered ? MATRIX_COLORS.green : 'transparent',
        color: isHovered ? MATRIX_COLORS.black : MATRIX_COLORS.green,
        boxShadow: isHovered ? `0 0 20px ${MATRIX_COLORS.green}` : 'none',
      }}
    >
      Skip →
    </button>
  )
})

const styles: Record<string, React.CSSProperties> = {
  button: {
    position: 'absolute',
    bottom: '2rem',
    right: '2rem',
    padding: '0.5rem 1.25rem',
    fontFamily: 'monospace',
    fontSize: '0.875rem',
    letterSpacing: '1px',
    border: `1px solid ${MATRIX_COLORS.green}`,
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
}

export default SkipButton
