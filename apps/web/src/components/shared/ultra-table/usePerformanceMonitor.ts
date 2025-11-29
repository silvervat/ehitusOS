'use client'

import { useState, useEffect, useRef } from 'react'

interface PerformanceMetrics {
  fps: number
  renderTime: number
  memoryUsage?: number
}

export function usePerformanceMonitor(): PerformanceMetrics {
  const [fps, setFps] = useState(60)
  const [renderTime, setRenderTime] = useState(0)
  const frameCountRef = useRef(0)
  const lastTimeRef = useRef(performance.now())
  const rafIdRef = useRef<number | null>(null)

  useEffect(() => {
    let mounted = true

    const measureFPS = () => {
      if (!mounted) return

      frameCountRef.current++
      const now = performance.now()
      const elapsed = now - lastTimeRef.current

      if (elapsed >= 1000) {
        const currentFps = Math.round((frameCountRef.current / elapsed) * 1000)
        setFps(currentFps)
        setRenderTime(Math.round(elapsed / frameCountRef.current * 10) / 10)
        frameCountRef.current = 0
        lastTimeRef.current = now
      }

      rafIdRef.current = requestAnimationFrame(measureFPS)
    }

    rafIdRef.current = requestAnimationFrame(measureFPS)

    return () => {
      mounted = false
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current)
      }
    }
  }, [])

  return { fps, renderTime }
}
