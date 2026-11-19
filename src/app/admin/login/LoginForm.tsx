"use client";

import { useActionState } from "react";
import { login } from "../actions";

export default function LoginForm() {
  const [state, action, pending] = useActionState(login, {});
  return (
    <form action={action}>
      <label htmlFor="email">Email</label>
      <input suppressHydrationWarning id="email" name="email" type="email" autoComplete="username" required />
      <label htmlFor="password">Password</label>
      <input suppressHydrationWarning id="password" name="password" type="password" autoComplete="current-password" required />
      {state?.error ? <p className="a-error">{state.error}</p> : null}
      <button suppressHydrationWarning disabled={pending}>{pending ? "Signing in…" : "Sign in"}</button>
    </form>
  );
}
