import React, { useState } from 'react';
import { useAuth } from '../App';
import {
  PATIENTS, INVOICES, MEDICINES, HMS_USERS, BRANCHES, DEPARTMENTS,
  BILL_ITEMS, fmt, fmtDate, getFilteredPatients, getFilteredInvoices, downloadCSV,
} from '../data/hmsData';
import {
  Badge, BranchPill, StatCard, Card, CardHeader, Btn, Table,
  Modal, Field, Input, Select, TabBar, Alert, PageHeader, NavItem, OCEAN,
} from '../components/ui';

// ─── Sidebar ──────────────────────────────────────────────────────────────────
const NAV_SECTIONS = [
  { label:'Overview',       items:[{ id:'dashboard', icon:'📊', label:'Dashboard' },{ id:'patients', icon:'🧑‍⚕️', label:'Patients' },{ id:'reports', icon:'📋', label:'Reports & Summaries' }] },
  { label:'Finance',        items:[{ id:'invoices', icon:'💳', label:'Invoices & Billing' },{ id:'billing', icon:'✏️', label:'Bill Management' }] },
  { label:'Administration', items:[{ id:'users', icon:'👥', label:'User Management' },{ id:'pharmacy', icon:'💊', label:'Pharmacy' },{ id:'discharge', icon:'🚪', label:'Discharge' }] },
];

function Sidebar({ page, setPage, branch, setBranch, user, onLogout }) {
  const [branchOpen, setBranchOpen] = useState(false);

  return (
    <div style={{
      width: 230, minHeight:'100vh', background: OCEAN[900],
      display:'flex', flexDirection:'column', position:'fixed', top:0, left:0, zIndex:50,
    }}>
      {/* Logo */}
      <div style={{ padding:'20px 16px 16px', borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:36, height:36, borderRadius:10, background:'rgba(255,255,255,0.12)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>🏥</div>
          <div>
            <div style={{ color:'#fff', fontWeight:700, fontSize:14 }}>Sangi Hospital</div>
            <div style={{ color:'rgba(255,255,255,0.45)', fontSize:10, textTransform:'uppercase', letterSpacing:'0.08em' }}>Super Admin</div>
          </div>
        </div>
      </div>

      {/* Branch Switcher */}
      <div style={{ padding:'12px 8px', borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ fontSize:10, color:'rgba(255,255,255,0.4)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:6, paddingLeft:8 }}>Branch</div>
        <button
          onClick={() => setBranchOpen(o => !o)}
          style={{
            width:'100%', padding:'8px 12px', borderRadius:8,
            background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.15)',
            color:'#fff', fontSize:13, cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center',
          }}
        >
          <span>{BRANCHES[branch]?.label}</span>
          <span>{branchOpen ? '▴' : '▾'}</span>
        </button>
        {branchOpen && (
          <div style={{ background:'rgba(255,255,255,0.08)', borderRadius:8, marginTop:4, overflow:'hidden' }}>
            {Object.entries(BRANCHES).map(([k, v]) => (
              <div key={k} onClick={() => { setBranch(k); setBranchOpen(false); }} style={{
                padding:'8px 14px', fontSize:13, cursor:'pointer', color: branch===k ? '#60a5fa' : 'rgba(255,255,255,0.7)',
                background: branch===k ? 'rgba(96,165,250,0.15)' : 'transparent',
                fontWeight: branch===k ? 600 : 400,
              }}>{v.label}</div>
            ))}
          </div>
        )}
      </div>

      {/* Nav */}
      <div style={{ flex:1, overflowY:'auto', padding:'8px 0' }}>
        {NAV_SECTIONS.map(sec => (
          <div key={sec.label} style={{ marginBottom:8 }}>
            <div style={{ fontSize:10, color:'rgba(255,255,255,0.35)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', padding:'8px 24px 4px' }}>{sec.label}</div>
            {sec.items.map(item => (
              <NavItem key={item.id} icon={item.icon} label={item.label} active={page===item.id} onClick={() => setPage(item.id)} />
            ))}
          </div>
        ))}
      </div>

      {/* User Footer */}
      <div style={{ padding:'12px', borderTop:'1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', background:'rgba(255,255,255,0.07)', borderRadius:10 }}>
          <div style={{ width:32, height:32, borderRadius:8, background:OCEAN[400], display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, color:'#fff', fontWeight:700, flexShrink:0 }}>
            {user.name.charAt(0)}
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:12, color:'#fff', fontWeight:600, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{user.name}</div>
            <div style={{ fontSize:10, color:'rgba(255,255,255,0.4)' }}>Super Admin</div>
          </div>
          <button onClick={onLogout} title="Logout" style={{ background:'none', border:'none', color:'rgba(255,255,255,0.4)', cursor:'pointer', fontSize:16 }}>⏻</button>
        </div>
      </div>
    </div>
  );
}

// ─── Dashboard Home ───────────────────────────────────────────────────────────
function DashboardHome({ branch }) {
  const fp = getFilteredPatients(branch);
  const fi = getFilteredInvoices(branch);
  const totalBills = fp.reduce((a, p) => a + p.bills, 0);
  const pending = fi.filter(i => i.status === 'Pending').length;
  const cashPts = fp.filter(p => p.admType === 'Cash').length;
  const cashlessPts = fp.filter(p => p.admType === 'Cashless').length;

  return (
    <div>
      <PageHeader title="Dashboard" sub={`${BRANCHES[branch]?.label} · ${new Date().toLocaleDateString('en-IN',{dateStyle:'long'})}`}
        actions={[
          <Btn key="dl" onClick={() => downloadCSV(fp,'patients.csv')}>↓ Export Patients</Btn>,
          <Btn key="dl2" onClick={() => downloadCSV(fi,'invoices.csv')}>↓ Export Invoices</Btn>,
        ]}
      />

      {pending > 0 && (
        <Alert type="warn">
          ⚠️ <strong>{pending} invoice(s)</strong> are pending your approval. These require Super Admin sign-off before billing is finalised.
        </Alert>
      )}

      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:24 }}>
        <StatCard label="Total Patients"  value={fp.length}    sub={`${cashPts} Cash · ${cashlessPts} Cashless`} />
        <StatCard label="Total Billing"   value={fmt(totalBills)} sub="All active patients" accent="#0f766e" />
        <StatCard label="Pending Invoices" value={pending}     sub="Needs approval"          accent="#d97706" />
        <StatCard label="Beds Occupied"   value={fp.length}    sub="Across all wards"        accent="#7c3aed" />
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
        <Card>
          <CardHeader title="Recent Patients" action={<Btn size="sm">View All</Btn>} />
          <Table
            columns={[
              { label:'Name', key:'name', render:r=><span style={{fontWeight:600}}>{r.name}</span> },
              { label:'Ward', key:'ward' },
              { label:'DOD', key:'dod', render:r=>r.dod ? new Date(r.dod).toLocaleDateString('en-IN') : <Badge variant="amber">Pending</Badge> },
              { label:'Type', key:'admType', render:r=><Badge variant={r.admType==='Cash'?'teal':'blue'}>{r.admType}</Badge> },
            ]}
            data={fp.slice(0, 5)}
          />
        </Card>
        <Card>
          <CardHeader title="Invoice Status" action={<Btn size="sm">View All</Btn>} />
          <Table
            columns={[
              { label:'Invoice', key:'id', render:r=><span style={{fontSize:12,color:'#6b7280'}}>{r.id}</span> },
              { label:'Patient', key:'patient' },
              { label:'Amount', key:'amount', render:r=><span style={{fontWeight:600}}>{fmt(r.amount)}</span> },
              { label:'Status', key:'status', render:r=><Badge variant={r.status==='Approved'?'green':'amber'}>{r.status}</Badge> },
            ]}
            data={fi.slice(0, 5)}
          />
        </Card>
      </div>
    </div>
  );
}

// ─── Patients Page ────────────────────────────────────────────────────────────
function PatientsPage({ branch }) {
  const [tab, setTab] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  const fp = getFilteredPatients(branch).filter(p => {
    if (tab === 'cash' && p.admType !== 'Cash') return false;
    if (tab === 'cashless' && p.admType !== 'Cashless') return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.uhid.includes(search)) return false;
    return true;
  });

  return (
    <div>
      <PageHeader title="Patients" sub={`${fp.length} records · ${BRANCHES[branch]?.label}`}
        actions={[<Btn key="dl" onClick={() => downloadCSV(fp,'patients.csv')}>↓ Download CSV</Btn>]}
      />
      <TabBar
        tabs={[{id:'all',label:'All'},{id:'cash',label:'Cash'},{id:'cashless',label:'Cashless'}]}
        active={tab} onChange={setTab}
      />
      <div style={{ marginBottom:14 }}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search name or UHID…"
          style={{ padding:'8px 14px', border:'1px solid #d1d5db', borderRadius:8, fontSize:13, width:280, outline:'none' }} />
      </div>
      <Card padding="0">
        <Table
          data={fp}
          columns={[
            { label:'#', render:(_,i)=>i+1 },
            { label:'Patient', render:r=><div><div style={{fontWeight:600}}>{r.name}</div><div style={{fontSize:11,color:'#9ca3af'}}>{r.uhid}</div></div> },
            { label:'Age/Ward', render:r=>`${r.age}y · ${r.ward}` },
            { label:'Branch', render:r=><BranchPill branch={r.branch}/> },
            { label:'Type', render:r=><Badge variant={r.admType==='Cash'?'teal':'blue'}>{r.admType}</Badge> },
            { label:'Bills', render:r=><span style={{fontWeight:600}}>{fmt(r.bills)}</span>, align:'right' },
            { label:'DOD', render:r=>r.dod ? new Date(r.dod).toLocaleDateString('en-IN') : <Badge variant="amber">Not Set</Badge> },
            { label:'Status', render:r=><Badge variant={r.status==='Critical'?'red':r.status==='Recovered'?'green':r.status==='Stable'?'teal':'blue'}>{r.status}</Badge> },
            { label:'', render:r=><Btn size="sm" onClick={()=>setSelected(r)}>View</Btn> },
          ]}
        />
      </Card>

      <Modal open={!!selected} onClose={()=>setSelected(null)} title={`Patient — ${selected?.name}`}>
        {selected && (
          <div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:16 }}>
              {[['UHID',selected.uhid],['Age',`${selected.age} yrs`],['Ward / Bed',`${selected.ward} / ${selected.bed}`],['Branch',BRANCHES[selected.branch]?.label],['Billing Type',selected.admType],['Status',selected.status],['Date of Admission',fmtDate(selected.doa)],['Expected Discharge',selected.dod?fmtDate(selected.dod):'Not set'],['Total Bills',fmt(selected.bills)],['Bill Status',selected.billStatus]].map(([k,v])=>(
                <div key={k}><div style={{fontSize:11,color:'#9ca3af',fontWeight:600,marginBottom:2}}>{k}</div><div style={{fontSize:14,color:'#111827',fontWeight:500}}>{v}</div></div>
              ))}
            </div>
            <div style={{ display:'flex', gap:8, justifyContent:'flex-end', paddingTop:16, borderTop:'1px solid #f3f4f6' }}>
              <Btn onClick={()=>downloadCSV([selected],`patient_${selected.id}.csv`)}>↓ Download</Btn>
              <Btn variant="primary" onClick={()=>setSelected(null)}>Close</Btn>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

// ─── Invoices Page (Super Admin can approve) ──────────────────────────────────
function InvoicesPage({ branch }) {
  const [invoices, setInvoices] = useState(INVOICES);
  const [tab, setTab] = useState('all');

  const fi = (branch === 'all' ? invoices : invoices.filter(i => i.branch === branch)).filter(i => {
    if (tab === 'cash' && i.type !== 'Cash') return false;
    if (tab === 'cashless' && i.type !== 'Cashless') return false;
    if (tab === 'pending' && i.status !== 'Pending') return false;
    return true;
  });

  const approve = (id) => setInvoices(prev => prev.map(i => i.id === id ? {...i, status:'Approved', approvedBy:'Super Admin'} : i));
  const approveAll = () => setInvoices(prev => prev.map(i => i.status==='Pending' ? {...i, status:'Approved', approvedBy:'Super Admin'} : i));

  const pendingCount = invoices.filter(i => i.status === 'Pending' && (branch === 'all' || i.branch === branch)).length;

  return (
    <div>
      <PageHeader title="Invoices & Billing" sub={`${fi.length} invoices · ${BRANCHES[branch]?.label}`}
        actions={[
          <Btn key="dl" onClick={() => downloadCSV(fi,'invoices.csv')}>↓ Download</Btn>,
          pendingCount > 0 && <Btn key="aa" variant="primary" onClick={approveAll}>✓ Approve All Pending ({pendingCount})</Btn>,
        ].filter(Boolean)}
      />
      <TabBar
        tabs={[{id:'all',label:'All'},{id:'cash',label:'Cash'},{id:'cashless',label:'Cashless'},{id:'pending',label:'Pending',count:pendingCount}]}
        active={tab} onChange={setTab}
      />
      <Card padding="0">
        <Table
          data={fi}
          columns={[
            { label:'Invoice ID', render:r=><span style={{fontSize:12,color:'#6b7280',fontFamily:'monospace'}}>{r.id}</span> },
            { label:'Patient', key:'patient', render:r=><span style={{fontWeight:600}}>{r.patient}</span> },
            { label:'Date', key:'date' },
            { label:'Amount', render:r=><span style={{fontWeight:700}}>{fmt(r.amount)}</span>, align:'right' },
            { label:'Type', render:r=><Badge variant={r.type==='Cash'?'teal':'blue'}>{r.type}</Badge> },
            { label:'Branch', render:r=><BranchPill branch={r.branch}/> },
            { label:'Status', render:r=><Badge variant={r.status==='Approved'?'green':'amber'}>{r.status}</Badge> },
            { label:'Actions', render:r=>(
              <div style={{display:'flex',gap:6}}>
                <Btn size="sm" onClick={() => window.print()}>Print</Btn>
                {r.status === 'Pending' && <Btn size="sm" variant="primary" onClick={() => approve(r.id)}>✓ Approve</Btn>}
              </div>
            )},
          ]}
        />
      </Card>
    </div>
  );
}

// ─── Bill Management ──────────────────────────────────────────────────────────
function BillingPage({ branch }) {
  const fp = getFilteredPatients(branch).filter(p => p.billStatus === 'Pending');
  const [selPat, setSelPat] = useState(fp[0] || null);
  const [items, setItems] = useState(BILL_ITEMS[selPat?.id] || []);

  const selectPat = (p) => { setSelPat(p); setItems(BILL_ITEMS[p.id] || []); };
  const updateItem = (id, field, val) => setItems(prev => prev.map(it => it.id===id ? {...it, [field]:Number(val), amount: field==='rate' ? Number(val)*it.qty : it.rate*Number(val)} : it));
  const total = items.reduce((a,i) => a + i.amount, 0);

  return (
    <div>
      <PageHeader title="Bill Management" sub="Edit rates & quantities for pending bills" />
      <div style={{ display:'grid', gridTemplateColumns:'280px 1fr', gap:16 }}>
        {/* Patient List */}
        <Card padding="0">
          <div style={{ padding:'14px 16px', borderBottom:'1px solid #f3f4f6', fontSize:13, fontWeight:600, color:'#111827' }}>Pending Bills</div>
          {fp.length === 0 && <div style={{padding:20,fontSize:13,color:'#9ca3af',textAlign:'center'}}>No pending bills</div>}
          {fp.map(p => (
            <div key={p.id} onClick={() => selectPat(p)} style={{
              padding:'12px 16px', cursor:'pointer', borderBottom:'1px solid #f9fafb',
              background: selPat?.id===p.id ? OCEAN[50] : 'transparent',
              borderLeft: selPat?.id===p.id ? `3px solid ${OCEAN[400]}` : '3px solid transparent',
            }}>
              <div style={{fontSize:13,fontWeight:600,color:'#111827'}}>{p.name}</div>
              <div style={{fontSize:11,color:'#9ca3af'}}>{p.uhid} · {fmt(p.bills)}</div>
            </div>
          ))}
        </Card>

        {/* Bill Editor */}
        <div>
          {selPat ? (
            <Card>
              <CardHeader
                title={`Editing Bill — ${selPat.name}`}
                action={<div style={{display:'flex',gap:8}}>
                  <Btn onClick={() => downloadCSV(items, `bill_${selPat.id}.csv`)}>↓ Download</Btn>
                  <Btn variant="primary" onClick={() => alert('Bill saved!')}>Save All</Btn>
                </div>}
              />
              <table style={{width:'100%',borderCollapse:'collapse',fontSize:13}}>
                <thead>
                  <tr style={{background:OCEAN[900]}}>
                    {['Item','Rate (₹)','Qty','Amount (₹)',''].map((h,i) => (
                      <th key={i} style={{padding:'10px 14px',color:'#93c5fd',fontWeight:600,fontSize:11,textAlign:i>0?'right':'left',textTransform:'uppercase',letterSpacing:'0.06em'}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {items.map((item,ri) => (
                    <tr key={item.id} style={{borderBottom:'1px solid #f3f4f6',background:ri%2===0?'#fff':'#f9fafb'}}>
                      <td style={{padding:'10px 14px',fontWeight:500}}>{item.item}</td>
                      <td style={{padding:'10px 14px',textAlign:'right'}}>
                        <input type="number" value={item.rate} onChange={e=>updateItem(item.id,'rate',e.target.value)}
                          style={{width:90,padding:'5px 8px',border:'1px solid #d1d5db',borderRadius:6,fontSize:13,textAlign:'right'}} />
                      </td>
                      <td style={{padding:'10px 14px',textAlign:'right'}}>
                        <input type="number" value={item.qty} onChange={e=>updateItem(item.id,'qty',e.target.value)}
                          style={{width:70,padding:'5px 8px',border:'1px solid #d1d5db',borderRadius:6,fontSize:13,textAlign:'right'}} />
                      </td>
                      <td style={{padding:'10px 14px',textAlign:'right',fontWeight:600}}>{fmt(item.amount)}</td>
                      <td style={{padding:'10px 14px',textAlign:'right'}}><Btn size="sm">Save</Btn></td>
                    </tr>
                  ))}
                  <tr style={{background:OCEAN[50]}}>
                    <td colSpan={3} style={{padding:'12px 14px',fontWeight:700,textAlign:'right',color:OCEAN[700]}}>Total</td>
                    <td style={{padding:'12px 14px',textAlign:'right',fontWeight:800,fontSize:16,color:OCEAN[600]}}>{fmt(total)}</td>
                    <td />
                  </tr>
                </tbody>
              </table>
            </Card>
          ) : <Card><div style={{textAlign:'center',padding:40,color:'#9ca3af'}}>Select a patient to edit their bill</div></Card>}
        </div>
      </div>
    </div>
  );
}

// ─── Reports Page ─────────────────────────────────────────────────────────────
function ReportsPage({ branch }) {
  const fp = getFilteredPatients(branch);
  return (
    <div>
      <PageHeader title="Reports & Summaries" sub={`${BRANCHES[branch]?.label}`}
        actions={[<Btn key="dl" variant="primary" onClick={() => downloadCSV(fp,'all_reports.csv')}>↓ Download All</Btn>]}
      />
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:20 }}>
        {[
          { title:'Patient Reports', desc:'Lab results, diagnostics, clinical notes', icon:'🔬' },
          { title:'Discharge Summaries', desc:'Discharge notes, prescriptions, follow-ups', icon:'📄' },
          { title:'Financial Reports', desc:'Revenue, collections, insurance claims', icon:'📊' },
        ].map(r => (
          <Card key={r.title}>
            <div style={{fontSize:24,marginBottom:10}}>{r.icon}</div>
            <div style={{fontSize:14,fontWeight:600,color:'#111827',marginBottom:6}}>{r.title}</div>
            <div style={{fontSize:12,color:'#6b7280',marginBottom:14}}>{r.desc}</div>
            <Btn size="sm" onClick={() => downloadCSV(fp,`${r.title.replace(/\s/g,'_')}.csv`)}>↓ Download</Btn>
          </Card>
        ))}
      </div>
      <Card padding="0">
        <div style={{padding:'14px 20px',borderBottom:'1px solid #f3f4f6'}}><CardHeader title="Patient Summaries" /></div>
        <Table
          data={fp}
          columns={[
            { label:'ID', render:r=><span style={{fontSize:11,color:'#9ca3af',fontFamily:'monospace'}}>{r.id}</span> },
            { label:'Patient', render:r=><div><div style={{fontWeight:600}}>{r.name}</div><div style={{fontSize:11,color:'#9ca3af'}}>{r.uhid}</div></div> },
            { label:'Ward', key:'ward' },
            { label:'Branch', render:r=><BranchPill branch={r.branch}/> },
            { label:'DOA', render:r=>new Date(r.doa).toLocaleDateString('en-IN') },
            { label:'DOD', render:r=>r.dod?new Date(r.dod).toLocaleDateString('en-IN'):<Badge variant="amber">Pending</Badge> },
            { label:'Status', render:r=><Badge variant={r.status==='Recovered'?'green':r.status==='Critical'?'red':'teal'}>{r.status}</Badge> },
            { label:'', render:r=><Btn size="sm" onClick={()=>downloadCSV([r],`${r.id}_summary.csv`)}>↓ PDF</Btn> },
          ]}
        />
      </Card>
    </div>
  );
}

// ─── User Management ──────────────────────────────────────────────────────────
function UsersPage() {
  const [users, setUsers] = useState(HMS_USERS);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ name:'', username:'', password:'', role:'admin', dept:'Admin', branch:'laxmi' });

  const createUser = () => {
    if (!form.name || !form.username || !form.password) return alert('Please fill all fields.');
    setUsers(prev => [...prev, { id:`U-00${prev.length+1}`, ...form, status:'Active', createdBy:'superadmin' }]);
    setModal(false);
    setForm({ name:'', username:'', password:'', role:'admin', dept:'Admin', branch:'laxmi' });
  };

  return (
    <div>
      <PageHeader title="User Management" sub={`${users.length} users registered`}
        actions={[
          <Btn key="ca" variant="primary" onClick={()=>{setForm(f=>({...f,role:'admin',dept:'Admin'}));setModal(true);}}>+ Create Admin</Btn>,
          <Btn key="ce" onClick={()=>{setForm(f=>({...f,role:'employee',dept:'Billing'}));setModal(true);}}>+ Create Employee</Btn>,
        ]}
      />
      <Card padding="0">
        <Table
          data={users}
          columns={[
            { label:'Name', render:r=><span style={{fontWeight:600}}>{r.name}</span> },
            { label:'Role', render:r=><Badge variant={r.role==='admin'?'blue':'gray'}>{r.role==='admin'?'Admin':'Employee'}</Badge> },
            { label:'Department', key:'dept' },
            { label:'Branch', render:r=><BranchPill branch={r.branch}/> },
            { label:'Username', render:r=><span style={{fontSize:12,fontFamily:'monospace',color:'#6b7280'}}>{r.username}</span> },
            { label:'Status', render:r=><Badge variant={r.status==='Active'?'green':'red'}>{r.status}</Badge> },
            { label:'', render:r=><Btn size="sm">Edit</Btn> },
          ]}
        />
      </Card>

      <Modal open={modal} onClose={()=>setModal(false)} title={`Create ${form.role==='admin'?'Admin':'Employee'}`}>
        <Field label="Full Name"><Input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="Full name" /></Field>
        <Field label="Username"><Input value={form.username} onChange={e=>setForm(f=>({...f,username:e.target.value}))} placeholder="username.here" /></Field>
        <Field label="Password"><Input type="password" value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} placeholder="Set password" /></Field>
        <Field label="Department">
          <Select value={form.dept} onChange={e=>setForm(f=>({...f,dept:e.target.value}))} options={form.role==='admin'?['Admin',...DEPARTMENTS]:DEPARTMENTS} />
        </Field>
        <Field label="Branch">
          <Select value={form.branch} onChange={e=>setForm(f=>({...f,branch:e.target.value}))}
            options={[{value:'laxmi',label:'Laxmi Nagar'},{value:'raya',label:'Raya'}]} />
        </Field>
        <div style={{display:'flex',gap:8,justifyContent:'flex-end',marginTop:8}}>
          <Btn onClick={()=>setModal(false)}>Cancel</Btn>
          <Btn variant="primary" onClick={createUser}>Create User</Btn>
        </div>
      </Modal>
    </div>
  );
}

// ─── Pharmacy Page ────────────────────────────────────────────────────────────
function PharmacyPage({ branch }) {
  const meds = branch==='all' ? MEDICINES : MEDICINES.filter(m=>m.branch===branch);
  const lowStock = meds.filter(m=>m.stock<=m.reorderAt);

  return (
    <div>
      <PageHeader title="Pharmacy" sub={`${meds.length} medicines · ${BRANCHES[branch]?.label}`}
        actions={[<Btn key="dl" onClick={()=>downloadCSV(meds,'pharmacy.csv')}>↓ Download</Btn>]}
      />
      {lowStock.length>0 && <Alert type="danger">⚠️ {lowStock.length} medicine(s) at or below reorder level: {lowStock.map(m=>m.name).join(', ')}</Alert>}
      <Card padding="0">
        <Table
          data={meds}
          columns={[
            { label:'Code', render:r=><span style={{fontSize:11,color:'#9ca3af',fontFamily:'monospace'}}>{r.id}</span> },
            { label:'Medicine', render:r=><span style={{fontWeight:600}}>{r.name}</span> },
            { label:'Category', render:r=><Badge variant="gray">{r.category}</Badge> },
            { label:'Stock', render:r=><span style={{color:r.stock<=r.reorderAt?'#b91c1c':'#111827',fontWeight:600}}>{r.stock} {r.stock<=r.reorderAt?'⚠':''}</span> },
            { label:'Unit', key:'unit' },
            { label:'Price', render:r=>fmt(r.price), align:'right' },
            { label:'Branch', render:r=><BranchPill branch={r.branch}/> },
            { label:'', render:()=><div style={{display:'flex',gap:4}}><Btn size="sm">Edit Qty</Btn><Btn size="sm">Edit Price</Btn></div> },
          ]}
        />
      </Card>
    </div>
  );
}

// ─── Discharge Page ───────────────────────────────────────────────────────────
function DischargePage({ branch }) {
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ date:'', summary:'', followup:'' });
  const fp = getFilteredPatients(branch);

  const process = () => { alert(`${selected.name} discharged successfully!`); setSelected(null); };

  return (
    <div>
      <PageHeader title="Discharge Management" sub={`${BRANCHES[branch]?.label}`}
        actions={[<Btn key="dl" onClick={()=>downloadCSV(fp,'discharge.csv')}>↓ Download</Btn>]}
      />
      <Card padding="0">
        <Table
          data={fp}
          columns={[
            { label:'Patient', render:r=><div><div style={{fontWeight:600}}>{r.name}</div><div style={{fontSize:11,color:'#9ca3af'}}>{r.uhid}</div></div> },
            { label:'Ward', key:'ward' },
            { label:'Branch', render:r=><BranchPill branch={r.branch}/> },
            { label:'Type', render:r=><Badge variant={r.admType==='Cash'?'teal':'blue'}>{r.admType}</Badge> },
            { label:'Expected DOD', render:r=>r.dod?new Date(r.dod).toLocaleDateString('en-IN'):<Badge variant="amber">Not Set</Badge> },
            { label:'Bill', render:r=><span style={{fontWeight:600}}>{fmt(r.bills)}</span> },
            { label:'Status', render:r=><Badge variant={r.status==='Critical'?'red':r.status==='Recovered'?'green':r.status==='Stable'?'teal':'blue'}>{r.status}</Badge> },
            { label:'', render:r=><Btn size="sm" variant="primary" onClick={()=>setSelected(r)}>Process</Btn> },
          ]}
        />
      </Card>

      <Modal open={!!selected} onClose={()=>setSelected(null)} title={`Discharge — ${selected?.name}`}>
        {selected && <>
          <Alert type="warn">Confirm all bills are cleared before processing discharge.</Alert>
          <Field label="Discharge Date"><Input type="date" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))} /></Field>
          <Field label="Discharge Summary">
            <textarea value={form.summary} onChange={e=>setForm(f=>({...f,summary:e.target.value}))} rows={3}
              placeholder="Add discharge summary notes…"
              style={{width:'100%',padding:'8px 12px',border:'1px solid #d1d5db',borderRadius:8,fontSize:13,resize:'vertical',boxSizing:'border-box'}} />
          </Field>
          <Field label="Follow-up Date"><Input type="date" value={form.followup} onChange={e=>setForm(f=>({...f,followup:e.target.value}))} /></Field>
          <div style={{display:'flex',gap:8,justifyContent:'flex-end',marginTop:8}}>
            <Btn onClick={()=>setSelected(null)}>Cancel</Btn>
            <Btn variant="primary" onClick={process}>Confirm Discharge</Btn>
          </div>
        </>}
      </Modal>
    </div>
  );
}

// ─── Root SuperAdmin Dashboard ────────────────────────────────────────────────
export default function SuperAdminDashboard() {
  const { user, logout } = useAuth();
  const [page, setPage]     = useState('dashboard');
  const [branch, setBranch] = useState('all');

  const pages = {
    dashboard: <DashboardHome branch={branch} />,
    patients:  <PatientsPage branch={branch} />,
    reports:   <ReportsPage branch={branch} />,
    invoices:  <InvoicesPage branch={branch} />,
    billing:   <BillingPage branch={branch} />,
    users:     <UsersPage />,
    pharmacy:  <PharmacyPage branch={branch} />,
    discharge: <DischargePage branch={branch} />,
  };

  return (
    <div style={{ display:'flex', fontFamily:"'Segoe UI',system-ui,sans-serif", background:'#f8fafc', minHeight:'100vh' }}>
      <Sidebar page={page} setPage={setPage} branch={branch} setBranch={setBranch} user={user} onLogout={logout} />
      <main style={{ marginLeft:230, flex:1, padding:'28px 32px', minHeight:'100vh' }}>
        {pages[page] || pages.dashboard}
      </main>
    </div>
  );
}