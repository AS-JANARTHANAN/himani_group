"use client";

import { useActionState, useEffect, useRef } from "react";
import { submitEnquiry, type EnquiryState } from "@/app/(site)/contact/actions";

type Props = {
  labels: Record<string, string>;
  interests: { value: string; label: string }[];
  defaultInterest?: string;
};

export default function ContactForm({ labels, interests, defaultInterest }: Props) {
  // "?interest=<service>" (from a service page button) pre-selects that service once the page is open
  const interestRef = useRef<HTMLSelectElement>(null);
  useEffect(() => {
    const slug = defaultInterest || new URLSearchParams(window.location.search).get("interest");
    const label = interests.find((i) => i.value === slug)?.label;
    if (label && interestRef.current) interestRef.current.value = label;
  }, [defaultInterest, interests]);
  const [state, action, pending] = useActionState<EnquiryState, FormData>(submitEnquiry, { ok: false });

  if (state.ok)
    return (
      <div className="form-success" data-edit="form.successTitle">
        <h2 className="h2">{labels.successTitle}</h2>
        <p>{labels.successText}</p>
      </div>
    );

  const err = (k: string) => (state.errors?.[k] ? <span className="err">{state.errors[k]}</span> : null);
  const def = interests.find((i) => i.value === defaultInterest)?.label || "";

  return (
    <form action={action} className="form" noValidate>
      <div className="field">
        <label htmlFor="f-name" data-edit="form.name">{labels.name}</label>
        <input suppressHydrationWarning id="f-name" name="name" autoComplete="name" required />
        {err("name")}
      </div>
      <div className="field">
        <label htmlFor="f-email" data-edit="form.email">{labels.email}</label>
        <input suppressHydrationWarning id="f-email" name="email" type="email" autoComplete="email" required />
        {err("email")}
      </div>
      <div className="field">
        <label htmlFor="f-phone" data-edit="form.phone">{labels.phone}</label>
        <input suppressHydrationWarning id="f-phone" name="phone" type="tel" autoComplete="tel" />
      </div>
      <div className="field">
        <label htmlFor="f-company" data-edit="form.company">{labels.company}</label>
        <input suppressHydrationWarning id="f-company" name="company" autoComplete="organization" />
      </div>
      <div className="field full">
        <label htmlFor="f-interest" data-edit="form.interestLabel">{labels.interestLabel}</label>
        <select suppressHydrationWarning id="f-interest" name="interest" defaultValue={def} ref={interestRef}>
          <option value="">{labels.generalOption}</option>
          {interests.map((i) => (
            <option key={i.value} value={i.label}>
              {i.label}
            </option>
          ))}
        </select>
      </div>
      <div className="field full">
        <label htmlFor="f-message" data-edit="form.message">{labels.message}</label>
        <textarea suppressHydrationWarning id="f-message" name="message" required />
        {err("message")}
      </div>
      <div className="hp" aria-hidden>
        <label>
          Website <input suppressHydrationWarning name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <div className="form-foot full">
        <small data-edit="form.privacyNote">{state.error ? <span className="err">{state.error}</span> : labels.privacyNote}</small>
        <button suppressHydrationWarning className="btn" disabled={pending} data-edit="form.submitLabel">
          {pending ? labels.sending || "…" : labels.submitLabel}
        </button>
      </div>
    </form>
  );
}
