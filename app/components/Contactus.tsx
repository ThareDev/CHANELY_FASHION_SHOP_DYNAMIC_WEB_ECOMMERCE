"use client";

import { useEffect, useRef, useState } from "react";

const BUDGETS = ["< $10k", "$10–30k", "$30–80k", "$80k+"];
const SERVICES = ["Web Dev", "Mobile App", "AI Integration", "Admin Panel", "Software Dev", "Other"];

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

export default function Contact() {
  const { ref: headRef, visible: headVisible } = useInView();
  const { ref: formRef, visible: formVisible } = useInView(0.1);

  const [fields, setFields] = useState({ name: "", email: "", message: "" });
  const [budget, setBudget] = useState("");
  const [services, setServices] = useState<string[]>([]);
  const [sent, setSent] = useState(false);

  const toggleService = (s: string) =>
    setServices(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  const handleSubmit = () => {
    if (!fields.name || !fields.email) return;
    setSent(true);
  };

  return (
    <section id="contact" className="relative bg-[#020810] text-[#E0EFFF] font-sans py-20 sm:py-28 px-4 sm:px-8 lg:px-16 overflow-hidden">
      {/* Blobs */}
      <div className="absolute top-0 right-0 w-[50vw] h-[50vw] max-w-[400px] max-h-[400px] rounded-full bg-[#00E5CC]/[0.04] blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[45vw] h-[45vw] max-w-[360px] max-h-[360px] rounded-full bg-[#7B61FF]/[0.05] blur-[100px] pointer-events-none" />

      {/* Grid texture */}
      <div className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: "linear-gradient(rgba(0,229,204,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,204,1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative max-w-4xl mx-auto">
        {/* Header */}
        <div
          ref={headRef}
          className="text-center mb-14 sm:mb-16 transition-all duration-700"
          style={{ opacity: headVisible ? 1 : 0, transform: headVisible ? "none" : "translateY(24px)" }}
        >
          <div className="inline-flex items-center gap-2 border border-[#00E5CC]/20 bg-[#00E5CC]/5 rounded-full px-4 py-1.5 font-mono text-[10px] sm:text-xs tracking-widest text-[#00E5CC] uppercase mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00E5CC] shadow-[0_0_6px_#00E5CC] animate-[blink_2s_infinite]" />
            Get In Touch
          </div>
          <h2 className="font-bold leading-tight text-[clamp(2rem,6vw,3.5rem)] mb-4">
            <span className="text-[#E0EFFF]">Let&apos;s Build </span>
            <span className="bg-gradient-to-r from-[#00E5CC] via-[#7B61FF] to-[#00C2FF] bg-clip-text text-transparent">Something</span>
          </h2>
          <p className="max-w-[440px] mx-auto text-[#4A6080] font-light text-[clamp(0.875rem,2vw,1rem)]">
            Tell us about your project. We&apos;ll respond within 24 hours.
          </p>
        </div>

        {/* Form card */}
        <div
          ref={formRef}
          className="rounded-2xl border border-[#00E5CC]/08 bg-white/[0.02] p-6 sm:p-10 relative overflow-hidden transition-all duration-700"
          style={{ opacity: formVisible ? 1 : 0, transform: formVisible ? "none" : "translateY(28px)" }}
        >
          {/* Top accent */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#00E5CC] via-[#7B61FF] to-transparent opacity-60" />

          {!sent ? (
            <div className="flex flex-col gap-6">
              {/* Name + Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { key: "name",  label: "Full Name",     placeholder: "Alex Johnson" },
                  { key: "email", label: "Email Address", placeholder: "alex@company.com" },
                ].map(f => (
                  <div key={f.key} className="flex flex-col gap-2">
                    <label className="font-mono text-[10px] tracking-widest text-[#3A5070] uppercase">{f.label}</label>
                    <input
                      type={f.key === "email" ? "email" : "text"}
                      placeholder={f.placeholder}
                      value={fields[f.key as "name" | "email"]}
                      onChange={e => setFields(p => ({ ...p, [f.key]: e.target.value }))}
                      className="bg-white/[0.03] border border-white/[0.07] rounded-xl px-4 py-3 text-[#C0D8F0] text-sm placeholder-[#1E3050] outline-none focus:border-[#00E5CC]/40 focus:bg-[#00E5CC]/[0.02] transition-all duration-200 font-light"
                    />
                  </div>
                ))}
              </div>

              {/* Services */}
              <div className="flex flex-col gap-3">
                <label className="font-mono text-[10px] tracking-widest text-[#3A5070] uppercase">Services Needed</label>
                <div className="flex flex-wrap gap-2">
                  {SERVICES.map(s => (
                    <button
                      key={s}
                      onClick={() => toggleService(s)}
                      className="font-mono text-xs px-3 py-2 rounded-xl border transition-all duration-200 cursor-pointer"
                      style={{
                        background: services.includes(s) ? "rgba(0,229,204,0.1)" : "rgba(255,255,255,0.02)",
                        borderColor: services.includes(s) ? "#00E5CC50" : "rgba(255,255,255,0.06)",
                        color: services.includes(s) ? "#00E5CC" : "#2A4060",
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Budget */}
              <div className="flex flex-col gap-3">
                <label className="font-mono text-[10px] tracking-widest text-[#3A5070] uppercase">Budget Range</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {BUDGETS.map(b => (
                    <button
                      key={b}
                      onClick={() => setBudget(b)}
                      className="font-mono text-xs px-3 py-2.5 rounded-xl border transition-all duration-200 cursor-pointer text-center"
                      style={{
                        background: budget === b ? "rgba(123,97,255,0.12)" : "rgba(255,255,255,0.02)",
                        borderColor: budget === b ? "#7B61FF50" : "rgba(255,255,255,0.06)",
                        color: budget === b ? "#7B61FF" : "#2A4060",
                      }}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div className="flex flex-col gap-2">
                <label className="font-mono text-[10px] tracking-widest text-[#3A5070] uppercase">Tell Us More</label>
                <textarea
                  rows={4}
                  placeholder="Describe your project, timeline, and any specific requirements…"
                  value={fields.message}
                  onChange={e => setFields(p => ({ ...p, message: e.target.value }))}
                  className="bg-white/[0.03] border border-white/[0.07] rounded-xl px-4 py-3 text-[#C0D8F0] text-sm placeholder-[#1E3050] outline-none focus:border-[#00E5CC]/40 focus:bg-[#00E5CC]/[0.02] transition-all duration-200 font-light resize-none"
                />
              </div>

              {/* Submit */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
                <p className="text-[#1E3050] font-mono text-[10px] tracking-wide">
                  🔒 Your details are kept confidential.
                </p>
                <button
                  onClick={handleSubmit}
                  className="bg-gradient-to-br from-[#00E5CC] to-[#7B61FF] text-white font-medium rounded-full text-sm px-8 py-3 hover:-translate-y-0.5 hover:shadow-[0_0_40px_rgba(0,229,204,0.25)] transition-all duration-200 cursor-pointer whitespace-nowrap w-full sm:w-auto text-center"
                >
                  Send Message →
                </button>
              </div>
            </div>
          ) : (
            /* Success state */
            <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
              <div className="w-16 h-16 rounded-full grid place-items-center border border-[#00E5CC]/30 bg-[#00E5CC]/10 text-2xl text-[#00E5CC] shadow-[0_0_30px_rgba(0,229,204,0.2)]">
                ✓
              </div>
              <h3 className="font-bold text-[#D0E8FF] text-xl">Message Received!</h3>
              <p className="text-[#3A5070] text-sm max-w-[300px]">
                We&apos;ll review your project and get back to you within 24 hours.
              </p>
              <button
                onClick={() => { setSent(false); setFields({ name: "", email: "", message: "" }); setBudget(""); setServices([]); }}
                className="font-mono text-xs text-[#00E5CC] border border-[#00E5CC]/25 px-5 py-2 rounded-full hover:bg-[#00E5CC] hover:text-[#030A10] transition-all duration-200 mt-2"
              >
                Send Another
              </button>
            </div>
          )}
        </div>

        {/* Info strip */}
        <div
          className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 transition-all duration-700"
          style={{ opacity: formVisible ? 1 : 0, transitionDelay: "350ms" }}
        >
          {[
            { icon: "◎", label: "Response Time", value: "< 24 hours" },
            { icon: "◈", label: "First Call",    value: "Free of charge" },
            { icon: "⬡", label: "NDA",           value: "Signed on request" },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-3 rounded-xl border border-white/[0.05] bg-white/[0.015] px-4 py-3">
              <span className="text-[#00E5CC] text-lg">{item.icon}</span>
              <div>
                <div className="font-mono text-[10px] text-[#2A4060] tracking-widest uppercase">{item.label}</div>
                <div className="text-[#7A9ABE] text-sm">{item.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="relative mt-20 sm:mt-28 border-t border-[#00E5CC]/[0.08] pt-8 text-center">
        <div className="flex items-center justify-center gap-2 font-mono text-sm tracking-wider mb-3">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#00E5CC] to-[#7B61FF] grid place-items-center text-[10px] font-bold text-[#030A10]">Z</div>
          <span className="text-[#2A4060]">Zer<span className="text-[#00E5CC]">0x</span>Labs</span>
        </div>
        <p className="text-[#1A2D40] font-mono text-[10px] tracking-widest">
          © {new Date().getFullYear()} Zer0xLabs. All rights reserved.
        </p>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;700&family=Share+Tech+Mono&display=swap');
        .font-mono { font-family: 'Share Tech Mono', monospace; }
        .font-sans { font-family: 'Space Grotesk', sans-serif; }
        @keyframes blink { 0%,100%{opacity:1;} 50%{opacity:.3;} }
      `}</style>
    </section>
  );
}