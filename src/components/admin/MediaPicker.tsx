"use client";

import { useEffect, useRef, useState } from "react";

type Item = { url: string; filename: string; mime?: string };

export async function uploadFiles(files: FileList | File[]): Promise<Item[]> {
  const fd = new FormData();
  Array.from(files).forEach((f) => fd.append("file", f));
  const r = await fetch("/api/admin/media", { method: "POST", body: fd });
  const j = await r.json();
  if (!r.ok) throw new Error(j.error || "Upload failed");
  return j.items;
}

export function MediaPicker({ onPick, onClose }: { onPick: (url: string) => void; onClose: () => void }) {
  const [items, setItems] = useState<Item[]>([]);
  const [builtIn, setBuiltIn] = useState<Item[]>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const input = useRef<HTMLInputElement>(null);

  const load = () =>
    fetch("/api/admin/media")
      .then((r) => r.json())
      .then((j) => {
        setItems(j.items || []);
        setBuiltIn(j.builtIn || []);
      });

  useEffect(() => {
    load();
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);

  const up = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true);
    setErr("");
    try {
      const added = await uploadFiles(files);
      if (added.length === 1) return onPick(added[0].url);
      await load();
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  };

  const Tile = ({ m }: { m: Item }) => (
    <button suppressHydrationWarning type="button" className="mp-tile" onClick={() => onPick(m.url)} title={m.filename}>
      {m.mime === "application/pdf" || m.mime === "video/mp4" ? <span className="mp-file">{m.filename}</span> : <img src={m.url} alt="" loading="lazy" />}
    </button>
  );

  return (
    <div className="modal-back" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-label="Media library">
        <div className="modal-head">
          <h3>Choose a photo</h3>
          <div style={{ display: "flex", gap: 10 }}>
            <button suppressHydrationWarning type="button" className="a-btn" onClick={() => input.current?.click()} disabled={busy}>
              {busy ? "Uploading…" : "⬆ Upload from my computer"}
            </button>
            <button suppressHydrationWarning type="button" className="a-btn ghost" onClick={onClose}>
              Close
            </button>
          </div>
          <input suppressHydrationWarning ref={input} type="file" accept="image/*" multiple hidden onChange={(e) => up(e.target.files)} />
        </div>
        {err ? <p className="a-error">{err}</p> : null}
        <div
          className="modal-body"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            up(e.dataTransfer.files);
          }}
        >
          <p className="a-hint">Click a photo to use it. To add your own, press “Upload from my computer” or drag photos into this window. Big photos (2000px wide or more) look sharpest.</p>
          {items.length ? (
            <>
              <h4 className="mp-h">Your uploads</h4>
              <div className="mp-grid">
                {items.map((m) => (
                  <Tile key={m.url} m={m} />
                ))}
              </div>
            </>
          ) : null}
          <h4 className="mp-h">Ready-made photos</h4>
          <div className="mp-grid">
            {builtIn.map((m) => (
              <Tile key={m.url} m={m} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
