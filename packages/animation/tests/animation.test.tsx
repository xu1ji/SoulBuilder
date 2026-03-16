/**
 * @soulbuilder/animation 测试
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SkipButton } from '../src/components/SkipButton'
import { ProgressOverlay } from '../src/components/ProgressOverlay'
import { FIGHTER_FRAMES, TRAINING_ACTIONS } from '../src/constants/frames'

describe('Animation Package', () => {
  describe('Constants', () => {
    it('should have 7 fighter actions defined', () => {
      const actions = Object.keys(FIGHTER_FRAMES)
      expect(actions).toHaveLength(7)
      expect(actions).toContain('idle')
      expect(actions).toContain('punch')
      expect(actions).toContain('kick')
      expect(actions).toContain('stance')
      expect(actions).toContain('flip')
      expect(actions).toContain('meditate')
      expect(actions).toContain('awaken')
    })

    it('should have 4 training actions', () => {
      expect(TRAINING_ACTIONS).toHaveLength(4)
      expect(TRAINING_ACTIONS).toContain('punch')
      expect(TRAINING_ACTIONS).toContain('kick')
      expect(TRAINING_ACTIONS).toContain('stance')
      expect(TRAINING_ACTIONS).toContain('flip')
    })

    it('each action should have at least 1 frame', () => {
      Object.entries(FIGHTER_FRAMES).forEach(([action, frames]) => {
        expect(frames.length).toBeGreaterThan(0)
      })
    })
  })

  describe('SkipButton', () => {
    it('should render when visible', () => {
      const onClick = vi.fn()
      render(<SkipButton onClick={onClick} visible={true} />)
      expect(screen.getByText('Skip →')).toBeInTheDocument()
    })

    it('should not render when not visible', () => {
      const onClick = vi.fn()
      render(<SkipButton onClick={onClick} visible={false} />)
      expect(screen.queryByText('Skip →')).not.toBeInTheDocument()
    })

    it('should call onClick when clicked', () => {
      const onClick = vi.fn()
      render(<SkipButton onClick={onClick} visible={true} />)
      fireEvent.click(screen.getByText('Skip →'))
      expect(onClick).toHaveBeenCalledTimes(1)
    })
  })

  describe('ProgressOverlay', () => {
    it('should display phase label', () => {
      render(<ProgressOverlay phase="enter" progress={0} />)
      expect(screen.getByText('Entering Construct...')).toBeInTheDocument()
    })

    it('should display progress percentage during training', () => {
      render(<ProgressOverlay phase="training" progress={50} />)
      expect(screen.getByText('50%')).toBeInTheDocument()
    })

    it('should display skill name when complete', () => {
      render(<ProgressOverlay phase="complete" progress={100} skill="Kung Fu" />)
      expect(screen.getByText('I know Kung Fu.')).toBeInTheDocument()
    })
  })
})
