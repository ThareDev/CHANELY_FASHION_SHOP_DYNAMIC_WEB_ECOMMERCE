"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
    addToCart, removeFromCart, updateQuantity, clearCart,
    openCart, closeCart,
    selectCartItems, selectCartOpen, selectCartTotal, selectCartCount
} from "@/app/store/slices/cartSlice";
import { selectCurrentUser, selectIsAuthenticated } from "@/app/store/slices/authSlice";

// ── Replace these with your real imports ──
import p1 from "@/public/im1.jpg";
import p2 from "@/public/im2.jpg";
import p3 from "@/public/im3.jpg";
import p4 from "@/public/herooo.jpg";
import p5 from "@/public/im1.jpg";

const openSignIn = () => window.dispatchEvent(new CustomEvent("chanely:open-signin"));

const PRODUCTS = [
    { id: "p1", name: "Silk Wrap Blouse", price: 89, image: p1, tag: "New In", sizes: ["XS", "S", "M", "L"] },
    { id: "p2", name: "Tailored Trousers", price: 124, image: p2, tag: "Bestseller", sizes: ["XS", "S", "M", "L", "XL"] },
    { id: "p3", name: "Linen Midi Dress", price: 148, image: p3, tag: "New In", sizes: ["XS", "S", "M", "L"] },
    { id: "p4", name: "Drape Blazer", price: 195, image: p4, tag: "Limited", sizes: ["S", "M", "L"] },
    { id: "p5", name: "Pleat Midi Skirt", price: 96, image: p5, tag: "New In", sizes: ["XS", "S", "M", "L"] },
];

const PROVINCES = [
    "Western", "Central", "Southern", "Northern", "Eastern",
    "North Western", "North Central", "Uva", "Sabaragamuwa",
];

const FIELD = `
  width:100%;padding:12px 0;border:none;border-bottom:1px solid #D9D0C4;
  background:transparent;outline:none;font-family:'Jost',sans-serif;
  font-size:13px;letter-spacing:0.06em;color:#2C2925;transition:border-color 0.25s;
`;
const LABEL = `
  display:block;font-family:'Jost',sans-serif;font-size:9px;
  letter-spacing:0.22em;text-transform:uppercase;color:#9E9189;margin-bottom:2px;
`;

export default function NewArrivals() {
    const dispatch = useDispatch();
    const cartItems = useSelector(selectCartItems);
    const cartOpen = useSelector(selectCartOpen);
    const cartTotal = useSelector(selectCartTotal);
    const cartCount = useSelector(selectCartCount);
    const user = useSelector(selectCurrentUser);
    const isAuth = useSelector(selectIsAuthenticated);

    // Product quick-add size picker
    const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
    const [addedIds, setAddedIds] = useState<string[]>([]);

    // Cart view: "cart" | "address" | "done"
    const [cartView, setCartView] = useState<"cart" | "address" | "done">("cart");
    const [addr, setAddr] = useState({
        line1: "", line2: "", city: "", province: "Western", postal: "",
    });
    const [note, setNote] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Guest fields (shown when not authenticated)
    const [guestName, setGuestName] = useState("");
    const [guestEmail, setGuestEmail] = useState("");
    const [guestPhone, setGuestPhone] = useState("+94");

    const handleAddToCart = (product: typeof PRODUCTS[0]) => {
        if (!isAuth) {
            openSignIn();
            return;
        }
        const size = selectedSizes[product.id];
        if (!size) return;
        dispatch(addToCart({
            id: product.id, name: product.name,
            price: product.price, image: "", size, quantity: 1,
        }));
        setAddedIds(v => [...v, product.id]);
        setTimeout(() => setAddedIds(v => v.filter(x => x !== product.id)), 1800);
        dispatch(openCart());
    };

    const handlePlaceOrder = async () => {
        const orderUser = isAuth
            ? { fullName: user!.fullName, email: user!.email, whatsapp: user!.whatsapp }
            : { fullName: guestName, email: guestEmail, whatsapp: guestPhone };

        if (!orderUser.fullName || !orderUser.email)
            return setError("Please fill in your name and email.");
        if (!addr.line1 || !addr.city || !addr.postal)
            return setError("Please fill in your delivery address.");

        setLoading(true); setError("");
        try {
            const res = await fetch("/api/orders/preorder", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user: orderUser, address: addr,
                    items: cartItems, total: cartTotal, note,
                }),
            });
            const data = await res.json();
            if (!res.ok) { setError(data.message); return; }
            dispatch(clearCart());
            setCartView("done");
        } catch { setError("Network error. Please try again."); }
        finally { setLoading(false); }
    };

    const closeAndReset = () => {
        dispatch(closeCart());
        setTimeout(() => {
            setCartView("cart");
            setAddr({ line1: "", line2: "", city: "", province: "Western", postal: "" });
            setNote(""); setError("");
            setGuestName(""); setGuestEmail(""); setGuestPhone("+94");
        }, 350);
    };

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=Jost:wght@300;400;500&display=swap');
        :root{--cream:#FAF8F5;--warm:#F2EDE6;--stone:#D9D0C4;--mink:#9E9189;--charcoal:#2C2925;--ink:#1A1714;--gold:#B89A6A;--gold-lt:#D4B896;}

        .na-section{background:var(--cream);padding:80px 48px 100px;}
        .na-header{margin-bottom:52px;}
        .na-eyebrow{font-family:'Jost',sans-serif;font-size:10px;letter-spacing:0.32em;text-transform:uppercase;color:var(--gold);display:flex;align-items:center;gap:12px;margin-bottom:14px;}
        .na-title{font-family:'Cormorant Garamond',serif;font-size:clamp(32px,4vw,52px);font-weight:300;color:var(--charcoal);line-height:1.1;margin:0;}
        .na-title em{font-style:italic;color:var(--mink);}

        .na-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:20px;}

        .na-card{position:relative;display:flex;flex-direction:column;cursor:pointer;}
        .na-card-img{position:relative;aspect-ratio:3/4;overflow:hidden;background:var(--warm);}
        .na-card-img img{transition:transform 0.7s cubic-bezier(0.22,1,0.36,1);}
        .na-card:hover .na-card-img img{transform:scale(1.05);}
        .na-tag{position:absolute;top:12px;left:12px;background:var(--charcoal);color:var(--cream);font-family:'Jost',sans-serif;font-size:8px;letter-spacing:0.2em;text-transform:uppercase;padding:4px 10px;}
        .na-tag.limited{background:var(--gold);}

        .na-card-body{padding:14px 0 0;display:flex;flex-direction:column;gap:10px;}
        .na-card-name{font-family:'Cormorant Garamond',serif;font-size:18px;font-weight:300;color:var(--charcoal);line-height:1.2;}
        .na-card-price{font-family:'Jost',sans-serif;font-size:12px;letter-spacing:0.1em;color:var(--mink);}

        .na-sizes{display:flex;gap:6px;flex-wrap:wrap;}
        .na-size-btn{padding:5px 10px;border:1px solid var(--stone);background:transparent;font-family:'Jost',sans-serif;font-size:9px;letter-spacing:0.14em;color:var(--charcoal);cursor:pointer;transition:all 0.2s;}
        .na-size-btn:hover{border-color:var(--charcoal);}
        .na-size-btn.active{background:var(--charcoal);color:var(--cream);border-color:var(--charcoal);}

        .na-add-btn{width:100%;padding:11px;border:none;cursor:pointer;font-family:'Jost',sans-serif;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;transition:all 0.25s;}
        .na-add-btn.idle{background:var(--charcoal);color:var(--cream);}
        .na-add-btn.idle:hover{background:var(--gold);}
        .na-add-btn.idle:disabled{opacity:0.4;cursor:not-allowed;}
        .na-add-btn.added{background:var(--warm);color:var(--gold);border:1px solid var(--gold-lt);}

        /* ── Cart panel ── */
        .cart-field{${FIELD}}
        .cart-field:focus{border-color:var(--gold);}
        .cart-field::placeholder{color:var(--stone);}
        .cart-label{${LABEL}}
        .cart-select{${FIELD}cursor:pointer;}
        .cart-submit{width:100%;padding:15px;background:var(--charcoal);color:var(--cream);border:none;cursor:pointer;font-family:'Jost',sans-serif;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;transition:background 0.25s;}
        .cart-submit:hover:not(:disabled){background:var(--gold);}
        .cart-submit:disabled{opacity:0.55;cursor:not-allowed;}

        @media(max-width:1200px){.na-grid{grid-template-columns:repeat(3,1fr);}}
        @media(max-width:768px){.na-grid{grid-template-columns:repeat(2,1fr);}.na-section{padding:60px 24px 80px;}}
        @media(max-width:480px){.na-grid{grid-template-columns:1fr;}}
      `}</style>

            {/* ── Section ── */}
            <section className="na-section" id="new-arrivals">
                <div className="na-header">
                    <div className="na-eyebrow">
                        <span style={{ width: 32, height: 1, background: "var(--gold)", display: "inline-block" }} />
                        Just Landed
                    </div>
                    <h2 className="na-title">New <em>Arrivals</em></h2>
                </div>

                <div className="na-grid">
                    {PRODUCTS.map((p, i) => {
                        const selected = selectedSizes[p.id];
                        const added = addedIds.includes(p.id);
                        return (
                            <motion.div
                                key={p.id}
                                className="na-card"
                                initial={{ opacity: 0, y: 32 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-60px" }}
                                transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                            >
                                <div className="na-card-img">
                                    <Image src={p.image} alt={p.name} fill className="object-cover object-top"
                                        style={{ filter: "contrast(1.02) brightness(0.95) saturate(0.9)" }} />
                                    <span className={`na-tag${p.tag === "Limited" ? " limited" : ""}`}>{p.tag}</span>
                                </div>
                                <div className="na-card-body">
                                    <div className="na-card-name">{p.name}</div>
                                    <div className="na-card-price">${p.price.toFixed(2)}</div>
                                    <div className="na-sizes">
                                        {p.sizes.map(s => (
                                            <button key={s}
                                                className={`na-size-btn${selected === s ? " active" : ""}`}
                                                onClick={() => setSelectedSizes(v => ({ ...v, [p.id]: s }))}
                                            >{s}</button>
                                        ))}
                                    </div>
                                    <button
                                        className={`na-add-btn ${added ? "added" : "idle"}`}
                                        disabled={!isAuth && false}  // never disabled for guests — clicking triggers sign-in
                                        onClick={() => {
                                            if (!isAuth) { openSignIn(); return; }
                                            if (!added) handleAddToCart(p);
                                        }}
                                    >
                                        {added ? "Added ✓" : !isAuth ? "Sign In to Order" : selected ? "Add to Cart" : "Select Size"}
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </section>

            {/* ── Cart count badge on header (wire this to your header) ── */}
            {/* cartCount is exported — pass it to Header if needed */}

            {/* ── Cart / Order Popup ── */}
            <AnimatePresence>
                {cartOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            onClick={closeAndReset}
                            style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(26,23,20,0.55)", backdropFilter: "blur(4px)" }}
                        />

                        {/* Panel */}
                        <motion.div
                            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
                            transition={{ type: "spring", stiffness: 340, damping: 36 }}
                            style={{
                                position: "fixed", top: 0, right: 0, bottom: 0,
                                width: "min(480px,100vw)", zIndex: 301,
                                background: "var(--cream)", display: "flex", flexDirection: "column",
                                boxShadow: "-24px 0 64px rgba(44,41,37,0.14)",
                            }}
                        >
                            {/* Gold accent */}
                            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,var(--gold),var(--gold-lt),transparent)" }} />

                            {/* Header */}
                            <div style={{ padding: "32px 40px 24px", borderBottom: "1px solid var(--warm)", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                <div>
                                    <p style={{ fontFamily: "'Jost',sans-serif", fontSize: 9, letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 8 }}>
                                        Chanely · {cartView === "cart" ? "Your Cart" : cartView === "address" ? "Delivery Details" : "Order Placed"}
                                    </p>
                                    <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 30, fontWeight: 300, color: "var(--ink)", lineHeight: 1.1, margin: 0 }}>
                                        {cartView === "cart" && <>Shopping <em>Cart</em></>}
                                        {cartView === "address" && <>Complete <em>Order</em></>}
                                        {cartView === "done" && <>Order <em>Confirmed</em></>}
                                    </h2>
                                </div>
                                <button onClick={closeAndReset} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--mink)", padding: 4, marginTop: 4, transition: "color 0.2s" }}
                                    onMouseEnter={e => (e.currentTarget.style.color = "var(--charcoal)")}
                                    onMouseLeave={e => (e.currentTarget.style.color = "var(--mink)")}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                </button>
                            </div>

                            {/* Step progress */}
                            {cartView !== "done" && (
                                <div style={{ display: "flex", gap: 6, padding: "12px 40px 0" }}>
                                    {["cart", "address"].map((v, i) => (
                                        <div key={v} style={{
                                            height: 2, flex: 1, borderRadius: 1, background:
                                                (cartView === "cart" && i === 0) || (cartView === "address") ? "var(--gold)" : "var(--stone)", transition: "background 0.4s"
                                        }} />
                                    ))}
                                </div>
                            )}

                            {/* Body */}
                            <div style={{ flex: 1, overflowY: "auto", padding: "28px 40px" }}>
                                <AnimatePresence mode="wait">

                                    {/* ── View: Cart ── */}
                                    {cartView === "cart" && (
                                        <motion.div key="cart" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                            style={{ display: "flex", flexDirection: "column", gap: 20 }}>

                                            {cartItems.length === 0 ? (
                                                <div style={{ textAlign: "center", paddingTop: 60 }}>
                                                    <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 300, color: "var(--mink)" }}>Your cart is empty.</p>
                                                </div>
                                            ) : (
                                                <>
                                                    {cartItems.map(item => (
                                                        <div key={`${item.id}-${item.size}`} style={{ display: "flex", gap: 16, paddingBottom: 20, borderBottom: "1px solid var(--warm)" }}>
                                                            <div style={{ width: 72, height: 90, background: "var(--warm)", flexShrink: 0, position: "relative", overflow: "hidden" }}>
                                                                {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" />}
                                                                {!item.image && <div style={{ width: "100%", height: "100%", background: "var(--stone)" }} />}
                                                            </div>
                                                            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                                                                <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 17, fontWeight: 300, color: "var(--charcoal)", margin: 0 }}>{item.name}</p>
                                                                <p style={{ fontFamily: "'Jost',sans-serif", fontSize: 10, letterSpacing: "0.1em", color: "var(--mink)", margin: 0 }}>Size: {item.size}</p>
                                                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
                                                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                                        <button onClick={() => item.quantity > 1 ? dispatch(updateQuantity({ id: item.id, size: item.size, quantity: item.quantity - 1 })) : dispatch(removeFromCart({ id: item.id, size: item.size }))}
                                                                            style={{ width: 24, height: 24, border: "1px solid var(--stone)", background: "none", cursor: "pointer", fontFamily: "'Jost',sans-serif", fontSize: 14, color: "var(--charcoal)", display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                                                                        <span style={{ fontFamily: "'Jost',sans-serif", fontSize: 12, color: "var(--charcoal)", minWidth: 16, textAlign: "center" }}>{item.quantity}</span>
                                                                        <button onClick={() => dispatch(updateQuantity({ id: item.id, size: item.size, quantity: item.quantity + 1 }))}
                                                                            style={{ width: 24, height: 24, border: "1px solid var(--stone)", background: "none", cursor: "pointer", fontFamily: "'Jost',sans-serif", fontSize: 14, color: "var(--charcoal)", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                                                                    </div>
                                                                    <p style={{ fontFamily: "'Jost',sans-serif", fontSize: 13, color: "var(--charcoal)", margin: 0 }}>${(item.price * item.quantity).toFixed(2)}</p>
                                                                </div>
                                                            </div>
                                                            <button onClick={() => dispatch(removeFromCart({ id: item.id, size: item.size }))}
                                                                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--stone)", padding: 4, alignSelf: "flex-start", transition: "color 0.2s" }}
                                                                onMouseEnter={e => (e.currentTarget.style.color = "#B85C5C")}
                                                                onMouseLeave={e => (e.currentTarget.style.color = "var(--stone)")}>
                                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    ))}

                                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", borderTop: "1px solid var(--stone)" }}>
                                                        <span style={{ fontFamily: "'Jost',sans-serif", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--mink)" }}>Total</span>
                                                        <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 26, fontWeight: 300, color: "var(--charcoal)" }}>${cartTotal.toFixed(2)}</span>
                                                    </div>

                                                    <button className="cart-submit" onClick={() => setCartView("address")}>
                                                        Proceed to Order
                                                    </button>
                                                </>
                                            )}
                                        </motion.div>
                                    )}

                                    {/* ── View: Address ── */}
                                    {cartView === "address" && (
                                        <motion.div key="address" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                            style={{ display: "flex", flexDirection: "column", gap: 22 }}>

                                            {/* Guest fields if not logged in */}
                                            {!isAuth && (
                                                <div style={{ background: "var(--warm)", padding: "16px 18px", display: "flex", flexDirection: "column", gap: 18, marginBottom: 4 }}>
                                                    <p style={{ fontFamily: "'Jost',sans-serif", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold)", margin: 0 }}>Your Details</p>
                                                    <div>
                                                        <label className="cart-label">Full Name</label>
                                                        <input className="cart-field" placeholder="Your full name" value={guestName} onChange={e => { setGuestName(e.target.value); setError(""); }} />
                                                    </div>
                                                    <div>
                                                        <label className="cart-label">Email Address</label>
                                                        <input className="cart-field" type="email" placeholder="you@example.com" value={guestEmail} onChange={e => { setGuestEmail(e.target.value); setError(""); }} />
                                                    </div>
                                                    <div>
                                                        <label className="cart-label">WhatsApp</label>
                                                        <input className="cart-field" type="tel" placeholder="+94XXXXXXXXX" value={guestPhone} onChange={e => { if (e.target.value.startsWith("+94")) setGuestPhone(e.target.value); }} />
                                                    </div>
                                                </div>
                                            )}

                                            {isAuth && (
                                                <div style={{ background: "var(--warm)", padding: "14px 18px", display: "flex", alignItems: "center", gap: 12 }}>
                                                    <div style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid var(--stone)", background: "var(--cream)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Cormorant Garamond',serif", fontSize: 16, color: "var(--charcoal)", flexShrink: 0 }}>
                                                        {user?.fullName?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p style={{ fontFamily: "'Jost',sans-serif", fontSize: 11, color: "var(--charcoal)", margin: 0, letterSpacing: "0.04em" }}>{user?.fullName}</p>
                                                        <p style={{ fontFamily: "'Jost',sans-serif", fontSize: 10, color: "var(--mink)", margin: 0, letterSpacing: "0.04em" }}>{user?.email}</p>
                                                    </div>
                                                </div>
                                            )}

                                            <p style={{ fontFamily: "'Jost',sans-serif", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold)", margin: 0 }}>Delivery Address</p>

                                            <div>
                                                <label className="cart-label">Address Line 1</label>
                                                <input className="cart-field" placeholder="No. 12, Galle Road" value={addr.line1} onChange={e => setAddr(v => ({ ...v, line1: e.target.value }))} />
                                            </div>
                                            <div>
                                                <label className="cart-label">Address Line 2 <span style={{ color: "var(--stone)" }}>(optional)</span></label>
                                                <input className="cart-field" placeholder="Apartment, suite, etc." value={addr.line2} onChange={e => setAddr(v => ({ ...v, line2: e.target.value }))} />
                                            </div>
                                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                                                <div>
                                                    <label className="cart-label">City</label>
                                                    <input className="cart-field" placeholder="Colombo" value={addr.city} onChange={e => setAddr(v => ({ ...v, city: e.target.value }))} />
                                                </div>
                                                <div>
                                                    <label className="cart-label">Postal Code</label>
                                                    <input className="cart-field" placeholder="00300" value={addr.postal} onChange={e => setAddr(v => ({ ...v, postal: e.target.value }))} />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="cart-label">Province</label>
                                                <select className="cart-select cart-field" value={addr.province} onChange={e => setAddr(v => ({ ...v, province: e.target.value }))}>
                                                    {PROVINCES.map(p => <option key={p}>{p}</option>)}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="cart-label">Note <span style={{ color: "var(--stone)" }}>(optional)</span></label>
                                                <input className="cart-field" placeholder="Delivery instructions…" value={note} onChange={e => setNote(e.target.value)} />
                                            </div>

                                            <AnimatePresence>
                                                {error && (
                                                    <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                                        style={{ fontFamily: "'Jost',sans-serif", fontSize: 11, color: "#B85C5C", padding: "10px 14px", background: "rgba(184,92,92,0.06)", border: "1px solid rgba(184,92,92,0.18)", margin: 0 }}>
                                                        {error}
                                                    </motion.p>
                                                )}
                                            </AnimatePresence>

                                            {/* Order summary */}
                                            <div style={{ background: "var(--warm)", padding: "14px 18px" }}>
                                                <p style={{ fontFamily: "'Jost',sans-serif", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--mink)", margin: "0 0 10px" }}>Order Summary</p>
                                                {cartItems.map(i => (
                                                    <div key={`${i.id}-${i.size}`} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                                                        <span style={{ fontFamily: "'Jost',sans-serif", fontSize: 11, color: "var(--charcoal)" }}>{i.name} ({i.size}) ×{i.quantity}</span>
                                                        <span style={{ fontFamily: "'Jost',sans-serif", fontSize: 11, color: "var(--mink)" }}>${(i.price * i.quantity).toFixed(2)}</span>
                                                    </div>
                                                ))}
                                                <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid var(--stone)", paddingTop: 10, marginTop: 6 }}>
                                                    <span style={{ fontFamily: "'Jost',sans-serif", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--charcoal)" }}>Total</span>
                                                    <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontWeight: 300, color: "var(--charcoal)" }}>${cartTotal.toFixed(2)}</span>
                                                </div>
                                            </div>

                                            <button className="cart-submit" onClick={handlePlaceOrder} disabled={loading}>
                                                {loading ? "Placing Order…" : "Place Pre-Order"}
                                            </button>

                                            <button onClick={() => setCartView("cart")}
                                                style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Jost',sans-serif", fontSize: 10, letterSpacing: "0.12em", color: "var(--mink)", textAlign: "center" }}>
                                                ← Back to Cart
                                            </button>
                                        </motion.div>
                                    )}

                                    {/* ── View: Done ── */}
                                    {cartView === "done" && (
                                        <motion.div key="done" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                                            style={{ textAlign: "center", paddingTop: 60 }}>
                                            <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                                style={{ width: 56, height: 56, borderRadius: "50%", border: "1.5px solid var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
                                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5">
                                                    <polyline points="20 6 9 17 4 12" />
                                                </svg>
                                            </motion.div>
                                            <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 26, fontWeight: 300, color: "var(--charcoal)", marginBottom: 12 }}>
                                                Order Placed
                                            </p>
                                            <p style={{ fontFamily: "'Jost',sans-serif", fontSize: 11, color: "var(--mink)", lineHeight: 1.8, letterSpacing: "0.04em", maxWidth: 280, margin: "0 auto 28px" }}>
                                                A confirmation has been sent to your email. Our team will contact you within 24 hours.
                                            </p>
                                            <button className="cart-submit" style={{ maxWidth: 200, margin: "0 auto" }} onClick={closeAndReset}>
                                                Close
                                            </button>
                                        </motion.div>
                                    )}

                                </AnimatePresence>
                            </div>

                            {/* Footer */}
                            <div style={{ padding: "20px 40px", borderTop: "1px solid var(--warm)", display: "flex", alignItems: "center", gap: 12 }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--stone)" strokeWidth="1.5">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
                                </svg>
                                <span style={{ fontFamily: "'Jost',sans-serif", fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--mink)" }}>
                                    Pre-Order · Confirmed Within 24 Hours
                                </span>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}