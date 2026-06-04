export type HealthStatus = "healthy" | "warning" | "critical"

export type EventCategory =
  | "imaging"
  | "surgery"
  | "vaccine"
  | "medication"
  | "implant"
  | "lab"
  | "device"
  | "diagnosis"

export interface VitalRecord {
  timestamp: string
  systolic: number
  diastolic: number
  heartRate: number
  temperature: number
  bloodSugar?: number
  oxygenLevel?: number
}

export interface MedicalRecord {
  id: string
  title: string
  category: EventCategory
  fileName: string
  fileSize: string
  uploadedBy: string
  uploadedAt: string
  doctorName: string
  hospitalName: string
  notes?: string
}

export interface TimelineEvent {
  id: string
  date: string
  category: EventCategory
  title: string
  subtitle: string
  doctor: string
  hospital: string
  notes?: string
  status: "completed" | "scheduled" | "active" | "recalled"
  bodyLocation?: string
}

export interface FamilyMember {
  id: string
  name: string
  age: number
  relation: string
  bloodGroup: string
  initials: string
  status: HealthStatus
  alertText: string | null
  medicationCount: number
  lastCheckup: string
  allergies: string[]
  activeMedications: Array<{
    name: string
    dose: string
    frequency: string
    category: string
  }>
  implant?: {
    name: string
    manufacturer: string
    implantDate: string
    expectedLifespan: number
    currentAge: number
    lotNumber: string
    recallStatus: {
      active: boolean
      id: string
      agency: string
    } | null
  }
}

export type AccessLevel = "none" | "readonly" | "full" | "emergency"

export interface HospitalConsent {
  hospitalId: string
  hospitalName: string
  permissions: Record<string, AccessLevel> // memberId -> AccessLevel
}

export interface ConsentAuditEntry {
  id: string
  timestamp: string
  member: string
  hospital: string
  action: string
  actor: string
  previousLevel: AccessLevel
  newLevel: AccessLevel
}

export interface MedicalTask {
  id: string
  title: string
  memberId: string
  dueDate: string
  category: "medication" | "appointment" | "lab" | "other"
  completed: boolean
}

export interface ExpenseRecord {
  id: string
  title: string
  memberId: string
  amount: number
  date: string
  category: "consultation" | "medication" | "surgery" | "insurance"
  status: "paid" | "pending"
}

export interface EmergencyContact {
  id: string
  name: string
  relation: string
  phone: string
  email?: string
}
