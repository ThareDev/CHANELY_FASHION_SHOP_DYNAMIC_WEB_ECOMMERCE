"use client";

import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import logo from "@/public/logoopic.png"

/* ── Social icons as inline SVG components ── */
const IconInstagram = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
  </svg>
);

const IconFacebook = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
  </svg>
);

const IconTiktok = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z"/>
  </svg>
);

const IconWhatsApp = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/>
  </svg>
);

const IconPinterest = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.236 2.636 7.855 6.356 9.312-.088-.791-.167-2.005.035-2.868.181-.78 1.172-4.97 1.172-4.97s-.299-.598-.299-1.482c0-1.388.806-2.428 1.808-2.428.853 0 1.267.64 1.267 1.408 0 .858-.546 2.14-.828 3.33-.236.995.499 1.806 1.476 1.806 1.772 0 3.137-1.868 3.137-4.561 0-2.386-1.715-4.054-4.163-4.054-2.836 0-4.498 2.126-4.498 4.325 0 .856.33 1.775.741 2.276a.3.3 0 01.069.285c-.076.312-.244.995-.277 1.134-.044.183-.145.222-.334.134-1.249-.581-2.03-2.407-2.03-3.874 0-3.154 2.292-6.052 6.608-6.052 3.469 0 6.165 2.473 6.165 5.776 0 3.447-2.173 6.22-5.19 6.22-1.013 0-1.966-.527-2.292-1.148l-.623 2.378c-.226.869-.835 1.958-1.244 2.621.937.29 1.931.446 2.962.446 5.523 0 10-4.477 10-10S17.523 2 12 2z"/>
  </svg>
);

const VALUES = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    title: "Crafted with Intention",
    body: "Every piece is designed to last — in quality, in style, and in the way it makes you feel.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 8v4l3 3"/>
      </svg>
    ),
    title: "Timeless, Not Trendy",
    body: "We curate silhouettes that transcend seasons — pieces you reach for year after year.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
      </svg>
    ),
    title: "Worn with Grace",
    body: "Chanely is for the woman who dresses for herself — with confidence, ease, and quiet elegance.",
  },
];

const CONTACT_ITEMS = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/>
      </svg>
    ),
    label: "WhatsApp",
    value: "+94 77 123 4567",
    href: "https://wa.me/94771234567",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
    label: "Email",
    value: "hello@chanely.lk",
    href: "mailto:hello@chanely.lk",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    ),
    label: "Location",
    value: "Colombo, Sri Lanka",
    href: "https://maps.google.com/?q=Colombo,Sri+Lanka",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    label: "Hours",
    value: "Mon – Sat, 9am – 6pm",
    href: null,
  },
];

const SOCIAL = [
  { icon: <IconInstagram />, label: "Instagram", href: "https://instagram.com/chanely" },
  { icon: <IconFacebook />,  label: "Facebook",  href: "https://facebook.com/chanely" },
  { icon: <IconTiktok />,    label: "TikTok",    href: "https://tiktok.com/@chanely" },
  { icon: <IconWhatsApp />,  label: "WhatsApp",  href: "https://wa.me/94771234567" },
  { icon: <IconPinterest />, label: "Pinterest", href: "https://pinterest.com/chanely" },
];

const FOOTER_LINKS = [
  { label: "New Arrivals",   href: "#new-arrivals" },
  { label: "Collections",   href: "#shop" },
  { label: "Best Sellers",  href: "#best-sellers" },
  { label: "About Us",      href: "#about" },
  { label: "Contact",       href: "#contact" },
  { label: "Size Guide",    href: "#" },
  { label: "Returns",       href: "#" },
  { label: "Privacy Policy",href: "#" },
];

/* ── Reusable fade-in hook ── */
function useFade() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return { ref, inView };
}

export default function AboutContactFooter() {
  const aboutFade   = useFade();
  const valuesFade  = useFade();
  const contactFade = useFade();

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

        /* ════════════════════════════
           ABOUT SECTION
        ════════════════════════════ */
        .ab-section {
          background: var(--cream);
          padding: 100px 0 0;
          overflow: hidden;
          position: relative;
        }

        .ab-inner {
          max-width: 1300px;
          margin: 0 auto;
          padding: 0 48px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
        }

        /* Left — logo + tagline block */
        .ab-logo-col {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0;
          position: relative;
        }

        .ab-logo-card {
          background: #fff;
          border: 1px solid var(--stone);
          padding: 48px 52px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          position: relative;
          width: 100%;
        }

        .ab-logo-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, var(--gold), var(--gold-lt), transparent);
        }

        .ab-logo-tagline {
          font-family: 'Jost', sans-serif;
          font-size: 9px;
          letter-spacing: 0.36em;
          text-transform: uppercase;
          color: var(--mink);
          text-align: center;
        }

        .ab-founded {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-top: 24px;
          align-self: flex-start;
        }

        .ab-founded-line {
          width: 32px;
          height: 1px;
          background: var(--gold);
        }

        .ab-founded-text {
          font-family: 'Jost', sans-serif;
          font-size: 9px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: var(--gold);
        }

        /* Right — copy */
        .ab-copy-col {
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        .ab-eyebrow {
          font-family: 'Jost', sans-serif;
          font-size: 10px;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: var(--gold);
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .ab-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(36px, 4.5vw, 58px);
          font-weight: 300;
          color: var(--charcoal);
          line-height: 1.05;
          margin: 0;
        }

        .ab-title em {
          font-style: italic;
          font-weight: 200;
          color: var(--mink);
        }

        .ab-body {
          font-family: 'Jost', sans-serif;
          font-size: 14px;
          font-weight: 300;
          color: var(--mink);
          line-height: 1.9;
          letter-spacing: 0.03em;
          max-width: 440px;
        }

        .ab-rule {
          width: 60px;
          height: 1px;
          background: linear-gradient(to right, var(--gold), transparent);
        }

        /* Values strip */
        .ab-values {
          margin-top: 80px;
          background: var(--charcoal);
          padding: 64px 48px;
        }

        .ab-values-inner {
          max-width: 1300px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 48px;
        }

        .ab-value-item {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding-top: 24px;
          border-top: 1px solid rgba(180,165,145,0.2);
        }

        .ab-value-icon {
          color: var(--gold);
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ab-value-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px;
          font-weight: 300;
          color: var(--cream);
          letter-spacing: 0.02em;
        }

        .ab-value-body {
          font-family: 'Jost', sans-serif;
          font-size: 12px;
          font-weight: 300;
          color: rgba(250,248,245,0.55);
          line-height: 1.8;
          letter-spacing: 0.04em;
        }

        /* ════════════════════════════
           CONTACT SECTION
        ════════════════════════════ */
        .ct-section {
          background: var(--warm);
          padding: 100px 48px;
          position: relative;
          overflow: hidden;
          id: contact;
        }

        .ct-section::before {
          content: '';
          position: absolute;
          right: -120px;
          top: -120px;
          width: 480px;
          height: 480px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(184,154,106,0.08) 0%, transparent 70%);
          pointer-events: none;
        }

        .ct-inner {
          max-width: 1300px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: start;
        }

        .ct-left {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .ct-eyebrow {
          font-family: 'Jost', sans-serif;
          font-size: 10px;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: var(--gold);
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .ct-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(36px, 4.5vw, 58px);
          font-weight: 300;
          color: var(--charcoal);
          line-height: 1.05;
          margin: 0;
        }

        .ct-title em {
          font-style: italic;
          font-weight: 200;
          color: var(--mink);
        }

        .ct-sub {
          font-family: 'Jost', sans-serif;
          font-size: 13px;
          font-weight: 300;
          color: var(--mink);
          line-height: 1.9;
          max-width: 380px;
        }

        /* Decorative pull-quote */
        .ct-quote {
          border-left: 2px solid var(--gold);
          padding: 8px 0 8px 24px;
          margin-top: 8px;
        }

        .ct-quote-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px;
          font-weight: 300;
          font-style: italic;
          color: var(--charcoal);
          line-height: 1.4;
        }

        .ct-quote-attr {
          font-family: 'Jost', sans-serif;
          font-size: 9px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--gold);
          margin-top: 10px;
        }

        /* Right — contact cards */
        .ct-right {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .ct-card {
          background: #fff;
          border: 1px solid rgba(217,208,196,0.6);
          padding: 22px 24px;
          display: flex;
          align-items: center;
          gap: 20px;
          text-decoration: none;
          transition: border-color 0.25s, box-shadow 0.25s, transform 0.25s;
          cursor: pointer;
        }

        .ct-card:hover {
          border-color: var(--gold);
          box-shadow: 0 8px 32px rgba(44,41,37,0.06);
          transform: translateX(4px);
        }

        .ct-card-icon {
          width: 44px;
          height: 44px;
          background: var(--warm);
          border: 1px solid var(--stone);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--gold);
          flex-shrink: 0;
        }

        .ct-card-label {
          font-family: 'Jost', sans-serif;
          font-size: 9px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--mink);
          margin-bottom: 4px;
        }

        .ct-card-value {
          font-family: 'Cormorant Garamond', serif;
          font-size: 18px;
          font-weight: 300;
          color: var(--charcoal);
        }

        .ct-card-arrow {
          margin-left: auto;
          color: var(--stone);
          flex-shrink: 0;
          transition: color 0.2s, transform 0.2s;
        }

        .ct-card:hover .ct-card-arrow {
          color: var(--gold);
          transform: translateX(4px);
        }

        /* Social row */
        .ct-social-row {
          margin-top: 8px;
          padding-top: 24px;
          border-top: 1px solid var(--stone);
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .ct-social-label {
          font-family: 'Jost', sans-serif;
          font-size: 9px;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: var(--mink);
          margin-right: 4px;
        }

        .ct-social-icon {
          width: 40px;
          height: 40px;
          border: 1px solid var(--stone);
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--charcoal);
          text-decoration: none;
          transition: background 0.2s, border-color 0.2s, color 0.2s, transform 0.2s;
        }

        .ct-social-icon:hover {
          background: var(--charcoal);
          border-color: var(--charcoal);
          color: var(--cream);
          transform: translateY(-2px);
        }

        /* ════════════════════════════
           FOOTER
        ════════════════════════════ */
        .ft-footer {
          background: var(--ink);
          position: relative;
          overflow: hidden;
        }

        .ft-footer::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--gold), var(--gold-lt), transparent);
        }

        .ft-top {
          padding: 64px 48px 48px;
          max-width: 1300px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1.4fr 1fr 1fr;
          gap: 60px;
        }

        /* Brand col */
        .ft-brand {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .ft-brand-desc {
          font-family: 'Jost', sans-serif;
          font-size: 12px;
          font-weight: 300;
          color: rgba(250,248,245,0.45);
          line-height: 1.9;
          max-width: 280px;
        }

        .ft-social {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .ft-social-btn {
          width: 38px;
          height: 38px;
          border: 1px solid rgba(180,165,145,0.2);
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(250,248,245,0.45);
          text-decoration: none;
          transition: border-color 0.2s, color 0.2s, background 0.2s, transform 0.2s;
        }

        .ft-social-btn:hover {
          border-color: var(--gold);
          color: var(--gold);
          background: rgba(184,154,106,0.08);
          transform: translateY(-2px);
        }

        /* Link cols */
        .ft-col-title {
          font-family: 'Jost', sans-serif;
          font-size: 9px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 20px;
        }

        .ft-links {
          display: flex;
          flex-direction: column;
          gap: 12px;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .ft-links a {
          font-family: 'Jost', sans-serif;
          font-size: 12px;
          font-weight: 300;
          color: rgba(250,248,245,0.45);
          text-decoration: none;
          letter-spacing: 0.08em;
          transition: color 0.2s;
        }

        .ft-links a:hover {
          color: rgba(250,248,245,0.85);
        }

        /* Bottom bar */
        .ft-bottom {
          border-top: 1px solid rgba(180,165,145,0.1);
          padding: 20px 48px;
          max-width: 1300px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }

        .ft-copy {
          font-family: 'Jost', sans-serif;
          font-size: 10px;
          letter-spacing: 0.14em;
          color: rgba(250,248,245,0.25);
        }

        .ft-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: 'Jost', sans-serif;
          font-size: 9px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(250,248,245,0.25);
        }

        /* ════════════════════════════
           RESPONSIVE
        ════════════════════════════ */
        @media (max-width: 1024px) {
          .ab-inner    { grid-template-columns: 1fr; gap: 48px; }
          .ab-logo-col { max-width: 400px; }
          .ab-values-inner { grid-template-columns: 1fr 1fr; gap: 32px; }
          .ct-inner    { grid-template-columns: 1fr; gap: 48px; }
          .ft-top      { grid-template-columns: 1fr 1fr; gap: 40px; }
          .ft-brand    { grid-column: span 2; }
        }

        @media (max-width: 768px) {
          .ab-section  { padding: 72px 0 0; }
          .ab-inner    { padding: 0 24px; gap: 40px; }
          .ab-values   { padding: 48px 24px; }
          .ab-values-inner { grid-template-columns: 1fr; gap: 24px; }
          .ct-section  { padding: 72px 24px; }
          .ft-top      { grid-template-columns: 1fr; padding: 48px 24px 32px; }
          .ft-brand    { grid-column: span 1; }
          .ft-bottom   { padding: 20px 24px; flex-direction: column; align-items: flex-start; gap: 8px; }
        }

        @media (max-width: 480px) {
          .ab-logo-card { padding: 32px 28px; }
          .ct-card      { padding: 18px 16px; gap: 14px; }
          .ct-card-value { font-size: 15px; }
        }
      `}</style>

      {/* ════════════════════════════
          ABOUT SECTION
      ════════════════════════════ */}
      <section className="ab-section" id="about">
        <div className="ab-inner">

          {/* Left — logo card */}
          <motion.div
            ref={aboutFade.ref}
            className="ab-logo-col"
            initial={{ opacity: 0, x: -40 }}
            animate={aboutFade.inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="ab-logo-card">
              {/* Replace /logo.png with your actual logo path */}
              <Image
                src={logo}
                alt="Chanely"
                width={200}
                height={72}
                style={{ width: "auto", height: 72, objectFit: "contain" }}
                priority
              />
              <div className="ab-logo-tagline">Wear Your Grace</div>
              <div style={{ width: "100%", height: 1, background: "linear-gradient(to right, transparent, var(--stone), transparent)" }} />
              <div style={{
                display: "flex", justifyContent: "space-around", width: "100%", paddingTop: 4,
              }}>
                {[["500+", "Styles"], ["14-Day", "Returns"], ["4.9★", "Rating"]].map(([n, l]) => (
                  <div key={l} style={{ textAlign: "center" }}>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 300, color: "var(--charcoal)" }}>{n}</div>
                    <div style={{ fontFamily: "'Jost', sans-serif", fontSize: 8, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--mink)", marginTop: 2 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="ab-founded">
              <div className="ab-founded-line" />
              <span className="ab-founded-text">Founded in Sri Lanka · 2021</span>
            </div>
          </motion.div>

          {/* Right — copy */}
          <motion.div
            className="ab-copy-col"
            initial={{ opacity: 0, x: 40 }}
            animate={aboutFade.inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="ab-eyebrow">
              <span style={{ width: 32, height: 1, background: "var(--gold)", display: "inline-block" }} />
              Our Story
            </div>

            <h2 className="ab-title">
              Dressed for the<br />
              <em>woman you are.</em>
            </h2>

            <div className="ab-rule" />

            <p className="ab-body">
              Chanely began with a simple belief — that every woman deserves clothing that feels as considered as she is. Born in Colombo, built with care, we design pieces that move with your life: the boardroom, the weekend, the quiet moment between.
            </p>

            <p className="ab-body" style={{ marginTop: -8 }}>
              Each collection is thoughtfully curated, favoring quality over quantity, and silhouettes that outlast trends. We are not fast fashion. We are the dress you return to, the blouse you reach for first.
            </p>
          </motion.div>
        </div>

        {/* Values strip */}
        <div className="ab-values">
          <div
            ref={valuesFade.ref}
            className="ab-values-inner"
          >
            {VALUES.map((v, i) => (
              <motion.div
                key={v.title}
                className="ab-value-item"
                initial={{ opacity: 0, y: 24 }}
                animate={valuesFade.inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="ab-value-icon">{v.icon}</div>
                <div className="ab-value-title">{v.title}</div>
                <div className="ab-value-body">{v.body}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════
          CONTACT SECTION
      ════════════════════════════ */}
      <section className="ct-section" id="contact">
        <div className="ct-inner">

          {/* Left */}
          <motion.div
            ref={contactFade.ref}
            className="ct-left"
            initial={{ opacity: 0, y: 32 }}
            animate={contactFade.inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="ct-eyebrow">
              <span style={{ width: 32, height: 1, background: "var(--gold)", display: "inline-block" }} />
              Get in Touch
            </div>

            <h2 className="ct-title">
              We&apos;d love to<br />
              <em>hear from you.</em>
            </h2>

            <p className="ct-sub">
              Questions about sizing, an order, or simply want to say hello — we&apos;re here. Reach us through any of the channels below and expect a warm, personal reply.
            </p>

            <div className="ct-quote">
              <div className="ct-quote-text">
                &ldquo;Style is a way to say who you are without having to speak.&rdquo;
              </div>
              <div className="ct-quote-attr">— Rachel Zoe</div>
            </div>

            {/* Decorative element */}
            <div style={{
              display: "flex", gap: 6, paddingTop: 8,
            }}>
              {[40, 24, 16, 8].map((w, i) => (
                <div key={i} style={{
                  height: 1,
                  width: w,
                  background: i === 0 ? "var(--gold)" : "var(--stone)",
                }} />
              ))}
            </div>
          </motion.div>

          {/* Right — contact cards */}
          <motion.div
            className="ct-right"
            initial={{ opacity: 0, y: 32 }}
            animate={contactFade.inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            {CONTACT_ITEMS.map((item, i) => {
              const Tag = item.href ? "a" : "div";
              return (
                <Tag
                  key={item.label}
                  className="ct-card"
                  {...(item.href ? { href: item.href, target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  <div className="ct-card-icon">{item.icon}</div>
                  <div>
                    <div className="ct-card-label">{item.label}</div>
                    <div className="ct-card-value">{item.value}</div>
                  </div>
                  {item.href && (
                    <div className="ct-card-arrow">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </div>
                  )}
                </Tag>
              );
            })}

            <div className="ct-social-row">
              <span className="ct-social-label">Follow us</span>
              {SOCIAL.map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                  className="ct-social-icon" aria-label={s.label}>
                  {s.icon}
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════
          FOOTER
      ════════════════════════════ */}
      <footer className="ft-footer">
        <div className="ft-top">

          {/* Brand col */}
          <div className="ft-brand">
            <Image
              src={logo}
              alt="Chanely"
              width={140}
              height={48}
              style={{
                width: "auto", height: 48, objectFit: "contain",
                filter: "brightness(0) invert(1)",
                opacity: 0.85,
              }}
            />
            <p className="ft-brand-desc">
              Chanely is a curated women&apos;s fashion label from Sri Lanka, designed for the modern woman who values grace, quality, and intention in every piece she wears.
            </p>
            <div className="ft-social">
              {SOCIAL.map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                  className="ft-social-btn" aria-label={s.label}>
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Shop links */}
          <div>
            <div className="ft-col-title">Shop</div>
            <ul className="ft-links">
              {FOOTER_LINKS.slice(0, 4).map(l => (
                <li key={l.label}><a href={l.href}>{l.label}</a></li>
              ))}
            </ul>
          </div>

          {/* Info links */}
          <div>
            <div className="ft-col-title">Information</div>
            <ul className="ft-links">
              {FOOTER_LINKS.slice(4).map(l => (
                <li key={l.label}><a href={l.href}>{l.label}</a></li>
              ))}
            </ul>
            {/* Contact mini */}
            <div style={{ marginTop: 28 }}>
              <div className="ft-col-title">Contact</div>
              <ul className="ft-links">
                <li><a href="mailto:hello@chanely.lk">hello@chanely.lk</a></li>
                <li><a href="https://wa.me/94771234567">+94 77 123 4567</a></li>
                <li><a href="#">Colombo, Sri Lanka</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="ft-bottom">
          <span className="ft-copy">© {new Date().getFullYear()} Chanely. All rights reserved.</span>
          <div className="ft-badge">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0110 0v4"/>
            </svg>
            256-bit SSL · Secure Checkout
          </div>
        </div>
      </footer>
    </>
  );
}