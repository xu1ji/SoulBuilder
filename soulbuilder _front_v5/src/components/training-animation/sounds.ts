/**
 * 音效系统 - Web Audio API
 * 迁移自 matrix-kungfu-demo.html
 */

let audioContext: AudioContext | null = null
let audioInitialized = false

export function getAudioContext(): AudioContext | null {
  return audioContext
}

export function isAudioInitialized(): boolean {
  return audioInitialized
}

/**
 * 初始化音频（必须由用户交互触发）
 */
export function initAudio(): void {
  if (audioInitialized) return

  try {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()

    // 确保 AudioContext 处于运行状态
    if (audioContext.state === 'suspended') {
      audioContext.resume()
    }

    audioInitialized = true
    console.log('Audio initialized')
  } catch (e) {
    console.error('Failed to initialize audio:', e)
  }
}

/**
 * 小招音效 - 挥拳风声
 */
export function playSmallSound(): void {
  if (!audioContext) return

  try {
    const bufferSize = audioContext.sampleRate * 0.15
    const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1
    }

    const noise = audioContext.createBufferSource()
    noise.buffer = buffer

    const filter = audioContext.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(3000, audioContext.currentTime)
    filter.frequency.exponentialRampToValueAtTime(500, audioContext.currentTime + 0.15)
    filter.Q.value = 2

    const gain = audioContext.createGain()
    noise.connect(filter)
    filter.connect(gain)
    gain.connect(audioContext.destination)
    gain.gain.setValueAtTime(0.12, audioContext.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15)

    noise.start()
    noise.stop(audioContext.currentTime + 0.15)
  } catch (e) {
    console.error('Small sound error:', e)
  }
}

/**
 * 中招音效 - 踢腿
 */
export function playMediumSound(): void {
  if (!audioContext) return

  try {
    // 低频踢腿声
    const osc = audioContext.createOscillator()
    const gain = audioContext.createGain()
    osc.type = 'sine'
    osc.connect(gain)
    gain.connect(audioContext.destination)
    osc.frequency.setValueAtTime(200, audioContext.currentTime)
    osc.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 0.15)
    gain.gain.setValueAtTime(0.35, audioContext.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15)
    osc.start()
    osc.stop(audioContext.currentTime + 0.15)

    // 高频点击
    const click = audioContext.createOscillator()
    const clickGain = audioContext.createGain()
    click.type = 'square'
    click.connect(clickGain)
    clickGain.connect(audioContext.destination)
    click.frequency.setValueAtTime(1000, audioContext.currentTime)
    click.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.05)
    clickGain.gain.setValueAtTime(0.12, audioContext.currentTime)
    clickGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05)
    click.start()
    click.stop(audioContext.currentTime + 0.05)
  } catch (e) {
    console.error('Medium sound error:', e)
  }
}

/**
 * 大招音效 - 觉醒
 */
export function playBigSound(): void {
  if (!audioContext) return

  try {
    // 能量汇聚
    const osc1 = audioContext.createOscillator()
    const gain1 = audioContext.createGain()
    osc1.type = 'sine'
    osc1.connect(gain1)
    gain1.connect(audioContext.destination)
    osc1.frequency.setValueAtTime(100, audioContext.currentTime)
    osc1.frequency.exponentialRampToValueAtTime(500, audioContext.currentTime + 0.8)
    gain1.gain.setValueAtTime(0.08, audioContext.currentTime)
    gain1.gain.linearRampToValueAtTime(0.25, audioContext.currentTime + 0.6)
    gain1.gain.linearRampToValueAtTime(0.01, audioContext.currentTime + 0.9)
    osc1.start()
    osc1.stop(audioContext.currentTime + 0.9)

    // 泛音层
    const osc2 = audioContext.createOscillator()
    const gain2 = audioContext.createGain()
    osc2.type = 'triangle'
    osc2.connect(gain2)
    gain2.connect(audioContext.destination)
    osc2.frequency.setValueAtTime(200, audioContext.currentTime)
    osc2.frequency.exponentialRampToValueAtTime(1000, audioContext.currentTime + 0.8)
    gain2.gain.setValueAtTime(0.04, audioContext.currentTime)
    gain2.gain.linearRampToValueAtTime(0.12, audioContext.currentTime + 0.6)
    gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.9)
    osc2.start()
    osc2.stop(audioContext.currentTime + 0.9)

    // 爆发
    setTimeout(() => {
      if (!audioContext) return

      const bufferSize = audioContext.sampleRate * 0.5
      const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate)
      const data = buffer.getChannelData(0)
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1
      }

      const noise = audioContext.createBufferSource()
      noise.buffer = buffer

      const filter = audioContext.createBiquadFilter()
      filter.type = 'bandpass'
      filter.frequency.value = 1500
      filter.Q.value = 2

      const gain = audioContext.createGain()
      noise.connect(filter)
      filter.connect(gain)
      gain.connect(audioContext.destination)
      gain.gain.setValueAtTime(0.4, audioContext.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

      noise.start()
      noise.stop(audioContext.currentTime + 0.5)

      // 高频闪光音
      const spark = audioContext.createOscillator()
      const sparkGain = audioContext.createGain()
      spark.type = 'sine'
      spark.connect(sparkGain)
      sparkGain.connect(audioContext.destination)
      spark.frequency.setValueAtTime(2000, audioContext.currentTime)
      spark.frequency.exponentialRampToValueAtTime(5000, audioContext.currentTime + 0.1)
      spark.frequency.exponentialRampToValueAtTime(1000, audioContext.currentTime + 0.3)
      sparkGain.gain.setValueAtTime(0.12, audioContext.currentTime)
      sparkGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
      spark.start()
      spark.stop(audioContext.currentTime + 0.3)
    }, 800)
  } catch (e) {
    console.error('Big sound error:', e)
  }
}

/**
 * 根据动作播放音效
 */
export function playSoundForAction(action: string): void {
  if (!audioInitialized) return

  switch (action) {
    case 'punch':
      playSmallSound()
      break
    case 'kick':
      playMediumSound()
      break
    case 'training':
      // training 随机播放小招或中招
      Math.random() > 0.5 ? playSmallSound() : playMediumSound()
      break
    case 'awakening':
      playBigSound()
      break
  }
}
