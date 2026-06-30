import { create } from 'zustand'
import { DEFAULT_IMAGING_DEPTH_CM, DEFAULT_IMAGING_WIDTH_CM } from '../domain/coordinates'

export type ProbePosition = [number, number, number]

export type ProbeRotation = Readonly<{
  yaw: number
  pitch: number
  roll: number
}>

export type TransformMode = 'translate' | 'rotate'

type SimulatorState = {
  probePosition: ProbePosition
  probeRotation: ProbeRotation
  imagingDepth: number
  imagingWidth: number
  gain: number
  planeOpacity: number
  showOrgans: boolean
  showLabels: boolean
  showSlicePlane: boolean
  showSliceHelpers: boolean
  showWrongOrientation: boolean
  isPresentationMode: boolean
  isProbeInteracting: boolean
  freezeImage: boolean
  transformMode: TransformMode
  isAutoSweepEnabled: boolean
  ultrasoundCanvas: HTMLCanvasElement | null
  ultrasoundRevision: number
}

type SimulatorActions = {
  setProbePosition: (position: ProbePosition) => void
  setProbeRotation: (rotation: ProbeRotation) => void
  setProbePose: (position: ProbePosition, rotation: ProbeRotation) => void
  nudgeProbe: (delta: ProbePosition) => void
  rotateProbe: (delta: ProbeRotation) => void
  setImagingDepth: (depth: number) => void
  setGain: (gain: number) => void
  setPlaneOpacity: (opacity: number) => void
  toggleFreezeImage: () => void
  toggleWrongOrientation: () => void
  resetProbe: () => void
  setTransformMode: (mode: TransformMode) => void
  setAutoSweepEnabled: (enabled: boolean) => void
  stopAutoSweep: () => void
  toggleAutoSweep: () => void
  toggleOrgans: () => void
  toggleLabels: () => void
  toggleSlicePlane: () => void
  toggleSliceHelpers: () => void
  togglePresentationMode: () => void
  setProbeInteracting: (isInteracting: boolean) => void
  setUltrasoundCanvas: (canvas: HTMLCanvasElement) => void
}

export type SimulatorStore = SimulatorState & SimulatorActions

export const DEFAULT_PROBE_POSITION: ProbePosition = [0, 2.55, 0.55]
export const DEFAULT_PROBE_ROTATION: ProbeRotation = {
  yaw: 0,
  pitch: 0,
  roll: 0,
}

const DEFAULT_STATE: SimulatorState = {
  probePosition: DEFAULT_PROBE_POSITION,
  probeRotation: DEFAULT_PROBE_ROTATION,
  imagingDepth: DEFAULT_IMAGING_DEPTH_CM,
  imagingWidth: DEFAULT_IMAGING_WIDTH_CM,
  gain: 1,
  planeOpacity: 0.66,
  showOrgans: true,
  showLabels: true,
  showSlicePlane: true,
  showSliceHelpers: true,
  showWrongOrientation: false,
  isPresentationMode: false,
  isProbeInteracting: false,
  freezeImage: false,
  transformMode: 'translate',
  isAutoSweepEnabled: false,
  ultrasoundCanvas: null,
  ultrasoundRevision: 0,
}

export const useSimulatorStore = create<SimulatorStore>((set) => ({
  ...DEFAULT_STATE,
  setProbePosition: (probePosition) => set({ probePosition }),
  setProbeRotation: (probeRotation) => set({ probeRotation }),
  setProbePose: (probePosition, probeRotation) => set({ probePosition, probeRotation }),
  nudgeProbe: ([deltaX, deltaY, deltaZ]) =>
    set(({ probePosition }) => ({
      probePosition: [
        probePosition[0] + deltaX,
        probePosition[1] + deltaY,
        probePosition[2] + deltaZ,
      ],
    })),
  rotateProbe: (delta) =>
    set(({ probeRotation }) => ({
      probeRotation: {
        yaw: probeRotation.yaw + delta.yaw,
        pitch: probeRotation.pitch + delta.pitch,
        roll: probeRotation.roll + delta.roll,
      },
    })),
  setImagingDepth: (imagingDepth) => set({ imagingDepth: clamp(imagingDepth, 0.8, 8) }),
  setGain: (gain) => set({ gain: clamp(gain, 0, 2) }),
  setPlaneOpacity: (planeOpacity) => set({ planeOpacity: clamp(planeOpacity, 0, 1) }),
  toggleFreezeImage: () => set(({ freezeImage }) => ({ freezeImage: !freezeImage })),
  toggleWrongOrientation: () =>
    set(({ showWrongOrientation }) => ({ showWrongOrientation: !showWrongOrientation })),
  resetProbe: () =>
    set({
      probePosition: DEFAULT_PROBE_POSITION,
      probeRotation: DEFAULT_PROBE_ROTATION,
      imagingDepth: DEFAULT_STATE.imagingDepth,
      imagingWidth: DEFAULT_STATE.imagingWidth,
      gain: DEFAULT_STATE.gain,
      planeOpacity: DEFAULT_STATE.planeOpacity,
      freezeImage: DEFAULT_STATE.freezeImage,
      transformMode: DEFAULT_STATE.transformMode,
      isAutoSweepEnabled: DEFAULT_STATE.isAutoSweepEnabled,
      isProbeInteracting: DEFAULT_STATE.isProbeInteracting,
    }),
  setTransformMode: (transformMode) => set({ transformMode }),
  setAutoSweepEnabled: (enabled) =>
    set(({ freezeImage }) => ({
      isAutoSweepEnabled: enabled,
      freezeImage: enabled ? false : freezeImage,
    })),
  stopAutoSweep: () => set({ isAutoSweepEnabled: false }),
  toggleAutoSweep: () =>
    set(({ freezeImage, isAutoSweepEnabled }) => {
      const nextAutoSweepEnabled = !isAutoSweepEnabled

      return {
        isAutoSweepEnabled: nextAutoSweepEnabled,
        freezeImage: nextAutoSweepEnabled ? false : freezeImage,
      }
    }),
  toggleOrgans: () => set(({ showOrgans }) => ({ showOrgans: !showOrgans })),
  toggleLabels: () => set(({ showLabels }) => ({ showLabels: !showLabels })),
  toggleSlicePlane: () => set(({ showSlicePlane }) => ({ showSlicePlane: !showSlicePlane })),
  toggleSliceHelpers: () =>
    set(({ showSliceHelpers }) => ({ showSliceHelpers: !showSliceHelpers })),
  togglePresentationMode: () =>
    set(({ isPresentationMode }) => ({ isPresentationMode: !isPresentationMode })),
  setProbeInteracting: (isProbeInteracting) => set({ isProbeInteracting }),
  setUltrasoundCanvas: (ultrasoundCanvas) =>
    set(({ ultrasoundRevision }) => ({
      ultrasoundCanvas,
      ultrasoundRevision: ultrasoundRevision + 1,
    })),
}))

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}
