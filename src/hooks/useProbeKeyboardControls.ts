import { useEffect } from 'react'
import { useSimulatorStore } from '../app/store'

const MOVE_SPEED_UNITS_PER_SECOND = 1.25
const ROTATION_SPEED_RADIANS_PER_SECOND = 1.2
const DEPTH_SPEED_UNITS_PER_SECOND = 1
const GAIN_SPEED_PER_SECOND = 0.65
const OPACITY_SPEED_PER_SECOND = 0.55
const MAX_FRAME_DELTA_SECONDS = 0.05

const PREVENT_SCROLL_KEYS = new Set(['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' '])
const CONTROL_KEYS = new Set([
  'w',
  's',
  'a',
  'd',
  'r',
  'f',
  'arrowleft',
  'arrowright',
  'arrowup',
  'arrowdown',
  'q',
  'e',
  '[',
  ']',
  'g',
  'h',
  'o',
  'p',
])

const AUTO_SWEEP_INTERRUPT_KEYS = CONTROL_KEYS

export function useProbeKeyboardControls() {
  useEffect(() => {
    const pressedKeys = new Set<string>()
    let animationFrameId = 0
    let previousTime = performance.now()

    function handleKeyDown(event: KeyboardEvent) {
      const key = normalizeKey(event.key)

      if (isEditableTarget(event.target) && !canProbeControlOverrideFocusedTarget(event.target, key)) {
        return
      }

      if (PREVENT_SCROLL_KEYS.has(event.key)) {
        event.preventDefault()
      }

      if (handleDiscreteShortcut(key, event.repeat)) {
        event.preventDefault()
        return
      }

      if (AUTO_SWEEP_INTERRUPT_KEYS.has(key)) {
        event.preventDefault()
        useSimulatorStore.getState().stopAutoSweep()
        pressedKeys.add(key)
      }
    }

    function handleKeyUp(event: KeyboardEvent) {
      pressedKeys.delete(normalizeKey(event.key))
    }

    function updateControls(currentTime: number) {
      const deltaSeconds = Math.min(
        (currentTime - previousTime) / 1000,
        MAX_FRAME_DELTA_SECONDS,
      )
      previousTime = currentTime

      if (pressedKeys.size > 0) {
        applyContinuousControls(pressedKeys, deltaSeconds)
      }

      animationFrameId = window.requestAnimationFrame(updateControls)
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    animationFrameId = window.requestAnimationFrame(updateControls)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      window.cancelAnimationFrame(animationFrameId)
    }
  }, [])
}

function applyContinuousControls(pressedKeys: ReadonlySet<string>, deltaSeconds: number) {
  const state = useSimulatorStore.getState()
  const movementStep = MOVE_SPEED_UNITS_PER_SECOND * deltaSeconds
  const rotationStep = ROTATION_SPEED_RADIANS_PER_SECOND * deltaSeconds
  const depthStep = DEPTH_SPEED_UNITS_PER_SECOND * deltaSeconds
  const gainStep = GAIN_SPEED_PER_SECOND * deltaSeconds
  const opacityStep = OPACITY_SPEED_PER_SECOND * deltaSeconds

  let deltaX = 0
  let deltaY = 0
  let deltaZ = 0
  let deltaYaw = 0
  let deltaPitch = 0
  let deltaRoll = 0

  if (pressedKeys.has('a')) deltaX -= movementStep
  if (pressedKeys.has('d')) deltaX += movementStep
  if (pressedKeys.has('s')) deltaY -= movementStep
  if (pressedKeys.has('w')) deltaY += movementStep
  if (pressedKeys.has('f')) deltaZ -= movementStep
  if (pressedKeys.has('r')) deltaZ += movementStep

  if (pressedKeys.has('arrowleft')) deltaYaw += rotationStep
  if (pressedKeys.has('arrowright')) deltaYaw -= rotationStep
  if (pressedKeys.has('arrowup')) deltaPitch += rotationStep
  if (pressedKeys.has('arrowdown')) deltaPitch -= rotationStep
  if (pressedKeys.has('q')) deltaRoll += rotationStep
  if (pressedKeys.has('e')) deltaRoll -= rotationStep

  if (deltaX !== 0 || deltaY !== 0 || deltaZ !== 0) {
    state.nudgeProbe([deltaX, deltaY, deltaZ])
  }

  if (deltaYaw !== 0 || deltaPitch !== 0 || deltaRoll !== 0) {
    state.rotateProbe({ yaw: deltaYaw, pitch: deltaPitch, roll: deltaRoll })
  }

  if (pressedKeys.has('[')) {
    state.setImagingDepth(state.imagingDepth - depthStep)
  }
  if (pressedKeys.has(']')) {
    state.setImagingDepth(state.imagingDepth + depthStep)
  }
  if (pressedKeys.has('g')) {
    state.setGain(state.gain - gainStep)
  }
  if (pressedKeys.has('h')) {
    state.setGain(state.gain + gainStep)
  }
  if (pressedKeys.has('o')) {
    state.setPlaneOpacity(state.planeOpacity - opacityStep)
  }
  if (pressedKeys.has('p')) {
    state.setPlaneOpacity(state.planeOpacity + opacityStep)
  }
}

function handleDiscreteShortcut(key: string, isRepeat: boolean): boolean {
  if (isRepeat) {
    return false
  }

  const state = useSimulatorStore.getState()

  switch (key) {
    case ' ':
      state.toggleFreezeImage()
      return true
    case 'c':
      state.toggleWrongOrientation()
      return true
    case 'l':
      state.toggleLabels()
      return true
    case '1':
      state.setTransformMode('translate')
      return true
    case '2':
      state.setTransformMode('rotate')
      return true
    case '0':
      state.resetProbe()
      return true
    default:
      return false
  }
}

function normalizeKey(key: string): string {
  return key.toLowerCase()
}

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false
  }

  return (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement ||
    target.isContentEditable
  )
}

function canProbeControlOverrideFocusedTarget(target: EventTarget | null, key: string): boolean {
  return (
    target instanceof HTMLInputElement &&
    !isTextEntryInputType(target.type) &&
    AUTO_SWEEP_INTERRUPT_KEYS.has(key)
  )
}

function isTextEntryInputType(inputType: string): boolean {
  return [
    'email',
    'number',
    'password',
    'search',
    'tel',
    'text',
    'url',
  ].includes(inputType)
}
