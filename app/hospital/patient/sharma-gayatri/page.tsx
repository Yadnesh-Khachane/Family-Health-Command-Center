"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

// Hardcoded patient data for Gayatri Sharma
const patientData = {
  name: "Gayatri Sharma",
  initials: "GS",
  age: 72,
  dob: "March 15, 1952",
  gender: "Female",
  bloodGroup: "B+",
  emergencyContact: {
    name: "Ravi Sharma",
    relation: "Son",
    phone: "+91-98765-XXXXX",
  },
  allergies: ["Penicillin", "Sulfa Drugs"],
  activeAlerts: [
    {
      type: "recall",
      message: "Implant Recall — Hip Implant ZX-500",
    },
  ],
};

const surgicalHistory = [
  {
    id: 1,
    year: 2023,
    procedure: "Hip Replacement",
    details: "Titanium Implant ZX-500",
    location: "hip",
    surgeon: "Dr. Mehta",
    notes:
      "Extensive tissue manipulation during implant placement. Recommend pre-operative imaging to map adhesion locations.",
  },
  {
    id: 2,
    year: 2019,
    procedure: "Appendectomy",
    details: "Laparoscopic removal",
    location: "abdomen",
    surgeon: "Dr. Patel",
    notes: "Clean procedure, minimal scarring expected.",
  },
  {
    id: 3,
    year: 2015,
    procedure: "Cataract Surgery",
    details: "Left eye lens replacement",
    location: "eye",
    surgeon: "Dr. Gupta",
    notes: "Successful IOL implantation.",
  },
];

const patientMedications = [
  { name: "Metoprolol", dose: "50mg", type: "Beta Blocker", frequency: "Daily" },
  { name: "Calcium", dose: "500mg", type: "Supplement", frequency: "Daily" },
];

const householdMedications = [
  {
    name: "Methylphenidate",
    dose: "10mg",
    type: "ADHD Medication",
    member: "Grandson (Arjun)",
  },
];

const implantData = {
  name: "Hip Implant ZX-500",
  manufacturer: "OrthoTech",
  implantDate: "2023",
  expectedLifespan: 15,
  currentAge: 3,
  lotNumber: "ZX-2023-B",
  recallStatus: {
    active: true,
    id: "REC-2024-0891",
    agency: "FDA",
  },
};

const recentActivity = [
  { date: "Nov 2024", event: "Annual Checkup", type: "visit" },
  { date: "Oct 2024", event: "Blood Work Panel", type: "lab" },
  { date: "Aug 2024", event: "Hip X-Ray Follow-up", type: "imaging" },
  { date: "Jun 2024", event: "Cardiology Consultation", type: "visit" },
  { date: "Mar 2024", event: "Medication Review", type: "medication" },
];

export default function PatientDetailPage() {
  const [hoveredSurgery, setHoveredSurgery] = useState<number | null>(null);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [exportingEmr, setExportingEmr] = useState(false);

  const handleDownloadPdf = () => {
    setDownloadingPdf(true);
    setTimeout(() => setDownloadingPdf(false), 2000);
  };

  const handleExportEmr = () => {
    setExportingEmr(true);
    setTimeout(() => setExportingEmr(false), 2000);
  };

  const adhesionRisk = 78;
  const adhesionAngle = (adhesionRisk / 100) * 180;

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#FAF9F6] relative">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Sticky Top Bar */}
      <header className="sticky top-0 z-50 frosted-glass px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            href="/hospital/dashboard"
            className="flex items-center gap-2 text-[#F5A623] hover:text-[#E85D3A] transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span className="font-medium">Back to Dashboard</span>
          </Link>

          <div className="text-center">
            <h1 className="font-heading text-2xl font-semibold">
              {patientData.name}
            </h1>
            <p className="text-sm text-[#FAF9F6]/60">
              Age {patientData.age} &bull; {patientData.gender} &bull; Blood
              Group {patientData.bloodGroup}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadPdf}
              className="px-4 py-2 border border-[#E85D3A] text-[#E85D3A] rounded-lg hover:bg-[#E85D3A]/10 transition-colors text-sm font-medium"
            >
              {downloadingPdf ? "Generating..." : "Download Handoff PDF"}
            </button>
            <button
              onClick={handleExportEmr}
              className="px-4 py-2 border border-[#F5A623] text-[#F5A623] rounded-lg hover:bg-[#F5A623]/10 transition-colors text-sm font-medium"
            >
              {exportingEmr ? "Exporting..." : "Export to EMR"}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8 pb-32 space-y-8 relative z-10">
        {/* Section 1: Patient Header Card */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="frosted-panel rounded-2xl p-6"
        >
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#F5A623] to-[#E85D3A] flex items-center justify-center flex-shrink-0">
              <span className="text-3xl font-heading font-bold text-[#0D0D0D]">
                {patientData.initials}
              </span>
            </div>

            {/* Demographics */}
            <div className="flex-1 grid grid-cols-3 gap-6">
              <div>
                <h3 className="text-sm text-[#FAF9F6]/60 mb-1">Full Name</h3>
                <p className="font-medium">{patientData.name}</p>
              </div>
              <div>
                <h3 className="text-sm text-[#FAF9F6]/60 mb-1">Date of Birth</h3>
                <p className="font-medium">{patientData.dob}</p>
              </div>
              <div>
                <h3 className="text-sm text-[#FAF9F6]/60 mb-1">Blood Group</h3>
                <p className="font-medium">{patientData.bloodGroup}</p>
              </div>
              <div className="col-span-3">
                <h3 className="text-sm text-[#FAF9F6]/60 mb-1">
                  Emergency Contact
                </h3>
                <p className="font-medium">
                  {patientData.emergencyContact.name} (
                  {patientData.emergencyContact.relation}) —{" "}
                  {patientData.emergencyContact.phone}
                </p>
              </div>
            </div>

            {/* Allergies */}
            <div className="flex-shrink-0">
              <h3 className="text-sm text-[#FAF9F6]/60 mb-2">Allergies</h3>
              <div className="flex gap-2">
                {patientData.allergies.map((allergy) => (
                  <span
                    key={allergy}
                    className="px-3 py-1 bg-[#D72638]/20 text-[#D72638] rounded-full text-sm font-medium"
                  >
                    {allergy}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Active Alerts */}
          {patientData.activeAlerts.length > 0 && (
            <div className="mt-6">
              {patientData.activeAlerts.map((alert, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 px-4 py-3 bg-[#D72638]/20 border border-[#D72638]/40 rounded-lg critical-blink"
                >
                  <svg
                    className="w-5 h-5 text-[#D72638]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-medium text-[#D72638]">
                    {alert.message}
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.section>

        {/* Section 2: Surgical Advisory Panel */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-2xl p-6 border-2 border-[#F5A623]/30"
          style={{
            background:
              "linear-gradient(135deg, rgba(245, 166, 35, 0.1) 0%, rgba(26, 26, 26, 0.8) 100%)",
            backdropFilter: "blur(12px)",
          }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-[#F5A623]/20 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-[#F5A623]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-heading font-semibold text-[#F5A623]">
                Before You Operate — Surgical Advisory Panel
              </h2>
              <p className="text-sm text-[#FAF9F6]/60">
                Critical pre-operative information
              </p>
            </div>
          </div>

          {/* Lifetime Anatomical Timeline */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-[#FAF9F6]/80 mb-4">
              Lifetime Anatomical Timeline
            </h3>
            <div className="flex gap-8">
              {/* Body Outline with Markers */}
              <div className="relative w-48 h-80 flex-shrink-0">
                <svg viewBox="0 0 100 180" className="w-full h-full">
                  {/* Simple body outline */}
                  <ellipse
                    cx="50"
                    cy="20"
                    rx="15"
                    ry="18"
                    fill="none"
                    stroke="#FAF9F6"
                    strokeWidth="1"
                    opacity="0.3"
                  />
                  <path
                    d="M35 38 L30 80 L20 85 L30 85 L35 120 L40 170 L45 170 L50 130 L55 170 L60 170 L65 120 L70 85 L80 85 L70 80 L65 38"
                    fill="none"
                    stroke="#FAF9F6"
                    strokeWidth="1"
                    opacity="0.3"
                  />

                  {/* Surgical markers */}
                  {/* Eye - Cataract */}
                  <circle
                    cx="42"
                    cy="15"
                    r="4"
                    fill={hoveredSurgery === 3 ? "#F5A623" : "#7FB069"}
                    className="cursor-pointer transition-colors"
                    onMouseEnter={() => setHoveredSurgery(3)}
                    onMouseLeave={() => setHoveredSurgery(null)}
                  />
                  <text
                    x="42"
                    y="17"
                    textAnchor="middle"
                    fill="#0D0D0D"
                    fontSize="6"
                    fontWeight="bold"
                  >
                    3
                  </text>

                  {/* Abdomen - Appendectomy */}
                  <circle
                    cx="60"
                    cy="90"
                    r="5"
                    fill={hoveredSurgery === 2 ? "#F5A623" : "#7FB069"}
                    className="cursor-pointer transition-colors"
                    onMouseEnter={() => setHoveredSurgery(2)}
                    onMouseLeave={() => setHoveredSurgery(null)}
                  />
                  <text
                    x="60"
                    y="92"
                    textAnchor="middle"
                    fill="#0D0D0D"
                    fontSize="6"
                    fontWeight="bold"
                  >
                    2
                  </text>

                  {/* Hip - Replacement */}
                  <circle
                    cx="65"
                    cy="115"
                    r="6"
                    fill={hoveredSurgery === 1 ? "#F5A623" : "#D72638"}
                    className="cursor-pointer transition-colors"
                    onMouseEnter={() => setHoveredSurgery(1)}
                    onMouseLeave={() => setHoveredSurgery(null)}
                  />
                  <text
                    x="65"
                    y="118"
                    textAnchor="middle"
                    fill="#FAF9F6"
                    fontSize="7"
                    fontWeight="bold"
                  >
                    1
                  </text>
                </svg>

                {/* Tooltip */}
                {hoveredSurgery && (
                  <div className="absolute top-0 left-52 w-64 p-3 bg-[#1A1A1A] border border-[#F5A623]/30 rounded-lg shadow-xl z-10">
                    <p className="text-sm font-medium text-[#F5A623]">
                      {surgicalHistory.find((s) => s.id === hoveredSurgery)?.procedure}
                    </p>
                    <p className="text-xs text-[#FAF9F6]/60 mt-1">
                      {surgicalHistory.find((s) => s.id === hoveredSurgery)?.year} —{" "}
                      {surgicalHistory.find((s) => s.id === hoveredSurgery)?.details}
                    </p>
                    <p className="text-xs text-[#FAF9F6]/80 mt-2">
                      {surgicalHistory.find((s) => s.id === hoveredSurgery)?.notes}
                    </p>
                  </div>
                )}
              </div>

              {/* Timeline */}
              <div className="flex-1">
                <div className="flex items-center gap-4 overflow-x-auto pb-4">
                  {surgicalHistory
                    .sort((a, b) => a.year - b.year)
                    .map((surgery, idx) => (
                      <div
                        key={surgery.id}
                        className="flex flex-col items-center flex-shrink-0"
                        onMouseEnter={() => setHoveredSurgery(surgery.id)}
                        onMouseLeave={() => setHoveredSurgery(null)}
                      >
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-all ${
                            hoveredSurgery === surgery.id
                              ? "bg-[#F5A623] scale-110"
                              : surgery.id === 1
                                ? "bg-[#D72638]"
                                : "bg-[#7FB069]"
                          }`}
                        >
                          <span className="text-sm font-bold text-[#FAF9F6]">
                            {surgery.id}
                          </span>
                        </div>
                        <div className="mt-2 text-center">
                          <p className="text-sm font-medium">{surgery.year}</p>
                          <p className="text-xs text-[#FAF9F6]/60 max-w-[100px]">
                            {surgery.procedure}
                          </p>
                        </div>
                        {idx < surgicalHistory.length - 1 && (
                          <div className="absolute w-8 h-0.5 bg-[#F5A623]/30 left-full top-6 hidden md:block" />
                        )}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>

          {/* Adhesion Risk Meter */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-medium text-[#FAF9F6]/80 mb-4">
                Adhesion Risk Assessment
              </h3>
              <div className="flex items-center gap-6">
                <div className="relative w-40 h-20">
                  <svg viewBox="0 0 100 50" className="w-full h-full">
                    {/* Background arc */}
                    <path
                      d="M 10 50 A 40 40 0 0 1 90 50"
                      fill="none"
                      stroke="#2A2A2A"
                      strokeWidth="8"
                      strokeLinecap="round"
                    />
                    {/* Gradient arc */}
                    <defs>
                      <linearGradient
                        id="riskGradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop offset="0%" stopColor="#F5A623" />
                        <stop offset="50%" stopColor="#E85D3A" />
                        <stop offset="100%" stopColor="#D72638" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 10 50 A 40 40 0 0 1 90 50"
                      fill="none"
                      stroke="url(#riskGradient)"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${(adhesionAngle / 180) * 126} 126`}
                    />
                    {/* Needle */}
                    <line
                      x1="50"
                      y1="50"
                      x2={50 + 30 * Math.cos((Math.PI * (180 - adhesionAngle)) / 180)}
                      y2={50 - 30 * Math.sin((Math.PI * (180 - adhesionAngle)) / 180)}
                      stroke="#FAF9F6"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <circle cx="50" cy="50" r="4" fill="#FAF9F6" />
                  </svg>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
                    <span className="text-2xl font-heading font-bold text-[#D72638]">
                      {adhesionRisk}
                    </span>
                    <span className="text-sm text-[#FAF9F6]/60">/100</span>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-[#D72638] font-medium">High Adhesion Risk</p>
                  <p className="text-sm text-[#FAF9F6]/60 mt-1">
                    Multiple entries through same anatomical zone
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm text-[#FAF9F6]/70 bg-[#D72638]/10 border border-[#D72638]/20 rounded-lg p-3">
                Surgeon caution advised. Probabilistic scar tissue map suggests
                adhesions in lower quadrant.
              </p>
            </div>

            {/* Previous Surgical Notes */}
            <div>
              <h3 className="text-sm font-medium text-[#FAF9F6]/80 mb-4">
                Previous Surgical Notes Summary
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-[#1A1A1A]/50 rounded-lg border border-[#F5A623]/10">
                  <p className="text-sm">
                    <span className="text-[#F5A623] font-medium">2023:</span>{" "}
                    Dr. Mehta noted extensive tissue manipulation during implant
                    placement.
                  </p>
                </div>
                <div className="p-3 bg-[#1A1A1A]/50 rounded-lg border border-[#F5A623]/10">
                  <p className="text-sm">
                    <span className="text-[#F5A623] font-medium">
                      Recommendation:
                    </span>{" "}
                    Pre-operative imaging to map adhesion locations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Section 3: Medication Reconciliation */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="frosted-panel rounded-2xl p-6"
        >
          <h2 className="text-xl font-heading font-semibold mb-6">
            Medication Reconciliation
          </h2>

          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Patient Medications */}
            <div>
              <h3 className="text-sm font-medium text-[#FAF9F6]/80 mb-3">
                Patient Medications
              </h3>
              <div className="space-y-2">
                {patientMedications.map((med) => (
                  <div
                    key={med.name}
                    className="flex items-center justify-between p-3 bg-[#1A1A1A]/50 rounded-lg border border-[#F5A623]/10"
                  >
                    <div>
                      <p className="font-medium">
                        {med.name} {med.dose}
                      </p>
                      <p className="text-sm text-[#FAF9F6]/60">{med.type}</p>
                    </div>
                    <span className="text-sm text-[#7FB069]">{med.frequency}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Household Medications */}
            <div>
              <h3 className="text-sm font-medium text-[#FAF9F6]/80 mb-3">
                Household Medications
              </h3>
              <div className="space-y-2">
                {householdMedications.map((med) => (
                  <div
                    key={med.name}
                    className="flex items-center justify-between p-3 bg-[#1A1A1A]/50 rounded-lg border border-[#F5A623]/10"
                  >
                    <div>
                      <p className="font-medium">
                        {med.name} {med.dose}
                      </p>
                      <p className="text-sm text-[#FAF9F6]/60">{med.type}</p>
                    </div>
                    <span className="text-sm text-[#FAF9F6]/60">{med.member}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Interaction Warning */}
          <div className="flex items-start gap-3 p-4 bg-[#D4A017]/20 border border-[#D4A017]/40 rounded-lg">
            <svg
              className="w-6 h-6 text-[#D4A017] flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="font-medium text-[#D4A017]">
                Cross-Household Interaction Risk
              </p>
              <p className="text-sm text-[#FAF9F6]/80 mt-1">
                Beta-blocker + stimulant may cause irregular heart response.
                Monitor during shared meals.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Section 4: Implant Registry */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="frosted-panel rounded-2xl p-6"
        >
          <h2 className="text-xl font-heading font-semibold mb-6">
            Implant Registry
          </h2>

          <div className="p-4 bg-[#1A1A1A]/50 rounded-lg border border-[#D72638]/30">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="font-heading font-semibold text-lg">
                  {implantData.name}
                </p>
                <p className="text-sm text-[#FAF9F6]/60">
                  {implantData.manufacturer}
                </p>
              </div>
              <button className="px-4 py-2 bg-[#D72638] text-white rounded-lg hover:bg-[#D72638]/80 transition-colors text-sm font-medium">
                Flag for Replacement Review
              </button>
            </div>

            <div className="grid grid-cols-3 gap-6 mb-4">
              <div>
                <p className="text-sm text-[#FAF9F6]/60">Implant Date</p>
                <p className="font-medium">{implantData.implantDate}</p>
              </div>
              <div>
                <p className="text-sm text-[#FAF9F6]/60">Lot Number</p>
                <p className="font-medium">{implantData.lotNumber}</p>
              </div>
              <div>
                <p className="text-sm text-[#FAF9F6]/60">Recall Status</p>
                <p className="font-medium text-[#D72638]">
                  {implantData.recallStatus.agency} Recall #
                  {implantData.recallStatus.id} — ACTIVE
                </p>
              </div>
            </div>

            {/* Lifespan Progress */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-[#FAF9F6]/60">Expected Lifespan</p>
                <p className="text-sm">
                  {implantData.currentAge} / {implantData.expectedLifespan} years
                </p>
              </div>
              <div className="h-3 bg-[#2A2A2A] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#F5A623] to-[#E85D3A] rounded-full transition-all"
                  style={{
                    width: `${(implantData.currentAge / implantData.expectedLifespan) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </motion.section>

        {/* Section 5: Recent Activity */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="frosted-panel rounded-2xl p-6"
        >
          <h2 className="text-xl font-heading font-semibold mb-6">
            Recent Activity
          </h2>

          <div className="space-y-3">
            {recentActivity.map((activity, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 p-3 bg-[#1A1A1A]/50 rounded-lg border border-[#F5A623]/10"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    activity.type === "visit"
                      ? "bg-[#7FB069]/20"
                      : activity.type === "lab"
                        ? "bg-[#F5A623]/20"
                        : activity.type === "imaging"
                          ? "bg-[#E85D3A]/20"
                          : "bg-[#D4A017]/20"
                  }`}
                >
                  {activity.type === "visit" && (
                    <svg
                      className="w-5 h-5 text-[#7FB069]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  )}
                  {activity.type === "lab" && (
                    <svg
                      className="w-5 h-5 text-[#F5A623]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                      />
                    </svg>
                  )}
                  {activity.type === "imaging" && (
                    <svg
                      className="w-5 h-5 text-[#E85D3A]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  )}
                  {activity.type === "medication" && (
                    <svg
                      className="w-5 h-5 text-[#D4A017]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{activity.event}</p>
                </div>
                <span className="text-sm text-[#FAF9F6]/60">{activity.date}</span>
              </div>
            ))}
          </div>
        </motion.section>
      </main>

      {/* Sticky Footer Actions */}
      <footer className="fixed bottom-0 left-0 right-0 frosted-glass px-6 py-4 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-4">
          <button
            onClick={handleDownloadPdf}
            className="px-6 py-3 bg-[#E85D3A] text-white rounded-lg hover:bg-[#E85D3A]/80 transition-colors font-medium warm-glow"
          >
            {downloadingPdf ? "Generating..." : "Download Emergency Handoff PDF"}
          </button>
          <button
            onClick={handleExportEmr}
            className="px-6 py-3 border border-[#F5A623] text-[#F5A623] rounded-lg hover:bg-[#F5A623]/10 transition-colors font-medium"
          >
            {exportingEmr ? "Exporting..." : "Export to Hospital EMR"}
          </button>
          <button className="px-6 py-3 border border-[#F5A623] text-[#F5A623] rounded-lg hover:bg-[#F5A623]/10 transition-colors font-medium">
            Request Full Family Access
          </button>
        </div>
      </footer>
    </div>
  );
}
