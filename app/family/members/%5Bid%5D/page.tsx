"use client"

import React, { use } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { motion } from "framer-motion"
import { 
  ArrowLeft, 
  Activity, 
  Heart, 
  Thermometer, 
  ShieldAlert, 
  FileText, 
  Download, 
  ExternalLink,
  ShieldCheck
} from "lucide-react"

import { 
  familyMembers, 
  timelineEvents, 
  hospitalConsents, 
  vitalsHistory, 
  medicalRecords 
} from "@/lib/mock-data/mockData"
import { BodyMap } from "@/components/family/BodyMap"
import { StatusOrb } from "@/components/family/StatusOrb"
import { RiskGauge } from "@/components/family/RiskGauge"

// Recharts components for vitals trend
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts"

interface MemberPageProps {
  params: Promise<{ id: string }>
}

export default function MemberProfilePage({ params }: MemberPageProps) {
  const { id } = use(params)
  const member = familyMembers.find(m => m.id === id)

  if (!member) {
    notFound()
  }

  // Filter events belonging to this family member
  const memberEvents = timelineEvents.filter(evt => {
    if (member.id === "grandma" && evt.id.match(/e1|e2|e3|e4|e8|e9/)) return true
    if (member.id === "dad" && evt.id.match(/e5|e7/)) return true
    if (member.id === "mom" && evt.id.match(/e5/)) return true // mom has flu shot (e5)
    if (member.id === "son" && evt.id.match(/e6/)) return true
    return evt.title.includes(member.initials)
  })

  // Filter records belonging to this member
  const memberRecords = medicalRecords.filter(rec => {
    if (member.id === "grandma" && rec.id.match(/r1|r2/)) return true
    if (member.id === "dad" && rec.id.match(/r3/)) return true
    return false
  })

  // Filter consents
  const consents = hospitalConsents.map(h => ({
    hospitalName: h.hospitalName,
    accessLevel: h.permissions[member.id] || "none"
  }))

  const vitals = vitalsHistory[member.id] || []

  return (
    <main className="max-w-[1600px] mx-auto px-6 py-8 space-y-8">
      {/* Back button & title */}
      <div className="flex items-center justify-between">
        <Link href="/family/dashboard" className="flex items-center gap-2 text-xs text-ivory/60 hover:text-amber font-semibold uppercase tracking-wider transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Command Center
        </Link>
        <span className="text-[10px] uppercase tracking-widest text-ivory/30 font-bold">
          Role: Private Family Archive
        </span>
      </div>

      {/* Profile Header */}
      <div className="frosted-panel rounded-3xl p-6 md:p-8 border border-white/5 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber to-terracotta flex items-center justify-center text-2xl font-black text-obsidian shadow-lg shadow-amber/10">
            {member.initials}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl md:text-3xl font-extrabold text-ivory tracking-tight">
                {member.name}
              </h2>
              <StatusOrb status={member.status} className="w-4.5 h-4.5" />
            </div>
            <p className="text-sm text-ivory/60 mt-1">
              {member.relation} • Age {member.age} • Blood Group: <span className="text-amber font-bold">{member.bloodGroup}</span>
            </p>
            {member.alertText && (
              <p className="text-xs text-destructive font-semibold mt-2 bg-destructive/10 border border-destructive/20 px-3 py-1 rounded-md inline-block critical-blink">
                {member.alertText}
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-3 shrink-0">
          <button className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-white/5 border border-white/5 text-ivory rounded-full hover:bg-white/10 transition-colors flex items-center gap-2">
            <Download className="w-3.5 h-3.5" />
            Export EMR
          </button>
          <button className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-terracotta text-white rounded-full hover:bg-terracotta-dark transition-colors flex items-center gap-2">
            <FileText className="w-3.5 h-3.5" />
            Medical Handoff
          </button>
        </div>
      </div>

      {/* Main Grid: Body Map + Vitals + Clinical Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Body Map Visualizer */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="flex items-center gap-2 px-1">
            <div className="w-1 h-5 bg-terracotta rounded-full" />
            <h3 className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold text-ivory">
              Anatomical timeline
            </h3>
          </div>
          <BodyMap events={memberEvents} className="h-[400px]" />
          <p className="text-[10px] text-center text-ivory/40 italic">
            *Hover glowing markers to inspect surgical implants, scans, or trauma histories.
          </p>
        </div>

        {/* Right Column: Vitals History Graph */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="flex items-center gap-2 px-1">
            <div className="w-1 h-5 bg-amber rounded-full" />
            <h3 className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold text-ivory">
              Vitals Surveillance
            </h3>
          </div>
          <div className="frosted-panel rounded-3xl p-5 border border-white/5 h-[400px] flex flex-col justify-between">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs text-white/50">Heart Rate &amp; Blood Pressure Trend (Today)</span>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-terracotta" />Systolic</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-amber" />HR (bpm)</span>
              </div>
            </div>
            {vitals.length > 0 ? (
              <div className="flex-1 w-full text-xs min-h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={vitals} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                    <XAxis dataKey="timestamp" stroke="rgba(245, 240, 232, 0.4)" />
                    <YAxis stroke="rgba(245, 240, 232, 0.4)" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#141414", borderColor: "rgba(245, 166, 35, 0.15)", borderRadius: 12 }}
                      labelStyle={{ color: "var(--ivory)", fontWeight: "bold" }}
                    />
                    <Line type="monotone" dataKey="systolic" stroke="var(--terracotta)" strokeWidth={2} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="heartRate" stroke="var(--amber)" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-xs text-ivory/40">
                No active vitals telemetry logs found.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Grid: Medical Records + Consent list + Allergies */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Medications & Allergies */}
        <div className="frosted-panel rounded-2xl p-5 border border-white/5 space-y-5">
          <div>
            <h4 className="text-xs uppercase tracking-wider text-ivory/50 font-bold mb-3">Allergies</h4>
            <div className="flex flex-wrap gap-2">
              {member.allergies.length > 0 ? (
                member.allergies.map(al => (
                  <span key={al} className="px-3 py-1 bg-destructive/10 border border-destructive/20 rounded-lg text-xs font-semibold text-destructive">
                    {al}
                  </span>
                ))
              ) : (
                <span className="text-xs text-success font-medium">No Known Drug Allergies</span>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-wider text-ivory/50 font-bold mb-3">Active Medications</h4>
            <div className="space-y-2">
              {member.activeMedications.map((med, idx) => (
                <div key={idx} className="flex justify-between items-center p-2.5 rounded-xl bg-white/5 border border-white/5">
                  <div>
                    <p className="text-xs font-bold text-white">{med.name}</p>
                    <p className="text-[9px] text-white/50">{med.category}</p>
                  </div>
                  <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-white/80">{med.frequency}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Medical Case Reports */}
        <div className="frosted-panel rounded-2xl p-5 border border-white/5 flex flex-col">
          <h4 className="text-xs uppercase tracking-wider text-ivory/50 font-bold mb-3">Attached Records</h4>
          <div className="flex-1 overflow-y-auto space-y-3 scrollbar-thin">
            {memberRecords.length > 0 ? (
              memberRecords.map(rec => (
                <div key={rec.id} className="p-3 rounded-xl bg-white/5 border border-white/5 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-amber" />
                    <div>
                      <p className="text-xs font-bold text-white truncate max-w-[150px]">{rec.title}</p>
                      <p className="text-[10px] text-white/40">{rec.fileName} • {rec.fileSize}</p>
                    </div>
                  </div>
                  <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-ivory/60 hover:text-ivory transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-xs text-white/40 italic">No document records found.</p>
            )}
          </div>
        </div>

        {/* Hospital Consent Statuses */}
        <div className="frosted-panel rounded-2xl p-5 border border-white/5 flex flex-col">
          <h4 className="text-xs uppercase tracking-wider text-ivory/50 font-bold mb-3">Consent Bridges</h4>
          <div className="flex-1 overflow-y-auto space-y-3 scrollbar-thin">
            {consents.map((c, i) => (
              <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/5 flex justify-between items-center">
                <span className="text-xs font-bold text-white">{c.hospitalName}</span>
                <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold border ${
                  c.accessLevel === "full"
                    ? "bg-amber/10 border-amber/30 text-amber"
                    : c.accessLevel === "readonly"
                    ? "bg-success/10 border-success/30 text-success"
                    : c.accessLevel === "emergency"
                    ? "bg-destructive/15 border-destructive/30 text-destructive animate-pulse"
                    : "bg-white/5 border-white/10 text-white/30"
                }`}>
                  {c.accessLevel}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
