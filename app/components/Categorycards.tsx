"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import tops from "@/public/im1.jpg";
import trousers from "@/public/im2.jpg";
import dresses from "@/public/im3.jpg";

const CATEGORIES = [
  {
    id: "tops",
    label: "Tops & Blouses",
    tagline: "Refined Essentials",
    img: tops,
    href: "#tops",
    span: false,
  },
  {
    id: "trousers",
    label: "Trousers",
    tagline: "Tailored Silhouettes",
    img: trousers,
    href: "#trousers",
    span: false,
  },
  {
    id: "dresses",
    label: "Dresses & Skirts",
    tagline: "Effortless Elegance",
    img: dresses,
    href: "#dresses",
    span: false,
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay: i * 0.12,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export default function CategoryCards() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=Jost:wght@300;400;500&display=swap');

        :root {
          --cream:    #FAF8F5;
          --warm:     #F2EDE6;
          --stone:    #D9D0C4;
          --mink:     #9E9189;
          --charcoal: #2C2925;
          --gold:     #B89A6A;
        }

        .cat-section {
          background: var(--warm);
          padding: 80px 48px 100px;
        }

        .cat-header {
          display: flex; align-items: flex-end; justify-content: space-between;
          margin-bottom: 52px;
        }
        .cat-eyebrow {
          font-family: 'Jost', sans-serif;
          font-size: 10px; font-weight: 400;
          letter-spacing: 0.32em; text-transform: uppercase;
          color: var(--gold); display: flex; align-items: center; gap: 12px;
          margin-bottom: 14px;
        }
        .cat-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(32px, 4vw, 52px); font-weight: 300;
          color: var(--charcoal); line-height: 1.1; margin: 0;
        }
        .cat-title em {
          font-style: italic; color: var(--mink);
        }
        .cat-view-all {
          font-family: 'Jost', sans-serif;
          font-size: 11px; font-weight: 400;
          letter-spacing: 0.22em; text-transform: uppercase;
          color: var(--charcoal); text-decoration: none;
          display: flex; align-items: center; gap: 10px;
          border-bottom: 1px solid rgba(180,165,145,0.4);
          padding-bottom: 2px;
          transition: gap 0.3s, border-color 0.3s;
          white-space: nowrap;
        }
        .cat-view-all:hover { gap: 16px; border-color: var(--charcoal); }

        .cat-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .cat-card {
          position: relative; overflow: hidden;
          aspect-ratio: 3/4;
          cursor: pointer;
          background: var(--stone);
        }

        .cat-card-img {
          position: absolute; inset: 0;
          transition: transform 0.7s cubic-bezier(0.22, 1, 0.36, 1),
                      filter 0.5s ease;
        }
        .cat-card:hover .cat-card-img {
          transform: scale(1.06);
          filter: brightness(0.82) saturate(0.9) !important;
        }

        .cat-card-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(44,41,37,0.55) 0%, rgba(44,41,37,0.1) 45%, transparent 70%);
          transition: background 0.4s;
        }
        .cat-card:hover .cat-card-overlay {
          background: linear-gradient(to top, rgba(44,41,37,0.68) 0%, rgba(44,41,37,0.2) 55%, transparent 75%);
        }

        .cat-card-body {
          position: absolute; bottom: 0; left: 0; right: 0;
          padding: 28px 28px 32px;
          display: flex; flex-direction: column; gap: 6px;
        }
        .cat-card-tag {
          font-family: 'Jost', sans-serif;
          font-size: 9px; font-weight: 400;
          letter-spacing: 0.26em; text-transform: uppercase;
          color: var(--gold-lt, #D4B896);
          transform: translateY(4px); opacity: 0;
          transition: transform 0.4s ease, opacity 0.4s ease;
        }
        .cat-card:hover .cat-card-tag {
          transform: translateY(0); opacity: 1;
        }
        .cat-card-label {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(22px, 2.2vw, 30px); font-weight: 300;
          color: #fff; letter-spacing: 0.01em; line-height: 1.1;
        }
        .cat-card-cta {
          display: flex; align-items: center; gap: 10px;
          font-family: 'Jost', sans-serif;
          font-size: 10px; font-weight: 400;
          letter-spacing: 0.22em; text-transform: uppercase;
          color: rgba(250,248,245,0.7);
          transform: translateY(6px); opacity: 0;
          transition: transform 0.4s 0.05s ease, opacity 0.4s 0.05s ease;
        }
        .cat-card:hover .cat-card-cta {
          transform: translateY(0); opacity: 1;
        }
        .cat-card-cta svg { transition: transform 0.3s; }
        .cat-card:hover .cat-card-cta svg { transform: translateX(4px); }

        /* Top-right corner bracket */
        .cat-card-bracket {
          position: absolute; top: 16px; right: 16px;
          width: 24px; height: 24px;
          border-top: 1px solid rgba(250,248,245,0.35);
          border-right: 1px solid rgba(250,248,245,0.35);
          opacity: 0;
          transition: opacity 0.3s, width 0.3s, height 0.3s;
        }
        .cat-card:hover .cat-card-bracket {
          opacity: 1; width: 32px; height: 32px;
        }

        /* Bottom-left bracket */
        .cat-card-bracket-bl {
          position: absolute; bottom: 0; left: 0;
          width: 0; height: 0;
          border-bottom: 1px solid rgba(184,154,106,0.5);
          border-left: 1px solid rgba(184,154,106,0.5);
          transition: width 0.5s ease, height 0.5s ease;
        }
        .cat-card:hover .cat-card-bracket-bl {
          width: 40px; height: 40px;
        }

        @media (max-width: 900px) {
          .cat-grid { grid-template-columns: 1fr 1fr; }
          .cat-grid > *:last-child { grid-column: span 2; aspect-ratio: 16/9; }
          .cat-section { padding: 60px 24px 80px; }
        }
        @media (max-width: 600px) {
          .cat-grid { grid-template-columns: 1fr; }
          .cat-grid > *:last-child { grid-column: span 1; aspect-ratio: 3/4; }
          .cat-header { flex-direction: column; gap: 20px; align-items: flex-start; }
        }
      `}</style>

      <section className="cat-section">
        {/* ── Section header ── */}
        <motion.div
          ref={ref}
          className="cat-header"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div>
            <div className="cat-eyebrow">
              <span style={{ width: 32, height: 1, background: "var(--gold)", display: "inline-block" }} />
              Shop by Category
            </div>
            <h2 className="cat-title">
              Curated <em>Collections</em>
            </h2>
          </div>
          <a href="#shop" className="cat-view-all">
            View All
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </motion.div>

        {/* ── Cards grid ── */}
        <div className="cat-grid">
          {CATEGORIES.map((cat, i) => (
            <motion.a
              key={cat.id}
              href={cat.href}
              className="cat-card"
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate={inView ? "show" : "hidden"}
              whileHover="hover"
              style={{ display: "block", textDecoration: "none" }}
            >
              {/* Image */}
              <div className="cat-card-img">
                <Image
                  src={cat.img}
                  alt={cat.label}
                  fill
                  className="object-cover object-top"
                  style={{ filter: "contrast(1.04) brightness(0.88) saturate(0.85)" }}
                />
              </div>

              {/* Overlay */}
              <div className="cat-card-overlay" />

              {/* Decorative brackets */}
              <div className="cat-card-bracket" />
              <div className="cat-card-bracket-bl" />

              {/* Card body */}
              <div className="cat-card-body">
                <span className="cat-card-tag">{cat.tagline}</span>
                <span className="cat-card-label">{cat.label}</span>
                <span className="cat-card-cta">
                  Shop Now
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </motion.a>
          ))}
        </div>
      </section>
    </>
  );
}