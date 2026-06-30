import { useSimulatorStore } from '../../app/store'
import { useEffect, useRef } from 'react'

export function ComparisonPanel() {
  const showWrongOrientation = useSimulatorStore((state) => state.showWrongOrientation)
  const toggleWrongOrientation = useSimulatorStore((state) => state.toggleWrongOrientation)
  const ultrasoundCanvas = useSimulatorStore((state) => state.ultrasoundCanvas)
  const ultrasoundRevision = useSimulatorStore((state) => state.ultrasoundRevision)
  const conventionalCanvasRef = useRef<HTMLCanvasElement>(null)
  const correctCanvasRef = useRef<HTMLCanvasElement>(null)
  const mirroredCanvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    drawMonitorCanvas(conventionalCanvasRef.current, ultrasoundCanvas, false)
    drawMonitorCanvas(correctCanvasRef.current, ultrasoundCanvas, false)
    drawMonitorCanvas(mirroredCanvasRef.current, ultrasoundCanvas, true)
  }, [showWrongOrientation, ultrasoundCanvas, ultrasoundRevision])

  return (
    <section className="glass-panel comparison-panel">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">Comparison</span>
          <h2>Slice orientation</h2>
        </div>
        <button className="panel-button" type="button" onClick={toggleWrongOrientation}>
          {showWrongOrientation ? 'Hide wrong' : 'Show wrong'}
        </button>
      </div>

      <p className="comparison-note">
        Same slice data, different spatial interpretation. In-situ registration reduces ambiguity
        by keeping the image attached to the probe plane.
      </p>

      <div className={showWrongOrientation ? 'comparison-grid with-wrong' : 'comparison-grid'}>
        <figure>
          <div className="scan-monitor conventional">
            <canvas
              ref={conventionalCanvasRef}
              aria-label="Conventional 2D monitor view"
              className="scan-canvas"
              height={160}
              width={120}
            />
          </div>
          <figcaption>Conventional 2D monitor view</figcaption>
        </figure>

        <figure>
          <div className="scan-monitor correct">
            <canvas
              ref={correctCanvasRef}
              aria-label="Correct in-situ slice"
              className="scan-canvas"
              height={160}
              width={120}
            />
            <span className="scan-orientation-marker" aria-hidden="true" />
          </div>
          <figcaption>Correct in-situ slice</figcaption>
        </figure>

        {showWrongOrientation ? (
          <figure>
            <div className="scan-monitor wrong">
              <canvas
                ref={mirroredCanvasRef}
                aria-label="Wrong mirrored orientation"
                className="scan-canvas mirrored"
                height={160}
                width={120}
              />
              <span className="monitor-warning">Wrong mirrored</span>
            </div>
            <figcaption className="warning-caption">Wrong mirrored orientation</figcaption>
          </figure>
        ) : null}
      </div>
    </section>
  )
}

function drawMonitorCanvas(
  targetCanvas: HTMLCanvasElement | null,
  sourceCanvas: HTMLCanvasElement | null,
  mirrored: boolean,
) {
  if (!targetCanvas) {
    return
  }

  const context = targetCanvas.getContext('2d')

  if (!context) {
    return
  }

  context.clearRect(0, 0, targetCanvas.width, targetCanvas.height)

  if (!sourceCanvas) {
    context.fillStyle = '#0b1117'
    context.fillRect(0, 0, targetCanvas.width, targetCanvas.height)
    context.fillStyle = '#7d8f92'
    context.font = '700 11px system-ui'
    context.fillText('Waiting for slice', 14, targetCanvas.height / 2)
    return
  }

  context.save()
  if (mirrored) {
    context.translate(targetCanvas.width, 0)
    context.scale(-1, 1)
  }
  context.drawImage(sourceCanvas, 0, 0, targetCanvas.width, targetCanvas.height)
  context.restore()
}
