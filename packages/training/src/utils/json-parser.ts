/**
 * JSON 解析器
 *
 * 用于解析 AI 输出中的 JSON 结构
 */

/**
 * 训练结果 JSON 结构
 */
export interface TrainingOutputJSON {
  identity: {
    name: string
    title: string
    traits: string[]
    style: string
  }
  soul: {
    mission: string
    values: string[]
    boundaries: string[]
  }
  methodology: {
    frameworks: string[]
    principles: string[]
  }
  context: {
    industry: string
    scenario: string
  }
}

/**
 * 从 AI 回复中提取 JSON
 */
export function extractJSON(content: string): TrainingOutputJSON | null {
  // 尝试匹配 ---JSON ... --- 格式
  const jsonMatch = content.match(/---JSON\s*([\s\S]*?)\s*---/)
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[1].trim())
    } catch (e) {
      console.error('Failed to parse JSON from ---JSON block:', e)
    }
  }

  // 尝试匹配 ```json ... ``` 格式
  const codeBlockMatch = content.match(/```json\s*([\s\S]*?)\s*```/)
  if (codeBlockMatch) {
    try {
      return JSON.parse(codeBlockMatch[1].trim())
    } catch (e) {
      console.error('Failed to parse JSON from code block:', e)
    }
  }

  // 尝试直接解析整个内容（如果内容就是纯 JSON）
  try {
    return JSON.parse(content.trim())
  } catch (e) {
    // 不是纯 JSON，继续
  }

  // 尝试查找 JSON 对象
  const objectMatch = content.match(/\{[\s\S]*\}/)
  if (objectMatch) {
    try {
      return JSON.parse(objectMatch[0])
    } catch (e) {
      console.error('Failed to parse JSON object:', e)
    }
  }

  return null
}

/**
 * 验证 JSON 结构是否完整
 */
export function validateTrainingOutput(json: TrainingOutputJSON): {
  valid: boolean
  missing: string[]
} {
  const required = [
    'identity.name',
    'identity.title',
    'identity.traits',
    'identity.style',
    'soul.mission',
    'soul.values',
    'soul.boundaries',
    'methodology.frameworks',
    'context.industry',
  ]

  const missing: string[] = []

  for (const path of required) {
    const parts = path.split('.')
    let value: unknown = json
    for (const part of parts) {
      value = (value as Record<string, unknown>)?.[part]
    }
    if (value === undefined || value === null || value === '') {
      missing.push(path)
    }
  }

  return {
    valid: missing.length === 0,
    missing,
  }
}

/**
 * 合并训练输出到现有配置
 */
export function mergeTrainingOutput(
  existing: Partial<TrainingOutputJSON>,
  newOutput: TrainingOutputJSON
): TrainingOutputJSON {
  return {
    identity: {
      name: newOutput.identity.name || existing.identity?.name || '',
      title: newOutput.identity.title || existing.identity?.title || '',
      traits: [...new Set([
        ...(existing.identity?.traits || []),
        ...newOutput.identity.traits,
      ])],
      style: newOutput.identity.style || existing.identity?.style || '',
    },
    soul: {
      mission: newOutput.soul.mission || existing.soul?.mission || '',
      values: [...new Set([
        ...(existing.soul?.values || []),
        ...newOutput.soul.values,
      ])],
      boundaries: [...new Set([
        ...(existing.soul?.boundaries || []),
        ...newOutput.soul.boundaries,
      ])],
    },
    methodology: {
      frameworks: [...new Set([
        ...(existing.methodology?.frameworks || []),
        ...newOutput.methodology.frameworks,
      ])],
      principles: [...new Set([
        ...(existing.methodology?.principles || []),
        ...newOutput.methodology.principles,
      ])],
    },
    context: {
      industry: newOutput.context.industry || existing.context?.industry || '',
      scenario: newOutput.context.scenario || existing.context?.scenario || '',
    },
  }
}
