import { useState, useEffect, useRef } from "react";

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────
const GAS_URL = "https://script.google.com/macros/s/AKfycbytwotuAasn9-ikmI7WOodPmQBXppN9AFAScdGZnJ0M_mNrBFnqFsxTKIpn5TCn4SRK/exec";

const COURSES = [
  { id: 1, name: "Product Growth 101", icon: "🚀", desc: "สร้างและพัฒนาผลิตภัณฑ์ที่ตลาดต้องการ" },
  { id: 2, name: "Business Growth 101", icon: "📈", desc: "กลยุทธ์ขยายธุรกิจให้เติบโตอย่างยั่งยืน" },
  { id: 3, name: "Health Buddy Growth 101", icon: "💪", desc: "สุขภาพดี พลังงานเต็ม เพื่อธุรกิจที่ดีกว่า" },
  { id: 4, name: "Digital Growth 101", icon: "💻", desc: "Digital Marketing & Tools สำหรับยุคใหม่" },
];

const PACKAGES = [
  { id: "trial", label: "รายครั้ง (Trial)", price: 150, duration: "1 วัน / 1 คอร์ส", color: "#3B82F6", badge: null },
  { id: "quarter", label: "ราย 3 เดือน (Quarter)", price: 600, duration: "90 วัน ไม่จำกัดคอร์ส", color: "#10B981", badge: "แนะนำ" },
];

const MOCK_SCHEDULES = [
  { id: 1, date: "2025-03-05", time: "09:00–12:00", course: "Product Growth 101", mode: "online", seats: 20, taken: 8, zoomId: "123-456-789", zoomPw: "owner101" },
  { id: 2, date: "2025-03-08", time: "13:00–16:00", course: "Business Growth 101", mode: "onsite", seats: 15, taken: 12, zoomId: null, zoomPw: null },
  { id: 3, date: "2025-03-12", time: "09:00–12:00", course: "Digital Growth 101", mode: "online", seats: 25, taken: 5, zoomId: "987-654-321", zoomPw: "digital2025" },
  { id: 4, date: "2025-03-15", time: "13:00–16:00", course: "Health Buddy Growth 101", mode: "onsite", seats: 20, taken: 18, zoomId: null, zoomPw: null },
  { id: 5, date: "2025-03-19", time: "09:00–12:00", course: "Product Growth 101", mode: "online", seats: 20, taken: 10, zoomId: "111-222-333", zoomPw: "product2" },
  { id: 6, date: "2025-03-22", time: "13:00–16:00", course: "Business Growth 101", mode: "online", seats: 25, taken: 7, zoomId: "444-555-666", zoomPw: "biz2025" },
];

const MOCK_MEMBERS = [
  { id: 1, name: "สมหญิง ใจดี", phone: "081-234-5678", lineId: "U111aaa", pkg: "quarter", status: "approved", slip: null, registeredAt: "2025-02-10", expiresAt: "2025-05-10", checkedIn: true, fine: 0 },
  { id: 2, name: "วิชัย มั่งมี", phone: "089-876-5432", lineId: "U222bbb", pkg: "trial", status: "pending", slip: "slip_wichai.jpg", registeredAt: "2025-02-25", expiresAt: null, checkedIn: false, fine: 0 },
  { id: 3, name: "นภา สดใส", phone: "090-111-2222", lineId: "U333ccc", pkg: "quarter", status: "pending", slip: "slip_napa.jpg", registeredAt: "2025-02-25", expiresAt: null, checkedIn: false, fine: 0 },
  { id: 4, name: "ธนา รุ่งเรือง", phone: "095-333-4444", lineId: "U444ddd", pkg: "trial", status: "rejected", slip: "slip_tana.jpg", registeredAt: "2025-02-24", expiresAt: null, checkedIn: false, fine: 100 },
  { id: 5, name: "มะลิ โชคดี", phone: "082-555-6666", lineId: "U555eee", pkg: "quarter", status: "approved", slip: null, registeredAt: "2025-01-15", expiresAt: "2025-04-15", checkedIn: true, fine: 0 },
];

const MOCK_CHECKINS = [
  { id: 1, memberId: 1, memberName: "สมหญิง ใจดี", scheduleId: 1, course: "Product Growth 101", date: "2025-03-05", mode: "online", type: "pre", fine: 0 },
  { id: 2, memberId: 5, memberName: "มะลิ โชคดี", scheduleId: 2, course: "Business Growth 101", date: "2025-03-08", mode: "onsite", type: "emergency", fine: 100 },
];

const DEFAULT_THEME = {
  primary: "#0A12FF",
  accent: "#10B981",
  bg: "#07091A",
  card: "#0D1330",
  surface: "#111827",
  text: "#F9FAFB",
  muted: "rgba(249,250,251,0.5)",
  border: "rgba(255,255,255,0.08)",
  fontSize: 15,
  fontBody: "'Sarabun', sans-serif",
  fontDisplay: "'Bebas Neue', cursive",
};

// ─────────────────────────────────────────────
// TINY UTILS
// ─────────────────────────────────────────────
const cx = (...args) => args.filter(Boolean).join(" ");

function Ic({ d, size = 20, stroke = 2 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

const ICONS = {
  home: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z",
  users: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100 8 4 4 0 000-8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75",
  calendar: "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z",
  check: "M20 6L9 17l-5-5",
  x: "M18 6L6 18M6 6l12 12",
  upload: "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12",
  settings: "M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  logout: "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9",
  qr: "M3 3h6v6H3zM15 3h6v6h-6zM3 15h6v6H3zM15 15h2v2h-2zM19 15v2M15 19h2M19 19h2v2h-2M17 17h2",
  zoom: "M15 10l4.553-2.069A1 1 0 0121 8.845v6.31a1 1 0 01-1.447.894L15 14v-4zM3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z",
  link: "M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71",
  plus: "M12 5v14M5 12h14",
  trash: "M3 6h18M8 6V4h8v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6",
  edit: "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
  eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 100 6 3 3 0 000-6z",
  bell: "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0",
  chart: "M18 20V10M12 20V4M6 20v-6",
  book: "M4 19.5A2.5 2.5 0 016.5 17H20M4 19.5v-15A2.5 2.5 0 016.5 2H20v20H6.5A2.5 2.5 0 014 19.5z",
  warning: "M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01",
  info: "M12 22a10 10 0 100-20 10 10 0 000 20zM12 8h.01M11 12h1v4h1",
  chevronDown: "M6 9l6 6 6-6",
  menu: "M3 12h18M3 6h18M3 18h18",
  google: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09zM12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23zM5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62zM12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z",
  line: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z",
  fire: "M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 01-7 7 7 7 0 01-7-7c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z",
  arrowRight: "M5 12h14M12 5l7 7-7 7",
  copy: "M8 17.929H6c-1.105 0-2-.912-2-2.036V5.036C4 3.91 4.895 3 6 3h8c1.105 0 2 .911 2 2.036v1.866m-6 .17h8c1.105 0 2 .91 2 2.035v10.857C20 21.09 19.105 22 18 22h-8c-1.105 0-2-.911-2-2.036V9.107c0-1.124.895-2.036 2-2.036z",
};

function Tag({ children, color = "#3B82F6" }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: color + "22", color, padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
      {children}
    </span>
  );
}

function StatusBadge({ status }) {
  const map = {
    pending: ["รออนุมัติ", "#F59E0B"],
    approved: ["อนุมัติแล้ว", "#10B981"],
    rejected: ["ปฏิเสธ", "#EF4444"],
    online: ["Online", "#3B82F6"],
    onsite: ["Onsite", "#8B5CF6"],
    trial: ["Trial", "#3B82F6"],
    quarter: ["Quarter", "#10B981"],
    emergency: ["ฉุกเฉิน", "#EF4444"],
    pre: ["ลงทะเบียนล่วงหน้า", "#10B981"],
  };
  const [label, color] = map[status] || [status, "#6B7280"];
  return <Tag color={color}>{label}</Tag>;
}

// ─────────────────────────────────────────────
// GLOBAL STYLES INJECTOR
// ─────────────────────────────────────────────
function GlobalStyles({ theme }) {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700;800&family=Bebas+Neue&display=swap');
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      html, body, #root { scroll-behavior: smooth; width: 100%; max-width: 100%; overflow-x: hidden; }
      body { background: ${theme.bg}; color: ${theme.text}; font-family: ${theme.fontBody}; font-size: ${theme.fontSize}px; line-height: 1.6; overflow-x: hidden; }
      ::-webkit-scrollbar { width: 6px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: ${theme.border}; border-radius: 3px; }
      input, select, textarea, button { font-family: ${theme.fontBody}; }
      a { color: inherit; text-decoration: none; }
      .fade-in { animation: fadeUp 0.5s ease forwards; }
      @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
      .pulse { animation: pulse 2s infinite; }
      @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
      .glow { box-shadow: 0 0 40px ${theme.primary}44; }
      @media (max-width: 768px) {
        .hide-mobile { display: none !important; }
        .admin-sidebar { transform: translateX(-100%); }
        .admin-sidebar.open { transform: translateX(0); }
        .admin-main { margin-left: 0 !important; }
      }
    `}</style>
  );
}

// ─────────────────────────────────────────────
// SHARED COMPONENTS
// ─────────────────────────────────────────────
function Btn({ children, onClick, variant = "primary", size = "md", fullWidth, style: extraStyle, disabled, type = "button" }) {
  const theme = window.__theme || DEFAULT_THEME;
  const base = {
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
    border: "none", cursor: disabled ? "not-allowed" : "pointer", fontWeight: 700,
    fontFamily: theme.fontBody, transition: "all 0.2s", borderRadius: 12, opacity: disabled ? 0.5 : 1,
  };
  const sizes = { sm: { padding: "8px 16px", fontSize: 13 }, md: { padding: "12px 24px", fontSize: 15 }, lg: { padding: "16px 36px", fontSize: 17 } };
  const variants = {
    primary: { background: theme.primary, color: "#fff" },
    accent: { background: theme.accent, color: "#000" },
    ghost: { background: "rgba(255,255,255,0.07)", color: theme.text },
    danger: { background: "#EF4444", color: "#fff" },
    success: { background: "#10B981", color: "#000" },
    outline: { background: "transparent", color: theme.primary, border: `2px solid ${theme.primary}` },
  };
  return (
    <button type={type} disabled={disabled} onClick={onClick}
      style={{ ...base, ...sizes[size], ...variants[variant], ...(fullWidth && { width: "100%" }), ...extraStyle }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.opacity = "0.85"; }}
      onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}>
      {children}
    </button>
  );
}

function Card({ children, style: extra, glow }) {
  const theme = window.__theme || DEFAULT_THEME;
  return (
    <div style={{
      background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 20, padding: 24,
      ...(glow && { boxShadow: `0 0 40px ${theme.primary}22` }), ...extra,
    }}>
      {children}
    </div>
  );
}

function Input({ label, value, onChange, placeholder, type = "text", required, children }) {
  const theme = window.__theme || DEFAULT_THEME;
  return (
    <div style={{ marginBottom: 16 }}>
      {label && <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600, color: theme.muted }}>{label}{required && <span style={{ color: "#EF4444" }}> *</span>}</label>}
      {children || (
        <input type={type} value={value} onChange={e => onChange(e.target.value)}
          placeholder={placeholder} required={required}
          style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: `1px solid ${theme.border}`, borderRadius: 12, padding: "13px 16px", color: theme.text, fontSize: theme.fontSize, outline: "none", transition: "border-color 0.2s" }}
          onFocus={e => e.target.style.borderColor = theme.primary}
          onBlur={e => e.target.style.borderColor = theme.border}
        />
      )}
    </div>
  );
}

function Select({ label, value, onChange, options, required }) {
  const theme = window.__theme || DEFAULT_THEME;
  return (
    <div style={{ marginBottom: 16 }}>
      {label && <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600, color: theme.muted }}>{label}{required && <span style={{ color: "#EF4444" }}> *</span>}</label>}
      <select value={value} onChange={e => onChange(e.target.value)}
        style={{ width: "100%", background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 12, padding: "13px 16px", color: theme.text, fontSize: theme.fontSize, outline: "none", appearance: "none" }}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function SectionTitle({ children, sub, center }) {
  const theme = window.__theme || DEFAULT_THEME;
  return (
    <div style={{ marginBottom: 48, ...(center && { textAlign: "center" }) }}>
      <h2 style={{ fontFamily: theme.fontDisplay, fontSize: "clamp(40px, 6vw, 64px)", letterSpacing: 2, lineHeight: 1, color: theme.text, marginBottom: 12 }}>{children}</h2>
      {sub && <p style={{ color: theme.muted, fontSize: 16, maxWidth: 560, ...(center && { margin: "0 auto" }) }}>{sub}</p>}
    </div>
  );
}

function Divider() {
  const theme = window.__theme || DEFAULT_THEME;
  return <div style={{ height: 1, background: theme.border, margin: "32px 0" }} />;
}

function InfoBox({ type = "info", children }) {
  const theme = window.__theme || DEFAULT_THEME;
  const colors = { info: "#3B82F6", warning: "#F59E0B", success: "#10B981", danger: "#EF4444" };
  const icons = { info: ICONS.info, warning: ICONS.warning, success: ICONS.check, danger: ICONS.x };
  const c = colors[type];
  return (
    <div style={{ background: c + "15", border: `1px solid ${c}40`, borderRadius: 14, padding: "16px 20px", display: "flex", gap: 12, marginBottom: 20 }}>
      <div style={{ color: c, flexShrink: 0, marginTop: 2 }}><Ic d={icons[type]} size={18} /></div>
      <div style={{ fontSize: 14, color: theme.text, lineHeight: 1.7 }}>{children}</div>
    </div>
  );
}

// ─────────────────────────────────────────────
// LANDING PAGE
// ─────────────────────────────────────────────
function LandingPage({ theme, onAdmin }) {
  const [section, setSection] = useState("home");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", lineId: "", email: "", pkg: "trial", mode: "online", course: "", slip: null });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const navItems = [
    ["home", "หน้าหลัก"], ["courses", "คอร์ส"], ["schedule", "ตารางเรียน"],
    ["packages", "แพ็กเกจ"], ["how", "วิธีสมัคร"], ["register", "สมัครสมาชิก"], ["faq", "FAQ"],
  ];

  const scrollTo = (id) => { setSection(id); setMobileMenu(false); document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await fetch(GAS_URL, {
      method: "POST",
      body: JSON.stringify({
        action: "addMember",
        lineId: form.lineId,
        name: form.name,
        phone: form.phone,
        email: form.email,
        package: form.pkg,
        mode: form.mode,
      })
    });
    const result = await res.json();
    if (result.success) {
      setSubmitted(true);
    } else {
      alert("เกิดข้อผิดพลาด: " + result.message);
    }
  } catch (err) {
    alert("ไม่สามารถเชื่อมต่อได้ กรุณาลองใหม่อีกครั้ง");
  }
};

  const faqs = [
    ["สมัครสมาชิกได้อย่างไร?", "กรอกฟอร์มด้านล่าง เลือกแพ็กเกจ โอนเงินผ่าน PromptPay แล้วแนบสลิป admin จะยืนยันผ่าน Line OA ภายใน 24 ชม."],
    ["Trial เรียนได้กี่คอร์ส?", "เรียนได้ 1 คอร์ส หรือ 1 วัน เริ่มนับหลัง Check-in ครั้งแรก"],
    ["Quarter เรียนได้นานแค่ไหน?", "90 วัน นับจากการ Check-in ครั้งแรก เรียนได้ทุกคอร์สที่เปิดในช่วงนั้น"],
    ["เรียน Online ผ่านอะไร?", "เรียนผ่าน Zoom หลังลงทะเบียนคอร์ส admin จะส่ง Meeting ID และ Password ผ่าน Line OA"],
    ["ลงทะเบียน Onsite ได้ยังไง?", "เลือกคอร์สที่ต้องการผ่าน Landing Page หรือ Line OA ล่วงหน้า เพื่อจองที่นั่ง"],
    ["ถ้ามา Onsite แบบฉุกเฉิน?", "สามารถ Scan QR Code หน้าห้องได้ แต่จะมีค่าปรับตามที่กำหนด เพื่อส่งเสริมการลงทะเบียนล่วงหน้า"],
  ];

  const howSteps = [
    { num: "01", title: "เลือกแพ็กเกจ", desc: "Trial (150฿/ครั้ง) หรือ Quarter (600฿/3เดือน)", icon: "📦" },
    { num: "02", title: "โอนเงิน", desc: "โอนผ่าน PromptPay หรือ Bangkok Bank ตามข้อมูลด้านล่าง", icon: "💳" },
    { num: "03", title: "แนบสลิป", desc: "กรอกฟอร์มและแนบรูปสลิปการโอนเงิน", icon: "📎" },
    { num: "04", title: "รอการยืนยัน", desc: "Admin ตรวจสอบและส่งข้อมูลยืนยันผ่าน Line OA ภายใน 24 ชม.", icon: "✅" },
  ];

  return (
    <>
      {/* NAV */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "rgba(7,9,26,0.92)", backdropFilter: "blur(16px)", borderBottom: `1px solid ${theme.border}` }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button onClick={() => scrollTo("home")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: "50%", background: theme.primary, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><img src="/the_owner_logo.png" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} /></div>
            <span style={{ fontFamily: theme.fontDisplay, fontSize: 22, letterSpacing: 3, color: theme.text }}>THE OWNER</span>
          </button>

          <div className="hide-mobile" style={{ display: "flex", gap: 2 }}>
            {navItems.map(([id, label]) => (
              <button key={id} onClick={() => scrollTo(id)}
                style={{ background: "none", border: "none", cursor: "pointer", color: section === id ? theme.text : theme.muted, padding: "8px 14px", borderRadius: 10, fontSize: 13, fontWeight: 600, transition: "all 0.2s", fontFamily: theme.fontBody }}>
                {label}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <Btn size="sm" variant="ghost" onClick={onAdmin}><Ic d={ICONS.shield} size={15} /> Admin</Btn>
            <button className="hide-mobile" style={{ display: "none" }} />
            <button onClick={() => setMobileMenu(!mobileMenu)} style={{ display: "none", background: "none", border: "none", color: theme.text, cursor: "pointer" }} className="show-mobile">
              <Ic d={ICONS.menu} size={22} />
            </button>
          </div>
        </div>
        {mobileMenu && (
          <div style={{ background: theme.card, borderTop: `1px solid ${theme.border}`, padding: 16 }}>
            {navItems.map(([id, label]) => (
              <button key={id} onClick={() => scrollTo(id)} style={{ display: "block", width: "100%", textAlign: "left", background: "none", border: "none", color: theme.text, padding: "12px 16px", fontSize: 15, cursor: "pointer", fontFamily: theme.fontBody }}>
                {label}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* HERO */}
      <section id="home" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "120px 24px 80px", position: "relative", overflow: "hidden", width: "100%", boxSizing: "border-box" }}>
        {/* bg decoration */}
        <div style={{ position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)", width: 700, height: 700, background: `radial-gradient(circle, ${theme.primary}22 0%, transparent 65%)`, pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "5%", right: "10%", width: 300, height: 300, background: `radial-gradient(circle, ${theme.accent}18 0%, transparent 70%)`, pointerEvents: "none" }} />

        <div style={{ textAlign: "center", maxWidth: 800, position: "relative", margin: "0 auto", width: "100%", padding: "0 16px" }}>
          <div className="fade-in" style={{ marginBottom: 32 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: theme.primary + "22", border: `1px solid ${theme.primary}44`, borderRadius: 30, padding: "8px 20px", fontSize: 14, color: theme.primary, fontWeight: 600, marginBottom: 32 }}>
              <span className="pulse" style={{ width: 8, height: 8, borderRadius: "50%", background: theme.primary, display: "inline-block" }} />
              เปิดรับสมาชิกแล้ววันนี้
            </div>
            <div style={{ width: 120, height: 120, borderRadius: "50%", background: theme.primary, margin: "0 auto 32px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><img src="/the_owner_logo.png" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} /></div>
          </div>
          <h1 className="fade-in" style={{ fontFamily: theme.fontDisplay, fontSize: "clamp(72px, 14vw, 160px)", lineHeight: 0.9, letterSpacing: 6, marginBottom: 24, animationDelay: "0.1s" }}>
            THE<br /><span style={{ color: theme.primary }}>OWNER</span>
          </h1>
          <p className="fade-in" style={{ fontSize: "clamp(16px, 2.5vw, 22px)", color: theme.muted, marginBottom: 48, lineHeight: 1.8, animationDelay: "0.2s" }}>
            i am because we are<br />เรียนรู้ · เติบโต · สร้างธุรกิจที่ยั่งยืน
          </p>
          <div className="fade-in" style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", animationDelay: "0.3s" }}>
            <Btn size="lg" onClick={() => scrollTo("register")}><Ic d={ICONS.arrowRight} size={20} /> สมัครสมาชิก</Btn>
            <Btn size="lg" variant="outline" onClick={() => scrollTo("courses")}>ดูคอร์สทั้งหมด</Btn>
          </div>

          <div className="fade-in" style={{ display: "flex", gap: 48, justifyContent: "center", marginTop: 72, flexWrap: "wrap", animationDelay: "0.4s" }}>
            {[["4", "คอร์สหลัก"], ["6+", "ครั้ง/เดือน"], ["150฿", "เริ่มต้นที่"], ["Online", "& Onsite"]].map(([n, l]) => (
              <div key={l} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: theme.fontDisplay, fontSize: 40, color: theme.primary, lineHeight: 1 }}>{n}</div>
                <div style={{ color: theme.muted, fontSize: 13, marginTop: 4 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COURSES */}
      <section id="courses" style={{ padding: "100px 24px", maxWidth: 1280, margin: "0 auto" }}>
        <SectionTitle center sub="เรียนได้ฟรีตามแพ็กเกจที่สมัคร ทั้ง Online และ Onsite">
          คอร์ส<span style={{ color: theme.primary }}>ทั้งหมด</span>
        </SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
          {COURSES.map((c, i) => (
            <Card key={c.id} style={{ animationDelay: `${i * 0.1}s` }} className="fade-in">
              <div style={{ fontSize: 48, marginBottom: 16 }}>{c.icon}</div>
              <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>{c.name}</h3>
              <p style={{ color: theme.muted, fontSize: 14, lineHeight: 1.7 }}>{c.desc}</p>
              <div style={{ marginTop: 20, display: "flex", gap: 8, flexWrap: "wrap" }}>
                <Tag color={theme.primary}>Online</Tag>
                <Tag color="#8B5CF6">Onsite</Tag>
                <Tag color={theme.accent}>ฟรีตามแพ็กเกจ</Tag>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* SCHEDULE */}
      <section id="schedule" style={{ padding: "100px 24px", background: "rgba(255,255,255,0.015)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <SectionTitle center sub="อัปเดตทุกเดือน ประมาณ 6 คอร์สต่อเดือน">
            ตาราง<span style={{ color: theme.primary }}>เรียน</span>
          </SectionTitle>
          <InfoBox type="info">ลงทะเบียนล่วงหน้าผ่าน Line OA หรือ Landing Page เพื่อจองที่นั่ง และรับ Zoom Link (สำหรับ Online)</InfoBox>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 8px", minWidth: 700 }}>
              <thead>
                <tr style={{ color: theme.muted, fontSize: 13, textTransform: "uppercase", letterSpacing: 1 }}>
                  {["วันที่", "เวลา", "คอร์ส", "รูปแบบ", "ที่นั่ง", ""].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "8px 16px", fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MOCK_SCHEDULES.map(s => {
                  const pct = s.taken / s.seats;
                  const full = pct >= 1;
                  return (
                    <tr key={s.id}>
                      {[
                        <td key="date" style={{ padding: "16px", background: theme.card, borderRadius: "12px 0 0 12px", fontWeight: 600 }}>{s.date}</td>,
                        <td key="time" style={{ padding: "16px", background: theme.card, color: theme.muted, fontSize: 14 }}>{s.time}</td>,
                        <td key="course" style={{ padding: "16px", background: theme.card, fontWeight: 600 }}>{s.course}</td>,
                        <td key="mode" style={{ padding: "16px", background: theme.card }}><StatusBadge status={s.mode} /></td>,
                        <td key="seats" style={{ padding: "16px", background: theme.card }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{ width: 80, height: 5, background: "rgba(255,255,255,0.1)", borderRadius: 3, overflow: "hidden" }}>
                              <div style={{ width: `${pct * 100}%`, height: "100%", background: pct > 0.8 ? "#EF4444" : theme.accent, borderRadius: 3 }} />
                            </div>
                            <span style={{ fontSize: 13, color: theme.muted }}>{s.taken}/{s.seats}</span>
                          </div>
                        </td>,
                        <td key="btn" style={{ padding: "16px", background: theme.card, borderRadius: "0 12px 12px 0" }}>
                          <Btn size="sm" variant={full ? "ghost" : "primary"} disabled={full} onClick={() => scrollTo("register")}>
                            {full ? "เต็ม" : "จองที่นั่ง"}
                          </Btn>
                        </td>,
                      ]}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* PACKAGES */}
      <section id="packages" style={{ padding: "100px 24px", maxWidth: 900, margin: "0 auto" }}>
        <SectionTitle center sub="เลือกแพ็กเกจที่เหมาะกับคุณ">
          <span style={{ color: theme.primary }}>แพ็กเกจ</span>สมาชิก
        </SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
          {PACKAGES.map((pkg) => (
            <div key={pkg.id} style={{ background: theme.card, border: `2px solid ${pkg.id === "quarter" ? pkg.color : theme.border}`, borderRadius: 24, padding: 40, position: "relative", overflow: "hidden", transition: "transform 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: pkg.color }} />
              {pkg.badge && (
                <div style={{ position: "absolute", top: 20, right: 20, background: pkg.color, color: "#000", padding: "4px 14px", borderRadius: 20, fontSize: 12, fontWeight: 800 }}>
                  ⭐ {pkg.badge}
                </div>
              )}
              <Tag color={pkg.color} style={{ marginBottom: 24 }}>{pkg.label}</Tag>
              <div style={{ marginTop: 16, marginBottom: 8 }}>
                <span style={{ fontFamily: theme.fontDisplay, fontSize: 72, color: pkg.color }}>{pkg.price.toLocaleString()}</span>
                <span style={{ fontSize: 16, color: theme.muted }}>฿</span>
              </div>
              <p style={{ color: theme.muted, fontSize: 14, marginBottom: 28 }}>{pkg.duration}</p>
              <Divider />
              <ul style={{ listStyle: "none", marginBottom: 32 }}>
                {(pkg.id === "trial"
                  ? ["เรียนได้ 1 คอร์ส หรือ 1 วัน", "Online & Onsite", "นับหลัง Check-in ครั้งแรก", "เหมาะสำหรับทดลองเรียน"]
                  : ["เรียนได้ไม่จำกัด 90 วัน", "ทุกคอร์ส Online & Onsite", "นับหลัง Check-in ครั้งแรก", "ประหยัดกว่า Trial มากกว่า 70%", "รับข่าวสารคอร์สใหม่ก่อนใคร"]
                ).map(t => (
                  <li key={t} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "7px 0", fontSize: 14 }}>
                    <span style={{ color: pkg.color, flexShrink: 0, marginTop: 2 }}><Ic d={ICONS.check} size={16} /></span> {t}
                  </li>
                ))}
              </ul>
              <Btn fullWidth variant={pkg.id === "quarter" ? "accent" : "primary"} style={{ background: pkg.color, color: pkg.id === "quarter" ? "#000" : "#fff" }} onClick={() => scrollTo("register")}>
                เลือกแพ็กเกจนี้ <Ic d={ICONS.arrowRight} size={16} />
              </Btn>
            </div>
          ))}
        </div>
      </section>

      {/* HOW TO */}
      <section id="how" style={{ padding: "100px 24px", background: "rgba(255,255,255,0.015)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <SectionTitle center sub="4 ขั้นตอนง่ายๆ สมัครสมาชิก The Owner">
            วิธี<span style={{ color: theme.primary }}>สมัคร</span>
          </SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
            {howSteps.map((s, i) => (
              <Card key={s.num}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>{s.icon}</div>
                <div style={{ fontFamily: theme.fontDisplay, fontSize: 48, color: theme.border, marginBottom: 8, lineHeight: 1 }}>{s.num}</div>
                <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>{s.title}</h3>
                <p style={{ color: theme.muted, fontSize: 14, lineHeight: 1.7 }}>{s.desc}</p>
                {i < howSteps.length - 1 && (
                  <div style={{ marginTop: 20 }}>
                    <Tag color={theme.primary}>↓ ขั้นต่อไป</Tag>
                  </div>
                )}
              </Card>
            ))}
          </div>

          {/* Bank Info */}
          <Card style={{ marginTop: 40, background: `linear-gradient(135deg, ${theme.primary}15, ${theme.accent}10)`, border: `1px solid ${theme.primary}30` }}>
            <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
              <span>🏦</span> ข้อมูลการชำระเงิน
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20 }}>
              {[
                ["ธนาคาร", "Bangkok Bank"],
                ["PromptPay", "089-xxx-2626"],
                ["ชื่อบัญชี", "นาง สุพัตรา หงษ์วิเศษ"],
                ["หมายเหตุ", "โอนแล้วแนบสลิปในฟอร์ม"],
              ].map(([k, v]) => (
                <div key={k}>
                  <div style={{ fontSize: 12, color: theme.muted, marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>{k}</div>
                  <div style={{ fontWeight: 700, fontSize: 16, color: k === "PromptPay" ? theme.accent : theme.text }}>{v}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* REGISTER */}
      <section id="register" style={{ padding: "100px 24px", maxWidth: 820, margin: "0 auto" }}>
        <SectionTitle center sub="กรอกข้อมูลและแนบสลิปเพื่อสมัครสมาชิก">
          สมัคร<span style={{ color: theme.primary }}>สมาชิก</span>
        </SectionTitle>

        {submitted ? (
          <Card glow style={{ textAlign: "center", padding: 60 }}>
            <div style={{ fontSize: 72, marginBottom: 20 }}>✅</div>
            <h2 style={{ fontFamily: theme.fontDisplay, fontSize: 40, letterSpacing: 2, marginBottom: 16 }}>ส่งข้อมูลแล้ว!</h2>
            <p style={{ color: theme.muted, lineHeight: 1.9, fontSize: 16, maxWidth: 440, margin: "0 auto 32px" }}>
              Admin จะตรวจสอบสลิปและส่งข้อมูลยืนยันกลับผ่าน <strong style={{ color: theme.text }}>Line OA "The Owner"</strong> ภายใน 1–24 ชั่วโมง
            </p>
            <Btn variant="ghost" onClick={() => setSubmitted(false)}>สมัครอีกครั้ง</Btn>
          </Card>
        ) : (
          <Card>
            <form onSubmit={handleSubmit}>
              <InfoBox type="warning">กรุณากรอกชื่อ-นามสกุลให้ตรงกับสลิปการโอนเงิน เพื่อให้ Admin ยืนยันได้ถูกต้อง</InfoBox>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <Input label="ชื่อ-นามสกุล" value={form.name} onChange={v => setForm({ ...form, name: v })} placeholder="ตามบัตรประชาชน" required />
                <Input label="เบอร์โทรศัพท์" value={form.phone} onChange={v => setForm({ ...form, phone: v })} placeholder="08x-xxx-xxxx" required />
              </div>
              <Input label="Line ID" value={form.lineId} onChange={v => setForm({ ...form, lineId: v })} placeholder="Line ID ของคุณ (สำคัญมาก)" required />
              <Input label="อีเมล (ไม่บังคับ)" value={form.email} onChange={v => setForm({ ...form, email: v })} placeholder="example@email.com" type="email" />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <Select label="แพ็กเกจ" value={form.pkg} onChange={v => setForm({ ...form, pkg: v })} required options={PACKAGES.map(p => ({ value: p.id, label: `${p.label} – ${p.price} ฿` }))} />
                <Select label="รูปแบบการเรียน" value={form.mode} onChange={v => setForm({ ...form, mode: v })} required options={[{ value: "online", label: "Online (Zoom)" }, { value: "onsite", label: "Onsite (มาเองที่สถานที่)" }]} />
              </div>

              {/* Slip Upload */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600, color: theme.muted }}>สลิปโอนเงิน <span style={{ color: "#EF4444" }}>*</span></label>
                <div
                  onClick={() => document.getElementById("slip-file").click()}
                  style={{ border: `2px dashed ${form.slip ? theme.accent : theme.border}`, borderRadius: 16, padding: 40, textAlign: "center", cursor: "pointer", transition: "all 0.2s", background: form.slip ? theme.accent + "10" : "transparent" }}>
                  {form.slip ? (
                    <>
                      <div style={{ fontSize: 36, marginBottom: 8 }}>✅</div>
                      <div style={{ color: theme.accent, fontWeight: 700 }}>{form.slip.name}</div>
                    </>
                  ) : (
                    <>
                      <div style={{ color: theme.muted, marginBottom: 8 }}><Ic d={ICONS.upload} size={32} /></div>
                      <div style={{ fontWeight: 600, marginBottom: 4 }}>คลิกหรือลากไฟล์มาวางที่นี่</div>
                      <div style={{ color: theme.muted, fontSize: 13 }}>รองรับ JPG, PNG, PDF</div>
                    </>
                  )}
                  <input id="slip-file" type="file" accept="image/*,.pdf" style={{ display: "none" }} onChange={e => setForm({ ...form, slip: e.target.files[0] })} />
                </div>
              </div>

              <Btn type="submit" size="lg" fullWidth style={{ marginTop: 8 }}>
                ส่งข้อมูลการสมัคร <Ic d={ICONS.arrowRight} size={18} />
              </Btn>

              <p style={{ textAlign: "center", marginTop: 16, color: theme.muted, fontSize: 13 }}>
                หรือสมัครผ่าน <strong style={{ color: "#06C755" }}>Line OA "The Owner"</strong> ได้เลย
              </p>
            </form>
          </Card>
        )}
      </section>

      {/* FAQ */}
      <section id="faq" style={{ padding: "100px 24px", background: "rgba(255,255,255,0.015)" }}>
        <div style={{ maxWidth: 740, margin: "0 auto" }}>
          <SectionTitle center sub="คำถามที่พบบ่อยเกี่ยวกับ The Owner">
            FAQ <span style={{ color: theme.primary }}>คำถาม</span>ที่พบบ่อย
          </SectionTitle>
          {faqs.map(([q, a], i) => (
            <div key={i} onClick={() => setOpenFaq(openFaq === i ? null : i)}
              style={{ background: theme.card, border: `1px solid ${openFaq === i ? theme.primary + "60" : theme.border}`, borderRadius: 16, marginBottom: 10, cursor: "pointer", transition: "all 0.2s", overflow: "hidden" }}>
              <div style={{ padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 700, paddingRight: 16 }}>{q}</span>
                <span style={{ color: theme.primary, fontSize: 22, flexShrink: 0, transition: "transform 0.2s", transform: openFaq === i ? "rotate(45deg)" : "rotate(0)" }}>+</span>
              </div>
              {openFaq === i && (
                <div style={{ padding: "0 24px 20px", color: theme.muted, lineHeight: 1.8, fontSize: 15, borderTop: `1px solid ${theme.border}`, paddingTop: 16 }}>
                  {a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: `1px solid ${theme.border}`, padding: "48px 24px", textAlign: "center" }}>
        <div style={{ fontFamily: theme.fontDisplay, fontSize: 28, letterSpacing: 4, marginBottom: 8 }}>THE OWNER</div>
        <p style={{ color: theme.muted, fontSize: 14, marginBottom: 24 }}>i am because we are</p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginBottom: 32 }}>
          <Tag color="#06C755">Line OA: @theowner</Tag>
          <Tag color={theme.primary}>PromptPay: 089-xxx-2626</Tag>
          <Tag color="#3B82F6">Bangkok Bank</Tag>
        </div>
        <p style={{ color: theme.muted, fontSize: 13 }}>© 2025 The Owner. All rights reserved.</p>
      </footer>
    </>
  );
}

// ─────────────────────────────────────────────
// ADMIN LOGIN
// ─────────────────────────────────────────────
function AdminLogin({ theme, onLogin, onBack }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");

  const ACCOUNTS = {
    "admin@theowner.com": { pass: "admin123", role: "super_admin", name: "Super Admin" },
    "helper@theowner.com": { pass: "helper123", role: "helper", name: "Helper Admin" },
  };

  const handle = (e) => {
    e.preventDefault();
    const acc = ACCOUNTS[email];
    if (acc && acc.pass === pass) onLogin(acc);
    else setErr("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, position: "relative" }}>
      <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)", width: 500, height: 500, background: `radial-gradient(circle, ${theme.primary}20 0%, transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ width: "100%", maxWidth: 440, position: "relative" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: theme.primary, margin: "0 auto 20px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><img src="/the_owner_logo.png" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} /></div>
          <h1 style={{ fontFamily: theme.fontDisplay, fontSize: 36, letterSpacing: 3 }}>ADMIN LOGIN</h1>
          <p style={{ color: theme.muted, marginTop: 8, fontSize: 14 }}>The Owner Management System</p>
        </div>
        <Card>
          <form onSubmit={handle}>
            <Input label="อีเมล" value={email} onChange={setEmail} placeholder="admin@theowner.com" type="email" required />
            <Input label="รหัสผ่าน" value={pass} onChange={setPass} placeholder="••••••••" type="password" required />
            {err && <div style={{ color: "#EF4444", fontSize: 13, marginBottom: 16 }}>{err}</div>}
            <Btn type="submit" size="lg" fullWidth>เข้าสู่ระบบ Admin</Btn>
          </form>
          <InfoBox type="info" style={{ marginTop: 20 }}>
            <strong>Demo accounts:</strong><br />
            Super: admin@theowner.com / admin123<br />
            Helper: helper@theowner.com / helper123
          </InfoBox>
          <Btn variant="ghost" fullWidth onClick={onBack} style={{ marginTop: 8 }}>
            <Ic d={ICONS.arrowRight} size={14} style={{ transform: "rotate(180deg)" }} /> กลับหน้าหลัก
          </Btn>
        </Card>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// ADMIN DASHBOARD
// ─────────────────────────────────────────────
function AdminDashboard({ user, theme, setTheme, onLogout, onLanding }) {
  const [page, setPage] = useState("approvals");
  const [members, setMembers] = useState([]);

  useEffect(() => {
    fetch(GAS_URL + "?action=getMembers")
      .then(r => r.json())
      .then(res => {
        if (res.success) {
          const mapped = res.data.map((m, i) => ({
            id: i + 1,
            name: m.name,
            phone: m.phone,
            lineId: m.lineId,
            pkg: m.package,
            status: m.status,
            slip: null,
            registeredAt: m.registeredAt,
            expiresAt: m.expiresAt,
            checkedIn: m.checkedIn === "TRUE",
            fine: m.fine || 0
          }));
          setMembers(mapped);
        }
      })
      .catch(() => setMembers(MOCK_MEMBERS));
  }, []);
```

---

## บันทึกและ Push
```
git add .
git commit -m "approve reject connect line"
git push
  const [schedules, setSchedules] = useState([]);

useEffect(() => {
  fetch(GAS_URL + "?action=getSchedules")
    .then(r => r.json())
    .then(res => { if (res.success) setSchedules(res.data); })
    .catch(() => setSchedules(MOCK_SCHEDULES));
}, []);
  const [checkins, setCheckins] = useState(MOCK_CHECKINS);
  const [selected, setSelected] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showAddSched, setShowAddSched] = useState(false);
  const [newSched, setNewSched] = useState({ date: "", time: "", course: COURSES[0].name, mode: "online", seats: 20, zoomId: "", zoomPw: "" });
  const [copyMsg, setCopyMsg] = useState("");

  const pending = members.filter(m => m.status === "pending");

  const approve = async (id) => {
    const member = members.find(m => m.id === id);
    if (!member) return;
    try {
      const res = await fetch(GAS_URL, {
        method: "POST",
        body: JSON.stringify({
          action: "updateStatus",
          lineId: member.lineId,
          status: "approved"
        })
      });
      const result = await res.json();
      if (result.success) {
        setMembers(prev => prev.map(m => m.id === id ? { ...m, status: "approved" } : m));
        if (selected?.id === id) setSelected(s => ({ ...s, status: "approved" }));
        alert("✅ อนุมัติสำเร็จ! แจ้งสมาชิกผ่าน Line แล้ว");
      } else {
        alert("เกิดข้อผิดพลาด: " + result.message);
      }
    } catch (err) {
      alert("ไม่สามารถเชื่อมต่อได้");
    }
  };
  const reject = async (id) => {
    const member = members.find(m => m.id === id);
    if (!member) return;
    try {
      const res = await fetch(GAS_URL, {
        method: "POST",
        body: JSON.stringify({
          action: "updateStatus",
          lineId: member.lineId,
          status: "rejected"
        })
      });
      const result = await res.json();
      if (result.success) {
        setMembers(prev => prev.map(m => m.id === id ? { ...m, status: "rejected" } : m));
        if (selected?.id === id) setSelected(s => ({ ...s, status: "rejected" }));
        alert("❌ ปฏิเสธแล้ว แจ้งสมาชิกผ่าน Line แล้ว");
      } else {
        alert("เกิดข้อผิดพลาด: " + result.message);
      }
    } catch (err) {
      alert("ไม่สามารถเชื่อมต่อได้");
    }
  };

  const copyText = (text) => {
    navigator.clipboard.writeText(text).then(() => { setCopyMsg("คัดลอกแล้ว!"); setTimeout(() => setCopyMsg(""), 2000); });
  };

  const navItems = [
    { id: "approvals", label: `อนุมัติสมาชิก${pending.length ? ` (${pending.length})` : ""}`, icon: ICONS.check, roles: ["super_admin", "helper"] },
    { id: "members", label: "รายชื่อสมาชิก", icon: ICONS.users, roles: ["super_admin", "helper"] },
    { id: "checkin", label: "Check-in & QR", icon: ICONS.qr, roles: ["super_admin", "helper"] },
    { id: "schedule", label: "จัดการตารางเรียน", icon: ICONS.calendar, roles: ["super_admin", "helper"] },
    { id: "zoom", label: "ตั้งค่า Zoom", icon: ICONS.zoom, roles: ["super_admin"] },
    { id: "integration", label: "การเชื่อมต่อระบบ", icon: ICONS.link, roles: ["super_admin"] },
    { id: "theme", label: "ปรับธีม", icon: ICONS.settings, roles: ["super_admin"] },
    { id: "admins", label: "จัดการ Admin", icon: ICONS.shield, roles: ["super_admin"] },
  ].filter(n => n.roles.includes(user.role));

  const stats = [
    { label: "สมาชิกทั้งหมด", value: members.length, color: "#3B82F6" },
    { label: "อนุมัติแล้ว", value: members.filter(m => m.status === "approved").length, color: "#10B981" },
    { label: "รออนุมัติ", value: pending.length, color: "#F59E0B" },
    { label: "ปฏิเสธ", value: members.filter(m => m.status === "rejected").length, color: "#EF4444" },
  ];

  const inputStyle = { width: "100%", background: "rgba(255,255,255,0.05)", border: `1px solid ${theme.border}`, borderRadius: 10, padding: "10px 14px", color: theme.text, fontSize: 14, outline: "none", fontFamily: theme.fontBody };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* SIDEBAR */}
      <aside style={{ width: 260, background: theme.card, borderRight: `1px solid ${theme.border}`, position: "fixed", top: 0, bottom: 0, left: 0, display: "flex", flexDirection: "column", zIndex: 50, transition: "transform 0.3s", overflowY: "auto" }}>
        {/* Logo */}
        <div style={{ padding: "20px 20px 16px", borderBottom: `1px solid ${theme.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: "50%", background: theme.primary, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><img src="/the_owner_logo.png" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} /></div>
            <div>
              <div style={{ fontFamily: theme.fontDisplay, fontSize: 16, letterSpacing: 2 }}>THE OWNER</div>
              <div style={{ fontSize: 11, color: theme.muted }}>Admin Panel</div>
            </div>
          </div>
        </div>

        {/* Stats mini */}
        <div style={{ padding: "12px 16px", borderBottom: `1px solid ${theme.border}` }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {stats.map(s => (
              <div key={s.label} style={{ background: theme.bg, borderRadius: 10, padding: "10px 12px" }}>
                <div style={{ fontFamily: theme.fontDisplay, fontSize: 22, color: s.color, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 10, color: theme.muted, marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: 12 }}>
          {navItems.map(n => (
            <button key={n.id} onClick={() => setPage(n.id)}
              style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", border: "none", cursor: "pointer", padding: "12px 14px", borderRadius: 12, marginBottom: 2, transition: "all 0.15s", background: page === n.id ? theme.primary + "22" : "transparent", color: page === n.id ? theme.primary : theme.muted, fontWeight: page === n.id ? 700 : 400, fontSize: 13, fontFamily: theme.fontBody, textAlign: "left" }}>
              <Ic d={n.icon} size={17} /> {n.label}
            </button>
          ))}
        </nav>

        {/* Bottom */}
        <div style={{ padding: 12, borderTop: `1px solid ${theme.border}` }}>
          <div style={{ fontSize: 12, color: theme.muted, padding: "8px 14px", marginBottom: 4 }}>
            {user.name} · <span style={{ color: user.role === "super_admin" ? theme.accent : "#F59E0B" }}>{user.role === "super_admin" ? "Super Admin" : "Helper"}</span>
          </div>
          <button onClick={onLanding} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", border: "none", cursor: "pointer", padding: "10px 14px", borderRadius: 10, background: "transparent", color: theme.muted, fontSize: 13, fontFamily: theme.fontBody, marginBottom: 4 }}>
            <Ic d={ICONS.link} size={15} /> Landing Page
          </button>
          <button onClick={onLogout} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", border: "none", cursor: "pointer", padding: "10px 14px", borderRadius: 10, background: "transparent", color: "#EF4444", fontSize: 13, fontFamily: theme.fontBody }}>
            <Ic d={ICONS.logout} size={15} /> ออกจากระบบ
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main style={{ marginLeft: 260, flex: 1, minHeight: "100vh", background: theme.bg, color: theme.text }}>
        <div style={{ padding: "32px 32px 80px" }}>

          {/* ── APPROVALS ── */}
          {page === "approvals" && (
            <>
              <div style={{ marginBottom: 32 }}>
                <h1 style={{ fontFamily: theme.fontDisplay, fontSize: 40, letterSpacing: 2, marginBottom: 4 }}>APPROVE <span style={{ color: theme.primary }}>สมาชิก</span></h1>
                <p style={{ color: theme.muted }}>ตรวจสอบสลิปและอนุมัติการสมัครสมาชิก — ระบบจะแจ้งผ่าน Line OA อัตโนมัติ</p>
              </div>
              <InfoBox type="info">เมื่อกด <strong>อนุมัติ</strong> ระบบจะส่งข้อความยืนยัน + ข้อมูลสมาชิกผ่าน Line OA ให้สมาชิกโดยอัตโนมัติ</InfoBox>

              {pending.length === 0 ? (
                <Card style={{ textAlign: "center", padding: 64 }}>
                  <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
                  <h3 style={{ fontSize: 22, fontWeight: 700 }}>ไม่มีรายการรออนุมัติ</h3>
                  <p style={{ color: theme.muted, marginTop: 8 }}>สมาชิกทุกคนได้รับการดำเนินการแล้ว</p>
                </Card>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 1fr" : "1fr", gap: 24, alignItems: "start" }}>
                  {/* List panel */}
                  <div>
                    <h3 style={{ fontWeight: 700, marginBottom: 16, color: theme.muted, fontSize: 13, textTransform: "uppercase", letterSpacing: 1 }}>รายการรอตรวจสอบ ({pending.length})</h3>
                    {pending.map(m => (
                      <div key={m.id}
                        onClick={() => setSelected(selected?.id === m.id ? null : m)}
                        style={{ background: theme.card, border: `1px solid ${selected?.id === m.id ? theme.primary : theme.border}`, borderRadius: 16, padding: 20, marginBottom: 12, cursor: "pointer", transition: "all 0.2s" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 4 }}>{m.name}</div>
                            <div style={{ color: theme.muted, fontSize: 13 }}>{m.phone} · Line: {m.lineId}</div>
                          </div>
                          <StatusBadge status={m.pkg} />
                        </div>
                        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                          <div style={{ fontSize: 12, color: theme.muted, flex: 1 }}>สมัครเมื่อ: {m.registeredAt}</div>
                          <Btn size="sm" variant="success" onClick={e => { e.stopPropagation(); approve(m.id); }}>✓ อนุมัติ</Btn>
                          <Btn size="sm" variant="danger" onClick={e => { e.stopPropagation(); reject(m.id); }}>✗ ปฏิเสธ</Btn>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Detail panel */}
                  {selected && (
                    <div style={{ position: "sticky", top: 24 }}>
                      <Card glow>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                          <h3 style={{ fontWeight: 700, fontSize: 18 }}>รายละเอียด</h3>
                          <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: theme.muted, cursor: "pointer" }}><Ic d={ICONS.x} size={20} /></button>
                        </div>

                        {/* Member info */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                          {[["ชื่อ-นามสกุล", selected.name], ["เบอร์โทร", selected.phone], ["Line ID", selected.lineId], ["แพ็กเกจ", selected.pkg === "trial" ? "Trial (150฿)" : "Quarter (600฿)"]].map(([k, v]) => (
                            <div key={k} style={{ background: theme.bg, borderRadius: 12, padding: 14 }}>
                              <div style={{ fontSize: 11, color: theme.muted, marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>{k}</div>
                              <div style={{ fontWeight: 700 }}>{v}</div>
                            </div>
                          ))}
                        </div>

                        {/* Slip preview area */}
                        <div style={{ background: theme.bg, borderRadius: 16, height: 260, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", marginBottom: 20, border: `2px dashed ${theme.border}`, gap: 12 }}>
                          <Ic d={ICONS.eye} size={40} color={theme.muted} />
                          <div style={{ color: theme.muted, fontSize: 14, textAlign: "center" }}>
                            <div style={{ fontWeight: 600, marginBottom: 4 }}>สลิปโอนเงิน</div>
                            <div style={{ fontSize: 12 }}>{selected.slip || "ไม่มีไฟล์แนบ"}</div>
                            <div style={{ fontSize: 11, marginTop: 8, color: theme.border }}>ในระบบจริง รูปสลิปจะแสดงที่นี่จาก Firebase Storage</div>
                          </div>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                          <Btn size="md" variant="success" fullWidth onClick={() => approve(selected.id)}>
                            <Ic d={ICONS.check} size={18} /> อนุมัติ & แจ้ง Line
                          </Btn>
                          <Btn size="md" variant="danger" fullWidth onClick={() => reject(selected.id)}>
                            <Ic d={ICONS.x} size={18} /> ปฏิเสธ & แจ้ง Line
                          </Btn>
                        </div>
                      </Card>
                    </div>
                  )}
                </div>
              )}

              {/* Processed members */}
              {members.filter(m => m.status !== "pending").length > 0 && (
                <>
                  <h3 style={{ fontWeight: 700, marginTop: 40, marginBottom: 16, color: theme.muted, fontSize: 13, textTransform: "uppercase", letterSpacing: 1 }}>ดำเนินการแล้ว</h3>
                  <div style={{ display: "grid", gap: 10 }}>
                    {members.filter(m => m.status !== "pending").map(m => (
                      <Card key={m.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px" }}>
                        <div>
                          <span style={{ fontWeight: 700 }}>{m.name}</span>
                          <span style={{ color: theme.muted, fontSize: 13, marginLeft: 12 }}>{m.phone}</span>
                        </div>
                        <div style={{ display: "flex", gap: 8 }}>
                          <StatusBadge status={m.pkg} />
                          <StatusBadge status={m.status} />
                        </div>
                      </Card>
                    ))}
                  </div>
                </>
              )}
            </>
          )}

          {/* ── MEMBERS ── */}
          {page === "members" && (
            <>
              <div style={{ marginBottom: 32 }}>
                <h1 style={{ fontFamily: theme.fontDisplay, fontSize: 40, letterSpacing: 2, marginBottom: 4 }}>รายชื่อ<span style={{ color: theme.primary }}>สมาชิก</span></h1>
                <p style={{ color: theme.muted }}>จัดการและตรวจสอบสมาชิกทั้งหมด</p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
                {stats.map(s => (
                  <Card key={s.label} style={{ textAlign: "center", padding: 20 }}>
                    <div style={{ fontFamily: theme.fontDisplay, fontSize: 40, color: s.color }}>{s.value}</div>
                    <div style={{ fontSize: 12, color: theme.muted, marginTop: 4 }}>{s.label}</div>
                  </Card>
                ))}
              </div>
              <Card style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 6px", minWidth: 800 }}>
                  <thead>
                    <tr style={{ color: theme.muted, fontSize: 12, textTransform: "uppercase", letterSpacing: 1 }}>
                      {["ชื่อ", "เบอร์", "Line ID", "แพ็กเกจ", "สถานะ", "หมดอายุ", "Check-in", "จัดการ"].map(h => (
                        <th key={h} style={{ textAlign: "left", padding: "8px 14px", fontWeight: 600 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {members.map(m => (
                      <tr key={m.id}>
                        {[
                          <td key="n" style={{ padding: "14px", background: theme.surface, borderRadius: "10px 0 0 10px", fontWeight: 700 }}>{m.name}</td>,
                          <td key="p" style={{ padding: "14px", background: theme.surface, color: theme.muted, fontSize: 13 }}>{m.phone}</td>,
                          <td key="l" style={{ padding: "14px", background: theme.surface, fontSize: 12, color: theme.muted }}>{m.lineId}</td>,
                          <td key="pkg" style={{ padding: "14px", background: theme.surface }}><StatusBadge status={m.pkg} /></td>,
                          <td key="s" style={{ padding: "14px", background: theme.surface }}><StatusBadge status={m.status} /></td>,
                          <td key="e" style={{ padding: "14px", background: theme.surface, color: theme.muted, fontSize: 13 }}>{m.expiresAt || "—"}</td>,
                          <td key="c" style={{ padding: "14px", background: theme.surface }}>
                            {m.checkedIn ? <Tag color={theme.accent}>✓ Check-in แล้ว</Tag> : <Tag color="#6B7280">ยังไม่ Check-in</Tag>}
                          </td>,
                          <td key="a" style={{ padding: "14px", background: theme.surface, borderRadius: "0 10px 10px 0" }}>
                            {m.status === "pending" && (
                              <div style={{ display: "flex", gap: 6 }}>
                                <Btn size="sm" variant="success" onClick={() => approve(m.id)}>อนุมัติ</Btn>
                                <Btn size="sm" variant="danger" onClick={() => reject(m.id)}>ปฏิเสธ</Btn>
                              </div>
                            )}
                            {m.fine > 0 && <Tag color="#EF4444">ค่าปรับ {m.fine}฿</Tag>}
                          </td>,
                        ]}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            </>
          )}

          {/* ── CHECK-IN & QR ── */}
          {page === "checkin" && (
            <>
              <div style={{ marginBottom: 32 }}>
                <h1 style={{ fontFamily: theme.fontDisplay, fontSize: 40, letterSpacing: 2, marginBottom: 4 }}>Check-in <span style={{ color: theme.primary }}>& QR Code</span></h1>
                <p style={{ color: theme.muted }}>จัดการการ Check-in ล่วงหน้าและฉุกเฉิน</p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 32 }}>
                {/* QR Scan Simulation */}
                <Card>
                  <h3 style={{ fontWeight: 700, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                    <Ic d={ICONS.qr} size={20} /> QR Check-in ฉุกเฉิน
                  </h3>
                  <InfoBox type="warning">Check-in ฉุกเฉินผ่าน QR Code หน้าห้อง มีค่าปรับ 100 ฿ โดยอัตโนมัติ</InfoBox>

                  {/* Fake QR Code display */}
                  <div style={{ background: "#fff", borderRadius: 16, padding: 24, textAlign: "center", marginBottom: 16 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 3, width: 140, margin: "0 auto", aspectRatio: "1" }}>
                      {Array.from({ length: 49 }).map((_, i) => (
                        <div key={i} style={{ background: Math.random() > 0.4 ? "#000" : "#fff", borderRadius: 1, aspectRatio: "1" }} />
                      ))}
                    </div>
                    <div style={{ color: "#000", fontSize: 12, marginTop: 12, fontWeight: 700 }}>QR CHECK-IN EMERGENCY</div>
                    <div style={{ color: "#666", fontSize: 11 }}>The Owner — สแกนเพื่อ Check-in</div>
                  </div>

                  <Btn fullWidth variant="ghost"><Ic d={ICONS.copy} size={16} /> คัดลอก URL Check-in</Btn>
                </Card>

                {/* Pre check-in list */}
                <Card>
                  <h3 style={{ fontWeight: 700, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                    <Ic d={ICONS.check} size={20} /> ลงทะเบียนล่วงหน้า
                  </h3>
                  <InfoBox type="success">สมาชิกที่ลงทะเบียนล่วงหน้าจะได้รับ Zoom Link ผ่าน Line OA อัตโนมัติ</InfoBox>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {MOCK_CHECKINS.map(c => (
                      <div key={c.id} style={{ background: theme.bg, borderRadius: 12, padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 14 }}>{c.memberName}</div>
                          <div style={{ color: theme.muted, fontSize: 12 }}>{c.course} · {c.date}</div>
                        </div>
                        <div style={{ display: "flex", gap: 6 }}>
                          <StatusBadge status={c.type} />
                          {c.fine > 0 && <Tag color="#EF4444">+{c.fine}฿</Tag>}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Check-in Rules */}
              <Card>
                <h3 style={{ fontWeight: 700, marginBottom: 16 }}>กฎการ Check-in</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                  {[
                    { title: "Check-in ล่วงหน้า (ปกติ)", items: ["ลงทะเบียนผ่าน Landing Page หรือ Line OA", "ระบบเช็คสิทธิ์จาก Line User ID", "Zoom Link ส่งอัตโนมัติผ่าน Line OA", "ไม่มีค่าปรับ"], color: theme.accent },
                    { title: "Check-in ฉุกเฉิน (QR หน้าห้อง)", items: ["สแกน QR Code หน้าห้องเรียน", "Admin ยืนยันสิทธิ์", "มีค่าปรับ 100 ฿", "ข้อมูลบันทึกใน Google Sheet"], color: "#EF4444" },
                  ].map(s => (
                    <div key={s.title} style={{ background: theme.bg, borderRadius: 14, padding: 20, borderLeft: `4px solid ${s.color}` }}>
                      <h4 style={{ fontWeight: 700, marginBottom: 12, color: s.color }}>{s.title}</h4>
                      <ul style={{ listStyle: "none" }}>
                        {s.items.map(i => (
                          <li key={i} style={{ display: "flex", gap: 8, padding: "5px 0", fontSize: 14, color: theme.muted }}>
                            <span style={{ color: s.color }}>•</span> {i}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </Card>
            </>
          )}

          {/* ── SCHEDULE ── */}
          {page === "schedule" && (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
                <div>
                  <h1 style={{ fontFamily: theme.fontDisplay, fontSize: 40, letterSpacing: 2, marginBottom: 4 }}>จัดการ<span style={{ color: theme.primary }}>ตารางเรียน</span></h1>
                  <p style={{ color: theme.muted }}>ประมาณ 6 คอร์สต่อเดือน · ซิงค์กับ Google Sheet อัตโนมัติ</p>
                </div>
                <Btn onClick={() => setShowAddSched(!showAddSched)}>
                  <Ic d={ICONS.plus} size={18} /> เพิ่มตารางเรียน
                </Btn>
              </div>

              {showAddSched && (
                <Card style={{ marginBottom: 24, border: `1px solid ${theme.primary}40` }}>
                  <h3 style={{ fontWeight: 700, marginBottom: 20 }}>เพิ่มตารางเรียนใหม่</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
                    {[
                      { label: "วันที่", el: <input type="date" style={inputStyle} value={newSched.date} onChange={e => setNewSched({ ...newSched, date: e.target.value })} /> },
                      { label: "เวลา", el: <input style={inputStyle} placeholder="09:00–12:00" value={newSched.time} onChange={e => setNewSched({ ...newSched, time: e.target.value })} /> },
                      { label: "คอร์ส", el: <select style={inputStyle} value={newSched.course} onChange={e => setNewSched({ ...newSched, course: e.target.value })}>{COURSES.map(c => <option key={c.id}>{c.name}</option>)}</select> },
                      { label: "รูปแบบ", el: <select style={inputStyle} value={newSched.mode} onChange={e => setNewSched({ ...newSched, mode: e.target.value })}><option value="online">Online</option><option value="onsite">Onsite</option></select> },
                      { label: "จำนวนที่นั่ง", el: <input type="number" style={inputStyle} value={newSched.seats} onChange={e => setNewSched({ ...newSched, seats: +e.target.value })} /> },
                    ].map(({ label, el }) => (
                      <div key={label}>
                        <label style={{ display: "block", fontSize: 12, color: theme.muted, marginBottom: 6, fontWeight: 600 }}>{label}</label>
                        {el}
                      </div>
                    ))}
                  </div>
                  {newSched.mode === "online" && (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
                      {[["Zoom Meeting ID", "zoomId", "123-456-789"], ["Zoom Password", "zoomPw", "••••••••"]].map(([label, key, ph]) => (
                        <div key={key}>
                          <label style={{ display: "block", fontSize: 12, color: theme.muted, marginBottom: 6, fontWeight: 600 }}>{label}</label>
                          <input style={inputStyle} placeholder={ph} value={newSched[key]} onChange={e => setNewSched({ ...newSched, [key]: e.target.value })} />
                        </div>
                      ))}
                    </div>
                  )}
                  <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
                    <Btn onClick={() => { setSchedules([...schedules, { ...newSched, id: Date.now(), taken: 0 }]); setShowAddSched(false); setNewSched({ date: "", time: "", course: COURSES[0].name, mode: "online", seats: 20, zoomId: "", zoomPw: "" }); }}>บันทึก</Btn>
                    <Btn variant="ghost" onClick={() => setShowAddSched(false)}>ยกเลิก</Btn>
                  </div>
                </Card>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {schedules.map(s => (
                  <Card key={s.id} style={{ display: "grid", gridTemplateColumns: "110px 90px 1fr auto auto auto auto", alignItems: "center", gap: 16, padding: "16px 20px" }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15 }}>{s.date?.split("-").slice(1).join("/")}</div>
                      <div style={{ fontSize: 12, color: theme.muted }}>{s.time}</div>
                    </div>
                    <StatusBadge status={s.mode} />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{s.course}</div>
                      {s.zoomId && <div style={{ fontSize: 12, color: theme.muted, marginTop: 2 }}>Zoom: {s.zoomId}</div>}
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontWeight: 700 }}>{s.taken}/{s.seats}</div>
                      <div style={{ fontSize: 11, color: theme.muted }}>ที่นั่ง</div>
                    </div>
                    <div style={{ width: 60, height: 4, background: "rgba(255,255,255,0.1)", borderRadius: 2, overflow: "hidden" }}>
                      <div style={{ width: `${(s.taken / s.seats) * 100}%`, height: "100%", background: s.taken / s.seats > 0.8 ? "#EF4444" : theme.accent }} />
                    </div>
                    {s.zoomId && (
                      <button onClick={() => copyText(s.zoomId)} style={{ background: "rgba(59,130,246,0.15)", border: "none", color: "#3B82F6", padding: "6px 12px", borderRadius: 8, cursor: "pointer", fontSize: 12, fontFamily: theme.fontBody }}>
                        <Ic d={ICONS.copy} size={13} />
                      </button>
                    )}
                    <button onClick={() => setSchedules(schedules.filter(x => x.id !== s.id))}
                      style={{ background: "rgba(239,68,68,0.15)", border: "none", color: "#EF4444", padding: "6px 10px", borderRadius: 8, cursor: "pointer" }}>
                      <Ic d={ICONS.trash} size={15} />
                    </button>
                  </Card>
                ))}
              </div>

              {copyMsg && (
                <div style={{ position: "fixed", bottom: 32, right: 32, background: theme.accent, color: "#000", padding: "12px 24px", borderRadius: 12, fontWeight: 700, zIndex: 200 }}>
                  ✓ {copyMsg}
                </div>
              )}
            </>
          )}

          {/* ── ZOOM SETUP ── */}
          {page === "zoom" && (
            <>
              <div style={{ marginBottom: 32 }}>
                <h1 style={{ fontFamily: theme.fontDisplay, fontSize: 40, letterSpacing: 2, marginBottom: 4 }}>ตั้งค่า <span style={{ color: theme.primary }}>Zoom</span></h1>
                <p style={{ color: theme.muted }}>คู่มือการตั้งค่า Zoom สำหรับสมาชิกที่ไม่ถนัดเทคโนโลยี</p>
              </div>
              <div style={{ display: "grid", gap: 20 }}>
                {[
                  {
                    title: "1. ตั้งค่า Zoom Meeting ที่แนะนำ", type: "info",
                    items: [
                      "✅ เปิด 'Waiting Room' — Admin ยืนยัน Line ID ก่อนอนุมัติเข้าห้อง",
                      "✅ ตั้ง 'Host before participants' เพื่อป้องกันเข้าก่อน",
                      "✅ ใช้ Meeting Password ทุกครั้ง (ส่งผ่าน Line OA เท่านั้น)",
                      "✅ Record Session เพื่อให้สมาชิกที่พลาดได้ดูย้อนหลัง",
                      "✅ เปิด 'Authenticate users' สำหรับ Quarter members",
                    ]
                  },
                  {
                    title: "2. ขั้นตอน Admin ก่อนเริ่ม Class", type: "warning",
                    items: [
                      "เช็ค Google Sheet รายชื่อสมาชิกที่ลงทะเบียน",
                      "เปิด Zoom Waiting Room ตรวจสอบชื่อกับ Line ID",
                      "อนุมัติเฉพาะผู้ที่สมัครสมาชิกและ Check-in แล้ว",
                      "บันทึกผู้เข้าร่วมจาก Zoom Report ลง Google Sheet หลังจบ class",
                    ]
                  },
                  {
                    title: "3. วิธีส่ง Zoom Link ให้สมาชิก", type: "success",
                    items: [
                      "ระบบส่งอัตโนมัติผ่าน Line OA เมื่อสมาชิก Check-in ล่วงหน้า",
                      "รูปแบบข้อความ: 'คอร์ส [ชื่อ] วันที่ [วัน] Meeting ID: [ID] Password: [PW]'",
                      "ส่งก่อนเรียน 24 ชม. และ 1 ชม. ล่วงหน้า (แจ้งเตือน 2 ครั้ง)",
                      "มีปุ่ม 'Join Zoom' ใน Line OA แบบ Deep Link เพื่อเปิดง่าย",
                    ]
                  },
                ].map(s => (
                  <Card key={s.title}>
                    <h3 style={{ fontWeight: 700, marginBottom: 16 }}>{s.title}</h3>
                    <ul style={{ listStyle: "none" }}>
                      {s.items.map(item => (
                        <li key={item} style={{ display: "flex", gap: 10, padding: "7px 0", fontSize: 14, color: theme.muted, borderBottom: `1px solid ${theme.border}` }}>
                          <span style={{ flexShrink: 0, marginTop: 2 }}>→</span> {item}
                        </li>
                      ))}
                    </ul>
                  </Card>
                ))}

                <Card style={{ border: `1px solid ${theme.primary}40` }}>
                  <h3 style={{ fontWeight: 700, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                    <Ic d={ICONS.zoom} size={20} color={theme.primary} /> Zoom Meeting Settings ปัจจุบัน
                  </h3>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
                    {[["Default Meeting ID", "xxx-xxx-xxxx"], ["Password Template", "owner + หมายเลขคอร์ส"], ["Waiting Room", "เปิดอยู่ ✅"], ["Record Auto", "เปิดอยู่ ✅"]].map(([k, v]) => (
                      <div key={k} style={{ background: theme.bg, borderRadius: 12, padding: 14 }}>
                        <div style={{ fontSize: 11, color: theme.muted, marginBottom: 4 }}>{k}</div>
                        <div style={{ fontWeight: 700, fontSize: 14 }}>{v}</div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </>
          )}

          {/* ── INTEGRATION GUIDE ── */}
          {page === "integration" && (
            <>
              <div style={{ marginBottom: 32 }}>
                <h1 style={{ fontFamily: theme.fontDisplay, fontSize: 40, letterSpacing: 2, marginBottom: 4 }}>การ<span style={{ color: theme.primary }}>เชื่อมต่อระบบ</span></h1>
                <p style={{ color: theme.muted }}>คู่มือ Setup ระบบฟรีทั้งหมด: Google Sheet + Apps Script + Firebase + Line OA</p>
              </div>
              <InfoBox type="warning">Line OA ที่ใช้งานจริงอยู่: ให้เพิ่ม Rich Menu ใหม่ โดยไม่ลบของเดิม และทดสอบใน Test Group ก่อน</InfoBox>

              <div style={{ display: "grid", gap: 20 }}>
                {[
                  {
                    step: "01", title: "Google Sheet Setup", color: "#10B981",
                    steps: [
                      "สร้าง Google Sheet ชื่อ 'TheOwner-Members' พร้อม Sheets: Members, Schedules, Checkins, Payments",
                      "Sheet 'Members': columns = lineId, name, phone, email, package, status, registeredAt, expiresAt, checkedIn, fine",
                      "Sheet 'Schedules': columns = id, date, time, course, mode, seats, taken, zoomId, zoomPw",
                      "Sheet 'Checkins': columns = memberId, scheduleId, type (pre/emergency), fine, timestamp",
                      "เปิด Sharing ให้ Google Apps Script เข้าถึงได้",
                    ]
                  },
                  {
                    step: "02", title: "Google Apps Script (Backend)", color: "#F59E0B",
                    steps: [
                      "เปิด Extensions > Apps Script ใน Google Sheet",
                      "สร้าง Web App endpoint ที่รับ POST request จาก Landing Page",
                      "เขียนฟังก์ชัน: addMember(), approveMember(), getSchedules(), addCheckin()",
                      "ใช้ UrlFetchApp.fetch() เพื่อส่งข้อความไปยัง Line Messaging API",
                      "Deploy as Web App > Execute as 'Me' > Anyone can access",
                      "คัดลอก Web App URL ไปใส่ใน Landing Page config",
                    ]
                  },
                  {
                    step: "03", title: "Firebase (Slip Storage + Auth)", color: "#FF6B35",
                    steps: [
                      "สร้าง Firebase Project ฟรี (Spark Plan: 1GB Storage, 50K reads/day)",
                      "เปิด Firebase Storage สำหรับเก็บรูปสลิป",
                      "เปิด Firestore Database สำหรับ realtime sync",
                      "ตั้ง Security Rules ให้เฉพาะ Admin เข้าถึง Slip ได้",
                      "ใส่ Firebase SDK ใน Landing Page เพื่อ upload รูปสลิป",
                      "Admin Dashboard ดึงข้อมูลจาก Firestore แบบ realtime",
                    ]
                  },
                  {
                    step: "04", title: "Line OA & LIFF Setup", color: "#06C755",
                    steps: [
                      "สร้าง LIFF App ใหม่ใน Line Developer Console (ไม่กระทบ OA เดิม)",
                      "LIFF URL ชี้ไปที่ Landing Page / Check-in Page",
                      "เพิ่ม Rich Menu ใหม่: ปุ่ม 'สมัครสมาชิก', 'ตารางเรียน', 'Check-in', 'ติดต่อ Admin'",
                      "ใช้ Messaging API Webhook รับข้อมูลสลิปที่สมาชิกส่งใน Line OA",
                      "ตั้ง Webhook URL = Google Apps Script Web App URL",
                      "ทดสอบใน Line Test Group ก่อน publish Rich Menu",
                    ]
                  },
                  {
                    step: "05", title: "Line Messaging Templates", color: "#3B82F6",
                    steps: [
                      "✅ อนุมัติ: 'ยินดีต้อนรับ [ชื่อ]! แพ็กเกจ [Quarter/Trial] เริ่มต้นแล้ว หมดอายุ [วัน]'",
                      "❌ ปฏิเสธ: 'ขออภัย ไม่สามารถยืนยันการชำระเงินได้ กรุณาติดต่อ Admin'",
                      "📅 Zoom: 'คอร์ส [ชื่อ] วันที่ [วัน] เวลา [เวลา] | Meeting ID: [ID] | Password: [PW] | [Join Link]'",
                      "⏰ Reminder: ส่งก่อนเรียน 24 ชม. และ 1 ชม. อัตโนมัติผ่าน Cron trigger ใน Apps Script",
                      "⚠️ ฉุกเฉิน: 'Check-in ฉุกเฉิน — มีค่าปรับ 100฿ จะถูกหักจากครั้งต่อไป'",
                    ]
                  },
                ].map(s => (
                  <Card key={s.step} style={{ borderLeft: `4px solid ${s.color}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                      <div style={{ background: s.color + "22", color: s.color, fontFamily: theme.fontDisplay, fontSize: 28, letterSpacing: 1, width: 50, height: 50, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{s.step}</div>
                      <h3 style={{ fontWeight: 700, fontSize: 18 }}>{s.title}</h3>
                    </div>
                    <ol style={{ listStyle: "none", paddingLeft: 0 }}>
                      {s.steps.map((item, i) => (
                        <li key={i} style={{ display: "flex", gap: 12, padding: "8px 0", fontSize: 14, color: theme.muted, borderBottom: `1px solid ${theme.border}` }}>
                          <span style={{ color: s.color, fontWeight: 700, flexShrink: 0, fontSize: 12, minWidth: 20 }}>{i + 1}.</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ol>
                  </Card>
                ))}
              </div>
            </>
          )}

          {/* ── THEME ── */}
          {page === "theme" && user.role === "super_admin" && (
            <>
              <div style={{ marginBottom: 32 }}>
                <h1 style={{ fontFamily: theme.fontDisplay, fontSize: 40, letterSpacing: 2, marginBottom: 4 }}>ปรับแต่ง<span style={{ color: theme.primary }}>ธีม</span></h1>
                <p style={{ color: theme.muted }}>ปรับสี ฟอนต์ และรูปลักษณ์ของ Landing Page & Admin</p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 24, alignItems: "start" }}>
                <div>
                  <Card style={{ marginBottom: 20 }}>
                    <h3 style={{ fontWeight: 700, marginBottom: 20 }}>🎨 สี</h3>
                    {[["สีหลัก (Primary)", "primary"], ["สีเน้น (Accent)", "accent"], ["พื้นหลัง", "bg"], ["Card Background", "card"]].map(([label, key]) => (
                      <div key={key} style={{ marginBottom: 16 }}>
                        <label style={{ fontSize: 13, color: theme.muted, display: "block", marginBottom: 8, fontWeight: 600 }}>{label}</label>
                        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                          <input type="color" value={theme[key]} onChange={e => setTheme({ ...theme, [key]: e.target.value })}
                            style={{ width: 44, height: 40, border: "none", borderRadius: 8, cursor: "pointer", background: "none", padding: 0 }} />
                          <input value={theme[key]} onChange={e => setTheme({ ...theme, [key]: e.target.value })}
                            style={{ ...inputStyle, flex: 1, fontFamily: "monospace", fontSize: 13 }} />
                        </div>
                      </div>
                    ))}
                  </Card>
                  <Card>
                    <h3 style={{ fontWeight: 700, marginBottom: 20 }}>📐 ขนาดฟอนต์</h3>
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                      <input type="range" min={13} max={20} value={theme.fontSize} onChange={e => setTheme({ ...theme, fontSize: +e.target.value })} style={{ flex: 1 }} />
                      <span style={{ fontFamily: theme.fontDisplay, fontSize: 28, color: theme.primary, minWidth: 60, textAlign: "right" }}>{theme.fontSize}px</span>
                    </div>
                    <p style={{ marginTop: 12, fontSize: theme.fontSize, color: theme.muted }}>ตัวอย่างข้อความขนาดปัจจุบัน: The Owner i am because we are</p>
                  </Card>
                </div>

                {/* Preview */}
                <div style={{ position: "sticky", top: 24 }}>
                  <Card>
                    <h3 style={{ fontWeight: 700, marginBottom: 16 }}>ตัวอย่าง</h3>
                    <div style={{ background: theme.bg, borderRadius: 16, padding: 24, marginBottom: 16 }}>
                      <div style={{ width: 60, height: 60, borderRadius: "50%", background: theme.primary, margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.fontDisplay, fontSize: 20, color: "#fff", boxShadow: `0 0 40px ${theme.primary}55` }}>TO</div>
                      <div style={{ fontFamily: theme.fontDisplay, fontSize: 40, textAlign: "center", letterSpacing: 3, marginBottom: 4 }}>
                        THE <span style={{ color: theme.primary }}>OWNER</span>
                      </div>
                      <p style={{ color: theme.muted, textAlign: "center", fontSize: 13, marginBottom: 20 }}>i am because we are</p>
                      <div style={{ display: "flex", gap: 8 }}>
                        <div style={{ flex: 1, background: theme.primary, borderRadius: 10, padding: "10px", textAlign: "center", color: "#fff", fontWeight: 700, fontSize: 13 }}>สมัครเลย</div>
                        <div style={{ flex: 1, background: theme.accent, borderRadius: 10, padding: "10px", textAlign: "center", color: "#000", fontWeight: 700, fontSize: 13 }}>ดูคอร์ส</div>
                      </div>
                    </div>
                    <Btn variant="ghost" fullWidth onClick={() => setTheme(DEFAULT_THEME)}>🔄 รีเซ็ตเป็นค่าเริ่มต้น</Btn>
                  </Card>
                </div>
              </div>
            </>
          )}

          {/* ── ADMINS ── */}
          {page === "admins" && user.role === "super_admin" && (
            <>
              <div style={{ marginBottom: 32 }}>
                <h1 style={{ fontFamily: theme.fontDisplay, fontSize: 40, letterSpacing: 2, marginBottom: 4 }}>จัดการ<span style={{ color: theme.primary }}>Admin</span></h1>
                <p style={{ color: theme.muted }}>กำหนดสิทธิ์ผู้ดูแลระบบ</p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 32 }}>
                {[
                  { role: "Super Admin", color: theme.primary, perms: ["อนุมัติ/ปฏิเสธสมาชิก", "จัดการตารางเรียน", "Check-in ฉุกเฉิน", "ปรับธีม Landing Page", "จัดการ Admin อื่นๆ", "ดู Integration Guide", "ตั้งค่า Zoom"] },
                  { role: "Helper", color: "#F59E0B", perms: ["อนุมัติ/ปฏิเสธสมาชิก", "จัดการตารางเรียน", "Check-in ฉุกเฉิน", "ดูรายชื่อสมาชิก"] },
                ].map(r => (
                  <Card key={r.role} style={{ borderTop: `4px solid ${r.color}` }}>
                    <h3 style={{ fontWeight: 700, marginBottom: 16, color: r.color }}>{r.role}</h3>
                    <ul style={{ listStyle: "none" }}>
                      {r.perms.map(p => (
                        <li key={p} style={{ display: "flex", gap: 8, padding: "7px 0", fontSize: 14, borderBottom: `1px solid ${theme.border}`, color: theme.muted }}>
                          <span style={{ color: r.color }}>✓</span> {p}
                        </li>
                      ))}
                    </ul>
                  </Card>
                ))}
              </div>

              <Card>
                <h3 style={{ fontWeight: 700, marginBottom: 20 }}>รายชื่อ Admin ปัจจุบัน</h3>
                {[
                  { name: "Super Admin", email: "admin@theowner.com", role: "super_admin" },
                  { name: "ผู้ช่วย Admin", email: "helper@theowner.com", role: "helper" },
                ].map((a, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", borderBottom: `1px solid ${theme.border}` }}>
                    <div>
                      <div style={{ fontWeight: 700 }}>{a.name}</div>
                      <div style={{ fontSize: 13, color: theme.muted }}>{a.email}</div>
                    </div>
                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <select defaultValue={a.role} style={{ ...inputStyle, width: "auto", fontSize: 13 }}>
                        <option value="super_admin">Super Admin</option>
                        <option value="helper">Helper</option>
                      </select>
                      <Btn size="sm" variant="ghost"><Ic d={ICONS.edit} size={14} /> แก้ไข</Btn>
                    </div>
                  </div>
                ))}
                <div style={{ marginTop: 20 }}>
                  <Btn variant="outline"><Ic d={ICONS.plus} size={16} /> เพิ่ม Admin ใหม่</Btn>
                </div>
              </Card>
            </>
          )}

        </div>
      </main>
    </div>
  );
}

// ─────────────────────────────────────────────
// ROOT APP
// ─────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState("landing");
  const [adminUser, setAdminUser] = useState(null);
  const [theme, setTheme] = useState(DEFAULT_THEME);

  // Make theme globally accessible for shared components
  window.__theme = theme;

  return (
    <>
      <GlobalStyles theme={theme} />
      {view === "landing" && <LandingPage theme={theme} onAdmin={() => setView("admin-login")} />}
      {view === "admin-login" && (
        <AdminLogin theme={theme} onLogin={u => { setAdminUser(u); setView("admin"); }} onBack={() => setView("landing")} />
      )}
      {view === "admin" && adminUser && (
        <AdminDashboard
          user={adminUser} theme={theme} setTheme={setTheme}
          onLogout={() => { setAdminUser(null); setView("admin-login"); }}
          onLanding={() => setView("landing")}
        />
      )}
    </>
  );
}
