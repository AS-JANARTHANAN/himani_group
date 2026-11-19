"use client";

import { useState } from "react";
import Globe, { type GlobeLocation } from "./Globe";

type L = GlobeLocation & { description: string };
type Stat = { value: string; label: string };

/** Centered globe with flanking counters and a row of location chips that steer the globe. */
export default function PresenceExplorer({ locations, stats, hint }: { locations: L[]; stats: Stat[]; hint?: string }) {
  const [focus, setFocus] = useState<string | null>(null);
  const cur = locations.find((l) => l.id === focus);
  const left = stats.slice(0, Math.ceil(stats.length / 2));
  const right = stats.slice(Math.ceil(stats.length / 2));
  return (
    <div className="explorer">
      <div className="explorer-stage">
        <div className="explorer-stats left">
          {left.map((s) => (
            <div key={s.label}>
              <b>{s.value}</b>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
        <div className="explorer-globe">
          <Globe locations={locations} focusId={focus} onSelect={setFocus} />
          <div className={`explorer-card ${cur ? "on" : ""}`} aria-live="polite">
            {cur ? (
              <>
                <small>{cur.country}</small>
                <strong>{cur.city}</strong>
                {cur.description ? <span>{cur.description}</span> : null}
              </>
            ) : null}
          </div>
        </div>
        <div className="explorer-stats right">
          {right.map((s) => (
            <div key={s.label}>
              <b>{s.value}</b>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="chips" role="list">
        {locations.map((l) => (
          <button suppressHydrationWarning key={l.id} role="listitem" className={`chip ${l.kind} ${focus === l.id ? "on" : ""}`} onClick={() => setFocus(focus === l.id ? null : l.id)} aria-pressed={focus === l.id}>
            <i />
            {l.city}
          </button>
        ))}
      </div>
      {hint ? <p className="explorer-hint" data-edit="hero.hint">{hint}</p> : null}
    </div>
  );
}
