"use client";

import { useState } from "react";
import Astrolabe, { type AstroLocation } from "./Astrolabe";

type Stat = { value: string; label: string };

/** The astrolabe dial with counters on both sides and a row of place chips that turn the dial. */
export default function PresenceExplorer({
  locations,
  stats,
  hint,
  labels,
}: {
  locations: AstroLocation[];
  stats: Stat[];
  hint?: string;
  labels?: { hq?: string; office?: string; market?: string };
}) {
  const [focus, setFocus] = useState<string | null>(null);
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
          <Astrolabe locations={locations} labels={labels} focusId={focus} onSelect={setFocus} />
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
          <button suppressHydrationWarning key={l.id} role="listitem" className={`chip ${l.kind} ${focus === l.id ? "on" : ""}`} onClick={() => setFocus(l.id)} aria-pressed={focus === l.id}>
            <i />
            {l.city}
          </button>
        ))}
      </div>
      {hint ? (
        <p className="explorer-hint" data-edit="hero.hint">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
