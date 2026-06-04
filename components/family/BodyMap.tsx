"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { TimelineEvent } from "@/types/family"

interface BodyMapProps {
  events: TimelineEvent[]
  className?: string
}

interface Hotspot {
  id: string
  x: number
  y: number
  label: string
  location: string
  matchingEvents: TimelineEvent[]
}

export function BodyMap({ events, className = "" }: BodyMapProps) {
  const [hoveredSpot, setHoveredSpot] = useState<Hotspot | null>(null)

  // Map coordinates on a 100x180 canvas
  const locationsMap: Record<string, { x: number; y: number; label: string }> = {
    eye: { x: 42, y: 16, label: "Ophthalmic Region" },
    hip: { x: 62, y: 110, label: "Pelvic / Hip Joint" },
    abdomen: { x: 50, y: 85, label: "Abdominal Region" },
    chest: { x: 50, y: 48, label: "Thoracic Region" }
  }

  // Group events by location
  const hotspots: Hotspot[] = Object.entries(locationsMap).map(([loc, pos]) => {
    const matching = events.filter(e => e.bodyLocation === loc)
    return {
      id: loc,
      x: pos.x,
      y: pos.y,
      label: pos.label,
      location: loc,
      matchingEvents: matching
    }
  }).filter(h => h.matchingEvents.length > 0)

  return (
    <div className={`relative flex items-center justify-center p-4 border border-amber/10 bg-charcoal/20 backdrop-blur-md rounded-3xl ${className}`}>
      {/* Grid Pattern */}
      <div className="absolute inset-0 hex-grid opacity-10 pointer-events-none" />

      {/* Anatomy Container */}
      <div className="relative w-48 h-80">
        <svg viewBox="0 0 100 180" className="w-full h-full">
          {/* Head */}
          <ellipse
            cx="50"
            cy="20"
            rx="14"
            ry="16"
            fill="none"
            stroke="var(--ivory)"
            strokeWidth="1.5"
            strokeOpacity="0.25"
          />
          {/* Torso & Limbs */}
          <path
            d="M35 38 L30 80 L23 85 L30 87 L34 122 L40 172 L45 172 L50 132 L55 172 L60 172 L66 122 L70 87 L77 85 L70 80 L65 38 Z"
            fill="none"
            stroke="var(--ivory)"
            strokeWidth="1.5"
            strokeOpacity="0.25"
            strokeLinejoin="round"
          />

          {/* Glowing markers */}
          {hotspots.map((spot) => {
            const hasRecalled = spot.matchingEvents.some(e => e.status === "recalled")
            const markerColor = hasRecalled ? "var(--destructive)" : "var(--amber)"
            const isHovered = hoveredSpot?.id === spot.id

            return (
              <g key={spot.id}>
                {/* Glow ring */}
                <circle
                  cx={spot.x}
                  cy={spot.y}
                  r={isHovered ? 12 : 7}
                  fill="none"
                  stroke={markerColor}
                  strokeWidth="1.5"
                  className={hasRecalled ? "critical-blink" : "warning-pulse"}
                  style={{ transformOrigin: `${spot.x}px ${spot.y}px` }}
                />
                {/* Center dot */}
                <circle
                  cx={spot.x}
                  cy={spot.y}
                  r="4.5"
                  fill={markerColor}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredSpot(spot)}
                  onMouseLeave={() => setHoveredSpot(null)}
                />
              </g>
            )
          })}
        </svg>

        {/* Hover Tooltip Card */}
        <AnimatePresence>
          {hoveredSpot && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="absolute left-1/2 -translate-x-1/2 -top-16 w-60 frosted-panel rounded-xl p-3 border border-amber/30 z-50 pointer-events-none"
            >
              <h5 className="font-[family-name:var(--font-space-grotesk)] text-xs font-bold text-amber mb-1 uppercase tracking-wider">
                {hoveredSpot.label}
              </h5>
              <div className="space-y-2 mt-2 max-h-36 overflow-y-auto pr-1">
                {hoveredSpot.matchingEvents.map((evt) => (
                  <div key={evt.id} className="border-t border-white/5 pt-1.5 first:border-0 first:pt-0">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-ivory/50">{evt.date.substring(0, 4)}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[8px] uppercase font-semibold ${
                        evt.status === "recalled" ? "bg-destructive/20 text-destructive" : "bg-white/10 text-ivory/80"
                      }`}>
                        {evt.status}
                      </span>
                    </div>
                    <p className="text-[11px] font-semibold text-ivory mt-0.5">{evt.title}</p>
                    <p className="text-[10px] text-ivory/60">{evt.hospital}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
