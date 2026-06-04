"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform, useSpring, Variants } from "framer-motion";
import model from "@/public/herooo.jpg";

/* ── Framer variants ── */
const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.4 } },
};

const riseUp: Variants = {
  hidden: { y: 50, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

const fadeOnly: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 1, ease: "easeOut" } },
};

const slideRight: Variants = {
  hidden: { x: -40, opacity: 0 },
  show: { x: 0, opacity: 1, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
};

/* ── Spring config ── */
const SPRING = { stiffness: 50, damping: 22 };

export default function Hero() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const imgX = useSpring(useTransform(mouseX, [0, 1], [-12, 12]), SPRING);
  const imgY = useSpring(useTransform(mouseY, [0, 1], [-6, 6]), SPRING);
  const bgX  = useSpring(useTransform(mouseX, [0, 1], [10, -10]), SPRING);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth);
      mouseY.set(e.clientY / window.innerHeight);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mouseX, mouseY]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,200;0,300;0,400;0,500;1,200;1,300;1,400&family=Jost:wght@300;400;500&display=swap');

        :root {
          --cream:    #FAF8F5;
          --warm:     #F2EDE6;
          --stone:    #D9D0C4;
          --mink:     #9E9189;
          --charcoal: #2C2925;
          --ink:      #1A1714;
          --gold:     #B89A6A;
          --gold-lt:  #D4B896;
        }

        .hero-root {
          position: relative; min-height: 100vh;
          background: var(--cream);
          overflow: hidden; display: flex; align-items: center;
          padding-top: 144px;
        }

        /* Grain texture */
        .hero-root::before {
          content: '';
          position: absolute; inset: 0; z-index: 0; pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          opacity: 0.6;
        }

        .hero-grid-line {
          position: absolute; pointer-events: none;
          background: rgba(180,165,145,0.12);
        }

        .hero-eyebrow {
          font-family: 'Jost', sans-serif;
          font-size: 10px; font-weight: 400;
          letter-spacing: 0.34em; text-transform: uppercase;
          color: var(--gold); display: flex; align-items: center; gap: 12px;
        }
        .hero-eyebrow-line {
          width: 40px; height: 1px; background: var(--gold);
        }

        .hero-title {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300; line-height: 0.92;
          color: var(--charcoal); margin: 0;
        }
        .hero-title-lg {
          font-size: clamp(60px, 7vw, 112px);
        }
        .hero-title-italic {
          font-style: italic; font-weight: 200;
          font-size: clamp(64px, 7.5vw, 118px);
          color: var(--mink); letter-spacing: -0.01em;
        }

        .hero-sub {
          font-family: 'Jost', sans-serif;
          font-size: clamp(13px, 1.2vw, 15px); font-weight: 300;
          color: var(--mink); line-height: 1.8;
          letter-spacing: 0.03em; max-width: 360px;
        }

        .hero-cta-primary {
          display: inline-flex; align-items: center; gap: 14px;
          padding: 15px 40px;
          background: var(--charcoal); color: var(--cream);
          font-family: 'Jost', sans-serif;
          font-size: 11px; font-weight: 400;
          letter-spacing: 0.22em; text-transform: uppercase;
          text-decoration: none; border: none; cursor: pointer;
          transition: background 0.3s, letter-spacing 0.3s;
        }
        .hero-cta-primary:hover {
          background: var(--ink); letter-spacing: 0.28em;
        }
        .hero-cta-primary svg { transition: transform 0.3s; }
        .hero-cta-primary:hover svg { transform: translateX(4px); }

        .hero-cta-outline {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 14px 36px;
          background: transparent; color: var(--charcoal);
          font-family: 'Jost', sans-serif;
          font-size: 11px; font-weight: 400;
          letter-spacing: 0.22em; text-transform: uppercase;
          text-decoration: none;
          border: 1px solid rgba(180,165,145,0.5);
          cursor: pointer;
          transition: border-color 0.3s, color 0.3s;
        }
        .hero-cta-outline:hover {
          border-color: var(--charcoal); color: var(--charcoal);
        }

        /* Model image panel */
        .hero-model-panel {
          position: absolute; right: 0; top: 0; bottom: 0;
          width: 46%;
        }
        .hero-model-inner {
          position: relative; width: 100%; height: 100%; overflow: hidden;
        }

        /* Floating badge */
        .hero-badge {
          position: absolute; bottom: 14%; left: -40px; z-index: 20;
          background: rgba(250,248,245,0.94);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(180,165,145,0.25);
          padding: 18px 24px; min-width: 160px;
          box-shadow: 0 12px 40px rgba(44,41,37,0.08);
        }
        .hero-badge-num {
          font-family: 'Cormorant Garamond', serif;
          font-size: 36px; font-weight: 300;
          color: var(--charcoal); line-height: 1;
        }
        .hero-badge-label {
          font-family: 'Jost', sans-serif;
          font-size: 9px; font-weight: 400;
          letter-spacing: 0.22em; text-transform: uppercase;
          color: var(--mink); margin-top: 4px;
        }

        /* Vertical text */
        .hero-vert-text {
          font-family: 'Jost', sans-serif;
          font-size: 9px; font-weight: 400;
          letter-spacing: 0.3em; text-transform: uppercase;
          color: var(--stone); writing-mode: vertical-rl;
          transform: rotate(180deg);
        }

        /* Scroll indicator */
        .hero-scroll {
          display: flex; flex-direction: column; align-items: center;
          gap: 8px;
        }
        .hero-scroll-label {
          font-family: 'Jost', sans-serif;
          font-size: 9px; font-weight: 400;
          letter-spacing: 0.3em; text-transform: uppercase;
          color: var(--stone);
        }
        .hero-scroll-line {
          width: 1px; height: 52px;
          background: linear-gradient(to bottom, var(--stone), transparent);
        }

        @keyframes hero-scroll-pulse {
          0%, 100% { opacity: 0.4; transform: scaleY(1); }
          50% { opacity: 0.9; transform: scaleY(0.6); }
        }
        .hero-scroll-line {
          animation: hero-scroll-pulse 2s ease-in-out infinite;
          transform-origin: top;
        }

        /* ── Mobile overlay elements (hidden on desktop) ── */
        .hero-mobile-top,
        .hero-mobile-bottom {
          display: none;
        }

        @media (max-width: 1024px) {
          .hero-model-panel { width: 52%; }
          .hero-badge { display: none; }
        }

        /* ─────────────────────────────────────────────────
           MOBILE: Full-bleed image with elegant overlay
        ───────────────────────────────────────────────── */
        @media (max-width: 768px) {

          /* Use relative stacking — no fixed elements, prevents z-index bleed onto other sections */
          .hero-root {
            padding-top: 0;
            min-height: 100svh;
            background: var(--ink);
            overflow: hidden;
            position: relative;
          }

          .hero-root::before { display: none; }

          /* Model panel: absolute within hero only */
          .hero-model-panel {
            position: absolute !important;
            width: 100% !important;
            height: 100% !important;
            top: 0; left: 0; right: 0; bottom: 0;
            z-index: 0;
          }

          .hero-model-fade-left  { display: none !important; }
          .hero-model-fade-bottom {
            background: linear-gradient(
              to top,
              rgba(20,17,14,0.92) 0%,
              rgba(20,17,14,0.48) 40%,
              rgba(20,17,14,0.12) 60%,
              transparent 78%
            ) !important;
          }

          .hero-grid-line,
          .hero-desktop-content,
          .hero-scroll-vert { display: none !important; }

          .hero-mobile-top {
            display: block;
            position: absolute;
            top: 0; left: 0; right: 0;
            z-index: 10;
            padding: 56px 26px 0;
            background: linear-gradient(
              to bottom,
              rgba(20,17,14,0.50) 0%,
              rgba(20,17,14,0.10) 55%,
              transparent 100%
            );
          }

          .hero-mobile-bottom {
            display: block;
            position: absolute;
            bottom: 0; left: 0; right: 0;
            z-index: 10;
            padding: 0 24px 40px;
          }

          /* Push title down further from top nav */
          .hero-mobile-title-wrap {
            margin-top: 56px;
          }

          .hero-mobile-top .hero-title-lg {
            font-size: clamp(50px, 13vw, 68px);
            color: #FAF8F5;
          }
          .hero-mobile-top .hero-title-italic {
            font-size: clamp(54px, 14vw, 74px);
            color: rgba(250,248,245,0.72);
          }
        }
      `}</style>

      <section className="hero-root">

        {/* ── Subtle grid lines (desktop only) ── */}
        <div className="hero-grid-line" style={{ left: "8%", top: 0, bottom: 0, width: 1 }} />
        <div className="hero-grid-line" style={{ left: "54%", top: 0, bottom: 0, width: 1 }} />
        <div className="hero-grid-line" style={{ top: "30%", left: 0, right: 0, height: 1 }} />

        {/* ── Warm circle blob (desktop) ── */}
        <motion.div
          style={{
            position: "absolute", right: "32%", top: "10%",
            width: "50vw", height: "50vw", maxWidth: 640, maxHeight: 640,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(242,237,230,0.9) 0%, rgba(250,248,245,0) 70%)",
            pointerEvents: "none", zIndex: 0,
            x: bgX,
          }}
        />

        {/* ── Desktop main layout ── */}
        <div
          className="hero-desktop-content"
          style={{
            maxWidth: 1400, margin: "0 auto", padding: "0 48px",
            width: "100%", position: "relative", zIndex: 1,
            display: "flex", alignItems: "center",
            minHeight: "calc(100vh - 144px)",
          }}
        >
          {/* Left content */}
          <motion.div
            style={{ maxWidth: 560, paddingBottom: 60 }}
            variants={stagger}
            initial="hidden"
            animate="show"
          >


            {/* Headline */}
            <div style={{ overflow: "hidden", marginBottom: 4 }}>
              <motion.h1 className="hero-title hero-title-lg" variants={riseUp}>
                Office Looks
              </motion.h1>
            </div>
            <div style={{ overflow: "hidden", marginBottom: 4 }}>
              <motion.h1 className="hero-title hero-title-italic" variants={riseUp}>
                that Empower You
              </motion.h1>
            </div>

            {/* Thin rule */}
            <motion.div
              variants={slideRight}
              style={{
                width: 80, height: 1,
                background: "linear-gradient(to right, var(--gold), transparent)",
                margin: "28px 0",
              }}
            />

            {/* Sub copy */}
            <motion.p className="hero-sub" variants={riseUp} style={{ marginBottom: 40 }}>
              Sophisticated styles designed to make you feel confident and graceful — every single day.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={riseUp}
              style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}
            >
              <motion.a
                href="#shop"
                className="hero-cta-primary"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Shop Now
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </motion.a>
              <motion.a
                href="#new-arrivals"
                className="hero-cta-outline"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Explore Collection
              </motion.a>
            </motion.div>

            {/* Trust row */}
            <motion.div
              variants={fadeOnly}
              style={{
                display: "flex", gap: 28, marginTop: 52,
                paddingTop: 32,
                borderTop: "1px solid rgba(180,165,145,0.25)",
              }}
            >
              {[
                { num: "500+", label: "New Arrivals" },
                { num: "14-Day", label: "Easy Returns" },
                { num: "4.9★", label: "Customer Rating" },
              ].map(({ num, label }) => (
                <div key={label}>
                  <div style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 22, fontWeight: 400,
                    color: "var(--charcoal)",
                  }}>
                    {num}
                  </div>
                  <div style={{
                    fontFamily: "'Jost', sans-serif",
                    fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase",
                    color: "var(--mink)", marginTop: 2,
                  }}>
                    {label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* ── Scroll indicator (desktop only) ── */}
        <motion.div
          className="hero-scroll-vert"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.8 }}
          style={{
            position: "absolute", left: 12, bottom: "15%",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 14,
            zIndex: 1,
          }}
        >
          <span className="hero-vert-text">Chanely · 2025</span>
          <div className="hero-scroll-line" />
        </motion.div>

        {/* ── Model image panel (shared desktop + mobile background) ── */}
        <motion.div
          className="hero-model-panel"
          style={{ x: imgX, y: imgY }}
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        >
          <div className="hero-model-inner">
            <Image
              src={model}
              alt="Chanely — Wear Your Grace"
              fill
              className="object-cover object-top"
              style={{ filter: "contrast(1.04) brightness(0.94) saturate(0.92)" }}
              priority
            />
            {/* Left fade — hidden on mobile via .hero-model-fade-left */}
            <div
              className="hero-model-fade-left"
              style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(to right, var(--cream) 0%, rgba(250,248,245,0) 25%)",
              }}
            />
            {/* Bottom fade — overridden on mobile via .hero-model-fade-bottom */}
            <div
              className="hero-model-fade-bottom"
              style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(to top, var(--cream) 0%, transparent 25%)",
              }}
            />
          </div>

          {/* Floating stat card (desktop only, already display:none on mobile) */}
          <motion.div
            className="hero-badge"
            initial={{ opacity: 0, y: 24, x: -20 }}
            animate={{ opacity: 1, y: 0, x: -40 }}
            transition={{ delay: 1.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="hero-badge-num">128</div>
            <div className="hero-badge-label">New pieces this week</div>
            <div style={{ width: 24, height: 1, background: "var(--gold)", marginTop: 10 }} />
          </motion.div>

        
        </motion.div>

        {/* ══════════════════════════════════════
            MOBILE OVERLAY — top: eyebrow + title
        ══════════════════════════════════════ */}
        <div className="hero-mobile-top">

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            style={{ marginTop: 200 }}
          >
            <h1 className="hero-title hero-title-lg">Office Looks</h1>
            <h1 className="hero-title hero-title-italic">that Empower You</h1>
          </motion.div>
        </div>

        {/* ══════════════════════════════════════
            MOBILE OVERLAY — bottom: copy + CTA + stats
        ══════════════════════════════════════ */}
        <div className="hero-mobile-bottom">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.7 }}
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: 13, fontWeight: 300,
              color: "rgba(250,248,245,0.65)",
              lineHeight: 1.75, letterSpacing: "0.03em",
              marginBottom: 20,
            }}
          >
            Sophisticated styles designed to make you feel confident and graceful — every single day.
          </motion.p>

          <motion.a
            href="#shop"
            className="hero-cta-primary"
            style={{
              width: "100%", justifyContent: "center",
              background: "rgba(250,248,245,0.95)",
              color: "var(--ink)",
              letterSpacing: "0.26em",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.7 }}
            whileTap={{ scale: 0.98 }}
          >
            Shop Now
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </motion.a>

          {/* Trust stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.35, duration: 0.8 }}
            style={{
              display: "flex", gap: 0, marginTop: 20,
              paddingTop: 18,
              borderTop: "1px solid rgba(250,248,245,0.12)",
            }}
          >
            {[
              { num: "500+", label: "New Arrivals" },
              { num: "14-Day", label: "Easy Returns" },
              { num: "4.9★", label: "Rating" },
            ].map(({ num, label }, i) => (
              <div
                key={label}
                style={{
                  flex: 1,
                  paddingLeft: i === 0 ? 0 : 16,
                  borderLeft: i === 0 ? "none" : "1px solid rgba(250,248,245,0.12)",
                }}
              >
                <div style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 20, fontWeight: 400, color: "#FAF8F5",
                }}>
                  {num}
                </div>
                <div style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: 8, letterSpacing: "0.2em", textTransform: "uppercase",
                  color: "rgba(250,248,245,0.45)", marginTop: 3,
                }}>
                  {label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

      </section>
    </>
  );
}