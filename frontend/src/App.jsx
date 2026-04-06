import { useState, createContext, useContext } from "react";
import { ToastContainer } from "./components/ui/Toast";
import { T, NAV_PAGES } from "./data/constants";
import { LOCATION_DB } from "./data/mockDb";
import { blankPatient, blankDischarge, blankBilling, blankSvc } from "./utils/helpers";
import { Ico, IC, PAGE_ICONS } from "./components/ui/Icons";

// Core Components
import LiveDate from "./components/layout/LiveDate";

// Pages
import SearchPage from "./pages/SearchPage";
import PatientFormPage from "./pages/PatientFormPage";
import DischargePage from "./pages/DischargePage";
import ServicesPage from "./pages/ServicesPage";
import SummaryPage from "./pages/SummaryPage";
import PatientsHistoryPage from "./pages/PatientsHistoryPage";
import MedicalHistoryPage from "./pages/MedicalHistoryPage";
import LoginPage from "./pages/LoginPage";
import UserManagementPage from "./pages/UserManagementPage";

// Modals
import UHIDScreen from "./modals/UHIDScreen";
import PrintModal from "./modals/PrintModal";
import PatientDetailModal from "./modals/PatientDetailModal";

// Admin Panel (Super Admin dark dashboard)
import AdminPanel from "./components/AdminPanel";

// ─── Auth Context (keeps LoginPage's useAuth() working) ───────────────────────
export const AuthContext = createContext(null);
export function useAuth() { return useContext(AuthContext); }

// ─── All users — seed + localStorage created users ────────────────────────────
const SEED_USERS = [
  { id:"superadmin",   username:"superadmin",    password:"admin123",  role:"superadmin", name:"Super Admin",       branch:"laxmi", locations:["laxmi"] },
  { id:"admin_laxmi",  username:"admin.laxmi",   password:"laxmi123",  role:"admin",      name:"Admin Laxmi Nagar", branch:"laxmi", locations:["laxmi"] },
  { id:"admin_raya",   username:"admin.raya",    password:"raya123",   role:"admin",      name:"Admin Raya",        branch:"raya",  locations:["raya"]  },
  { id:"bill_laxmi",   username:"billing.laxmi", password:"bill123",   role:"billing",    name:"Billing Staff",     branch:"laxmi", locations:["laxmi"], dept:"Billing"  },
  { id:"pharma_raya",  username:"pharma.raya",   password:"pharma123", role:"pharmacy",   name:"Pharmacy Staff",    branch:"raya",  locations:["raya"],  dept:"Pharmacy" },
];

function getAllUsers() {
  const base = [...SEED_USERS];
  try {
    const admins    = JSON.parse(localStorage.getItem("hms_admins")     || "[]");
    const deptUsers = JSON.parse(localStorage.getItem("hms_dept_users") || "[]");
    const ids = new Set(base.map(u => u.username));
    [...admins, ...deptUsers].forEach(u => {
      if (!ids.has(u.id) && !ids.has(u.username)) {
        base.push({ ...u, username: u.id, locations: [u.branch] });
        ids.add(u.id);
      }
    });
  } catch {}
  return base;
}

// ─── Root App ─────────────────────────────────────────────────────────────────
export default function App() {

  // ── Auth state ──────────────────────────────────────────────────────────────
  const [loggedIn, setLoggedIn] = useState(() => sessionStorage.getItem("loggedIn") === "true");
  const [currentUser, setCurrentUser] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem("currentUser")); } catch { return null; }
  });

  // ── HMS state ────────────────────────────────────────────────────────────────
  const [locId, setLocId] = useState(() => sessionStorage.getItem("locId") || "laxmi");
  const [page, setPage] = useState(() => {
    const savedPage = sessionStorage.getItem("page");
    const user = (() => { try { return JSON.parse(sessionStorage.getItem("currentUser")); } catch { return null; } })();
    if (savedPage) return savedPage;
    return user?.role === "superadmin" ? "superadmin" : "patient";
  });
  const [subPage, setSubPage]               = useState("search");
  const [uhid, setUhid]                     = useState(null);
  const [admNo, setAdmNo]                   = useState(1);
  const [showUHID, setShowUHID]             = useState(false);
  const [isReturning, setIsReturning]       = useState(false);
  const [patientDone, setPatientDone]       = useState(false);
  const [dischargeDone, setDischargeDone]   = useState(false);
  const [servicesDone, setServicesDone]     = useState(false);
  const [showPrint, setShowPrint]           = useState(false);
  const [showPatientDetail, setShowPatientDetail] = useState(null);
  const [printRequests, setPrintRequests]   = useState([]);

  const [patient, setPatient]               = useState(blankPatient());
  const [medicalHistory, setMedicalHistory] = useState({
    previousDiagnosis:"", pastSurgeries:"", currentMedications:"",
    treatingDoctor:"", knownAllergies:"", chronicConditions:"",
    familyHistory:"", smokingStatus:"", alcoholUse:"", notes:""
  });
  const [medicalDone, setMedicalDone]       = useState(false);
  const [discharge, setDischarge]           = useState(blankDischarge());
  const [svcs, setSvcs]                     = useState([blankSvc()]);
  const [billing, setBilling]               = useState(blankBilling());
  const [errs, setErrs]                     = useState({});
  const [db, setDb]                         = useState(JSON.parse(JSON.stringify(LOCATION_DB)));

  const currentDb = db[locId];

  // ── login() — called by LoginPage via useAuth().login(username, password) ───
  const login = (username, password) => {
    const all   = getAllUsers();
    const found = all.find(u =>
      (u.username === username || u.id === username) && u.password === password
    );
    if (!found)                      return { success: false, error: "Invalid credentials" };
    if (found.status === "inactive") return { success: false, error: "Account deactivated. Contact admin." };

    const loc = found.locations?.[0] || found.branch || "laxmi";
    setCurrentUser(found);
    setLocId(loc);
    setLoggedIn(true);
    sessionStorage.setItem("loggedIn", "true");
    sessionStorage.setItem("currentUser", JSON.stringify(found));
    sessionStorage.setItem("locId", loc);

    if (found.role === "superadmin") {
      setPage("superadmin");
      sessionStorage.setItem("page", "superadmin");
    } else {
      setPage("patient");
      setSubPage("search");
      sessionStorage.setItem("page", "patient");
    }
    return { success: true };
  };

  // ── logout ────────────────────────────────────────────────────────────────────
  const logout = () => {
    setLoggedIn(false);
    setCurrentUser(null);
    resetAll();
    setPrintRequests([]);
    sessionStorage.clear();
  };

  // ── HMS helpers ───────────────────────────────────────────────────────────────
  const resetAll = () => {
    setPage("patient"); setSubPage("search"); setUhid(null); setShowUHID(false);
    setPatientDone(false); setMedicalDone(false); setDischargeDone(false); setServicesDone(false);
    setPatient(blankPatient()); setDischarge(blankDischarge()); setSvcs([]); setBilling(blankBilling());
    setErrs({});
    setMedicalHistory({ previousDiagnosis:"", pastSurgeries:"", currentMedications:"", treatingDoctor:"", knownAllergies:"", chronicConditions:"", familyHistory:"", smokingStatus:"", alcoholUse:"", notes:"" });
  };

  const switchLoc = id => { setLocId(id); resetAll(); setShowPatientDetail(null); };

  const syncDb = (currentUhid, currentAdmNo, dataKey, dataValue) => {
    setDb(prev => {
      const nextDb = JSON.parse(JSON.stringify(prev));
      const p = nextDb[locId].find(x => x.uhid === currentUhid);
      if (p) { const a = p.admissions.find(x => x.admNo === currentAdmNo); if (a) a[dataKey] = dataValue; }
      return nextDb;
    });
  };

  const handleNewAdmission = existing => {
    const { admissions, ...pd } = existing; setPatient(pd); setUhid(existing.uhid);
    const newAdmNo = existing.admissions.length + 1; setAdmNo(newAdmNo); setIsReturning(true); setShowUHID(true);
    setDb(prev => {
      const nextDb = JSON.parse(JSON.stringify(prev));
      const p = nextDb[locId].find(x => x.uhid === existing.uhid);
      p.admissions.push({ admNo: newAdmNo, dateTime: new Date().toISOString(), discharge: blankDischarge(), services: [], billing: blankBilling() });
      return nextDb;
    });
  };

  const handleDischargeFromHistory = (patientObj, admObj) => {
    const { admissions, ...pd } = patientObj; setPatient(pd); setUhid(patientObj.uhid); setAdmNo(admObj.admNo); setIsReturning(true);
    setDischarge({ ...blankDischarge(), ...(admObj.discharge || {}) });
    setSvcs(admObj.services && admObj.services.length ? admObj.services : []);
    setBilling({ ...blankBilling(), ...(admObj.billing || {}) });
    setPatientDone(true); setDischargeDone(false); setServicesDone(false);
    setShowPatientDetail(null); setShowUHID(false); setPage("discharge");
  };

  const handleGenerateBillFromHistory = (patientObj, admObj) => {
    const { admissions, ...pd } = patientObj; setPatient(pd); setUhid(patientObj.uhid); setAdmNo(admObj.admNo); setIsReturning(true);
    setDischarge({ ...blankDischarge(), ...(admObj.discharge || {}) });
    setSvcs(admObj.services && admObj.services.length ? admObj.services : []);
    setBilling({ ...blankBilling(), ...(admObj.billing || {}) });
    setPatientDone(true); setDischargeDone(true); setServicesDone(false);
    setShowPatientDetail(null); setShowUHID(false); setPage("services");
  };

  const handleSetExpectedDod = (uhidToUpdate, admNoToUpdate, date) => {
    setDb(prev => {
      const nextDb = JSON.parse(JSON.stringify(prev));
      nextDb[locId].forEach(p => {
        if (p.uhid === uhidToUpdate) p.admissions.forEach(a => {
          if (a.admNo === admNoToUpdate) { if (!a.discharge) a.discharge = {}; a.discharge.expectedDod = date; }
        });
      });
      return nextDb;
    });
  };

  const validatePatient = () => {
    const e = {};
    if (!patient.patientName.trim())  e.patientName  = "Required";
    if (!patient.guardianName.trim()) e.guardianName = "Required";
    if (!patient.gender)              e.gender       = "Required";
    if (!patient.phone || patient.phone.replace(/\D/g,"").length !== 10) e.phone = "Must be 10 digits";
    if (!patient.nationalId.trim())   e.nationalId   = "Required";
    if (!patient.address.trim())      e.address      = "Required";
    setErrs(e); return !Object.keys(e).length;
  };

  const handleRegister = () => {
    if (!validatePatient()) return;
    const newUhid = "UHID-" + Math.floor(1000000 + Math.random() * 9000000);
    setUhid(newUhid); setAdmNo(1); setIsReturning(false); setShowUHID(true);
    const newPat = { ...patient, uhid: newUhid, admissions: [{ admNo:1, dateTime: new Date().toISOString(), discharge: blankDischarge(), services: [], billing: blankBilling() }] };
    setDb(prev => ({ ...prev, [locId]: [newPat, ...prev[locId]] }));
  };

  const handleUHIDContinue   = () => { setPatientDone(true); setShowUHID(false); setPage("medical"); };
  const handleUHIDDashboard  = () => { setPatientDone(true); setShowUHID(false); setPage("patient"); setSubPage("search"); };
  const handleUHIDNewPatient = () => { resetAll(); setSubPage("form"); };

  const handleSaveMedical   = () => { syncDb(uhid, admNo, "medicalHistory", medicalHistory); setMedicalDone(true); setPage("discharge"); };
  const handleSaveDischarge = () => { syncDb(uhid, admNo, "discharge", discharge); setDischargeDone(true); setPage("services"); };

  const handleSaveServices = (updatedSvcs, updatedBilling) => {
    setSvcs(updatedSvcs); setBilling(updatedBilling);
    syncDb(uhid, admNo, "services", updatedSvcs); syncDb(uhid, admNo, "billing", updatedBilling);
    setServicesDone(true); setPage("summary");
  };

  const handleRequestPrint = (req) => {
    setPrintRequests(prev => [...prev, { ...req, requestedAt: new Date().toISOString() }]);
  };

  const handleViewBill = (req) => {
    setShowPrint(true); setUhid(req.uhid);
    setPatient(req.patient || patient); setDischarge(req.discharge || discharge);
    setSvcs(req.svcs || svcs); setBilling(req.billing || billing);
    setLocId(req.locId); setAdmNo(req.admNo);
  };

  const handleApprovePrint = (req, action) => {
    setPrintRequests(prev => prev.filter(r => !(r.uhid===req.uhid && r.admNo===req.admNo && r.locId===req.locId)));
    if (action === "approve") {
      setShowPrint(true); setUhid(req.uhid);
      setPatient(req.patient || patient); setDischarge(req.discharge || discharge);
      setSvcs(req.svcs || svcs); setBilling(req.billing || billing);
      setLocId(req.locId); setAdmNo(req.admNo);
    }
  };

  // ── Not logged in → Login page ────────────────────────────────────────────────
  if (!loggedIn) {
    return (
      <AuthContext.Provider value={{ user: currentUser, login, logout }}>
        <LoginPage />
      </AuthContext.Provider>
    );
  }

  // ── Super Admin → Dark AdminPanel ─────────────────────────────────────────────
  if (page === "superadmin") {
    return (
      <AuthContext.Provider value={{ user: currentUser, login, logout }}>
        {showPrint && (
          <PrintModal uhid={uhid} patient={patient} discharge={discharge}
            svcs={svcs} billing={billing} locId={locId} admNo={admNo}
            onClose={() => setShowPrint(false)} />
        )}
        <AdminPanel
          initialRole="superadmin"
          db={db}
          printRequests={printRequests}
          onApprovePrint={handleApprovePrint}
          onViewBill={handleViewBill}
          onLogout={logout}
        />
      </AuthContext.Provider>
    );
  }

  // ── Admin / Employee → Original HMS Dashboard ─────────────────────────────────
  return (
    <AuthContext.Provider value={{ user: currentUser, login, logout }}>
      <ToastContainer />

      {showPrint && (
        <PrintModal uhid={uhid} patient={patient} discharge={discharge}
          svcs={svcs} billing={billing} locId={locId} admNo={admNo}
          onClose={() => setShowPrint(false)} />
      )}

      {showUHID && (
        <UHIDScreen uhid={uhid} admNo={admNo} isReturning={isReturning}
          onContinue={handleUHIDContinue}
          onDashboard={handleUHIDDashboard}
          onNewPatient={handleUHIDNewPatient} />
      )}

      {showPatientDetail && (
        <PatientDetailModal
          patient={showPatientDetail}
          onClose={() => setShowPatientDetail(null)}
          onNewAdmission={handleNewAdmission}
          onDischarge={handleDischargeFromHistory}
          onGenerateBill={handleGenerateBillFromHistory}
          onSetExpectedDod={handleSetExpectedDod}
          locId={locId} />
      )}

      {/* ── Top Navbar ── */}
      <div style={{ position:"fixed", top:0, left:0, right:0, zIndex:100,
        background:T.primary, borderBottom:`1px solid rgba(255,255,255,.08)`,
        display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"0 24px", height:56 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <img src="/logo192.png" alt="logo" style={{ width:32, height:32, borderRadius:8, objectFit:"cover" }} />
          <div>
            <div style={{ color:"#fff", fontWeight:700, fontSize:14 }}>Sangi Hospital</div>
            <div style={{ color:"rgba(255,255,255,.45)", fontSize:10, textTransform:"uppercase", letterSpacing:1 }}>IPD Portal</div>
          </div>
        </div>

        {/* Location switcher */}
        <div style={{ display:"flex", gap:6 }}>
          {[{id:"laxmi",label:"Lakshmi Nagar"},{id:"raya",label:"Raya"}].map(loc => (
            <button key={loc.id} onClick={() => switchLoc(loc.id)}
              style={{ padding:"5px 14px", borderRadius:20, border:"none", cursor:"pointer", fontSize:12, fontWeight:600,
                background: locId===loc.id ? T.accent : "rgba(255,255,255,.08)",
                color: locId===loc.id ? T.primary : "rgba(255,255,255,.6)", transition:"all .15s" }}>
              {loc.label}
            </button>
          ))}
        </div>

        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <LiveDate />
          <div style={{ textAlign:"right" }}>
            <div style={{ color:"#fff", fontSize:13, fontWeight:600 }}>{currentUser?.name}</div>
            <div style={{ color:"rgba(255,255,255,.45)", fontSize:11 }}>
              {locId === "laxmi" ? "Lakshmi Nagar" : "Raya"} Branch
            </div>
          </div>
          <button onClick={logout}
            style={{ padding:"6px 16px", borderRadius:8, border:"1px solid rgba(255,255,255,.2)",
              background:"transparent", color:"#fff", fontWeight:600, fontSize:12, cursor:"pointer" }}>
            Logout
          </button>
        </div>
      </div>

      {/* ── Layout ── */}
      <div style={{ display:"flex", paddingTop:56, minHeight:"100vh", background:T.bgPage }}>

        {/* Left Sidebar */}
        <div style={{ width:220, background:"#fff", borderRight:`1px solid ${T.border}`,
          position:"fixed", top:56, bottom:0, overflowY:"auto", padding:"24px 0" }}>

          <div style={{ padding:"0 16px 12px", fontSize:10, fontWeight:700, color:T.textLight, letterSpacing:".08em" }}>
            REGISTRATION STEPS
          </div>

          {NAV_PAGES.map((p, i) => {
            const done   = [patientDone, medicalDone, dischargeDone, servicesDone, true][i];
            const active = page === p.id;
            const locked = i > 0 && ![patientDone, medicalDone, dischargeDone, servicesDone][i-1];
            return (
              <button key={p.id} onClick={() => !locked && setPage(p.id)}
                style={{ display:"flex", alignItems:"center", gap:12, width:"100%", padding:"10px 16px",
                  border:"none", background:active?T.bgTint:"transparent",
                  borderLeft:active?`3px solid ${T.accent}`:"3px solid transparent",
                  color:locked?T.textLight:active?T.primaryLight:T.textMid,
                  cursor:locked?"not-allowed":"pointer", fontSize:13, fontWeight:active?700:500,
                  opacity:locked?0.5:1, textAlign:"left", transition:"all .15s" }}>
                <div style={{ width:24, height:24, borderRadius:"50%", flexShrink:0,
                  background:done&&!active?T.green:active?T.primaryLight:T.border,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  color:"#fff", fontSize:11, fontWeight:700 }}>
                  {done && !active ? "✓" : i+1}
                </div>
                {p.label}
              </button>
            );
          })}

          <div style={{ padding:"20px 16px 8px", fontSize:10, fontWeight:700, color:T.textLight, letterSpacing:".08em" }}>
            RECORDS
          </div>
          <button onClick={() => setPage("history")}
            style={{ display:"flex", alignItems:"center", gap:12, width:"100%", padding:"10px 16px",
              border:"none", background:page==="history"?T.bgTint:"transparent",
              borderLeft:page==="history"?`3px solid ${T.accent}`:"3px solid transparent",
              color:page==="history"?T.primaryLight:T.textMid,
              cursor:"pointer", fontSize:13, fontWeight:page==="history"?700:500, textAlign:"left" }}>
            <div style={{ width:24, height:24, borderRadius:"50%", background:T.primaryLight,
              display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:11 }}>📋</div>
            Patients History
          </button>
        </div>

        {/* Main Content */}
        <div style={{ marginLeft:220, flex:1, padding:"28px 32px" }}>

          {/* ── FIXED: PatientFormPage now gets data/setData/onSubmit ── */}
          {page==="patient" && subPage==="search" &&
            <SearchPage db={currentDb} locId={locId}
              onNewPatient={() => setSubPage("form")}
              onSelectPatient={p => setShowPatientDetail(p)} />}

          {page==="patient" && subPage==="form" &&
            <PatientFormPage
              data={patient}
              setData={setPatient}
              errs={errs}
              onSubmit={handleRegister}
              onBack={() => setSubPage("search")} />}

          {page==="medical" &&
            <MedicalHistoryPage medicalHistory={medicalHistory} setMedicalHistory={setMedicalHistory}
              onSave={handleSaveMedical} onBack={() => setPage("patient")} />}

          {page==="discharge" &&
            <DischargePage discharge={discharge} setDischarge={setDischarge}
              onSave={handleSaveDischarge} onBack={() => setPage("medical")} />}

          {page==="services" &&
            <ServicesPage svcs={svcs} setSvcs={setSvcs} billing={billing} setBilling={setBilling}
              discharge={discharge} patient={patient} locId={locId}
              onSave={handleSaveServices} onBack={() => setPage("discharge")} />}

          {page==="summary" &&
            <SummaryPage patient={patient} discharge={discharge} svcs={svcs} billing={billing}
              uhid={uhid} admNo={admNo} locId={locId}
              onRequestPrint={handleRequestPrint}
              onNewPatient={() => { resetAll(); setSubPage("form"); }}
              onDashboard={() => { resetAll(); setSubPage("search"); }} />}

          {page==="history" &&
            <PatientsHistoryPage db={currentDb} locId={locId}
              currentUser={currentUser}
              onDischarge={handleDischargeFromHistory}
              onGenerateBill={handleGenerateBillFromHistory}
              onSetExpectedDod={handleSetExpectedDod} />}
        </div>
      </div>
    </AuthContext.Provider>
  );
}