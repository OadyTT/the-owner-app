import { useState, useEffect } from "react";

const LIFF_ID = "2009199519-UViGDRf7";
const GAS_URL = "https://script.google.com/macros/s/AKfycbytwotuAasn9-ikmI7WOodPmQBXppN9AFAScdGZnJ0M_mNrBFnqFsxTKIpn5TCn4SRK/exec";

async function uploadSlipToDrive(file, lineId) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target.result.split(",")[1];
      try {
        const res = await fetch(GAS_URL, {
          method: "POST",
          body: JSON.stringify({ action: "uploadSlip", base64, mimeType: file.type, fileName: `slip_${lineId}_${Date.now()}.${file.name.split(".").pop()}`, lineId })
        });
        const result = await res.json();
        resolve(result);
      } catch { resolve({ success: false }); }
    };
    reader.readAsDataURL(file);
  });
}

async function initLiff() {
  try {
    if (window.__liffUserId) return window.__liffUserId;
    if (!window.liff || !LIFF_ID) return null;
    if (window.liff.isLoggedIn && window.liff.isLoggedIn()) {
      const profile = await window.liff.getProfile();
      return profile ? profile.userId : null;
    }
    return null;
  } catch (e) { return null; }
}

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
  { id: 1, date: "2026-03-05", time: "09:00–12:00", course: "Product Growth 101", mode: "online", seats: 20, taken: 8, zoomId: "123-456-789", zoomPw: "owner101" },
  { id: 2, date: "2026-03-08", time: "13:00–16:00", course: "Business Growth 101", mode: "onsite", seats: 15, taken: 12, zoomId: null, zoomPw: null },
  { id: 3, date: "2026-03-12", time: "09:00–12:00", course: "Digital Growth 101", mode: "online", seats: 25, taken: 5, zoomId: "987-654-321", zoomPw: "digital2025" },
];

const MOCK_MEMBERS = [
  { id: 1, name: "สมหญิง ใจดี", phone: "081-234-5678", lineId: "U111aaa", pkg: "quarter", status: "approved", slip: null, registeredAt: "2026-02-10", expiresAt: "2026-05-10", checkedIn: true, fine: 0 },
  { id: 2, name: "วิชัย มั่งมี", phone: "089-876-5432", lineId: "U222bbb", pkg: "trial", status: "pending", slip: null, registeredAt: "2026-02-25", expiresAt: null, checkedIn: false, fine: 0 },
];

const DEFAULT_THEME = {
  primary: "#0A12FF", accent: "#10B981", bg: "#07091A", card: "#0D1330", surface: "#111827",
  text: "#F9FAFB", muted: "rgba(249,250,251,0.5)", border: "rgba(255,255,255,0.08)",
  fontSize: 15, fontBody: "'Sarabun', sans-serif", fontDisplay: "'Bebas Neue', cursive",
};

function Ic({ d, size = 20, stroke = 2 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

const ICONS = {
  home: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z",
  users: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100 8 4 4 0 000-8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75",
  calendar: "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z",
  check: "M20 6L9 17l-5-5", x: "M18 6L6 18M6 6l12 12",
  upload: "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12",
  settings: "M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  logout: "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9",
  link: "M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71",
  plus: "M12 5v14M5 12h14", trash: "M3 6h18M8 6V4h8v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6",
  eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 100 6 3 3 0 000-6z",
  warning: "M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01",
  info: "M12 22a10 10 0 100-20 10 10 0 000 20zM12 8h.01M11 12h1v4h1",
  arrowRight: "M5 12h14M12 5l7 7-7 7",
};

function Tag({ children, color = "#3B82F6" }) {
  return <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: color + "22", color, padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>{children}</span>;
}

function StatusBadge({ status }) {
  const map = { pending: ["รออนุมัติ","#F59E0B"], approved: ["อนุมัติแล้ว","#10B981"], rejected: ["ปฏิเสธ","#EF4444"], online: ["Online","#3B82F6"], onsite: ["Onsite","#8B5CF6"], trial: ["Trial","#3B82F6"], quarter: ["Quarter","#10B981"], emergency: ["ฉุกเฉิน","#EF4444"], pre: ["ล่วงหน้า","#10B981"] };
  const [label, color] = map[status] || [status, "#6B7280"];
  return <Tag color={color}>{label}</Tag>;
}

function GlobalStyles({ theme }) {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700;800&family=Bebas+Neue&display=swap');
      *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
      html,body,#root{scroll-behavior:smooth;width:100%;max-width:100%;overflow-x:hidden}
      body{background:${theme.bg};color:${theme.text};font-family:${theme.fontBody};font-size:${theme.fontSize}px;line-height:1.6}
      ::-webkit-scrollbar{width:6px}::-webkit-scrollbar-thumb{background:${theme.border};border-radius:3px}
      input,select,textarea,button{font-family:${theme.fontBody}}
      .pulse{animation:pulse 2s infinite}@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.6}}
    `}</style>
  );
}

function Btn({ children, onClick, variant = "primary", size = "md", fullWidth, style: extraStyle, disabled, type = "button" }) {
  const theme = window.__theme || DEFAULT_THEME;
  const sizes = { sm: { padding: "8px 16px", fontSize: 13 }, md: { padding: "12px 24px", fontSize: 15 }, lg: { padding: "16px 36px", fontSize: 17 } };
  const variants = { primary: { background: theme.primary, color: "#fff" }, accent: { background: theme.accent, color: "#000" }, ghost: { background: "rgba(255,255,255,0.07)", color: theme.text }, danger: { background: "#EF4444", color: "#fff" }, success: { background: "#10B981", color: "#000" }, outline: { background: "transparent", color: theme.primary, border: `2px solid ${theme.primary}` } };
  return (
    <button type={type} disabled={disabled} onClick={onClick}
      style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, border: "none", cursor: disabled ? "not-allowed" : "pointer", fontWeight: 700, fontFamily: theme.fontBody, borderRadius: 12, opacity: disabled ? 0.5 : 1, ...sizes[size], ...variants[variant], ...(fullWidth && { width: "100%" }), ...extraStyle }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.opacity = "0.85"; }}
      onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}>
      {children}
    </button>
  );
}

function Card({ children, style: extra, glow }) {
  const theme = window.__theme || DEFAULT_THEME;
  return <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 20, padding: 24, ...(glow && { boxShadow: `0 0 40px ${theme.primary}22` }), ...extra }}>{children}</div>;
}

function Input({ label, value, onChange, placeholder, type = "text", required }) {
  const theme = window.__theme || DEFAULT_THEME;
  return (
    <div style={{ marginBottom: 16 }}>
      {label && <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600, color: theme.muted }}>{label}{required && <span style={{ color: "#EF4444" }}> *</span>}</label>}
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} required={required}
        style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: `1px solid ${theme.border}`, borderRadius: 12, padding: "13px 16px", color: theme.text, fontSize: theme.fontSize, outline: "none" }}
        onFocus={e => e.target.style.borderColor = theme.primary}
        onBlur={e => e.target.style.borderColor = theme.border} />
    </div>
  );
}

function Select({ label, value, onChange, options, required }) {
  const theme = window.__theme || DEFAULT_THEME;
  return (
    <div style={{ marginBottom: 16 }}>
      {label && <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600, color: theme.muted }}>{label}{required && <span style={{ color: "#EF4444" }}> *</span>}</label>}
      <select value={value} onChange={e => onChange(e.target.value)} style={{ width: "100%", background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 12, padding: "13px 16px", color: theme.text, fontSize: theme.fontSize, outline: "none", appearance: "none" }}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
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

function Divider() {
  const theme = window.__theme || DEFAULT_THEME;
  return <div style={{ height: 1, background: theme.border, margin: "32px 0" }} />;
}

// ─── CHECKIN LIST (Admin) ────────────────────
function CheckinList({ scheduleId, theme, gasUrl }) {
  const [checkins, setCheckins] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetch(gasUrl + "?action=getCheckins&scheduleId=" + scheduleId)
      .then(r => r.json())
      .then(res => { if (res.success) setCheckins(res.data); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [scheduleId]);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <h4 style={{ fontWeight: 700, fontSize: 15 }}>รายชื่อ Check-in ({checkins.length} คน)</h4>
        <button onClick={load} style={{ background: "none", border: `1px solid ${theme.border}`, color: theme.muted, padding: "4px 12px", borderRadius: 8, cursor: "pointer", fontSize: 12, fontFamily: theme.fontBody }}>🔄 รีเฟรช</button>
      </div>
      {loading ? <div style={{ color: theme.muted, fontSize: 13 }}>⏳ กำลังโหลด...</div>
        : checkins.length === 0 ? <div style={{ color: theme.muted, fontSize: 13, padding: "20px 0" }}>ยังไม่มีสมาชิก Check-in</div>
        : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {checkins.map((c, i) => (
              <div key={i} style={{ background: theme.card, borderRadius: 10, padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{c.memberName}</div>
                  <div style={{ fontSize: 11, color: theme.muted }}>{c.lineId}</div>
                </div>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <StatusBadge status={c.type === "emergency" ? "emergency" : "pre"} />
                  {c.fine > 0 && <Tag color="#EF4444">+{c.fine}฿</Tag>}
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  );
}

// ─── CHECKIN SECTION (Landing) ───────────────
function CheckinSection({ theme, gasUrl, autoCheckinId, autoCheckinType }) {
  const [schedules, setSchedules] = useState([]);
  const [myLineId, setMyLineId] = useState(window.__liffUserId || "");
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(null);
  const [doneMsg, setDoneMsg] = useState("");
  const [autoCheckinDone, setAutoCheckinDone] = useState(false);

  useEffect(() => {
    fetch(gasUrl + "?action=getSchedules").then(r => r.json()).then(res => { if (res.success) setSchedules(res.data); }).finally(() => setLoading(false));
    // ดึง lineId จาก LIFF
    const lineId = window.__liffUserId;
    if (lineId) {
      setMyLineId(lineId);
    } else if (window.liff?.isLoggedIn?.()) {
      window.liff.getProfile().then(p => setMyLineId(p.userId)).catch(() => {});
    }
  }, []);

  // Auto check-in เมื่อมาจาก QR Code
  useEffect(() => {
    if (!autoCheckinId || !myLineId || autoCheckinDone) return;
    setAutoCheckinDone(true);
    setChecking(autoCheckinId);
    fetch(gasUrl, {
      method: "POST",
      body: JSON.stringify({ action: "addCheckin", lineId: myLineId, scheduleId: autoCheckinId, type: autoCheckinType || "emergency" })
    })
      .then(r => r.json())
      .then(result => {
        if (result.success) {
          const fine = result.fine > 0 ? `
⚠️ มีค่าปรับ ${result.fine} ฿ เนื่องจาก Check-in ฉุกเฉิน` : "";
          setDoneMsg(`✅ Check-in สำเร็จ! Zoom Link ส่งผ่าน Line แล้วครับ 🎉${fine}`);
        } else {
          setDoneMsg("❌ " + result.message);
        }
        setChecking(null);
        // clear URL params
        window.history.replaceState({}, "", window.location.pathname);
      })
      .catch(() => { setDoneMsg("❌ เกิดข้อผิดพลาด กรุณาลองใหม่"); setChecking(null); });
  }, [autoCheckinId, myLineId, autoCheckinDone]);

  const handleCheckin = async (schedule) => {
    if (!myLineId) { alert("กรุณาเปิดจาก Line OA เพื่อ Check-in ครับ"); return; }
    setChecking(schedule.id);
    try {
      const res = await fetch(gasUrl, { method: "POST", body: JSON.stringify({ action: "addCheckin", lineId: myLineId, scheduleId: schedule.id, type: "pre" }) });
      const result = await res.json();
      if (result.success) setDoneMsg(`✅ Check-in สำเร็จ! ${schedule.mode === "online" ? "Zoom Link ส่งผ่าน Line แล้วครับ 🎉" : "พบกันที่สถานที่เรียนครับ 😊"}`);
      else alert("❌ " + result.message);
    } catch { alert("เกิดข้อผิดพลาด กรุณาลองใหม่"); }
    setChecking(null);
  };

  if (doneMsg) return (
    <Card glow style={{ textAlign: "center", padding: 48 }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
      <h3 style={{ fontWeight: 700, fontSize: 22, marginBottom: 12 }}>{doneMsg}</h3>
      <Btn variant="ghost" onClick={() => setDoneMsg("")}>Check-in คอร์สอื่น</Btn>
    </Card>
  );

  if (loading) return <div style={{ textAlign: "center", color: theme.muted, padding: 40 }}>⏳ กำลังโหลดตารางเรียน...</div>;

  const today = new Date().toISOString().slice(0, 10);
  const upcoming = schedules.filter(s => String(s.date).slice(0, 10) >= today);

  return (
    <div>
      {!myLineId && <InfoBox type="warning">กรุณาเปิดจาก <strong>Line OA The Owner</strong> เพื่อ Check-in อัตโนมัติ</InfoBox>}
      {upcoming.length === 0 ? (
        <Card style={{ textAlign: "center", padding: 48 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📅</div>
          <p style={{ color: theme.muted }}>ยังไม่มีตารางเรียนที่เปิดรับ Check-in ขณะนี้</p>
        </Card>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {upcoming.map(s => {
            const pct = (s.taken || 0) / s.seats;
            const full = pct >= 1;
            return (
              <Card key={s.id}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
                      <StatusBadge status={s.mode} />
                      {full && <Tag color="#EF4444">เต็มแล้ว</Tag>}
                    </div>
                    <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>{s.course}</h3>
                    <div style={{ color: theme.muted, fontSize: 14 }}>📅 {String(s.date).slice(0, 10)} &nbsp;⏰ {s.time}</div>
                    <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 120, height: 5, background: "rgba(255,255,255,0.1)", borderRadius: 3, overflow: "hidden" }}>
                        <div style={{ width: `${pct * 100}%`, height: "100%", background: pct > 0.8 ? "#EF4444" : theme.accent }} />
                      </div>
                      <span style={{ fontSize: 13, color: theme.muted }}>{s.taken || 0}/{s.seats} ที่นั่ง</span>
                    </div>
                  </div>
                  <Btn disabled={full || checking === s.id || !myLineId} onClick={() => handleCheckin(s)} variant={full ? "ghost" : "primary"} style={{ minWidth: 120 }}>
                    {checking === s.id ? "⏳ กำลังส่ง..." : full ? "เต็มแล้ว" : "✅ Check-in"}
                  </Btn>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── LANDING PAGE ────────────────────────────
function LandingPage({ theme, onAdmin, autoCheckinId, autoCheckinType }) {
  const [section, setSection] = useState(autoCheckinId ? "checkin" : "home");

  useEffect(() => {
    if (autoCheckinId) {
      setTimeout(() => document.getElementById("checkin")?.scrollIntoView({ behavior: "smooth" }), 300);
    }
  }, [autoCheckinId]);
  const [form, setForm] = useState({ name: "", phone: "", lineId: "", email: "", pkg: "trial", mode: "online", slip: null });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [schedules, setSchedules] = useState(MOCK_SCHEDULES);
  const [lineAutoId, setLineAutoId] = useState("");

  useEffect(() => {
    if (window.liff) {
      initLiff().then(userId => { if (userId) { setLineAutoId(userId); setForm(f => ({ ...f, lineId: userId })); } });
    }
    fetch(GAS_URL + "?action=getSchedules").then(r => r.json()).then(res => { if (res.success && res.data.length > 0) setSchedules(res.data); }).catch(() => {});
  }, []);

  const scrollTo = (id) => { setSection(id); document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let slipUrl = "";
      if (form.slip) { const r = await uploadSlipToDrive(form.slip, form.lineId); if (r.success) slipUrl = r.viewUrl; }
      const res = await fetch(GAS_URL, { method: "POST", body: JSON.stringify({ action: "addMember", lineId: form.lineId, name: form.name, phone: form.phone, email: form.email, package: form.pkg, mode: form.mode, slipUrl }) });
      const result = await res.json();
      if (result.success) setSubmitted(true);
      else alert("เกิดข้อผิดพลาด: " + result.message);
    } catch { alert("ไม่สามารถเชื่อมต่อได้ กรุณาลองใหม่อีกครั้ง"); }
  };

  const navItems = [["home","หน้าหลัก"],["courses","คอร์ส"],["schedule","ตารางเรียน"],["packages","แพ็กเกจ"],["how","วิธีสมัคร"],["checkin","Check-in"],["register","สมัครสมาชิก"],["faq","FAQ"]];
  const faqs = [
    ["สมัครสมาชิกได้อย่างไร?","กรอกฟอร์มด้านล่าง เลือกแพ็กเกจ โอนเงินผ่าน PromptPay แล้วแนบสลิป admin จะยืนยันผ่าน Line OA ภายใน 24 ชม."],
    ["Trial เรียนได้กี่คอร์ส?","เรียนได้ 1 คอร์ส หรือ 1 วัน เริ่มนับหลัง Check-in ครั้งแรก"],
    ["Quarter เรียนได้นานแค่ไหน?","90 วัน นับจากการ Check-in ครั้งแรก เรียนได้ทุกคอร์สที่เปิดในช่วงนั้น"],
    ["เรียน Online ผ่านอะไร?","เรียนผ่าน Zoom หลังลงทะเบียนคอร์ส admin จะส่ง Meeting ID และ Password ผ่าน Line OA"],
    ["ถ้ามา Onsite แบบฉุกเฉิน?","สามารถ Scan QR Code หน้าห้องได้ แต่จะมีค่าปรับตามที่กำหนด เพื่อส่งเสริมการลงทะเบียนล่วงหน้า"],
  ];

  return (
    <>
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "rgba(7,9,26,0.92)", backdropFilter: "blur(16px)", borderBottom: `1px solid ${theme.border}` }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button onClick={() => scrollTo("home")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: "50%", overflow: "hidden", flexShrink: 0, background: theme.primary }}>
              <img src="/the_owner_logo.png" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => { e.target.style.display="none"; }} />
            </div>
            <span style={{ fontFamily: theme.fontDisplay, fontSize: 22, letterSpacing: 3, color: theme.text }}>THE OWNER</span>
          </button>
          <div style={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            {navItems.map(([id, label]) => (
              <button key={id} onClick={() => scrollTo(id)} style={{ background: "none", border: "none", cursor: "pointer", color: section === id ? theme.text : theme.muted, padding: "8px 10px", borderRadius: 10, fontSize: 12, fontWeight: 600, fontFamily: theme.fontBody }}>{label}</button>
            ))}
          </div>
          <Btn size="sm" variant="ghost" onClick={onAdmin}><Ic d={ICONS.shield} size={15} /> Admin</Btn>
        </div>
      </nav>

      {/* HERO */}
      <section id="home" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "120px 24px 80px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)", width: 700, height: 700, background: `radial-gradient(circle, ${theme.primary}22 0%, transparent 65%)`, pointerEvents: "none" }} />
        <div style={{ textAlign: "center", maxWidth: 800, position: "relative", margin: "0 auto", padding: "0 16px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: theme.primary + "22", border: `1px solid ${theme.primary}44`, borderRadius: 30, padding: "8px 20px", fontSize: 14, color: theme.primary, fontWeight: 600, marginBottom: 32 }}>
            <span className="pulse" style={{ width: 8, height: 8, borderRadius: "50%", background: theme.primary, display: "inline-block" }} /> เปิดรับสมาชิกแล้ววันนี้
          </div>
          <div style={{ width: 120, height: 120, borderRadius: "50%", overflow: "hidden", margin: "0 auto 32px", boxShadow: `0 0 80px ${theme.primary}55`, background: theme.primary }}>
            <img src="/the_owner_logo.png" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => { e.target.style.display="none"; }} />
          </div>
          <h1 style={{ fontFamily: theme.fontDisplay, fontSize: "clamp(72px, 14vw, 160px)", lineHeight: 0.9, letterSpacing: 6, marginBottom: 24 }}>THE<br /><span style={{ color: theme.primary }}>OWNER</span></h1>
          <p style={{ fontSize: "clamp(16px, 2.5vw, 22px)", color: theme.muted, marginBottom: 48, lineHeight: 1.8 }}>i am because we are<br />เรียนรู้ · เติบโต · สร้างธุรกิจที่ยั่งยืน</p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Btn size="lg" onClick={() => scrollTo("register")}><Ic d={ICONS.arrowRight} size={20} /> สมัครสมาชิก</Btn>
            <Btn size="lg" variant="outline" onClick={() => scrollTo("courses")}>ดูคอร์สทั้งหมด</Btn>
          </div>
          <div style={{ display: "flex", gap: 48, justifyContent: "center", marginTop: 72, flexWrap: "wrap" }}>
            {[["4","คอร์สหลัก"],["6+","ครั้ง/เดือน"],["150฿","เริ่มต้นที่"],["Online","& Onsite"]].map(([n, l]) => (
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
        <div style={{ marginBottom: 48, textAlign: "center" }}>
          <h2 style={{ fontFamily: theme.fontDisplay, fontSize: "clamp(40px,6vw,64px)", letterSpacing: 2, marginBottom: 12 }}>คอร์ส<span style={{ color: theme.primary }}>ทั้งหมด</span></h2>
          <p style={{ color: theme.muted }}>เรียนได้ฟรีตามแพ็กเกจที่สมัคร ทั้ง Online และ Onsite</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
          {COURSES.map(c => (
            <Card key={c.id}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>{c.icon}</div>
              <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>{c.name}</h3>
              <p style={{ color: theme.muted, fontSize: 14, lineHeight: 1.7 }}>{c.desc}</p>
              <div style={{ marginTop: 20, display: "flex", gap: 8, flexWrap: "wrap" }}>
                <Tag color={theme.primary}>Online</Tag><Tag color="#8B5CF6">Onsite</Tag><Tag color={theme.accent}>ฟรีตามแพ็กเกจ</Tag>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* SCHEDULE */}
      <section id="schedule" style={{ padding: "100px 24px", background: "rgba(255,255,255,0.015)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ marginBottom: 48, textAlign: "center" }}>
            <h2 style={{ fontFamily: theme.fontDisplay, fontSize: "clamp(40px,6vw,64px)", letterSpacing: 2, marginBottom: 12 }}>ตาราง<span style={{ color: theme.primary }}>เรียน</span></h2>
            <p style={{ color: theme.muted }}>อัปเดตทุกเดือน ประมาณ 6 คอร์สต่อเดือน</p>
          </div>
          <InfoBox type="info">ลงทะเบียนล่วงหน้าผ่าน Line OA หรือ Landing Page เพื่อจองที่นั่ง และรับ Zoom Link</InfoBox>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 8px", minWidth: 600 }}>
              <thead>
                <tr style={{ color: theme.muted, fontSize: 13, textTransform: "uppercase", letterSpacing: 1 }}>
                  {["วันที่","เวลา","คอร์ส","รูปแบบ","ที่นั่ง",""].map(h => <th key={h} style={{ textAlign: "left", padding: "8px 16px", fontWeight: 600 }}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {schedules.map(s => {
                  const pct = (s.taken || 0) / s.seats;
                  return (
                    <tr key={s.id}>
                      <td style={{ padding: 16, background: theme.card, borderRadius: "12px 0 0 12px", fontWeight: 600 }}>{String(s.date).slice(0,10)}</td>
                      <td style={{ padding: 16, background: theme.card, color: theme.muted, fontSize: 14 }}>{s.time}</td>
                      <td style={{ padding: 16, background: theme.card, fontWeight: 600 }}>{s.course}</td>
                      <td style={{ padding: 16, background: theme.card }}><StatusBadge status={s.mode} /></td>
                      <td style={{ padding: 16, background: theme.card }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 80, height: 5, background: "rgba(255,255,255,0.1)", borderRadius: 3, overflow: "hidden" }}>
                            <div style={{ width: `${pct * 100}%`, height: "100%", background: pct > 0.8 ? "#EF4444" : theme.accent }} />
                          </div>
                          <span style={{ fontSize: 13, color: theme.muted }}>{s.taken || 0}/{s.seats}</span>
                        </div>
                      </td>
                      <td style={{ padding: 16, background: theme.card, borderRadius: "0 12px 12px 0" }}>
                        <Btn size="sm" variant={pct >= 1 ? "ghost" : "primary"} disabled={pct >= 1} onClick={() => scrollTo("checkin")}>
                          {pct >= 1 ? "เต็ม" : "Check-in"}
                        </Btn>
                      </td>
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
        <div style={{ marginBottom: 48, textAlign: "center" }}>
          <h2 style={{ fontFamily: theme.fontDisplay, fontSize: "clamp(40px,6vw,64px)", letterSpacing: 2, marginBottom: 12 }}><span style={{ color: theme.primary }}>แพ็กเกจ</span>สมาชิก</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
          {PACKAGES.map(pkg => (
            <div key={pkg.id} style={{ background: theme.card, border: `2px solid ${pkg.id === "quarter" ? pkg.color : theme.border}`, borderRadius: 24, padding: 40, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: pkg.color }} />
              {pkg.badge && <div style={{ position: "absolute", top: 20, right: 20, background: pkg.color, color: "#000", padding: "4px 14px", borderRadius: 20, fontSize: 12, fontWeight: 800 }}>⭐ {pkg.badge}</div>}
              <Tag color={pkg.color}>{pkg.label}</Tag>
              <div style={{ marginTop: 16, marginBottom: 8 }}>
                <span style={{ fontFamily: theme.fontDisplay, fontSize: 72, color: pkg.color }}>{pkg.price}</span>
                <span style={{ fontSize: 16, color: theme.muted }}>฿</span>
              </div>
              <p style={{ color: theme.muted, fontSize: 14, marginBottom: 28 }}>{pkg.duration}</p>
              <Divider />
              <ul style={{ listStyle: "none", marginBottom: 32 }}>
                {(pkg.id === "trial" ? ["เรียนได้ 1 คอร์ส หรือ 1 วัน","Online & Onsite","นับหลัง Check-in ครั้งแรก","เหมาะสำหรับทดลองเรียน"]
                  : ["เรียนได้ไม่จำกัด 90 วัน","ทุกคอร์ส Online & Onsite","นับหลัง Check-in ครั้งแรก","ประหยัดกว่า Trial มากกว่า 70%"]
                ).map(t => (
                  <li key={t} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "7px 0", fontSize: 14 }}>
                    <span style={{ color: pkg.color, flexShrink: 0 }}><Ic d={ICONS.check} size={16} /></span> {t}
                  </li>
                ))}
              </ul>
              <Btn fullWidth style={{ background: pkg.color, color: pkg.id === "quarter" ? "#000" : "#fff" }} onClick={() => scrollTo("register")}>
                เลือกแพ็กเกจนี้ <Ic d={ICONS.arrowRight} size={16} />
              </Btn>
            </div>
          ))}
        </div>
      </section>

      {/* HOW TO */}
      <section id="how" style={{ padding: "100px 24px", background: "rgba(255,255,255,0.015)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ marginBottom: 48, textAlign: "center" }}>
            <h2 style={{ fontFamily: theme.fontDisplay, fontSize: "clamp(40px,6vw,64px)", letterSpacing: 2, marginBottom: 12 }}>วิธี<span style={{ color: theme.primary }}>สมัคร</span></h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
            {[{num:"01",title:"เลือกแพ็กเกจ",desc:"Trial (150฿/ครั้ง) หรือ Quarter (600฿/3เดือน)",icon:"📦"},{num:"02",title:"โอนเงิน",desc:"โอนผ่าน PromptPay หรือ Bangkok Bank",icon:"💳"},{num:"03",title:"แนบสลิป",desc:"กรอกฟอร์มและแนบรูปสลิปการโอนเงิน",icon:"📎"},{num:"04",title:"รอการยืนยัน",desc:"Admin ตรวจสอบและส่งข้อมูลยืนยันผ่าน Line OA ภายใน 24 ชม.",icon:"✅"}].map(s => (
              <Card key={s.num}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>{s.icon}</div>
                <div style={{ fontFamily: theme.fontDisplay, fontSize: 48, color: theme.border, lineHeight: 1, marginBottom: 8 }}>{s.num}</div>
                <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>{s.title}</h3>
                <p style={{ color: theme.muted, fontSize: 14, lineHeight: 1.7 }}>{s.desc}</p>
              </Card>
            ))}
          </div>
          <Card style={{ marginTop: 40, background: `linear-gradient(135deg, ${theme.primary}15, ${theme.accent}10)`, border: `1px solid ${theme.primary}30` }}>
            <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 20 }}>🏦 ข้อมูลการชำระเงิน</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20 }}>
              {[["ธนาคาร","Bangkok Bank"],["PromptPay","089-xxx-2626"],["ชื่อบัญชี","นาง สุพัตรา หงษ์วิเศษ"],["หมายเหตุ","โอนแล้วแนบสลิปในฟอร์ม"]].map(([k,v]) => (
                <div key={k}>
                  <div style={{ fontSize: 12, color: theme.muted, marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>{k}</div>
                  <div style={{ fontWeight: 700, fontSize: 16, color: k === "PromptPay" ? theme.accent : theme.text }}>{v}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* CHECK-IN */}
      <section id="checkin" style={{ padding: "100px 24px", maxWidth: 860, margin: "0 auto" }}>
        <div style={{ marginBottom: 48, textAlign: "center" }}>
          <h2 style={{ fontFamily: theme.fontDisplay, fontSize: "clamp(40px,6vw,64px)", letterSpacing: 2, marginBottom: 12 }}>
            <span style={{ color: theme.primary }}>Check-in</span> เข้าเรียน
          </h2>
          <p style={{ color: theme.muted }}>เลือกคอร์สที่ต้องการเรียน ระบบจะส่ง Zoom Link ผ่าน Line ให้อัตโนมัติ</p>
        </div>
        <CheckinSection theme={theme} gasUrl={GAS_URL} autoCheckinId={autoCheckinId} autoCheckinType={autoCheckinType} />
      </section>

      {/* REGISTER */}
      <section id="register" style={{ padding: "100px 24px", maxWidth: 820, margin: "0 auto" }}>
        <div style={{ marginBottom: 48, textAlign: "center" }}>
          <h2 style={{ fontFamily: theme.fontDisplay, fontSize: "clamp(40px,6vw,64px)", letterSpacing: 2, marginBottom: 12 }}>สมัคร<span style={{ color: theme.primary }}>สมาชิก</span></h2>
        </div>
        {submitted ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 500 }}>
            <style>{`
              @keyframes popIn {
                0% { transform: scale(0); opacity: 0; }
                60% { transform: scale(1.2); opacity: 1; }
                80% { transform: scale(0.95); }
                100% { transform: scale(1); }
              }
              @keyframes fadeSlideUp {
                from { opacity: 0; transform: translateY(24px); }
                to { opacity: 1; transform: translateY(0); }
              }
              @keyframes drawCircle {
                from { stroke-dashoffset: 314; }
                to { stroke-dashoffset: 0; }
              }
              @keyframes drawCheck {
                from { stroke-dashoffset: 100; }
                to { stroke-dashoffset: 0; }
              }
              @keyframes pulse-ring {
                0% { transform: scale(1); opacity: 0.6; }
                100% { transform: scale(1.5); opacity: 0; }
              }
            `}</style>
            <Card glow style={{ textAlign: "center", padding: "60px 40px", maxWidth: 480, width: "100%", position: "relative", overflow: "visible" }}>
              {/* SVG checkmark animation */}
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 32, animation: "popIn 0.6s cubic-bezier(0.175,0.885,0.32,1.275) forwards", position: "relative" }}>
                {/* pulse ring */}
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 130, height: 130, borderRadius: "50%", border: "3px solid #10B981", animation: "pulse-ring 1.5s ease-out 0.8s infinite", pointerEvents: "none" }} />
                <svg width="120" height="120" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#10B981" strokeWidth="6"
                    strokeDasharray="314" strokeDashoffset="314"
                    style={{ animation: "drawCircle 0.8s ease forwards 0.1s", transformOrigin: "center", transform: "rotate(-90deg)" }} />
                  <polyline points="35,62 52,79 85,45" fill="none" stroke="#10B981" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round"
                    strokeDasharray="100" strokeDashoffset="100"
                    style={{ animation: "drawCheck 0.5s ease forwards 0.7s" }} />
                </svg>
              </div>

              <h2 style={{ fontFamily: theme.fontDisplay, fontSize: 44, letterSpacing: 2, marginBottom: 12, color: "#10B981", animation: "fadeSlideUp 0.5s ease forwards 0.9s", opacity: 0 }}>
                ส่งข้อมูลแล้ว!
              </h2>
              <p style={{ color: theme.muted, lineHeight: 1.9, fontSize: 16, maxWidth: 380, margin: "0 auto 32px", animation: "fadeSlideUp 0.5s ease forwards 1.1s", opacity: 0 }}>
                Admin จะตรวจสอบสลิปและส่งข้อมูลยืนยันกลับผ่าน{" "}
                <strong style={{ color: "#06C755" }}>Line OA "The Owner"</strong>{" "}
                ภายใน 1–24 ชั่วโมง
              </p>
              <div style={{ animation: "fadeSlideUp 0.5s ease forwards 1.3s", opacity: 0 }}>
                <Btn variant="ghost" onClick={() => setSubmitted(false)}>สมัครอีกครั้ง</Btn>
              </div>
            </Card>
          </div>
        ) : (
          <Card>
            <form onSubmit={handleSubmit}>
              <InfoBox type="warning">กรุณากรอกชื่อ-นามสกุลให้ตรงกับสลิปการโอนเงิน</InfoBox>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <Input label="ชื่อ-นามสกุล" value={form.name} onChange={v => setForm({...form, name: v})} placeholder="ตามบัตรประชาชน" required />
                <Input label="เบอร์โทรศัพท์" value={form.phone} onChange={v => setForm({...form, phone: v})} placeholder="08x-xxx-xxxx" required />
              </div>
              {lineAutoId ? (
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600, color: theme.muted }}>Line User ID</label>
                  <div style={{ background: theme.accent + "15", border: `1px solid ${theme.accent}40`, borderRadius: 12, padding: "13px 16px", display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 20 }}>✅</span>
                    <div>
                      <div style={{ fontWeight: 700, color: theme.accent, fontSize: 13 }}>เชื่อมต่อ LINE อัตโนมัติแล้ว</div>
                      <div style={{ fontSize: 11, color: theme.muted, marginTop: 2 }}>{lineAutoId.slice(0,8)}...{lineAutoId.slice(-4)}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <Input label="Line User ID" value={form.lineId} onChange={v => setForm({...form, lineId: v})} placeholder="กรุณาเปิดจาก Line OA เพื่อรับ ID อัตโนมัติ" required />
              )}
              <Input label="อีเมล (ไม่บังคับ)" value={form.email} onChange={v => setForm({...form, email: v})} placeholder="example@email.com" type="email" />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <Select label="แพ็กเกจ" value={form.pkg} onChange={v => setForm({...form, pkg: v})} required options={PACKAGES.map(p => ({ value: p.id, label: `${p.label} – ${p.price} ฿` }))} />
                <Select label="รูปแบบการเรียน" value={form.mode} onChange={v => setForm({...form, mode: v})} required options={[{value:"online",label:"Online (Zoom)"},{value:"onsite",label:"Onsite (มาเองที่สถานที่)"}]} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600, color: theme.muted }}>สลิปโอนเงิน <span style={{ color: "#EF4444" }}>*</span></label>
                <div onClick={() => document.getElementById("slip-file").click()}
                  style={{ border: `2px dashed ${form.slip ? theme.accent : theme.border}`, borderRadius: 16, padding: 40, textAlign: "center", cursor: "pointer", background: form.slip ? theme.accent + "10" : "transparent" }}>
                  {form.slip ? (
                    <><div style={{ fontSize: 36, marginBottom: 8 }}>✅</div><div style={{ color: theme.accent, fontWeight: 700 }}>{form.slip.name}</div></>
                  ) : (
                    <><div style={{ color: theme.muted, marginBottom: 8 }}><Ic d={ICONS.upload} size={32} /></div><div style={{ fontWeight: 600, marginBottom: 4 }}>คลิกหรือลากไฟล์มาวางที่นี่</div><div style={{ color: theme.muted, fontSize: 13 }}>รองรับ JPG, PNG, PDF</div></>
                  )}
                  <input id="slip-file" type="file" accept="image/*,.pdf" style={{ display: "none" }} onChange={e => setForm({...form, slip: e.target.files[0]})} />
                </div>
              </div>
              <Btn type="submit" size="lg" fullWidth style={{ marginTop: 8 }}>ส่งข้อมูลการสมัคร <Ic d={ICONS.arrowRight} size={18} /></Btn>
            </form>
          </Card>
        )}
      </section>

      {/* FAQ */}
      <section id="faq" style={{ padding: "100px 24px", background: "rgba(255,255,255,0.015)" }}>
        <div style={{ maxWidth: 740, margin: "0 auto" }}>
          <div style={{ marginBottom: 48, textAlign: "center" }}>
            <h2 style={{ fontFamily: theme.fontDisplay, fontSize: "clamp(40px,6vw,64px)", letterSpacing: 2, marginBottom: 12 }}>FAQ <span style={{ color: theme.primary }}>คำถาม</span>ที่พบบ่อย</h2>
          </div>
          {faqs.map(([q, a], i) => (
            <div key={i} onClick={() => setOpenFaq(openFaq === i ? null : i)}
              style={{ background: theme.card, border: `1px solid ${openFaq === i ? theme.primary + "60" : theme.border}`, borderRadius: 16, marginBottom: 10, cursor: "pointer", overflow: "hidden" }}>
              <div style={{ padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 700, paddingRight: 16 }}>{q}</span>
                <span style={{ color: theme.primary, fontSize: 22, flexShrink: 0 }}>{openFaq === i ? "−" : "+"}</span>
              </div>
              {openFaq === i && <div style={{ padding: "0 24px 20px", color: theme.muted, lineHeight: 1.8, fontSize: 15 }}>{a}</div>}
            </div>
          ))}
        </div>
      </section>

      <footer style={{ borderTop: `1px solid ${theme.border}`, padding: "48px 24px", textAlign: "center" }}>
        <div style={{ fontFamily: theme.fontDisplay, fontSize: 28, letterSpacing: 4, marginBottom: 8 }}>THE OWNER</div>
        <p style={{ color: theme.muted, fontSize: 14, marginBottom: 24 }}>i am because we are</p>
        <p style={{ color: theme.muted, fontSize: 13 }}>© 2025 The Owner. All rights reserved.</p>
      </footer>
    </>
  );
}

// ─── ADMIN LOGIN ─────────────────────────────
function AdminLogin({ theme, onLogin, onBack }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");

  const handle = (e) => {
    e.preventDefault();
    const accounts = {
      "admin@theowner.com": { pass: "admin123", role: "super_admin", name: "Super Admin" },
      "helper@theowner.com": { pass: "helper123", role: "helper", name: "Helper Admin" },
    };
    const acc = accounts[email];
    if (acc && acc.pass === pass) onLogin(acc);
    else setErr("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 440 }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", overflow: "hidden", margin: "0 auto 20px", background: theme.primary }}>
            <img src="/the_owner_logo.png" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => { e.target.style.display="none"; }} />
          </div>
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
          <div style={{ marginTop: 16, padding: 14, background: "rgba(59,130,246,0.1)", borderRadius: 10, fontSize: 13, color: theme.muted }}>
            Super: admin@theowner.com / admin123<br />Helper: helper@theowner.com / helper123
          </div>
          <Btn variant="ghost" fullWidth onClick={onBack} style={{ marginTop: 8 }}>← กลับหน้าหลัก</Btn>
        </Card>
      </div>
    </div>
  );
}

// ─── ADMIN DASHBOARD ─────────────────────────
function AdminDashboard({ user, theme, setTheme, onLogout, onLanding }) {
  const [page, setPage] = useState("approvals");
  const [members, setMembers] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [showAddSched, setShowAddSched] = useState(false);
  const [newSched, setNewSched] = useState({ date: "", time: "", course: COURSES[0].name, mode: "online", seats: 20, zoomId: "", zoomPw: "" });
  const [copyMsg, setCopyMsg] = useState("");
  const [qrSchedule, setQrSchedule] = useState(null);

  const mapMembers = (data) => data.map((m, i) => ({
    id: i + 1, name: m.name, phone: m.phone, lineId: m.lineId, pkg: m.package,
    status: m.status, slip: m.slipThumb || m.slipUrl || null,
    registeredAt: m.registeredAt, expiresAt: m.expiresAt,
    checkedIn: m.checkedIn === "TRUE", fine: m.fine || 0
  }));

  const loadMembers = () => fetch(GAS_URL + "?action=getMembers").then(r => r.json()).then(res => { if (res.success) setMembers(mapMembers(res.data)); }).catch(() => {});

  useEffect(() => {
    Promise.all([
      fetch(GAS_URL + "?action=getMembers").then(r => r.json()).then(res => { if (res.success) setMembers(mapMembers(res.data)); else setMembers(MOCK_MEMBERS); }).catch(() => setMembers(MOCK_MEMBERS)),
      fetch(GAS_URL + "?action=getSchedules").then(r => r.json()).then(res => { if (res.success && res.data.length > 0) setSchedules(res.data); else setSchedules(MOCK_SCHEDULES); }).catch(() => setSchedules(MOCK_SCHEDULES)),
    ]).finally(() => setLoading(false));
  }, []);

  const approve = async (id) => {
    const member = members.find(m => m.id === id);
    if (!member) return;
    try {
      const res = await fetch(GAS_URL, { method: "POST", body: JSON.stringify({ action: "updateStatus", lineId: member.lineId, status: "approved" }) });
      const result = await res.json();
      if (result.success) { await loadMembers(); setSelected(null); alert("✅ อนุมัติสำเร็จ! แจ้งสมาชิกผ่าน Line แล้ว"); }
      else alert("เกิดข้อผิดพลาด: " + result.message);
    } catch { alert("ไม่สามารถเชื่อมต่อได้"); }
  };

  const reject = async (id) => {
    const member = members.find(m => m.id === id);
    if (!member) return;
    try {
      const res = await fetch(GAS_URL, { method: "POST", body: JSON.stringify({ action: "updateStatus", lineId: member.lineId, status: "rejected" }) });
      const result = await res.json();
      if (result.success) { await loadMembers(); setSelected(null); alert("❌ ปฏิเสธแล้ว แจ้งสมาชิกผ่าน Line แล้ว"); }
      else alert("เกิดข้อผิดพลาด: " + result.message);
    } catch { alert("ไม่สามารถเชื่อมต่อได้"); }
  };

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
      <div style={{ textAlign: "center" }}><div style={{ fontSize: 48, marginBottom: 16 }}>⏳</div><div>กำลังโหลดข้อมูลจาก Google Sheet...</div></div>
    </div>
  );

  const pending = members.filter(m => m.status === "pending");
  const stats = [
    { label: "สมาชิกทั้งหมด", value: members.length, color: "#3B82F6" },
    { label: "อนุมัติแล้ว", value: members.filter(m => m.status === "approved").length, color: "#10B981" },
    { label: "รออนุมัติ", value: pending.length, color: "#F59E0B" },
    { label: "ปฏิเสธ", value: members.filter(m => m.status === "rejected").length, color: "#EF4444" },
  ];

  const navItems = [
    { id: "approvals", label: `อนุมัติสมาชิก${pending.length ? ` (${pending.length})` : ""}`, icon: ICONS.check, roles: ["super_admin","helper"] },
    { id: "members", label: "รายชื่อสมาชิก", icon: ICONS.users, roles: ["super_admin","helper"] },
    { id: "schedule", label: "จัดการตารางเรียน", icon: ICONS.calendar, roles: ["super_admin","helper"] },
    { id: "theme", label: "ปรับธีม", icon: ICONS.settings, roles: ["super_admin"] },
    { id: "admins", label: "จัดการ Admin", icon: ICONS.shield, roles: ["super_admin"] },
  ].filter(n => n.roles.includes(user.role));

  const inputStyle = { width: "100%", background: "rgba(255,255,255,0.05)", border: `1px solid ${theme.border}`, borderRadius: 10, padding: "10px 14px", color: theme.text, fontSize: 14, outline: "none", fontFamily: theme.fontBody };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside style={{ width: 260, background: theme.card, borderRight: `1px solid ${theme.border}`, position: "fixed", top: 0, bottom: 0, left: 0, display: "flex", flexDirection: "column", zIndex: 50, overflowY: "auto" }}>
        <div style={{ padding: "20px 20px 16px", borderBottom: `1px solid ${theme.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: "50%", overflow: "hidden", flexShrink: 0, background: theme.primary }}>
              <img src="/the_owner_logo.png" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => { e.target.style.display="none"; }} />
            </div>
            <div>
              <div style={{ fontFamily: theme.fontDisplay, fontSize: 16, letterSpacing: 2 }}>THE OWNER</div>
              <div style={{ fontSize: 11, color: theme.muted }}>Admin Panel</div>
            </div>
          </div>
        </div>
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
        <nav style={{ flex: 1, padding: 12 }}>
          {navItems.map(n => (
            <button key={n.id} onClick={() => setPage(n.id)}
              style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", border: "none", cursor: "pointer", padding: "12px 14px", borderRadius: 12, marginBottom: 2, background: page === n.id ? theme.primary + "22" : "transparent", color: page === n.id ? theme.primary : theme.muted, fontWeight: page === n.id ? 700 : 400, fontSize: 13, fontFamily: theme.fontBody, textAlign: "left" }}>
              <Ic d={n.icon} size={17} /> {n.label}
            </button>
          ))}
        </nav>
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

      <main style={{ marginLeft: 260, flex: 1, minHeight: "100vh", background: theme.bg, color: theme.text }}>
        <div style={{ padding: "32px 32px 80px" }}>

          {/* APPROVALS */}
          {page === "approvals" && (
            <>
              <h1 style={{ fontFamily: theme.fontDisplay, fontSize: 40, letterSpacing: 2, marginBottom: 8 }}>APPROVE <span style={{ color: theme.primary }}>สมาชิก</span></h1>
              <p style={{ color: theme.muted, marginBottom: 24 }}>ตรวจสอบสลิปและอนุมัติ — ระบบแจ้ง Line OA อัตโนมัติ</p>
              <InfoBox type="info">เมื่อกด <strong>อนุมัติ</strong> ระบบจะส่งข้อความยืนยันผ่าน Line OA ให้สมาชิกโดยอัตโนมัติ</InfoBox>
              {pending.length === 0 ? (
                <Card style={{ textAlign: "center", padding: 64 }}>
                  <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
                  <h3 style={{ fontSize: 22, fontWeight: 700 }}>ไม่มีรายการรออนุมัติ</h3>
                </Card>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: selected ? "minmax(0,1fr) minmax(0,400px)" : "1fr", gap: 24, alignItems: "start" }}>
                  <div>
                    <h3 style={{ fontWeight: 700, marginBottom: 16, color: theme.muted, fontSize: 13, textTransform: "uppercase", letterSpacing: 1 }}>รายการรอตรวจสอบ ({pending.length})</h3>
                    {pending.map(m => (
                      <div key={m.id} onClick={() => setSelected(selected?.id === m.id ? null : m)}
                        style={{ background: theme.card, border: `1px solid ${selected?.id === m.id ? theme.primary : theme.border}`, borderRadius: 16, padding: 20, marginBottom: 12, cursor: "pointer" }}>
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
                  {selected && (
                    <div style={{ position: "sticky", top: 24, maxHeight: "90vh", overflowY: "auto" }}>
                      <Card glow>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                          <h3 style={{ fontWeight: 700, fontSize: 18 }}>รายละเอียด: {selected.name}</h3>
                          <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: theme.muted, cursor: "pointer" }}><Ic d={ICONS.x} size={20} /></button>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                          {[["ชื่อ-นามสกุล", selected.name],["เบอร์โทร", selected.phone],["LINE ID", selected.lineId],["แพ็กเกจ", selected.pkg === "trial" ? "Trial (150฿)" : "Quarter (600฿)"]].map(([k,v]) => (
                            <div key={k} style={{ background: theme.bg, borderRadius: 12, padding: 14 }}>
                              <div style={{ fontSize: 11, color: theme.muted, marginBottom: 4, textTransform: "uppercase" }}>{k}</div>
                              <div style={{ fontWeight: 700 }}>{v}</div>
                            </div>
                          ))}
                        </div>
                        <div style={{ marginBottom: 20 }}>
                          {selected.slip ? (
                            <a href={selected.slip} target="_blank" rel="noreferrer">
                              <img src={selected.slip} style={{ width: "100%", borderRadius: 16, objectFit: "contain", maxHeight: 400, cursor: "pointer", background: "#fff" }} onError={e => { e.target.style.display="none"; }} alt="slip" />
                              <div style={{ textAlign: "center", marginTop: 8, color: theme.accent, fontSize: 13, fontWeight: 600 }}>🔗 คลิกดูสลิปขนาดเต็ม</div>
                            </a>
                          ) : (
                            <div style={{ background: theme.bg, borderRadius: 16, height: 160, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", border: `2px dashed ${theme.border}` }}>
                              <Ic d={ICONS.eye} size={32} /><div style={{ color: theme.muted, fontSize: 13, marginTop: 8 }}>ไม่มีสลิปแนบ</div>
                            </div>
                          )}
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                          <Btn size="md" variant="success" fullWidth onClick={() => approve(selected.id)}><Ic d={ICONS.check} size={18} /> อนุมัติ & แจ้ง Line</Btn>
                          <Btn size="md" variant="danger" fullWidth onClick={() => reject(selected.id)}><Ic d={ICONS.x} size={18} /> ปฏิเสธ & แจ้ง Line</Btn>
                        </div>
                      </Card>
                    </div>
                  )}
                </div>
              )}
              {members.filter(m => m.status !== "pending").length > 0 && (
                <>
                  <h3 style={{ fontWeight: 700, marginTop: 40, marginBottom: 16, color: theme.muted, fontSize: 13, textTransform: "uppercase", letterSpacing: 1 }}>ดำเนินการแล้ว</h3>
                  {members.filter(m => m.status !== "pending").map(m => (
                    <Card key={m.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", marginBottom: 8 }}>
                      <div><span style={{ fontWeight: 700 }}>{m.name}</span><span style={{ color: theme.muted, fontSize: 13, marginLeft: 12 }}>{m.phone}</span></div>
                      <div style={{ display: "flex", gap: 8 }}><StatusBadge status={m.pkg} /><StatusBadge status={m.status} /></div>
                    </Card>
                  ))}
                </>
              )}
            </>
          )}

          {/* MEMBERS */}
          {page === "members" && (
            <>
              <h1 style={{ fontFamily: theme.fontDisplay, fontSize: 40, letterSpacing: 2, marginBottom: 8 }}>รายชื่อ<span style={{ color: theme.primary }}>สมาชิก</span></h1>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 32 }}>
                {stats.map(s => (
                  <Card key={s.label} style={{ textAlign: "center", padding: 20 }}>
                    <div style={{ fontFamily: theme.fontDisplay, fontSize: 40, color: s.color }}>{s.value}</div>
                    <div style={{ fontSize: 12, color: theme.muted, marginTop: 4 }}>{s.label}</div>
                  </Card>
                ))}
              </div>
              <Card style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 6px", minWidth: 900 }}>
                  <thead>
                    <tr style={{ color: theme.muted, fontSize: 12, textTransform: "uppercase", letterSpacing: 1 }}>
                      {["ชื่อ","เบอร์","Line ID","แพ็กเกจ","สถานะ","หมดอายุ","จัดการ"].map(h => <th key={h} style={{ textAlign: "left", padding: "8px 14px", fontWeight: 600 }}>{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {members.map(m => (
                      <tr key={m.id}>
                        <td style={{ padding: 14, background: theme.surface, borderRadius: "10px 0 0 10px", fontWeight: 700 }}>{m.name}</td>
                        <td style={{ padding: 14, background: theme.surface, color: theme.muted, fontSize: 13 }}>{m.phone}</td>
                        <td style={{ padding: 14, background: theme.surface, fontSize: 12, color: theme.muted }}>{m.lineId}</td>
                        <td style={{ padding: 14, background: theme.surface }}><StatusBadge status={m.pkg} /></td>
                        <td style={{ padding: 14, background: theme.surface }}><StatusBadge status={m.status} /></td>
                        <td style={{ padding: 14, background: theme.surface, color: theme.muted, fontSize: 13 }}>{m.expiresAt ? String(m.expiresAt).slice(0,10) : "—"}</td>
                        <td style={{ padding: 14, background: theme.surface, borderRadius: "0 10px 10px 0" }}>
                          {m.status === "pending" && (
                            <div style={{ display: "flex", gap: 6 }}>
                              <Btn size="sm" variant="success" onClick={() => approve(m.id)}>อนุมัติ</Btn>
                              <Btn size="sm" variant="danger" onClick={() => reject(m.id)}>ปฏิเสธ</Btn>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            </>
          )}

          {/* SCHEDULE */}
          {page === "schedule" && (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
                <div>
                  <h1 style={{ fontFamily: theme.fontDisplay, fontSize: 40, letterSpacing: 2, marginBottom: 4 }}>จัดการ<span style={{ color: theme.primary }}>ตารางเรียน</span></h1>
                  <p style={{ color: theme.muted }}>จัดการตารางเรียนและดูรายชื่อ Check-in</p>
                </div>
                <Btn onClick={() => setShowAddSched(!showAddSched)}><Ic d={ICONS.plus} size={18} /> เพิ่มตารางเรียน</Btn>
              </div>

              {showAddSched && (
                <Card style={{ marginBottom: 24, border: `1px solid ${theme.primary}40` }}>
                  <h3 style={{ fontWeight: 700, marginBottom: 20 }}>เพิ่มตารางเรียนใหม่</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
                    {[
                      { label: "วันที่", el: <input type="date" style={inputStyle} value={newSched.date} onChange={e => setNewSched({...newSched, date: e.target.value})} /> },
                      { label: "เวลา", el: <input style={inputStyle} placeholder="09:00–12:00" value={newSched.time} onChange={e => setNewSched({...newSched, time: e.target.value})} /> },
                      { label: "คอร์ส", el: <select style={inputStyle} value={newSched.course} onChange={e => setNewSched({...newSched, course: e.target.value})}>{COURSES.map(c => <option key={c.id}>{c.name}</option>)}</select> },
                      { label: "รูปแบบ", el: <select style={inputStyle} value={newSched.mode} onChange={e => setNewSched({...newSched, mode: e.target.value})}><option value="online">Online</option><option value="onsite">Onsite</option></select> },
                      { label: "ที่นั่ง", el: <input type="number" style={inputStyle} value={newSched.seats} onChange={e => setNewSched({...newSched, seats: +e.target.value})} /> },
                    ].map(({label, el}) => (
                      <div key={label}>
                        <label style={{ display: "block", fontSize: 12, color: theme.muted, marginBottom: 6, fontWeight: 600 }}>{label}</label>
                        {el}
                      </div>
                    ))}
                  </div>
                  {newSched.mode === "online" && (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
                      {[["Zoom Meeting ID","zoomId"],["Zoom Password","zoomPw"]].map(([label, key]) => (
                        <div key={key}>
                          <label style={{ display: "block", fontSize: 12, color: theme.muted, marginBottom: 6, fontWeight: 600 }}>{label}</label>
                          <input style={inputStyle} value={newSched[key]} onChange={e => setNewSched({...newSched, [key]: e.target.value})} />
                        </div>
                      ))}
                    </div>
                  )}
                  <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
                    <Btn onClick={async () => {
                      try {
                        const res = await fetch(GAS_URL, { method: "POST", body: JSON.stringify({ action: "addSchedule", ...newSched }) });
                        const result = await res.json();
                        if (result.success) {
                          const refreshed = await fetch(GAS_URL + "?action=getSchedules").then(r => r.json());
                          if (refreshed.success) setSchedules(refreshed.data);
                          setShowAddSched(false);
                          setNewSched({ date: "", time: "", course: COURSES[0].name, mode: "online", seats: 20, zoomId: "", zoomPw: "" });
                          alert("✅ เพิ่มตารางเรียนสำเร็จ!");
                        }
                      } catch { alert("เกิดข้อผิดพลาด"); }
                    }}>💾 บันทึกลง Google Sheet</Btn>
                    <Btn variant="ghost" onClick={() => setShowAddSched(false)}>ยกเลิก</Btn>
                  </div>
                </Card>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {schedules.map(s => (
                  <Card key={s.id} style={{ padding: 0, overflow: "hidden" }}>
                    <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                      <div style={{ minWidth: 80 }}>
                        <div style={{ fontWeight: 700 }}>{String(s.date).slice(0,10)}</div>
                        <div style={{ fontSize: 12, color: theme.muted }}>{s.time}</div>
                      </div>
                      <StatusBadge status={s.mode} />
                      <div style={{ flex: 1, minWidth: 160 }}>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{s.course}</div>
                        {s.zoomId && <div style={{ fontSize: 12, color: theme.muted }}>ID: {s.zoomId}</div>}
                      </div>
                      <div style={{ textAlign: "center", minWidth: 60 }}>
                        <div style={{ fontWeight: 700 }}>{s.taken || 0}/{s.seats}</div>
                        <div style={{ fontSize: 11, color: theme.muted }}>ที่นั่ง</div>
                      </div>
                      <button
                        onClick={() => setQrSchedule(qrSchedule?.id === s.id ? null : s)}
                        style={{ background: qrSchedule?.id === s.id ? theme.primary + "33" : "rgba(255,255,255,0.07)", border: `1px solid ${qrSchedule?.id === s.id ? theme.primary : theme.border}`, color: qrSchedule?.id === s.id ? theme.primary : theme.text, padding: "8px 14px", borderRadius: 10, cursor: "pointer", fontSize: 13, fontFamily: theme.fontBody, fontWeight: 700 }}>
                        📱 QR Code
                      </button>
                      <button onClick={async () => {
                        if (!confirm("ลบตารางเรียนนี้?")) return;
                        try {
                          const res = await fetch(GAS_URL, { method: "POST", body: JSON.stringify({ action: "deleteSchedule", scheduleId: s.id }) });
                          const result = await res.json();
                          if (result.success) { setSchedules(schedules.filter(x => x.id !== s.id)); if (qrSchedule?.id === s.id) setQrSchedule(null); }
                        } catch { alert("เกิดข้อผิดพลาด"); }
                      }} style={{ background: "rgba(239,68,68,0.15)", border: "none", color: "#EF4444", padding: "8px 10px", borderRadius: 8, cursor: "pointer" }}>
                        <Ic d={ICONS.trash} size={15} />
                      </button>
                    </div>

                    {qrSchedule?.id === s.id && (
                      <div style={{ borderTop: `1px solid ${theme.border}`, padding: 24, background: theme.bg, display: "grid", gridTemplateColumns: "auto 1fr", gap: 32, alignItems: "start" }}>
                        <div style={{ textAlign: "center" }}>
                          <div style={{ background: "#fff", padding: 16, borderRadius: 16, display: "inline-block", marginBottom: 10 }}>
                            <img
                              src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(`https://liff.line.me/${LIFF_ID}?checkin=${s.id}&type=emergency`)}`}
                              style={{ width: 180, height: 180, display: "block" }}
                              alt="QR Check-in"
                            />
                          </div>
                          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>QR Check-in ฉุกเฉิน</div>
                          <div style={{ fontSize: 12, color: "#EF4444", marginBottom: 12 }}>⚠️ มีค่าปรับ 100฿</div>
                          <a
                            href={`https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(`https://liff.line.me/${LIFF_ID}?checkin=${s.id}&type=emergency`)}`}
                            download={`QR_${s.course}_${String(s.date).slice(0,10)}.png`}
                            style={{ display: "inline-block", padding: "8px 20px", background: theme.primary, color: "#fff", borderRadius: 10, fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
                            ⬇️ ดาวน์โหลด QR
                          </a>
                        </div>
                        <CheckinList scheduleId={s.id} theme={theme} gasUrl={GAS_URL} />
                      </div>
                    )}
                  </Card>
                ))}
              </div>
              {copyMsg && <div style={{ position: "fixed", bottom: 32, right: 32, background: theme.accent, color: "#000", padding: "12px 24px", borderRadius: 12, fontWeight: 700, zIndex: 200 }}>✓ {copyMsg}</div>}
            </>
          )}

          {/* THEME */}
          {page === "theme" && user.role === "super_admin" && (
            <>
              <h1 style={{ fontFamily: theme.fontDisplay, fontSize: 40, letterSpacing: 2, marginBottom: 32 }}>ปรับแต่ง<span style={{ color: theme.primary }}>ธีม</span></h1>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 24, alignItems: "start" }}>
                <Card>
                  <h3 style={{ fontWeight: 700, marginBottom: 20 }}>🎨 สี</h3>
                  {[["สีหลัก","primary"],["สีเน้น","accent"],["พื้นหลัง","bg"],["Card BG","card"]].map(([label, key]) => (
                    <div key={key} style={{ marginBottom: 16 }}>
                      <label style={{ fontSize: 13, color: theme.muted, display: "block", marginBottom: 8, fontWeight: 600 }}>{label}</label>
                      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                        <input type="color" value={theme[key]} onChange={e => setTheme({...theme, [key]: e.target.value})} style={{ width: 44, height: 40, border: "none", borderRadius: 8, cursor: "pointer" }} />
                        <input value={theme[key]} onChange={e => setTheme({...theme, [key]: e.target.value})} style={{ ...inputStyle, flex: 1, fontFamily: "monospace" }} />
                      </div>
                    </div>
                  ))}
                  <div style={{ marginTop: 8 }}>
                    <label style={{ fontSize: 13, color: theme.muted, display: "block", marginBottom: 8, fontWeight: 600 }}>ขนาดฟอนต์: {theme.fontSize}px</label>
                    <input type="range" min={13} max={20} value={theme.fontSize} onChange={e => setTheme({...theme, fontSize: +e.target.value})} style={{ width: "100%" }} />
                  </div>
                </Card>
                <div style={{ position: "sticky", top: 24 }}>
                  <Card>
                    <h3 style={{ fontWeight: 700, marginBottom: 16 }}>ตัวอย่าง</h3>
                    <div style={{ background: theme.bg, borderRadius: 16, padding: 24, marginBottom: 16 }}>
                      <div style={{ fontFamily: theme.fontDisplay, fontSize: 36, textAlign: "center", letterSpacing: 3, marginBottom: 8 }}>THE <span style={{ color: theme.primary }}>OWNER</span></div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <div style={{ flex: 1, background: theme.primary, borderRadius: 10, padding: 10, textAlign: "center", color: "#fff", fontWeight: 700, fontSize: 13 }}>สมัครเลย</div>
                        <div style={{ flex: 1, background: theme.accent, borderRadius: 10, padding: 10, textAlign: "center", color: "#000", fontWeight: 700, fontSize: 13 }}>ดูคอร์ส</div>
                      </div>
                    </div>
                    <Btn variant="ghost" fullWidth onClick={() => setTheme(DEFAULT_THEME)}>🔄 รีเซ็ตค่าเริ่มต้น</Btn>
                  </Card>
                </div>
              </div>
            </>
          )}

          {/* ADMINS */}
          {page === "admins" && user.role === "super_admin" && (
            <>
              <h1 style={{ fontFamily: theme.fontDisplay, fontSize: 40, letterSpacing: 2, marginBottom: 32 }}>จัดการ<span style={{ color: theme.primary }}>Admin</span></h1>
              <Card>
                <h3 style={{ fontWeight: 700, marginBottom: 20 }}>รายชื่อ Admin & สิทธิ์</h3>
                {[{name:"Super Admin",email:"admin@theowner.com",role:"super_admin"},{name:"ผู้ช่วย Admin",email:"helper@theowner.com",role:"helper"}].map((a, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", borderBottom: `1px solid ${theme.border}` }}>
                    <div>
                      <div style={{ fontWeight: 700 }}>{a.name}</div>
                      <div style={{ fontSize: 13, color: theme.muted }}>{a.email}</div>
                    </div>
                    <select defaultValue={a.role} style={{ ...inputStyle, width: "auto" }}>
                      <option value="super_admin">Super Admin</option>
                      <option value="helper">Helper</option>
                    </select>
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

// ─── ROOT APP ─────────────────────────────────
export default function App() {
  // อ่าน URL params จาก QR Code
  const urlParams = new URLSearchParams(window.location.search);
  const qrCheckinId = urlParams.get("checkin");
  const qrCheckinType = urlParams.get("type");

  const [view, setView] = useState(qrCheckinId ? "checkin" : "landing");
  const [adminUser, setAdminUser] = useState(null);
  const [theme, setTheme] = useState(DEFAULT_THEME);
  window.__theme = theme;

  return (
    <>
      <GlobalStyles theme={theme} />
      {view === "landing" && <LandingPage theme={theme} onAdmin={() => setView("admin-login")} autoCheckinId={qrCheckinId} autoCheckinType={qrCheckinType} />}
      {view === "admin-login" && <AdminLogin theme={theme} onLogin={u => { setAdminUser(u); setView("admin"); }} onBack={() => setView("landing")} />}
      {view === "admin" && adminUser && <AdminDashboard user={adminUser} theme={theme} setTheme={setTheme} onLogout={() => { setAdminUser(null); setView("admin-login"); }} onLanding={() => setView("landing")} />}
    </>
  );
}
