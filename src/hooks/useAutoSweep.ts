import { useEffect, useRef } from 'react'
import { useSimulatorStore } from '../app/store'
import { degreesToRadians } from '../domain/coordinates'

const SWEEP_PERIOD_SECONDS = 16
const MAX_FRAME_DELTA_SECONDS = 0.05
const SWEEP_UPDATE_INTERVAL_MS = 1000 / 30
const BASE_PROBE_Y = 2.42
const BASE_PROBE_Z = 1.08

export function useAutoSweep() {
  const isAutoSweepEnabled = useSimulatorStore((state) => state.isAutoSweepEnabled)
  const phaseRef = useRef(0)
  const previousTimeRef = useRef(0)
  const previousPublishTimeRef = useRef(0)

  useEffect(() => {
    if (!isAutoSweepEnabled) {
      previousTimeRef.current = 0
      previousPublishTimeRef.current = 0
      return
    }

    let animationFrameId = 0

    function updateSweep(currentTime: number) {
      const state = useSimulatorStore.getState()

      if (!state.isAutoSweepEnabled) {
        previousTimeRef.current = 0
        previousPublishTimeRef.current = 0
        return
      }

      if (previousTimeRef.current === 0) {
        previousTimeRef.current = currentTime
      }

      const deltaSeconds = Math.min(
        (currentTime - previousTimeRef.current) / 1000,
        MAX_FRAME_DELTA_SECONDS,
      )
      previousTimeRef.current = currentTime
      phaseRef.current =
        (phaseRef.current + (deltaSeconds * Math.PI * 2) / SWEEP_PERIOD_SECONDS) %
        (Math.PI * 2)

      const phase = phaseRef.current

      if (currentTime - previousPublishTimeRef.current < SWEEP_UPDATE_INTERVAL_MS) {
        animationFrameId = window.requestAnimationFrame(updateSweep)
        return
      }

      previousPublishTimeRef.current = currentTime
      const lateralSweep = Math.sin(phase)
      const crossSweep = Math.sin(phase * 0.5 + 0.65)

      state.setProbePose(
        [
          lateralSweep * 1.08,
          BASE_PROBE_Y + Math.sin(phase * 1.6) * 0.12,
          BASE_PROBE_Z + crossSweep * 0.18,
        ],
        {
          yaw: degreesToRadians(Math.sin(phase * 0.7) * 9),
          pitch: degreesToRadians(17 + Math.sin(phase * 1.15 + 0.4) * 8),
          roll: degreesToRadians(Math.cos(phase * 1.35) * 10),
        },
      )
      state.setImagingDepth(3.55 + Math.sin(phase * 0.85 + 0.25) * 0.22)

      animationFrameId = window.requestAnimationFrame(updateSweep)
    }

    animationFrameId = window.requestAnimationFrame(updateSweep)

    return () => {
      window.cancelAnimationFrame(animationFrameId)
    }
  }, [isAutoSweepEnabled])
}
