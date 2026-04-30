import { useState, useMemo } from "react";

const CURRENT_USER = { name: "Priya Sharma", empId: "EMP-2041" };

const INSURANCE_TYPES = ["ECHS", "ECI", "FCI", "Ayushman Bharat", "Northern Railways", "TPA", "Cash"];
const TPA_DOCS = [
  { id: "final_bill",        label: "Final Bill",          ico: "🧾" },
  { id: "prescription",      label: "Prescription",        ico: "📝" },
  { id: "pharmacy_bill",     label: "Pharmacy Bill",       ico: "💊" },
  { id: "pathology_bill",    label: "Pathology Bill",      ico: "🔬" },
  { id: "radiology_bill",    label: "Radiology Bill",      ico: "🩻" },
  { id: "discharge_summary", label: "Discharge Summary",   ico: "📋" },
  { id: "reports",           label: "Reports",             ico: "🗂️" },
  { id: "admission_note",    label: "Admission Note",      ico: "🩺" },
];

const LAB_REPORT_TYPES   = ["Pathology","Biochemistry","Haematology","Microbiology","Serology","Histopathology","Other"];
const RADIO_REPORT_TYPES = ["X-Ray","CT Scan","MRI","Ultrasound (USG)","Doppler","PET Scan","Mammography","Fluoroscopy","Echo","Other"];
const ALL_REPORT_TYPES   = ["All", ...LAB_REPORT_TYPES, ...RADIO_REPORT_TYPES];

const MOCK_PATIENTS = [
  {
    uhid:"LNM-0041",admNo:"ADM/2026/041",branch:"Laxmi Nagar Branch",
    patientName:"Rajan Sharma",age:54,gender:"Male",
    phone:"9876543210",doa:"2026-04-10T09:00",dod:"2026-04-16T12:00",expectedDod:"2026-04-17T00:00",
    ward:"General",bed:"G-12",doctor:"Dr. Meena Kapoor",
    diagnosis:"Type-2 Diabetes",status:"discharged",taskStatus:"pending",
    insuranceType:"ECHS",tpaInfo:{tpaName:"",policyNo:"",claimNo:"",authNo:""},
    saved:{discharge:false,admission:false,prescription:false,pathology:false,reports:false,medicines:false,billing:false},
    discharge:{doa:"2026-04-10T09:00",dod:"2026-04-16T12:00",expectedDod:"2026-04-17T00:00",ward:"General",bed:"G-12",doctor:"Dr. Meena Kapoor",diagnosis:"Type-2 Diabetes",condition:"Stable",instructions:"Low sugar diet, follow up in 2 weeks",notes:""},
    medicalHistory:{previousDiagnosis:"Hypertension",pastSurgeries:"Appendectomy 2010",currentMedications:"Metformin 500mg",treatingDoctor:"Dr. Meena Kapoor",knownAllergies:"Penicillin",chronicConditions:"Diabetes, Hypertension",familyHistory:"Father had diabetes",smokingStatus:"Non-smoker",alcoholUse:"Occasional",notes:"Patient cooperative"},
    services:[
      {id:1,name:"Room Charges",category:"Ward",qty:6,rate:800,amount:4800},
      {id:2,name:"Doctor Visit",category:"Consultation",qty:3,rate:500,amount:1500},
      {id:3,name:"IV Fluids",category:"Pharmacy",qty:4,rate:120,amount:480},
    ],
    prescription:[
      {id:1,medicine:"Metformin 500mg",dosage:"1-0-1",duration:"30 days",instructions:"After meals"},
      {id:2,medicine:"Amlodipine 5mg",dosage:"0-0-1",duration:"30 days",instructions:"At bedtime"},
    ],
    labReports:[
      {id:1,reportName:"Complete Blood Count (CBC)",reportType:"Pathology",reportCategory:"lab",
       date:"2026-04-11",orderedBy:"Dr. Meena Kapoor",amount:350,remarks:"Mild anaemia noted.",
       tests:[
         {id:1,name:"Haemoglobin",value:"11.2",unit:"g/dL",refRange:"13.0 - 17.0",status:"Low"},
         {id:2,name:"Total WBC",value:"8400",unit:"/uL",refRange:"4000 - 11000",status:"Normal"},
         {id:3,name:"Platelets",value:"210000",unit:"/uL",refRange:"150000 - 400000",status:"Normal"},
       ]},
      {id:2,reportName:"Chest X-Ray",reportType:"X-Ray",reportCategory:"radiology",
       date:"2026-04-11",orderedBy:"Dr. Meena Kapoor",amount:600,remarks:"No active consolidation.",
       modalityDetails:{modality:"X-Ray",bodyPart:"Chest",view:"PA",contrast:"No",findings:"Clear lung fields, normal heart size",impression:"Normal chest X-Ray"},
       tests:[
         {id:1,name:"Lung Fields",value:"Clear",unit:"--",refRange:"Clear",status:"Normal"},
         {id:2,name:"Heart Size",value:"Normal",unit:"--",refRange:"Normal",status:"Normal"},
       ]},
    ],
    medicalBill:[
      {id:1,item:"Metformin 500mg x30",date:"2026-04-10",amount:180},
      {id:2,item:"Normal Saline 500ml x4",date:"2026-04-11",amount:200},
    ],
    billing:{discount:500,advance:2000,paymentMode:"Cash",insuranceType:"ECHS",remarks:""},
    tpaDocStatus:{final_bill:false,prescription:false,pharmacy_bill:false,pathology_bill:false,radiology_bill:false,discharge_summary:false,reports:false,admission_note:false},
  },
  {
    uhid:"LNM-0042",admNo:"ADM/2026/042",branch:"Laxmi Nagar Branch",
    patientName:"Sunita Verma",age:38,gender:"Female",
    phone:"9123456780",doa:"2026-04-13T11:30",dod:"",expectedDod:"2026-04-24T11:00",
    ward:"Private",bed:"P-03",doctor:"Dr. Arvind Singh",
    diagnosis:"Viral Fever",status:"admitted",taskStatus:"pending",
    insuranceType:"TPA",tpaInfo:{tpaName:"Star Health TPA",policyNo:"SH2026/4421",claimNo:"CLM-0042",authNo:"AUTH-8812"},
    saved:{discharge:false,admission:false,prescription:false,pathology:false,reports:false,medicines:false,billing:false},
    discharge:{doa:"2026-04-13T11:30",dod:"",expectedDod:"2026-04-24T11:00",ward:"Private",bed:"P-03",doctor:"Dr. Arvind Singh",diagnosis:"Viral Fever",condition:"",instructions:"",notes:""},
    medicalHistory:{previousDiagnosis:"None",pastSurgeries:"None",currentMedications:"Paracetamol",treatingDoctor:"Dr. Arvind Singh",knownAllergies:"None",chronicConditions:"None",familyHistory:"None",smokingStatus:"Non-smoker",alcoholUse:"None",notes:""},
    services:[
      {id:1,name:"Room Charges",category:"Ward",qty:3,rate:2000,amount:6000},
      {id:2,name:"Doctor Visit",category:"Consultation",qty:2,rate:800,amount:1600},
    ],
    prescription:[
      {id:1,medicine:"Paracetamol 500mg",dosage:"1-1-1",duration:"5 days",instructions:"With water"},
    ],
    labReports:[
      {id:1,reportName:"Complete Blood Count (CBC)",reportType:"Pathology",reportCategory:"lab",
       date:"2026-04-13",orderedBy:"Dr. Arvind Singh",amount:250,remarks:"Leukocytosis with neutrophilia.",
       tests:[
         {id:1,name:"Haemoglobin",value:"12.8",unit:"g/dL",refRange:"12.0 - 16.0",status:"Normal"},
         {id:2,name:"Total WBC",value:"13200",unit:"/uL",refRange:"4000 - 11000",status:"High"},
       ]},
      {id:2,reportName:"USG Abdomen",reportType:"Ultrasound (USG)",reportCategory:"radiology",
       date:"2026-04-14",orderedBy:"Dr. Arvind Singh",amount:800,remarks:"No significant findings.",
       modalityDetails:{modality:"Ultrasound",bodyPart:"Abdomen",view:"--",contrast:"No",findings:"Normal hepatic echotexture",impression:"No acute pathology"},
       tests:[
         {id:1,name:"Liver",value:"Normal",unit:"--",refRange:"Normal",status:"Normal"},
         {id:2,name:"Spleen",value:"Normal",unit:"--",refRange:"Normal",status:"Normal"},
       ]},
    ],
    medicalBill:[{id:1,item:"Paracetamol 500mg x20",date:"2026-04-13",amount:80}],
    billing:{discount:0,advance:5000,paymentMode:"UPI",insuranceType:"TPA",remarks:"TPA pre-auth pending"},
    tpaDocStatus:{final_bill:false,prescription:false,pharmacy_bill:false,pathology_bill:false,radiology_bill:false,discharge_summary:false,reports:false,admission_note:false},
  },
  {
    uhid:"LNM-0039",admNo:"ADM/2026/039",branch:"Laxmi Nagar Branch",
    patientName:"Mohd. Akhtar",age:62,gender:"Male",
    phone:"9988776655",doa:"2026-04-08T08:00",dod:"2026-04-15T10:00",expectedDod:"2026-04-15T00:00",
    ward:"ICU",bed:"ICU-2",doctor:"Dr. Priya Nair",
    diagnosis:"Cardiac Arrest",status:"discharged",taskStatus:"completed",
    insuranceType:"Northern Railways",tpaInfo:{tpaName:"",policyNo:"NR/2026/0391",claimNo:"CLM-NR-039",authNo:""},
    saved:{discharge:true,admission:true,prescription:true,pathology:true,reports:true,medicines:true,billing:true},
    discharge:{doa:"2026-04-08T08:00",dod:"2026-04-15T10:00",expectedDod:"2026-04-15T00:00",ward:"ICU",bed:"ICU-2",doctor:"Dr. Priya Nair",diagnosis:"Cardiac Arrest",condition:"Recovering",instructions:"Strict bed rest, cardiac diet",notes:"Follow up in 1 week"},
    medicalHistory:{previousDiagnosis:"Angina",pastSurgeries:"Angioplasty 2018",currentMedications:"Aspirin, Statins",treatingDoctor:"Dr. Priya Nair",knownAllergies:"None",chronicConditions:"Heart Disease",familyHistory:"Father had MI",smokingStatus:"Ex-smoker",alcoholUse:"None",notes:"High risk patient"},
    services:[
      {id:1,name:"ICU Charges",category:"Ward",qty:7,rate:5000,amount:35000},
      {id:2,name:"Cardiology Consult",category:"Consultation",qty:5,rate:1200,amount:6000},
      {id:3,name:"ECG",category:"Procedure",qty:3,rate:300,amount:900},
    ],
    prescription:[
      {id:1,medicine:"Aspirin 75mg",dosage:"1-0-0",duration:"Lifelong",instructions:"After breakfast"},
      {id:2,medicine:"Atorvastatin 20mg",dosage:"0-0-1",duration:"Lifelong",instructions:"At bedtime"},
    ],
    labReports:[
      {id:1,reportName:"Cardiac Markers Panel",reportType:"Biochemistry",reportCategory:"lab",
       date:"2026-04-08",orderedBy:"Dr. Priya Nair",amount:1800,remarks:"Markedly elevated cardiac markers.",
       tests:[
         {id:1,name:"Troponin I",value:"4.8",unit:"ng/mL",refRange:"< 0.04",status:"High"},
         {id:2,name:"CK-MB",value:"68",unit:"U/L",refRange:"< 25",status:"High"},
       ]},
      {id:2,reportName:"2D Echo",reportType:"Echo",reportCategory:"radiology",
       date:"2026-04-09",orderedBy:"Dr. Priya Nair",amount:2200,remarks:"EF 35%. Moderate LV dysfunction.",
       modalityDetails:{modality:"Echo",bodyPart:"Heart",view:"Parasternal",contrast:"No",findings:"EF 35%, moderate LV dysfunction",impression:"Moderate systolic dysfunction"},
       tests:[
         {id:1,name:"Ejection Fraction",value:"35",unit:"%",refRange:"55 - 70",status:"Low"},
       ]},
    ],
    medicalBill:[
      {id:1,item:"Aspirin 75mg x30",date:"2026-04-08",amount:60},
      {id:2,item:"Atorvastatin 20mg x30",date:"2026-04-08",amount:180},
      {id:3,item:"Heparin injection x5",date:"2026-04-09",amount:750},
    ],
    billing:{discount:2000,advance:20000,paymentMode:"Insurance",insuranceType:"Northern Railways",remarks:"Insurance claim filed"},
    tpaDocStatus:{final_bill:true,prescription:true,pharmacy_bill:true,pathology_bill:true,radiology_bill:true,discharge_summary:true,reports:true,admission_note:true},
  },
  {
    uhid:"RYA-0044",admNo:"ADM/2026/044",branch:"Raya Branch",
    patientName:"Kavita Joshi",age:45,gender:"Female",
    phone:"9871234560",doa:"2026-04-18T14:00",dod:"",expectedDod:"2026-04-25T14:00",
    ward:"Semi-Private",bed:"SP-07",doctor:"Dr. Rahul Gupta",
    diagnosis:"Acute Appendicitis",status:"admitted",taskStatus:"pending",
    insuranceType:"Ayushman Bharat",tpaInfo:{tpaName:"",policyNo:"AB/2026/KJ44",claimNo:"",authNo:"AB-AUTH-7721"},
    saved:{discharge:false,admission:false,reports:false,medicines:false,billing:false},
    discharge:{doa:"2026-04-18T14:00",dod:"",expectedDod:"2026-04-25T14:00",ward:"Semi-Private",bed:"SP-07",doctor:"Dr. Rahul Gupta",diagnosis:"Acute Appendicitis",condition:"",instructions:"",notes:""},
    medicalHistory:{previousDiagnosis:"GERD",pastSurgeries:"None",currentMedications:"Pantoprazole",treatingDoctor:"Dr. Rahul Gupta",knownAllergies:"Sulfa drugs",chronicConditions:"GERD",familyHistory:"None",smokingStatus:"Non-smoker",alcoholUse:"None",notes:""},
    services:[
      {id:1,name:"Room Charges",category:"Ward",qty:4,rate:1500,amount:6000},
      {id:2,name:"Surgery Charges",category:"Procedure",qty:1,rate:25000,amount:25000},
      {id:3,name:"Anaesthesia",category:"Procedure",qty:1,rate:8000,amount:8000},
    ],
    prescription:[
      {id:1,medicine:"Cefuroxime 500mg",dosage:"1-0-1",duration:"7 days",instructions:"After meals"},
    ],
    labReports:[
      {id:1,reportName:"Pre-Op Panel",reportType:"Pathology",reportCategory:"lab",
       date:"2026-04-18",orderedBy:"Dr. Rahul Gupta",amount:1800,remarks:"Leukocytosis + raised CRP.",
       tests:[
         {id:1,name:"Haemoglobin",value:"13.1",unit:"g/dL",refRange:"12.0 - 16.0",status:"Normal"},
         {id:2,name:"Total WBC",value:"14800",unit:"/uL",refRange:"4000 - 11000",status:"High"},
         {id:3,name:"CRP",value:"48",unit:"mg/L",refRange:"< 5",status:"High"},
       ]},
      {id:2,reportName:"CT Abdomen",reportType:"CT Scan",reportCategory:"radiology",
       date:"2026-04-18",orderedBy:"Dr. Rahul Gupta",amount:3500,remarks:"Thickened appendix with periappendiceal fat stranding.",
       modalityDetails:{modality:"CT Scan",bodyPart:"Abdomen & Pelvis",view:"Axial + Coronal",contrast:"IV Contrast",findings:"Appendix diameter 11mm, periappendiceal fat stranding, no perforation",impression:"Acute appendicitis without perforation"},
       tests:[
         {id:1,name:"Appendix Diameter",value:"11",unit:"mm",refRange:"< 6",status:"High"},
         {id:2,name:"Periappendiceal Stranding",value:"Present",unit:"--",refRange:"Absent",status:"High"},
       ]},
    ],
    medicalBill:[
      {id:1,item:"IV Antibiotics x5 days",date:"2026-04-18",amount:1800},
      {id:2,item:"Post-op medications",date:"2026-04-19",amount:650},
    ],
    billing:{discount:0,advance:15000,paymentMode:"Card",insuranceType:"Ayushman Bharat",remarks:"Ayushman pre-auth approved"},
    pathologyBill:[
      {id:1,item:"Pre-Op Panel (CBC, CRP, Creatinine)",date:"2026-04-18",reportType:"Pathology",amount:1800},
    ],
    tpaDocStatus:{final_bill:false,prescription:false,pharmacy_bill:false,pathology_bill:false,radiology_bill:false,discharge_summary:false,reports:false,admission_note:false},
  },
  {
    uhid:"LNM-0045",admNo:"ADM/2026/045",branch:"Laxmi Nagar Branch",
    patientName:"Deepak Rawat",age:35,gender:"Male",
    phone:"9654321870",doa:"2026-04-20T10:00",dod:"",expectedDod:"2026-04-27T10:00",
    ward:"General",bed:"G-08",doctor:"Dr. Sunil Mehta",
    diagnosis:"Typhoid Fever",status:"admitted",taskStatus:"pending",
    insuranceType:"FCI",tpaInfo:{tpaName:"",policyNo:"FCI/2026/DR45",claimNo:"",authNo:""},
    saved:{discharge:false,admission:false,prescription:false,pathology:false,reports:false,medicines:false,billing:false},
    discharge:{doa:"2026-04-20T10:00",dod:"",expectedDod:"2026-04-27T10:00",ward:"General",bed:"G-08",doctor:"Dr. Sunil Mehta",diagnosis:"Typhoid Fever",condition:"",instructions:"",notes:""},
    medicalHistory:{previousDiagnosis:"None",pastSurgeries:"None",currentMedications:"None",treatingDoctor:"Dr. Sunil Mehta",knownAllergies:"None",chronicConditions:"None",familyHistory:"None",smokingStatus:"Non-smoker",alcoholUse:"Occasional",notes:""},
    services:[
      {id:1,name:"Room Charges",category:"Ward",qty:3,rate:800,amount:2400},
      {id:2,name:"Doctor Visit",category:"Consultation",qty:3,rate:500,amount:1500},
    ],
    prescription:[
      {id:1,medicine:"Ceftriaxone 1g IV",dosage:"0-0-1",duration:"7 days",instructions:"Slow IV push"},
    ],
    labReports:[
      {id:1,reportName:"Typhidot / Widal",reportType:"Serology",reportCategory:"lab",
       date:"2026-04-20",orderedBy:"Dr. Sunil Mehta",amount:400,remarks:"Typhidot IgM positive.",
       tests:[
         {id:1,name:"Typhidot IgM",value:"Positive",unit:"--",refRange:"Negative",status:"High"},
         {id:2,name:"Widal O",value:"1:160",unit:"titre",refRange:"< 1:80",status:"High"},
       ]},
    ],
    medicalBill:[
      {id:1,item:"Ceftriaxone 1g x7",date:"2026-04-20",amount:350},
    ],
    pathologyBill:[
      {id:1,item:"Typhidot / Widal Test",date:"2026-04-20",reportType:"Serology",amount:400},
    ],
    billing:{discount:0,advance:3000,paymentMode:"Cash",insuranceType:"FCI",remarks:"FCI coverage pending verification"},
    tpaDocStatus:{final_bill:false,prescription:false,pharmacy_bill:false,pathology_bill:false,radiology_bill:false,discharge_summary:false,reports:false,admission_note:false},
  },
  {
    uhid:"RYA-0046",admNo:"ADM/2026/046",branch:"Raya Branch",
    patientName:"Anita Bhatnagar",age:58,gender:"Female",
    phone:"9312456780",doa:"2026-04-21T08:30",dod:"",expectedDod:"2026-04-28T08:30",
    ward:"Private",bed:"P-11",doctor:"Dr. Rekha Sinha",
    diagnosis:"Knee Replacement",status:"admitted",taskStatus:"pending",
    insuranceType:"ECI",tpaInfo:{tpaName:"",policyNo:"ECI/2026/AB46",claimNo:"CLM-ECI-046",authNo:"ECI-AUTH-4421"},
    saved:{discharge:false,admission:false,prescription:false,pathology:false,reports:false,medicines:false,billing:false},
    discharge:{doa:"2026-04-21T08:30",dod:"",expectedDod:"2026-04-28T08:30",ward:"Private",bed:"P-11",doctor:"Dr. Rekha Sinha",diagnosis:"Knee Replacement",condition:"",instructions:"",notes:""},
    medicalHistory:{previousDiagnosis:"Osteoarthritis",pastSurgeries:"None",currentMedications:"Diclofenac, Calcium",treatingDoctor:"Dr. Rekha Sinha",knownAllergies:"NSAIDs",chronicConditions:"Osteoarthritis, Hypertension",familyHistory:"None",smokingStatus:"Non-smoker",alcoholUse:"None",notes:"High-value surgical case"},
    services:[
      {id:1,name:"Room Charges",category:"Ward",qty:5,rate:3000,amount:15000},
      {id:2,name:"Ortho Surgery",category:"Procedure",qty:1,rate:80000,amount:80000},
      {id:3,name:"Implant - Knee Prosthesis",category:"Implant",qty:1,rate:120000,amount:120000},
      {id:4,name:"Anaesthesia",category:"Procedure",qty:1,rate:12000,amount:12000},
    ],
    prescription:[
      {id:1,medicine:"Enoxaparin 40mg",dosage:"0-0-1",duration:"10 days",instructions:"Subcutaneous injection"},
      {id:2,medicine:"Tramadol 50mg",dosage:"1-1-1",duration:"5 days",instructions:"For pain, with food"},
    ],
    labReports:[
      {id:1,reportName:"Pre-Op Workup",reportType:"Haematology",reportCategory:"lab",
       date:"2026-04-21",orderedBy:"Dr. Rekha Sinha",amount:1200,remarks:"Within normal limits for surgery.",
       tests:[
         {id:1,name:"PT/INR",value:"1.1",unit:"ratio",refRange:"0.8 - 1.2",status:"Normal"},
         {id:2,name:"aPTT",value:"32",unit:"sec",refRange:"25 - 35",status:"Normal"},
       ]},
      {id:2,reportName:"MRI Right Knee",reportType:"MRI",reportCategory:"radiology",
       date:"2026-04-19",orderedBy:"Dr. Rekha Sinha",amount:5500,remarks:"Severe tricompartmental osteoarthritis. Medial meniscal tear.",
       modalityDetails:{modality:"MRI",bodyPart:"Right Knee",view:"Sagittal + Coronal + Axial",contrast:"No",findings:"Severe tricompartmental OA, medial meniscal tear, grade 4 chondral loss",impression:"Severe OA - surgical candidate"},
       tests:[
         {id:1,name:"Medial Meniscus",value:"Torn",unit:"--",refRange:"Intact",status:"High"},
         {id:2,name:"Articular Cartilage",value:"Grade 4",unit:"--",refRange:"Grade 0-1",status:"High"},
       ]},
    ],
    medicalBill:[
      {id:1,item:"Enoxaparin 40mg x10",date:"2026-04-21",amount:1200},
      {id:2,item:"Surgical consumables",date:"2026-04-21",amount:4500},
    ],
    billing:{discount:5000,advance:50000,paymentMode:"Insurance",insuranceType:"ECI",remarks:"ECI pre-auth approved INR 2.5L"},
    tpaDocStatus:{final_bill:false,prescription:false,pharmacy_bill:false,pathology_bill:false,radiology_bill:false,discharge_summary:false,reports:false,admission_note:false},
  },
];

const fmt = (n) => "Rs." + Number(n||0).toLocaleString("en-IN");
const fmtDt = (d) => d ? new Date(d).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}) : "--";
const fmtDtShort = (d) => d ? new Date(d).toLocaleDateString("en-IN",{day:"numeric",month:"short"}) : "--";

function calcTotals(svcs, labReports, med, billing) {
  const s = svcs.reduce((a,r)=>a+Number(r.amount||0),0);
  const labTotal = labReports.filter(r=>r.reportCategory==="lab").reduce((a,r)=>a+Number(r.amount||0),0);
  const radioTotal = labReports.filter(r=>r.reportCategory==="radiology").reduce((a,r)=>a+Number(r.amount||0),0);
  const m = med.reduce((a,r)=>a+Number(r.amount||0),0);
  const gross = s + labTotal + radioTotal + m;
  const disc = Number(billing?.discount||0);
  const adv  = Number(billing?.advance||0);
  return { s, labTotal, radioTotal, m, gross, disc, adv, net: gross-disc, due: gross-disc-adv };
}

const SECTION_KEYS   = ["discharge","admission","prescription","pathology","reports","medicines","billing"];
const SECTION_LABELS = {discharge:"Discharge Summary",admission:"Admission Note",prescription:"Prescription",pathology:"Pathology Bill",reports:"Reports",medicines:"Pharmacy Bill",billing:"Final Bill"};
const SECTION_ICONS  = {discharge:"D",admission:"A",prescription:"Rx",pathology:"P",reports:"R",medicines:"M",billing:"B"};
const TAB_MAP        = {discharge:"discharge",admission:"medical",prescription:"prescription",pathology:"pathology",reports:"reports",medicines:"med_bill",billing:"finalbill"};
const emptyLabReport = () => ({id:Date.now(),reportName:"",reportType:"Pathology",reportCategory:"lab",date:new Date().toISOString().slice(0,10),orderedBy:"",amount:0,remarks:"",tests:[{id:Date.now(),name:"",value:"",unit:"",refRange:"",status:"Normal"}]});
const emptyRadioReport = () => ({id:Date.now(),reportName:"",reportType:"X-Ray",reportCategory:"radiology",date:new Date().toISOString().slice(0,10),orderedBy:"",amount:0,remarks:"",modalityDetails:{modality:"X-Ray",bodyPart:"",view:"",contrast:"No",findings:"",impression:""},tests:[{id:Date.now(),name:"",value:"",unit:"",refRange:"",status:"Normal"}]});
let _tid = 0;

const INSURANCE_COLORS = {
  "ECHS":"#0369a1","ECI":"#0891b2","FCI":"#0d9488","Ayushman Bharat":"#15803d",
  "Northern Railways":"#7c3aed","TPA":"#b45309","Self Pay":"#6b7280","Cash":"#374151"
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --navy:#0c2340;--navy2:#0a1e38;
  --ocean:#0369a1;--ocean2:#075985;--ocean3:#0284c7;
  --sky:#38bdf8;--skyLight:#e0f2fe;--skyMid:#bae6fd;
  --bg:#f0f7ff;--bg2:#dbeafe;--white:#ffffff;
  --border:#c7dff5;--border2:#93c5fd;
  --text:#0c2340;--text2:#1e4976;--text3:#5485a8;
  --amber:#b45309;--amberBg:#fef3cd;
  --red:#b91c1c;--redBg:#fde8e8;
  --green:#15803d;--greenBg:#dcfce7;
  --purple:#6d28d9;--purpleBg:#ede9fe;
  --teal:#0d9488;--tealBg:#ccfbf1;
  --r:10px;--r2:14px;
  --sh:0 2px 16px rgba(3,105,161,.10);--sh2:0 6px 32px rgba(3,105,161,.18);
}
body{background:var(--bg);color:var(--text);font-family:'Plus Jakarta Sans',sans-serif;font-size:14px}
.app{display:flex;flex-direction:column;min-height:100vh}
.layout{display:flex;flex:1}
.main{flex:1;overflow-y:auto;padding:28px 32px}

/* TOPBAR */
.topbar{height:60px;background:linear-gradient(135deg,#0c2340 0%,#0d3a6e 60%,#0369a1 100%);display:flex;align-items:center;padding:0 28px;justify-content:space-between;position:sticky;top:0;z-index:200;box-shadow:0 2px 16px rgba(3,105,161,.35);}
.topbar::after{content:'';position:absolute;bottom:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,var(--sky),var(--ocean3),transparent);}
.logo{width:38px;height:38px;border-radius:9px;background:linear-gradient(135deg,var(--ocean3),var(--sky));display:flex;align-items:center;justify-content:center;font-family:'Instrument Serif',serif;font-style:italic;color:#fff;font-size:17px;flex-shrink:0;box-shadow:0 2px 10px rgba(56,189,248,.35);}
.brand-name{font-size:15px;font-weight:700;color:#fff}
.brand-sub{font-size:11px;color:rgba(255,255,255,.45);letter-spacing:.05em;text-transform:uppercase}
.user-av{width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,var(--ocean3),var(--sky));display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:#fff;box-shadow:0 2px 8px rgba(56,189,248,.4);}
.user-nm{font-size:13px;font-weight:600;color:#fff}
.user-id{font-size:11px;color:rgba(255,255,255,.4)}
.so-btn{padding:6px 14px;border-radius:7px;font-size:12px;font-weight:600;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.18);color:rgba(255,255,255,.75);cursor:pointer;font-family:inherit;transition:.15s;}
.so-btn:hover{background:rgba(255,255,255,.18);color:#fff}

/* SIDEBAR */
.sidebar{width:210px;min-width:210px;background:var(--white);border-right:1px solid var(--border);display:flex;flex-direction:column;padding:20px 10px;position:sticky;top:60px;height:calc(100vh - 60px);overflow-y:auto;}
.slbl{font-size:10px;font-weight:700;color:var(--text3);letter-spacing:.1em;text-transform:uppercase;padding:0 10px 8px}
.si{display:flex;align-items:center;gap:9px;padding:9px 11px;border-radius:8px;cursor:pointer;font-size:13px;font-weight:500;color:var(--text2);transition:.13s;position:relative}
.si:hover{background:var(--bg);color:var(--text)}
.si.act{background:var(--skyLight);color:var(--ocean);font-weight:700}
.si.act::before{content:'';position:absolute;left:0;top:50%;transform:translateY(-50%);width:3px;height:20px;background:var(--ocean);border-radius:0 3px 3px 0}
.sbdg{margin-left:auto;background:var(--amber);color:#fff;border-radius:20px;font-size:10px;font-weight:700;padding:2px 7px}
.shr{height:1px;background:var(--border);margin:12px 10px}
.smr{display:flex;justify-content:space-between;padding:5px 11px;font-size:12px;border-bottom:1px solid var(--border)}
.smr:last-child{border-bottom:none}
.smrl{color:var(--text3)}

/* PAGE HEADER */
.pgh{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:22px}
.pgt{font-family:'Instrument Serif',serif;font-size:24px;color:var(--navy)}
.pgs{font-size:12px;color:var(--text3);margin-top:3px}
.dchip{padding:7px 14px;border-radius:8px;font-size:12px;font-weight:600;background:var(--white);border:1px solid var(--border);color:var(--text2);white-space:nowrap;}

/* STAT CARDS */
.srow{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:26px}
.sc{background:var(--white);border:1px solid var(--border);border-radius:var(--r2);padding:18px 20px;position:relative;overflow:hidden;}
.sc::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;}
.sc.c1::before{background:linear-gradient(90deg,var(--ocean),var(--sky))}
.sc.c2::before{background:linear-gradient(90deg,var(--amber),#fbbf24)}
.sc.c3::before{background:linear-gradient(90deg,var(--purple),#a78bfa)}
.sc.c4::before{background:linear-gradient(90deg,var(--green),#4ade80)}
.scv{font-family:'Instrument Serif',serif;font-size:30px;line-height:1;margin-bottom:4px}
.sc.c1 .scv{color:var(--ocean)} .sc.c2 .scv{color:var(--amber)} .sc.c3 .scv{color:var(--purple)} .sc.c4 .scv{color:var(--green)}
.scl{font-size:12px;color:var(--text3);font-weight:500}

/* INSURANCE TAG */
.ins-tag{display:inline-flex;align-items:center;gap:4px;padding:3px 9px;border-radius:20px;font-size:10px;font-weight:700;white-space:nowrap;border:1.5px solid;letter-spacing:.04em}
.tpa-tag{background:linear-gradient(135deg,#fef3cd,#fef9e7);color:var(--amber);border-color:rgba(180,83,9,.25);}

/* TASK GRID */
.tgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(310px,1fr));gap:14px}
.tc{background:var(--white);border:1px solid var(--border);border-radius:var(--r2);padding:18px 20px;cursor:pointer;transition:.18s;}
.tc:hover{border-color:var(--ocean);box-shadow:var(--sh2);transform:translateY(-2px)}
.tctp{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:10px;gap:8px}
.tcnm{font-size:15px;font-weight:700;color:var(--navy)}
.tcid{font-size:11px;color:var(--text3);font-family:monospace;margin-top:2px}
.tcrs{margin-bottom:10px;display:flex;flex-direction:column;gap:5px}
.tcrw{display:flex;align-items:center;gap:7px;font-size:12px;color:var(--text2)}
.tcri{width:16px;text-align:center;color:var(--text3);flex-shrink:0}
.tc-dod{display:flex;gap:0;margin-bottom:12px;background:var(--bg);border-radius:8px;border:1px solid var(--border);overflow:hidden}
.tc-dod-item{flex:1;padding:8px 10px;display:flex;flex-direction:column;gap:2px;border-right:1px solid var(--border)}
.tc-dod-item:last-child{border-right:none}
.tc-dod-lbl{font-size:9px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.07em}
.tc-dod-val{font-size:12px;font-weight:700;color:var(--navy)}
.tc-dod-val.exp{color:var(--amber)} .tc-dod-val.dis{color:var(--ocean)}
.tcch{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px}
.tcft{display:flex;justify-content:space-between;align-items:center;padding-top:12px;border-top:1px solid var(--border)}
.tcdoa{font-size:11px;color:var(--text3)}
.tcpb{margin-bottom:12px}
.tcpbar{height:4px;background:var(--border);border-radius:4px;overflow:hidden;margin-top:5px}
.tcpfil{height:100%;background:linear-gradient(90deg,var(--ocean),var(--sky));border-radius:4px;transition:width .3s}
.tcplbl{font-size:11px;color:var(--text3)}

/* BADGES */
.badge{display:inline-flex;align-items:center;gap:4px;padding:4px 9px;border-radius:20px;font-size:11px;font-weight:700;white-space:nowrap}
.ba{background:var(--amberBg);color:var(--amber)} .bt{background:var(--skyLight);color:var(--ocean)}
.bb{background:var(--bg2);color:var(--ocean2)} .bg{background:var(--greenBg);color:var(--green)}
.chip{padding:3px 9px;border-radius:20px;font-size:11px;font-weight:600;background:var(--bg2);color:var(--text2);border:1px solid var(--border)}

/* BACK BUTTON */
.back-btn{display:inline-flex;align-items:center;gap:7px;font-size:13px;font-weight:600;color:var(--text2);cursor:pointer;background:var(--white);border:1px solid var(--border);border-radius:8px;padding:7px 15px;font-family:inherit;transition:.14s;margin-bottom:20px;}
.back-btn:hover{color:var(--ocean);border-color:var(--ocean);background:var(--skyLight)}

/* PATIENT HEADER */
.dhdr{background:var(--white);border:1px solid var(--border);border-radius:var(--r2);padding:20px 24px;margin-bottom:10px;}
.dname{font-family:'Instrument Serif',serif;font-size:22px;color:var(--navy);margin-bottom:4px}
.dmeta{font-size:13px;color:var(--text2);margin-bottom:10px}
.dmeta strong{color:var(--navy)}
.dod-strip{display:flex;gap:0;background:var(--bg);border-radius:10px;border:1px solid var(--border);overflow:hidden;margin-top:12px;}
.dod-strip-item{flex:1;padding:10px 16px;display:flex;flex-direction:column;gap:3px;border-right:1px solid var(--border)}
.dod-strip-item:last-child{border-right:none}
.dod-strip-lbl{font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.07em}
.dod-strip-val{font-size:13px;font-weight:700;color:var(--navy)}
.dod-strip-val.exp{color:var(--amber)} .dod-strip-val.dis{color:var(--ocean)} .dod-strip-val.dia{color:var(--ocean3)}

/* TPA PANEL */
.tpa-panel{background:linear-gradient(135deg,#fffbeb,#fef9e7);border:1.5px solid rgba(180,83,9,.2);border-radius:var(--r2);padding:18px 20px;margin-bottom:18px;}
.tpa-panel-title{font-size:11px;font-weight:800;color:var(--amber);letter-spacing:.1em;text-transform:uppercase;margin-bottom:14px;display:flex;align-items:center;gap:8px}
.tpa-info-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:12px;margin-bottom:16px;}
.tpa-doc-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:10px;}
.tpa-doc-btn{display:flex;flex-direction:column;align-items:center;gap:6px;padding:12px 8px;background:var(--white);border:1.5px solid rgba(180,83,9,.2);border-radius:10px;cursor:pointer;font-family:inherit;transition:.14s;text-align:center;}
.tpa-doc-btn:hover{border-color:var(--amber);background:#fffbeb;transform:translateY(-1px)}
.tpa-doc-btn.done{background:#ecfdf5;border-color:rgba(21,128,61,.3);}
.tpa-doc-ico{font-size:22px}
.tpa-doc-lbl{font-size:11px;font-weight:700;color:var(--text2);line-height:1.3}
.tpa-doc-btn.done .tpa-doc-lbl{color:var(--green)}
.tpa-doc-check{font-size:11px;color:var(--green);font-weight:700}

/* CHECKLIST PANEL */
.clpanel{background:var(--white);border:1px solid var(--border);border-radius:var(--r2);padding:18px 20px;margin-bottom:18px;}
.cltitle{font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.09em;margin-bottom:14px}
.clsteps{display:flex;align-items:center;margin-bottom:16px}
.clstep{display:flex;align-items:center;gap:8px;flex:1;min-width:0;padding:9px 10px;border-radius:9px;cursor:pointer;transition:.13s}
.clstep:hover{background:var(--bg)}
.clstep.done{background:var(--skyLight)} .clstep.cur{background:var(--bg2)}
.clchk{width:26px;height:26px;border-radius:50%;border:2px solid var(--border2);display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:11px;font-weight:700;background:var(--white);color:var(--text3);}
.clstep.done .clchk{background:var(--ocean);border-color:var(--ocean);color:#fff}
.clstep.cur .clchk{border-color:var(--ocean3);color:var(--ocean3)}
.cllbl{font-size:11px;font-weight:600;color:var(--text2);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.clstep.done .cllbl{color:var(--ocean)} .clstep.cur .cllbl{color:var(--ocean3)}
.clcon{width:14px;height:2px;background:var(--border);flex-shrink:0}
.clcon.done{background:var(--ocean)}
.clfoot{border-top:1px solid var(--border);padding-top:14px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px}
.clmsg-ok{font-size:13px;color:var(--ocean);font-weight:600}
.clmsg-pend{font-size:13px;color:var(--text3)}
.clmsg-cnt{color:var(--amber);font-weight:700}

/* ACTION BUTTONS */
.hod-btn{padding:10px 22px;border-radius:8px;font-size:13px;font-weight:700;background:linear-gradient(135deg,var(--ocean),var(--ocean3));color:#fff;border:none;cursor:pointer;font-family:inherit;transition:.16s;box-shadow:0 3px 12px rgba(3,105,161,.30);}
.hod-btn:hover{background:linear-gradient(135deg,var(--ocean2),var(--ocean));transform:translateY(-1px);box-shadow:0 5px 16px rgba(3,105,161,.38);}
.hod-btn:disabled{opacity:.4;cursor:not-allowed;transform:none;box-shadow:none}
.done-bdg{padding:10px 18px;border-radius:8px;background:var(--skyLight);border:1px solid rgba(3,105,161,.25);color:var(--ocean);font-weight:700;font-size:13px;}
.savebtn{padding:10px 22px;border-radius:8px;font-size:13px;font-weight:700;background:var(--navy);color:#fff;border:none;cursor:pointer;font-family:inherit;transition:.14s;margin-top:4px;}
.savebtn:hover{background:var(--navy2)}

/* TABS */
.twrap{background:var(--white);border:1px solid var(--border);border-radius:var(--r2);overflow:hidden;margin-bottom:20px;}
.tabs{display:flex;overflow-x:auto;border-bottom:1px solid var(--border)}
.tabbtn{padding:12px 18px;font-size:13px;font-weight:600;cursor:pointer;border:none;background:none;color:var(--text3);font-family:inherit;border-bottom:2px solid transparent;transition:.13s;white-space:nowrap;display:flex;align-items:center;gap:6px;}
.tabbtn:hover{color:var(--text2);background:var(--bg)}
.tabbtn.act{color:var(--ocean);border-bottom-color:var(--ocean);background:var(--skyLight)}
.tdot{width:7px;height:7px;border-radius:50%;background:var(--ocean)}

/* SECTION CARDS */
.secc{background:var(--white);border:1px solid var(--border);border-radius:var(--r2);margin-bottom:16px;overflow:hidden;}
.sech{display:flex;align-items:center;justify-content:space-between;padding:13px 20px;border-bottom:1px solid var(--border);background:linear-gradient(135deg,var(--bg) 0%,var(--skyLight) 100%);}
.sect{font-size:14px;font-weight:700;color:var(--navy);display:flex;align-items:center;gap:7px}
.secb{padding:20px}

/* REPORT SUBSECTION TABS */
.rep-sub-tabs{display:flex;gap:8px;padding:12px 20px;border-bottom:1px solid var(--border);background:var(--bg);}
.rep-sub-tab{padding:6px 16px;border-radius:20px;font-size:12px;font-weight:700;cursor:pointer;border:1.5px solid var(--border);background:var(--white);color:var(--text2);font-family:inherit;transition:.13s;}
.rep-sub-tab:hover{border-color:var(--ocean);color:var(--ocean)}
.rep-sub-tab.sel-lab{background:var(--ocean);border-color:var(--ocean);color:#fff}
.rep-sub-tab.sel-radio{background:#6d28d9;border-color:#6d28d9;color:#fff}

/* REPORT SEARCH & FILTER */
.rep-filter-bar{display:flex;gap:10px;padding:10px 20px;border-bottom:1px solid var(--border);flex-wrap:wrap;align-items:center;}
.rep-search{flex:1;min-width:180px;background:var(--white);border:1.5px solid var(--border);border-radius:8px;padding:7px 12px;font-size:13px;font-family:inherit;outline:none;color:var(--navy);}
.rep-search:focus{border-color:var(--ocean)}
.rtype-btn{padding:5px 12px;border-radius:20px;font-size:11px;font-weight:600;cursor:pointer;border:1.5px solid var(--border);background:var(--white);color:var(--text2);font-family:inherit;transition:.13s;}
.rtype-btn:hover{border-color:var(--ocean);color:var(--ocean)}
.rtype-btn.sel{background:var(--ocean);border-color:var(--ocean);color:#fff}
.rtype-btn.sel-radio{background:#6d28d9;border-color:#6d28d9;color:#fff}

/* MODALITY DETAILS */
.modality-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:10px;padding:12px 20px;background:linear-gradient(135deg,#f5f3ff,#ede9fe);border-bottom:1px solid #ddd6fe;}
.mod-lbl{font-size:10px;font-weight:700;color:#6d28d9;text-transform:uppercase;letter-spacing:.06em;margin-bottom:3px}
.mod-inp{width:100%;background:var(--white);border:1.5px solid #ddd6fe;border-radius:7px;padding:7px 10px;font-size:12px;font-family:inherit;outline:none;color:var(--navy);}
.mod-inp:focus{border-color:#6d28d9}
.mod-txt{width:100%;background:var(--white);border:1.5px solid #ddd6fe;border-radius:7px;padding:7px 10px;font-size:12px;font-family:inherit;outline:none;color:var(--navy);resize:vertical;min-height:60px;}
.mod-txt:focus{border-color:#6d28d9}

/* PRESCRIPTION */
.rx-table{background:var(--white)}

/* FORM */
.fgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:14px}
.fg{display:flex;flex-direction:column;gap:5px}
.fg.full{grid-column:1/-1}
.flbl{font-size:11px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.07em}
.finp,.fsel,.ftxt{background:var(--bg);border:1.5px solid var(--border);border-radius:8px;padding:9px 12px;color:var(--navy);font-size:13px;font-family:inherit;transition:.14s;outline:none;width:100%;}
.finp:focus,.fsel:focus,.ftxt:focus{border-color:var(--ocean);background:#fff;box-shadow:0 0 0 3px rgba(3,105,161,.08);}
.ftxt{resize:vertical;min-height:78px}

/* TABLE */
.tw{overflow-x:auto;border-radius:var(--r);border:1px solid var(--border)}
.tbl{width:100%;border-collapse:collapse;font-size:13px}
.tbl th{text-align:left;padding:10px 14px;font-size:11px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.06em;background:linear-gradient(135deg,var(--bg),var(--skyLight));border-bottom:1px solid var(--border);}
.tbl td{padding:9px 14px;border-bottom:1px solid var(--border);vertical-align:middle}
.tbl tr:last-child td{border-bottom:none}
.tbl tr:hover td{background:var(--bg)}
.tinp{background:var(--bg);border:1.5px solid var(--border);border-radius:6px;padding:6px 9px;color:var(--navy);font-size:12px;font-family:inherit;outline:none;width:100%;}
.tinp:focus{border-color:var(--ocean);background:#fff}
.tsel{background:var(--bg);border:1.5px solid var(--border);border-radius:6px;padding:6px 8px;color:var(--navy);font-size:12px;font-family:inherit;outline:none;width:100%;}
.addbtn{display:inline-flex;align-items:center;gap:6px;padding:8px 15px;background:var(--bg);border:1.5px dashed var(--border2);color:var(--text2);border-radius:8px;cursor:pointer;font-size:12px;font-family:inherit;font-weight:600;margin-top:12px;transition:.14s;}
.addbtn:hover{border-color:var(--ocean);color:var(--ocean);background:var(--skyLight)}
.delbtn{background:var(--redBg);border:1px solid rgba(185,28,28,.15);color:var(--red);border-radius:5px;padding:4px 8px;cursor:pointer;font-size:12px;font-family:inherit;}
.delbtn:hover{background:#fcc}

/* REPORT CARD */
.prcard{background:var(--white);border:1px solid var(--border);border-radius:var(--r2);margin-bottom:18px;overflow:hidden;}
.prhdr{background:linear-gradient(135deg,#0c2340 0%,#0d3a6e 55%,#0369a1 100%);color:#fff;padding:14px 20px;display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap;border-bottom:2px solid var(--sky);}
.prhdr.radio{background:linear-gradient(135deg,#1e1b4b 0%,#3730a3 55%,#6d28d9 100%);border-bottom:2px solid #a78bfa}
.prmt{font-size:12px;color:rgba(255,255,255,.55);margin-top:6px;display:flex;gap:20px;flex-wrap:wrap}
.prftr{padding:14px 20px;border-top:1px solid var(--border);background:linear-gradient(135deg,var(--bg),var(--skyLight));display:flex;align-items:flex-end;gap:20px;flex-wrap:wrap;}
.rmlbl{font-size:11px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px}
.rminp{flex:1;min-width:200px;background:var(--white);border:1.5px solid var(--border);border-radius:8px;padding:8px 12px;color:var(--navy);font-size:13px;font-family:inherit;outline:none;}
.rminp:focus{border-color:var(--ocean)}
.amtgrp{display:flex;align-items:center;gap:8px;flex-shrink:0}
.amtlbl{font-size:12px;font-weight:600;color:var(--text3);white-space:nowrap}
.amtinp{width:110px;background:var(--white);border:1.5px solid var(--border);border-radius:8px;padding:8px 10px;color:var(--navy);font-size:13px;font-family:inherit;font-weight:700;outline:none;}
.addrep{display:inline-flex;align-items:center;gap:7px;padding:10px 18px;background:linear-gradient(135deg,var(--ocean),var(--ocean3));color:#fff;border:none;border-radius:9px;cursor:pointer;font-size:13px;font-weight:600;font-family:inherit;transition:.14s;box-shadow:0 3px 10px rgba(3,105,161,.25);}
.addrep:hover{background:linear-gradient(135deg,var(--ocean2),var(--ocean));transform:translateY(-1px)}
.addradiorep{display:inline-flex;align-items:center;gap:7px;padding:10px 18px;background:linear-gradient(135deg,#6d28d9,#7c3aed);color:#fff;border:none;border-radius:9px;cursor:pointer;font-size:13px;font-weight:600;font-family:inherit;transition:.14s;box-shadow:0 3px 10px rgba(109,40,217,.25);}
.addradiorep:hover{background:linear-gradient(135deg,#5b21b6,#6d28d9);transform:translateY(-1px)}

/* TOTALS */
.totbox{margin-top:18px;border-top:2px solid var(--border);padding-top:14px;max-width:360px;margin-left:auto;}
.tr2{display:flex;justify-content:space-between;padding:5px 0;font-size:13px}
.trl{color:var(--text3)} .trv{font-weight:700}
.tr2.fin{border-top:2px solid var(--ocean);margin-top:8px;padding-top:10px;font-size:15px;font-weight:800;color:var(--ocean);}
.bgrid{display:grid;grid-template-columns:1fr 320px;gap:16px;align-items:start}

/* MODAL */
.overlay{position:fixed;inset:0;background:rgba(12,35,64,.65);z-index:999;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(6px);}
.modal{background:var(--white);border-radius:16px;padding:30px 32px;min-width:360px;max-width:95vw;box-shadow:var(--sh2);position:relative;max-height:90vh;overflow-y:auto;border-top:3px solid var(--ocean);}
.mclose{position:absolute;top:16px;right:16px;width:28px;height:28px;border-radius:6px;background:var(--bg);border:1px solid var(--border);cursor:pointer;font-size:13px;color:var(--text2);display:flex;align-items:center;justify-content:center;}
.mclose:hover{background:var(--redBg);color:var(--red)}
.mico{font-size:42px;text-align:center;margin-bottom:12px}
.mtitle{font-family:'Instrument Serif',serif;font-size:21px;color:var(--navy);text-align:center;margin-bottom:6px}
.msub{font-size:13px;color:var(--text2);text-align:center;line-height:1.65;margin-bottom:20px}
.mcl{background:var(--bg);border-radius:var(--r);padding:16px;margin-bottom:20px;display:flex;flex-direction:column;gap:8px}
.mclr{display:flex;align-items:center;gap:10px;font-size:13px}
.mrow{display:flex;gap:10px;justify-content:center}
.cbtn{padding:10px 22px;border-radius:8px;font-size:13px;font-weight:600;background:var(--bg);border:1.5px solid var(--border);color:var(--text2);cursor:pointer;font-family:inherit}
.cbtn:hover{border-color:var(--ocean);color:var(--ocean)}

/* TPA DOC MODAL */
.tpa-modal{background:var(--white);border-radius:16px;padding:30px 32px;width:500px;max-width:95vw;box-shadow:var(--sh2);position:relative;max-height:90vh;overflow-y:auto;border-top:3px solid var(--amber);}

/* TOASTS */
.twrp{position:fixed;bottom:20px;right:20px;z-index:9999;display:flex;flex-direction:column;gap:8px;pointer-events:none}
.tst{background:var(--white);border:1px solid var(--border);border-radius:10px;padding:12px 16px;font-size:13px;font-weight:600;box-shadow:var(--sh2);display:flex;align-items:center;gap:9px;animation:tsl .22s ease;color:var(--navy);}
.tst.s{border-left:3px solid var(--ocean)} .tst.e{border-left:3px solid var(--red)}
@keyframes tsl{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
.empty{text-align:center;padding:60px 20px;color:var(--text3)}
.empty-ico{font-size:44px;margin-bottom:12px}

@media(max-width:860px){
  .sidebar{display:none}.main{padding:16px}
  .srow{grid-template-columns:repeat(2,1fr)}
  .bgrid{grid-template-columns:1fr}
  .clcon{display:none}
}
`;

export default function BillingDashboard() {
  const [patients, setPatients]   = useState(MOCK_PATIENTS);
  const [view, setView]           = useState("tasks");
  const [sel, setSel]             = useState(null);
  const [activeTab, setActiveTab] = useState("discharge");
  const [showConfirm, setShowConfirm] = useState(false);
  const [toasts, setToasts]       = useState([]);

  // Reports sub-state
  const [repSubTab, setRepSubTab]     = useState("lab");   // "lab" | "radiology"
  const [labFilter, setLabFilter]     = useState("All");
  const [radioFilter, setRadioFilter] = useState("All");
  const [labSearch, setLabSearch]     = useState("");
  const [radioSearch, setRadioSearch] = useState("");

  // TPA doc modal
  const [tpaDocModal, setTpaDocModal] = useState(null); // {docId, label, ico}

  const [eDis, setEDis]         = useState({});
  const [eMed, setEMed]         = useState({});
  const [eSvc, setESvc]         = useState([]);
  const [eLabRep, setELabRep]   = useState([]);
  const [eMedBill, setEMedBill] = useState([]);
  const [eBilling, setEBilling] = useState({});
  const [eSaved, setESaved]     = useState({});
  const [ePrescrip, setEPrescrip] = useState([]);
  const [eTpaDocStatus, setETpaDocStatus] = useState({});
  const [eTpaInfo, setETpaInfo]   = useState({});

  const toast = (msg, type="s") => {
    const id = _tid++;
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3000);
  };

  const openPatient = (p) => {
    setSel(p);
    setEDis({...p.discharge});
    setEMed({...p.medicalHistory});
    setESvc(JSON.parse(JSON.stringify(p.services)));
    setELabRep(JSON.parse(JSON.stringify(p.labReports)));
    setEMedBill(JSON.parse(JSON.stringify(p.medicalBill)));
    setEBilling({...p.billing});
    setESaved({...p.saved});
    setEPrescrip(JSON.parse(JSON.stringify(p.prescription||[])));
    setETpaDocStatus({...p.tpaDocStatus});
    setETpaInfo({...p.tpaInfo});
    setRepSubTab("lab"); setLabFilter("All"); setRadioFilter("All");
    setLabSearch(""); setRadioSearch("");
    setActiveTab("discharge");
    setView("patient");
  };

  const saveSection = (sKey, label) => {
    const ns = {...eSaved, [sKey]: true};
    setESaved(ns);
    setPatients(prev => prev.map(p =>
      p.uhid === sel.uhid
        ? {...p, saved:ns, discharge:{...eDis}, medicalHistory:{...eMed}, services:[...eSvc],
           labReports:JSON.parse(JSON.stringify(eLabRep)), medicalBill:[...eMedBill],
           billing:{...eBilling}, prescription:JSON.parse(JSON.stringify(ePrescrip)),
           tpaDocStatus:{...eTpaDocStatus}, tpaInfo:{...eTpaInfo}}
        : p
    ));
    toast(label + " saved");
  };

  const markTpaDoc = (docId) => {
    const ns = {...eTpaDocStatus, [docId]: true};
    setETpaDocStatus(ns);
    setPatients(prev => prev.map(p => p.uhid===sel.uhid ? {...p, tpaDocStatus:ns} : p));
    toast("TPA document marked: " + TPA_DOCS.find(d=>d.id===docId)?.label);
    setTpaDocModal(null);
  };

  const allSaved   = eSaved && SECTION_KEYS.every(k=>eSaved[k]);
  const savedCount = eSaved ? SECTION_KEYS.filter(k=>eSaved[k]).length : 0;

  const completeTask = () => {
    setPatients(prev => prev.map(p => p.uhid===sel.uhid ? {...p, taskStatus:"completed", saved:{...eSaved}} : p));
    setSel(prev => ({...prev, taskStatus:"completed"}));
    setShowConfirm(false);
    toast("Task submitted to HOD");
  };

  const isTPA = sel && ["ECHS","ECI","FCI","Ayushman Bharat","Northern Railways","TPA"].includes(eBilling?.insuranceType);

  const updSvc = (i,k,v) => setESvc(prev => {
    const n=[...prev]; n[i]={...n[i],[k]:v};
    if(k==="qty"||k==="rate") n[i].amount=Number(n[i].qty||0)*Number(n[i].rate||0);
    return n;
  });
  const updRep  = (ri,k,v) => setELabRep(p=>{const n=JSON.parse(JSON.stringify(p));n[ri][k]=v;return n;});
  const updModalityDetail = (ri,k,v) => setELabRep(p=>{const n=JSON.parse(JSON.stringify(p));n[ri].modalityDetails={...n[ri].modalityDetails,[k]:v};return n;});
  const updTest = (ri,ti,k,v) => setELabRep(p=>{const n=JSON.parse(JSON.stringify(p));n[ri].tests[ti][k]=v;return n;});
  const addTest = (ri) => setELabRep(p=>{const n=JSON.parse(JSON.stringify(p));n[ri].tests.push({id:Date.now(),name:"",value:"",unit:"",refRange:"",status:"Normal"});return n;});
  const delTest = (ri,ti) => setELabRep(p=>{const n=JSON.parse(JSON.stringify(p));n[ri].tests.splice(ti,1);return n;});

  const labReports   = eLabRep.filter(r=>r.reportCategory==="lab");
  const radioReports = eLabRep.filter(r=>r.reportCategory==="radiology");

  const labTypes   = useMemo(()=>["All",...Array.from(new Set(labReports.map(r=>r.reportType)))],[labReports.length]);
  const radioTypes = useMemo(()=>["All",...Array.from(new Set(radioReports.map(r=>r.reportType)))],[radioReports.length]);

  const visibleLab = labReports.filter(r=>(labFilter==="All"||r.reportType===labFilter)&&(labSearch===""||r.reportName.toLowerCase().includes(labSearch.toLowerCase())||r.orderedBy.toLowerCase().includes(labSearch.toLowerCase())));
  const visibleRadio = radioReports.filter(r=>(radioFilter==="All"||r.reportType===radioFilter)&&(radioSearch===""||r.reportName.toLowerCase().includes(radioSearch.toLowerCase())||r.modalityDetails?.bodyPart?.toLowerCase().includes(radioSearch.toLowerCase())));

  const totals = sel ? calcTotals(eSvc, eLabRep, eMedBill, eBilling) : null;
  const pending   = patients.filter(p=>p.taskStatus==="pending").length;
  const completed = patients.filter(p=>p.taskStatus==="completed").length;

  const TABS = [
    {id:"discharge",sKey:"discharge",lbl:"Discharge Summary",ico:"📋"},
    {id:"medical",  sKey:"admission", lbl:"Admission Note",   ico:"🩺"},
    {id:"reports",  sKey:"reports",   lbl:"Reports",          ico:"🗂️"},
    {id:"med_bill", sKey:"medicines", lbl:"Medicine Bill",    ico:"💊"},
    {id:"finalbill",sKey:"billing",   lbl:"Final Bill",       ico:"🧾"},
  ];

  const insColor = (type) => INSURANCE_COLORS[type] || "#6b7280";

  return (
    <>
      <style>{CSS}</style>
      <div className="app">

        {/* TOPBAR */}
        <header className="topbar">
          <div style={{display:"flex",alignItems:"center",gap:14}}>
            <div className="logo">Sh</div>
            <div>
              <div className="brand-name">Sangi Hospital</div>
              <div className="brand-sub">Billing Department</div>
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{display:"flex",alignItems:"center",gap:9}}>
              <div className="user-av">{CURRENT_USER.name[0]}</div>
              <div>
                <div className="user-nm">{CURRENT_USER.name}</div>
                <div className="user-id">{CURRENT_USER.empId} · Billing Staff</div>
              </div>
            </div>
            <button className="so-btn">Sign Out</button>
          </div>
        </header>

        <div className="layout">
          {/* SIDEBAR */}
          <aside className="sidebar">
            <div className="slbl">Workspace</div>
            <div className="si act">
              <span>📋</span> My Tasks
              {pending > 0 && <span className="sbdg">{pending}</span>}
            </div>
            <div className="shr" />
            <div className="slbl">Overview</div>
            <div className="smr"><span className="smrl">Total Assigned</span><strong style={{color:"var(--navy)"}}>{patients.length}</strong></div>
            <div className="smr"><span className="smrl">Daily Capacity</span><strong style={{color:"var(--ocean)"}}>6</strong></div>
            <div className="smr"><span className="smrl">Pending</span><strong style={{color:"var(--amber)"}}>{pending}</strong></div>
            <div className="smr"><span className="smrl">Completed</span><strong style={{color:"var(--green)"}}>{completed}</strong></div>
            <div className="shr" />
            <div className="slbl">Insurance</div>
            {INSURANCE_TYPES.slice(0,6).map(ins => (
              <div key={ins} className="smr">
                <span className="smrl" style={{fontSize:11}}>{ins}</span>
                <strong style={{color:insColor(ins),fontSize:11}}>{patients.filter(p=>p.insuranceType===ins).length}</strong>
              </div>
            ))}
          </aside>

          <main className="main">

            {/* TASK LIST */}
            {view === "tasks" && (
              <>
                <div className="pgh">
                  <div>
                    <div className="pgt">My Tasks</div>
                    <div className="pgs">Patients assigned to you · Daily capacity: 6 patients</div>
                  </div>
                  <div className="dchip">{new Date().toLocaleDateString("en-IN",{weekday:"short",day:"numeric",month:"long",year:"numeric"})}</div>
                </div>

                <div className="srow">
                  <div className="sc c1"><div className="scv">{patients.length}</div><div className="scl">Total Assigned</div></div>
                  <div className="sc c2"><div className="scv">{pending}</div><div className="scl">Pending Tasks</div></div>
                  <div className="sc c3"><div className="scv">{completed}</div><div className="scl">Completed</div></div>
                  <div className="sc c4"><div className="scv">{patients.filter(p=>["ECHS","ECI","FCI","Ayushman Bharat","Northern Railways","TPA"].includes(p.insuranceType)).length}</div><div className="scl">Insurance Cases</div></div>
                </div>

                {patients.length === 0
                  ? <div className="empty"><div className="empty-ico">🎉</div><div>All tasks done!</div></div>
                  : <div className="tgrid">
                      {patients.map(p => {
                        const done = SECTION_KEYS.filter(k=>p.saved?.[k]).length;
                        const icolor = insColor(p.insuranceType);
                        return (
                          <div key={p.uhid} className="tc">
                            <div className="tctp">
                              <div style={{flex:1,minWidth:0}}>
                                <div className="tcnm">{p.patientName}</div>
                                <div className="tcid">{p.uhid} · {p.admNo}</div>
                              </div>
                              <span className={"badge "+(p.taskStatus==="completed"?"bt":"ba")}>
                                {p.taskStatus==="completed"?"Done":"Pending"}
                              </span>
                            </div>

                            {/* Insurance badge */}
                            <div style={{marginBottom:10}}>
                              <span className="ins-tag" style={{backgroundColor:icolor+"18",color:icolor,borderColor:icolor+"40"}}>
                                🏷 {p.insuranceType}
                              </span>
                            </div>

                            <div className="tcrs">
                              <div className="tcrw"><span className="tcri">🏥</span><strong style={{color:"var(--navy)",fontSize:11}}>{p.branch}</strong></div>
                              <div className="tcrw"><span className="tcri">👨‍⚕️</span>{p.doctor}</div>
                              <div className="tcrw"><span className="tcri">🩺</span>{p.diagnosis}</div>
                              <div className="tcrw"><span className="tcri">📞</span>{p.phone}</div>
                            </div>

                            <div className="tc-dod">
                              <div className="tc-dod-item"><div className="tc-dod-lbl">Admitted</div><div className="tc-dod-val">{fmtDtShort(p.doa)}</div></div>
                              <div className="tc-dod-item"><div className="tc-dod-lbl">Exp. Discharge</div><div className="tc-dod-val exp">{p.expectedDod?fmtDtShort(p.expectedDod):"--"}</div></div>
                              <div className="tc-dod-item"><div className="tc-dod-lbl">Discharged</div><div className="tc-dod-val dis">{p.dod?fmtDtShort(p.dod):"Active"}</div></div>
                            </div>

                            <div className="tcch">
                              <span className={"badge "+(p.status==="admitted"?"bg":"bb")}>{p.status==="admitted"?"Admitted":"Discharged"}</span>
                              <span className="chip">{p.ward} · {p.bed}</span>
                              <span className="chip">{p.age}y {p.gender[0]}</span>
                            </div>

                            {p.taskStatus !== "completed" && (
                              <div className="tcpb">
                                <div className="tcplbl">Sections saved: {done}/5</div>
                                <div className="tcpbar"><div className="tcpfil" style={{width:((done/5)*100)+"%"}} /></div>
                              </div>
                            )}

                            <div className="tcft">
                              <div className="tcdoa">DOA: {fmtDt(p.doa)}</div>
                              <button className="hod-btn" onClick={()=>openPatient(p)}>Open</button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                }
              </>
            )}

            {/* PATIENT DETAIL */}
            {view === "patient" && sel && (
              <>
                <button className="back-btn" onClick={()=>{setView("tasks");setSel(null);}}>
                  &larr; Back to My Tasks
                </button>

                {/* PATIENT HEADER */}
                <div className="dhdr">
                  <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:12,flexWrap:"wrap",marginBottom:8}}>
                    <div>
                      <div className="dname">{sel.patientName}</div>
                      <div className="dmeta">
                        UHID: <strong>{sel.uhid}</strong> &nbsp;&middot;&nbsp;
                        Adm: <strong>{sel.admNo}</strong> &nbsp;&middot;&nbsp;
                        {sel.age} yrs &middot; {sel.gender} &nbsp;&middot;&nbsp; {sel.phone}
                      </div>
                    </div>
                    {/* Insurance type selector on header */}
                    <div style={{display:"flex",flexDirection:"column",gap:5,minWidth:180}}>
                      <div className="flbl">Insurance / Scheme</div>
                      <select className="fsel" value={eBilling?.insuranceType||"Cash"} onChange={e=>setEBilling(p=>({...p,insuranceType:e.target.value}))}>
                        {INSURANCE_TYPES.map(t=><option key={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>

                  <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:10}}>
                    <span className="badge bb">🏥 {sel.branch}</span>
                    <span className={"badge "+(sel.status==="admitted"?"bg":"bt")}>{sel.status==="admitted"?"Admitted":"Discharged"}</span>
                    <span className="badge bb">🛏 {sel.ward} · {sel.bed}</span>
                    <span className="badge bb">👨‍⚕️ {sel.doctor}</span>
                    <span className={"badge "+(sel.taskStatus==="completed"?"bt":"ba")}>{sel.taskStatus==="completed"?"Submitted to HOD":"Task Pending"}</span>
                    {eBilling?.insuranceType && (
                      <span className="ins-tag" style={{backgroundColor:insColor(eBilling.insuranceType)+"18",color:insColor(eBilling.insuranceType),borderColor:insColor(eBilling.insuranceType)+"40"}}>
                        🏷 {eBilling.insuranceType}
                      </span>
                    )}
                  </div>

                  <div className="dod-strip">
                    <div className="dod-strip-item"><div className="dod-strip-lbl">Date of Admission</div><div className="dod-strip-val">{fmtDt(sel.doa)}</div></div>
                    <div className="dod-strip-item"><div className="dod-strip-lbl">Expected Discharge</div><div className="dod-strip-val exp">{eDis.expectedDod?fmtDt(eDis.expectedDod):"Not set"}</div></div>
                    <div className="dod-strip-item"><div className="dod-strip-lbl">Actual Discharge</div><div className="dod-strip-val dis">{sel.dod?fmtDt(sel.dod):"Not yet discharged"}</div></div>
                    <div className="dod-strip-item"><div className="dod-strip-lbl">Primary Diagnosis</div><div className="dod-strip-val dia">{sel.diagnosis}</div></div>
                  </div>
                </div>

                {/* TPA / INSURANCE PANEL */}
                {isTPA && (
                  <div className="tpa-panel">
                    <div className="tpa-panel-title">
                      <span>🏷</span>
                      {eBilling?.insuranceType} — Insurance Documents
                      <span style={{marginLeft:"auto",fontSize:12,fontWeight:600,color:insColor(eBilling?.insuranceType)}}>
                        {Object.values(eTpaDocStatus).filter(Boolean).length}/{TPA_DOCS.length} docs ready
                      </span>
                    </div>

                    {/* TPA Info fields */}
                    <div className="tpa-info-grid">
                      {[
                        {k:"policyNo",lbl:"Policy / Beneficiary No."},
                        {k:"claimNo",lbl:"Claim No."},
                        {k:"authNo",lbl:"Pre-Auth No."},
                        {k:"tpaName",lbl:"TPA / Scheme Name"},
                      ].map(f=>(
                        <div key={f.k} className="fg">
                          <label className="flbl">{f.lbl}</label>
                          <input className="finp" value={eTpaInfo?.[f.k]||""} placeholder={f.lbl} onChange={e=>setETpaInfo(p=>({...p,[f.k]:e.target.value}))} />
                        </div>
                      ))}
                    </div>

                    <div style={{fontSize:11,fontWeight:700,color:"var(--amber)",marginBottom:10,textTransform:"uppercase",letterSpacing:".08em"}}>
                      TPA Document Checklist — click to generate / mark ready
                    </div>
                    <div className="tpa-doc-grid">
                      {TPA_DOCS.map(doc => {
                        const done = eTpaDocStatus?.[doc.id];
                        return (
                          <button key={doc.id} className={"tpa-doc-btn"+(done?" done":"")} onClick={()=>setTpaDocModal({...doc})}>
                            <span className="tpa-doc-ico">{doc.ico}</span>
                            <span className="tpa-doc-lbl">{doc.label}</span>
                            {done && <span className="tpa-doc-check">✔ Ready</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* CHECKLIST */}
                <div className="clpanel">
                  <div className="cltitle">Task Checklist — save all 5 sections then submit to HOD</div>
                  <div className="clsteps">
                    {SECTION_KEYS.map((k,idx) => (
                      <div key={k} style={{display:"flex",alignItems:"center",flex:1,minWidth:0}}>
                        <div
                          className={"clstep"+(eSaved[k]?" done":activeTab===TAB_MAP[k]?" cur":"")}
                          style={{flex:1,minWidth:0}}
                          onClick={()=>setActiveTab(TAB_MAP[k])}
                        >
                          <div className="clchk">{eSaved[k]?"✓":SECTION_ICONS[k]}</div>
                          <div className="cllbl">{SECTION_LABELS[k]}</div>
                        </div>
                        {idx < SECTION_KEYS.length-1 && <div className={"clcon"+(eSaved[k]?" done":"")} />}
                      </div>
                    ))}
                  </div>
                  <div className="clfoot">
                    {sel.taskStatus==="completed"
                      ? <div className="clmsg-ok">✔ Submitted to HOD &amp; Admin Management</div>
                      : allSaved
                        ? <div className="clmsg-ok">✔ All sections saved — ready to submit!</div>
                        : <div className="clmsg-pend">
                            <span className="clmsg-cnt">{5-savedCount} section{5-savedCount!==1?"s":""} remaining</span>
                            {" "}— save all to unlock Submit
                          </div>
                    }
                    {sel.taskStatus !== "completed"
                      ? <button className="hod-btn" disabled={!allSaved} onClick={()=>setShowConfirm(true)}>Submit to HOD →</button>
                      : <div className="done-bdg">✔ Submitted</div>
                    }
                  </div>
                </div>

                {/* TABS */}
                <div className="twrap">
                  <div className="tabs">
                    {TABS.map(t => (
                      <button key={t.id} className={"tabbtn"+(activeTab===t.id?" act":"")} onClick={()=>setActiveTab(t.id)}>
                        {t.ico} {t.lbl} {eSaved[t.sKey] && <span className="tdot" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ── DISCHARGE SUMMARY ── */}
                {activeTab === "discharge" && (
                  <>
                    <div className="secc">
                      <div className="sech"><div className="sect">📋 Discharge Summary</div></div>
                      <div className="secb">
                        <div className="fgrid">
                          <div className="fg"><label className="flbl">Date of Admission</label><input className="finp" type="datetime-local" value={eDis?.doa||""} onChange={e=>setEDis(p=>({...p,doa:e.target.value}))} /></div>
                          <div className="fg"><label className="flbl">Expected Discharge Date</label><input className="finp" type="datetime-local" value={eDis?.expectedDod||""} onChange={e=>setEDis(p=>({...p,expectedDod:e.target.value}))} /></div>
                          <div className="fg"><label className="flbl">Actual Discharge Date</label><input className="finp" type="datetime-local" value={eDis?.dod||""} onChange={e=>setEDis(p=>({...p,dod:e.target.value}))} /></div>
                          {[
                            {k:"ward",lbl:"Ward"},{k:"bed",lbl:"Bed No."},{k:"doctor",lbl:"Treating Doctor"},
                            {k:"diagnosis",lbl:"Primary Diagnosis"},{k:"condition",lbl:"Condition at Discharge"},
                          ].map(f=>(
                            <div key={f.k} className="fg"><label className="flbl">{f.lbl}</label><input className="finp" value={eDis?.[f.k]||""} onChange={e=>setEDis(p=>({...p,[f.k]:e.target.value}))} /></div>
                          ))}
                          <div className="fg full"><label className="flbl">Discharge Instructions</label><textarea className="ftxt" value={eDis?.instructions||""} onChange={e=>setEDis(p=>({...p,instructions:e.target.value}))} /></div>
                          <div className="fg full"><label className="flbl">Additional Notes</label><textarea className="ftxt" value={eDis?.notes||""} onChange={e=>setEDis(p=>({...p,notes:e.target.value}))} /></div>
                        </div>
                      </div>
                    </div>
                    <button className="savebtn" onClick={()=>saveSection("discharge","Discharge Summary")}>Save Discharge Summary</button>
                  </>
                )}

                {/* ── ADMISSION NOTE ── */}
                {activeTab === "medical" && (
                  <>
                    <div className="secc">
                      <div className="sech"><div className="sect">🩺 Admission Note / Medical History</div></div>
                      <div className="secb">
                        <div className="fgrid">
                          {[
                            {k:"treatingDoctor",lbl:"Treating Doctor"},{k:"previousDiagnosis",lbl:"Previous Diagnosis"},
                            {k:"chronicConditions",lbl:"Chronic Conditions"},{k:"pastSurgeries",lbl:"Past Surgeries"},
                            {k:"currentMedications",lbl:"Current Medications"},{k:"knownAllergies",lbl:"Known Allergies"},
                            {k:"familyHistory",lbl:"Family History"},{k:"smokingStatus",lbl:"Smoking Status"},
                            {k:"alcoholUse",lbl:"Alcohol Use"},
                          ].map(f=>(
                            <div key={f.k} className="fg"><label className="flbl">{f.lbl}</label><input className="finp" value={eMed?.[f.k]||""} onChange={e=>setEMed(p=>({...p,[f.k]:e.target.value}))} /></div>
                          ))}
                          <div className="fg full"><label className="flbl">Notes</label><textarea className="ftxt" value={eMed?.notes||""} onChange={e=>setEMed(p=>({...p,notes:e.target.value}))} /></div>
                        </div>
                      </div>
                    </div>

                    {/* PRESCRIPTION in Admission Note */}
                    <div className="secc" style={{marginTop:16}}>
                      <div className="sech"><div className="sect">📝 Prescription</div></div>
                      <div className="secb">
                        <div className="tw">
                          <table className="tbl">
                            <thead><tr><th>Medicine Name</th><th>Dosage (M-A-N)</th><th>Duration</th><th>Instructions</th><th style={{width:44}}></th></tr></thead>
                            <tbody>
                              {ePrescrip.map((r,i)=>(
                                <tr key={r.id}>
                                  <td><input className="tinp" value={r.medicine} placeholder="e.g. Metformin 500mg" onChange={e=>{const n=[...ePrescrip];n[i]={...n[i],medicine:e.target.value};setEPrescrip(n);}}/></td>
                                  <td><input className="tinp" value={r.dosage} placeholder="1-0-1" onChange={e=>{const n=[...ePrescrip];n[i]={...n[i],dosage:e.target.value};setEPrescrip(n);}}/></td>
                                  <td><input className="tinp" value={r.duration} placeholder="7 days" onChange={e=>{const n=[...ePrescrip];n[i]={...n[i],duration:e.target.value};setEPrescrip(n);}}/></td>
                                  <td><input className="tinp" value={r.instructions} placeholder="After meals" onChange={e=>{const n=[...ePrescrip];n[i]={...n[i],instructions:e.target.value};setEPrescrip(n);}}/></td>
                                  <td><button className="delbtn" onClick={()=>setEPrescrip(p=>p.filter((_,j)=>j!==i))}>X</button></td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <button className="addbtn" onClick={()=>setEPrescrip(p=>[...p,{id:Date.now(),medicine:"",dosage:"",duration:"",instructions:""}])}>+ Add Medicine</button>
                      </div>
                    </div>
                    <button className="savebtn" onClick={()=>saveSection("admission","Admission Note")}>Save Admission Note</button>
                  </>
                )}

                {/* ── REPORTS ── */}
                {activeTab === "reports" && (
                  <>
                    <div className="secc">
                      <div className="sech">
                        <div className="sect">🗂️ Reports</div>
                        <div style={{fontSize:12,color:"var(--text3)"}}>
                          Lab: {labReports.length} &nbsp;·&nbsp; Radiology: {radioReports.length} &nbsp;·&nbsp;
                          Total: {fmt(eLabRep.reduce((a,r)=>a+Number(r.amount||0),0))}
                        </div>
                      </div>
                      {/* Sub tabs: Lab vs Radiology */}
                      <div className="rep-sub-tabs">
                        <button className={"rep-sub-tab"+(repSubTab==="lab"?" sel-lab":"")} onClick={()=>setRepSubTab("lab")}>
                          🔬 Lab Reports ({labReports.length})
                        </button>
                        <button className={"rep-sub-tab"+(repSubTab==="radiology"?" sel-radio":"")} onClick={()=>setRepSubTab("radiology")}>
                          🩻 Radiology Reports ({radioReports.length})
                        </button>
                      </div>

                      {/* LAB FILTER & SEARCH */}
                      {repSubTab === "lab" && (
                        <div className="rep-filter-bar">
                          <input className="rep-search" placeholder="🔍 Search lab reports..." value={labSearch} onChange={e=>setLabSearch(e.target.value)} />
                          {labTypes.map(t=>(
                            <button key={t} className={"rtype-btn"+(labFilter===t?" sel":"")} onClick={()=>setLabFilter(t)}>{t}</button>
                          ))}
                        </div>
                      )}
                      {/* RADIOLOGY FILTER & SEARCH */}
                      {repSubTab === "radiology" && (
                        <div className="rep-filter-bar">
                          <input className="rep-search" placeholder="🔍 Search radiology reports (MRI, CT, USG...)..." value={radioSearch} onChange={e=>setRadioSearch(e.target.value)} />
                          <select className="tsel" style={{width:"auto",paddingRight:24}} value={radioFilter} onChange={e=>setRadioFilter(e.target.value)}>
                            <option>All</option>
                            {RADIO_REPORT_TYPES.map(t=><option key={t}>{t}</option>)}
                          </select>
                          {["All",...RADIO_REPORT_TYPES].filter(t=>radioReports.some(r=>r.reportType===t||t==="All")).map(t=>(
                            <button key={t} className={"rtype-btn"+(radioFilter===t?" sel-radio":"")} onClick={()=>setRadioFilter(t)} style={{display:t==="All"?"none":"flex"}}>{t}</button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* LAB REPORTS */}
                    {repSubTab === "lab" && (
                      <>
                        {visibleLab.length === 0 && <div className="empty" style={{padding:"30px 20px"}}><div>No lab reports found.</div></div>}
                        {visibleLab.map(rep => {
                          const ri = eLabRep.findIndex(r=>r.id===rep.id);
                          return (
                            <div key={rep.id} className="prcard">
                              <div className="prhdr">
                                <div style={{flex:1}}>
                                  <input value={rep.reportName} placeholder="Report Name (e.g. Complete Blood Count)"
                                    onChange={e=>updRep(ri,"reportName",e.target.value)}
                                    style={{background:"transparent",border:"none",outline:"none",color:"#fff",fontFamily:"'Instrument Serif',serif",fontSize:16,width:"100%",fontStyle:"italic"}} />
                                  <div className="prmt">
                                    <span>Type:&nbsp;
                                      <select value={rep.reportType} onChange={e=>updRep(ri,"reportType",e.target.value)}
                                        style={{background:"transparent",border:"none",borderBottom:"1px solid rgba(255,255,255,.3)",outline:"none",color:"rgba(255,255,255,.8)",fontFamily:"inherit",fontSize:12}}>
                                        {LAB_REPORT_TYPES.map(t=><option key={t} style={{background:"#0c2340"}}>{t}</option>)}
                                      </select>
                                    </span>
                                    <span>Date:&nbsp;<input type="date" value={rep.date} onChange={e=>updRep(ri,"date",e.target.value)} style={{background:"transparent",border:"none",borderBottom:"1px solid rgba(255,255,255,.3)",outline:"none",color:"rgba(255,255,255,.7)",fontFamily:"inherit",fontSize:12}} /></span>
                                    <span>Ordered by:&nbsp;<input value={rep.orderedBy} placeholder="Doctor" onChange={e=>updRep(ri,"orderedBy",e.target.value)} style={{background:"transparent",border:"none",borderBottom:"1px solid rgba(255,255,255,.3)",outline:"none",color:"rgba(255,255,255,.7)",fontFamily:"inherit",fontSize:12,width:140}} /></span>
                                  </div>
                                </div>
                                <button onClick={()=>setELabRep(p=>p.filter((_,i)=>i!==ri))}
                                  style={{background:"rgba(248,113,113,.15)",color:"#fca5a5",border:"1px solid rgba(248,113,113,.3)",borderRadius:6,padding:"5px 12px",cursor:"pointer",fontSize:12,fontFamily:"inherit",fontWeight:600}}>
                                  Remove
                                </button>
                              </div>
                              <div>
                                <div className="tw" style={{borderRadius:0,border:"none",borderBottom:"1px solid var(--border)"}}>
                                  <table className="tbl">
                                    <thead><tr><th>Test / Parameter</th><th style={{width:90}}>Value</th><th style={{width:80}}>Unit</th><th style={{width:155}}>Reference Range</th><th style={{width:100}}>Status</th><th style={{width:40}}></th></tr></thead>
                                    <tbody>
                                      {rep.tests.map((t,ti)=>(
                                        <tr key={t.id}>
                                          <td><input className="tinp" value={t.name} placeholder="e.g. Haemoglobin" onChange={e=>updTest(ri,ti,"name",e.target.value)} /></td>
                                          <td><input className="tinp" value={t.value} placeholder="12.4" onChange={e=>updTest(ri,ti,"value",e.target.value)} style={{fontWeight:700,color:t.status==="High"?"var(--red)":t.status==="Low"?"var(--amber)":"var(--green)"}} /></td>
                                          <td><input className="tinp" value={t.unit} placeholder="g/dL" onChange={e=>updTest(ri,ti,"unit",e.target.value)} /></td>
                                          <td><input className="tinp" value={t.refRange} placeholder="13.0 - 17.0" onChange={e=>updTest(ri,ti,"refRange",e.target.value)} /></td>
                                          <td><select className="tsel" value={t.status} onChange={e=>updTest(ri,ti,"status",e.target.value)}><option>Normal</option><option>High</option><option>Low</option></select></td>
                                          <td><button className="delbtn" onClick={()=>delTest(ri,ti)}>X</button></td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                                <div style={{padding:"8px 16px"}}><button className="addbtn" onClick={()=>addTest(ri)}>+ Add Row</button></div>
                              </div>
                              <div className="prftr">
                                <div style={{flex:1}}><div className="rmlbl">Remarks / Interpretation</div><input className="rminp" value={rep.remarks} placeholder="e.g. Mild anaemia noted..." onChange={e=>updRep(ri,"remarks",e.target.value)} /></div>
                                <div className="amtgrp"><div className="amtlbl">Amount (Rs.)</div><input className="amtinp" type="number" value={rep.amount} onChange={e=>updRep(ri,"amount",Number(e.target.value))} /></div>
                              </div>
                            </div>
                          );
                        })}
                        <div style={{display:"flex",gap:14,alignItems:"center",flexWrap:"wrap",marginBottom:16}}>
                          <button className="addrep" onClick={()=>{setELabRep(p=>[...p,emptyLabReport()]);setLabFilter("All");setLabSearch("");}}>+ Add Lab Report</button>
                          <span style={{fontSize:13,color:"var(--text3)"}}>Lab Total: <strong style={{color:"var(--navy)"}}>{fmt(labReports.reduce((a,r)=>a+Number(r.amount||0),0))}</strong></span>
                        </div>
                      </>
                    )}

                    {/* RADIOLOGY REPORTS */}
                    {repSubTab === "radiology" && (
                      <>
                        {visibleRadio.length === 0 && <div className="empty" style={{padding:"30px 20px"}}><div>No radiology reports found.</div></div>}
                        {visibleRadio.map(rep => {
                          const ri = eLabRep.findIndex(r=>r.id===rep.id);
                          const md = rep.modalityDetails || {};
                          return (
                            <div key={rep.id} className="prcard">
                              <div className="prhdr radio">
                                <div style={{flex:1}}>
                                  <input value={rep.reportName} placeholder="Report Name (e.g. MRI Brain, CT Chest)"
                                    onChange={e=>updRep(ri,"reportName",e.target.value)}
                                    style={{background:"transparent",border:"none",outline:"none",color:"#fff",fontFamily:"'Instrument Serif',serif",fontSize:16,width:"100%",fontStyle:"italic"}} />
                                  <div className="prmt">
                                    <span>Modality:&nbsp;
                                      <select value={rep.reportType} onChange={e=>updRep(ri,"reportType",e.target.value)}
                                        style={{background:"transparent",border:"none",borderBottom:"1px solid rgba(255,255,255,.3)",outline:"none",color:"rgba(255,255,255,.8)",fontFamily:"inherit",fontSize:12}}>
                                        {RADIO_REPORT_TYPES.map(t=><option key={t} style={{background:"#1e1b4b"}}>{t}</option>)}
                                      </select>
                                    </span>
                                    <span>Date:&nbsp;<input type="date" value={rep.date} onChange={e=>updRep(ri,"date",e.target.value)} style={{background:"transparent",border:"none",borderBottom:"1px solid rgba(255,255,255,.3)",outline:"none",color:"rgba(255,255,255,.7)",fontFamily:"inherit",fontSize:12}} /></span>
                                    <span>Referred by:&nbsp;<input value={rep.orderedBy} placeholder="Doctor" onChange={e=>updRep(ri,"orderedBy",e.target.value)} style={{background:"transparent",border:"none",borderBottom:"1px solid rgba(255,255,255,.3)",outline:"none",color:"rgba(255,255,255,.7)",fontFamily:"inherit",fontSize:12,width:140}} /></span>
                                  </div>
                                </div>
                                <button onClick={()=>setELabRep(p=>p.filter((_,i)=>i!==ri))}
                                  style={{background:"rgba(248,113,113,.15)",color:"#fca5a5",border:"1px solid rgba(248,113,113,.3)",borderRadius:6,padding:"5px 12px",cursor:"pointer",fontSize:12,fontFamily:"inherit",fontWeight:600}}>
                                  Remove
                                </button>
                              </div>

                              {/* Modality Details */}
                              <div className="modality-grid">
                                {[
                                  {k:"bodyPart",lbl:"Body Part / Region",pl:"e.g. Brain, Chest, Knee"},
                                  {k:"view",lbl:"View / Sequence",pl:"e.g. Axial, Sagittal, PA"},
                                  {k:"contrast",lbl:"Contrast Used",pl:"Yes / No / IV Contrast"},
                                  {k:"modality",lbl:"Modality Confirm",pl:"MRI / CT / X-Ray"},
                                ].map(f=>(
                                  <div key={f.k}>
                                    <div className="mod-lbl">{f.lbl}</div>
                                    <input className="mod-inp" value={md[f.k]||""} placeholder={f.pl} onChange={e=>updModalityDetail(ri,f.k,e.target.value)} />
                                  </div>
                                ))}
                                <div style={{gridColumn:"1/-1"}}>
                                  <div className="mod-lbl">Findings</div>
                                  <textarea className="mod-txt" value={md.findings||""} placeholder="Describe imaging findings in detail..." onChange={e=>updModalityDetail(ri,"findings",e.target.value)} />
                                </div>
                                <div style={{gridColumn:"1/-1"}}>
                                  <div className="mod-lbl">Impression / Conclusion</div>
                                  <textarea className="mod-txt" value={md.impression||""} placeholder="Radiologist's impression..." onChange={e=>updModalityDetail(ri,"impression",e.target.value)} />
                                </div>
                              </div>

                              {/* Measurements table */}
                              <div>
                                <div style={{padding:"8px 16px 4px",fontSize:11,fontWeight:700,color:"#6d28d9",textTransform:"uppercase",letterSpacing:".06em"}}>Measurements / Parameters</div>
                                <div className="tw" style={{borderRadius:0,border:"none",borderBottom:"1px solid var(--border)"}}>
                                  <table className="tbl">
                                    <thead><tr><th>Parameter</th><th style={{width:120}}>Value</th><th style={{width:80}}>Unit</th><th style={{width:155}}>Normal Range</th><th style={{width:100}}>Status</th><th style={{width:40}}></th></tr></thead>
                                    <tbody>
                                      {rep.tests.map((t,ti)=>(
                                        <tr key={t.id}>
                                          <td><input className="tinp" value={t.name} placeholder="e.g. Ejection Fraction" onChange={e=>updTest(ri,ti,"name",e.target.value)} /></td>
                                          <td><input className="tinp" value={t.value} placeholder="35" onChange={e=>updTest(ri,ti,"value",e.target.value)} style={{fontWeight:700,color:t.status==="High"?"var(--red)":t.status==="Low"?"var(--amber)":"var(--green)"}} /></td>
                                          <td><input className="tinp" value={t.unit} placeholder="%" onChange={e=>updTest(ri,ti,"unit",e.target.value)} /></td>
                                          <td><input className="tinp" value={t.refRange} placeholder="55 - 70" onChange={e=>updTest(ri,ti,"refRange",e.target.value)} /></td>
                                          <td><select className="tsel" value={t.status} onChange={e=>updTest(ri,ti,"status",e.target.value)}><option>Normal</option><option>High</option><option>Low</option></select></td>
                                          <td><button className="delbtn" onClick={()=>delTest(ri,ti)}>X</button></td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                                <div style={{padding:"8px 16px"}}><button className="addbtn" onClick={()=>addTest(ri)}>+ Add Parameter</button></div>
                              </div>

                              <div className="prftr">
                                <div style={{flex:1}}><div className="rmlbl">Remarks</div><input className="rminp" value={rep.remarks} placeholder="Additional remarks..." onChange={e=>updRep(ri,"remarks",e.target.value)} /></div>
                                <div className="amtgrp"><div className="amtlbl">Amount (Rs.)</div><input className="amtinp" type="number" value={rep.amount} onChange={e=>updRep(ri,"amount",Number(e.target.value))} /></div>
                              </div>
                            </div>
                          );
                        })}
                        <div style={{display:"flex",gap:14,alignItems:"center",flexWrap:"wrap",marginBottom:16}}>
                          <button className="addradiorep" onClick={()=>{setELabRep(p=>[...p,emptyRadioReport()]);setRadioFilter("All");setRadioSearch("");}}>+ Add Radiology Report</button>
                          <span style={{fontSize:13,color:"var(--text3)"}}>Radiology Total: <strong style={{color:"var(--navy)"}}>{fmt(radioReports.reduce((a,r)=>a+Number(r.amount||0),0))}</strong></span>
                        </div>
                      </>
                    )}
                    <button className="savebtn" onClick={()=>saveSection("reports","Reports")}>Save Reports</button>
                  </>
                )}

                {/* ── MEDICINE BILL ── */}
                {activeTab === "med_bill" && (
                  <>
                    <div className="secc">
                      <div className="sech"><div className="sect">💊 Medicine / Pharmacy Bill</div></div>
                      <div className="secb">
                        <div className="tw">
                          <table className="tbl">
                            <thead><tr><th>Item Description</th><th>Date</th><th style={{width:130}}>Amount</th><th style={{width:44}}></th></tr></thead>
                            <tbody>
                              {eMedBill.map((r,i)=>(
                                <tr key={r.id}>
                                  <td><input className="tinp" value={r.item} onChange={e=>{const n=[...eMedBill];n[i]={...n[i],item:e.target.value};setEMedBill(n);}}/></td>
                                  <td><input className="tinp" type="date" value={r.date} onChange={e=>{const n=[...eMedBill];n[i]={...n[i],date:e.target.value};setEMedBill(n);}}/></td>
                                  <td><input className="tinp" type="number" value={r.amount} onChange={e=>{const n=[...eMedBill];n[i]={...n[i],amount:Number(e.target.value)};setEMedBill(n);}}/></td>
                                  <td><button className="delbtn" onClick={()=>setEMedBill(p=>p.filter((_,j)=>j!==i))}>X</button></td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <button className="addbtn" onClick={()=>setEMedBill(p=>[...p,{id:Date.now(),item:"",date:new Date().toISOString().slice(0,10),amount:0}])}>+ Add Medicine</button>
                        <div className="totbox">
                          <div className="tr2 fin"><span>Medicine Total</span><span>{fmt(eMedBill.reduce((a,r)=>a+Number(r.amount||0),0))}</span></div>
                        </div>
                      </div>
                    </div>
                    <button className="savebtn" onClick={()=>saveSection("medicines","Medicine Bill")}>Save Medicine Bill</button>
                  </>
                )}

                {/* ── FINAL BILL ── */}
                {activeTab === "finalbill" && (
                  <>
                    <div className="bgrid">
                      <div>
                        <div className="secc">
                          <div className="sech"><div className="sect">🧾 Services &amp; Charges</div></div>
                          <div className="secb">
                            <div className="tw">
                              <table className="tbl">
                                <thead><tr><th>Service</th><th>Category</th><th style={{width:60}}>Qty</th><th style={{width:90}}>Rate</th><th style={{width:100}}>Amount</th><th style={{width:44}}></th></tr></thead>
                                <tbody>
                                  {eSvc.map((r,i)=>(
                                    <tr key={r.id}>
                                      <td><input className="tinp" value={r.name} onChange={e=>updSvc(i,"name",e.target.value)} /></td>
                                      <td><input className="tinp" value={r.category} onChange={e=>updSvc(i,"category",e.target.value)} /></td>
                                      <td><input className="tinp" type="number" value={r.qty} onChange={e=>updSvc(i,"qty",e.target.value)} /></td>
                                      <td><input className="tinp" type="number" value={r.rate} onChange={e=>updSvc(i,"rate",e.target.value)} /></td>
                                      <td style={{fontWeight:700}}>{fmt(r.amount)}</td>
                                      <td><button className="delbtn" onClick={()=>setESvc(p=>p.filter((_,j)=>j!==i))}>X</button></td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                            <button className="addbtn" onClick={()=>setESvc(p=>[...p,{id:Date.now(),name:"",category:"",qty:1,rate:0,amount:0}])}>+ Add Service</button>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="secc">
                          <div className="sech"><div className="sect">💳 Payment Details</div></div>
                          <div className="secb">
                            <div style={{display:"flex",flexDirection:"column",gap:13}}>
                              <div className="fg">
                                <label className="flbl">Insurance / Scheme</label>
                                <select className="fsel" value={eBilling?.insuranceType||"Cash"} onChange={e=>setEBilling(p=>({...p,insuranceType:e.target.value}))}>
                                  {INSURANCE_TYPES.map(t=><option key={t}>{t}</option>)}
                                </select>
                              </div>
                              {[{k:"discount",lbl:"Discount (Rs.)"},{k:"advance",lbl:"Advance Paid (Rs.)"}].map(f=>(
                                <div key={f.k} className="fg">
                                  <label className="flbl">{f.lbl}</label>
                                  <input className="finp" type="number" value={eBilling?.[f.k]||0} onChange={e=>setEBilling(p=>({...p,[f.k]:e.target.value}))} />
                                </div>
                              ))}
                              <div className="fg">
                                <label className="flbl">Payment Mode</label>
                                <select className="fsel" value={eBilling?.paymentMode||"Cash"} onChange={e=>setEBilling(p=>({...p,paymentMode:e.target.value}))}>
                                  {["Cash","UPI","Card","Insurance","NEFT","Cheque"].map(m=><option key={m}>{m}</option>)}
                                </select>
                              </div>
                              <div className="fg">
                                <label className="flbl">Remarks</label>
                                <input className="finp" value={eBilling?.remarks||""} onChange={e=>setEBilling(p=>({...p,remarks:e.target.value}))} />
                              </div>
                            </div>
                            {totals && (
                              <div className="totbox">
                                <div className="tr2"><span className="trl">Services</span><span className="trv">{fmt(totals.s)}</span></div>
                                <div className="tr2"><span className="trl">Lab Reports</span><span className="trv">{fmt(totals.labTotal)}</span></div>
                                <div className="tr2"><span className="trl">Radiology Reports</span><span className="trv">{fmt(totals.radioTotal)}</span></div>
                                <div className="tr2"><span className="trl">Medicines</span><span className="trv">{fmt(totals.m)}</span></div>
                                <div className="tr2"><span className="trl">Gross Total</span><span className="trv">{fmt(totals.gross)}</span></div>
                                <div className="tr2" style={{color:"var(--red)"}}><span className="trl">Discount</span><span className="trv">- {fmt(totals.disc)}</span></div>
                                <div className="tr2"><span className="trl">Net Payable</span><span className="trv">{fmt(totals.net)}</span></div>
                                <div className="tr2" style={{color:"var(--ocean)"}}><span className="trl">Advance Paid</span><span className="trv">- {fmt(totals.adv)}</span></div>
                                <div className="tr2 fin"><span>Balance Due</span><span>{fmt(totals.due)}</span></div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <button className="savebtn" onClick={()=>saveSection("billing","Final Bill")}>Save Final Bill</button>
                  </>
                )}
              </>
            )}
          </main>
        </div>

        {/* CONFIRM MODAL */}
        {showConfirm && (
          <div className="overlay" onClick={()=>setShowConfirm(false)}>
            <div className="modal" onClick={e=>e.stopPropagation()}>
              <button className="mclose" onClick={()=>setShowConfirm(false)}>X</button>
              <div className="mico">📤</div>
              <div className="mtitle">Submit to HOD and Admin?</div>
              <div className="msub">Submitting complete billing file for <strong>{sel?.patientName}</strong> ({sel?.uhid}) to the Head of Department.</div>
              <div className="mcl">
                {SECTION_KEYS.map(k=>(
                  <div key={k} className="mclr">
                    <span>{eSaved[k]?"✅":"⚠️"}</span>
                    <span style={{color:eSaved[k]?"var(--ocean)":"var(--amber)",fontWeight:600}}>
                      {SECTION_ICONS[k]} {SECTION_LABELS[k]} — {eSaved[k]?"Saved":"Not saved"}
                    </span>
                  </div>
                ))}
                {isTPA && (
                  <div className="mclr">
                    <span>🏷</span>
                    <span style={{color:"var(--amber)",fontWeight:600}}>
                      {eBilling?.insuranceType} — {Object.values(eTpaDocStatus).filter(Boolean).length}/{TPA_DOCS.length} TPA docs ready
                    </span>
                  </div>
                )}
              </div>
              <div className="mrow">
                <button className="cbtn" onClick={()=>setShowConfirm(false)}>Cancel</button>
                <button className="hod-btn" onClick={completeTask}>Confirm and Submit</button>
              </div>
            </div>
          </div>
        )}

        {/* TPA DOC MODAL */}
        {tpaDocModal && (
          <div className="overlay" onClick={()=>setTpaDocModal(null)}>
            <div className="tpa-modal" onClick={e=>e.stopPropagation()}>
              <button className="mclose" onClick={()=>setTpaDocModal(null)}>X</button>
              <div className="mico">{tpaDocModal.ico}</div>
              <div className="mtitle">{tpaDocModal.label}</div>
              <div className="msub">
                Generate or verify <strong>{tpaDocModal.label}</strong> for {sel?.patientName} ({sel?.uhid})<br/>
                Insurance: <strong style={{color:insColor(eBilling?.insuranceType)}}>{eBilling?.insuranceType}</strong>
                {eTpaInfo?.policyNo && <> &nbsp;·&nbsp; Policy: <strong>{eTpaInfo.policyNo}</strong></>}
                {eTpaInfo?.authNo && <> &nbsp;·&nbsp; Auth: <strong>{eTpaInfo.authNo}</strong></>}
              </div>
              <div style={{background:"var(--bg)",borderRadius:"var(--r)",padding:16,marginBottom:20,fontSize:13,color:"var(--text2)"}}>
                <div style={{fontWeight:700,marginBottom:8,color:"var(--navy)"}}>Document Preview Summary</div>
                <div style={{display:"flex",flexDirection:"column",gap:6}}>
                  <div>🏥 <strong>Patient:</strong> {sel?.patientName}, {sel?.age}y, {sel?.gender}</div>
                  <div>🩺 <strong>Diagnosis:</strong> {sel?.diagnosis}</div>
                  <div>📅 <strong>Admission:</strong> {fmtDt(sel?.doa)} &nbsp;→&nbsp; <strong>Discharge:</strong> {sel?.dod?fmtDt(sel?.dod):"Active"}</div>
                  <div>👨‍⚕️ <strong>Doctor:</strong> {sel?.doctor}</div>
                  {totals && <div>💰 <strong>Total Bill:</strong> {fmt(totals.gross)} &nbsp;|&nbsp; <strong>Payable:</strong> {fmt(totals.net)}</div>}
                </div>
              </div>
              <div className="mrow">
                <button className="cbtn" onClick={()=>setTpaDocModal(null)}>Cancel</button>
                <button className="hod-btn" onClick={()=>markTpaDoc(tpaDocModal.id)}>
                  ✔ Mark as Ready
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TOASTS */}
        <div className="twrp">
          {toasts.map(t=>(
            <div key={t.id} className={"tst "+t.type}>{t.type==="s"?"✓":"✗"} {t.msg}</div>
          ))}
        </div>
      </div>
    </>
  );
}