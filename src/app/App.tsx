import { SimulatorCanvas } from '../components/scene/SimulatorCanvas'
import { ComparisonPanel } from '../components/ui/ComparisonPanel'
import { ControlPanel } from '../components/ui/ControlPanel'
import { FpsReadout } from '../components/ui/FpsReadout'
import { InfoPanel } from '../components/ui/InfoPanel'
import { TopBar } from '../components/ui/TopBar'
import { useAutoSweep } from '../hooks/useAutoSweep'
import { useProbeKeyboardControls } from '../hooks/useProbeKeyboardControls'

function App() {
  useProbeKeyboardControls()
  useAutoSweep()

  return (
    <div className="simulator-shell">
      <TopBar />

      <main className="simulator-main">
        <section className="viewport-panel" aria-label="3D simulator viewport">
          <div className="viewport-toolbar">
            <div>
              <span className="eyebrow">Scene</span>
              <strong>Orbitable simulator stage</strong>
            </div>
            <div className="viewport-status">
              <FpsReadout />
              <span className="live-chip">Orbit controls active</span>
            </div>
          </div>

          <SimulatorCanvas />

          <details className="keyboard-card" open>
            <summary>
              <span className="eyebrow">Keyboard</span>
              <span>Shortcuts</span>
            </summary>
            <div className="key-grid">
              <span>W/S</span>
              <strong>Superior / inferior</strong>
              <span>A/D</span>
              <strong>Left / right</strong>
              <span>R/F</span>
              <strong>Raise / lower</strong>
              <span>Arrows</span>
              <strong>Yaw / pitch</strong>
              <span>Q/E</span>
              <strong>Roll probe</strong>
              <span>[ / ]</span>
              <strong>Depth</strong>
              <span>G/H</span>
              <strong>Gain</strong>
              <span>O/P</span>
              <strong>Opacity</strong>
              <span>Space</span>
              <strong>Freeze</strong>
              <span>C / L</span>
              <strong>Compare / labels</strong>
              <span>1 / 2</span>
              <strong>Move / rotate</strong>
              <span>0</span>
              <strong>Reset</strong>
            </div>
          </details>
        </section>

        <aside className="side-panel" aria-label="Simulator controls and readouts">
          <ControlPanel />
          <ComparisonPanel />
          <InfoPanel />
        </aside>
      </main>
    </div>
  )
}

export default App
