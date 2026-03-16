/**
 * 输入栏组件
 *
 * 用于输入训练消息
 */

import React, { useState, useRef, useEffect } from 'react'

interface InputBarProps {
  onSend: (message: string) => void
  disabled?: boolean
  placeholder?: string
}

export const InputBar: React.FC<InputBarProps> = ({
  onSend,
  disabled = false,
  placeholder = '输入你的想法...',
}) => {
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // 自动调整高度
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`
    }
  }, [value])

  const handleSubmit = () => {
    if (value.trim() && !disabled) {
      onSend(value.trim())
      setValue('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: '12px',
        padding: '16px',
        backgroundColor: '#F5F5F5',
        borderRadius: '12px',
      }}
    >
      <textarea
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={placeholder}
        rows={1}
        style={{
          flex: 1,
          border: 'none',
          outline: 'none',
          resize: 'none',
          fontSize: '15px',
          lineHeight: '1.5',
          backgroundColor: 'transparent',
          color: '#1a1a1a',
          fontFamily: 'inherit',
          maxHeight: '120px',
        }}
      />

      <button
        onClick={handleSubmit}
        disabled={disabled || !value.trim()}
        style={{
          padding: '10px 20px',
          backgroundColor: disabled || !value.trim() ? '#ccc' : '#00FF41',
          color: '#000',
          border: 'none',
          borderRadius: '8px',
          fontSize: '15px',
          fontWeight: 500,
          cursor: disabled || !value.trim() ? 'not-allowed' : 'pointer',
          transition: 'background-color 0.2s',
        }}
      >
        发送
      </button>
    </div>
  )
}

export default InputBar
