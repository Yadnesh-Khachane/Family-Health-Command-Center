"use client"

import React, { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { 
  ArrowLeft, 
  AlertOctagon, 
  QrCode, 
  PhoneCall, 
  FileText, 
  Heart,
  Droplet,
  ShieldAlert
} from "lucide-react"

import { familyMembers, emergencyContacts } from "@/lib/mock-data/mockData"
import { fadeInUp, staggerContainer } from "@/components/family/animations"

export default function EmergencyPage() {
  const [selectedMember, setSelectedMember] = useState(familyMembers[0].id)
  const activeMember = familyMembers.find(m => m.id === selectedMember) || familyMembers[0]

  return (
    <main className="max-w-[1200px] mx-auto px-6 py-8 space-y-8 select-none">
      {/* Back button */}
      <div>
        <Link href="/family/dashboard" className="flex items-center gap-2 text-xs text-ivory/60 hover:text-amber font-semibold uppercase tracking-wider transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Command Center
        </Link>
      </div>

      {/* Emergency Header */}
      <div className="p-6 rounded-3xl border-2 border-destructive bg-destructive/10 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-destructive/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center gap-4 z-10">
          <div className="w-12 h-12 rounded-full bg-destructive flex items-center justify-center critical-blink">
            <AlertOctagon className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-black text-destructive tracking-wider uppercase">
              Emergency Care Packet
            </h2>
            <p className="text-xs text-white/70 mt-0.5">High-contrast accessibility mode for first responders &amp; clinic handoffs.</p>
          </div>
        </div>

        <button className="px-5 py-2.5 rounded-full bg-destructive hover:bg-destructive-dark text-white font-bold text-xs uppercase tracking-wider transition-colors z-10">
          Print Emergency PDF
        </button>
      </div>

      {/* Member Selector buttons */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {familyMembers.map(m => (
          <button
            key={m.id}
            onClick={() => setSelectedMember(m.id)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors border ${
              selectedMember === m.id
                ? "bg-destructive border-destructive text-white"
                : "bg-white/5 border-white/10 text-ivory hover:text-white"
            }`}
          >
            {m.name} ({m.initials})
          </button>
        ))}
      </div>

      {/* Grid: Packet data */}
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-12 gap-8"
      >
        {/* Left Column: Member Medical dossier summaries */}
        <motion.div variants={fadeInUp} className="lg:col-span-8 space-y-6">
          <div className="frosted-panel rounded-3xl p-6 border-2 border-destructive/20 bg-charcoal/50 space-y-6">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <div>
                <h3 className="font-[family-name:var(--font-space-grotesk)] text-lg font-black text-white">
                  {activeMember.name}
                </h3>
                <p className="text-xs text-white/50">{activeMember.relation} • Age {activeMember.age}</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-destructive/20 border border-destructive/30 rounded-xl text-destructive font-black text-sm">
                <Droplet className="w-4 h-4 fill-destructive" />
                BLOOD: {activeMember.bloodGroup}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Critical Allergies */}
              <div className="p-4 rounded-2xl bg-destructive/5 border border-destructive/20 space-y-2">
                <span className="text-[10px] uppercase tracking-wider text-destructive font-black">Allergies &amp; Reactions</span>
                <p className="text-sm font-bold text-white">
                  {activeMember.allergies.length > 0 ? activeMember.allergies.join(", ") : "No Known Allergies"}
                </p>
              </div>

              {/* Vital Medications */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <span className="text-[10px] uppercase tracking-wider text-white/40 font-bold">Essential Medications</span>
                <ul className="text-xs font-semibold text-white/80 space-y-1">
                  {activeMember.activeMedications.length > 0 ? (
                    activeMember.activeMedications.map((m, i) => (
                      <li key={i} className="flex justify-between">
                        <span>{m.name} ({m.dose})</span>
                        <span className="text-amber">{m.frequency}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-white/40 italic">No daily prescriptions logged.</li>
                  )}
                </ul>
              </div>
            </div>

            {/* Implants & Surgical surveillance */}
            {activeMember.implant && (
              <div className="p-4 rounded-2xl bg-warning/5 border border-warning/20 space-y-2">
                <span className="text-[10px] uppercase tracking-wider text-warning font-black">Active Surgical Implants</span>
                <p className="text-xs font-bold text-white">{activeMember.implant.name} ({activeMember.implant.manufacturer})</p>
                <p className="text-[10px] text-white/70">
                  Date: {activeMember.implant.implantDate} • Lot Number: <span className="font-mono">{activeMember.implant.lotNumber}</span>
                </p>
                {activeMember.implant.recallStatus?.active && (
                  <p className="text-[10px] text-destructive font-bold mt-2 animate-pulse uppercase tracking-wide">
                    ⚠️ Recall Issued: {activeMember.implant.recallStatus.agency} #{activeMember.implant.recallStatus.id}
                  </p>
                )}
              </div>
            )}
          </div>
        </motion.div>

        {/* Right Column: QR Handoff & Quick Dial */}
        <motion.div variants={fadeInUp} className="lg:col-span-4 space-y-6">
          {/* Quick Handoff QR */}
          <div className="frosted-panel rounded-3xl p-6 border border-white/10 flex flex-col items-center justify-center text-center space-y-4">
            <QrCode className="w-36 h-36 text-white" />
            <div>
              <h4 className="font-[family-name:var(--font-space-grotesk)] text-sm font-black text-white uppercase tracking-wider">
                Emergency Scan Key
              </h4>
              <p className="text-[10px] text-white/50 mt-1 max-w-xs leading-relaxed">
                Scan with any ambulance portal device to extract encrypted EMR histories and log access triggers.
              </p>
            </div>
          </div>

          {/* Quick Call */}
          <div className="frosted-panel rounded-3xl p-6 border border-white/5 space-y-4">
            <h4 className="text-xs uppercase tracking-wider text-white/40 font-bold">Emergency Contacts</h4>
            <div className="space-y-2">
              {emergencyContacts.map(c => (
                <div key={c.id} className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                  <div>
                    <span className="text-[8px] uppercase tracking-wide text-amber font-semibold">{c.relation}</span>
                    <p className="text-xs font-bold text-white">{c.name}</p>
                    <p className="text-[10px] font-mono text-white/60 mt-0.5">{c.phone}</p>
                  </div>
                  <a href={`tel:${c.phone}`} className="p-2.5 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive hover:bg-destructive hover:text-white transition-all">
                    <PhoneCall className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </main>
  )
}
