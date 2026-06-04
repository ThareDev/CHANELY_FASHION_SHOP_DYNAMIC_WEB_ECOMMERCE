"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectIsAuthenticated, selectCurrentUser } from "@/app/store/slices/authSlice";
import SignIn from "@/app/components/popups/Signin";
import SignUp from "@/app/components/popups/Signup";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  {
    label: "Shop",
    href: "#",
    sub: ["All Collections", "Tops & Blouses", "Trousers", "Dresses & Skirts", "Accessories"],
  },
  { label: "New Arrivals", href: "#new-arrivals" },
  { label: "Best Sellers", href: "#best-sellers" },
  { label: "About Us", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const ANNOUNCEMENT = [
  "Free Shipping on Orders Above $99",
  "New Arrivals — Spring Collection Now Live",
  "Easy 14-Day Returns · No Questions Asked",
];

const CATEGORIES = [
  "New In", "Tops & Blouses", "Trousers", "Dresses",
  "Skirts", "Knitwear", "Outerwear", "Accessories", "Bags", "Shoes", "Sale",
];

export default function Header() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [announcementIdx, setAnnouncementIdx] = useState(0);
  const [cartCount] = useState(0);
  const [signInOpen, setSignInOpen] = useState(false);
  const [signUpOpen, setSignUpOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const t = setInterval(
      () => setAnnouncementIdx((i) => (i + 1) % ANNOUNCEMENT.length),
      3500
    );
    return () => clearInterval(t);
  }, []);

  // Close mobile menu on resize
  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 1024) setMenuOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const openSignIn = () => { setSignUpOpen(false); setSignInOpen(true); };
  const openSignUp = () => { setSignInOpen(false); setSignUpOpen(true); };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Jost:wght@300;400;500;600&display=swap');

        :root {
          --cream: #FAF8F5; --warm: #F2EDE6; --stone: #D9D0C4;
          --mink: #9E9189; --charcoal: #2C2925; --ink: #1A1714;
          --gold: #B89A6A; --gold-lt: #D4B896;
        }

        *, *::before, *::after { box-sizing: border-box; }

        .ch-header {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          transition: background 0.4s ease, box-shadow 0.4s ease;
        }
        .ch-header.scrolled {
          background: rgba(250,248,245,0.96);
          backdrop-filter: blur(12px);
          box-shadow: 0 1px 0 rgba(180,165,145,0.25);
        }

        /* ── Announcement ── */
        .ch-announce {
          background: var(--charcoal);
          height: 36px; display: flex; align-items: center;
          justify-content: space-between; padding: 0 40px; overflow: hidden;
        }
        .ch-announce-msg {
          flex: 1; display: flex; justify-content: center;
          overflow: hidden; height: 36px; align-items: center; position: relative;
        }
        .ch-announce span {
          font-family: 'Jost', sans-serif; font-size: 11px; font-weight: 400;
          letter-spacing: 0.16em; text-transform: uppercase;
          color: rgba(250,248,245,0.75);
        }
        .ch-announce-links {
          display: flex; gap: 20px; min-width: 140px;
        }
        .ch-announce-links.right { justify-content: flex-end; }
        .ch-announce-links a {
          font-family: 'Jost', sans-serif; font-size: 10px;
          letter-spacing: 0.14em; text-transform: uppercase;
          color: rgba(250,248,245,0.45); text-decoration: none;
          transition: color 0.2s; cursor: pointer; background: none; border: none;
        }
        .ch-announce-links a:hover { color: rgba(250,248,245,0.8); }

        /* ── Main bar ── */
        .ch-main {
          display: flex; align-items: center;
          padding: 0 40px; height: 72px; gap: 40px;
          background: transparent;
        }

        /* ── Logo ── */
        .ch-logo-wrap {
          display: flex; flex-direction: column; align-items: center;
          text-decoration: none; flex-shrink: 0;
        }
        .ch-logo-mark {
          font-family: 'Cormorant Garamond', serif;
          font-size: 28px; font-weight: 300;
          color: var(--charcoal); letter-spacing: 0.08em; line-height: 1;
        }
        .ch-logo-mark span { font-weight: 600; }
        .ch-logo-sub {
          font-family: 'Jost', sans-serif; font-size: 8px; font-weight: 400;
          letter-spacing: 0.32em; text-transform: uppercase;
          color: var(--mink); margin-top: 3px;
        }

        /* ── Desktop Nav ── */
        .ch-nav {
          display: flex; gap: 0; list-style: none;
          margin: 0; padding: 0; flex: 1; justify-content: center;
        }
        .ch-nav li { position: relative; }
        .ch-nav-link {
          display: flex; align-items: center; gap: 4px;
          padding: 0 18px; height: 72px;
          font-family: 'Jost', sans-serif; font-size: 12px; font-weight: 400;
          letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--charcoal); text-decoration: none; transition: color 0.2s;
          position: relative;
        }
        .ch-nav-link::after {
          content: ''; position: absolute; bottom: 0; left: 18px; right: 18px;
          height: 1px; background: var(--gold);
          transform: scaleX(0); transform-origin: left; transition: transform 0.3s ease;
        }
        .ch-nav-link:hover { color: var(--gold); }
        .ch-nav-link:hover::after { transform: scaleX(1); }

        .ch-chevron {
          width: 8px; height: 8px; position: relative; flex-shrink: 0;
        }
        .ch-chevron::before, .ch-chevron::after {
          content: ''; position: absolute;
          width: 4px; height: 1px; background: currentColor; top: 4px;
          transition: transform 0.2s;
        }
        .ch-chevron::before { left: 0; transform: rotate(40deg); }
        .ch-chevron::after  { right: 0; transform: rotate(-40deg); }
        .ch-chevron.open::before { transform: rotate(-40deg); }
        .ch-chevron.open::after  { transform: rotate(40deg); }

        .ch-dropdown {
          position: absolute; top: 100%; left: 50%;
          transform: translateX(-50%); min-width: 180px;
          background: rgba(250,248,245,0.98);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(180,165,145,0.2);
          box-shadow: 0 16px 48px rgba(44,41,37,0.08);
          padding: 8px 0;
        }
        .ch-dropdown a {
          display: block; padding: 10px 24px;
          font-family: 'Jost', sans-serif; font-size: 11px;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: var(--charcoal); text-decoration: none;
          transition: background 0.15s, color 0.15s;
        }
        .ch-dropdown a:hover { background: var(--warm); color: var(--gold); }

        /* ── Icons ── */
        .ch-icons {
          display: flex; align-items: center; gap: 20px; flex-shrink: 0;
        }
        .ch-icon-btn {
          background: none; border: none; cursor: pointer;
          color: var(--charcoal); padding: 4px;
          transition: color 0.2s; position: relative;
        }
        .ch-icon-btn:hover { color: var(--gold); }
        .ch-cart-badge {
          position: absolute; top: -2px; right: -4px;
          width: 14px; height: 14px; border-radius: 50%;
          background: var(--charcoal); color: var(--cream);
          font-family: 'Jost', sans-serif; font-size: 8px;
          display: flex; align-items: center; justify-content: center;
        }

        /* ── Auth buttons (desktop) ── */
        .ch-auth-btns {
          display: flex; align-items: center; gap: 10px;
        }
        .ch-btn-ghost {
          background: none; border: 1px solid var(--stone);
          padding: 7px 16px; cursor: pointer;
          font-family: 'Jost', sans-serif; font-size: 10px;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--charcoal); transition: border-color 0.2s, color 0.2s;
        }
        .ch-btn-ghost:hover { border-color: var(--gold); color: var(--gold); }
        .ch-btn-solid {
          background: var(--charcoal); border: 1px solid var(--charcoal);
          padding: 7px 16px; cursor: pointer;
          font-family: 'Jost', sans-serif; font-size: 10px;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--cream); transition: background 0.2s, border-color 0.2s;
        }
        .ch-btn-solid:hover { background: var(--gold); border-color: var(--gold); }

        /* ── User menu ── */
        .ch-user-menu-wrap { position: relative; }
        .ch-user-btn {
          display: flex; align-items: center; gap: 8px;
          background: none; border: none; cursor: pointer; padding: 4px 8px;
          font-family: 'Jost', sans-serif; font-size: 11px;
          letter-spacing: 0.1em; color: var(--charcoal);
          transition: color 0.2s;
        }
        .ch-user-btn:hover { color: var(--gold); }
        .ch-user-avatar {
          width: 30px; height: 30px; border-radius: 50%;
          background: var(--warm); border: 1px solid var(--stone);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Cormorant Garamond', serif; font-size: 14px;
          color: var(--charcoal); flex-shrink: 0;
        }
        .ch-user-dropdown {
          position: absolute; top: calc(100% + 12px); right: 0;
          min-width: 180px;
          background: rgba(250,248,245,0.98);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(180,165,145,0.2);
          box-shadow: 0 16px 48px rgba(44,41,37,0.08);
          padding: 8px 0;
        }
        .ch-user-dropdown a, .ch-user-dropdown button {
          display: block; width: 100%; text-align: left;
          padding: 10px 20px; background: none; border: none; cursor: pointer;
          font-family: 'Jost', sans-serif; font-size: 11px;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: var(--charcoal); text-decoration: none;
          transition: background 0.15s, color 0.15s;
        }
        .ch-user-dropdown a:hover, .ch-user-dropdown button:hover {
          background: var(--warm); color: var(--gold);
        }
        .ch-user-dropdown hr {
          border: none; border-top: 1px solid var(--warm); margin: 4px 0;
        }

        /* ── Sub bar ── */
        .ch-sub-bar {
          background: var(--warm);
          border-top: 1px solid rgba(180,165,145,0.2);
          border-bottom: 1px solid rgba(180,165,145,0.2);
          height: 36px; display: flex; align-items: center;
          padding: 0 40px; gap: 32px; overflow-x: auto;
        }
        .ch-sub-bar::-webkit-scrollbar { display: none; }
        .ch-sub-link {
          font-family: 'Jost', sans-serif; font-size: 10px;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--mink); text-decoration: none;
          white-space: nowrap; flex-shrink: 0; transition: color 0.2s;
        }
        .ch-sub-link:hover { color: var(--charcoal); }
        .ch-sub-dot {
          width: 2px; height: 2px; border-radius: 50%;
          background: var(--stone); flex-shrink: 0;
        }

        /* ── Mobile menu ── */
        .ch-mobile-menu {
          position: fixed; inset: 0; z-index: 99;
          background: var(--cream);
          display: flex; flex-direction: column;
          padding-top: 108px;
          overflow-y: auto;
        }
        .ch-mobile-nav {
          list-style: none; margin: 0; padding: 0 24px;
          display: flex; flex-direction: column; gap: 0;
        }
        .ch-mobile-nav-link {
          display: flex; align-items: center; justify-content: space-between;
          padding: 16px 0; border-bottom: 1px solid var(--warm);
          font-family: 'Jost', sans-serif; font-size: 13px;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--charcoal); text-decoration: none; cursor: pointer;
          background: none; border-left: none; border-right: none; border-top: none;
          width: 100%; text-align: left; transition: color 0.2s;
        }
        .ch-mobile-nav-link:hover { color: var(--gold); }
        .ch-mobile-sub {
          overflow: hidden; background: var(--warm);
          margin: 0 -24px; padding: 0 40px;
        }
        .ch-mobile-sub a {
          display: block; padding: 12px 0;
          border-bottom: 1px solid rgba(180,165,145,0.2);
          font-family: 'Jost', sans-serif; font-size: 11px;
          letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--mink); text-decoration: none; transition: color 0.2s;
        }
        .ch-mobile-sub a:hover { color: var(--charcoal); }
        .ch-mobile-auth {
          padding: 28px 24px; display: flex; flex-direction: column; gap: 12px;
          border-top: 1px solid var(--warm); margin-top: 8px;
        }
        .ch-mobile-auth-full {
          width: 100%; padding: 14px;
          font-family: 'Jost', sans-serif; font-size: 11px;
          letter-spacing: 0.18em; text-transform: uppercase;
          cursor: pointer; transition: all 0.2s;
        }

        /* ── Hamburger ── */
        .ch-hamburger {
          display: none; flex-direction: column; justify-content: center;
          gap: 5px; background: none; border: none;
          cursor: pointer; padding: 4px; width: 32px; height: 32px;
        }
        .ch-hamburger span {
          display: block; width: 22px; height: 1.5px;
          background: var(--charcoal); transition: all 0.3s ease;
          transform-origin: center;
        }
        .ch-hamburger.open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
        .ch-hamburger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
        .ch-hamburger.open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

        /* ── Responsive ── */
        @media (max-width: 1024px) {
          .ch-nav { display: none; }
          .ch-sub-bar { display: none; }
          .ch-auth-btns { display: none; }
          .ch-user-menu-wrap { display: none; }
          .ch-hamburger { display: flex; }
          .ch-main { gap: 16px; }
        }
        @media (max-width: 768px) {
          .ch-main { padding: 0 20px; height: 64px; }
          .ch-announce { padding: 0 20px; }
          .ch-announce-links { display: none; }
          .ch-announce-msg span { font-size: 10px; letter-spacing: 0.1em; }
          .ch-logo-mark { font-size: 24px; }
          .ch-logo-sub { display: none; }
          .ch-icons { gap: 12px; }
        }
        @media (max-width: 480px) {
          .ch-announce { height: 30px; }
          .ch-announce-msg span { font-size: 9px; }
          .ch-main { padding: 0 16px; height: 60px; }
        }
      `}</style>

      <header className={`ch-header${scrolled ? " scrolled" : ""}`}>

        {/* ── Announcement bar ── */}
        <div className="ch-announce">
          <div className="ch-announce-links">
            <a href="#">Track Order</a>
            <a href="#">Help</a>
          </div>
          <div className="ch-announce-msg">
            <AnimatePresence mode="wait">
              <motion.span
                key={announcementIdx}
                initial={{ y: 12, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -12, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                style={{ position: "absolute" }}
              >
                {ANNOUNCEMENT[announcementIdx]}
              </motion.span>
            </AnimatePresence>
          </div>
          <div className="ch-announce-links right">
            {isAuthenticated ? (
              <a onClick={() => dispatch(logout())}>Sign Out</a>
            ) : (
              <>
                <a onClick={openSignIn}>Sign In</a>
                <a onClick={openSignUp}>Join</a>
              </>
            )}
          </div>
        </div>

        {/* ── Main nav bar ── */}
        <div className="ch-main">

          {/* Logo */}
          <Link href="/" className="ch-logo-wrap">
            <div className="ch-logo-mark"><span>C</span>H</div>
            <div className="ch-logo-sub">Chanely · Wear Your Grace</div>
          </Link>

          {/* Desktop nav */}
          <nav>
            <ul className="ch-nav">
              {NAV_LINKS.map((link) => (
                <li
                  key={link.label}
                  onMouseEnter={() => link.sub && setActiveDropdown(link.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link href={link.href} className="ch-nav-link">
                    {link.label}
                    {link.sub && (
                      <span className={`ch-chevron${activeDropdown === link.label ? " open" : ""}`} />
                    )}
                  </Link>
                  {link.sub && (
                    <AnimatePresence>
                      {activeDropdown === link.label && (
                        <motion.div
                          className="ch-dropdown"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          transition={{ duration: 0.22, ease: "easeOut" }}
                        >
                          {link.sub.map((s) => (
                            <Link key={s} href="#">{s}</Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Right side: icons + auth */}
          <div className="ch-icons">
            {/* Search — always visible */}
            <button className="ch-icon-btn" aria-label="Search">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" />
              </svg>
            </button>

            {/* Wishlist — always visible */}
            <button className="ch-icon-btn" aria-label="Wishlist">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>

            {/* Cart — authenticated only */}
            {isAuthenticated && (
              <button className="ch-icon-btn" aria-label="Cart" style={{ position: "relative" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 01-8 0" />
                </svg>
                <span className="ch-cart-badge">{cartCount}</span>
              </button>
            )}

            {/* Desktop auth buttons / user menu */}
            {!isAuthenticated ? (
              <div className="ch-auth-btns">
                <button className="ch-btn-ghost" onClick={openSignIn}>Sign In</button>
                <button className="ch-btn-solid" onClick={openSignUp}>Join</button>
              </div>
            ) : (
              <div className="ch-user-menu-wrap">
                <button
                  className="ch-user-btn"
                  onClick={() => setUserMenuOpen((v) => !v)}
                  onBlur={() => setTimeout(() => setUserMenuOpen(false), 150)}
                >
                  <div className="ch-user-avatar">
                    {user?.fullName?.charAt(0).toUpperCase()}
                  </div>
                  <span style={{ maxWidth: 80, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {user?.fullName?.split(" ")[0]}
                  </span>
                  <span className={`ch-chevron${userMenuOpen ? " open" : ""}`} />
                </button>
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      className="ch-user-dropdown"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Link href="/account">My Account</Link>
                      <Link href="/orders">My Orders</Link>
                      <Link href="/wishlist">Wishlist</Link>
                      <hr />
                      <button onClick={() => dispatch(logout())}>Sign Out</button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Hamburger — mobile only */}
            <button
              className={`ch-hamburger${menuOpen ? " open" : ""}`}
              aria-label="Menu"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>

        {/* ── Sub-header category bar ── */}
        <div className="ch-sub-bar">
          {CATEGORIES.map((cat, i, arr) => (
            <span key={cat} style={{ display: "contents" }}>
              <Link href="#" className="ch-sub-link">{cat}</Link>
              {i < arr.length - 1 && <span className="ch-sub-dot" />}
            </span>
          ))}
        </div>
      </header>

      {/* ── Mobile menu overlay ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="ch-mobile-menu"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <ul className="ch-mobile-nav">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  {link.sub ? (
                    <>
                      <button
                        className="ch-mobile-nav-link"
                        onClick={() => setActiveDropdown(activeDropdown === link.label ? null : link.label)}
                      >
                        {link.label}
                        <span className={`ch-chevron${activeDropdown === link.label ? " open" : ""}`} />
                      </button>
                      <AnimatePresence>
                        {activeDropdown === link.label && (
                          <motion.div
                            className="ch-mobile-sub"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                          >
                            {link.sub.map((s) => (
                              <Link key={s} href="#" onClick={() => setMenuOpen(false)}>{s}</Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <Link href={link.href} className="ch-mobile-nav-link" onClick={() => setMenuOpen(false)}>
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>

            {/* Mobile auth section */}
            <div className="ch-mobile-auth">
              {isAuthenticated ? (
                <>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "12px 0", borderBottom: "1px solid var(--warm)",
                  }}>
                    <div className="ch-user-avatar" style={{ width: 40, height: 40, fontSize: 18 }}>
                      {user?.fullName?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p style={{
                        fontFamily: "'Cormorant Garamond', serif", fontSize: 18,
                        fontWeight: 300, color: "var(--charcoal)", margin: 0,
                      }}>{user?.fullName}</p>
                      <p style={{
                        fontFamily: "'Jost', sans-serif", fontSize: 10,
                        color: "var(--mink)", margin: 0, letterSpacing: "0.06em",
                      }}>{user?.email}</p>
                    </div>
                  </div>
                  <Link href="/account" style={{ color: "var(--mink)", fontFamily: "'Jost', sans-serif", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", textDecoration: "none", padding: "10px 0", display: "block" }} onClick={() => setMenuOpen(false)}>My Account</Link>
                  <Link href="/orders" style={{ color: "var(--mink)", fontFamily: "'Jost', sans-serif", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", textDecoration: "none", padding: "10px 0", display: "block" }} onClick={() => setMenuOpen(false)}>My Orders</Link>
                  <button
                    className="ch-mobile-auth-full"
                    style={{ background: "none", border: "1px solid var(--stone)", color: "var(--charcoal)" }}
                    onClick={() => { dispatch(logout()); setMenuOpen(false); }}
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="ch-mobile-auth-full"
                    style={{ background: "var(--charcoal)", border: "1px solid var(--charcoal)", color: "var(--cream)" }}
                    onClick={() => { openSignIn(); setMenuOpen(false); }}
                  >
                    Sign In
                  </button>
                  <button
                    className="ch-mobile-auth-full"
                    style={{ background: "none", border: "1px solid var(--stone)", color: "var(--charcoal)" }}
                    onClick={() => { openSignUp(); setMenuOpen(false); }}
                  >
                    Create Account
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Auth modals ── */}
      <SignIn
        isOpen={signInOpen}
        onClose={() => setSignInOpen(false)}
        onSwitchToSignUp={openSignUp}
      />
      <SignUp
        isOpen={signUpOpen}
        onClose={() => setSignUpOpen(false)}
        onSwitchToSignIn={openSignIn}
      />
    </>
  );
}