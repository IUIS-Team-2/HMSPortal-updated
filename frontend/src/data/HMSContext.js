// src/data/HMSContext.js
// Single shared state for all hospital data.
// Admin portal writes here → SuperAdmin reads from here in real time.

import React, { createContext, useContext, useState } from 'react';
import { LOCATION_DB } from './mockDb';

export const HMSContext = createContext(null);

// ─── Convert mockDb format → flat PATIENTS array (SuperAdmin format) ──────────
export function dbToPatients(db) {
  const out = [];
  Object.entries(db).forEach(([branch, pts]) => {
    (pts || []).forEach(p => {
      (p.admissions || []).forEach(adm => {
        const services = adm.services || [];
        const bills = services.reduce(
          (s, sv) => s + (parseFloat(sv.rate) || 0) * (parseFloat(sv.qty) || 1), 0
        );
        const hasBilling = !!(adm.billing && (adm.billing.paidNow || adm.billing.paymentMode));
        out.push({
          id:          `${p.uhid}-${adm.admNo}`,
          uhid:        p.uhid,
          name:        p.patientName,
          age:         parseInt(p.ageYY) || 0,
          ward:        adm.discharge?.wardName || '—',
          bed:         adm.discharge?.bedNo   || '—',
          branch,
          status:      adm.discharge?.dischargeStatus || 'Admitted',
          admType:     (p.payMode === 'cashless' || p.tpa) ? 'Cashless' : 'Cash',
          doa:         adm.discharge?.doa  || adm.dateTime || adm.date || '',
          dod:         adm.discharge?.dod  || null,
          bills,
          billStatus:  hasBilling ? 'Generated' : 'Pending',
          medHistory:  !!(adm.medicalHistory &&
                          (adm.medicalHistory.previousDiagnosis || adm.medicalHistory.currentMedications)),
          // keep originals for drill-down
          _patient:   p,
          _admission: adm,
        });
      });
    });
  });
  return out;
}

// ─── Convert mockDb format → flat INVOICES array ──────────────────────────────
export function dbToInvoices(db) {
  const out = [];
  Object.entries(db).forEach(([branch, pts]) => {
    (pts || []).forEach(p => {
      (p.admissions || []).forEach(adm => {
        const services = adm.services || [];
        const amount = services.reduce(
          (s, sv) => s + (parseFloat(sv.rate) || 0) * (parseFloat(sv.qty) || 1), 0
        );
        const hasBilling = !!(adm.billing && (adm.billing.paidNow || adm.billing.paymentMode));
        out.push({
          id:         `INV-${p.uhid}-${adm.admNo}`,
          patientId:  `${p.uhid}-${adm.admNo}`,
          patient:    p.patientName,
          amount,
          type:       (p.payMode === 'cashless' || p.tpa) ? 'Cashless' : 'Cash',
          branch,
          date:       adm.discharge?.dod || adm.date || '',
          status:     hasBilling ? 'Approved' : 'Pending',
          approvedBy: hasBilling ? 'Admin' : null,
          _patient:   p,
          _admission: adm,
        });
      });
    });
  });
  return out;
}

// ─── Convert mockDb format → BILL_ITEMS map ───────────────────────────────────
export function dbToBillItems(db) {
  const out = {};
  Object.values(db).forEach(pts => {
    (pts || []).forEach(p => {
      (p.admissions || []).forEach(adm => {
        const key = `${p.uhid}-${adm.admNo}`;
        out[key] = (adm.services || []).map((sv, i) => ({
          id:     `BI-${key}-${i}`,
          item:   sv.title || sv.type,
          rate:   parseFloat(sv.rate) || 0,
          qty:    parseFloat(sv.qty)  || 1,
          amount: (parseFloat(sv.rate) || 0) * (parseFloat(sv.qty) || 1),
        }));
      });
    });
  });
  return out;
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export function HMSProvider({ children }) {
  // Deep clone so mutations don't affect the original import
  const [db, setDb] = useState(() => JSON.parse(JSON.stringify(LOCATION_DB)));

  /** Add a brand-new patient to a location */
  const addPatient = (locId, patient) => {
    setDb(prev => ({
      ...prev,
      [locId]: [...(prev[locId] || []), patient],
    }));
  };

  /** Add a new admission to an existing patient */
  const addAdmission = (locId, uhid, admission) => {
    setDb(prev => ({
      ...prev,
      [locId]: (prev[locId] || []).map(p =>
        p.uhid === uhid
          ? { ...p, admissions: [...(p.admissions || []), admission] }
          : p
      ),
    }));
  };

  /** Update any field on an existing patient */
  const updatePatient = (locId, uhid, updater) => {
    setDb(prev => ({
      ...prev,
      [locId]: (prev[locId] || []).map(p =>
        p.uhid === uhid ? updater(p) : p
      ),
    }));
  };

  /** Update a specific admission on a patient */
  const updateAdmission = (locId, uhid, admNo, updater) => {
    setDb(prev => ({
      ...prev,
      [locId]: (prev[locId] || []).map(p =>
        p.uhid === uhid
          ? {
              ...p,
              admissions: (p.admissions || []).map(a =>
                a.admNo === admNo ? updater(a) : a
              ),
            }
          : p
      ),
    }));
  };

  /** Approve an invoice (set billing on admission) */
  const approveInvoice = (locId, uhid, admNo) => {
    updateAdmission(locId, uhid, admNo, adm => ({
      ...adm,
      billing: {
        ...(adm.billing || {}),
        approvedBy: 'Super Admin',
        approvedAt: new Date().toISOString(),
      },
    }));
  };

  return (
    <HMSContext.Provider value={{
      db,
      setDb,
      addPatient,
      addAdmission,
      updatePatient,
      updateAdmission,
      approveInvoice,
    }}>
      {children}
    </HMSContext.Provider>
  );
}

export function useHMS() {
  const ctx = useContext(HMSContext);
  if (!ctx) throw new Error('useHMS must be used inside HMSProvider');
  return ctx;
}
