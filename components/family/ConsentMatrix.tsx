"use client"

import React from "react"
import { FamilyMember, HospitalConsent, AccessLevel } from "@/types/family"

interface ConsentMatrixProps {
  members: FamilyMember[]
  consents: HospitalConsent[]
  onCyclePermission: (hospitalId: string, memberId: string) => void
}

export function ConsentMatrix({ members, consents, onCyclePermission }: ConsentMatrixProps) {
  return (
    <div className="frosted-panel rounded-3xl p-6 border border-amber/10 overflow-x-auto">
      <table className="w-full min-w-[700px]">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left text-xs uppercase tracking-wider text-ivory/40 pb-4">Hospital Entity</th>
            {members.map(m => (
              <th key={m.id} className="text-center text-xs uppercase tracking-wider text-ivory/40 pb-4">
                {m.name} ({m.initials})
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {consents.map(consent => (
            <tr key={consent.hospitalId} className="border-b border-white/5">
              <td className="py-4">
                <p className="text-sm font-bold text-ivory">{consent.hospitalName}</p>
              </td>
              {members.map(member => {
                const currentPerm = consent.permissions[member.id] || "none"
                return (
                  <td key={member.id} className="py-4 text-center">
                    <button
                      onClick={() => onCyclePermission(consent.hospitalId, member.id)}
                      className={`w-32 py-2 rounded-xl text-xs font-semibold uppercase tracking-wide transition-all border ${
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

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-6 mt-6 pt-4 border-t border-white/10 text-xs text-ivory/50">
        <span className="font-semibold text-ivory">Access Level Legend:</span>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 bg-amber border border-amber rounded" />
          <span>Full Access</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 border border-amber bg-amber/5 rounded" />
          <span>Read-Only</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 bg-destructive/20 border border-destructive/40 rounded" />
          <span>Emergency Override Only</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 bg-white/5 border border-white/5 rounded" />
          <span>Restricted (No Access)</span>
        </div>
      </div>
    </div>
  )
}
export default ConsentMatrix
