import { FamilyMember, TimelineEvent, HospitalConsent, ConsentAuditEntry, MedicalTask, ExpenseRecord, EmergencyContact, MedicalRecord, VitalRecord } from "@/types/family"

export const FAMILY_HEALTH_INDEX = 84

export const familyMembers: FamilyMember[] = [
  {
    id: "grandma",
    name: "Gayatri Sharma",
    age: 72,
    relation: "Grandmother",
    bloodGroup: "B+",
    initials: "GS",
    status: "critical",
    alertText: "FDA Implant Recall ZX-500",
    medicationCount: 3,
    lastCheckup: "2024-05-12",
    allergies: ["Penicillin", "Sulfa Drugs"],
    activeMedications: [
      { name: "Metoprolol", dose: "50mg", frequency: "1x Daily", category: "Beta Blocker" },
      { name: "Calcium", dose: "500mg", frequency: "1x Daily", category: "Supplement" },
      { name: "Atorvastatin", dose: "20mg", frequency: "Nightly", category: "Cholesterol" }
    ],
    implant: {
      name: "Hip Implant ZX-500",
      manufacturer: "OrthoTech",
      implantDate: "2023-06-15",
      expectedLifespan: 15,
      currentAge: 3,
      lotNumber: "ZX-2023-B",
      recallStatus: {
        active: true,
        id: "REC-2024-0891",
        agency: "FDA"
      }
    }
  },
  {
    id: "dad",
    name: "Rajesh Sharma",
    age: 45,
    relation: "Father",
    bloodGroup: "O+",
    initials: "RS",
    status: "warning",
    alertText: "Upcoming vaccine gap",
    medicationCount: 2,
    lastCheckup: "2024-04-18",
    allergies: ["Aspirin"],
    activeMedications: [
      { name: "Lisinopril", dose: "10mg", frequency: "1x Daily", category: "Blood Pressure" },
      { name: "Multivitamin", dose: "1 Tablet", frequency: "1x Daily", category: "Supplement" }
    ]
  },
  {
    id: "mom",
    name: "Priya Sharma",
    age: 42,
    relation: "Mother",
    bloodGroup: "A+",
    initials: "PS",
    status: "healthy",
    alertText: null,
    medicationCount: 1,
    lastCheckup: "2024-05-20",
    allergies: [],
    activeMedications: [
      { name: "Vitamin D3", dose: "2000 IU", frequency: "1x Daily", category: "Supplement" }
    ]
  },
  {
    id: "son",
    name: "Aarav Sharma",
    age: 8,
    relation: "Son",
    bloodGroup: "O+",
    initials: "AS",
    status: "healthy",
    alertText: null,
    medicationCount: 0,
    lastCheckup: "2024-02-15",
    allergies: ["Peanuts"],
    activeMedications: []
  }
]

export const timelineEvents: TimelineEvent[] = [
  {
    id: "e1",
    date: "2023-06-15",
    category: "surgery",
    title: "Hip Replacement Surgery",
    subtitle: "Total hip arthroplasty using OrthoTech ZX-500",
    doctor: "Dr. Mehta",
    hospital: "Apollo Medical Center",
    status: "completed",
    bodyLocation: "hip",
    notes: "Extensive tissue manipulation during implant placement. Active FDA recall #REC-2024-0891 is currently pending on this implant lot."
  },
  {
    id: "e2",
    date: "2023-06-15",
    category: "implant",
    title: "Implant ZX-500",
    subtitle: "Placed at left femur head and acetabulum",
    doctor: "Dr. Mehta",
    hospital: "Apollo Medical Center",
    status: "recalled",
    bodyLocation: "hip",
    notes: "OrthoTech lot #ZX-2023-B has shown abnormal degradation rates."
  },
  {
    id: "e3",
    date: "2023-06-14",
    category: "imaging",
    title: "Pre-Op Hip X-Ray",
    subtitle: "Left hip AP and lateral views",
    doctor: "Dr. Nair",
    hospital: "Apollo Radiology",
    status: "completed",
    bodyLocation: "hip",
    notes: "Severe joint space narrowing and subchondral sclerosis confirmed."
  },
  {
    id: "e4",
    date: "2024-03-01",
    category: "medication",
    title: "Beta Blocker Prescription",
    subtitle: "Metoprolol Succinate 50mg daily",
    doctor: "Dr. Sen",
    hospital: "Sharma Family Clinic",
    status: "active",
    notes: "Prescribed for blood pressure management."
  },
  {
    id: "e5",
    date: "2023-11-15",
    category: "vaccine",
    title: "Influenza Vaccine",
    subtitle: "Annual quadrivalent flu shot",
    doctor: "Nurse Patel",
    hospital: "Sharma Family Clinic",
    status: "completed"
  },
  {
    id: "e6",
    date: "2024-02-15",
    category: "vaccine",
    title: "MMR Booster",
    subtitle: "Aarav's primary school series",
    doctor: "Dr. Kapoor",
    hospital: "Pediatric Care Center",
    status: "completed"
  },
  {
    id: "e7",
    date: "2019-09-12",
    category: "surgery",
    title: "Laparoscopic Appendectomy",
    subtitle: "Emergency appendix extraction",
    doctor: "Dr. R. Patel",
    hospital: "City General Hospital",
    status: "completed",
    bodyLocation: "abdomen",
    notes: "Clean procedure, minimal scarring, resolved without complication."
  },
  {
    id: "e8",
    date: "2024-05-10",
    category: "lab",
    title: "Comprehensive Metabolic Panel",
    subtitle: "Blood glucose, kidney, liver profiles",
    doctor: "Dr. Sen",
    hospital: "Metropolis Diagnostics",
    status: "completed",
    notes: "Elevated fasting blood sugar (112 mg/dL) noted. Recommend nutritional consultation."
  },
  {
    id: "e9",
    date: "2015-04-20",
    category: "surgery",
    title: "Cataract Extraction",
    subtitle: "Left eye phacoemulsification with intraocular lens",
    doctor: "Dr. Gupta",
    hospital: "City Eye Clinic",
    status: "completed",
    bodyLocation: "eye",
    notes: "Successful visual restoration."
  }
]

export const hospitalConsents: HospitalConsent[] = [
  {
    hospitalId: "apollo",
    hospitalName: "Apollo Medical Center",
    permissions: {
      grandma: "full",
      dad: "full",
      mom: "readonly",
      son: "none"
    }
  },
  {
    hospitalId: "city-general",
    hospitalName: "City General Hospital",
    permissions: {
      grandma: "readonly",
      dad: "none",
      mom: "full",
      son: "none"
    }
  },
  {
    hospitalId: "metro",
    hospitalName: "Metro Hospital Group",
    permissions: {
      grandma: "none",
      dad: "emergency",
      mom: "none",
      son: "none"
    }
  }
]

export const consentAudits: ConsentAuditEntry[] = [
  {
    id: "a1",
    timestamp: "2026-06-04T10:12:00Z",
    member: "Gayatri Sharma",
    hospital: "Apollo Medical Center",
    action: "Authorize Full Access",
    actor: "Rajesh Sharma (Proxy)",
    previousLevel: "readonly",
    newLevel: "full"
  },
  {
    id: "a2",
    timestamp: "2026-06-03T14:45:00Z",
    member: "Aarav Sharma",
    hospital: "City General Hospital",
    action: "Revoke Access",
    actor: "Priya Sharma (Guardian)",
    previousLevel: "readonly",
    newLevel: "none"
  },
  {
    id: "a3",
    timestamp: "2026-05-28T09:15:00Z",
    member: "Rajesh Sharma",
    hospital: "Metro Hospital Group",
    action: "Restrict to Emergency Only",
    actor: "Rajesh Sharma",
    previousLevel: "readonly",
    newLevel: "emergency"
  }
]

export const medicalTasks: MedicalTask[] = [
  { id: "t1", title: "Metoprolol Morning Dose", memberId: "grandma", dueDate: "2026-06-04", category: "medication", completed: true },
  { id: "t2", title: "Verify Hip Scan Appt", memberId: "grandma", dueDate: "2026-06-04", category: "appointment", completed: false },
  { id: "t3", title: "Lisinopril Intake Check", memberId: "dad", dueDate: "2026-06-04", category: "medication", completed: true },
  { id: "t4", title: "Pre-operative Blood Typing", memberId: "grandma", dueDate: "2026-06-10", category: "lab", completed: false },
  { id: "t5", title: "Aarav Pediatric Dental Checkup", memberId: "son", dueDate: "2026-06-15", category: "appointment", completed: false }
]

export const expenseRecords: ExpenseRecord[] = [
  { id: "ex1", title: "Physiotherapy Session", memberId: "grandma", amount: 1500, date: "2026-06-01", category: "consultation", status: "paid" },
  { id: "ex2", title: "Monthly Medication Fill", memberId: "grandma", amount: 2850, date: "2026-05-28", category: "medication", status: "paid" },
  { id: "ex3", title: "Blood Pressure Med Refill", memberId: "dad", amount: 840, date: "2026-05-25", category: "medication", status: "paid" },
  { id: "ex4", title: "Orthopedic Surgical Consult Deposit", memberId: "grandma", amount: 12000, date: "2026-05-20", category: "surgery", status: "paid" },
  { id: "ex5", title: "Annual Family Insurance Premium", memberId: "dad", amount: 35000, date: "2026-05-15", category: "insurance", status: "paid" }
]

export const emergencyContacts: EmergencyContact[] = [
  { id: "c1", name: "Rajesh Sharma", relation: "Son / Father", phone: "+91 98765 43210", email: "rajesh@sharma.com" },
  { id: "c2", name: "Priya Sharma", relation: "Daughter-in-law / Mother", phone: "+91 98765 43211", email: "priya@sharma.com" },
  { id: "c3", name: "Apollo Emergency Room", relation: "Primary Care Hospital", phone: "+91 22 2654 4000" }
]

export const medicalRecords: MedicalRecord[] = [
  {
    id: "r1",
    title: "Hip Revision Plan & MRI Scans",
    category: "imaging",
    fileName: "gayatri_sharma_mri_hip_2024.pdf",
    fileSize: "4.8 MB",
    uploadedBy: "Apollo Orthopedics",
    uploadedAt: "2024-11-20",
    doctorName: "Dr. Mehta",
    hospitalName: "Apollo Medical Center",
    notes: "MRI of left hip joint reveals severe bony degradation and capsule thickness."
  },
  {
    id: "r2",
    title: "Cardiology Clearance Report",
    category: "lab",
    fileName: "cardio_clearance_june2024.pdf",
    fileSize: "1.2 MB",
    uploadedBy: "Sharma Family Clinic",
    uploadedAt: "2024-06-10",
    doctorName: "Dr. Sen",
    hospitalName: "Sharma Family Clinic",
    notes: "Patient cleared for revision hip arthroplasty under general anesthesia."
  },
  {
    id: "r3",
    title: "Post-Op Appendectomy Discharge Summaries",
    category: "surgery",
    fileName: "discharge_summary_rajesh_2019.pdf",
    fileSize: "2.1 MB",
    uploadedBy: "City General Hospital",
    uploadedAt: "2019-09-15",
    doctorName: "Dr. R. Patel",
    hospitalName: "City General Hospital",
    notes: "Standard post-operative recovery, no follow-up anomalies observed."
  }
]

export const vitalsHistory: Record<string, VitalRecord[]> = {
  grandma: [
    { timestamp: "10:00 AM", systolic: 135, diastolic: 85, heartRate: 78, temperature: 98.4, bloodSugar: 120, oxygenLevel: 97 },
    { timestamp: "12:00 PM", systolic: 138, diastolic: 88, heartRate: 82, temperature: 98.6, bloodSugar: 145, oxygenLevel: 96 },
    { timestamp: "02:00 PM", systolic: 142, diastolic: 92, heartRate: 85, temperature: 98.7, bloodSugar: 130, oxygenLevel: 96 },
    { timestamp: "04:00 PM", systolic: 136, diastolic: 86, heartRate: 79, temperature: 98.5, bloodSugar: 110, oxygenLevel: 98 },
    { timestamp: "06:00 PM", systolic: 134, diastolic: 84, heartRate: 75, temperature: 98.3, bloodSugar: 115, oxygenLevel: 99 }
  ],
  dad: [
    { timestamp: "10:00 AM", systolic: 122, diastolic: 80, heartRate: 72, temperature: 98.6, bloodSugar: 95, oxygenLevel: 99 },
    { timestamp: "12:00 PM", systolic: 124, diastolic: 81, heartRate: 74, temperature: 98.5, bloodSugar: 110, oxygenLevel: 98 },
    { timestamp: "02:00 PM", systolic: 121, diastolic: 79, heartRate: 70, temperature: 98.6, bloodSugar: 90, oxygenLevel: 99 },
    { timestamp: "04:00 PM", systolic: 125, diastolic: 82, heartRate: 76, temperature: 98.8, bloodSugar: 85, oxygenLevel: 99 },
    { timestamp: "06:00 PM", systolic: 120, diastolic: 78, heartRate: 68, temperature: 98.4, bloodSugar: 92, oxygenLevel: 100 }
  ],
  mom: [
    { timestamp: "10:00 AM", systolic: 115, diastolic: 75, heartRate: 65, temperature: 98.1, bloodSugar: 88, oxygenLevel: 99 },
    { timestamp: "12:00 PM", systolic: 118, diastolic: 77, heartRate: 68, temperature: 98.2, bloodSugar: 98, oxygenLevel: 99 },
    { timestamp: "02:00 PM", systolic: 116, diastolic: 76, heartRate: 66, temperature: 98.2, bloodSugar: 92, oxygenLevel: 99 },
    { timestamp: "04:00 PM", systolic: 119, diastolic: 78, heartRate: 70, temperature: 98.4, bloodSugar: 85, oxygenLevel: 99 },
    { timestamp: "06:00 PM", systolic: 114, diastolic: 74, heartRate: 64, temperature: 98.0, bloodSugar: 90, oxygenLevel: 100 }
  ],
  son: [
    { timestamp: "10:00 AM", systolic: 100, diastolic: 62, heartRate: 85, temperature: 98.5, bloodSugar: 80, oxygenLevel: 100 },
    { timestamp: "12:00 PM", systolic: 102, diastolic: 64, heartRate: 88, temperature: 98.4, bloodSugar: 95, oxygenLevel: 99 },
    { timestamp: "02:00 PM", systolic: 98, diastolic: 60, heartRate: 82, temperature: 98.5, bloodSugar: 85, oxygenLevel: 100 },
    { timestamp: "04:00 PM", systolic: 104, diastolic: 65, heartRate: 90, temperature: 98.6, bloodSugar: 78, oxygenLevel: 99 },
    { timestamp: "06:00 PM", systolic: 101, diastolic: 63, heartRate: 84, temperature: 98.2, bloodSugar: 82, oxygenLevel: 100 }
  ]
}
