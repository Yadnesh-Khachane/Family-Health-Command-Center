"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FamilyMember } from "@/types/family"
import { StatusOrb } from "./StatusOrb"

interface FamilyGraphProps {
  members: FamilyMember[]
  onNodeSelect: (id: string) => void
  selectedId?: string | null
}

// Tree structure positioning: Grandma -> Dad & Mom -> Son
const nodePositions: Record<string, { top: string; left: string }> = {
  grandma: { top: "15%", left: "50%" },
  dad: { top: "48%", left: "30%" },
  mom: { top: "48%", left: "70%" },
  son: { top: "80%", left: "50%" }
}

const connections = [
  { from: "grandma", to: "dad" },
  { from: "dad", to: "mom", dashed: true },
  { from: "dad", to: "son" },
  { from: "mom", to: "son" }
]

export function FamilyGraph({ members, onNodeSelect, selectedId }: FamilyGraphProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const getMemberPosition = (id: string) => {
    return nodePositions[id] || { top: "0%", left: "0%" }
  }

  return (
    <div className="relative w-full h-[520px] rounded-3xl border border-amber/10 bg-charcoal/20 backdrop-blur-md overflow-hidden p-6 select-none">
      {/* Grid background */}
      <div className="absolute inset-0 hex-grid opacity-20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-terracotta/5 rounded-full blur-3xl pointer-events-none" />

      {/* SVG Connections */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
        {connections.map((conn, idx) => {
          const fromPos = getMemberPosition(conn.from)
          const toPos = getMemberPosition(conn.to)

          return (
            <motion.line
              key={`${conn.from}-${conn.to}-${idx}`}
              x1={fromPos.left}
              y1={fromPos.top}
              x2={toPos.left}
              y2={toPos.top}
              stroke="var(--amber)"
              strokeWidth={conn.dashed ? "1.5" : "2"}
              strokeOpacity={conn.dashed ? "0.3" : "0.5"}
              strokeDasharray={conn.dashed ? "4 4" : "0"}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1, delay: idx * 0.15 }}
            />
          )
        })}
      </svg>

      {/* Generation Labels */}
      <div className="absolute left-6 top-[15%] -translate-y-1/2 text-[10px] tracking-widest text-ivory/30 font-bold uppercase pointer-events-none">
        Grandparents
      </div>
      <div className="absolute left-6 top-[48%] -translate-y-1/2 text-[10px] tracking-widest text-ivory/30 font-bold uppercase pointer-events-none">
        Parents
      </div>
      <div className="absolute left-6 top-[80%] -translate-y-1/2 text-[10px] tracking-widest text-ivory/30 font-bold uppercase pointer-events-none">
        Children
      </div>

      {/* Member Nodes */}
      {members.map((member) => {
        const pos = getMemberPosition(member.id)
        const isSelected = selectedId === member.id
        const isHovered = hoveredId === member.id

        return (
          <div
            key={member.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
            style={{ top: pos.top, left: pos.left }}
          >
            {/* Popover Hover Card */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute -top-32 left-1/2 -translate-x-1/2 w-64 frosted-panel rounded-xl p-3 shadow-2xl border border-amber/20 z-50 pointer-events-none text-left"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-[family-name:var(--font-space-grotesk)] text-sm font-bold text-ivory">
                      {member.name}
                    </span>
                    <span className="text-[10px] bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-ivory/60 font-medium">
                      {member.relation}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-y-1.5 gap-x-2 text-[11px] text-ivory/70 mt-2 border-t border-white/5 pt-2">
                    <div>Age: <span className="text-ivory font-semibold">{member.age}</span></div>
                    <div>Blood: <span className="text-ivory font-semibold">{member.bloodGroup}</span></div>
                    <div className="col-span-2">Meds: <span className="text-amber font-semibold">{member.medicationCount} active</span></div>
                    <div className="col-span-2">Checkup: <span className="text-ivory/50">{member.lastCheckup}</span></div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Node Button */}
            <motion.button
              onClick={() => onNodeSelect(member.id)}
              onMouseEnter={() => setHoveredId(member.id)}
              onMouseLeave={() => setHoveredId(null)}
              className={`relative w-20 h-20 rounded-full frosted-panel flex items-center justify-center cursor-pointer transition-all duration-300 ${
                isSelected ? "border-terracotta border-2 node-selected" : "border border-amber/10 hover:border-amber/50"
              }`}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.96 }}
            >
              <div className="flex flex-col items-center">
                <span className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold text-ivory">
                  {member.initials}
                </span>
                <span className="text-[9px] uppercase tracking-wide text-ivory/40 font-semibold mt-0.5">
                  {member.relation.substring(0, 5)}
                </span>
              </div>
              <StatusOrb status={member.status} className="absolute top-1.5 right-1.5" />
            </motion.button>
          </div>
        )
      })}
    </div>
  )
}
