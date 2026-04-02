import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api';

export const apiService = {
  // 1. Core Patient Setup
  getPatients: async () => (await axios.get(`${BASE_URL}/patients/`)).data,
  registerPatient: async (data) => (await axios.post(`${BASE_URL}/patients/`, data)).data,
  newAdmission: async (uhid) => (await axios.post(`${BASE_URL}/patients/${uhid}/new_admission/`)).data,

  // 2. Fetch Master Data for Dropdowns
  getServiceMaster: async () => (await axios.get(`${BASE_URL}/service-master/`)).data,

  // 3. Clinical Actions (Requires admNo in body)
  updateMedicalHistory: async (uhid, admNo, medicalData) =>
    (await axios.patch(`${BASE_URL}/patients/${uhid}/update_medical/`, { admNo, medicalData })).data,
  addService: async (uhid, admNo, serviceData) =>
    (await axios.post(`${BASE_URL}/patients/${uhid}/add_service/`, { admNo, serviceData })).data,
  dischargePatient: async (uhid, admNo, dischargeData) =>
    (await axios.patch(`${BASE_URL}/patients/${uhid}/discharge/`, { admNo, dischargeData })).data,
  updateBilling: async (uhid, admNo, billingData) =>
    (await axios.patch(`${BASE_URL}/patients/${uhid}/update_billing/`, { admNo, billingData })).data,
};
