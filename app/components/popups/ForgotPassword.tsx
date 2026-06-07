"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ForgotPasswordProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignIn: () => void;
}

type Step = "email" | "code" | "password" | "done";

const FIELD_STYLE = `
  width: 100%; padding: 14px 0; border: none; border-bottom: 1px solid var(--stone);
  background: transparent; outline: none;
  font-family: 'Jost', sans-serif; font-size: 13px;
  letter-spacing: 0.06em; color: var(--charcoal);
  transition: border-color 0.25s;
`;

export default function ForgotPassword({ isOpen, onClose, onSwitchToSignIn }: ForgotPasswordProps) {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const codeRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep("email"); setEmail(""); setCode(["","","","","",""]);
        setNewPassword(""); setConfirmPassword(""); setError("");
      }, 400);
    }
  }, [isOpen]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown(v => v - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  const handleCodeChange = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...code];
    next[i] = val;
    setCode(next);
    setError("");
    if (val && i < 5) codeRefs.current[i + 1]?.focus();
  };

  const handleCodeKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[i] && i > 0) {
      codeRefs.current[i - 1]?.focus();
    }
  };

  const handleCodePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6).split("");
    const next = ["", "", "", "", "", ""];
    digits.forEach((d, i) => { next[i] = d; });
    setCode(next);
    codeRefs.current[Math.min(digits.length, 5)]?.focus();
  };

  const sendCode = async () => {
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message); return; }
      setStep("code");
      setResendCooldown(60);
    } catch { setError("Network error. Please try again."); }
    finally { setLoading(false); }
  };

  const verifyCode = async () => {
    const token = code.join("");
    if (token.length < 6) { setError("Please enter the full 6-digit code."); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/auth/verify-reset-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message); return; }
      setStep("password");
    } catch { setError("Network error. Please try again."); }
    finally { setLoading(false); }
  };

  const resetPassword = async () => {
    if (newPassword.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (newPassword !== confirmPassword) { setError("Passwords do not match."); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token: code.join(""), newPassword }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message); return; }
      setStep("done");
      setTimeout(() => { onClose(); onSwitchToSignIn(); }, 1800);
    } catch { setError("Network error. Please try again."); }
    finally { setLoading(false); }
  };

  const stepMeta = {
    email:    { label: "Account Recovery", title: "Forgot Your", titleEm: "Password?" },
    code:     { label: "Verification", title: "Enter Your", titleEm: "Code" },
    password: { label: "New Password", title: "Reset Your", titleEm: "Password" },
    done:     { label: "All Done", title: "Password", titleEm: "Updated" },
  };

  const meta = stepMeta[step];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&family=Jost:wght@300;400;500&display=swap');
            :root {
              --cream: #FAF8F5; --warm: #F2EDE6; --stone: #D9D0C4;
              --mink: #9E9189; --charcoal: #2C2925; --ink: #1A1714;
              --gold: #B89A6A; --gold-lt: #D4B896;
            }
            .fp-field { ${FIELD_STYLE} }
            .fp-field:focus { border-color: var(--gold); }
            .fp-field::placeholder { color: var(--stone); }
            .fp-label {
              display: block; font-family: 'Jost', sans-serif;
              font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase;
              color: var(--mink); margin-bottom: 2px;
            }
            .fp-btn {
              width: 100%; padding: 15px;
              background: var(--charcoal); color: var(--cream);
              border: none; cursor: pointer;
              font-family: 'Jost', sans-serif; font-size: 11px;
              letter-spacing: 0.22em; text-transform: uppercase;
              transition: background 0.25s, transform 0.15s;
            }
            .fp-btn:hover:not(:disabled) { background: var(--gold); }
            .fp-btn:active { transform: scale(0.99); }
            .fp-btn:disabled { opacity: 0.55; cursor: not-allowed; }
            .fp-code-input {
              width: 44px; height: 54px;
              border: 1px solid var(--stone); background: transparent;
              font-family: 'Jost', sans-serif; font-size: 22px; font-weight: 400;
              text-align: center; color: var(--charcoal); outline: none;
              transition: border-color 0.2s, background 0.2s;
              -moz-appearance: textfield;
            }
            .fp-code-input::-webkit-outer-spin-button,
            .fp-code-input::-webkit-inner-spin-button { -webkit-appearance: none; }
            .fp-code-input:focus { border-color: var(--gold); background: var(--warm); }
            .fp-code-input.filled { border-color: var(--charcoal); }
          `}</style>

          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            style={{
              position: "fixed", inset: 0, zIndex: 200,
              background: "rgba(26,23,20,0.55)", backdropFilter: "blur(4px)",
            }}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 340, damping: 36 }}
            style={{
              position: "fixed", top: 0, right: 0, bottom: 0,
              width: "min(440px, 100vw)", zIndex: 201,
              background: "var(--cream)",
              display: "flex", flexDirection: "column",
              boxShadow: "-24px 0 64px rgba(44,41,37,0.14)",
            }}
          >
            {/* Gold accent line */}
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0,
              height: 2,
              background: "linear-gradient(90deg, var(--gold), var(--gold-lt), transparent)",
            }} />

            {/* Header */}
            <div style={{
              padding: "32px 40px 28px",
              borderBottom: "1px solid var(--warm)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <p style={{
                    fontFamily: "'Jost', sans-serif", fontSize: 9,
                    letterSpacing: "0.28em", textTransform: "uppercase",
                    color: "var(--gold)", marginBottom: 8,
                  }}>
                    Chanely · {meta.label}
                  </p>
                  <h2 style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 34, fontWeight: 300,
                    color: "var(--ink)", lineHeight: 1.1, margin: 0,
                  }}>
                    {meta.title}<br /><em>{meta.titleEm}</em>
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    color: "var(--mink)", padding: 4, marginTop: 4, transition: "color 0.2s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = "var(--charcoal)")}
                  onMouseLeave={e => (e.currentTarget.style.color = "var(--mink)")}
                  aria-label="Close"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {/* Step progress dots */}
              {step !== "done" && (
                <div style={{ display: "flex", gap: 6, marginTop: 20 }}>
                  {(["email", "code", "password"] as Step[]).map((s, i) => {
                    const steps: Step[] = ["email", "code", "password"];
                    const current = steps.indexOf(step);
                    const active = i <= current;
                    return (
                      <div key={s} style={{
                        height: 2, flex: 1,
                        background: active ? "var(--gold)" : "var(--stone)",
                        transition: "background 0.4s",
                        borderRadius: 1,
                      }} />
                    );
                  })}
                </div>
              )}
            </div>

            {/* Body */}
            <div style={{ flex: 1, overflowY: "auto", padding: "36px 40px" }}>
              <AnimatePresence mode="wait">

                {/* ── Step 1: Email ── */}
                {step === "email" && (
                  <motion.div key="email"
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    style={{ display: "flex", flexDirection: "column", gap: 28 }}
                  >
                    <p style={{
                      fontFamily: "'Jost', sans-serif", fontSize: 12,
                      color: "var(--mink)", lineHeight: 1.8, letterSpacing: "0.04em", margin: 0,
                    }}>
                      Enter the email address linked to your Chanely account. We&apos;ll send you a 6-digit verification code.
                    </p>

                    <div>
                      <label className="fp-label">Email Address</label>
                      <input
                        className="fp-field"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={e => { setEmail(e.target.value); setError(""); }}
                        onKeyDown={e => e.key === "Enter" && email && sendCode()}
                        autoComplete="email"
                        autoFocus
                      />
                    </div>

                    <AnimatePresence>
                      {error && <ErrorMsg message={error} />}
                    </AnimatePresence>

                    <button className="fp-btn" onClick={sendCode} disabled={loading || !email}>
                      {loading ? "Sending…" : "Send Verification Code"}
                    </button>

                    <button
                      onClick={onSwitchToSignIn}
                      style={{
                        background: "none", border: "1px solid var(--stone)", padding: "14px",
                        cursor: "pointer", fontFamily: "'Jost', sans-serif", fontSize: 11,
                        letterSpacing: "0.18em", textTransform: "uppercase",
                        color: "var(--charcoal)", transition: "border-color 0.2s, color 0.2s",
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--gold)";
                        (e.currentTarget as HTMLButtonElement).style.color = "var(--gold)";
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--stone)";
                        (e.currentTarget as HTMLButtonElement).style.color = "var(--charcoal)";
                      }}
                    >
                      Back to Sign In
                    </button>
                  </motion.div>
                )}

                {/* ── Step 2: Code ── */}
                {step === "code" && (
                  <motion.div key="code"
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    style={{ display: "flex", flexDirection: "column", gap: 28 }}
                  >
                    <p style={{
                      fontFamily: "'Jost', sans-serif", fontSize: 12,
                      color: "var(--mink)", lineHeight: 1.8, letterSpacing: "0.04em", margin: 0,
                    }}>
                      A 6-digit code was sent to <strong style={{ color: "var(--charcoal)" }}>{email}</strong>. It expires in 15 minutes.
                    </p>

                    {/* Code inputs */}
                    <div style={{ display: "flex", gap: 8, justifyContent: "center" }} onPaste={handleCodePaste}>
                      {code.map((digit, i) => (
                        <input
                          key={i}
                          ref={el => { codeRefs.current[i] = el; }}
                          className={`fp-code-input${digit ? " filled" : ""}`}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={e => handleCodeChange(i, e.target.value)}
                          onKeyDown={e => handleCodeKeyDown(i, e)}
                        />
                      ))}
                    </div>

                    <AnimatePresence>
                      {error && <ErrorMsg message={error} />}
                    </AnimatePresence>

                    <button className="fp-btn" onClick={verifyCode} disabled={loading || code.join("").length < 6}>
                      {loading ? "Verifying…" : "Verify Code"}
                    </button>

                    {/* Resend */}
                    <div style={{ textAlign: "center" }}>
                      {resendCooldown > 0 ? (
                        <span style={{
                          fontFamily: "'Jost', sans-serif", fontSize: 10,
                          color: "var(--mink)", letterSpacing: "0.06em",
                        }}>
                          Resend available in {resendCooldown}s
                        </span>
                      ) : (
                        <button
                          onClick={() => { setCode(["","","","","",""]); sendCode(); }}
                          style={{
                            background: "none", border: "none", cursor: "pointer",
                            fontFamily: "'Jost', sans-serif", fontSize: 10,
                            letterSpacing: "0.12em", textTransform: "uppercase",
                            color: "var(--gold)", textDecoration: "underline",
                            textUnderlineOffset: 3,
                          }}
                        >
                          Resend Code
                        </button>
                      )}
                    </div>

                    <button
                      onClick={() => { setStep("email"); setError(""); setCode(["","","","","",""]); }}
                      style={{
                        background: "none", border: "none", cursor: "pointer",
                        fontFamily: "'Jost', sans-serif", fontSize: 10,
                        letterSpacing: "0.12em", color: "var(--mink)",
                        textAlign: "center",
                      }}
                    >
                      ← Change email address
                    </button>
                  </motion.div>
                )}

                {/* ── Step 3: New Password ── */}
                {step === "password" && (
                  <motion.div key="password"
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    style={{ display: "flex", flexDirection: "column", gap: 28 }}
                  >
                    <p style={{
                      fontFamily: "'Jost', sans-serif", fontSize: 12,
                      color: "var(--mink)", lineHeight: 1.8, letterSpacing: "0.04em", margin: 0,
                    }}>
                      Choose a new password for your account.
                    </p>

                    <div>
                      <label className="fp-label">New Password</label>
                      <div style={{ position: "relative" }}>
                        <input
                          className="fp-field"
                          type={showNew ? "text" : "password"}
                          placeholder="Min. 8 characters"
                          value={newPassword}
                          onChange={e => { setNewPassword(e.target.value); setError(""); }}
                          autoComplete="new-password"
                          style={{ paddingRight: 36 }}
                        />
                        <EyeToggle show={showNew} onToggle={() => setShowNew(v => !v)} />
                      </div>
                    </div>

                    <div>
                      <label className="fp-label">Confirm Password</label>
                      <div style={{ position: "relative" }}>
                        <input
                          className="fp-field"
                          type={showConfirm ? "text" : "password"}
                          placeholder="Repeat your new password"
                          value={confirmPassword}
                          onChange={e => { setConfirmPassword(e.target.value); setError(""); }}
                          autoComplete="new-password"
                          style={{ paddingRight: 36 }}
                        />
                        <EyeToggle show={showConfirm} onToggle={() => setShowConfirm(v => !v)} />
                      </div>
                    </div>

                    {/* Password strength hint */}
                    {newPassword && (
                      <PasswordStrength password={newPassword} />
                    )}

                    <AnimatePresence>
                      {error && <ErrorMsg message={error} />}
                    </AnimatePresence>

                    <button className="fp-btn" onClick={resetPassword} disabled={loading || !newPassword || !confirmPassword}>
                      {loading ? "Updating…" : "Update Password"}
                    </button>
                  </motion.div>
                )}

                {/* ── Step 4: Done ── */}
                {step === "done" && (
                  <motion.div key="done"
                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                    style={{ textAlign: "center", paddingTop: 60 }}
                  >
                    <motion.div
                      initial={{ scale: 0.7, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      style={{
                        width: 56, height: 56, borderRadius: "50%",
                        border: "1.5px solid var(--gold)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        margin: "0 auto 24px",
                      }}
                    >
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </motion.div>
                    <p style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: 26, fontWeight: 300, color: "var(--charcoal)",
                      marginBottom: 12,
                    }}>
                      Password Updated
                    </p>
                    <p style={{
                      fontFamily: "'Jost', sans-serif", fontSize: 11,
                      color: "var(--mink)", letterSpacing: "0.06em",
                    }}>
                      Redirecting you to sign in…
                    </p>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>

            {/* Footer */}
            <div style={{
              padding: "20px 40px", borderTop: "1px solid var(--warm)",
              display: "flex", alignItems: "center", gap: 12,
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--stone)" strokeWidth="1.5">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
              <span style={{
                fontFamily: "'Jost', sans-serif", fontSize: 9,
                letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--mink)",
              }}>
                256-bit SSL Encrypted · Secure Checkout
              </span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ── Sub-components ──

function ErrorMsg({ message }: { message: string }) {
  return (
    <motion.p
      initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
      style={{
        fontFamily: "'Jost', sans-serif", fontSize: 11,
        color: "#B85C5C", letterSpacing: "0.04em",
        padding: "10px 14px",
        background: "rgba(184,92,92,0.06)",
        border: "1px solid rgba(184,92,92,0.18)",
        margin: 0,
      }}
    >
      {message}
    </motion.p>
  );
}

function EyeToggle({ show, onToggle }: { show: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      style={{
        position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)",
        background: "none", border: "none", cursor: "pointer", color: "var(--mink)", padding: 4,
      }}
    >
      {show ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
          <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      )}
    </button>
  );
}

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "8+ characters", ok: password.length >= 8 },
    { label: "Uppercase letter", ok: /[A-Z]/.test(password) },
    { label: "Number", ok: /\d/.test(password) },
  ];
  return (
    <div style={{ display: "flex", gap: 8 }}>
      {checks.map(c => (
        <div key={c.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{
            width: 5, height: 5, borderRadius: "50%",
            background: c.ok ? "var(--gold)" : "var(--stone)",
            transition: "background 0.3s",
          }} />
          <span style={{
            fontFamily: "'Jost', sans-serif", fontSize: 9,
            letterSpacing: "0.1em",
            color: c.ok ? "var(--charcoal)" : "var(--stone)",
            transition: "color 0.3s",
          }}>
            {c.label}
          </span>
        </div>
      ))}
    </div>
  );
}