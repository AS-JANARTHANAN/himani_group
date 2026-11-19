"use client";

import { useActionState } from "react";
import { changePassword, updateProfile, type Result } from "../../actions";

export default function AccountForms({ name, email }: { name: string; email: string }) {
  const [p, profileAction, p1] = useActionState<Result, FormData>(updateProfile, { ok: false });
  const [w, pwAction, p2] = useActionState<Result, FormData>(changePassword, { ok: false });
  return (
    <>
      <form action={profileAction} className="a-card">
        <div className="a-card-head">
          <h2>Profile</h2>
        </div>
        {p.error ? <p className="a-error">{p.error}</p> : p.ok ? <p className="a-ok">Profile updated.</p> : null}
        <div className="a-grid">
          <label className="a-field">
            <span className="a-label">Name</span>
            <input suppressHydrationWarning className="a-input" name="name" defaultValue={name} />
          </label>
          <label className="a-field">
            <span className="a-label">Email (used to sign in)</span>
            <input suppressHydrationWarning className="a-input" name="email" type="email" defaultValue={email} required />
          </label>
        </div>
        <div style={{ marginTop: 18 }}>
          <button suppressHydrationWarning className="a-btn" disabled={p1}>
            Save profile
          </button>
        </div>
      </form>
      <form action={pwAction} className="a-card">
        <div className="a-card-head">
          <h2>Change password</h2>
          <p>Use at least 10 characters.</p>
        </div>
        {w.error ? <p className="a-error">{w.error}</p> : w.ok ? <p className="a-ok">Password changed.</p> : null}
        <div className="a-grid">
          <label className="a-field wide">
            <span className="a-label">Current password</span>
            <input suppressHydrationWarning className="a-input" name="current" type="password" autoComplete="current-password" required />
          </label>
          <label className="a-field">
            <span className="a-label">New password</span>
            <input suppressHydrationWarning className="a-input" name="next" type="password" autoComplete="new-password" required minLength={10} />
          </label>
          <label className="a-field">
            <span className="a-label">Confirm new password</span>
            <input suppressHydrationWarning className="a-input" name="confirm" type="password" autoComplete="new-password" required minLength={10} />
          </label>
        </div>
        <div style={{ marginTop: 18 }}>
          <button suppressHydrationWarning className="a-btn" disabled={p2}>
            Update password
          </button>
        </div>
      </form>
    </>
  );
}
