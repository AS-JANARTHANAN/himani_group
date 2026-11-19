/** Shown instantly when switching admin screens, while the next one loads. */
export default function Loading() {
  return (
    <div className="a-loading" role="status" aria-live="polite">
      <div className="a-sk a-sk-crumb" />
      <div className="a-sk a-sk-title" />
      <div className="a-sk a-sk-text" />
      <div className="a-sk-grid">
        <div className="a-sk a-sk-card" />
        <div className="a-sk a-sk-card" />
      </div>
      <span className="a-sk-label">Loading…</span>
    </div>
  );
}
