"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/app/store/slices/authSlice";

interface SignUpProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignIn: () => void;
}

const FIELD_STYLE = `
  width: 100%; padding: 14px 0; border: none; border-bottom: 1px solid var(--stone);
  background: transparent; outline: none;
  font-family: 'Jost', sans-serif; font-size: 13px;
  letter-spacing: 0.06em; color: var(--charcoal);
  transition: border-color 0.25s;
`;

export default function SignUp({ isOpen, onClose, onSwitchToSignIn }: SignUpProps) {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    whatsapp: "+94",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "whatsapp") {
      // Ensure prefix stays
      if (!value.startsWith("+94")) return;
    }
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong.");
        return;
      }

      dispatch(
        setCredentials({
          user: data.user,
          token: data.token,
          tokenExpiration: data.tokenExpiration,
        })
      );
      setSuccess(true);
      setTimeout(() => { onClose(); setSuccess(false); }, 1400);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
            .ch-field { ${FIELD_STYLE} }
            .ch-field:focus { border-color: var(--gold); }
            .ch-field::placeholder { color: var(--stone); }
            .ch-label {
              display: block; font-family: 'Jost', sans-serif;
              font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase;
              color: var(--mink); margin-bottom: 2px;
            }
            .ch-submit-btn {
              width: 100%; padding: 15px;
              background: var(--charcoal); color: var(--cream);
              border: none; cursor: pointer;
              font-family: 'Jost', sans-serif; font-size: 11px;
              letter-spacing: 0.22em; text-transform: uppercase;
              transition: background 0.25s, transform 0.15s;
            }
            .ch-submit-btn:hover:not(:disabled) { background: var(--gold); }
            .ch-submit-btn:active { transform: scale(0.99); }
            .ch-submit-btn:disabled { opacity: 0.55; cursor: not-allowed; }
          `}</style>

          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            style={{
              position: "fixed", inset: 0, zIndex: 200,
              background: "rgba(26,23,20,0.55)",
              backdropFilter: "blur(4px)",
            }}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 340, damping: 36 }}
            style={{
              position: "fixed", top: 0, right: 0, bottom: 0,
              width: "min(440px, 100vw)", zIndex: 201,
              background: "var(--cream)",
              display: "flex", flexDirection: "column",
              boxShadow: "-24px 0 64px rgba(44,41,37,0.14)",
            }}
          >
            {/* Top bar */}
            <div style={{
              padding: "32px 40px 0",
              borderBottom: "1px solid var(--warm)",
              paddingBottom: 28,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <p style={{
                    fontFamily: "'Jost', sans-serif", fontSize: 9,
                    letterSpacing: "0.28em", textTransform: "uppercase",
                    color: "var(--gold)", marginBottom: 8,
                  }}>
                    Chanely · New Member
                  </p>
                  <h2 style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 34, fontWeight: 300,
                    color: "var(--ink)", lineHeight: 1.1, margin: 0,
                  }}>
                    Create Your<br /><em>Account</em>
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    color: "var(--mink)", padding: 4, marginTop: 4,
                    transition: "color 0.2s",
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
            </div>

            {/* Form */}
            <div style={{ flex: 1, overflowY: "auto", padding: "32px 40px" }}>
              <AnimatePresence mode="wait">
                {success ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ textAlign: "center", paddingTop: 60 }}
                  >
                    <div style={{
                      width: 56, height: 56, borderRadius: "50%",
                      border: "1.5px solid var(--gold)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      margin: "0 auto 24px",
                    }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <p style={{
                      fontFamily: "'Cormorant Garamond', serif", fontSize: 26,
                      fontWeight: 300, color: "var(--charcoal)",
                    }}>
                      Welcome to Chanely
                    </p>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ display: "flex", flexDirection: "column", gap: 28 }}
                  >
                    {/* Full Name */}
                    <div>
                      <label className="ch-label">Full Name</label>
                      <input
                        className="ch-field"
                        type="text"
                        name="fullName"
                        placeholder="Your full name"
                        value={form.fullName}
                        onChange={handleChange}
                        required
                        autoComplete="name"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="ch-label">Email Address</label>
                      <input
                        className="ch-field"
                        type="email"
                        name="email"
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={handleChange}
                        required
                        autoComplete="email"
                      />
                    </div>

                    {/* WhatsApp */}
                    <div>
                      <label className="ch-label">WhatsApp Number</label>
                      <input
                        className="ch-field"
                        type="tel"
                        name="whatsapp"
                        placeholder="+94XXXXXXXXX"
                        value={form.whatsapp}
                        onChange={handleChange}
                        required
                        autoComplete="tel"
                      />
                      <p style={{
                        fontFamily: "'Jost', sans-serif", fontSize: 10,
                        color: "var(--mink)", marginTop: 6, letterSpacing: "0.04em",
                      }}>
                        Sri Lanka format: +94 7XX XXX XXX
                      </p>
                    </div>

                    {/* Password */}
                    <div>
                      <label className="ch-label">Password</label>
                      <div style={{ position: "relative" }}>
                        <input
                          className="ch-field"
                          type={showPassword ? "text" : "password"}
                          name="password"
                          placeholder="Min. 8 characters"
                          value={form.password}
                          onChange={handleChange}
                          required
                          autoComplete="new-password"
                          style={{ paddingRight: 36 }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((v) => !v)}
                          style={{
                            position: "absolute", right: 0, top: "50%",
                            transform: "translateY(-50%)",
                            background: "none", border: "none", cursor: "pointer",
                            color: "var(--mink)", padding: 4,
                          }}
                        >
                          {showPassword ? (
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
                      </div>
                    </div>

                    {/* Error */}
                    <AnimatePresence>
                      {error && (
                        <motion.p
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          style={{
                            fontFamily: "'Jost', sans-serif", fontSize: 11,
                            color: "#B85C5C", letterSpacing: "0.04em",
                            padding: "10px 14px",
                            background: "rgba(184,92,92,0.06)",
                            border: "1px solid rgba(184,92,92,0.18)",
                          }}
                        >
                          {error}
                        </motion.p>
                      )}
                    </AnimatePresence>

                    {/* Terms */}
                    <p style={{
                      fontFamily: "'Jost', sans-serif", fontSize: 10,
                      color: "var(--mink)", lineHeight: 1.7, letterSpacing: "0.04em",
                    }}>
                      By creating an account you agree to Chanely's{" "}
                      <a href="#" style={{ color: "var(--charcoal)", textDecoration: "underline" }}>
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="#" style={{ color: "var(--charcoal)", textDecoration: "underline" }}>
                        Privacy Policy
                      </a>.
                    </p>

                    <button className="ch-submit-btn" type="submit" disabled={loading}>
                      {loading ? "Creating Account…" : "Create Account"}
                    </button>

                    {/* Divider */}
                    <div style={{
                      display: "flex", alignItems: "center", gap: 16,
                    }}>
                      <div style={{ flex: 1, height: 1, background: "var(--warm)" }} />
                      <span style={{
                        fontFamily: "'Jost', sans-serif", fontSize: 9,
                        letterSpacing: "0.18em", color: "var(--stone)",
                        textTransform: "uppercase",
                      }}>or</span>
                      <div style={{ flex: 1, height: 1, background: "var(--warm)" }} />
                    </div>

                    <button
                      type="button"
                      onClick={onSwitchToSignIn}
                      style={{
                        background: "none", border: "1px solid var(--stone)",
                        padding: "14px", cursor: "pointer",
                        fontFamily: "'Jost', sans-serif", fontSize: 11,
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
                      Already have an account? Sign In
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>

            {/* Footer flourish */}
            <div style={{
              padding: "20px 40px",
              borderTop: "1px solid var(--warm)",
              display: "flex", alignItems: "center", gap: 12,
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--stone)" strokeWidth="1.5">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
              <span style={{
                fontFamily: "'Jost', sans-serif", fontSize: 9,
                letterSpacing: "0.18em", textTransform: "uppercase",
                color: "var(--mink)",
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