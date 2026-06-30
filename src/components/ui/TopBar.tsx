export function TopBar() {
  return (
    <header className="top-bar">
      <div className="brand-lockup">
        <span className="brand-mark" aria-hidden="true">
          US
        </span>
        <div>
          <p className="eyebrow">AR-style visualization</p>
          <h1>Ultrasound Slice Simulator</h1>
        </div>
      </div>

      <div className="top-bar-meta" aria-label="Simulator status">
        <span className="status-pill">React + Three.js</span>
        <span className="status-pill accent">Synthetic phantom</span>
        <span className="disclaimer-badge">Synthetic educational simulator — not for diagnosis</span>
      </div>
    </header>
  )
}
