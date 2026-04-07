import { useState } from "react";

const BRANCHES = ["Laxmi Nagar", "Raya"];

const BC = {
  "Laxmi Nagar": { accent: "#38bdf8", dim: "#38bdf822", border: "#38bdf833" },
  Raya: { accent: "#a78bfa", dim: "#a78bfa22", border: "#a78bfa33" },
};

const INITIAL_DEPARTMENTS = {
  "Laxmi Nagar": [
    { id: 1, name: "Cardiology", head: "Dr. Sharma", beds: 20, staff: 8 },
    { id: 2, name: "Orthopedics", head: "Dr. Mehta", beds: 15, staff: 6 },
  ],
  Raya: [
    { id: 1, name: "General Medicine", head: "Dr. Verma", beds: 30, staff: 12 },
  ],
};

const INITIAL_PATIENTS = {
  "Laxmi Nagar": [
    { id: 1, name: "Ramesh Kumar", age: 54, gender: "M", dept: "Cardiology", status: "Admitted", paymentType: "Cash", cashAmount: 8500, cashlessAmount: 0, cashlessProvider: "", admitDate: "2026-03-28", uhid: "LN-0041" },
    { id: 2, name: "Priya Singh", age: 32, gender: "F", dept: "Orthopedics", status: "Discharged", paymentType: "Cashless", cashAmount: 0, cashlessAmount: 12000, cashlessProvider: "Star Health", admitDate: "2026-03-20", uhid: "LN-0042" },
    { id: 3, name: "Ajay Nair", age: 67, gender: "M", dept: "Cardiology", status: "Admitted", paymentType: "Both", cashAmount: 3000, cashlessAmount: 9000, cashlessProvider: "HDFC ERGO", admitDate: "2026-04-01", uhid: "LN-0043" },
  ],
  Raya: [
    { id: 1, name: "Sunita Devi", age: 45, gender: "F", dept: "General Medicine", status: "Admitted", paymentType: "Cashless", cashAmount: 0, cashlessAmount: 5500, cashlessProvider: "Bajaj Allianz", admitDate: "2026-04-03", uhid: "RY-0011" },
    { id: 2, name: "Vikram Rao", age: 38, gender: "M", dept: "General Medicine", status: "Discharged", paymentType: "Cash", cashAmount: 4200, cashlessAmount: 0, cashlessProvider: "", admitDate: "2026-03-25", uhid: "RY-0012" },
  ],
};

const INITIAL_USERS = [
  { id: 1, name: "Dr. Anita Rao", role: "Doctor", branch: "Laxmi Nagar", email: "anita@sangi.in", status: "Active" },
  { id: 2, name: "Renu Kapoor", role: "Nurse", branch: "Raya", email: "renu@sangi.in", status: "Active" },
  { id: 3, name: "Suresh Pillai", role: "Receptionist", branch: "Laxmi Nagar", email: "suresh@sangi.in", status: "Inactive" },
];

const ROLES = ["Doctor", "Nurse", "Receptionist", "Lab Technician", "Pharmacist", "Admin Staff"];
const PAYMENT_TYPES = ["Cash", "Cashless", "Both"];
const INSURERS = ["Star Health", "HDFC ERGO", "Bajaj Allianz", "New India", "United India", "ICICI Lombard", "Max Bupa"];

const NAV = [
  { id: "overview", label: "Overview", icon: "◈" },
  { id: "patients", label: "Patients", icon: "♥" },
  { id: "departments", label: "Departments", icon: "⊞" },
  { id: "users", label: "Users", icon: "◎" },
  { id: "billing", label: "Billing", icon: "₹" },
  { id: "discharge", label: "Discharge", icon: "↗" },
  { id: "invoices", label: "Invoices", icon: "≡" },
];

const fmt = (n) => "₹" + Number(n).toLocaleString("en-IN");

export default function App() {
  const [activeTab, setActiveTab] = useState("overview");
  const [branch, setBranch] = useState("Laxmi Nagar");
  const [collapsed, setCollapsed] = useState(false);
  const [departments, setDepartments] = useState(INITIAL_DEPARTMENTS);
  const [patients, setPatients] = useState(INITIAL_PATIENTS);
  const [users, setUsers] = useState(INITIAL_USERS);
  const [showDeptModal, setShowDeptModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [editPatient, setEditPatient] = useState(null);
  const [notif, setNotif] = useState(null);
  const [deptForm, setDeptForm] = useState({ name: "", head: "", beds: "", staff: "" });
  const [userForm, setUserForm] = useState({ name: "", role: "Doctor", branch: "Laxmi Nagar", email: "", status: "Active" });
  const [patientForm, setPatientForm] = useState({ name: "", age: "", gender: "M", dept: "", status: "Admitted", paymentType: "Cash", cashAmount: "", cashlessAmount: "", cashlessProvider: "", admitDate: "", uhid: "" });

  const toast = (msg, type = "ok") => { setNotif({ msg, type }); setTimeout(() => setNotif(null), 3000); };

  const branchPts = patients[branch] || [];
  const branchDepts = departments[branch] || [];
  const branchUsers = users.filter(u => u.branch === branch);
  const totalCash = branchPts.reduce((s, p) => s + (p.cashAmount || 0), 0);
  const totalCashless = branchPts.reduce((s, p) => s + (p.cashlessAmount || 0), 0);
  const totalRev = totalCash + totalCashless;
  const admitted = branchPts.filter(p => p.status === "Admitted").length;
  const discharged = branchPts.filter(p => p.status === "Discharged").length;

  const addDept = () => {
    if (!deptForm.name || !deptForm.head || !deptForm.beds) return;
    const d = { id: Date.now(), name: deptForm.name, head: deptForm.head, beds: +deptForm.beds, staff: +deptForm.staff || 0 };
    setDepartments(p => ({ ...p, [branch]: [...p[branch], d] }));
    setDeptForm({ name: "", head: "", beds: "", staff: "" });
    setShowDeptModal(false);
    toast(`"${d.name}" added to ${branch}`);
  };

  const delDept = (id) => { setDepartments(p => ({ ...p, [branch]: p[branch].filter(d => d.id !== id) })); toast("Removed", "warn"); };

  const saveUser = () => {
    if (!userForm.name || !userForm.email) return;
    if (editUser) { setUsers(p => p.map(u => u.id === editUser.id ? { ...userForm, id: u.id } : u)); toast("User updated"); }
    else { setUsers(p => [...p, { ...userForm, id: Date.now() }]); toast(`"${userForm.name}" created`); }
    setUserForm({ name: "", role: "Doctor", branch: "Laxmi Nagar", email: "", status: "Active" });
    setShowUserModal(false); setEditUser(null);
  };

  const delUser = (id) => { setUsers(p => p.filter(u => u.id !== id)); toast("Removed", "warn"); };
  const openEditUser = (u) => { setEditUser(u); setUserForm({ ...u }); setShowUserModal(true); };

  const savePatient = () => {
    if (!patientForm.name || !patientForm.dept) return;
    const p = { ...patientForm, id: Date.now(), cashAmount: +patientForm.cashAmount || 0, cashlessAmount: +patientForm.cashlessAmount || 0, age: +patientForm.age };
    if (editPatient) { setPatients(prev => ({ ...prev, [branch]: prev[branch].map(x => x.id === editPatient.id ? { ...p, id: x.id } : x) })); toast("Patient updated"); }
    else { setPatients(prev => ({ ...prev, [branch]: [...prev[branch], p] })); toast(`"${p.name}" added`); }
    setPatientForm({ name: "", age: "", gender: "M", dept: "", status: "Admitted", paymentType: "Cash", cashAmount: "", cashlessAmount: "", cashlessProvider: "", admitDate: "", uhid: "" });
    setShowPatientModal(false); setEditPatient(null);
  };

  const delPatient = (id) => { setPatients(prev => ({ ...prev, [branch]: prev[branch].filter(p => p.id !== id) })); toast("Removed", "warn"); };
  const openEditPatient = (p) => { setEditPatient(p); setPatientForm({ ...p, cashAmount: String(p.cashAmount), cashlessAmount: String(p.cashlessAmount) }); setShowPatientModal(true); };
  const openAddPatient = () => { setEditPatient(null); setPatientForm({ name: "", age: "", gender: "M", dept: branchDepts[0]?.name || "", status: "Admitted", paymentType: "Cash", cashAmount: "", cashlessAmount: "", cashlessProvider: "", admitDate: new Date().toISOString().slice(0, 10), uhid: "" }); setShowPatientModal(true); };

  const accent = BC[branch].accent;

  // ─── styles ───────────────────────────────────────────────────────────────
  const c = {
    wrap: { display: "flex", flexDirection: "column", height: "100vh", background: "#0d1117", fontFamily: "'DM Sans','Segoe UI',sans-serif", color: "#e2e8f0", overflow: "hidden" },
    hdr: { height: 54, background: "#0d1117", borderBottom: "1px solid #161d2e", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 18px", flexShrink: 0, zIndex: 10 },
    body: { display: "flex", flex: 1, overflow: "hidden" },

    // sidebar
    sb: { width: collapsed ? 52 : 210, background: "#090d14", borderRight: "1px solid #161d2e", display: "flex", flexDirection: "column", transition: "width 0.22s ease", flexShrink: 0, overflow: "hidden" },
    sbTop: { padding: collapsed ? "14px 8px" : "14px 12px", borderBottom: "1px solid #161d2e", flexShrink: 0 },
    sbLabel: { fontSize: 9, fontWeight: 700, color: "#2d3a50", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 7, paddingLeft: 2 },

    // branch switcher
    bsWrap: { background: "#0d1117", border: "1px solid #161d2e", borderRadius: 9, overflow: "hidden" },
    bsBtn: (b) => ({
      width: "100%", display: "flex", alignItems: "center", gap: 8,
      padding: collapsed ? "9px 0" : "9px 11px",
      justifyContent: collapsed ? "center" : "flex-start",
      background: branch === b ? BC[b].dim : "transparent",
      borderLeft: branch === b ? `2px solid ${BC[b].accent}` : "2px solid transparent",
      cursor: "pointer", border: "none",
      color: branch === b ? BC[b].accent : "#3a4a60",
      fontSize: 12, fontWeight: branch === b ? 700 : 400,
      transition: "all 0.15s",
    }),
    bsDot: (b) => ({ width: 7, height: 7, borderRadius: "50%", background: BC[b].accent, flexShrink: 0 }),

    navWrap: { flex: 1, padding: "10px 0", overflowY: "auto" },
    navSection: { fontSize: 9, fontWeight: 700, color: "#2d3a50", letterSpacing: "0.1em", textTransform: "uppercase", padding: collapsed ? "0" : "0 14px", marginBottom: 5, marginTop: 4, textAlign: collapsed ? "center" : "left" },
    navItem: (active) => ({
      display: "flex", alignItems: "center", gap: 9,
      padding: collapsed ? "10px 0" : "10px 14px",
      justifyContent: collapsed ? "center" : "flex-start",
      cursor: "pointer", fontSize: 12, fontWeight: active ? 600 : 400,
      color: active ? "#f1f5f9" : "#3a4a60",
      background: active ? "#ffffff0a" : "transparent",
      borderLeft: active ? `2px solid ${accent}` : "2px solid transparent",
      transition: "all 0.15s", whiteSpace: "nowrap",
    }),
    navIcon: { fontSize: 14, flexShrink: 0, width: 16, textAlign: "center" },

    sbBot: { padding: collapsed ? "10px 8px" : "10px 12px", borderTop: "1px solid #161d2e", flexShrink: 0 },
    colBtn: { width: "100%", background: "transparent", border: "1px solid #161d2e", borderRadius: 7, color: "#2d3a50", cursor: "pointer", padding: "6px", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center" },

    // main
    main: { flex: 1, overflowY: "auto", padding: "22px 26px" },

    // header parts
    logoRow: { display: "flex", alignItems: "center", gap: 10 },
    logoIcon: { width: 30, height: 30, borderRadius: 8, background: "linear-gradient(135deg,#38bdf8,#a78bfa)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, color: "#fff" },
    logoText: { fontSize: 14, fontWeight: 700, color: "#f1f5f9" },
    logoSub: { fontSize: 9, color: "#2d3a50" },
    hdrRight: { display: "flex", alignItems: "center", gap: 10 },
    roleBadge: { background: "#a78bfa15", border: "1px solid #a78bfa30", color: "#a78bfa", fontSize: 9, fontWeight: 700, padding: "3px 9px", borderRadius: 20, letterSpacing: "0.07em" },
    avatar: { width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg,#a78bfa,#38bdf8)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 11, color: "#fff" },
    logoutBtn: { background: "transparent", border: "1px solid #161d2e", color: "#3a4a60", padding: "4px 11px", borderRadius: 7, cursor: "pointer", fontSize: 11 },

    // content elements
    pgLabel: { fontSize: 10, fontWeight: 700, color: "#2d3a50", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 },
    branchPill: { display: "inline-flex", alignItems: "center", gap: 5, background: BC[branch].dim, border: `1px solid ${BC[branch].border}`, color: accent, fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 20, marginBottom: 18, letterSpacing: "0.04em" },

    statGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 12, marginBottom: 20 },
    statCard: (a) => ({ background: "#0d1117", border: `1px solid ${a || "#161d2e"}`, borderRadius: 11, padding: "14px 16px" }),
    statNum: (c2) => ({ fontSize: 22, fontWeight: 700, color: c2 || "#f1f5f9", lineHeight: 1.2, marginBottom: 3 }),
    statLabel: { fontSize: 10, color: "#3a4a60", fontWeight: 500 },
    statSub: { fontSize: 9, color: "#2d3a50", marginTop: 1 },

    card: { background: "#0d1117", border: "1px solid #161d2e", borderRadius: 13, padding: "16px 18px", marginBottom: 18 },
    cardRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
    cardTitle: { fontSize: 12, fontWeight: 600, color: "#e2e8f0" },
    addBtn: { background: `linear-gradient(135deg,${accent},${accent}cc)`, border: "none", color: "#fff", padding: "6px 13px", borderRadius: 7, cursor: "pointer", fontSize: 11, fontWeight: 700 },

    tbl: { width: "100%", borderCollapse: "collapse" },
    th: { textAlign: "left", fontSize: 9, color: "#2d3a50", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "0 9px 9px", borderBottom: "1px solid #161d2e" },
    td: { padding: "10px 9px", borderBottom: "1px solid #161d2e50", fontSize: 11, color: "#94a3b8", verticalAlign: "middle" },
    badge: (bc) => ({ display: "inline-block", background: bc + "20", color: bc, border: `1px solid ${bc}40`, fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 20, whiteSpace: "nowrap" }),
    aBtn: (bc) => ({ background: "transparent", border: `1px solid ${bc}40`, color: bc, padding: "3px 8px", borderRadius: 6, cursor: "pointer", fontSize: 10 }),
    cashPill: { display: "inline-block", background: "#10b98118", color: "#10b981", border: "1px solid #10b98138", fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 20 },
    cashlessPill: { display: "inline-block", background: "#f59e0b18", color: "#f59e0b", border: "1px solid #f59e0b38", fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 20 },
    dash: { color: "#1f2937", fontSize: 11 },

    modal: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.78)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 },
    modalBox: { background: "#0d1117", border: "1px solid #161d2e", borderRadius: 16, padding: "22px", width: 450, maxWidth: "92vw", maxHeight: "88vh", overflowY: "auto" },
    modalTitle: { fontSize: 14, fontWeight: 700, color: "#f1f5f9", marginBottom: 16 },
    lbl: { display: "block", fontSize: 9, color: "#3a4a60", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 4 },
    inp: { width: "100%", background: "#090d14", border: "1px solid #161d2e", borderRadius: 7, padding: "8px 10px", color: "#e2e8f0", fontSize: 11, marginBottom: 12, boxSizing: "border-box", outline: "none" },
    sel: { width: "100%", background: "#090d14", border: "1px solid #161d2e", borderRadius: 7, padding: "8px 10px", color: "#e2e8f0", fontSize: 11, marginBottom: 12, boxSizing: "border-box", outline: "none" },
    mFoot: { display: "flex", gap: 9, marginTop: 4 },
    cancelBtn: { flex: 1, background: "transparent", border: "1px solid #161d2e", color: "#3a4a60", padding: "8px", borderRadius: 7, cursor: "pointer", fontSize: 11 },
    saveBtn: { flex: 1, background: `linear-gradient(135deg,${accent},${accent}cc)`, border: "none", color: "#fff", padding: "8px", borderRadius: 7, cursor: "pointer", fontSize: 11, fontWeight: 700 },
    divider: { fontSize: 9, fontWeight: 700, color: "#2d3a50", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 9, marginTop: 2, paddingBottom: 5, borderBottom: "1px solid #161d2e" },
    g2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },
    notif: (t) => ({ position: "fixed", top: 14, right: 14, background: t === "ok" ? "#052e1c" : "#3b0f05", border: `1px solid ${t === "ok" ? "#10b981" : "#f97316"}`, color: t === "ok" ? "#6ee7b7" : "#fed7aa", padding: "9px 16px", borderRadius: 9, fontSize: 11, fontWeight: 600, zIndex: 999 }),
    empty: { textAlign: "center", padding: "2rem", color: "#2d3a50", fontSize: 12 },
  };

  const BranchHeader = ({ title }) => (
    <div style={{ marginBottom: 18 }}>
      <div style={c.pgLabel}>{title}</div>
      <div style={c.branchPill}><div style={c.bsDot(branch)} />{branch}</div>
    </div>
  );

  // ─── OVERVIEW ─────────────────────────────────────────────────────────────
  const renderOverview = () => (
    <div>
      <BranchHeader title="Overview" />
      <div style={c.statGrid}>
        {[
          { label: "Total Patients", sub: "All time", val: branchPts.length, col: accent, acc: accent + "20" },
          { label: "Admitted", sub: "Currently", val: admitted, col: "#10b981", acc: "#10b98120" },
          { label: "Discharged", sub: "All time", val: discharged, col: "#6b7280", acc: "#6b728020" },
          { label: "Total Revenue", sub: "Cash + Cashless", val: fmt(totalRev), col: "#f59e0b", acc: "#f59e0b20" },
          { label: "Cash Collected", sub: "Direct", val: fmt(totalCash), col: "#10b981", acc: "#10b98120" },
          { label: "Cashless Claims", sub: "Insurance", val: fmt(totalCashless), col: "#a78bfa", acc: "#a78bfa20" },
          { label: "Departments", sub: branch, val: branchDepts.length, col: accent, acc: accent + "20" },
          { label: "Active Staff", sub: branch, val: branchUsers.filter(u => u.status === "Active").length, col: "#a78bfa", acc: "#a78bfa20" },
        ].map((s, i) => (
          <div key={i} style={c.statCard(s.acc)}>
            <div style={c.statNum(s.col)}>{s.val}</div>
            <div style={c.statLabel}>{s.label}</div>
            <div style={c.statSub}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={c.card}>
        <div style={c.cardTitle}>Revenue Breakdown — Cash vs Cashless</div>
        <div style={{ marginTop: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
            <span style={{ fontSize: 11, color: "#10b981", fontWeight: 700 }}>Cash {fmt(totalCash)}</span>
            <span style={{ fontSize: 11, color: "#a78bfa", fontWeight: 700 }}>Cashless {fmt(totalCashless)}</span>
          </div>
          <div style={{ height: 7, background: "#161d2e", borderRadius: 7, overflow: "hidden" }}>
            {totalRev > 0 && <div style={{ height: "100%", width: `${Math.round((totalCash / totalRev) * 100)}%`, background: "linear-gradient(90deg,#10b981,#059669)", borderRadius: 7 }} />}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
            <span style={{ fontSize: 9, color: "#2d3a50" }}>Cash — {totalRev > 0 ? Math.round((totalCash / totalRev) * 100) : 0}%</span>
            <span style={{ fontSize: 9, color: "#2d3a50" }}>Cashless — {totalRev > 0 ? Math.round((totalCashless / totalRev) * 100) : 0}%</span>
          </div>
        </div>
      </div>

      <div style={c.card}>
        <div style={c.cardRow}>
          <div style={c.cardTitle}>Recent Patients</div>
          <button style={c.addBtn} onClick={() => setActiveTab("patients")}>View All</button>
        </div>
        <table style={c.tbl}>
          <thead><tr>{["Patient", "UHID", "Dept", "Status", "Cash", "Cashless"].map(h => <th key={h} style={c.th}>{h}</th>)}</tr></thead>
          <tbody>
            {branchPts.slice(0, 5).map(p => (
              <tr key={p.id}>
                <td style={c.td}><strong style={{ color: "#f1f5f9" }}>{p.name}</strong><div style={{ fontSize: 9, color: "#2d3a50" }}>{p.age}y · {p.gender}</div></td>
                <td style={{ ...c.td, fontFamily: "monospace", fontSize: 10, color: "#2d3a50" }}>{p.uhid}</td>
                <td style={c.td}>{p.dept}</td>
                <td style={c.td}><span style={c.badge(p.status === "Admitted" ? "#10b981" : "#6b7280")}>{p.status}</span></td>
                <td style={c.td}>{p.cashAmount > 0 ? <span style={c.cashPill}>{fmt(p.cashAmount)}</span> : <span style={c.dash}>—</span>}</td>
                <td style={c.td}>{p.cashlessAmount > 0 ? <span style={c.cashlessPill}>{fmt(p.cashlessAmount)}</span> : <span style={c.dash}>—</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // ─── PATIENTS ─────────────────────────────────────────────────────────────
  const renderPatients = () => (
    <div>
      <BranchHeader title="Patients" />
      <div style={{ ...c.cardRow, marginBottom: 14 }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {[
            { label: "Admitted", val: admitted, col: "#10b981", acc: "#10b98120" },
            { label: "Discharged", val: discharged, col: "#6b7280", acc: "#6b728020" },
            { label: "Cash", val: fmt(totalCash), col: "#10b981", acc: "#10b98120" },
            { label: "Cashless", val: fmt(totalCashless), col: "#a78bfa", acc: "#a78bfa20" },
          ].map((s, i) => (
            <div key={i} style={{ ...c.statCard(s.acc), padding: "10px 14px" }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: s.col }}>{s.val}</div>
              <div style={c.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>
        <button style={c.addBtn} onClick={openAddPatient}>+ Add Patient</button>
      </div>

      <div style={c.card}>
        {branchPts.length === 0 ? <div style={c.empty}>No patients for {branch} yet.</div> : (
          <table style={c.tbl}>
            <thead><tr>{["Patient / UHID", "Dept", "Date", "Status", "Type", "Cash", "Cashless", "Provider", "Actions"].map(h => <th key={h} style={c.th}>{h}</th>)}</tr></thead>
            <tbody>
              {branchPts.map(p => (
                <tr key={p.id}>
                  <td style={c.td}>
                    <strong style={{ color: "#f1f5f9", display: "block" }}>{p.name}</strong>
                    <span style={{ fontFamily: "monospace", fontSize: 9, color: "#2d3a50" }}>{p.uhid} · {p.age}y {p.gender}</span>
                  </td>
                  <td style={c.td}>{p.dept}</td>
                  <td style={{ ...c.td, fontSize: 10, color: "#2d3a50" }}>{p.admitDate}</td>
                  <td style={c.td}><span style={c.badge(p.status === "Admitted" ? "#10b981" : "#6b7280")}>{p.status}</span></td>
                  <td style={c.td}><span style={c.badge(p.paymentType === "Cash" ? "#10b981" : p.paymentType === "Cashless" ? "#f59e0b" : "#38bdf8")}>{p.paymentType}</span></td>
                  <td style={c.td}>{p.cashAmount > 0 ? <span style={c.cashPill}>{fmt(p.cashAmount)}</span> : <span style={c.dash}>—</span>}</td>
                  <td style={c.td}>{p.cashlessAmount > 0 ? <span style={c.cashlessPill}>{fmt(p.cashlessAmount)}</span> : <span style={c.dash}>—</span>}</td>
                  <td style={{ ...c.td, fontSize: 10, color: "#3a4a60" }}>{p.cashlessProvider || "—"}</td>
                  <td style={c.td}>
                    <div style={{ display: "flex", gap: 4 }}>
                      <button style={c.aBtn(accent)} onClick={() => openEditPatient(p)}>Edit</button>
                      <button style={c.aBtn("#ef4444")} onClick={() => delPatient(p.id)}>Del</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );

  // ─── DEPARTMENTS ──────────────────────────────────────────────────────────
  const renderDepartments = () => (
    <div>
      <BranchHeader title="Departments" />
      <div style={{ ...c.cardRow, marginBottom: 14 }}>
        <span style={{ fontSize: 11, color: "#2d3a50" }}>{branchDepts.length} department{branchDepts.length !== 1 ? "s" : ""}</span>
        <button style={c.addBtn} onClick={() => { setDeptForm({ name: "", head: "", beds: "", staff: "" }); setShowDeptModal(true); }}>+ Add Department</button>
      </div>
      <div style={c.card}>
        {branchDepts.length === 0 ? <div style={c.empty}>No departments for {branch}. Add one above.</div> : (
          <table style={c.tbl}>
            <thead><tr>{["Department", "Head", "Beds", "Staff", "Actions"].map(h => <th key={h} style={c.th}>{h}</th>)}</tr></thead>
            <tbody>
              {branchDepts.map(d => (
                <tr key={d.id}>
                  <td style={c.td}><strong style={{ color: "#f1f5f9" }}>{d.name}</strong></td>
                  <td style={c.td}>{d.head}</td>
                  <td style={c.td}><span style={c.badge(accent)}>{d.beds}</span></td>
                  <td style={c.td}>{d.staff}</td>
                  <td style={c.td}><button style={c.aBtn("#ef4444")} onClick={() => delDept(d.id)}>Remove</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );

  // ─── USERS ────────────────────────────────────────────────────────────────
  const renderUsers = () => (
    <div>
      <BranchHeader title="Users" />
      <div style={{ ...c.cardRow, marginBottom: 14 }}>
        <span style={{ fontSize: 11, color: "#2d3a50" }}>{branchUsers.length} user{branchUsers.length !== 1 ? "s" : ""} · {branchUsers.filter(u => u.status === "Active").length} active</span>
        <button style={c.addBtn} onClick={() => { setEditUser(null); setUserForm({ name: "", role: "Doctor", branch, email: "", status: "Active" }); setShowUserModal(true); }}>+ Add User</button>
      </div>
      <div style={c.card}>
        {branchUsers.length === 0 ? <div style={c.empty}>No users for {branch}.</div> : (
          <table style={c.tbl}>
            <thead><tr>{["Name", "Email", "Role", "Status", "Actions"].map(h => <th key={h} style={c.th}>{h}</th>)}</tr></thead>
            <tbody>
              {branchUsers.map(u => (
                <tr key={u.id}>
                  <td style={c.td}><strong style={{ color: "#f1f5f9" }}>{u.name}</strong></td>
                  <td style={{ ...c.td, color: "#2d3a50" }}>{u.email}</td>
                  <td style={c.td}><span style={c.badge("#a78bfa")}>{u.role}</span></td>
                  <td style={c.td}><span style={c.badge(u.status === "Active" ? "#10b981" : "#ef4444")}>{u.status}</span></td>
                  <td style={c.td}>
                    <div style={{ display: "flex", gap: 4 }}>
                      <button style={c.aBtn(accent)} onClick={() => openEditUser(u)}>Edit</button>
                      <button style={c.aBtn("#ef4444")} onClick={() => delUser(u.id)}>Del</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );

  const renderPlaceholder = (title, icon) => (
    <div>
      <BranchHeader title={title} />
      <div style={{ ...c.card, textAlign: "center", padding: "3rem 2rem" }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>{icon}</div>
        <div style={{ fontSize: 13, color: "#2d3a50" }}>Connect your {title.toLowerCase()} data to activate.</div>
        <div style={{ fontSize: 10, color: "#1f2937", marginTop: 4 }}>Branch: {branch}</div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "overview": return renderOverview();
      case "patients": return renderPatients();
      case "departments": return renderDepartments();
      case "users": return renderUsers();
      case "billing": return renderPlaceholder("Billing", "₹");
      case "discharge": return renderPlaceholder("Discharge", "↗");
      case "invoices": return renderPlaceholder("Invoices", "≡");
      default: return renderOverview();
    }
  };

  // ─── RENDER ───────────────────────────────────────────────────────────────
  return (
    <div style={c.wrap}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 3px; height: 3px; }
        ::-webkit-scrollbar-thumb { background: #161d2e; border-radius: 3px; }
        option { background: #090d14; }
      `}</style>

      {notif && <div style={c.notif(notif.type)}>{notif.type === "ok" ? "✓ " : "⚠ "}{notif.msg}</div>}

      {/* HEADER */}
      <header style={c.hdr}>
        <div style={c.logoRow}>
          <div style={c.logoIcon}>S</div>
          <div><div style={c.logoText}>Sangi Hospital</div><div style={c.logoSub}>Management Admin · Both Branches</div></div>
        </div>
        <div style={c.hdrRight}>
          <span style={c.roleBadge}>MGMT ADMIN</span>
          <div style={c.avatar}>MA</div>
          <button style={c.logoutBtn}>Logout</button>
        </div>
      </header>

      <div style={c.body}>
        {/* SIDEBAR */}
        <aside style={c.sb}>
          <div style={c.sbTop}>
            {!collapsed && <div style={c.sbLabel}>Branch</div>}
            <div style={c.bsWrap}>
              {BRANCHES.map(b => (
                <button key={b} style={c.bsBtn(b)} onClick={() => setBranch(b)} title={b}>
                  <div style={c.bsDot(b)} />
                  {!collapsed && <span style={{ fontSize: 12 }}>{b}</span>}
                </button>
              ))}
            </div>
          </div>

          <nav style={c.navWrap}>
            {!collapsed && <div style={c.navSection}>Menu</div>}
            {NAV.map(item => (
              <div key={item.id} style={c.navItem(activeTab === item.id)} onClick={() => setActiveTab(item.id)} title={item.label}>
                <span style={c.navIcon}>{item.icon}</span>
                {!collapsed && item.label}
              </div>
            ))}
          </nav>

          <div style={c.sbBot}>
            <button style={c.colBtn} onClick={() => setCollapsed(x => !x)} title={collapsed ? "Expand" : "Collapse"}>
              {collapsed ? "▶" : "◀"}
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main style={c.main}>{renderContent()}</main>
      </div>

      {/* DEPT MODAL */}
      {showDeptModal && (
        <div style={c.modal} onClick={e => e.target === e.currentTarget && setShowDeptModal(false)}>
          <div style={c.modalBox}>
            <div style={c.modalTitle}>Add Department — {branch}</div>
            <label style={c.lbl}>Department Name</label>
            <input style={c.inp} placeholder="e.g. Cardiology" value={deptForm.name} onChange={e => setDeptForm(f => ({ ...f, name: e.target.value }))} />
            <label style={c.lbl}>Department Head</label>
            <input style={c.inp} placeholder="e.g. Dr. Sharma" value={deptForm.head} onChange={e => setDeptForm(f => ({ ...f, head: e.target.value }))} />
            <div style={c.g2}>
              <div><label style={c.lbl}>Beds</label><input style={c.inp} type="number" placeholder="0" value={deptForm.beds} onChange={e => setDeptForm(f => ({ ...f, beds: e.target.value }))} /></div>
              <div><label style={c.lbl}>Staff</label><input style={c.inp} type="number" placeholder="0" value={deptForm.staff} onChange={e => setDeptForm(f => ({ ...f, staff: e.target.value }))} /></div>
            </div>
            <div style={c.mFoot}>
              <button style={c.cancelBtn} onClick={() => setShowDeptModal(false)}>Cancel</button>
              <button style={c.saveBtn} onClick={addDept}>Create Department</button>
            </div>
          </div>
        </div>
      )}

      {/* USER MODAL */}
      {showUserModal && (
        <div style={c.modal} onClick={e => e.target === e.currentTarget && (setShowUserModal(false), setEditUser(null))}>
          <div style={c.modalBox}>
            <div style={c.modalTitle}>{editUser ? "Edit User" : "Add User"}</div>
            <label style={c.lbl}>Full Name</label>
            <input style={c.inp} placeholder="Dr. Full Name" value={userForm.name} onChange={e => setUserForm(f => ({ ...f, name: e.target.value }))} />
            <label style={c.lbl}>Email</label>
            <input style={c.inp} placeholder="user@sangi.in" value={userForm.email} onChange={e => setUserForm(f => ({ ...f, email: e.target.value }))} />
            <label style={c.lbl}>Role</label>
            <select style={c.sel} value={userForm.role} onChange={e => setUserForm(f => ({ ...f, role: e.target.value }))}>
              {ROLES.map(r => <option key={r}>{r}</option>)}
            </select>
            <label style={c.lbl}>Branch</label>
            <select style={c.sel} value={userForm.branch} onChange={e => setUserForm(f => ({ ...f, branch: e.target.value }))}>
              {BRANCHES.map(b => <option key={b}>{b}</option>)}
            </select>
            <label style={c.lbl}>Status</label>
            <select style={c.sel} value={userForm.status} onChange={e => setUserForm(f => ({ ...f, status: e.target.value }))}>
              <option>Active</option><option>Inactive</option>
            </select>
            <div style={c.mFoot}>
              <button style={c.cancelBtn} onClick={() => { setShowUserModal(false); setEditUser(null); }}>Cancel</button>
              <button style={c.saveBtn} onClick={saveUser}>{editUser ? "Update" : "Create User"}</button>
            </div>
          </div>
        </div>
      )}

      {/* PATIENT MODAL */}
      {showPatientModal && (
        <div style={c.modal} onClick={e => e.target === e.currentTarget && (setShowPatientModal(false), setEditPatient(null))}>
          <div style={c.modalBox}>
            <div style={c.modalTitle}>{editPatient ? "Edit Patient" : "Add Patient"} — {branch}</div>

            <div style={c.divider}>Patient Info</div>
            <label style={c.lbl}>Full Name</label>
            <input style={c.inp} placeholder="Patient Name" value={patientForm.name} onChange={e => setPatientForm(f => ({ ...f, name: e.target.value }))} />
            <div style={c.g2}>
              <div><label style={c.lbl}>Age</label><input style={c.inp} type="number" placeholder="0" value={patientForm.age} onChange={e => setPatientForm(f => ({ ...f, age: e.target.value }))} /></div>
              <div><label style={c.lbl}>Gender</label>
                <select style={c.sel} value={patientForm.gender} onChange={e => setPatientForm(f => ({ ...f, gender: e.target.value }))}>
                  <option value="M">Male</option><option value="F">Female</option><option value="O">Other</option>
                </select>
              </div>
            </div>
            <div style={c.g2}>
              <div><label style={c.lbl}>UHID</label><input style={c.inp} placeholder="e.g. LN-0050" value={patientForm.uhid} onChange={e => setPatientForm(f => ({ ...f, uhid: e.target.value }))} /></div>
              <div><label style={c.lbl}>Admit Date</label><input style={c.inp} type="date" value={patientForm.admitDate} onChange={e => setPatientForm(f => ({ ...f, admitDate: e.target.value }))} /></div>
            </div>
            <div style={c.g2}>
              <div><label style={c.lbl}>Department</label>
                <select style={c.sel} value={patientForm.dept} onChange={e => setPatientForm(f => ({ ...f, dept: e.target.value }))}>
                  {branchDepts.length === 0 && <option value="">No departments</option>}
                  {branchDepts.map(d => <option key={d.id}>{d.name}</option>)}
                </select>
              </div>
              <div><label style={c.lbl}>Status</label>
                <select style={c.sel} value={patientForm.status} onChange={e => setPatientForm(f => ({ ...f, status: e.target.value }))}>
                  <option>Admitted</option><option>Discharged</option>
                </select>
              </div>
            </div>

            <div style={c.divider}>Payment Details</div>
            <label style={c.lbl}>Payment Type</label>
            <select style={c.sel} value={patientForm.paymentType} onChange={e => setPatientForm(f => ({ ...f, paymentType: e.target.value }))}>
              {PAYMENT_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>

            {(patientForm.paymentType === "Cash" || patientForm.paymentType === "Both") && (
              <div>
                <label style={c.lbl}>Cash Amount (₹)</label>
                <input style={c.inp} type="number" placeholder="0" value={patientForm.cashAmount} onChange={e => setPatientForm(f => ({ ...f, cashAmount: e.target.value }))} />
              </div>
            )}

            {(patientForm.paymentType === "Cashless" || patientForm.paymentType === "Both") && (
              <div style={c.g2}>
                <div><label style={c.lbl}>Cashless Amount (₹)</label><input style={c.inp} type="number" placeholder="0" value={patientForm.cashlessAmount} onChange={e => setPatientForm(f => ({ ...f, cashlessAmount: e.target.value }))} /></div>
                <div><label style={c.lbl}>Insurance Provider</label>
                  <select style={c.sel} value={patientForm.cashlessProvider} onChange={e => setPatientForm(f => ({ ...f, cashlessProvider: e.target.value }))}>
                    <option value="">Select…</option>
                    {INSURERS.map(i => <option key={i}>{i}</option>)}
                  </select>
                </div>
              </div>
            )}

            <div style={c.mFoot}>
              <button style={c.cancelBtn} onClick={() => { setShowPatientModal(false); setEditPatient(null); }}>Cancel</button>
              <button style={c.saveBtn} onClick={savePatient}>{editPatient ? "Update Patient" : "Add Patient"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}