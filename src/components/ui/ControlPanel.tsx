import { useSimulatorStore } from '../../app/store'
import { formatCentimeters } from '../../domain/coordinates'

export function ControlPanel() {
  const imagingDepth = useSimulatorStore((state) => state.imagingDepth)
  const gain = useSimulatorStore((state) => state.gain)
  const planeOpacity = useSimulatorStore((state) => state.planeOpacity)
  const freezeImage = useSimulatorStore((state) => state.freezeImage)
  const isPresentationMode = useSimulatorStore((state) => state.isPresentationMode)
  const isAutoSweepEnabled = useSimulatorStore((state) => state.isAutoSweepEnabled)
  const showLabels = useSimulatorStore((state) => state.showLabels)
  const showOrgans = useSimulatorStore((state) => state.showOrgans)
  const showSliceHelpers = useSimulatorStore((state) => state.showSliceHelpers)
  const showSlicePlane = useSimulatorStore((state) => state.showSlicePlane)
  const showWrongOrientation = useSimulatorStore((state) => state.showWrongOrientation)
  const transformMode = useSimulatorStore((state) => state.transformMode)
  const setImagingDepth = useSimulatorStore((state) => state.setImagingDepth)
  const setGain = useSimulatorStore((state) => state.setGain)
  const setPlaneOpacity = useSimulatorStore((state) => state.setPlaneOpacity)
  const toggleFreezeImage = useSimulatorStore((state) => state.toggleFreezeImage)
  const toggleAutoSweep = useSimulatorStore((state) => state.toggleAutoSweep)
  const togglePresentationMode = useSimulatorStore((state) => state.togglePresentationMode)
  const toggleLabels = useSimulatorStore((state) => state.toggleLabels)
  const toggleOrgans = useSimulatorStore((state) => state.toggleOrgans)
  const toggleSliceHelpers = useSimulatorStore((state) => state.toggleSliceHelpers)
  const toggleSlicePlane = useSimulatorStore((state) => state.toggleSlicePlane)
  const toggleWrongOrientation = useSimulatorStore((state) => state.toggleWrongOrientation)
  const setTransformMode = useSimulatorStore((state) => state.setTransformMode)
  const resetProbe = useSimulatorStore((state) => state.resetProbe)

  return (
    <section className="glass-panel">
      <div className="panel-heading">
        <span className="eyebrow">Controls</span>
        <h2>Imaging settings</h2>
      </div>

      <div className="control-stack">
        <label className="range-control">
          <span>
            <strong>Imaging depth</strong>
            <em>{formatCentimeters(imagingDepth)}</em>
          </span>
          <input
            max="8"
            min="0.8"
            step="0.1"
            type="range"
            value={imagingDepth}
            onChange={(event) => setImagingDepth(event.currentTarget.valueAsNumber)}
          />
        </label>

        <label className="range-control">
          <span>
            <strong>Gain</strong>
            <em>{Math.round(gain * 100)}%</em>
          </span>
          <input
            max="2"
            min="0"
            step="0.05"
            type="range"
            value={gain}
            onChange={(event) => setGain(event.currentTarget.valueAsNumber)}
          />
        </label>

        <label className="range-control">
          <span>
            <strong>Plane opacity</strong>
            <em>{Math.round(planeOpacity * 100)}%</em>
          </span>
          <input
            max="1"
            min="0"
            step="0.02"
            type="range"
            value={planeOpacity}
            onChange={(event) => setPlaneOpacity(event.currentTarget.valueAsNumber)}
          />
        </label>

        <div className="segmented-control" aria-label="Transform mode">
          <button
            className={transformMode === 'translate' ? 'active' : ''}
            type="button"
            onClick={() => setTransformMode('translate')}
          >
            Translate
          </button>
          <button
            className={transformMode === 'rotate' ? 'active' : ''}
            type="button"
            onClick={() => setTransformMode('rotate')}
          >
            Rotate
          </button>
        </div>

        <div className="toggle-stack">
          <label>
            <input checked={freezeImage} type="checkbox" onChange={toggleFreezeImage} />
            Freeze image
          </label>
          <label>
            <input
              checked={isPresentationMode}
              type="checkbox"
              onChange={togglePresentationMode}
            />
            Presentation mode
          </label>
          <label>
            <input
              checked={showWrongOrientation}
              type="checkbox"
              onChange={toggleWrongOrientation}
            />
            Wrong orientation comparison
          </label>
          <label>
            <input checked={isAutoSweepEnabled} type="checkbox" onChange={toggleAutoSweep} />
            Auto demo sweep
          </label>
          <p className="control-caption">
            Automatically sweeps the probe to show changing slice anatomy.
          </p>
          <label>
            <input checked={showOrgans} type="checkbox" onChange={toggleOrgans} />
            Show organs
          </label>
          <label>
            <input checked={showLabels} type="checkbox" onChange={toggleLabels} />
            Show labels
          </label>
          <label>
            <input checked={showSlicePlane} type="checkbox" onChange={toggleSlicePlane} />
            Show slice plane
          </label>
          <label>
            <input checked={showSliceHelpers} type="checkbox" onChange={toggleSliceHelpers} />
            Show slice helpers
          </label>
        </div>

        <button className="secondary-action" type="button" onClick={resetProbe}>
          Reset probe
        </button>
      </div>
    </section>
  )
}
