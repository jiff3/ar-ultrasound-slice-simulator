import { useEffect, useState } from 'react'

const SAMPLE_WINDOW_MS = 500

export function FpsReadout() {
  const [fps, setFps] = useState(0)

  useEffect(() => {
    let animationFrameId = 0
    let frameCount = 0
    let windowStart = performance.now()

    function measureFrame(currentTime: number) {
      frameCount += 1

      if (currentTime - windowStart >= SAMPLE_WINDOW_MS) {
        setFps(Math.round((frameCount * 1000) / (currentTime - windowStart)))
        frameCount = 0
        windowStart = currentTime
      }

      animationFrameId = window.requestAnimationFrame(measureFrame)
    }

    animationFrameId = window.requestAnimationFrame(measureFrame)

    return () => {
      window.cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return <span className="fps-chip">{fps > 0 ? `${fps} FPS` : 'FPS --'}</span>
}
