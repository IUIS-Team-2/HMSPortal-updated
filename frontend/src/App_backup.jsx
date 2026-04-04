import { useState } from "react";
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
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import MedicalHistoryPage from "./pages/MedicalHistoryPage";
import LoginPage from "./pages/LoginPage";
import UserManagementPage from "./pages/UserManagementPage";

// Modals
import UHIDScreen from "./modals/UHIDScreen";
import PrintModal from "./modals/PrintModal";
import PatientDetailModal from "./modals/PatientDetailModal";

// ✅ ADDED IMPORT
import AdminPanel from "./components/AdminPanel";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(() => sessionStorage.getItem("loggedIn") === "true");
  const [currentUser, setCurrentUser] = useState(() => { try { return JSON.parse(sessionStorage.getItem("currentUser")); } catch { return null; } });
  const [locId, setLocId] = useState(() => sessionStorage.getItem("locId") || "laxmi");
  const [page, setPage] = useState(() => { const savedPage = sessionStorage.getItem("page"); const user = (() => { try { return JSON.parse(sessionStorage.getItem("currentUser")); } catch { return null; } })(); if (savedPage) return savedPage; return user?.role === "superadmin" ? "superadmin" : "patient"; });
  const [subPage, setSubPage] = useState("search");
  const [uhid, setUhid] = useState(null);
  const [admNo, setAdmNo] = useState(1);
  const [showUHID, setShowUHID] = useState(false);
  const [isReturning, setIsReturning] = useState(false);
  const [patientDone, setPatientDone] = useState(false);
  const [dischargeDone, setDischargeDone] = useState(false);
  const [servicesDone, setServicesDone] = useState(false);
  const [showPrint, setShowPrint] = useState(false);
  const [showPatientDetail, setShowPatientDetail] = useState(null);
  const [printRequests, setPrintRequests] = useState([]);

  const [patient, setPatient] = useState(blankPatient());
  const [medicalHistory, setMedicalHistory] = useState({ previousDiagnosis: "", pastSurgeries: "", currentMedications: "", treatingDoctor: "", knownAllergies: "", chronicConditions: "", familyHistory: "", smokingStatus: "", alcoholUse: "", notes: "" });
  const [medicalDone, setMedicalDone] = useState(false);
  const [discharge, setDischarge] = useState(blankDischarge());
  const [svcs, setSvcs] = useState([blankSvc()]);
  const [billing, setBilling] = useState(blankBilling());
  const [errs, setErrs] = useState({});

  const [db, setDb] = useState(JSON.parse(JSON.stringify(LOCATION_DB)));

  const currentDb = db[locId];

  const resetAll = () => {
    setPage("patient");
    setSubPage("search");
    setUhid(null);
    setShowUHID(false);
    setPatientDone(false); 
    setMedicalDone(false);
    setDischargeDone(false);
    setServicesDone(false);
    setPatient(blankPatient());
    setDischarge(blankDischarge());
    setSvcs([]);
    setBilling(blankBilling());
    setErrs({});
    setMedicalHistory({ previousDiagnosis: "", pastSurgeries: "", currentMedications: "", treatingDoctor: "", knownAllergies: "", chronicConditions: "", familyHistory: "", smokingStatus: "", alcoholUse: "", notes: "" });
  };

  const switchLoc = id => { setLocId(id); resetAll(); setShowPatientDetail(null); };

  const handleLogin = (user, loc) => {
    setCurrentUser(user);
    setLocId(loc || "laxmi");
    setLoggedIn(true);
    sessionStorage.setItem("loggedIn", "true");
    sessionStorage.setItem("currentUser", JSON.stringify(user));
    sessionStorage.setItem("locId", loc || "laxmi");
    if (user.role === "superadmin") {
      setPage("superadmin"); sessionStorage.setItem("page", "superadmin");
    } else {
      setPage("patient");
      setSubPage("search");
    }
  };

  const endSession = () => { resetAll(); };

  const syncDb = (currentUhid, currentAdmNo, dataKey, dataValue) => {
    setDb(prev => {
      const nextDb = JSON.parse(JSON.stringify(prev));
      const p = nextDb[locId].find(x => x.uhid === currentUhid);
      if (p) {
        const a = p.admissions.find(x => x.admNo === currentAdmNo);
        if (a) a[dataKey] = dataValue;
      }
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
    setDischarge({ ...blankDischarge(), ...(admObj.discharge || {}) }); setSvcs(admObj.services && admObj.services.length ? admObj.services : []); setBilling({ ...blankBilling(), ...(admObj.billing || {}) });
    setPatientDone(true); setDischargeDone(false); setServicesDone(false); setShowPatientDetail(null); setShowUHID(false); setPage("discharge");
  };

  const handleGenerateBillFromHistory = (patientObj, admObj) => {
    const { admissions, ...pd } = patientObj; setPatient(pd); setUhid(patientObj.uhid); setAdmNo(admObj.admNo); setIsReturning(true);
    setDischarge({ ...blankDischarge(), ...(admObj.discharge || {}) }); setSvcs(admObj.services && admObj.services.length ? admObj.services : []); setBilling({ ...blankBilling(), ...(admObj.billing || {}) });
    setPatientDone(true); setDischargeDone(true); setServicesDone(false); setShowPatientDetail(null); setShowUHID(false); setPage("services");
  };

  const handleSetExpectedDod = (uhidToUpdate, admNoToUpdate, date) => {
    setDb(prev => {
      const nextDb = JSON.parse(JSON.stringify(prev));
      nextDb[locId].forEach(p => { if (p.uhid === uhidToUpdate) p.admissions.forEach(a => { if (a.admNo === admNoToUpdate) { if (!a.discharge) a.discharge = {}; a.discharge.expectedDod = date; } }); });
      return nextDb;
    });
  };

  const validatePatient = () => {
    const e = {}; if (!patient.patientName.trim()) e.patientName = "Required"; if (!patient.guardianName.trim()) e.guardianName = "Required"; if (!patient.gender) e.gender = "Required"; if (!patient.phone || patient.phone.replace(/\D/g, "").length !== 10) e.phone = "Must be 10 digits"; if (!patient.nationalId.trim()) e.nationalId = "Required"; if (!patient.address.trim()) e.address = "Required"; setErrs(e); return !Object.keys(e).length;
  };

  const handleRegister = () => {
    if (!validatePatient()) return;
    const newUhid = "UHID-" + Math.floor(1000000 + Math.random() * 9000000);
    setUhid(newUhid); setAdmNo(1); setIsReturning(false); setShowUHID(true);
    const newPat = { ...patient, uhid: newUhid, admissions: [{ admNo: 1, dateTime: new Date().toISOString(), discharge: blankDischarge(), services: [], billing: blankBilling() }] };
    setDb(prev => ({ ...prev, [locId]: [newPat, ...prev[locId]] }));
  };

  const handleUHIDContinue   = () => { setPatientDone(true); setShowUHID(false); setPage("medical"); };
  const handleUHIDDashboard  = () => { setPatientDone(true); setShowUHID(false); setPage("patient"); setSubPage("search"); };
  const handleUHIDNewPatient = () => { endSession(); setSubPage("form"); };

  const handleSaveMedical = () => { syncDb(uhid, admNo, "medicalHistory", medicalHistory); setMedicalDone(true); setPage("discharge"); };

  const handleSaveDischarge  = () => { syncDb(uhid, admNo, 'discharge', discharge); setDischargeDone(true); setPage("services"); };

  const handleSaveServices   = (updatedSvcs, updatedBilling) => {
    setSvcs(updatedSvcs); setBilling(updatedBilling);
    syncDb(uhid, admNo, 'services', updatedSvcs); syncDb(uhid, admNo, 'billing', updatedBilling);
    setServicesDone(true); setPage("summary");
  };

  const handleRequestPrint = (req) => {
    setPrintRequests(prev => [...prev, { ...req, requestedAt: new Date().toISOString() }]);
  };

  const handleViewBill = (req) => {
    setShowPrint(true);
    setUhid(req.uhid);
    setPatient(req.patient || patient);
    setDischarge(req.discharge || discharge);
    setSvcs(req.svcs || svcs);
    setBilling(req.billing || billing);
    setLocId(req.locId);
    setAdmNo(req.admNo);
  };

  const handleApprovePrint = (req, action) => {
    setPrintRequests(prev => prev.filter(r => !(r.uhid === req.uhid && r.admNo === req.admNo && r.locId === req.locId)));
    if (action === "approve") {
      setShowPrint(true);
      setUhid(req.uhid);
      setPatient(req.patient || patient);
      setDischarge(req.discharge || discharge);
      setSvcs(req.svcs || svcs);
      setBilling(req.billing || billing);
      setLocId(req.locId);
      setAdmNo(req.admNo);
    }
  };

  if (!loggedIn) return <LoginPage onLogin={handleLogin} />;

  // ✅ UPDATED SECTION
  if (page === "superadmin") {
    return (
      <>
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
          onLogout={() => {
            setLoggedIn(false);
            setCurrentUser(null);
            resetAll();
            setPrintRequests([]);
            sessionStorage.clear();
          }}
        />
      </>
    );
  }

  return (
    <>
      {/* REST OF YOUR CODE UNCHANGED */}
      <ToastContainer />
    </>
  );
}