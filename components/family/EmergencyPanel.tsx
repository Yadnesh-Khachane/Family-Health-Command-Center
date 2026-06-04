"use client"

import React from "react"
import { FamilyMember, EmergencyContact } from "@/types/family"
import { QrCode, PhoneCall, AlertOctagon, Droplet } from "lucide-react"

interface EmergencyPanelProps {
  member: FamilyMember
  contacts: EmergencyContact[]
  onPrint?: () => void
}

export function EmergencyPanel({ member, contacts, onPrint }: EmergencyPanelProps) {
  return (
    <div className="space-y-6">
      {/* High Contrast Header */}
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
            <p className="text-xs text-white/70 mt-0.5">High-contrast accessibility mode active.</p>
          </div>
        </div>

        {onPrint && (
          <button 
            onClick={onPrint}
            className="px-5 py-2.5 rounded-full bg-destructive hover:bg-destructive-dark text-white font-bold text-xs uppercase tracking-wider transition-colors z-10"
          >
            Print Packet
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Core medical facts */}
        <div className="lg:col-span-2 frosted-panel rounded-3xl p-6 border-2 border-destructive/20 bg-charcoal/50 space-y-6">
          <div className="flex justify-between items-center border-b border-white/5 pb-4">
            <div>
              <h3 className="font-[family-name:var(--font-space-grotesk)] text-lg font-black text-white">
                {member.name}
              </h3>
              <p className="text-xs text-white/50">{member.relation} • Age {member.age}</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-destructive/20 border border-destructive/30 rounded-xl text-destructive font-black text-sm">
              <Droplet className="w-4 h-4 fill-destructive" />
              BLOOD: {member.bloodGroup}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 rounded-2xl bg-destructive/5 border border-destructive/20 space-y-2">
              <span className="text-[10px] uppercase tracking-wider text-destructive font-black">Allergies</span>
              <p className="text-sm font-bold text-white">
                {member.allergies.length > 0 ? member.allergies.join(", ") : "No Known Allergies"}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <span className="text-[10px] uppercase tracking-wider text-white/40 font-bold">Meds</span>
              <ul className="text-xs font-semibold text-white/80 space-y-1">
                {member.activeMedications.length > 0 ? (
                  member.activeMedications.map((m, i) => (
                    <li key={i} className="flex justify-between">
                      <span>{m.name}</span>
                      <span className="text-amber">{m.dose}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-white/40 italic">No prescriptions.</li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* QR & Dialing */}
        <div className="space-y-6">
          <div className="frosted-panel rounded-3xl p-6 border border-white/10 flex flex-col items-center justify-center text-center space-y-4">
            <QrCode className="w-28 h-28 text-white" />
            <span className="text-xs font-bold uppercase tracking-wider text-white">Emergency Scan Key</span>
          </div>

          <div className="frosted-panel rounded-3xl p-6 border border-white/5 space-y-3">
            <h4 className="text-xs uppercase tracking-wider text-white/40 font-bold">Quick Contacts</h4>
            {contacts.map(c => (
              <div key={c.id} className="flex items-center justify-between p-2 rounded bg-white/5 text-xs">
                <div>
                  <p className="font-bold text-white">{c.name}</p>
                  <p className="text-[10px] text-white/50">{c.relation}</p>
                </div>
                <a href={`tel:${c.phone}`} className="p-2 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive hover:text-white transition-all">
                  <PhoneCall className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
export default EmergencyPanel
