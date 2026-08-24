"use client";

import { useState } from "react";
import { ArrowRight } from "@/components/marketing-nav";

const OPERATION_OPTIONS = [
  { value: "pest_control", label: "Pest control" },
  { value: "fire_safety", label: "Fire safety" },
  { value: "facility_management", label: "Facility management (FM)" },
  { value: "other", label: "Other" },
] as const;

function industryPhraseFor(operationType: string) {
  switch (operationType) {
    case "pest_control":
      return "pest control companies";
    case "fire_safety":
      return "fire safety companies";
    case "facility_management":
      return "FM companies";
    case "other":
      return "operations like yours";
    default:
      return "pest control / fire safety / FM companies";
  }
}

function industryLabelFor(operationType: string) {
  return OPERATION_OPTIONS.find((opt) => opt.value === operationType)?.label ?? "";
}

type FormStatus = "idle" | "loading" | "success" | "error";

export function WalkthroughLeadForm() {
  const [fullName, setFullName] = useState("");
  const [workEmail, setWorkEmail] = useState("");
  const [operationType, setOperationType] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const industryPhrase = industryPhraseFor(operationType);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!fullName.trim() || !workEmail.trim() || !operationType) {
      setErrorMsg("Please fill in all fields.");
      setStatus("error");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(workEmail.trim())) {
      setErrorMsg("Please enter a valid work email.");
      setStatus("error");
      return;
    }
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/walkthrough-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          workEmail: workEmail.trim(),
          industry: industryLabelFor(operationType),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong. Please try again.");
      }
      setStatus("success");
      setFullName("");
      setWorkEmail("");
      setOperationType("");
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    }
  }

  if (status === "success") {
    return (
      <div className="f19-lead-form f19-lead-form--success">
        <div className="f19-lead-form__success-icon" aria-hidden>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M3.5 9.5L7 13L14.5 5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <p className="f19-lead-form__success-text">
          Thanks! We got your details and will get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <form className="f19-lead-form" onSubmit={handleSubmit} noValidate>
      <div className="f19-lead-form__eyebrow">Tailored walkthrough</div>
      <h3 className="f19-lead-form__title">
        Built for <em>{industryPhrase}</em>
      </h3>
      <p className="f19-lead-form__hint">
        Not ready to talk to Aria? Leave your details and we&apos;ll send a
        walkthrough for your operation.
      </p>
      <div className="f19-lead-form__fields">
        <label className="f19-lead-form__field">
          <span className="f19-lead-form__label">Full name</span>
          <input
            type="text"
            name="fullName"
            className="f19-lead-form__input"
            autoComplete="name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Jane Smith"
          />
        </label>
        <label className="f19-lead-form__field">
          <span className="f19-lead-form__label">Work email</span>
          <input
            type="email"
            name="workEmail"
            className="f19-lead-form__input"
            autoComplete="email"
            value={workEmail}
            onChange={(e) => setWorkEmail(e.target.value)}
            placeholder="you@company.com"
          />
        </label>
        <label className="f19-lead-form__field">
          <span className="f19-lead-form__label">Industry</span>
          <select
            name="operationType"
            className="f19-lead-form__select"
            value={operationType}
            onChange={(e) => setOperationType(e.target.value)}
          >
            <option value="" disabled>
              Select your industry
            </option>
            {OPERATION_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      {errorMsg ? (
        <p className="f19-lead-form__error" role="alert">
          {errorMsg}
        </p>
      ) : null}
      <button
        type="submit"
        className="btn btn-brand f19-lead-form__submit"
        disabled={status === "loading"}
        style={{ opacity: status === "loading" ? 0.7 : 1 }}
      >
        {status === "loading" ? "Sending…" : "Send me the walkthrough"}{" "}
        <ArrowRight />
      </button>
    </form>
  );
}
