import { Canvas } from '@react-three/fiber'
import { useState } from 'react'
import { AnatomyPhantom } from './AnatomyPhantom'
import { CameraRig } from './CameraRig'
import { GridFloor } from './GridFloor'
import { SceneLighting } from './SceneLighting'
import { UltrasoundProbe } from './UltrasoundProbe'
import { WorldAxes } from './WorldAxes'

export function SimulatorCanvas() {
  const [isCanvasReady, setCanvasReady] = useState(false)

  return (
    <div className="canvas-frame">
      {!isCanvasReady ? (
        <div className="canvas-loading" role="status">
          Initializing 3D simulator
        </div>
      ) : null}
      <Canvas
        fallback={<WebGLFallback />}
        dpr={[1, 1.35]}
        gl={{ antialias: true, powerPreference: 'high-performance', preserveDrawingBuffer: false }}
        onCreated={() => setCanvasReady(true)}
      >
        <color attach="background" args={['#070a0f']} />
        <CameraRig />
        <SceneLighting />
        <GridFloor />
        <AnatomyPhantom />
        <UltrasoundProbe />
        <WorldAxes />
      </Canvas>
    </div>
  )
}

function WebGLFallback() {
  return (
    <div className="canvas-fallback" role="alert">
      <strong>WebGL is unavailable.</strong>
      <span>This simulator needs browser WebGL support to render the 3D ultrasound scene.</span>
    </div>
  )
}
