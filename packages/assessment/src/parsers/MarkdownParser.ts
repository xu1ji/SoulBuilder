/**
 * Markdown 配置文件解析器
 * 用于解析 OpenClaw 的 .md 配置文件
 */

export interface ParsedField {
  key: string
  value: string
  line: number
}

export interface Section {
  title: string
  level: number
  content: string
  lines: string[]
}

export class MarkdownParser {
  private content: string
  private lines: string[]

  constructor(content: string) {
    this.content = content
    this.lines = content.split('\n')
  }

  /**
   * 获取原始内容
   */
  getRaw(): string {
    return this.content
  }

  /**
   * 获取内容长度
   */
  get length(): number {
    return this.content.length
  }

  /**
   * 获取行数
   */
  get lineCount(): number {
    return this.lines.length
  }

  /**
   * 检查是否包含某个关键词
   */
  contains(keyword: string | RegExp): boolean {
    if (typeof keyword === 'string') {
      return this.content.toLowerCase().includes(keyword.toLowerCase())
    }
    return keyword.test(this.content)
  }

  /**
   * 查找所有匹配的行
   */
  findLines(pattern: RegExp): { line: string; lineNumber: number }[] {
    const results: { line: string; lineNumber: number }[] = []
    this.lines.forEach((line, index) => {
      if (pattern.test(line)) {
        results.push({ line, lineNumber: index + 1 })
      }
    })
    return results
  }

  /**
   * 提取 key-value 对
   * 支持格式：`key: value` 或 `key：value`
   */
  extractKeyValue(pattern?: RegExp): ParsedField[] {
    const kvPattern = pattern || /^([a-zA-Z\u4e00-\u9fa5]+)[:：]\s*(.+)$/gm
    const fields: ParsedField[] = []
    let match

    while ((match = kvPattern.exec(this.content)) !== null) {
      fields.push({
        key: match[1].trim(),
        value: match[2].trim(),
        line: this.getLineNumber(match.index),
      })
    }

    return fields
  }

  /**
   * 提取列表项
   * 支持格式：`- item` 或 `* item` 或 `1. item`
   */
  extractListItems(): string[] {
    const listPattern = /^[\s]*[-*]\s+(.+)$|^\s*\d+\.\s+(.+)$/gm
    const items: string[] = []
    let match

    while ((match = listPattern.exec(this.content)) !== null) {
      items.push((match[1] || match[2]).trim())
    }

    return items
  }

  /**
   * 提取所有标题
   */
  extractHeadings(): { level: number; text: string; line: number }[] {
    const headingPattern = /^(#{1,6})\s+(.+)$/gm
    const headings: { level: number; text: string; line: number }[] = []
    let match

    while ((match = headingPattern.exec(this.content)) !== null) {
      headings.push({
        level: match[1].length,
        text: match[2].trim(),
        line: this.getLineNumber(match.index),
      })
    }

    return headings
  }

  /**
   * 提取代码块
   */
  extractCodeBlocks(): { language: string; code: string }[] {
    const codeBlockPattern = /```(\w*)\n([\s\S]*?)```/g
    const blocks: { language: string; code: string }[] = []
    let match

    while ((match = codeBlockPattern.exec(this.content)) !== null) {
      blocks.push({
        language: match[1] || 'text',
        code: match[2].trim(),
      })
    }

    return blocks
  }

  /**
   * 提取特定 section 的内容
   */
  extractSection(title: string): Section | null {
    const headings = this.extractHeadings()
    const targetIndex = headings.findIndex(h =>
      h.text.toLowerCase().includes(title.toLowerCase())
    )

    if (targetIndex === -1) return null

    const startLine = headings[targetIndex].line
    const endLine = headings[targetIndex + 1]?.line || this.lines.length

    const sectionLines = this.lines.slice(startLine, endLine - 1)
    return {
      title: headings[targetIndex].text,
      level: headings[targetIndex].level,
      content: sectionLines.join('\n').trim(),
      lines: sectionLines,
    }
  }

  /**
   * 统计关键词出现次数
   */
  countKeyword(keyword: string | RegExp): number {
    if (typeof keyword === 'string') {
      const regex = new RegExp(keyword, 'gi')
      return (this.content.match(regex) || []).length
    }
    return (this.content.match(keyword) || []).length
  }

  /**
   * 获取指定索引所在的行号
   */
  private getLineNumber(index: number): number {
    const textBefore = this.content.substring(0, index)
    return textBefore.split('\n').length
  }

  /**
   * 检查是否有实质内容（非模板占位符）
   */
  hasSubstantiveContent(): boolean {
    const placeholderPatterns = [
      /\(to be configured\)/i,
      /\(待配置\)/,
      /\(待填写\)/,
      /\(待补充\)/,
      /\[待填写\]/,
      /\[待补充\]/,
      /TODO/i,
      /TBD/i,
    ]

    const contentWithoutEmpty = this.content
      .replace(/```[\s\S]*?```/g, '')
      .replace(/#{1,6}\s.*$/gm, '')
      .trim()

    let placeholderCount = 0
    for (const pattern of placeholderPatterns) {
      placeholderCount += (contentWithoutEmpty.match(pattern) || []).length
    }

    return placeholderCount < 3 && contentWithoutEmpty.length > 100
  }
}

/**
 * 便捷函数：解析 Markdown 内容
 */
export function parseMarkdown(content: string): MarkdownParser {
  return new MarkdownParser(content)
}
