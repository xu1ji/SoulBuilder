/**
 * SSE 解析器
 *
 * 用于解析 Server-Sent Events 流
 */

/**
 * SSE 消息类型
 */
export interface SSEMessage {
  data: string
  event?: string
  id?: string
}

/**
 * SSE 解析状态
 */
type ParseState = 'idle' | 'data' | 'event' | 'id'

/**
 * 创建 SSE 解析器
 */
export function createSSEParser(
  onMessage: (message: SSEMessage) => void,
  onError?: (error: Error) => void
) {
  let buffer = ''
  let currentMessage: Partial<SSEMessage> = {}
  let state: ParseState = 'idle'

  /**
   * 处理一行数据
   */
  function processLine(line: string) {
    // 空行表示消息结束
    if (line === '') {
      if (currentMessage.data !== undefined) {
        onMessage(currentMessage as SSEMessage)
      }
      currentMessage = {}
      state = 'idle'
      return
    }

    // 注释行
    if (line.startsWith(':')) {
      return
    }

    // 解析字段
    const colonIndex = line.indexOf(':')
    if (colonIndex === -1) {
      // 没有冒号，整个行作为字段名，值为空
      processField(line.trim(), '')
      return
    }

    const field = line.slice(0, colonIndex).trim()
    let value = line.slice(colonIndex + 1)

    // 如果值以空格开头，去掉空格
    if (value.startsWith(' ')) {
      value = value.slice(1)
    }

    processField(field, value)
  }

  /**
   * 处理字段
   */
  function processField(field: string, value: string) {
    switch (field) {
      case 'data':
        // data 字段可能有多行，需要追加
        if (currentMessage.data === undefined) {
          currentMessage.data = value
        } else {
          currentMessage.data += '\n' + value
        }
        break
      case 'event':
        currentMessage.event = value
        break
      case 'id':
        currentMessage.id = value
        break
      default:
        // 忽略未知字段
        break
    }
  }

  /**
   * 处理接收到的数据
   */
  function parse(chunk: string) {
    buffer += chunk

    // 按行处理
    let lineEnd: number
    while ((lineEnd = buffer.indexOf('\n')) !== -1) {
      const line = buffer.slice(0, lineEnd)
      buffer = buffer.slice(lineEnd + 1)
      processLine(line)
    }
  }

  /**
   * 完成解析（处理剩余缓冲区）
   */
  function finish() {
    if (buffer.length > 0) {
      processLine(buffer)
      buffer = ''
    }
    // 处理最后一条消息
    if (currentMessage.data !== undefined) {
      onMessage(currentMessage as SSEMessage)
    }
  }

  return {
    parse,
    finish,
  }
}

/**
 * 解析 SSE 数据为 JSON
 */
export function parseSSEData(data: string): unknown {
  // 检查是否是 [DONE] 标记
  if (data === '[DONE]') {
    return { done: true }
  }

  try {
    return JSON.parse(data)
  } catch {
    // 如果不是 JSON，返回原始字符串
    return { content: data }
  }
}

/**
 * 训练 SSE 数据类型
 */
export interface TrainingSSEData {
  content?: string
  done?: boolean
  error?: string
  json?: unknown
}
