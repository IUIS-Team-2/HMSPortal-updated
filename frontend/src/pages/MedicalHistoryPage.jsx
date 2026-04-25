import { T } from "../data/constants";
import { Ico, IC } from "../components/ui/Icons";
import { useState, useRef, useEffect } from "react";

// ─── Investigation options ───────────────────────────────────────────────────
const INVESTIGATION_OPTIONS = [
  // ── HAEMATOLOGY ──────────────────────────────────────────────────────────
  "CBC (Complete Blood Count)",
  "Haemoglobin (Hb)",
  "TLC (Total Leucocyte Count)",
  "DLC (Differential Leucocyte Count)",
  "Polymorphs",
  "Lymphocyte Count",
  "Eosinophil Count",
  "Monocyte Count",
  "Basophil Count",
  "PCV (Packed Cell Volume / Haematocrit)",
  "MCV (Mean Corpuscular Volume)",
  "MCH (Mean Corpuscular Haemoglobin)",
  "MCHC (Mean Corpuscular Haemoglobin Concentration)",
  "RBC Count (Red Blood Cell Count)",
  "Platelet Count",
  "ESR (Wintrobe Method)",
  "ESR (Erythrocyte Sedimentation Rate)",
  "Peripheral Blood Smear (Blood Picture)",
  "Blood Group & Rh Factor",
  "Reticulocyte Count",
  "Bleeding Time (BT) & Clotting Time (CT)",
  "Prothrombin Time (PT / INR)",
  "aPTT (Activated Partial Thromboplastin Time)",
  "D-Dimer",
  // ── BIOCHEMISTRY — Blood Sugar ────────────────────────────────────────────
  "Blood Glucose Random (RBS)",
  "Blood Glucose Fasting (FBS)",
  "Blood Glucose Post-Prandial (PPBS)",
  "HbA1c (Glycosylated Haemoglobin)",
  "Mean Plasma Glucose",
  "Urine Ketone",
  // ── BIOCHEMISTRY — Kidney Function ───────────────────────────────────────
  "KFT (Kidney Function Test)",
  "Blood Urea",
  "Serum Creatinine",
  "Serum Uric Acid",
  "Serum Sodium",
  "Serum Potassium",
  "Serum Calcium",
  "Serum Phosphorus",
  "Serum Magnesium",
  "Serum Electrolytes (Na / K / Cl)",
  // ── BIOCHEMISTRY — Liver Function ─────────────────────────────────────────
  "LFT (Liver Function Test)",
  "Serum Bilirubin Total",
  "Serum Bilirubin (Conjugated / Direct)",
  "Serum Bilirubin (Unconjugated / Indirect)",
  "SGOT / AST",
  "SGPT / ALT",
  "Serum Total Protein",
  "Serum Albumin",
  "Serum Globulin",
  "A:G Ratio (Albumin:Globulin)",
  "Serum Alkaline Phosphatase",
  "Serum GGT (Gamma-Glutamyl Transferase)",
  // ── BIOCHEMISTRY — Lipid Profile ──────────────────────────────────────────
  "Lipid Profile",
  "Cholesterol Total",
  "Triglycerides",
  "HDL Cholesterol",
  "LDL Cholesterol",
  "VLDL Cholesterol",
  "LDL / HDL Ratio",
  // ── BIOCHEMISTRY — Cardiac Markers ───────────────────────────────────────
  "Troponin I",
  "Troponin T",
  "CPK-MB",
  "CPK (Creatine Phosphokinase)",
  "NT-proBNP",
  "BNP (B-Type Natriuretic Peptide)",
  "LDH (Lactate Dehydrogenase)",
  // ── BIOCHEMISTRY — Inflammatory / Sepsis ──────────────────────────────────
  "CRP — C-Reactive Protein (Qualitative)",
  "CRP — C-Reactive Protein (Quantitative)",
  "Serum Procalcitonin (PCT)",
  "Serum Amylase",
  "Serum Lipase",
  // ── BIOCHEMISTRY — Blood Gas ──────────────────────────────────────────────
  "Blood Gas Analysis (ABG)",
  "pH",
  "pCO2",
  "pO2",
  "HCO3 (Bicarbonate)",
  "Base Excess (BE)",
  "SpO2 / %SO2C",
  // ── BIOCHEMISTRY — Iron / Nutrition / Vitamins ────────────────────────────
  "Iron Profile (Iron / TIBC / Ferritin)",
  "Serum Iron",
  "TIBC (Total Iron Binding Capacity)",
  "Transferrin Saturation",
  "Unsaturated Iron Binding Capacity (UIBC)",
  "Serum Ferritin",
  "Vitamin B12 (Cyanocobalamin, Serum — CLIA)",
  "Vitamin D3 (25-OH Vitamin D3)",
  "Serum Folate",
  "Homocysteine Quantitative Serum (CMIA)",
  "Adenosine Deaminase (ADA)",
  // ── BIOCHEMISTRY — Special Tests ──────────────────────────────────────────
  "Serum Lactate",
  "PSA — Prostate Specific Antigen Total Serum (CMIA)",
  "SAAG (Serum Ascites Albumin Gradient)",
  "Body Fluid Routine Analysis",
  "Body Fluid Cytology",
  // ── ENDOCRINOLOGY — Thyroid / Hormones ────────────────────────────────────
  "Total Thyroid Profile (T3 / T4 / TSH)",
  "Free T3",
  "Free T4 (Thyroxine)",
  "TSH (Thyroid Stimulating Hormone)",
  "Anti-TPO (Thyroid Peroxidase Antibody)",
  "Serum Cortisol",
  "Serum Insulin",
  "Beta-HCG",
  "Prolactin",
  "LH / FSH",
  "Estradiol (E2)",
  "Progesterone",
  "Testosterone",
  // ── MICROBIOLOGY — Culture & Sensitivity ─────────────────────────────────
  "Urine C/S (Aerobic Culture & Sensitivity)",
  "Blood C/S (Aerobic Culture & Sensitivity)",
  "Sputum C/S (Aerobic Culture & Sensitivity)",
  "Stool C/S (Aerobic Culture & Sensitivity)",
  "Wound Swab C/S",
  "Body Fluid C/S",
  // ── MICROBIOLOGY — Stains ─────────────────────────────────────────────────
  "Urine Gram Stain",
  "Sputum AFB (Acid Fast Bacilli / ZN Stain)",
  "Sputum Gram Stain",
  "Peripheral Smear for Haemoparasites",
  // ── MICROBIOLOGY — Serology / Immunology ──────────────────────────────────
  "Widal Test (Slide Method)",
  "Typhidot IgM & IgG (S. Typhi)",
  "MP Antigen — Malaria Antigen Test",
  "Dengue NS1 Antigen",
  "Dengue IgM & IgG",
  "HBsAg (Hepatitis B Surface Antigen)",
  "Anti-HCV",
  "HIV I & II",
  "COVID-19 Rapid Antigen",
  "COVID-19 RT-PCR",
  "VDRL / RPR",
  "TPHA",
  "Chikungunya IgM",
  "Leptospira IgM",
  "Scrub Typhus IgM",
  "Influenza A/B Antigen",
  // ── URINE EXAMINATION ─────────────────────────────────────────────────────
  "Urine R/M (Routine & Microscopy)",
  "Urine Examination Report",
  "Urine Pregnancy Test (UPT)",
  "24-Hour Urine Protein",
  "Urine Albumin",
  "Urine Creatinine",
  "Urine Electrolytes",
  // ── STOOL EXAMINATION ─────────────────────────────────────────────────────
  "Stool Routine & Microscopy (Stool R/M)",
  "Stool Occult Blood",
  // ── RADIOLOGY / IMAGING ───────────────────────────────────────────────────
  "X-Ray Chest (PA View)",
  "X-Ray Abdomen (Erect / Supine)",
  "X-Ray KUB",
  "X-Ray Pelvis",
  "X-Ray Spine (Cervical / Lumbar)",
  "USG Abdomen & Pelvis",
  "USG Neck / Thyroid",
  "USG Obstetric",
  "CECT Abdomen & Pelvis",
  "CECT Chest",
  "CT Brain (Plain / Contrast)",
  "CT Chest (HRCT)",
  "MRI Brain",
  "MRI Spine",
  "MRI Knee / Shoulder / Hip",
  "2D Echocardiography",
  "ECG (12-Lead)",
  "Holter Monitoring (24hr ECG)",
  "Doppler Study",
  "TMT (Treadmill Test / Stress Test)",
  "PET CT Scan",
  "Bone Density (DEXA Scan)",
  "Mammography",
  // ── HISTOPATHOLOGY / CYTOLOGY ─────────────────────────────────────────────
  "FNAC",
  "Biopsy (Histopathology)",
  "Pap Smear",
  "Bone Marrow Biopsy",
  "CSF Routine & Culture",
  // ── OTHER ─────────────────────────────────────────────────────────────────
  "Pulmonary Function Test (PFT)",
  "EEG",
  "NCV / EMG",
  "Allergy Panel",
  "Antinuclear Antibody (ANA)",
  "RA Factor",
  "Anti-CCP",
  "ANCA",
  "Complement C3 / C4",
  "Serum Folate / Vitamin B12",
];

// ─── Medication options ───────────────────────────────────────────────────────
const MEDICATION_OPTIONS = [
  // Analgesics / NSAIDs
  "Tab. Paracetamol 500mg", "Tab. Paracetamol 650mg",
  "Tab. Ibuprofen 400mg", "Tab. Ibuprofen 600mg",
  "Tab. Diclofenac 50mg", "Tab. Diclofenac 75mg SR",
  "Tab. Aceclofenac 100mg", "Tab. Aceclofenac + Paracetamol",
  "Tab. Tramadol 50mg", "Tab. Tramadol 100mg SR",
  "Tab. Aspirin 75mg", "Tab. Aspirin 150mg",
  // Antibiotics
  "Tab. Amoxicillin 500mg", "Tab. Amoxicillin + Clavulanate 625mg",
  "Tab. Azithromycin 250mg", "Tab. Azithromycin 500mg",
  "Tab. Ciprofloxacin 500mg", "Tab. Ciprofloxacin 750mg",
  "Tab. Levofloxacin 500mg", "Tab. Levofloxacin 750mg",
  "Tab. Doxycycline 100mg",
  "Tab. Metronidazole 400mg", "Tab. Metronidazole 500mg",
  "Tab. Clarithromycin 250mg", "Tab. Clarithromycin 500mg",
  "Tab. Cefixime 200mg", "Tab. Cefixime 400mg",
  "Tab. Cefuroxime 250mg", "Tab. Cefuroxime 500mg",
  "Tab. Nitrofurantoin 100mg",
  "Tab. Co-trimoxazole (Sulfamethoxazole + Trimethoprim)",
  // GI / Antacids
  "Tab. Pantoprazole 40mg", "Tab. Pantoprazole 20mg",
  "Tab. Omeprazole 20mg", "Tab. Omeprazole 40mg",
  "Tab. Esomeprazole 40mg", "Tab. Rabeprazole 20mg",
  "Tab. Domperidone 10mg", "Tab. Metoclopramide 10mg",
  "Syp. Antacid (Magnesium Hydroxide)",
  "Tab. Ranitidine 150mg",
  "Tab. Ondansetron 4mg", "Tab. Ondansetron 8mg",
  "Tab. Dicyclomine 20mg", "Tab. Mebeverine 135mg",
  "Tab. Loperamide 2mg",
  "Tab. Bisacodyl 5mg", "Syp. Lactulose",
  // Cardiovascular
  "Tab. Amlodipine 5mg", "Tab. Amlodipine 10mg",
  "Tab. Nifedipine 10mg SR", "Tab. Nifedipine 30mg CR",
  "Tab. Losartan 50mg", "Tab. Losartan 100mg",
  "Tab. Telmisartan 40mg", "Tab. Telmisartan 80mg",
  "Tab. Olmesartan 20mg", "Tab. Olmesartan 40mg",
  "Tab. Valsartan 80mg", "Tab. Valsartan 160mg",
  "Tab. Ramipril 2.5mg", "Tab. Ramipril 5mg", "Tab. Ramipril 10mg",
  "Tab. Enalapril 5mg", "Tab. Enalapril 10mg",
  "Tab. Metoprolol 25mg", "Tab. Metoprolol 50mg",
  "Tab. Atenolol 25mg", "Tab. Atenolol 50mg",
  "Tab. Carvedilol 3.125mg", "Tab. Carvedilol 6.25mg",
  "Tab. Bisoprolol 2.5mg", "Tab. Bisoprolol 5mg",
  "Tab. Furosemide 20mg", "Tab. Furosemide 40mg",
  "Tab. Hydrochlorothiazide 12.5mg", "Tab. Hydrochlorothiazide 25mg",
  "Tab. Spironolactone 25mg", "Tab. Spironolactone 50mg",
  "Tab. Digoxin 0.25mg",
  "Tab. Nitroglycerin (GTN) 0.5mg SL",
  "Tab. Isosorbide Mononitrate 20mg",
  "Tab. Clopidogrel 75mg",
  "Tab. Warfarin 1mg", "Tab. Warfarin 2mg", "Tab. Warfarin 5mg",
  "Tab. Rivaroxaban 10mg", "Tab. Rivaroxaban 20mg",
  "Tab. Dabigatran 110mg", "Tab. Dabigatran 150mg",
  // Lipid-lowering
  "Tab. Atorvastatin 10mg", "Tab. Atorvastatin 20mg", "Tab. Atorvastatin 40mg", "Tab. Atorvastatin 80mg",
  "Tab. Rosuvastatin 5mg", "Tab. Rosuvastatin 10mg", "Tab. Rosuvastatin 20mg",
  "Tab. Fenofibrate 145mg",
  "Tab. Ezetimibe 10mg",
  // Antidiabetic
  "Tab. Metformin 500mg", "Tab. Metformin 850mg", "Tab. Metformin 1000mg",
  "Tab. Glimepiride 1mg", "Tab. Glimepiride 2mg", "Tab. Glimepiride 4mg",
  "Tab. Glibenclamide 5mg",
  "Tab. Sitagliptin 50mg", "Tab. Sitagliptin 100mg",
  "Tab. Vildagliptin 50mg",
  "Tab. Teneligliptin 20mg",
  "Tab. Dapagliflozin 5mg", "Tab. Dapagliflozin 10mg",
  "Tab. Empagliflozin 10mg", "Tab. Empagliflozin 25mg",
  "Tab. Canagliflozin 100mg",
  "Tab. Pioglitazone 15mg", "Tab. Pioglitazone 30mg",
  "Inj. Insulin Regular",
  "Inj. Insulin NPH",
  "Inj. Insulin Glargine (Lantus)",
  "Inj. Insulin Detemir",
  "Inj. Insulin Aspart",
  "Inj. Insulin Lispro",
  // Thyroid
  "Tab. Levothyroxine 25mcg", "Tab. Levothyroxine 50mcg", "Tab. Levothyroxine 75mcg", "Tab. Levothyroxine 100mcg",
  "Tab. Carbimazole 5mg",
  "Tab. Propylthiouracil (PTU) 50mg",
  // Neurological / Psychiatric
  "Tab. Phenytoin 100mg",
  "Tab. Carbamazepine 200mg", "Tab. Carbamazepine 400mg",
  "Tab. Valproate 200mg", "Tab. Valproate 500mg",
  "Tab. Levetiracetam 250mg", "Tab. Levetiracetam 500mg",
  "Tab. Gabapentin 100mg", "Tab. Gabapentin 300mg",
  "Tab. Pregabalin 75mg", "Tab. Pregabalin 150mg",
  "Tab. Amitriptyline 10mg", "Tab. Amitriptyline 25mg",
  "Tab. Sertraline 50mg", "Tab. Sertraline 100mg",
  "Tab. Escitalopram 5mg", "Tab. Escitalopram 10mg",
  "Tab. Fluoxetine 20mg",
  "Tab. Clonazepam 0.5mg", "Tab. Clonazepam 1mg",
  "Tab. Alprazolam 0.25mg", "Tab. Alprazolam 0.5mg",
  "Tab. Zolpidem 5mg", "Tab. Zolpidem 10mg",
  "Tab. Quetiapine 25mg", "Tab. Quetiapine 100mg",
  "Tab. Risperidone 1mg", "Tab. Risperidone 2mg",
  "Tab. Donepezil 5mg", "Tab. Donepezil 10mg",
  // Respiratory
  "Tab. Cetirizine 10mg",
  "Tab. Levocetirizine 5mg",
  "Tab. Fexofenadine 120mg", "Tab. Fexofenadine 180mg",
  "Tab. Montelukast 10mg",
  "Tab. Theophylline 100mg SR", "Tab. Theophylline 200mg SR",
  "Inhaler Salbutamol (Albuterol)",
  "Inhaler Ipratropium",
  "Inhaler Budesonide",
  "Inhaler Formoterol + Budesonide",
  "Inhaler Salmeterol + Fluticasone",
  "Inhaler Tiotropium",
  "Tab. Prednisolone 5mg", "Tab. Prednisolone 10mg", "Tab. Prednisolone 20mg",
  "Tab. Dexamethasone 0.5mg",
  // Urology / Renal
  "Tab. Tamsulosin 0.4mg",
  "Tab. Silodosin 8mg",
  "Tab. Finasteride 5mg",
  "Tab. Dutasteride 0.5mg",
  "Tab. Solifenacin 5mg", "Tab. Solifenacin 10mg",
  "Tab. Oxybutynin 5mg",
  "Tab. Nitrofurantoin 50mg SR", "Tab. Nitrofurantoin 100mg SR",
  "Tab. Allopurinol 100mg", "Tab. Allopurinol 300mg",
  "Tab. Febuxostat 40mg", "Tab. Febuxostat 80mg",
  // Vitamins / Supplements
  "Tab. Calcium + Vitamin D3",
  "Tab. Vitamin B-Complex",
  "Tab. Vitamin C 500mg",
  "Tab. Vitamin D3 60000 IU (Weekly)",
  "Tab. Iron + Folic Acid",
  "Tab. Zinc 50mg",
  "Tab. Omega-3 Fatty Acids",
  "Tab. Multivitamin",
  "Tab. Cobalamin (Vitamin B12) 1500mcg",
  "Tab. Folic Acid 5mg",
];

// ─── Searchable Multi-Select Dropdown ────────────────────────────────────────
function SearchableMultiSelect({ label, req, placeholder, value = [], onChange, options, customPlaceholder }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef(null);
  const inputRef = useRef(null);

  const selected = Array.isArray(value) ? value : (value ? [value] : []);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filtered = options.filter(o =>
    o.toLowerCase().includes(search.toLowerCase()) && !selected.includes(o)
  );

  const addItem = (item) => {
    onChange([...selected, item]);
    setSearch("");
    inputRef.current?.focus();
  };

  const removeItem = (item) => {
    onChange(selected.filter(s => s !== item));
  };

  const addCustom = () => {
    const trimmed = search.trim();
    if (trimmed && !selected.includes(trimmed)) {
      onChange([...selected, trimmed]);
      setSearch("");
    }
  };

  const showAddCustom = search.trim() && !options.includes(search.trim()) && !selected.includes(search.trim());

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }} ref={ref}>
      <label style={{ fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: ".06em" }}>
        {label}{req && <span style={{ color: T.red }}> *</span>}
      </label>

      {/* Tags + search input box */}
      <div
        onClick={() => { setOpen(true); inputRef.current?.focus(); }}
        style={{
          minHeight: 44,
          background: T.white,
          border: `1.5px solid ${open ? T.accentDeep : T.border}`,
          borderRadius: 10,
          padding: "6px 10px",
          display: "flex",
          flexWrap: "wrap",
          gap: 6,
          cursor: "text",
          transition: "border-color .15s",
          boxSizing: "border-box",
          width: "100%",
        }}
      >
        {selected.map(s => (
          <span key={s} style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            background: T.bgTint || "#EFF6FF",
            border: `1px solid ${T.border}`,
            borderRadius: 6,
            padding: "3px 8px",
            fontSize: 12,
            color: T.accentDeep || T.primary,
            fontWeight: 500,
            maxWidth: "100%",
          }}>
            <span style={{ maxWidth: 260, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s}</span>
            <span
              onMouseDown={e => { e.stopPropagation(); removeItem(s); }}
              style={{ cursor: "pointer", lineHeight: 1, opacity: .6, fontSize: 14, marginLeft: 2 }}
            >×</span>
          </span>
        ))}
        <input
          ref={inputRef}
          value={search}
          onChange={e => { setSearch(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={e => {
            if (e.key === "Enter") { e.preventDefault(); if (filtered[0]) addItem(filtered[0]); else if (showAddCustom) addCustom(); }
            if (e.key === "Backspace" && !search && selected.length) removeItem(selected[selected.length - 1]);
          }}
          placeholder={selected.length === 0 ? placeholder : "Search or add more..."}
          style={{
            border: "none", outline: "none", background: "transparent",
            fontFamily: "DM Sans, sans-serif", fontSize: 13, color: T.text,
            flexGrow: 1, minWidth: 120, padding: "2px 2px",
          }}
        />
      </div>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: "absolute",
          zIndex: 9999,
          background: T.white,
          border: `1.5px solid ${T.border}`,
          borderRadius: 10,
          boxShadow: "0 8px 32px rgba(11,37,69,.14)",
          maxHeight: 240,
          overflowY: "auto",
          marginTop: 2,
          width: "100%",
        }}>
          {showAddCustom && (
            <div
              onMouseDown={e => { e.preventDefault(); addCustom(); }}
              style={{
                padding: "10px 14px", fontSize: 13, cursor: "pointer",
                color: T.accentDeep || T.primary, fontWeight: 600,
                borderBottom: `1px solid ${T.border}`,
                display: "flex", alignItems: "center", gap: 6,
              }}
            >
              <span style={{ fontSize: 15 }}>＋</span> Add "{search.trim()}"
            </div>
          )}
          {filtered.length === 0 && !showAddCustom && (
            <div style={{ padding: "12px 14px", fontSize: 13, color: T.textMuted, textAlign: "center" }}>
              No options found. Type to add custom.
            </div>
          )}
          {filtered.map(opt => (
            <div
              key={opt}
              onMouseDown={e => { e.preventDefault(); addItem(opt); }}
              style={{
                padding: "9px 14px", fontSize: 13, cursor: "pointer",
                color: T.text,
                borderBottom: `1px solid ${T.border}`,
                transition: "background .1s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = T.offwhite || "#F8FAFC"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Wrapper to handle absolute positioning ───────────────────────────────────
function DropdownWrapper({ children }) {
  return <div style={{ position: "relative" }}>{children}</div>;
}

// ─── Existing primitives ──────────────────────────────────────────────────────
function Field({ label, req, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: ".06em" }}>
        {label}{req && <span style={{ color: T.red }}> *</span>}
      </label>
      {children}
    </div>
  );
}

function Inp({ label, req, placeholder, value, onChange, type = "text" }) {
  return (
    <Field label={label} req={req}>
      <input type={type} placeholder={placeholder} value={value} onChange={onChange}
        style={{ fontFamily: "DM Sans,sans-serif", fontSize: 14, color: T.text, background: T.white, border: `1.5px solid ${T.border}`, borderRadius: 10, padding: "11px 14px", width: "100%", outline: "none" }}
      />
    </Field>
  );
}

function Txta({ label, req, placeholder, value, onChange, rows = 3 }) {
  return (
    <Field label={label} req={req}>
      <textarea placeholder={placeholder} value={value} onChange={onChange} rows={rows}
        style={{ fontFamily: "DM Sans,sans-serif", fontSize: 14, color: T.text, background: T.white, border: `1.5px solid ${T.border}`, borderRadius: 10, padding: "11px 14px", width: "100%", outline: "none", resize: "vertical" }}
      />
    </Field>
  );
}

function Section({ title, subtitle, icon, children }) {
  return (
    <div style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 16, marginBottom: 20, overflow: "visible", boxShadow: "0 1px 4px rgba(11,37,69,.07)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 13, padding: "17px 22px", borderBottom: `1px solid ${T.border}`, background: T.offwhite }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: T.bgTint, border: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center", color: T.accentDeep }}>
          <Ico d={icon} size={16} sw={1.75} />
        </div>
        <div>
          <p style={{ fontFamily: "DM Serif Display,serif", fontSize: 15, color: T.primary, margin: 0 }}>{title}</p>
          <p style={{ fontSize: 12, color: T.textMuted, margin: "2px 0 0" }}>{subtitle}</p>
        </div>
      </div>
      <div style={{ padding: 24 }}>{children}</div>
    </div>
  );
}

// ─── Print / Download (unchanged) ────────────────────────────────────────────
export function AdmissionNotePrint({ data, patient, discharge, locId }) {
  const branchInfo = {
    "laxmi": { name: "Lakshmi Nagar Branch", address: "Lakshmi Nagar, Mathura, Uttar Pradesh - 281004", phone1: "+91-9717444531", phone2: "+91-9717444532", email: "laxminagar@sangihospital.com" },
    "raya": { name: "Raya Branch", address: "Raya, Mathura, Uttar Pradesh - 281204", phone1: "+91-9311212090", phone2: "+91-9311212091", email: "info@sangihospital.com" },
  };
  const branch = branchInfo[locId] || branchInfo["laxmi"];
  const today = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" });
  const nowTime = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false });

  // Convert array values to newline-separated string for print
  const investigationsStr = Array.isArray(data?.investigations)
    ? data.investigations.join("\n")
    : (data?.investigations || "—");
  const medicationsStr = Array.isArray(data?.currentMedications)
    ? data.currentMedications.join("\n")
    : (data?.currentMedications || "—");

  return (
    <div id="admission-note-print" style={{ fontFamily: "Arial,sans-serif", fontSize: 12, color: "#000", padding: "24px 32px", background: "#fff", maxWidth: 800, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "2px solid #000", paddingBottom: 10, marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img src="/logo512.png" alt="Sangi Hospital" style={{ width: 64, height: 64, objectFit: "contain", borderRadius: 12 }} />
          <div>
            <div style={{ fontSize: 28, fontWeight: 900, color: "#1a5b8c", letterSpacing: 2, lineHeight: 1 }}>SANGi</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#d93838", letterSpacing: 4 }}>HOSPITAL</div>
          </div>
        </div>
        <div style={{ textAlign: "right", fontSize: 11, color: "#444", lineHeight: 1.8 }}>
          <div>Add.: {branch.address}</div>
          <div>Ph.: {branch.phone1}, {branch.phone2}</div>
          <div>Email: {branch.email}</div>
          <div>Web.: www.sangihospital.com</div>
        </div>
      </div>
      <div style={{ textAlign: "center", fontSize: 16, fontWeight: 900, letterSpacing: 2, borderBottom: "1px solid #000", paddingBottom: 8, marginBottom: 10 }}>ADMISSION NOTE</div>
      <div style={{ display: "flex", gap: 24, marginBottom: 10, flexWrap: "wrap" }}>
        <div><strong>Name of the Patient: </strong><u>{(patient?.patientName || "—").toUpperCase()}</u></div>
        <div><strong>Age/Sex: </strong><u>{patient?.ageYY || "—"}Y / {(patient?.gender || "—").toUpperCase()}</u></div>
        <div><strong>IPD NO: </strong><u>SH/{discharge?.department?.substring(0, 4)?.toUpperCase() || "GEN"}/26/001</u></div>
      </div>
      <div style={{ display: "flex", gap: 24, marginBottom: 14, flexWrap: "wrap" }}>
        <div><strong>Card No: </strong><u>{patient?.tpaCard || patient?.tpaPanelCardNo || "—"}</u></div>
        <div><strong>WARD/Bed NO: </strong><u>{discharge?.wardName || "—"}</u></div>
        <div><strong>Date: </strong><u>{today} AT {nowTime} HR</u></div>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 12 }}>
        <tbody>
          <tr>
            <td style={{ border: "1px solid #000", padding: "10px 12px", width: "50%", verticalAlign: "top" }}>
              <div style={{ fontWeight: 900, fontSize: 12, marginBottom: 6 }}>PRESENT COMPLAINTS-</div>
              <div style={{ fontSize: 12, whiteSpace: "pre-wrap", minHeight: 60 }}>{data?.presentComplaints || "—"}</div>
              {data?.chiefComplaints && <><div style={{ fontWeight: 700, marginTop: 8 }}>C/O-</div><div style={{ whiteSpace: "pre-wrap" }}>{data.chiefComplaints}</div></>}
            </td>
            <td style={{ border: "1px solid #000", padding: "10px 12px", width: "50%", verticalAlign: "top" }}>
              <div style={{ fontWeight: 900, fontSize: 12, marginBottom: 6 }}>INVESTIGATIONS-</div>
              <div style={{ fontSize: 12, whiteSpace: "pre-wrap", minHeight: 60 }}>{investigationsStr}</div>
            </td>
          </tr>
          <tr>
            <td style={{ border: "1px solid #000", padding: "10px 12px", verticalAlign: "top" }}>
              <div style={{ fontWeight: 900, fontSize: 12, marginBottom: 6 }}>PAST HISTORY-</div>
              <div style={{ fontSize: 12, whiteSpace: "pre-wrap", minHeight: 40 }}>{data?.previousDiagnosis || data?.pastSurgeries ? `${data?.previousDiagnosis || ""}\n${data?.pastSurgeries || ""}`.trim() : "—"}</div>
            </td>
            <td style={{ border: "1px solid #000", padding: "10px 12px", verticalAlign: "top" }}>
              <div style={{ fontWeight: 900, fontSize: 12, marginBottom: 6 }}>TREATMENT ADVISED-</div>
              <div style={{ fontSize: 12, whiteSpace: "pre-wrap", minHeight: 40 }}>{data?.treatmentAdvised || "—"}</div>
            </td>
          </tr>
          <tr>
            <td style={{ border: "1px solid #000", padding: "10px 12px", verticalAlign: "top" }}>
              <div style={{ fontWeight: 900, fontSize: 12, marginBottom: 8 }}>EXAMINATIONS-</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 12px", fontSize: 12 }}>
                {[["BP", data?.bp], ["PR", data?.pr], ["SPO2", data?.spo2], ["TEMP", data?.temp]].map(([k, v]) => (
                  <div key={k}><strong>{k}= </strong>{v || "—"}</div>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 12px", fontSize: 12, marginTop: 6 }}>
                {[["Chest", data?.chest], ["CVS", data?.cvs], ["CNS", data?.cns], ["P/A", data?.pa]].map(([k, v]) => (
                  <div key={k}><strong>{k}: </strong>{v || "—"}</div>
                ))}
              </div>
            </td>
            <td style={{ border: "1px solid #000", padding: "10px 12px", verticalAlign: "top" }}>
              <div style={{ fontWeight: 900, fontSize: 12, marginBottom: 6 }}>PROVISIONAL DIAGNOSIS-</div>
              <div style={{ fontSize: 12, whiteSpace: "pre-wrap", minHeight: 40 }}>{data?.provisionalDiagnosis || discharge?.diagnosis || "—"}</div>
            </td>
          </tr>
          <tr>
            <td colSpan={2} style={{ border: "1px solid #000", padding: "10px 12px", verticalAlign: "top" }}>
              <div style={{ fontWeight: 900, fontSize: 12, marginBottom: 6 }}>CURRENT MEDICATIONS-</div>
              <div style={{ fontSize: 12, whiteSpace: "pre-wrap" }}>{medicationsStr}</div>
            </td>
          </tr>
        </tbody>
      </table>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 40, fontSize: 12 }}>
        <div style={{ textAlign: "center", minWidth: 160 }}>
          <div style={{ borderTop: "1px solid #000", paddingTop: 6, fontWeight: 700 }}>Adv.</div>
          <div style={{ color: "#555", marginTop: 4 }}>{data?.treatingDoctor || discharge?.doctorName || "—"}</div>
        </div>
        <div style={{ textAlign: "center", minWidth: 160 }}>
          <div style={{ borderTop: "1px solid #000", paddingTop: 6, fontWeight: 700 }}>Consultant</div>
        </div>
        <div style={{ textAlign: "center", minWidth: 160 }}>
          <div style={{ borderTop: "1px solid #000", paddingTop: 6, fontWeight: 700 }}>DOCTOR SIGNATURE</div>
        </div>
      </div>
    </div>
  );
}

export function downloadAdmissionNote(data, patient, discharge, locId) {
  const printWindow = window.open("", "_blank", "width=900,height=700");
  const branchInfo = {
    "laxmi": { name: "Lakshmi Nagar Branch", address: "Lakshmi Nagar, Mathura, Uttar Pradesh - 281004", phone1: "+91-9717444531", phone2: "+91-9717444532", email: "laxminagar@sangihospital.com" },
    "raya": { name: "Raya Branch", address: "Raya, Mathura, Uttar Pradesh - 281204", phone1: "+91-9311212090", phone2: "+91-9311212091", email: "info@sangihospital.com" },
  };
  const branch = branchInfo[locId] || branchInfo["laxmi"];
  const today = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" });
  const nowTime = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false });

  const investigationsStr = Array.isArray(data?.investigations)
    ? data.investigations.join("\n")
    : (data?.investigations || "—");
  const medicationsStr = Array.isArray(data?.currentMedications)
    ? data.currentMedications.join("\n")
    : (data?.currentMedications || "—");

  printWindow.document.write(`
    <!DOCTYPE html><html><head><title>Admission Note - ${patient?.patientName || ""}</title>
    <style>
      body{font-family:Arial,sans-serif;font-size:12px;color:#000;padding:24px 32px;margin:0}
      table{width:100%;border-collapse:collapse}
      td{border:1px solid #000;padding:10px 12px;vertical-align:top;width:50%}
      .pre{white-space:pre-wrap;min-height:50px}
      @media print{@page{size:A4;margin:10mm}}
    </style></head><body>
    <div style="display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid #000;padding-bottom:10px;margin-bottom:10px">
      <div style="display:flex;align-items:center;gap:12px">
        <img src="/sangi-logo.png" onerror="this.src='/logo512.png'" alt="Sangi Hospital" style="width:64px;height:64px;object-fit:contain;border-radius:12px"/>
        <div>
          <div style="font-size:28px;font-weight:900;color:#1a5b8c;letter-spacing:2px;line-height:1">SANGi</div>
          <div style="font-size:13px;font-weight:700;color:#d93838;letter-spacing:4px">HOSPITAL</div>
        </div>
      </div>
      <div style="text-align:right;font-size:11px;color:#444;line-height:1.8">
        <div>Add.: ${branch.address}</div>
        <div>Ph.: ${branch.phone1}, ${branch.phone2}</div>
        <div>Email: ${branch.email}</div>
        <div>Web.: www.sangihospital.com</div>
      </div>
    </div>
    <div style="text-align:center;font-size:16px;font-weight:900;letter-spacing:2px;border-bottom:1px solid #000;padding-bottom:8px;margin-bottom:10px">ADMISSION NOTE</div>
    <div style="display:flex;gap:24px;margin-bottom:8px;flex-wrap:wrap">
      <div><strong>Name of the Patient: </strong><u>${(patient?.patientName || "—").toUpperCase()}</u></div>
      <div><strong>Age/Sex: </strong><u>${patient?.ageYY || "—"}Y / ${(patient?.gender || "—").toUpperCase()}</u></div>
      <div><strong>IPD NO: </strong><u>SH/${discharge?.department?.substring(0, 4)?.toUpperCase() || "GEN"}/26/001</u></div>
    </div>
    <div style="display:flex;gap:24px;margin-bottom:14px;flex-wrap:wrap">
      <div><strong>Card No: </strong><u>${patient?.tpaCard || patient?.tpaPanelCardNo || "—"}</u></div>
      <div><strong>WARD/Bed NO: </strong><u>${discharge?.wardName || "—"}</u></div>
      <div><strong>Date: </strong><u>${today} AT ${nowTime} HR</u></div>
    </div>
    <table>
      <tr>
        <td><strong>PRESENT COMPLAINTS-</strong><div class="pre">${data?.presentComplaints || "—"}</div>${data?.chiefComplaints ? `<strong>C/O-</strong><div class="pre">${data.chiefComplaints}</div>` : ""}</td>
        <td><strong>INVESTIGATIONS-</strong><div class="pre">${investigationsStr}</div></td>
      </tr>
      <tr>
        <td><strong>PAST HISTORY-</strong><div class="pre">${[data?.previousDiagnosis, data?.pastSurgeries].filter(Boolean).join("\n") || "—"}</div></td>
        <td><strong>TREATMENT ADVISED-</strong><div class="pre">${data?.treatmentAdvised || "—"}</div></td>
      </tr>
      <tr>
        <td>
          <strong>EXAMINATIONS-</strong><br/>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px 12px;margin-top:6px">
            <div><strong>BP= </strong>${data?.bp || "—"}</div>
            <div><strong>Chest: </strong>${data?.chest || "—"}</div>
            <div><strong>PR= </strong>${data?.pr || "—"}</div>
            <div><strong>CVS: </strong>${data?.cvs || "—"}</div>
            <div><strong>SPO2= </strong>${data?.spo2 || "—"}</div>
            <div><strong>CNS: </strong>${data?.cns || "—"}</div>
            <div><strong>TEMP= </strong>${data?.temp || "—"}</div>
            <div><strong>P/A: </strong>${data?.pa || "—"}</div>
          </div>
        </td>
        <td><strong>PROVISIONAL DIAGNOSIS-</strong><div class="pre">${data?.provisionalDiagnosis || discharge?.diagnosis || "—"}</div></td>
      </tr>
      <tr>
        <td colspan="2"><strong>CURRENT MEDICATIONS-</strong><div class="pre">${medicationsStr}</div></td>
      </tr>
    </table>
    <div style="display:flex;justify-content:space-between;margin-top:50px">
      <div style="text-align:center;min-width:160px"><div style="border-top:1px solid #000;padding-top:6px;font-weight:700">Adv.</div><div style="color:#555;margin-top:4px">${data?.treatingDoctor || discharge?.doctorName || "—"}</div></div>
      <div style="text-align:center;min-width:160px"><div style="border-top:1px solid #000;padding-top:6px;font-weight:700">Consultant</div></div>
      <div style="text-align:center;min-width:160px"><div style="border-top:1px solid #000;padding-top:6px;font-weight:700">DOCTOR SIGNATURE</div></div>
    </div>
    <script>window.onload=()=>{window.print();}<\/script>
    </body></html>
  `);
  printWindow.document.close();
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function MedicalHistoryPage({ data, setData, onSave, onSkip, patient, discharge, locId }) {
  const set = k => e => setData(p => ({ ...p, [k]: e.target.value }));

  // Array setter for multi-select fields
  const setArr = k => val => setData(p => ({ ...p, [k]: val }));

  const isFilled = data.presentComplaints || data.previousDiagnosis || data.provisionalDiagnosis;

  return (
    <div style={{ padding: "32px 44px 80px", animation: "fadeUp .3s ease both", fontFamily: "DM Sans,sans-serif" }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ fontFamily: "DM Serif Display,serif", fontSize: 26, color: T.primary, marginBottom: 5 }}>Medical History</h1>
            <p style={{ fontSize: 14, color: T.textMuted }}>Record admission note — complaints, examinations and treatment</p>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{ padding: "6px 14px", borderRadius: 20, background: isFilled ? T.greenTint : T.amberTint, border: `1px solid ${isFilled ? T.greenBorder : "#FDE68A"}`, fontSize: 12, fontWeight: 600, color: isFilled ? T.green : T.amber }}>
              {isFilled ? "✓ History Added" : "⚠ Not Filled"}
            </div>
          </div>
        </div>
      </div>

      {/* Complaints */}
      <Section title="Present Complaints" subtitle="Chief complaints and presenting symptoms" icon={IC.pulse}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <Txta label="Present Complaints" req placeholder="Patient presented in Department of Emergency Medicine..." value={data.presentComplaints || ""} onChange={set("presentComplaints")} rows={4} />
          <Txta label="C/O (Chief Complaints)" placeholder="Severe pain at Rt. Iliac fossa, fever with chills..." value={data.chiefComplaints || ""} onChange={set("chiefComplaints")} rows={4} />
        </div>
      </Section>

      {/* Examinations */}
      <Section title="Examinations" subtitle="Vitals and clinical examination findings" icon={IC.pulse}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 16 }}>
          <Inp label="BP (mmHg)" placeholder="e.g. 120/80mmHg" value={data.bp || ""} onChange={set("bp")} />
          <Inp label="PR (/min)" placeholder="e.g. 82/min" value={data.pr || ""} onChange={set("pr")} />
          <Inp label="SPO2" placeholder="e.g. 98% On RA" value={data.spo2 || ""} onChange={set("spo2")} />
          <Inp label="TEMP" placeholder="e.g. 98.6°F" value={data.temp || ""} onChange={set("temp")} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
          <Inp label="Chest" placeholder="e.g. B/L Crepts+" value={data.chest || ""} onChange={set("chest")} />
          <Inp label="CVS" placeholder="e.g. S1 S2 +" value={data.cvs || ""} onChange={set("cvs")} />
          <Inp label="CNS" placeholder="e.g. Conscious" value={data.cns || ""} onChange={set("cns")} />
          <Inp label="P/A" placeholder="e.g. Distended" value={data.pa || ""} onChange={set("pa")} />
        </div>
      </Section>

      {/* ── Investigations & Diagnosis ── */}
      <Section title="Investigations & Diagnosis" subtitle="Tests ordered and provisional diagnosis" icon={IC.file}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

          {/* INVESTIGATIONS — searchable multi-select */}
          <DropdownWrapper>
            <SearchableMultiSelect
              label="Investigations"
              placeholder="Search CBC, X-Ray, USG..."
              value={Array.isArray(data.investigations) ? data.investigations : (data.investigations ? [data.investigations] : [])}
              onChange={setArr("investigations")}
              options={INVESTIGATION_OPTIONS}
            />
          </DropdownWrapper>

          <Txta label="Provisional Diagnosis" req placeholder="Acute Retention of Urine with ?UTI..." value={data.provisionalDiagnosis || ""} onChange={set("provisionalDiagnosis")} rows={4} />
        </div>
      </Section>

      {/* ── Treatment & Past History ── */}
      <Section title="Treatment & Past History" subtitle="Treatment advised and past medical history" icon={IC.wallet}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
          <Txta label="Treatment Advised" req placeholder="IV Fluids NS/RL @ 100ml/hr, Inj. Esomac 40mg IV BD..." value={data.treatmentAdvised || ""} onChange={set("treatmentAdvised")} rows={5} />
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Txta label="Past History / Previous Diagnosis" placeholder="Diabetes, Hypertension, previous surgeries..." value={data.previousDiagnosis || ""} onChange={set("previousDiagnosis")} rows={2} />
            <Txta label="Past Surgeries" placeholder="e.g. Appendectomy 2018..." value={data.pastSurgeries || ""} onChange={set("pastSurgeries")} rows={2} />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

          {/* CURRENT MEDICATIONS — searchable multi-select */}
          <DropdownWrapper>
            <SearchableMultiSelect
              label="Current Medications"
              placeholder="Search Metformin, Amlodipine..."
              value={Array.isArray(data.currentMedications) ? data.currentMedications : (data.currentMedications ? [data.currentMedications] : [])}
              onChange={setArr("currentMedications")}
              options={MEDICATION_OPTIONS}
            />
          </DropdownWrapper>

          <Txta label="Known Allergies" placeholder="e.g. Penicillin, Sulfa drugs..." value={data.knownAllergies || ""} onChange={set("knownAllergies")} rows={2} />
        </div>
      </Section>

      {/* Doctor */}
      <Section title="Treating Doctor & Notes" subtitle="Doctor details and additional clinical notes" icon={IC.doctor}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <Inp label="Treating Doctor" placeholder="Dr. Full Name & Speciality" value={data.treatingDoctor || ""} onChange={set("treatingDoctor")} />
          <Inp label="Qualification & Reg. No." placeholder="MBBS (Mp), DNB (Urology), No. 35942" value={data.doctorQual || ""} onChange={set("doctorQual")} />
          <div style={{ gridColumn: "span 2" }}>
            <Txta label="Additional Notes / Remarks" placeholder="Any other relevant clinical information..." value={data.notes || ""} onChange={set("notes")} rows={2} />
          </div>
        </div>
      </Section>

      <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8, justifyContent: "space-between" }}>
        <button onClick={onSkip} style={{ padding: "11px 26px", borderRadius: 10, border: `1.5px solid ${T.border}`, background: T.white, color: T.textMid, fontFamily: "DM Sans,sans-serif", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
          Skip for now →
        </button>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => downloadAdmissionNote(data, patient, discharge, locId)}
            style={{ padding: "11px 26px", borderRadius: 10, border: `1.5px solid ${T.accentDeep}`, background: T.white, color: T.accentDeep, fontFamily: "DM Sans,sans-serif", fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
            🖨 Preview Admission Note
          </button>
          <button onClick={onSave}
            style={{ padding: "11px 26px", borderRadius: 10, border: "none", background: `linear-gradient(135deg,${T.accentDeep},${T.primary})`, color: "#fff", fontFamily: "DM Sans,sans-serif", fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 4px 16px rgba(14,165,233,.32)" }}>
            <Ico d={IC.check} size={15} sw={2.5} /> Save & Continue →
          </button>
        </div>
      </div>
    </div>
  );
}