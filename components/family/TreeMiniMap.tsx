"use client"

import React from "react"
import { FamilyMember } from "@/types/family"

interface TreeMiniMapProps {
  members: FamilyMember[]
  layoutMode: "vertical" | "horizontal" | "radial"
  activeRisk: string
  selectedId: string | null
  layouts: Record<string, Record<string, { x: number; y: number }>>
  connections: Array<{ from: string; to: string; type: string }>
}

export function TreeMiniMap({
  members,
  layoutMode,
  activeRisk,
  selectedId,
  layouts,
  connections
}: TreeMiniMapProps) {
  const getCoords = (id: string) => {
    const layout = layouts[layoutMode] || layouts.vertical
    return layout[id] || { x: 0, y: 0 }
  }

  return (
    <div className="absolute bottom-4 left-4 w-32 h-32 rounded-2xl border border-white/10 bg-charcoal/80 backdrop-blur-xl p-2 select-none shadow-2xl z-20 pointer-events-none">
      <span className="text-[8px] uppercase tracking-wider font-bold text-white/30 block mb-1">Mini Map</span>
      
      <div className="relative w-full h-[calc(100%-12px)] rounded-lg bg-black/25 overflow-hidden border border-white/5">
        <svg viewBox="0 0 100 100" className="w-full h-full opacity-60">
          {/* Mini Connections */}
          {connections.map((conn, idx) => {
            const fromCoords = getCoords(conn.from)
            const toCoords = getCoords(conn.to)
            if (!fromCoords || !toCoords) return null

            return (
              <line
                key={idx}
                x1={fromCoords.x}
                y1={fromCoords.y}
                x2={toCoords.x}
                y2={toCoords.y}
                stroke="rgba(245, 166, 35, 0.2)"
                strokeWidth="1.5"
              />
            )
          })}

          {/* Mini Nodes */}
          {members.map((member) => {
            const coords = getCoords(member.id)
            const isSelected = selectedId === member.id
            
            // Color based on status
            const getStatusColor = () => {
              if (isSelected) return "var(--terracotta)"
              if (member.status === "critical") return "var(--destructive)"
              if (member.status === "warning") return "var(--warning)"
              return "var(--success)"
            }

            return (
              <circle
                key={member.id}
                cx={coords.x}
                cy={coords.y}
                r={isSelected ? "4" : "2.5"}
                fill={getStatusColor()}
                className="transition-all duration-300"
              />
            )
          })}
        </svg>
      </div>
    </div>
  )
}
export default TreeMiniMap
