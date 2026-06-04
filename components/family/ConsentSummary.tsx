"use client"

import React from "react"
import { motion } from "framer-motion"
import { ShieldCheck, History, ShieldAlert, ArrowRight } from "lucide-react"
import { HospitalConsent, ConsentAuditEntry } from "@/types/family"
import { fadeInUp } from "./animations"

interface ConsentSummaryProps {
  hospitalConsents: HospitalConsent[]
  consentAudits: ConsentAuditEntry[]
}

export function ConsentSummary({ hospitalConsents, consentAudits }: ConsentSummaryProps) {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const getBadgeStyle = (level: string) => {
    switch (level) {
      case "full":
        return "bg-amber/10 border-amber/30 text-amber"
      case "readonly":
        return "bg-success/10 border-success/30 text-success"
      case "emergency":
        return "bg-destructive/15 border-destructive/30 text-destructive animate-pulse"
      default:
        return "bg-white/5 border-white/10 text-white/30"
    }
  }

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 lg:grid-cols-12 gap-8"
    >
      {/* 1. Connected Hospitals & Consent Matrix */}
      <div className="lg:col-span-7 frosted-panel rounded-3xl p-5 border border-white/5 space-y-4">
        <h3 className="font-[family-name:var(--font-space-grotesk)] text-sm font-extrabold text-white flex items-center gap-2">
          <ShieldCheck className="w-4.5 h-4.5 text-success" />
          Active Hospital Permission Gates
        </h3>
        <p className="text-[11px] text-white/50">Zero-knowledge secure clinical connections</p>
        
        <div className="space-y-3 mt-2">
          {hospitalConsents.map((consent) => (
            <div key={consent.hospitalId} className="p-4 bg-white/5 border border-white/5 rounded-2xl space-y-3 hover:border-white/10 transition-colors">
              <div className="flex justify-between items-center">
                <span className="text-xs font-extrabold text-white">{consent.hospitalName}</span>
                <span className="text-[9px] uppercase tracking-wider font-semibold text-white/40">Secure Tunnel</span>
              </div>
              <div className="grid grid-cols-4 gap-2 pt-2 border-t border-white/5">
                {Object.entries(consent.permissions).map(([memberId, level]) => (
                  <div key={memberId} className="text-center p-2 rounded-xl bg-white/5 border border-white/5">
                    <p className="text-[9px] font-bold text-white/60 capitalize">{memberId}</p>
                    <span className={`inline-block mt-1.5 px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wide border ${getBadgeStyle(level)}`}>
                      {level}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Access Audits & compliance logs */}
      <div className="lg:col-span-5 frosted-panel rounded-3xl p-5 border border-white/5 flex flex-col justify-between h-full">
        <div className="space-y-4">
          <h3 className="font-[family-name:var(--font-space-grotesk)] text-sm font-extrabold text-white flex items-center gap-2">
            <History className="w-4.5 h-4.5 text-amber" />
            Recent Access Audits
          </h3>
          <p className="text-[11px] text-white/50">Real-time consent audit trails (HIPAA compliance)</p>
          
          <div className="space-y-3 mt-2 overflow-y-auto max-h-[220px] pr-1 scrollbar-thin">
            {consentAudits.map((audit) => (
              <div key={audit.id} className="p-3 bg-white/5 border border-white/5 rounded-2xl text-[10px] space-y-1.5 hover:border-white/10 transition-colors">
                <div className="flex justify-between items-center text-white/40 font-mono">
                  <span>
                    {mounted 
                      ? new Date(audit.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                      : "--:--"
                    }
                  </span>
                  <span>{audit.id}</span>
                </div>
                <div className="text-white/80 leading-relaxed font-semibold">
                  <span className="text-white font-extrabold">{audit.actor}</span> performed <span className="text-amber">{audit.action}</span> for <span className="text-white">{audit.member}</span>.
                </div>
                <div className="text-[9px] text-white/50 flex items-center gap-1.5">
                  <span>{audit.hospital}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span className="px-1.5 py-0.2 rounded border border-white/10 bg-white/5 font-bold uppercase">{audit.newLevel}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
