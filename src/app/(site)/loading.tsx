/** Shown instantly while the next page is being prepared. */
export default function Loading() {
  return (
    <div className="page-loading" role="status" aria-live="polite">
      <div className="pl-hero">
        <div className="wrap">
          <span className="sk sk-tag" />
          <span className="sk sk-h1" />
          <span className="sk sk-h1 short" />
          <span className="sk sk-p" />
        </div>
      </div>
      <div className="wrap pl-body">
        <span className="sk sk-card" />
        <span className="sk sk-card" />
        <span className="sk sk-card" />
      </div>
      <span className="pl-sr">Loading…</span>
    </div>
  );
}
