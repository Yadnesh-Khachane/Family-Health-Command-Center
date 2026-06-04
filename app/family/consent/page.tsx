"use client"

import React, { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { 
  ArrowLeft, 
  ShieldCheck, 
  Clock, 
  Trash2, 
  Lock,
  Unlock,
  AlertOctagon,
  FileSpreadsheet
} from "lucide-react"

import { familyMembers, hospitalConsents, consentAudits } from "@/lib/mock-data/mockData"
import { AccessLevel, ConsentAuditEntry } from "@/types/family"
import { fadeInUp, staggerContainer } from "@/components/family/animations"

export default function ConsentPage() {
  const [matrix, setMatrix] = useState(hospitalConsents)
  const [auditLog, setAuditLog] = useState<ConsentAuditEntry[]>(consentAudits)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  // Cycle permissions
  const handleCyclePermission = (hospitalId: string, memberId: string) => {
    const accessLevels: AccessLevel[] = ["none", "readonly", "full", "emergency"]
    const member = familyMembers.find(m => m.id === memberId)
    const hospital = matrix.find(h => h.hospitalId === hospitalId)

    if (!member || !hospital) return

    const currentLevel = hospital.permissions[memberId] || "none"
    const nextIndex = (accessLevels.indexOf(currentLevel) + 1) % accessLevels.length
    const nextLevel = accessLevels[nextIndex]

    // Update Matrix
    setMatrix(prev => prev.map(consent => {
      if (consent.hospitalId === hospitalId) {
        return {
          ...consent,
          permissions: {
            ...consent.permissions,
            [memberId]: nextLevel
          }
        }
      }
      return consent
    }))

    // Add Audit Log
    const newAudit: ConsentAuditEntry = {
      id: `a-${Date.now()}`,
      timestamp: new Date().toISOString(),
      member: member.name,
      hospital: hospital.hospitalName,
      action: nextLevel === "none" ? "Revoked Access" : `Granted ${nextLevel.toUpperCase()}`,
      actor: "Rajesh Sharma",
      previousLevel: currentLevel,
      newLevel: nextLevel
    }
    setAuditLog(prev => [newAudit, ...prev])
    showToast(`Consent level updated for ${member.name}`)
  }

  // Emergency lockdown
  const handleLockdown = () => {
    setMatrix(prev => prev.map(consent => ({
      ...consent,
      permissions: familyMembers.reduce((acc, m) => {
        acc[m.id] = "none"
        return acc
      }, {} as Record<string, AccessLevel>)
    })))
    
    // Add Audit
    const lockdownAudit: ConsentAuditEntry = {
      id: `a-${Date.now()}`,
      timestamp: new Date().toISOString(),
      member: "All Members",
      hospital: "All Hospitals",
      action: "LOCKDOWN ACTIVATED",
      actor: "Rajesh Sharma",
      previousLevel: "full",
      newLevel: "none"
    }
    setAuditLog(prev => [lockdownAudit, ...prev])
    showToast("EMERGENCY LOCKDOWN: All consent links severed.")
  }

  return (
    <main className="max-w-[1600px] mx-auto px-6 py-8 space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Link href="/family/dashboard" className="flex items-center gap-2 text-xs text-ivory/60 hover:text-amber font-semibold uppercase tracking-wider transition-colors mb-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="font-[family-name:var(--font-space-grotesk)] text-2xl md:text-3xl font-extrabold text-ivory tracking-tight">
            Consent Governance Matrix
          </h1>
        </div>

        {/* Global Controls */}
        <div className="flex gap-3 shrink-0">
          <button 
            onClick={handleLockdown}
            className="px-4 py-2 bg-destructive text-white text-xs font-bold rounded-lg hover:bg-destructive/80 transition-colors uppercase tracking-wider flex items-center gap-1.5"
          >
            <Lock className="w-4 h-4" />
            Emergency Lockdown
          </button>
        </div>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-lg frosted-glass border border-amber/30 bg-charcoal"
          >
            <p className="text-ivory text-xs font-semibold">{toastMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Permission grid */}
      <div className="frosted-panel rounded-3xl p-6 border border-amber/10 overflow-x-auto">
        <h3 className="font-[family-name:var(--font-space-grotesk)] text-sm font-bold text-white mb-6">Visual Consent Matrix</h3>
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left text-xs uppercase tracking-wider text-ivory/40 pb-4">Hospital Entity</th>
              {familyMembers.map(m => (
                <th key={m.id} className="text-center text-xs uppercase tracking-wider text-ivory/40 pb-4">
                  {m.name} ({m.initials})
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.map(consent => (
              <tr key={consent.hospitalId} className="border-b border-white/5">
                <td className="py-4">
                  <p className="text-sm font-bold text-ivory">{consent.hospitalName}</p>
                </td>
                {familyMembers.map(member => {
                  const currentPerm = consent.permissions[member.id] || "none"
                  return (
                    <td key={member.id} className="py-4 text-center">
                      <button
                        onClick={() => handleCyclePermission(consent.hospitalId, member.id)}
                        className={`w-32 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wide transition-all border ${
                          currentPerm === "full" 
                            ? "bg-amber text-obsidian border-amber" 
                            : currentPerm === "readonly"
                            ? "border-amber text-amber bg-amber/5"
                            : currentPerm === "emergency"
                            ? "bg-destructive/20 text-destructive border-destructive/40"
                            : "bg-white/5 text-ivory/30 border-white/5"
                        }`}
                      >
                        {currentPerm === "none" ? "No Access" : currentPerm}
                      </button>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Consent audit log */}
      <div className="frosted-panel rounded-3xl p-6 border border-white/5 space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber" />
            <h3 className="font-[family-name:var(--font-space-grotesk)] text-sm font-bold text-white">Consent Audit Trail</h3>
          </div>
          <span className="text-[10px] text-ivory/40">Real-time HIPAA log compliance</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-xs">
            <thead>
              <tr className="border-b border-white/5 text-ivory/40 text-left">
                <th className="pb-3 font-normal">Timestamp</th>
                <th className="pb-3 font-normal">Family Member</th>
                <th className="pb-3 font-normal">Hospital Partner</th>
                <th className="pb-3 font-normal">Action Logged</th>
                <th className="pb-3 font-normal">Authorized By</th>
                <th className="pb-3 font-normal text-right">Transition</th>
              </tr>
            </thead>
            <tbody>
              {auditLog.map((audit) => (
                <tr key={audit.id} className="border-b border-white/5 text-white/80">
                  <td className="py-3 font-mono text-[10px] text-white/50">
                    {new Date(audit.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3 font-bold text-white">{audit.member}</td>
                  <td className="py-3">{audit.hospital}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                      audit.action.includes("LOCKDOWN") || audit.action.includes("Revoked")
                        ? "bg-destructive/10 text-destructive"
                        : "bg-success/10 text-success"
                    }`}>
                      {audit.action}
                    </span>
                  </td>
                  <td className="py-3 font-medium text-white/70">{audit.actor}</td>
                  <td className="py-3 text-right font-mono text-[10px] text-white/40">
                    {audit.previousLevel.toUpperCase()} → {audit.newLevel.toUpperCase()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}
