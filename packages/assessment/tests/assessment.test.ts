/**
 * Assessment 模块测试
 */

import { describe, it, expect, beforeAll } from 'vitest'
import { OpenClawParser } from '../src/parsers/OpenClawParser'
import { MarkdownParser } from '../src/parsers/MarkdownParser'
import { ScoringEngine } from '../src/scorers/ScoringEngine'
import { identityScorer } from '../src/scorers/identityScorer'
import { soulScorer } from '../src/scorers/soulScorer'

describe('MarkdownParser', () => {
  it('should parse key-value pairs', () => {
    const content = `
name: TestAgent
title: Test Engineer
traits: [curious, analytical]
`
    const parser = new MarkdownParser(content)
    const fields = parser.extractKeyValue()

    expect(fields.length).toBeGreaterThan(0)
    expect(fields.find(f => f.key === 'name')?.value).toBe('TestAgent')
  })

  it('should detect keywords', () => {
    const content = 'This agent has a strong mission to serve users.'
    const parser = new MarkdownParser(content)

    expect(parser.contains('mission')).toBe(true)
    expect(parser.contains(/mission/i)).toBe(true)
    expect(parser.contains('nonexistent')).toBe(false)
  })

  it('should extract list items', () => {
    const content = `
- First item
- Second item
- Third item
`
    const parser = new MarkdownParser(content)
    const items = parser.extractListItems()

    expect(items.length).toBe(3)
    expect(items[0]).toBe('First item')
  })
})

describe('ScoringEngine', () => {
  const scorer = new ScoringEngine()

  it('should score empty files', () => {
    const result = scorer.scoreAll({})

    expect(result.dimensions.identity).toBe(0)
    expect(result.dimensions.soul).toBe(0)
    expect(result.details.suggestions.length).toBeGreaterThan(0)
  })

  it('should score basic content', () => {
    const files = {
      identity: `
# Identity

name: TestAgent
title: Test Engineer

## Traits
- Curious
- Analytical
- Detail-oriented

## Style
Professional and friendly
`,
    }

    const result = scorer.scoreAll(files)
    expect(result.dimensions.identity).toBeGreaterThan(0)
  })
})

describe('Individual Scorers', () => {
  describe('IdentityScorer', () => {
    it('should give 0 for null content', () => {
      const result = identityScorer.score(null)
      expect(result.score).toBe(0)
    })

    it('should give low score for minimal content', () => {
      const result = identityScorer.score('short')
      expect(result.score).toBeLessThan(30)
    })

    it('should give higher score for complete content', () => {
      const content = `
# IDENTITY

name: TestAgent
title: Senior Engineer

## Core Traits

- **Curious**: Always eager to learn new things and explore new domains
- **Analytical**: Breaks down complex problems systematically
- **Collaborative**: Works well with others and values teamwork

## Communication Style

Professional yet approachable. Uses clear, concise language.

## Forbidden Phrases

- "As an AI..."
- "I cannot..."

## Required Phrases

- "Let me help you with that"
- "Here's what I found"
`
      const result = identityScorer.score(content)
      expect(result.score).toBeGreaterThan(50)
      expect(result.fields).toContain('name')
      expect(result.fields).toContain('title')
    })
  })

  describe('SoulScorer', () => {
    it('should give 0 for null content', () => {
      const result = soulScorer.score(null)
      expect(result.score).toBe(0)
    })

    it('should detect mission and values', () => {
      const content = `
# SOUL

## Mission

To empower users with intelligent assistance that truly understands their needs.

## Core Values

- Integrity: Always honest and transparent
- Excellence: Strive for the highest quality
- Growth: Continuously improve and learn

## Boundaries

- Never pretend to have capabilities I don't have
- Always acknowledge uncertainty
`
      const result = soulScorer.score(content)
      expect(result.score).toBeGreaterThan(40)
    })
  })
})

describe('OpenClawParser', () => {
  let parser: OpenClawParser

  beforeAll(() => {
    parser = new OpenClawParser()
  })

  it('should get openclaw path', () => {
    const path = parser.getOpenClawPath()
    expect(path).toContain('.openclaw')
  })

  it('should check workspace exists', () => {
    // 这个测试依赖于本地环境
    const exists = parser.workspaceExists('trumind')
    // 只是确保不会抛出错误
    expect(typeof exists).toBe('boolean')
  })
})

describe('ScoringEngine.getSummary', () => {
  const engine = new ScoringEngine()

  it('should identify strongest and weakest dimensions', () => {
    const dimensions = {
      identity: 90,
      soul: 85,
      user: 40,
      tools: 70,
      agents: 75,
      memory: 60,
    }

    const summary = engine.getSummary(dimensions)

    expect(summary.strongest).toBe('identity')
    expect(summary.weakest).toBe('user')
    expect(summary.average).toBeCloseTo(70, 0)
  })
})
