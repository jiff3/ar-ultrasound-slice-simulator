import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import { CanvasTexture, DoubleSide, LinearFilter, type Group, type Mesh } from 'three'
import { useSimulatorStore } from '../../app/store'
import { PROBE_FACE_OFFSET_CM } from '../../domain/coordinates'
import {
  createUltrasoundCanvas,
  renderUltrasoundToCanvas,
  ULTRASOUND_TEXTURE_HEIGHT,
  ULTRASOUND_TEXTURE_WIDTH,
} from '../../domain/ultrasoundRenderer'
import { SliceBorder } from './SliceBorder'
import { SliceOrientationMarkers } from './SliceOrientationMarkers'

const ACTIVE_TEXTURE_INTERVAL_SECONDS = 0.16
const IDLE_TEXTURE_INTERVAL_SECONDS = 0.1
const MATRIX_CHANGE_EPSILON = 0.002

export function UltrasoundPlane() {
  const groupRef = useRef<Group>(null)
  const scanlineRef = useRef<Mesh>(null)
  const lastRenderTimeRef = useRef(0)
  const hasRenderedRef = useRef(false)
  const lastSettingsKeyRef = useRef('')
  const lastRenderedMatrixRef = useRef<number[]>([])
  const imagingDepth = useSimulatorStore((state) => state.imagingDepth)
  const imagingWidth = useSimulatorStore((state) => state.imagingWidth)
  const gain = useSimulatorStore((state) => state.gain)
  const planeOpacity = useSimulatorStore((state) => state.planeOpacity)
  const showSlicePlane = useSimulatorStore((state) => state.showSlicePlane)
  const freezeImage = useSimulatorStore((state) => state.freezeImage)
  const isAutoSweepEnabled = useSimulatorStore((state) => state.isAutoSweepEnabled)
  const isProbeInteracting = useSimulatorStore((state) => state.isProbeInteracting)
  const setUltrasoundCanvas = useSimulatorStore((state) => state.setUltrasoundCanvas)
  const canvas = useMemo(
    () => createUltrasoundCanvas(ULTRASOUND_TEXTURE_WIDTH, ULTRASOUND_TEXTURE_HEIGHT),
    [],
  )
  const texture = useMemo(() => {
    const canvasTexture = new CanvasTexture(canvas)
    canvasTexture.minFilter = LinearFilter
    canvasTexture.magFilter = LinearFilter
    canvasTexture.generateMipmaps = false
    canvasTexture.flipY = true

    return canvasTexture
  }, [canvas])

  useEffect(() => {
    return () => {
      texture.dispose()
    }
  }, [texture])

  useFrame(({ clock }) => {
    const group = groupRef.current
    const probeObject = group?.parent

    if (!showSlicePlane || !group || !probeObject) {
      return
    }

    if (scanlineRef.current && !freezeImage) {
      const phase = (clock.elapsedTime * 0.82) % 1
      scanlineRef.current.position.y = -phase * imagingDepth
    }

    if (freezeImage && hasRenderedRef.current) {
      return
    }

    probeObject.updateWorldMatrix(true, false)
    const settingsKey = `${imagingWidth.toFixed(3)}|${imagingDepth.toFixed(3)}|${gain.toFixed(3)}`
    const settingsChanged = settingsKey !== lastSettingsKeyRef.current
    const poseChanged = hasMatrixChanged(
      lastRenderedMatrixRef.current,
      probeObject.matrixWorld.elements,
    )
    const shouldRender = !hasRenderedRef.current || settingsChanged || poseChanged
    const updateInterval =
      isProbeInteracting || isAutoSweepEnabled
        ? ACTIVE_TEXTURE_INTERVAL_SECONDS
        : IDLE_TEXTURE_INTERVAL_SECONDS

    if (!shouldRender) {
      return
    }

    if (hasRenderedRef.current && clock.elapsedTime - lastRenderTimeRef.current < updateInterval) {
      return
    }

    renderUltrasoundToCanvas({
      canvas,
      probeMatrixWorld: probeObject.matrixWorld,
      imagingWidth,
      imagingDepth,
      gain,
      probeFaceOffset: PROBE_FACE_OFFSET_CM,
      seed: 11,
    })
    texture.needsUpdate = true
    setUltrasoundCanvas(canvas)
    lastSettingsKeyRef.current = settingsKey
    copyMatrixElements(lastRenderedMatrixRef.current, probeObject.matrixWorld.elements)
    hasRenderedRef.current = true
    lastRenderTimeRef.current = clock.elapsedTime
  })

  if (!showSlicePlane) {
    return null
  }

  return (
    <group
      ref={groupRef}
      name="probe-attached-ultrasound-plane"
      position={[0, -PROBE_FACE_OFFSET_CM, 0]}
    >
      <mesh position={[0, -imagingDepth / 2, 0]}>
        <planeGeometry args={[imagingWidth, imagingDepth]} />
        <meshBasicMaterial
          color="#ffffff"
          map={texture}
          opacity={planeOpacity}
          side={DoubleSide}
          transparent
        />
      </mesh>

      {!freezeImage ? (
        <mesh ref={scanlineRef} position={[0, -0.01, 0.045]}>
          <boxGeometry args={[imagingWidth, 0.018, 0.006]} />
          <meshBasicMaterial color="#e7fbff" opacity={0.62} transparent />
        </mesh>
      ) : null}

      <SliceBorder depth={imagingDepth} width={imagingWidth} />
      <SliceOrientationMarkers depth={imagingDepth} width={imagingWidth} />
    </group>
  )
}

function hasMatrixChanged(previousMatrix: readonly number[], nextMatrix: readonly number[]) {
  if (previousMatrix.length !== nextMatrix.length) {
    return true
  }

  for (let index = 0; index < nextMatrix.length; index += 1) {
    if (Math.abs(previousMatrix[index] - nextMatrix[index]) > MATRIX_CHANGE_EPSILON) {
      return true
    }
  }

  return false
}

function copyMatrixElements(target: number[], source: readonly number[]) {
  target.length = source.length

  for (let index = 0; index < source.length; index += 1) {
    target[index] = source[index]
  }
}
