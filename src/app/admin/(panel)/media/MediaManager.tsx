"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { uploadFiles } from "@/components/admin/MediaPicker";
import { deleteMedia, updateMediaAlt } from "../../actions";

type M = { id: string; url: string; filename: string; alt: string; mime: string; size: number };

export default function MediaManager({ items }: { items: M[] }) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [copied, setCopied] = useState("");

  const up = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true);
    setErr("");
    try {
      await uploadFiles(files);
      router.refresh();
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <div
        className={`dropzone ${over ? "over" : ""}`}
        onClick={() => input.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          up(e.dataTransfer.files);
        }}
      >
        {busy ? "Uploading…" : "Drop files here or click to upload"}
        <input suppressHydrationWarning ref={input} type="file" multiple hidden accept="image/*,application/pdf,video/mp4" onChange={(e) => up(e.target.files)} />
      </div>
      {err ? <p className="a-error">{err}</p> : null}
      <div className="media-grid">
        {items.map((m) => (
          <div className="media-card" key={m.id}>
            <div className="im">{m.mime.startsWith("image/") ? <img src={m.url} alt={m.alt} loading="lazy" /> : <span className="mp-file">{m.filename}</span>}</div>
            <div className="info">
              <input suppressHydrationWarning
                className="a-input small"
                defaultValue={m.alt}
                placeholder="Description (alt text)"
                onBlur={(e) => e.target.value !== m.alt && updateMediaAlt(m.id, e.target.value)}
              />
              <code>{m.url}</code>
              <span style={{ display: "flex", justifyContent: "space-between" }}>
                <button suppressHydrationWarning
                  className="a-link"
                  onClick={() => {
                    navigator.clipboard?.writeText(m.url);
                    setCopied(m.id);
                  }}
                >
                  {copied === m.id ? "Copied" : "Copy link"}
                </button>
                <span style={{ color: "#6b756f" }}>{(m.size / 1024 / 1024).toFixed(2)} MB</span>
                <button suppressHydrationWarning
                  className="a-link danger"
                  onClick={async () => {
                    if (!confirm("Delete this file? Pages using it will show no image.")) return;
                    await deleteMedia(m.id);
                    router.refresh();
                  }}
                >
                  Delete
                </button>
              </span>
            </div>
          </div>
        ))}
      </div>
      {!items.length ? <p className="a-hint">No uploads yet.</p> : null}
    </>
  );
}
