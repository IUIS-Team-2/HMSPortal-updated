import { useState, useRef } from "react";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const BRANCHES = {
  laxmi: { label: "Lakshmi Nagar", color: "#60A5FA", short: "LN" },
  raya:  { label: "Raya",          color: "#FB923C", short: "RY" },
};

const ROLES = {
  superadmin: { label: "Super Admin", badge: "👑", color: "#C084FC", bg: "rgba(192,132,252,.15)",
    canCreateAdmin: true, canCreateUser: true, canCreateDept: true,
    canSeeBilling: true, canSeeClinical: true, canSeeReports: true,
    canApproveBilling: true, branches: ["laxmi","raya"] },
  admin: { label: "Admin", badge: "🛡", color: "#60A5FA", bg: "rgba(96,165,250,.15)",
    canCreateAdmin: false, canCreateUser: true, canCreateDept: true,
    canSeeBilling: true, canSeeClinical: true, canSeeReports: true,
    canApproveBilling: true, branches: ["laxmi","raya"] },
};

const DEPT_OPTIONS = ["General Medicine","Urology","Orthopedics","Gynecology","Cardiology","Pediatrics","ENT","Dermatology","Emergency","Radiology","Pathology","Neurology","Billing","Administration"];

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const INIT_PATIENTS = [
  { id:"P001", name:"Rahul Sharma",   uhid:"UHID-4821903", branch:"laxmi", age:45, gender:"M", type:"cash",     dept:"General Medicine", doctor:"Dr. Sharma",  adm:"02 Mar 2025", dod:"10 Mar 2025", status:"Admitted",   amount:18500, paid:18500, billingStatus:"Approved", admNotes:"Patient admitted with high fever and body ache.", medicines:["Paracetamol 500mg","Azithromycin 250mg"], diagnosis:"Viral Fever" },
  { id:"P002", name:"Sunita Devi",    uhid:"UHID-9912300", branch:"laxmi", age:38, gender:"F", type:"cashless", dept:"Urology",          doctor:"Dr. Mehta",   adm:"01 Apr 2025", dod:"08 Apr 2025", status:"Admitted",   amount:45000, paid:20000, billingStatus:"Partial",  admNotes:"Renal stone detected in left kidney. Surgery planned.", medicines:["Tamsulosin","Ketorolac"], diagnosis:"Renal Stone", tpa:"Star Health" },
  { id:"P003", name:"Priya Verma",    uhid:"UHID-7734521", branch:"laxmi", age:29, gender:"F", type:"cash",     dept:"Gynecology",       doctor:"Dr. Gupta",   adm:"05 Nov 2024", dod:"09 Nov 2024", status:"Discharged", amount:12000, paid:12000, billingStatus:"Approved", admNotes:"Normal delivery. Mother and baby both healthy.", medicines:["Iron tablets","Folic Acid"], diagnosis:"Normal Delivery" },
  { id:"P004", name:"Ramesh Kumar",   uhid:"UHID-5523190", branch:"raya",  age:55, gender:"M", type:"cashless", dept:"General Medicine", doctor:"Dr. Yadav",   adm:"20 Mar 2025", dod:"27 Mar 2025", status:"Discharged", amount:32000, paid:32000, billingStatus:"Approved", admNotes:"Appendicitis. Appendectomy performed successfully.", medicines:["Amoxicillin","Metronidazole"], diagnosis:"Appendicitis", tpa:"Medi Assist" },
  { id:"P005", name:"Mohan Lal",      uhid:"UHID-1122334", branch:"raya",  age:62, gender:"M", type:"cash",     dept:"Cardiology",       doctor:"Dr. Yadav",   adm:"03 Apr 2025", dod:"2025-04-10",  status:"Admitted",   amount:27500, paid:0,     billingStatus:"Pending",  admNotes:"Chest pain with ECG changes. Under observation.", medicines:["Aspirin","Atorvastatin","Metoprolol"], diagnosis:"Unstable Angina" },
  { id:"P006", name:"Kavita Nair",    uhid:"UHID-8876541", branch:"laxmi", age:34, gender:"F", type:"cash",     dept:"Orthopedics",      doctor:"Dr. Sharma",  adm:"28 Mar 2025", dod:"04 Apr 2025", status:"Discharged", amount:15000, paid:15000, billingStatus:"Approved", admNotes:"Fracture of right wrist. Cast applied.", medicines:["Ibuprofen","Calcium supplements"], diagnosis:"Wrist Fracture" },
  { id:"P007", name:"Amit Singh",     uhid:"UHID-3312244", branch:"laxmi", age:41, gender:"M", type:"cashless", dept:"ENT",              doctor:"Dr. Mehta",   adm:"10 Jan 2025", dod:"14 Jan 2025", status:"Discharged", amount:24000, paid:24000, billingStatus:"Approved", admNotes:"Tonsillectomy performed under GA.", medicines:["Amoxicillin","Dexamethasone"], diagnosis:"Chronic Tonsillitis", tpa:"HDFC Ergo" },
  { id:"P008", name:"Neha Joshi",     uhid:"UHID-2210988", branch:"raya",  age:26, gender:"F", type:"cash",     dept:"Gynecology",       doctor:"Dr. Mishra",  adm:"02 Apr 2025", dod:"2025-04-05",  status:"Admitted",   amount:8000,  paid:0,     billingStatus:"Pending",  admNotes:"ANC check-up. 32 weeks gestation. Normal progress.", medicines:["Iron + Folic","Calcium"], diagnosis:"ANC 32 Weeks" },
];

const INIT_USERS = [
  { id:1, name:"Laxmi Branch Admin", email:"laxmi@hospital.com",   role:"branch_admin", branch:"laxmi", status:"active",   created:"2024-01-15" },
  { id:2, name:"Raya Branch Admin",  email:"raya@hospital.com",    role:"branch_admin", branch:"raya",  status:"active",   created:"2024-01-15" },
  { id:3, name:"Dr. Sharma",         email:"sharma@hospital.com",  role:"doctor",       branch:"laxmi", status:"active",   created:"2024-02-10" },
  { id:4, name:"Billing Staff",      email:"billing@hospital.com", role:"cashier",      branch:"laxmi", status:"active",   created:"2024-03-01" },
  { id:5, name:"Dr. Yadav",          email:"yadav@hospital.com",   role:"doctor",       branch:"raya",  status:"active",   created:"2024-03-20" },
];

const INIT_DEPTS = [
  { id:1, name:"General Medicine", branch:"laxmi", type:"clinical", head:"Dr. Sharma",  beds:20, active:true },
  { id:2, name:"Urology",          branch:"laxmi", type:"clinical", head:"Dr. Mehta",   beds:12, active:true },
  { id:3, name:"Billing",          branch:"laxmi", type:"billing",  head:"Mr. Kapoor",  beds:0,  active:true },
  { id:4, name:"General Medicine", branch:"raya",  type:"clinical", head:"Dr. Yadav",   beds:18, active:true },
  { id:5, name:"Gynecology",       branch:"raya",  type:"clinical", head:"Dr. Mishra",  beds:10, active:true },
  { id:6, name:"Billing",          branch:"raya",  type:"billing",  head:"Ms. Trivedi", beds:0,  active:true },
];

// ─── ATOMS ────────────────────────────────────────────────────────────────────
function Chip({ label, color }) {
  return <span style={{ fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:20,
    background:`${color}20`, color, whiteSpace:"nowrap" }}>{label}</span>;
}

function Stat({ label, value, color="#60A5FA", icon }) {
  return (
    <div style={{ background:"#161B2E", borderRadius:12, padding:"16px 18px",
      border:"1px solid rgba(255,255,255,.06)", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", top:10, right:12, fontSize:20, opacity:.15 }}>{icon}</div>
      <div style={{ fontSize:10, color:"rgba(255,255,255,.38)", fontWeight:700, letterSpacing:".07em", marginBottom:4 }}>{label}</div>
      <div style={{ fontSize:22, fontWeight:800, color }}>{value}</div>
    </div>
  );
}

function Btn({ children, onClick, color="blue", small, outline }) {
  const map = { blue:"linear-gradient(135deg,#60A5FA,#818CF8)", green:"linear-gradient(135deg,#34D399,#059669)",
    yellow:"linear-gradient(135deg,#FBBF24,#F59E0B)", purple:"linear-gradient(135deg,#C084FC,#9333EA)",
    ghost:"rgba(255,255,255,.07)" };
  const txt = color==="yellow" ? "#111" : color==="ghost" ? "rgba(255,255,255,.7)" : "#fff";
  return (
    <button onClick={onClick} style={{ padding:small?"6px 14px":"9px 18px", borderRadius:10,
      border: outline?"1.5px solid rgba(255,255,255,.15)":"none",
      background: outline?"transparent":(map[color]||map.blue), color: outline?"rgba(255,255,255,.6)":txt,
      fontWeight:700, fontSize:small?11:12, cursor:"pointer", whiteSpace:"nowrap",
      fontFamily:"'DM Sans',sans-serif" }}>
      {children}
    </button>
  );
}

function Modal({ title, onClose, children, wide }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.75)", zIndex:300,
      display:"flex", alignItems:"center", justifyContent:"center" }}
      onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{ background:"#161B2E", borderRadius:18, padding:28,
        width:wide?700:500, maxWidth:"95vw", maxHeight:"90vh", overflowY:"auto",
        border:"1px solid rgba(255,255,255,.12)", boxShadow:"0 32px 100px rgba(0,0,0,.8)" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:22 }}>
          <div style={{ fontFamily:"'DM Serif Display',serif", fontSize:19, color:"#fff" }}>{title}</div>
          <button onClick={onClose} style={{ background:"rgba(255,255,255,.08)", border:"none",
            color:"rgba(255,255,255,.5)", borderRadius:8, width:30, height:30, cursor:"pointer" }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

const inputStyle = { width:"100%", background:"rgba(255,255,255,.05)", border:"1.5px solid rgba(255,255,255,.1)",
  borderRadius:10, padding:"9px 13px", color:"#fff", fontSize:13, outline:"none",
  boxSizing:"border-box", fontFamily:"'DM Sans',sans-serif" };

function Field({ label, value, onChange, placeholder, type="text", half }) {
  return (
    <div style={{ marginBottom:12, gridColumn:half?"span 1":"span 2" }}>
      <div style={{ fontSize:10, fontWeight:700, color:"rgba(255,255,255,.38)", letterSpacing:".07em", marginBottom:5 }}>{label}</div>
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} style={inputStyle} />
    </div>
  );
}

function FSelect({ label, value, onChange, opts, half }) {
  return (
    <div style={{ marginBottom:12, gridColumn:half?"span 1":"span 2" }}>
      <div style={{ fontSize:10, fontWeight:700, color:"rgba(255,255,255,.38)", letterSpacing:".07em", marginBottom:5 }}>{label}</div>
      <select value={value} onChange={onChange}
        style={{ ...inputStyle, background:"#1a2035", appearance:"none" }}>
        {opts.map(o=><option key={o.value||o} value={o.value||o}>{o.label||o}</option>)}
      </select>
    </div>
  );
}

function FTextarea({ label, value, onChange, placeholder }) {
  return (
    <div style={{ marginBottom:12, gridColumn:"span 2" }}>
      <div style={{ fontSize:10, fontWeight:700, color:"rgba(255,255,255,.38)", letterSpacing:".07em", marginBottom:5 }}>{label}</div>
      <textarea value={value} onChange={onChange} placeholder={placeholder} rows={3}
        style={{ ...inputStyle, resize:"vertical" }} />
    </div>
  );
}

function PageHeader({ title, sub, children }) {
  return (
    <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:22, gap:12, flexWrap:"wrap" }}>
      <div>
        <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:24, color:"#fff", margin:"0 0 4px" }}>{title}</h2>
        {sub && <p style={{ fontSize:13, color:"rgba(255,255,255,.38)", margin:0 }}>{sub}</p>}
      </div>
      {children && <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>{children}</div>}
    </div>
  );
}

function BranchTabs({ active, setActive }) {
  return (
    <div style={{ display:"flex", gap:4, background:"rgba(255,255,255,.05)", borderRadius:10, padding:3, marginBottom:18 }}>
      {Object.entries(BRANCHES).map(([k,v])=>(
        <button key={k} onClick={()=>setActive(k)}
          style={{ padding:"7px 20px", borderRadius:8, border:"none", cursor:"pointer", fontSize:12, fontWeight:700,
            background:active===k?`${v.color}22`:"transparent", color:active===k?v.color:"rgba(255,255,255,.38)",
            borderBottom:active===k?`2px solid ${v.color}`:"2px solid transparent", transition:"all .2s" }}>
          🏥 {v.label}
        </button>
      ))}
    </div>
  );
}

function PayTabs({ active, setActive }) {
  return (
    <div style={{ display:"flex", gap:4, background:"rgba(255,255,255,.05)", borderRadius:10, padding:3, marginBottom:18 }}>
      {[{k:"cash",l:"💵 Cash",c:"#34D399"},{k:"cashless",l:"🏥 Cashless / TPA",c:"#60A5FA"}].map(t=>(
        <button key={t.k} onClick={()=>setActive(t.k)}
          style={{ padding:"7px 20px", borderRadius:8, border:"none", cursor:"pointer", fontSize:12, fontWeight:700,
            background:active===t.k?`${t.c}22`:"transparent", color:active===t.k?t.c:"rgba(255,255,255,.38)", transition:"all .2s" }}>
          {t.l}
        </button>
      ))}
    </div>
  );
}

function THead({ cols }) {
  return (
    <thead>
      <tr style={{ borderBottom:"1px solid rgba(255,255,255,.08)" }}>
        {cols.map(c=><th key={c} style={{ padding:"11px 14px", textAlign:"left", fontSize:10,
          color:"rgba(255,255,255,.38)", fontWeight:700, letterSpacing:".07em" }}>{c}</th>)}
      </tr>
    </thead>
  );
}

// ─── PRINT / DOWNLOAD ─────────────────────────────────────────────────────────
function printContent(html, title) {
  const w = window.open("","_blank","width=800,height=600");
  w.document.write(`<html><head><title>${title}</title>
    <style>body{font-family:Arial,sans-serif;padding:24px;color:#000}
    table{width:100%;border-collapse:collapse}th,td{border:1px solid #ccc;padding:8px;text-align:left}
    th{background:#f0f0f0}.header{text-align:center;margin-bottom:20px}
    @media print{button{display:none}}</style></head>
    <body>${html}<br/><button onclick="window.print()">🖨 Print</button></body></html>`);
  w.document.close();
}

function dlCSV(data, name) {
  const k = Object.keys(data[0]);
  const csv = [k.join(","),...data.map(r=>k.map(x=>`"${(r[x]||"").toString().replace(/"/g,'""')}"`).join(","))].join("\n");
  const a = document.createElement("a");
  a.href = "data:text/csv;charset=utf-8,"+encodeURIComponent(csv);
  a.download = name+".csv"; a.click();
}

// ─── PAGES ────────────────────────────────────────────────────────────────────

function Dashboard({ patients, users, depts }) {
  const s = b => ({
    total: patients.filter(p=>p.branch===b).length,
    admitted: patients.filter(p=>p.branch===b&&p.status==="Admitted").length,
    cash: patients.filter(p=>p.branch===b&&p.type==="cash").length,
    cashless: patients.filter(p=>p.branch===b&&p.type==="cashless").length,
    revenue: patients.filter(p=>p.branch===b).reduce((a,p)=>a+p.paid,0),
    pending: patients.filter(p=>p.branch===b).reduce((a,p)=>a+(p.amount-p.paid),0),
  });
  const ln=s("laxmi"),ry=s("raya");
  return (
    <div>
      <PageHeader title="Dashboard" sub="Hospital-wide overview — both branches" />
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:28 }}>
        <Stat label="TOTAL PATIENTS" value={ln.total+ry.total} icon="👥" color="#C084FC" />
        <Stat label="CURRENTLY ADMITTED" value={ln.admitted+ry.admitted} icon="🛏" color="#60A5FA" />
        <Stat label="TOTAL COLLECTED" value={"₹"+((ln.revenue+ry.revenue)/1000).toFixed(0)+"K"} icon="💰" color="#34D399" />
        <Stat label="PENDING DUES" value={"₹"+((ln.pending+ry.pending)/1000).toFixed(0)+"K"} icon="⚠️" color="#F87171" />
      </div>
      {["laxmi","raya"].map(b=>{
        const st=s(b),m=BRANCHES[b];
        return (
          <div key={b} style={{ marginBottom:24 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
              <div style={{ width:10,height:10,borderRadius:"50%",background:m.color }} />
              <span style={{ fontWeight:800,color:m.color,fontSize:14 }}>{m.label} Branch</span>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:10 }}>
              <Stat label="TOTAL"     value={st.total}   icon="👤" color={m.color} />
              <Stat label="ADMITTED"  value={st.admitted} icon="🛏" color="#60A5FA" />
              <Stat label="CASH"      value={st.cash}     icon="💵" color="#34D399" />
              <Stat label="CASHLESS"  value={st.cashless} icon="🏥" color="#FBBF24" />
              <Stat label="COLLECTED" value={"₹"+(st.revenue/1000).toFixed(0)+"K"} icon="💰" color="#C084FC" />
              <Stat label="PENDING"   value={"₹"+(st.pending/1000).toFixed(0)+"K"} icon="⚠️" color="#F87171" />
            </div>
          </div>
        );
      })}
      <div style={{ marginTop:4 }}>
        <div style={{ fontSize:11,fontWeight:700,color:"rgba(255,255,255,.38)",letterSpacing:".07em",marginBottom:10 }}>RECENT ACTIVITY</div>
        {patients.slice(-5).reverse().map((p,i)=>(
          <div key={i} style={{ display:"flex",alignItems:"center",gap:12,padding:"10px 14px",
            background:"#161B2E",borderRadius:10,marginBottom:6,border:"1px solid rgba(255,255,255,.05)" }}>
            <div style={{ width:8,height:8,borderRadius:"50%",background:p.status==="Admitted"?"#60A5FA":"#34D399",flexShrink:0 }} />
            <span style={{ color:"#fff",fontWeight:600,fontSize:13,flex:1 }}>{p.name}</span>
            <Chip label={p.dept} color="#C084FC" />
            <Chip label={p.type==="cash"?"Cash":"Cashless"} color={p.type==="cash"?"#34D399":"#60A5FA"} />
            <Chip label={BRANCHES[p.branch].label} color={BRANCHES[p.branch].color} />
            <Chip label={p.status} color={p.status==="Admitted"?"#FBBF24":"#34D399"} />
            <span style={{ fontSize:11,color:"rgba(255,255,255,.35)" }}>{p.adm}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Patients({ patients, setPatients }) {
  const [branch,setBranch]=useState("laxmi");
  const [payType,setPayType]=useState("cash");
  const [showAdd,setShowAdd]=useState(false);
  const [viewP,setViewP]=useState(null);
  const blank = { name:"",uhid:"",branch:"laxmi",age:"",gender:"M",type:"cash",dept:"General Medicine",doctor:"",adm:"",dod:"",amount:"",tpa:"",admNotes:"",medicines:"",diagnosis:"" };
  const [form,setForm]=useState(blank);
  const list=patients.filter(p=>p.branch===branch&&p.type===payType);

  const addPatient=()=>{
    if(!form.name)return;
    setPatients(prev=>[...prev,{...form,id:"P"+String(prev.length+1).padStart(3,"0"),
      age:Number(form.age)||0,amount:Number(form.amount)||0,paid:0,billingStatus:"Pending",
      medicines:form.medicines.split(",").map(m=>m.trim()).filter(Boolean),status:"Admitted"}]);
    setShowAdd(false);setForm(blank);
  };

  return (
    <div>
      <PageHeader title="Patients" sub="Cash & cashless patients — both branches">
        <Btn color="blue" onClick={()=>setShowAdd(true)}>+ Admit Patient</Btn>
        <Btn color="ghost" onClick={()=>dlCSV(list.map(p=>({Name:p.name,UHID:p.uhid,Branch:BRANCHES[p.branch].label,Type:p.type,Dept:p.dept,Doctor:p.doctor,Admitted:p.adm,DOD:p.dod,Amount:p.amount,Status:p.status})),`patients_${branch}_${payType}`)}>⬇ Export CSV</Btn>
      </PageHeader>
      <BranchTabs active={branch} setActive={setBranch} />
      <PayTabs active={payType} setActive={setPayType} />
      <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:18 }}>
        <Stat label="TOTAL" value={list.length} icon="👤" color={BRANCHES[branch].color} />
        <Stat label="ADMITTED" value={list.filter(p=>p.status==="Admitted").length} icon="🛏" color="#60A5FA" />
        <Stat label="DISCHARGED" value={list.filter(p=>p.status==="Discharged").length} icon="✅" color="#34D399" />
        <Stat label="REVENUE" value={"₹"+list.reduce((a,p)=>a+p.amount,0).toLocaleString("en-IN")} icon="💰" color="#FBBF24" />
      </div>
      <div style={{ background:"#161B2E",borderRadius:14,border:"1px solid rgba(255,255,255,.06)",overflow:"auto" }}>
        <table style={{ width:"100%",borderCollapse:"collapse",fontSize:13,minWidth:900 }}>
          <THead cols={["Patient","UHID","Dept","Doctor","Admitted","Exp. DOD","Amount","Status",""]} />
          <tbody>
            {list.map(p=>(
              <tr key={p.id} style={{ borderBottom:"1px solid rgba(255,255,255,.04)" }}>
                <td style={{ padding:"12px 14px" }}><div style={{ color:"#fff",fontWeight:700 }}>{p.name}</div><div style={{ fontSize:11,color:"rgba(255,255,255,.35)" }}>{p.age}y · {p.gender}</div></td>
                <td style={{ padding:"12px 14px",color:"rgba(255,255,255,.45)",fontSize:11 }}>{p.uhid}</td>
                <td style={{ padding:"12px 14px" }}><Chip label={p.dept} color="#C084FC" /></td>
                <td style={{ padding:"12px 14px",color:"#38BDF8",fontSize:12,fontWeight:600 }}>{p.doctor}</td>
                <td style={{ padding:"12px 14px",color:"rgba(255,255,255,.5)",fontSize:12 }}>{p.adm}</td>
                <td style={{ padding:"12px 14px",color:"#FBBF24",fontSize:12,fontWeight:600 }}>{p.dod||"—"}</td>
                <td style={{ padding:"12px 14px",color:"#34D399",fontWeight:700 }}>₹{p.amount.toLocaleString("en-IN")}</td>
                <td style={{ padding:"12px 14px" }}><Chip label={p.status} color={p.status==="Admitted"?"#60A5FA":"#34D399"} /></td>
                <td style={{ padding:"12px 14px" }}><Btn small color="ghost" onClick={()=>setViewP(p)}>View</Btn></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {viewP&&(
        <Modal title={viewP.name} onClose={()=>setViewP(null)} wide>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14 }}>
            {[["UHID",viewP.uhid],["Branch",BRANCHES[viewP.branch].label],["Age/Gender",`${viewP.age}y · ${viewP.gender}`],["Dept",viewP.dept],["Doctor",viewP.doctor],["Diagnosis",viewP.diagnosis],["Admitted",viewP.adm],["Exp. Discharge",viewP.dod||"—"],["Payment",viewP.type==="cash"?"Cash":"Cashless"],["TPA",viewP.tpa||"—"],["Amount","₹"+viewP.amount.toLocaleString("en-IN")],["Paid","₹"+viewP.paid.toLocaleString("en-IN")]].map(([k,v])=>(
              <div key={k} style={{ background:"rgba(255,255,255,.04)",borderRadius:8,padding:"9px 12px" }}>
                <div style={{ fontSize:10,color:"rgba(255,255,255,.35)",marginBottom:3 }}>{k}</div>
                <div style={{ fontSize:13,color:"#fff",fontWeight:600 }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ background:"rgba(255,255,255,.04)",borderRadius:8,padding:12,marginBottom:10 }}>
            <div style={{ fontSize:10,color:"rgba(255,255,255,.35)",marginBottom:5 }}>ADMISSION NOTES</div>
            <div style={{ fontSize:13,color:"rgba(255,255,255,.8)",lineHeight:1.6 }}>{viewP.admNotes||"—"}</div>
          </div>
          <div style={{ background:"rgba(255,255,255,.04)",borderRadius:8,padding:12,marginBottom:14 }}>
            <div style={{ fontSize:10,color:"rgba(255,255,255,.35)",marginBottom:6 }}>MEDICINES</div>
            <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}>{(viewP.medicines||[]).map((m,i)=><Chip key={i} label={m} color="#38BDF8" />)}</div>
          </div>
          <div style={{ display:"flex",gap:8,justifyContent:"flex-end" }}>
            <Btn color="yellow" onClick={()=>printContent(`<div class="header"><h1>${viewP.name}</h1></div><table><tr><th>Field</th><th>Details</th></tr><tr><td>UHID</td><td>${viewP.uhid}</td></tr><tr><td>Branch</td><td>${BRANCHES[viewP.branch].label}</td></tr><tr><td>Doctor</td><td>${viewP.doctor}</td></tr><tr><td>Diagnosis</td><td>${viewP.diagnosis}</td></tr><tr><td>Admitted</td><td>${viewP.adm}</td></tr><tr><td>DOD</td><td>${viewP.dod||"—"}</td></tr><tr><td>Amount</td><td>₹${viewP.amount.toLocaleString("en-IN")}</td></tr><tr><td>Admission Notes</td><td>${viewP.admNotes||"—"}</td></tr><tr><td>Medicines</td><td>${(viewP.medicines||[]).join(", ")}</td></tr></table>`,viewP.name)}>🖨 Print</Btn>
            <Btn outline onClick={()=>setViewP(null)}>Close</Btn>
          </div>
        </Modal>
      )}

      {showAdd&&(
        <Modal title="Admit New Patient" onClose={()=>setShowAdd(false)} wide>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
            <Field half label="PATIENT NAME" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} placeholder="Full name" />
            <Field half label="UHID" value={form.uhid} onChange={e=>setForm(p=>({...p,uhid:e.target.value}))} placeholder="UHID-XXXXXXX" />
            <Field half label="AGE" type="number" value={form.age} onChange={e=>setForm(p=>({...p,age:e.target.value}))} placeholder="35" />
            <FSelect half label="GENDER" value={form.gender} onChange={e=>setForm(p=>({...p,gender:e.target.value}))} opts={[{value:"M",label:"Male"},{value:"F",label:"Female"},{value:"Other",label:"Other"}]} />
            <FSelect half label="BRANCH" value={form.branch} onChange={e=>setForm(p=>({...p,branch:e.target.value}))} opts={Object.entries(BRANCHES).map(([k,v])=>({value:k,label:v.label}))} />
            <FSelect half label="PAYMENT TYPE" value={form.type} onChange={e=>setForm(p=>({...p,type:e.target.value}))} opts={[{value:"cash",label:"Cash"},{value:"cashless",label:"Cashless / TPA"}]} />
            <FSelect half label="DEPARTMENT" value={form.dept} onChange={e=>setForm(p=>({...p,dept:e.target.value}))} opts={DEPT_OPTIONS.filter(d=>d!=="Billing"&&d!=="Administration")} />
            <Field half label="DOCTOR" value={form.doctor} onChange={e=>setForm(p=>({...p,doctor:e.target.value}))} placeholder="Dr. Full Name" />
            <Field half label="ADMISSION DATE" type="date" value={form.adm} onChange={e=>setForm(p=>({...p,adm:e.target.value}))} />
            <Field half label="EXPECTED DISCHARGE DATE" type="date" value={form.dod} onChange={e=>setForm(p=>({...p,dod:e.target.value}))} />
            <Field half label="TOTAL AMOUNT (₹)" type="number" value={form.amount} onChange={e=>setForm(p=>({...p,amount:e.target.value}))} placeholder="0" />
            {form.type==="cashless"&&<Field half label="TPA / INSURANCE" value={form.tpa} onChange={e=>setForm(p=>({...p,tpa:e.target.value}))} placeholder="Star Health" />}
            <Field label="DIAGNOSIS" value={form.diagnosis} onChange={e=>setForm(p=>({...p,diagnosis:e.target.value}))} placeholder="Primary diagnosis" />
            <FTextarea label="ADMISSION NOTES" value={form.admNotes} onChange={e=>setForm(p=>({...p,admNotes:e.target.value}))} placeholder="Admission notes..." />
            <Field label="MEDICINES (comma separated)" value={form.medicines} onChange={e=>setForm(p=>({...p,medicines:e.target.value}))} placeholder="Paracetamol, Amoxicillin..." />
          </div>
          <div style={{ display:"flex",justifyContent:"flex-end",gap:8,marginTop:8 }}>
            <Btn outline onClick={()=>setShowAdd(false)}>Cancel</Btn>
            <Btn color="blue" onClick={addPatient}>Admit Patient</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Billing({ patients, setPatients }) {
  const [branch,setBranch]=useState("laxmi");
  const [payType,setPayType]=useState("cash");
  const [editId,setEditId]=useState(null);
  const [ef,setEf]=useState({});
  const list=patients.filter(p=>p.branch===branch&&p.type===payType);

  const approve=id=>setPatients(prev=>prev.map(p=>p.id===id?{...p,paid:p.amount,billingStatus:"Approved"}:p));
  const saveEdit=id=>{
    setPatients(prev=>prev.map(p=>p.id===id?{...p,amount:Number(ef.amount)||p.amount,paid:Number(ef.paid)||p.paid,
      billingStatus:Number(ef.paid)>=Number(ef.amount)?"Approved":p.billingStatus}:p));
    setEditId(null);
  };
  const printInv=p=>printContent(`<div class="header"><h1>Invoice</h1></div><table><tr><th colspan="2">Patient: ${p.name}</th></tr><tr><td>UHID</td><td>${p.uhid}</td></tr><tr><td>Branch</td><td>${BRANCHES[p.branch].label}</td></tr><tr><td>Department</td><td>${p.dept}</td></tr><tr><td>Doctor</td><td>${p.doctor}</td></tr><tr><td>Admission</td><td>${p.adm}</td></tr><tr><td>Discharge</td><td>${p.dod||"—"}</td></tr><tr><td>Mode</td><td>${p.type==="cash"?"Cash":"Cashless"}${p.tpa?" ("+p.tpa+")":""}</td></tr><tr><th>Total</th><th>₹${p.amount.toLocaleString("en-IN")}</th></tr><tr><th>Paid</th><th>₹${p.paid.toLocaleString("en-IN")}</th></tr><tr><th>Balance</th><th>₹${(p.amount-p.paid).toLocaleString("en-IN")}</th></tr><tr><th>Status</th><th>${p.billingStatus||"Pending"}</th></tr></table>`,`Invoice-${p.name}`);

  return (
    <div>
      <PageHeader title="Billing & Invoices" sub="Manage, approve and print invoices">
        <Btn color="ghost" onClick={()=>dlCSV(list.map(p=>({Name:p.name,UHID:p.uhid,Dept:p.dept,Mode:p.type,TPA:p.tpa||"",Total:p.amount,Paid:p.paid,Balance:p.amount-p.paid,Status:p.billingStatus||"Pending"})),`billing_${branch}_${payType}`)}>⬇ Export CSV</Btn>
      </PageHeader>
      <BranchTabs active={branch} setActive={setBranch} />
      <PayTabs active={payType} setActive={setPayType} />
      <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:18 }}>
        <Stat label="INVOICES" value={list.length} icon="🧾" color={BRANCHES[branch].color} />
        <Stat label="APPROVED" value={list.filter(p=>p.billingStatus==="Approved").length} icon="✅" color="#34D399" />
        <Stat label="TOTAL BILLED" value={"₹"+list.reduce((a,p)=>a+p.amount,0).toLocaleString("en-IN")} icon="💰" color="#FBBF24" />
        <Stat label="PENDING DUES" value={"₹"+list.reduce((a,p)=>a+(p.amount-p.paid),0).toLocaleString("en-IN")} icon="⚠️" color="#F87171" />
      </div>
      <div style={{ background:"#161B2E",borderRadius:14,border:"1px solid rgba(255,255,255,.06)",overflow:"auto" }}>
        <table style={{ width:"100%",borderCollapse:"collapse",fontSize:13,minWidth:950 }}>
          <THead cols={["Patient","Dept",payType==="cashless"?"TPA":"Mode","Total","Paid","Balance","Status","Actions"]} />
          <tbody>
            {list.map(p=>{
              const bal=p.amount-p.paid;
              const ie=editId===p.id;
              return (
                <tr key={p.id} style={{ borderBottom:"1px solid rgba(255,255,255,.04)" }}>
                  <td style={{ padding:"12px 14px" }}><div style={{ color:"#fff",fontWeight:700 }}>{p.name}</div><div style={{ fontSize:11,color:"rgba(255,255,255,.35)" }}>{p.uhid}</div></td>
                  <td style={{ padding:"12px 14px" }}><Chip label={p.dept} color="#C084FC" /></td>
                  <td style={{ padding:"12px 14px" }}>{payType==="cashless"?<Chip label={p.tpa||"—"} color="#60A5FA" />:<Chip label="Cash" color="#34D399" />}</td>
                  <td style={{ padding:"12px 14px" }}>{ie?<input type="number" value={ef.amount} onChange={e=>setEf(f=>({...f,amount:e.target.value}))} style={{ width:80,background:"rgba(255,255,255,.08)",border:"1px solid rgba(255,255,255,.2)",borderRadius:6,padding:"4px 8px",color:"#fff",fontSize:12 }} />:<span style={{ color:"#FBBF24",fontWeight:700 }}>₹{p.amount.toLocaleString("en-IN")}</span>}</td>
                  <td style={{ padding:"12px 14px" }}>{ie?<input type="number" value={ef.paid} onChange={e=>setEf(f=>({...f,paid:e.target.value}))} style={{ width:80,background:"rgba(255,255,255,.08)",border:"1px solid rgba(255,255,255,.2)",borderRadius:6,padding:"4px 8px",color:"#fff",fontSize:12 }} />:<span style={{ color:"#34D399",fontWeight:600 }}>₹{p.paid.toLocaleString("en-IN")}</span>}</td>
                  <td style={{ padding:"12px 14px" }}><span style={{ color:bal>0?"#F87171":"rgba(255,255,255,.3)",fontWeight:600 }}>₹{bal.toLocaleString("en-IN")}</span></td>
                  <td style={{ padding:"12px 14px" }}><Chip label={p.billingStatus||"Pending"} color={p.billingStatus==="Approved"?"#34D399":bal===0?"#FBBF24":"#F87171"} /></td>
                  <td style={{ padding:"12px 14px" }}>
                    <div style={{ display:"flex",gap:4 }}>
                      {ie?<><Btn small color="green" onClick={()=>saveEdit(p.id)}>Save</Btn><Btn small outline onClick={()=>setEditId(null)}>✕</Btn></>
                        :<><Btn small color="ghost" onClick={()=>{setEditId(p.id);setEf({amount:p.amount,paid:p.paid});}}>✏️</Btn>
                          {p.billingStatus!=="Approved"&&<Btn small color="green" onClick={()=>approve(p.id)}>✅ Approve</Btn>}
                          <Btn small color="yellow" onClick={()=>printInv(p)}>🖨</Btn></>}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PatientHistory({ patients }) {
  const [branch,setBranch]=useState("laxmi");
  const [search,setSearch]=useState("");
  const [viewP,setViewP]=useState(null);
  const list=patients.filter(p=>p.branch===branch&&(p.name.toLowerCase().includes(search.toLowerCase())||p.uhid.toLowerCase().includes(search.toLowerCase())||p.diagnosis.toLowerCase().includes(search.toLowerCase())));

  return (
    <div>
      <PageHeader title="Patient History" sub="Search complete patient records">
        <Btn color="ghost" onClick={()=>dlCSV(patients.filter(p=>p.branch===branch).map(p=>({Name:p.name,UHID:p.uhid,Age:p.age,Dept:p.dept,Doctor:p.doctor,Diagnosis:p.diagnosis,Admitted:p.adm,Discharged:p.dod,Type:p.type,Amount:p.amount,Status:p.status})),`history_${branch}`)}>⬇ Export CSV</Btn>
      </PageHeader>
      <BranchTabs active={branch} setActive={setBranch} />
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍  Search name, UHID, or diagnosis..."
        style={{ width:"100%",background:"rgba(255,255,255,.05)",border:"1.5px solid rgba(255,255,255,.1)",borderRadius:10,padding:"10px 14px",color:"#fff",fontSize:13,outline:"none",fontFamily:"'DM Sans',sans-serif",marginBottom:16,boxSizing:"border-box" }} />
      <div style={{ background:"#161B2E",borderRadius:14,border:"1px solid rgba(255,255,255,.06)",overflow:"auto" }}>
        <table style={{ width:"100%",borderCollapse:"collapse",fontSize:13,minWidth:800 }}>
          <THead cols={["Patient","UHID","Dept","Doctor","Diagnosis","Admitted","DOD","Type","Status",""]} />
          <tbody>
            {list.map(p=>(
              <tr key={p.id} style={{ borderBottom:"1px solid rgba(255,255,255,.04)" }}>
                <td style={{ padding:"12px 14px" }}><div style={{ color:"#fff",fontWeight:700 }}>{p.name}</div><div style={{ fontSize:11,color:"rgba(255,255,255,.35)" }}>{p.age}y · {p.gender}</div></td>
                <td style={{ padding:"12px 14px",color:"rgba(255,255,255,.4)",fontSize:11 }}>{p.uhid}</td>
                <td style={{ padding:"12px 14px" }}><Chip label={p.dept} color="#C084FC" /></td>
                <td style={{ padding:"12px 14px",color:"#38BDF8",fontSize:12 }}>{p.doctor}</td>
                <td style={{ padding:"12px 14px",color:"rgba(255,255,255,.6)",fontSize:12 }}>{p.diagnosis}</td>
                <td style={{ padding:"12px 14px",color:"rgba(255,255,255,.45)",fontSize:11 }}>{p.adm}</td>
                <td style={{ padding:"12px 14px",color:"#FBBF24",fontSize:11 }}>{p.dod||"—"}</td>
                <td style={{ padding:"12px 14px" }}><Chip label={p.type==="cash"?"Cash":"Cashless"} color={p.type==="cash"?"#34D399":"#60A5FA"} /></td>
                <td style={{ padding:"12px 14px" }}><Chip label={p.status} color={p.status==="Admitted"?"#60A5FA":"#34D399"} /></td>
                <td style={{ padding:"12px 14px" }}><Btn small color="ghost" onClick={()=>setViewP(p)}>View</Btn></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {viewP&&(
        <Modal title={viewP.name} onClose={()=>setViewP(null)} wide>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14 }}>
            {[["UHID",viewP.uhid],["Diagnosis",viewP.diagnosis],["Dept",viewP.dept],["Doctor",viewP.doctor],["Admitted",viewP.adm],["Discharged",viewP.dod||"—"],["Payment",viewP.type==="cash"?"Cash":"Cashless"],["Amount","₹"+viewP.amount.toLocaleString("en-IN")]].map(([k,v])=>(
              <div key={k} style={{ background:"rgba(255,255,255,.04)",borderRadius:8,padding:"9px 12px" }}>
                <div style={{ fontSize:10,color:"rgba(255,255,255,.35)",marginBottom:3 }}>{k}</div>
                <div style={{ fontSize:13,color:"#fff",fontWeight:600 }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ background:"rgba(255,255,255,.04)",borderRadius:8,padding:12,marginBottom:10 }}>
            <div style={{ fontSize:10,color:"rgba(255,255,255,.35)",marginBottom:5 }}>ADMISSION NOTES</div>
            <div style={{ fontSize:13,color:"rgba(255,255,255,.8)",lineHeight:1.6 }}>{viewP.admNotes||"—"}</div>
          </div>
          <div style={{ background:"rgba(255,255,255,.04)",borderRadius:8,padding:12,marginBottom:14 }}>
            <div style={{ fontSize:10,color:"rgba(255,255,255,.35)",marginBottom:6 }}>MEDICINES</div>
            <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}>{(viewP.medicines||[]).map((m,i)=><Chip key={i} label={m} color="#38BDF8" />)}</div>
          </div>
          <div style={{ display:"flex",justifyContent:"flex-end" }}><Btn outline onClick={()=>setViewP(null)}>Close</Btn></div>
        </Modal>
      )}
    </div>
  );
}

function ExpectedDOD({ patients }) {
  const [branch,setBranch]=useState("laxmi");
  const today=new Date();
  const admitted=patients.filter(p=>p.branch===branch&&p.status==="Admitted");
  const withDod=admitted.filter(p=>p.dod).map(p=>{
    const dod=new Date(p.dod);
    const diff=Math.ceil((dod-today)/(1000*60*60*24));
    return {...p,diff,overdue:diff<0};
  }).sort((a,b)=>a.diff-b.diff);

  return (
    <div>
      <PageHeader title="Expected Discharge" sub="DOD tracker with overdue alerts" />
      <BranchTabs active={branch} setActive={setBranch} />
      <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:18 }}>
        <Stat label="TOTAL ADMITTED" value={admitted.length} icon="🛏" color="#60A5FA" />
        <Stat label="OVERDUE" value={withDod.filter(p=>p.overdue).length} icon="🚨" color="#F87171" />
        <Stat label="DUE TODAY/TOMORROW" value={withDod.filter(p=>p.diff>=0&&p.diff<=1).length} icon="⚠️" color="#FBBF24" />
      </div>
      <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
        {withDod.map(p=>(
          <div key={p.id} style={{ background:"#161B2E",borderRadius:12,padding:"14px 18px",border:`1px solid ${p.overdue?"rgba(248,113,113,.3)":p.diff<=1?"rgba(251,191,36,.2)":"rgba(255,255,255,.06)"}`,display:"flex",alignItems:"center",gap:16 }}>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:700,color:"#fff" }}>{p.name}</div>
              <div style={{ fontSize:11,color:"rgba(255,255,255,.4)",marginTop:2 }}>{p.dept} · {p.doctor}</div>
            </div>
            <div style={{ fontSize:12,color:"rgba(255,255,255,.5)" }}>Adm: {p.adm}</div>
            <div style={{ fontSize:12,color:"#FBBF24",fontWeight:600 }}>DOD: {p.dod}</div>
            <Chip label={p.overdue?`Overdue ${Math.abs(p.diff)}d`:p.diff===0?"Due Today":p.diff===1?"Due Tomorrow":`${p.diff}d left`} color={p.overdue?"#F87171":p.diff<=1?"#FBBF24":"#34D399"} />
          </div>
        ))}
        {admitted.filter(p=>!p.dod).map(p=>(
          <div key={p.id} style={{ background:"#161B2E",borderRadius:12,padding:"14px 18px",border:"1px solid rgba(255,255,255,.04)",display:"flex",alignItems:"center",gap:16,opacity:.5 }}>
            <div style={{ flex:1 }}><div style={{ fontWeight:700,color:"#fff" }}>{p.name}</div><div style={{ fontSize:11,color:"rgba(255,255,255,.4)",marginTop:2 }}>{p.dept} · {p.doctor}</div></div>
            <Chip label="No DOD set" color="#94A3B8" />
          </div>
        ))}
        {admitted.length===0&&<div style={{ color:"rgba(255,255,255,.3)",textAlign:"center",padding:40 }}>No admitted patients.</div>}
      </div>
    </div>
  );
}

function AdmissionNotes({ patients, setPatients }) {
  const [branch,setBranch]=useState("laxmi");
  const [editId,setEditId]=useState(null);
  const [editNote,setEditNote]=useState("");
  const list=patients.filter(p=>p.branch===branch);

  return (
    <div>
      <PageHeader title="Admission Notes" sub="View and edit notes for all patients" />
      <BranchTabs active={branch} setActive={setBranch} />
      <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
        {list.map(p=>(
          <div key={p.id} style={{ background:"#161B2E",borderRadius:12,padding:"14px 18px",border:"1px solid rgba(255,255,255,.06)" }}>
            <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8 }}>
              <div>
                <span style={{ fontWeight:700,color:"#fff" }}>{p.name}</span>
                <span style={{ fontSize:11,color:"rgba(255,255,255,.35)",marginLeft:10 }}>{p.uhid} · {p.dept} · {p.doctor}</span>
              </div>
              <div style={{ display:"flex",gap:6 }}>
                <Chip label={p.status} color={p.status==="Admitted"?"#60A5FA":"#34D399"} />
                {editId===p.id
                  ?<><Btn small color="green" onClick={()=>{setPatients(prev=>prev.map(x=>x.id===p.id?{...x,admNotes:editNote}:x));setEditId(null);}}>Save</Btn><Btn small outline onClick={()=>setEditId(null)}>Cancel</Btn></>
                  :<Btn small color="ghost" onClick={()=>{setEditId(p.id);setEditNote(p.admNotes||"");}}>✏️ Edit</Btn>}
              </div>
            </div>
            {editId===p.id
              ?<textarea value={editNote} onChange={e=>setEditNote(e.target.value)} rows={3}
                  style={{ width:"100%",background:"rgba(255,255,255,.06)",border:"1.5px solid rgba(255,255,255,.15)",borderRadius:8,padding:"9px 12px",color:"#fff",fontSize:13,resize:"vertical",fontFamily:"'DM Sans',sans-serif",boxSizing:"border-box" }} />
              :<div style={{ fontSize:13,color:"rgba(255,255,255,.6)",lineHeight:1.6 }}>{p.admNotes||<span style={{ color:"rgba(255,255,255,.2)" }}>No notes added.</span>}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

function Medicines({ patients, setPatients }) {
  const [branch,setBranch]=useState("laxmi");
  const [editId,setEditId]=useState(null);
  const [editMeds,setEditMeds]=useState("");
  const list=patients.filter(p=>p.branch===branch);

  return (
    <div>
      <PageHeader title="Medicines" sub="View and update prescribed medicines per patient" />
      <BranchTabs active={branch} setActive={setBranch} />
      <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
        {list.map(p=>(
          <div key={p.id} style={{ background:"#161B2E",borderRadius:12,padding:"14px 18px",border:"1px solid rgba(255,255,255,.06)" }}>
            <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10 }}>
              <div>
                <span style={{ fontWeight:700,color:"#fff" }}>{p.name}</span>
                <span style={{ fontSize:11,color:"rgba(255,255,255,.35)",marginLeft:10 }}>{p.dept} · {p.doctor}</span>
              </div>
              <div style={{ display:"flex",gap:6 }}>
                {editId===p.id
                  ?<><Btn small color="green" onClick={()=>{setPatients(prev=>prev.map(x=>x.id===p.id?{...x,medicines:editMeds.split(",").map(m=>m.trim()).filter(Boolean)}:x));setEditId(null);}}>Save</Btn><Btn small outline onClick={()=>setEditId(null)}>Cancel</Btn></>
                  :<Btn small color="ghost" onClick={()=>{setEditId(p.id);setEditMeds((p.medicines||[]).join(", "));}}>✏️ Edit</Btn>}
              </div>
            </div>
            {editId===p.id
              ?<input value={editMeds} onChange={e=>setEditMeds(e.target.value)} placeholder="Paracetamol 500mg, Amoxicillin..."
                  style={{ width:"100%",background:"rgba(255,255,255,.06)",border:"1.5px solid rgba(255,255,255,.15)",borderRadius:8,padding:"9px 12px",color:"#fff",fontSize:13,fontFamily:"'DM Sans',sans-serif",boxSizing:"border-box" }} />
              :<div style={{ display:"flex",gap:6,flexWrap:"wrap" }}>{(p.medicines||[]).length>0?(p.medicines||[]).map((m,i)=><Chip key={i} label={m} color="#38BDF8" />):<span style={{ fontSize:12,color:"rgba(255,255,255,.25)" }}>No medicines added.</span>}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

function DischargeSummary({ patients }) {
  const [branch,setBranch]=useState("laxmi");
  const discharged=patients.filter(p=>p.branch===branch&&p.status==="Discharged");
  const printSum=p=>printContent(`<div class="header"><h1>Discharge Summary</h1><p>${BRANCHES[p.branch].label}</p></div><table><tr><td>Name</td><td>${p.name}</td></tr><tr><td>UHID</td><td>${p.uhid}</td></tr><tr><td>Age/Gender</td><td>${p.age}y / ${p.gender}</td></tr><tr><td>Dept</td><td>${p.dept}</td></tr><tr><td>Doctor</td><td>${p.doctor}</td></tr><tr><td>Admitted</td><td>${p.adm}</td></tr><tr><td>Discharged</td><td>${p.dod||"—"}</td></tr><tr><td>Diagnosis</td><td>${p.diagnosis}</td></tr><tr><td>Mode</td><td>${p.type==="cash"?"Cash":"Cashless"}${p.tpa?" ("+p.tpa+")":""}</td></tr><tr><td>Total</td><td>₹${p.amount.toLocaleString("en-IN")}</td></tr><tr><td>Paid</td><td>₹${p.paid.toLocaleString("en-IN")}</td></tr><tr><td>Notes</td><td>${p.admNotes||"—"}</td></tr><tr><td>Medicines</td><td>${(p.medicines||[]).join(", ")||"—"}</td></tr></table>`,`Discharge-${p.name}`);

  return (
    <div>
      <PageHeader title="Discharge Summary" sub="Print discharge summaries for discharged patients">
        <Btn color="ghost" onClick={()=>dlCSV(discharged.map(p=>({Name:p.name,UHID:p.uhid,Dept:p.dept,Doctor:p.doctor,Admitted:p.adm,Discharged:p.dod,Diagnosis:p.diagnosis,Amount:p.amount})),`discharge_${branch}`)}>⬇ Export All</Btn>
      </PageHeader>
      <BranchTabs active={branch} setActive={setBranch} />
      <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
        {discharged.map(p=>(
          <div key={p.id} style={{ background:"#161B2E",borderRadius:12,padding:"16px 18px",border:"1px solid rgba(52,211,153,.12)",display:"flex",alignItems:"center",gap:16 }}>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:700,color:"#fff",fontSize:14 }}>{p.name}</div>
              <div style={{ fontSize:12,color:"rgba(255,255,255,.4)",marginTop:2 }}>{p.uhid} · {p.diagnosis} · {p.doctor}</div>
            </div>
            <div style={{ fontSize:12,color:"rgba(255,255,255,.5)" }}>Adm: {p.adm}</div>
            <div style={{ fontSize:12,color:"#34D399",fontWeight:600 }}>Disc: {p.dod||"—"}</div>
            <Chip label={p.type==="cash"?"Cash":"Cashless"} color={p.type==="cash"?"#34D399":"#60A5FA"} />
            <Chip label="Discharged" color="#34D399" />
            <Btn small color="yellow" onClick={()=>printSum(p)}>🖨 Print Summary</Btn>
          </div>
        ))}
        {discharged.length===0&&<div style={{ color:"rgba(255,255,255,.3)",textAlign:"center",padding:40 }}>No discharged patients in this branch.</div>}
      </div>
    </div>
  );
}

function Reports({ patients }) {
  const [branch,setBranch]=useState("laxmi");
  const bp=patients.filter(p=>p.branch===branch);
  const total=bp.length,admitted=bp.filter(p=>p.status==="Admitted").length,discharged=bp.filter(p=>p.status==="Discharged").length;
  const cashPts=bp.filter(p=>p.type==="cash").length,cashlessPts=bp.filter(p=>p.type==="cashless").length;
  const totalBilled=bp.reduce((a,p)=>a+p.amount,0),totalCollected=bp.reduce((a,p)=>a+p.paid,0);
  const deptMap={};bp.forEach(p=>{deptMap[p.dept]=(deptMap[p.dept]||0)+1;});

  const printReport=()=>{
    const rows=Object.entries(deptMap).map(([d,c])=>`<tr><td>${d}</td><td>${c}</td></tr>`).join("");
    printContent(`<div class="header"><h1>Summary Report</h1><p>${BRANCHES[branch].label} Branch</p></div><table><tr><th>Metric</th><th>Value</th></tr><tr><td>Total Patients</td><td>${total}</td></tr><tr><td>Admitted</td><td>${admitted}</td></tr><tr><td>Discharged</td><td>${discharged}</td></tr><tr><td>Cash Patients</td><td>${cashPts}</td></tr><tr><td>Cashless Patients</td><td>${cashlessPts}</td></tr><tr><td>Total Billed</td><td>₹${totalBilled.toLocaleString("en-IN")}</td></tr><tr><td>Collected</td><td>₹${totalCollected.toLocaleString("en-IN")}</td></tr><tr><td>Pending</td><td>₹${(totalBilled-totalCollected).toLocaleString("en-IN")}</td></tr></table><br/><h3>Department-wise</h3><table><tr><th>Department</th><th>Patients</th></tr>${rows}</table>`,`Report-${BRANCHES[branch].label}`);
  };

  return (
    <div>
      <PageHeader title="Reports" sub="Summary reports — printable and downloadable">
        <Btn color="yellow" onClick={printReport}>🖨 Print Report</Btn>
        <Btn color="ghost" onClick={()=>dlCSV([{Branch:BRANCHES[branch].label,Total:total,Admitted:admitted,Discharged:discharged,Cash:cashPts,Cashless:cashlessPts,TotalBilled:totalBilled,Collected:totalCollected,Pending:totalBilled-totalCollected}],`report_${branch}`)}>⬇ Download CSV</Btn>
      </PageHeader>
      <BranchTabs active={branch} setActive={setBranch} />
      <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20 }}>
        <Stat label="TOTAL PATIENTS" value={total} icon="👥" color={BRANCHES[branch].color} />
        <Stat label="ADMITTED" value={admitted} icon="🛏" color="#60A5FA" />
        <Stat label="CASH" value={cashPts} icon="💵" color="#34D399" />
        <Stat label="CASHLESS" value={cashlessPts} icon="🏥" color="#FBBF24" />
        <Stat label="TOTAL BILLED" value={"₹"+totalBilled.toLocaleString("en-IN")} icon="💰" color="#C084FC" />
        <Stat label="COLLECTED" value={"₹"+totalCollected.toLocaleString("en-IN")} icon="✅" color="#34D399" />
        <Stat label="PENDING DUES" value={"₹"+(totalBilled-totalCollected).toLocaleString("en-IN")} icon="⚠️" color="#F87171" />
        <Stat label="DISCHARGE RATE" value={total?Math.round(discharged/total*100)+"%":"0%"} icon="📊" color="#38BDF8" />
      </div>
      <div style={{ background:"#161B2E",borderRadius:14,border:"1px solid rgba(255,255,255,.06)",padding:20 }}>
        <div style={{ fontSize:11,fontWeight:700,color:"rgba(255,255,255,.38)",letterSpacing:".07em",marginBottom:14 }}>DEPARTMENT-WISE BREAKDOWN</div>
        <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
          {Object.entries(deptMap).sort((a,b)=>b[1]-a[1]).map(([dept,count])=>(
            <div key={dept} style={{ display:"flex",alignItems:"center",gap:12 }}>
              <div style={{ fontSize:13,color:"rgba(255,255,255,.7)",width:160 }}>{dept}</div>
              <div style={{ flex:1,height:8,background:"rgba(255,255,255,.06)",borderRadius:4,overflow:"hidden" }}>
                <div style={{ height:"100%",borderRadius:4,background:BRANCHES[branch].color,width:`${Math.round(count/total*100)}%`,transition:"width .4s" }} />
              </div>
              <div style={{ fontSize:12,color:BRANCHES[branch].color,fontWeight:700,width:30,textAlign:"right" }}>{count}</div>
              <div style={{ fontSize:11,color:"rgba(255,255,255,.35)",width:35 }}>{Math.round(count/total*100)}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Users({ role, users, setUsers }) {
  const perm=ROLES[role];
  const [show,setShow]=useState(false);
  const [form,setForm]=useState({name:"",email:"",role:"cashier",branch:"laxmi"});
  const roleOpts=[
    ...(perm.canCreateAdmin?[{value:"admin",label:"🛡 Admin"}]:[]),
    {value:"branch_admin",label:"🏥 Branch Admin"},
    {value:"doctor",label:"⚕️ Doctor"},
    {value:"cashier",label:"💰 Cashier / Billing"},
    {value:"nurse",label:"🩺 Nurse"},
  ];
  const add=()=>{
    if(!form.name||!form.email)return;
    setUsers(prev=>[...prev,{id:Date.now(),...form,status:"active",created:new Date().toISOString().split("T")[0]}]);
    setShow(false);setForm({name:"",email:"",role:"cashier",branch:"laxmi"});
  };

  return (
    <div>
      <PageHeader title="User Management" sub="Create and manage staff accounts">
        <Btn color="blue" onClick={()=>setShow(true)}>+ Add User</Btn>
        <Btn color="ghost" onClick={()=>dlCSV(users.map(u=>({Name:u.name,Email:u.email,Role:u.role,Branch:u.branch,Status:u.status,Created:u.created})),"users")}>⬇ Export</Btn>
      </PageHeader>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:18 }}>
        <Stat label="TOTAL USERS" value={users.length} icon="👥" color="#60A5FA" />
        <Stat label="ACTIVE" value={users.filter(u=>u.status==="active").length} icon="✅" color="#34D399" />
        <Stat label="INACTIVE" value={users.filter(u=>u.status==="inactive").length} icon="⛔" color="#F87171" />
      </div>
      <div style={{ background:"#161B2E",borderRadius:14,border:"1px solid rgba(255,255,255,.06)",overflow:"auto" }}>
        <table style={{ width:"100%",borderCollapse:"collapse",fontSize:13 }}>
          <THead cols={["Name","Email","Role","Branch","Status","Created","Actions"]} />
          <tbody>
            {users.map(u=>(
              <tr key={u.id} style={{ borderBottom:"1px solid rgba(255,255,255,.04)" }}>
                <td style={{ padding:"12px 14px",color:"#fff",fontWeight:700 }}>{u.name}</td>
                <td style={{ padding:"12px 14px",color:"rgba(255,255,255,.45)",fontSize:12 }}>{u.email}</td>
                <td style={{ padding:"12px 14px" }}><Chip label={u.role} color="#C084FC" /></td>
                <td style={{ padding:"12px 14px" }}><Chip label={BRANCHES[u.branch]?.label||u.branch} color={BRANCHES[u.branch]?.color||"#aaa"} /></td>
                <td style={{ padding:"12px 14px" }}><Chip label={u.status} color={u.status==="active"?"#34D399":"#F87171"} /></td>
                <td style={{ padding:"12px 14px",color:"rgba(255,255,255,.35)",fontSize:11 }}>{u.created}</td>
                <td style={{ padding:"12px 14px" }}><Btn small color="ghost" onClick={()=>setUsers(prev=>prev.map(x=>x.id===u.id?{...x,status:x.status==="active"?"inactive":"active"}:x))}>{u.status==="active"?"Deactivate":"Activate"}</Btn></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {show&&(
        <Modal title="Add New User" onClose={()=>setShow(false)}>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
            <Field half label="FULL NAME" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} placeholder="Full Name" />
            <Field half label="EMAIL" type="email" value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))} placeholder="user@hospital.com" />
            <FSelect half label="ROLE" value={form.role} onChange={e=>setForm(p=>({...p,role:e.target.value}))} opts={roleOpts} />
            <FSelect half label="BRANCH" value={form.branch} onChange={e=>setForm(p=>({...p,branch:e.target.value}))} opts={Object.entries(BRANCHES).map(([k,v])=>({value:k,label:v.label}))} />
          </div>
          {perm.canCreateAdmin&&<div style={{ fontSize:11,color:"rgba(192,132,252,.7)",background:"rgba(192,132,252,.08)",border:"1px solid rgba(192,132,252,.2)",borderRadius:8,padding:"8px 12px",marginBottom:12 }}>👑 As Super Admin you can create Admin-level accounts.</div>}
          <div style={{ display:"flex",justifyContent:"flex-end",gap:8,marginTop:8 }}>
            <Btn outline onClick={()=>setShow(false)}>Cancel</Btn>
            <Btn color="blue" onClick={add}>Create User</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Departments({ depts, setDepts }) {
  const [show,setShow]=useState(false);
  const [form,setForm]=useState({name:"General Medicine",branch:"laxmi",type:"clinical",head:"",beds:""});
  const add=()=>{
    if(!form.name)return;
    setDepts(prev=>[...prev,{id:Date.now(),...form,beds:Number(form.beds)||0,active:true}]);
    setShow(false);setForm({name:"General Medicine",branch:"laxmi",type:"clinical",head:"",beds:""});
  };

  return (
    <div>
      <PageHeader title="Departments" sub="Manage clinical and billing departments per branch">
        <Btn color="green" onClick={()=>setShow(true)}>+ Add Department</Btn>
      </PageHeader>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16 }}>
        {["laxmi","raya"].map(b=>(
          <div key={b}>
            <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:12 }}>
              <div style={{ width:10,height:10,borderRadius:"50%",background:BRANCHES[b].color }} />
              <span style={{ fontWeight:800,color:BRANCHES[b].color,fontSize:14 }}>{BRANCHES[b].label}</span>
              <span style={{ fontSize:11,color:"rgba(255,255,255,.3)",marginLeft:"auto" }}>{depts.filter(d=>d.branch===b&&d.active).length} active</span>
            </div>
            <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
              {depts.filter(d=>d.branch===b).sort((a,b)=>a.type==="billing"?-1:1).map(d=>(
                <div key={d.id} style={{ background:"#161B2E",borderRadius:12,padding:"14px 16px",border:`1px solid ${d.type==="billing"?"rgba(251,191,36,.2)":d.active?"rgba(255,255,255,.07)":"rgba(248,113,113,.15)"}`,display:"flex",alignItems:"center",justifyContent:"space-between" }}>
                  <div>
                    <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                      <span style={{ fontWeight:700,color:"#fff" }}>{d.name}</span>
                      <Chip label={d.type==="billing"?"Billing":"Clinical"} color={d.type==="billing"?"#FBBF24":"#38BDF8"} />
                    </div>
                    <div style={{ fontSize:11,color:"rgba(255,255,255,.38)",marginTop:2 }}>Head: {d.head||"—"}{d.type==="clinical"&&d.beds>0?` · ${d.beds} beds`:""}</div>
                  </div>
                  <div style={{ display:"flex",gap:6,alignItems:"center" }}>
                    <Chip label={d.active?"Active":"Inactive"} color={d.active?"#34D399":"#F87171"} />
                    <Btn small color="ghost" onClick={()=>setDepts(prev=>prev.map(x=>x.id===d.id?{...x,active:!x.active}:x))}>Toggle</Btn>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {show&&(
        <Modal title="Add Department" onClose={()=>setShow(false)}>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
            <FSelect half label="TYPE" value={form.type} onChange={e=>setForm(p=>({...p,type:e.target.value}))} opts={[{value:"clinical",label:"⚕️ Clinical"},{value:"billing",label:"💰 Billing"}]} />
            <FSelect half label="DEPARTMENT" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} opts={(form.type==="billing"?["Billing","Finance","Insurance Desk"]:DEPT_OPTIONS.filter(d=>d!=="Billing"&&d!=="Administration")).map(d=>({value:d,label:d}))} />
            <FSelect half label="BRANCH" value={form.branch} onChange={e=>setForm(p=>({...p,branch:e.target.value}))} opts={Object.entries(BRANCHES).map(([k,v])=>({value:k,label:v.label}))} />
            <Field half label={form.type==="billing"?"BILLING HEAD":"HEAD OF DEPT"} value={form.head} onChange={e=>setForm(p=>({...p,head:e.target.value}))} placeholder="Name" />
            {form.type==="clinical"&&<Field half label="BED COUNT" type="number" value={form.beds} onChange={e=>setForm(p=>({...p,beds:e.target.value}))} placeholder="15" />}
          </div>
          <div style={{ display:"flex",justifyContent:"flex-end",gap:8,marginTop:8 }}>
            <Btn outline onClick={()=>setShow(false)}>Cancel</Btn>
            <Btn color="green" onClick={add}>Save Department</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

function CreateAdmin({ users, setUsers }) {
  const [form,setForm]=useState({name:"",email:"",branch:"laxmi",phone:""});
  const admins=users.filter(u=>u.role==="admin");
  const create=()=>{
    if(!form.name||!form.email)return;
    setUsers(prev=>[...prev,{id:Date.now(),...form,role:"admin",status:"active",created:new Date().toISOString().split("T")[0]}]);
    setForm({name:"",email:"",branch:"laxmi",phone:""});
  };
  return (
    <div>
      <PageHeader title="Create Admin" sub="Super Admin — create admin accounts for hospital branches" />
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:20 }}>
        <div style={{ background:"#161B2E",borderRadius:14,padding:24,border:"1px solid rgba(192,132,252,.2)" }}>
          <div style={{ fontSize:12,fontWeight:700,color:"#C084FC",marginBottom:16,letterSpacing:".05em" }}>👑 NEW ADMIN ACCOUNT</div>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
            <Field half label="FULL NAME" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} placeholder="Admin Full Name" />
            <Field half label="EMAIL" type="email" value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))} placeholder="admin@hospital.com" />
            <Field half label="PHONE" value={form.phone} onChange={e=>setForm(p=>({...p,phone:e.target.value}))} placeholder="+91 XXXXXXXXXX" />
            <FSelect half label="PRIMARY BRANCH" value={form.branch} onChange={e=>setForm(p=>({...p,branch:e.target.value}))} opts={Object.entries(BRANCHES).map(([k,v])=>({value:k,label:v.label}))} />
          </div>
          <div style={{ marginTop:16 }}><Btn color="purple" onClick={create}>👑 Create Admin Account</Btn></div>
          <div style={{ fontSize:11,color:"rgba(255,255,255,.3)",marginTop:14,lineHeight:1.6 }}>Admin accounts have full access to billing, clinical records, users, and departments for both branches. Only Super Admin can create admin accounts.</div>
        </div>
        <div>
          <div style={{ fontSize:11,fontWeight:700,color:"rgba(255,255,255,.38)",letterSpacing:".07em",marginBottom:12 }}>EXISTING ADMINS ({admins.length})</div>
          <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
            {admins.map(a=>(
              <div key={a.id} style={{ background:"#161B2E",borderRadius:12,padding:"14px 16px",border:"1px solid rgba(96,165,250,.15)",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
                <div>
                  <div style={{ fontWeight:700,color:"#fff" }}>{a.name}</div>
                  <div style={{ fontSize:11,color:"rgba(255,255,255,.4)",marginTop:2 }}>{a.email}</div>
                </div>
                <div style={{ display:"flex",gap:6,alignItems:"center" }}>
                  <Chip label={BRANCHES[a.branch]?.label||a.branch} color={BRANCHES[a.branch]?.color||"#aaa"} />
                  <Chip label={a.status} color={a.status==="active"?"#34D399":"#F87171"} />
                </div>
              </div>
            ))}
            {admins.length===0&&<div style={{ color:"rgba(255,255,255,.25)",fontSize:13,padding:16 }}>No admin accounts yet.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SIDEBAR NAV ──────────────────────────────────────────────────────────────
const NAV = [
  { key:"dashboard",   label:"Dashboard",         icon:"📊", group:"main" },
  { key:"patients",    label:"Patients",           icon:"🧑‍⚕️", group:"main" },
  { key:"billing",     label:"Billing & Invoices", icon:"💰", group:"main" },
  { key:"history",     label:"Patient History",    icon:"📋", group:"clinical" },
  { key:"dod",         label:"Expected Discharge", icon:"📅", group:"clinical" },
  { key:"admnotes",    label:"Admission Notes",    icon:"📝", group:"clinical" },
  { key:"medicines",   label:"Medicines",          icon:"💊", group:"clinical" },
  { key:"discharge",   label:"Discharge Summary",  icon:"🏠", group:"clinical" },
  { key:"reports",     label:"Reports",            icon:"📈", group:"admin" },
  { key:"users",       label:"Users",              icon:"👥", group:"admin" },
  { key:"departments", label:"Departments",        icon:"🏥", group:"admin" },
  { key:"createadmin", label:"Create Admin",       icon:"👑", group:"admin", superadminOnly:true },
];

const GROUPS = [
  { key:"main",     label:"MAIN" },
  { key:"clinical", label:"CLINICAL" },
  { key:"admin",    label:"MANAGEMENT" },
];

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App({ initialRole="superadmin" }) {
  const [role,setRole]=useState(initialRole);
  const [page,setPage]=useState("dashboard");
  const [patients,setPatients]=useState(INIT_PATIENTS);
  const [users,setUsers]=useState(INIT_USERS);
  const [depts,setDepts]=useState(INIT_DEPTS);
  const [roleDrop,setRoleDrop]=useState(false);
  const dropRef=useRef(null);
  const perm=ROLES[role];

  const nav=NAV.filter(n=>!(n.superadminOnly&&role!=="superadmin"));

  return (
    <div style={{ display:"flex",height:"100vh",background:"#0D1117",fontFamily:"'DM Sans',sans-serif",color:"#fff",overflow:"hidden" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;800&family=DM+Serif+Display&display=swap');*{box-sizing:border-box}button,input,select,textarea{font-family:'DM Sans',sans-serif}::-webkit-scrollbar{width:4px;height:4px}::-webkit-scrollbar-thumb{background:rgba(255,255,255,.1);border-radius:4px}::-webkit-scrollbar-track{background:transparent}`}</style>

      {/* SIDEBAR */}
      <div style={{ width:218,background:"#111520",borderRight:"1px solid rgba(255,255,255,.07)",display:"flex",flexDirection:"column",flexShrink:0,overflowY:"auto" }}>
        {/* Logo */}
        <div style={{ padding:"18px 16px 14px",borderBottom:"1px solid rgba(255,255,255,.07)" }}>
          <div style={{ display:"flex",alignItems:"center",gap:10 }}>
            <div style={{ width:32,height:32,borderRadius:8,background:"linear-gradient(135deg,#1a5b8c,#0e3a5e)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:14 }}>S</div>
            <div>
              <div style={{ fontSize:13,fontWeight:800,letterSpacing:".04em" }}>Sangi Hospital</div>
              <div style={{ fontSize:9,color:"rgba(255,255,255,.3)",letterSpacing:1 }}>ADMIN PANEL</div>
            </div>
          </div>
        </div>

        {/* Role badge */}
        <div style={{ padding:"10px 14px",borderBottom:"1px solid rgba(255,255,255,.06)" }}>
          <div style={{ background:perm.bg,borderRadius:10,padding:"9px 12px",border:`1px solid ${perm.color}30` }}>
            <div style={{ fontSize:11,fontWeight:800,color:perm.color }}>{perm.badge} {perm.label}</div>
            <div style={{ fontSize:10,color:"rgba(255,255,255,.35)",marginTop:2 }}>Both Branches · Full Access</div>
          </div>
        </div>

        {/* Nav */}
        <div style={{ flex:1,padding:"6px 8px",overflowY:"auto" }}>
          {GROUPS.map(g=>{
            const items=nav.filter(n=>n.group===g.key);
            if(!items.length)return null;
            return (
              <div key={g.key} style={{ marginBottom:6 }}>
                <div style={{ fontSize:9,fontWeight:700,color:"rgba(255,255,255,.25)",letterSpacing:".1em",padding:"10px 8px 4px" }}>{g.label}</div>
                {items.map(n=>(
                  <button key={n.key} onClick={()=>setPage(n.key)}
                    style={{ display:"flex",alignItems:"center",gap:10,width:"100%",padding:"9px 12px",borderRadius:9,border:"none",cursor:"pointer",
                      background:page===n.key?`${perm.color}18`:"transparent",color:page===n.key?perm.color:"rgba(255,255,255,.5)",
                      fontWeight:page===n.key?700:500,fontSize:13,borderLeft:page===n.key?`3px solid ${perm.color}`:"3px solid transparent",
                      transition:"all .15s",textAlign:"left" }}>
                    <span style={{ fontSize:15 }}>{n.icon}</span>{n.label}
                  </button>
                ))}
              </div>
            );
          })}
        </div>

        {/* Role switcher */}
        <div style={{ padding:"10px 10px",borderTop:"1px solid rgba(255,255,255,.07)",position:"relative" }} ref={dropRef}>
          <button onClick={()=>setRoleDrop(o=>!o)} style={{ width:"100%",display:"flex",alignItems:"center",gap:8,padding:"8px 10px",borderRadius:9,border:`1px solid ${perm.color}30`,background:perm.bg,color:perm.color,fontWeight:700,fontSize:11,cursor:"pointer" }}>
            {perm.badge} Switch Role <span style={{ marginLeft:"auto",opacity:.6 }}>▾</span>
          </button>
          {roleDrop&&(
            <div style={{ position:"absolute",bottom:"calc(100% + 8px)",left:6,right:6,background:"#1a2035",border:"1px solid rgba(255,255,255,.1)",borderRadius:12,overflow:"hidden",zIndex:400 }}>
              {Object.entries(ROLES).map(([k,v])=>(
                <div key={k} onClick={()=>{setRole(k);setRoleDrop(false);setPage("dashboard");}} style={{ display:"flex",alignItems:"center",gap:8,padding:"10px 12px",cursor:"pointer",background:role===k?"rgba(255,255,255,.06)":"transparent",borderBottom:"1px solid rgba(255,255,255,.05)" }}>
                  <span>{v.badge}</span>
                  <div style={{ fontSize:12,fontWeight:700,color:v.color }}>{v.label}</div>
                  {role===k&&<span style={{ marginLeft:"auto",color:"#34D399",fontSize:12 }}>✓</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* MAIN */}
      <div style={{ flex:1,overflowY:"auto",padding:"28px 32px" }}>
        {page==="dashboard"   && <Dashboard   patients={patients} users={users} depts={depts} />}
        {page==="patients"    && <Patients    patients={patients} setPatients={setPatients} />}
        {page==="billing"     && <Billing     patients={patients} setPatients={setPatients} />}
        {page==="history"     && <PatientHistory patients={patients} />}
        {page==="dod"         && <ExpectedDOD patients={patients} />}
        {page==="admnotes"    && <AdmissionNotes patients={patients} setPatients={setPatients} />}
        {page==="medicines"   && <Medicines   patients={patients} setPatients={setPatients} />}
        {page==="discharge"   && <DischargeSummary patients={patients} />}
        {page==="reports"     && <Reports     patients={patients} />}
        {page==="users"       && <Users       role={role} users={users} setUsers={setUsers} />}
        {page==="departments" && <Departments depts={depts} setDepts={setDepts} />}
        {page==="createadmin" && role==="superadmin" && <CreateAdmin users={users} setUsers={setUsers} />}
      </div>
    </div>
  );
}