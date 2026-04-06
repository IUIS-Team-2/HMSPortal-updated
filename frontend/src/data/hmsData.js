// ─── HMS Shared Data Store ────────────────────────────────────────────────────
// Single source of truth for all branches. Import this wherever needed.

export const BRANCHES = {
  all:   { label: 'All Branches',   color: '#1e40af' },
  laxmi: { label: 'Laxmi Nagar',    color: '#0f766e' },
  raya:  { label: 'Raya',           color: '#1d4ed8' },
};

export const DEPARTMENTS = ['Billing', 'Pharmacy', 'OPD', 'IPD', 'Lab', 'Admin', 'Others'];

export const PATIENTS = [
  { id:'P-001', uhid:'UHID-4821903', name:'Rahul Sharma',   age:45, ward:'General',   bed:'A-12', branch:'laxmi', status:'Recovered', admType:'Cash',     doa:'2025-03-02T10:30', dod:'2025-03-05T09:00', bills:12400, billStatus:'Generated', medHistory:false },
  { id:'P-002', uhid:'UHID-4821903', name:'Rahul Sharma',   age:45, ward:'General',   bed:'A-08', branch:'laxmi', status:'Recovered', admType:'Cash',     doa:'2024-09-10T09:00', dod:'2024-09-14T11:00', bills:8600,  billStatus:'Generated', medHistory:false },
  { id:'P-003', uhid:'UHID-7734521', name:'Priya Verma',    age:32, ward:'Maternity', bed:'B-04', branch:'laxmi', status:'Recovered', admType:'Cashless', doa:'2023-11-05T08:00', dod:'2023-11-09T10:00', bills:34200, billStatus:'Generated', medHistory:false },
  { id:'P-004', uhid:'UHID-5512381', name:'Amit Sharma',    age:67, ward:'ICU',       bed:'ICU-3',branch:'laxmi', status:'Critical',  admType:'Cashless', doa:'2026-04-01T14:00', dod:null,               bills:89000, billStatus:'Pending',   medHistory:true  },
  { id:'P-005', uhid:'UHID-6623410', name:'Sunita Devi',    age:38, ward:'Maternity', bed:'B-06', branch:'raya',  status:'Admitted',  admType:'Cashless', doa:'2026-04-02T09:00', dod:null,               bills:34200, billStatus:'Pending',   medHistory:true  },
  { id:'P-006', uhid:'UHID-7743210', name:'Mohammed Iqbal', age:55, ward:'Cardio',    bed:'D-02', branch:'raya',  status:'Stable',    admType:'Cashless', doa:'2026-04-03T11:00', dod:null,               bills:55000, billStatus:'Pending',   medHistory:true  },
  { id:'P-007', uhid:'UHID-8812340', name:'Kavita Rao',     age:29, ward:'General',   bed:'A-15', branch:'raya',  status:'Stable',    admType:'Cash',     doa:'2026-04-04T08:00', dod:null,               bills:9800,  billStatus:'Pending',   medHistory:false },
];

export const INVOICES = [
  { id:'INV-3001', patientId:'P-001', patient:'Rahul Sharma',   amount:12400, type:'Cash',     branch:'laxmi', date:'2025-03-05', status:'Approved', approvedBy:'Super Admin' },
  { id:'INV-3002', patientId:'P-002', patient:'Rahul Sharma',   amount:8600,  type:'Cash',     branch:'laxmi', date:'2024-09-14', status:'Approved', approvedBy:'Super Admin' },
  { id:'INV-3003', patientId:'P-003', patient:'Priya Verma',    amount:34200, type:'Cashless', branch:'laxmi', date:'2023-11-09', status:'Approved', approvedBy:'Super Admin' },
  { id:'INV-3004', patientId:'P-004', patient:'Amit Sharma',    amount:89000, type:'Cashless', branch:'laxmi', date:'2026-04-06', status:'Pending',  approvedBy:null },
  { id:'INV-3005', patientId:'P-005', patient:'Sunita Devi',    amount:34200, type:'Cashless', branch:'raya',  date:'2026-04-06', status:'Pending',  approvedBy:null },
  { id:'INV-3006', patientId:'P-006', patient:'Mohammed Iqbal', amount:55000, type:'Cashless', branch:'raya',  date:'2026-04-06', status:'Pending',  approvedBy:null },
  { id:'INV-3007', patientId:'P-007', patient:'Kavita Rao',     amount:9800,  type:'Cash',     branch:'raya',  date:'2026-04-06', status:'Pending',  approvedBy:null },
];

export const BILL_ITEMS = {
  'P-004': [
    { id:'BI-001', item:'ICU Room Charges',  rate:8000, qty:10, amount:80000 },
    { id:'BI-002', item:'Consultation',       rate:1000, qty:5,  amount:5000  },
    { id:'BI-003', item:'Lab Tests',          rate:4000, qty:1,  amount:4000  },
  ],
  'P-007': [
    { id:'BI-004', item:'General Room',      rate:1200, qty:5,  amount:6000 },
    { id:'BI-005', item:'Consultation',      rate:800,  qty:3,  amount:2400 },
    { id:'BI-006', item:'Medicines',         rate:1400, qty:1,  amount:1400 },
  ],
};

export const MEDICINES = [
  { id:'M-001', name:'Amoxicillin 500mg',    stock:240, unit:'Tablet',  price:8,   category:'Antibiotic',   branch:'laxmi', reorderAt:50  },
  { id:'M-002', name:'Paracetamol 650mg',    stock:580, unit:'Tablet',  price:3,   category:'Analgesic',    branch:'laxmi', reorderAt:100 },
  { id:'M-003', name:'Metformin 500mg',      stock:120, unit:'Tablet',  price:5,   category:'Antidiabetic', branch:'raya',  reorderAt:50  },
  { id:'M-004', name:'Omeprazole 20mg',      stock:40,  unit:'Capsule', price:12,  category:'GI',           branch:'laxmi', reorderAt:50  },
  { id:'M-005', name:'Ringer Lactate 500ml', stock:18,  unit:'Bottle',  price:85,  category:'IV Fluid',     branch:'raya',  reorderAt:20  },
  { id:'M-006', name:'Ceftriaxone 1g',       stock:65,  unit:'Vial',    price:180, category:'Antibiotic',   branch:'raya',  reorderAt:30  },
];

export const HMS_USERS = [
  { id:'U-001', name:'Dr. Anita Mehta',  role:'admin',    dept:'Admin',    branch:'laxmi', username:'admin.laxmi',   status:'Active',   createdBy:'superadmin' },
  { id:'U-002', name:'Rohit Verma',      role:'employee', dept:'Billing',  branch:'raya',  username:'rohit.v',       status:'Active',   createdBy:'admin.raya'  },
  { id:'U-003', name:'Seema Bhatia',     role:'employee', dept:'Pharmacy', branch:'laxmi', username:'seema.b',       status:'Active',   createdBy:'admin.laxmi' },
  { id:'U-004', name:'Arun Kapoor',      role:'admin',    dept:'Admin',    branch:'raya',  username:'arun.k',        status:'Active',   createdBy:'superadmin' },
  { id:'U-005', name:'Billing Staff',    role:'employee', dept:'Billing',  branch:'laxmi', username:'billing.laxmi', status:'Active',   createdBy:'admin.laxmi' },
  { id:'U-006', name:'Pharmacy Staff',   role:'employee', dept:'Pharmacy', branch:'raya',  username:'pharma.raya',   status:'Active',   createdBy:'admin.raya'  },
];

// ─── Utility helpers ──────────────────────────────────────────────────────────
export const fmt = (n) => '₹' + Number(n).toLocaleString('en-IN');

export const fmtDate = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' });
};

export const getFilteredPatients = (branch) =>
  branch === 'all' ? PATIENTS : PATIENTS.filter(p => p.branch === branch);

export const getFilteredInvoices = (branch) =>
  branch === 'all' ? INVOICES : INVOICES.filter(i => i.branch === branch);

export const downloadCSV = (data, filename) => {
  if (!data.length) return;
  const headers = Object.keys(data[0]).join(',');
  const rows = data.map(r => Object.values(r).map(v => `"${v ?? ''}"`).join(',')).join('\n');
  const blob = new Blob([headers + '\n' + rows], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
};