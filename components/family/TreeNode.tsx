"use client"

import React from "react"
import { motion } from "framer-motion"
import { FamilyMember, HealthStatus } from "@/types/family"
import { StatusOrb } from "./StatusOrb"
import { ShieldAlert } from "lucide-react"

interface TreeNodeProps {
  member: FamilyMember
  isSelected?: boolean
  onClick: () => void
  layoutMode: "vertical" | "horizontal" | "radial"
  activeRiskOverlay: "none" | "diabetes" | "hypertension" | "cardiac"
}

export function TreeNode({
  member,
  isSelected = false,
  onClick,
  layoutMode,
  activeRiskOverlay
}: TreeNodeProps) {
  // Determine if this member propagates risk based on the active risk overlay
  const hasRisk = () => {
    if (activeRiskOverlay === "none") return false
    if (activeRiskOverlay === "diabetes" && member.id === "grandma") return true
    if (activeRiskOverlay === "hypertension" && (member.id === "grandma" || member.id === "dad")) return true
    if (activeRiskOverlay === "cardiac" && (member.id === "grandma" || member.id === "dad")) return true
    return false
  }

  const propagatesRisk = hasRisk()

  return (
    <motion.div
      onClick={onClick}
      whileHover={{ scale: 1.06, y: -2 }}
      whileTap={{ scale: 0.96 }}
      className={`relative w-44 p-3.5 rounded-2xl frosted-panel flex flex-col items-center justify-between border cursor-pointer select-none transition-all duration-300 ${
        isSelected 
          ? "border-terracotta border-2 ring-2 ring-terracotta/20" 
          : propagatesRisk 
          ? "border-destructive/60 shadow-lg shadow-destructive/15 animate-pulse" 
          : "border-white/5 hover:border-amber/40"
      }`}
    >
      {/* Risk highlight indicator */}
      {propagatesRisk && (
        <div className="absolute inset-0 rounded-2xl bg-destructive/5 pointer-events-none" />
      )}

      {/* Top row */}
      <div className="w-full flex justify-between items-center text-[9px] text-white/50 mb-1">
        <span className="font-semibold uppercase tracking-wider">{member.relation}</span>
        <StatusOrb status={member.status} className="w-3.5 h-3.5" />
      </div>

      {/* Avatar initials */}
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber/20 to-terracotta/20 border border-amber/25 flex items-center justify-center font-bold text-white mb-2">
        {member.initials}
      </div>

      {/* Core info */}
      <div className="text-center w-full">
        <h4 className="font-[family-name:var(--font-space-grotesk)] text-xs font-bold text-white truncate">
          {member.name}
        </h4>
        <p className="text-[10px] text-white/45 mt-0.5">Age {member.age} • Blood {member.bloodGroup}</p>
      </div>

      {/* Badges */}
      <div className="flex gap-1.5 mt-2.5">
        {member.status === "critical" && (
          <span className="px-1.5 py-0.5 rounded bg-destructive/20 border border-destructive/30 text-destructive text-[8px] font-extrabold uppercase flex items-center gap-0.5">
            <ShieldAlert className="w-2.5 h-2.5" /> Alert
          </span>
        )}
        {member.activeMedications.length > 0 && (
          <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-white/70 text-[8px] font-bold">
            {member.activeMedications.length} Meds
          </span>
        )}
      </div>
    </motion.div>
  )
}
export default TreeNode
