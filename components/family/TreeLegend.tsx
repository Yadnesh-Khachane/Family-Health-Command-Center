"use client"

import React from "react"
import { motion } from "framer-motion"
import { ShieldCheck, Eye, EyeOff } from "lucide-react"

export type RelationType = 
  | "parent-child"
  | "sibling"
  | "spouse"
  | "guardian"
  | "adopted"
  | "emergency"
  | "medical"
  | "inherited"
  | "deceased"

interface TreeLegendProps {
  activeTypes: Record<RelationType, boolean>
  onToggleType: (type: RelationType) => void
}

export function TreeLegend({ activeTypes, onToggleType }: TreeLegendProps) {
  const legends: Array<{
    type: RelationType
    label: string
    colorClass: string
    linePreview: React.ReactNode
  }> = [
    {
      type: "parent-child",
      label: "Parent → Child",
      colorClass: "text-amber",
      linePreview: <div className="w-12 h-1 bg-amber/50 rounded" />
    },
    {
      type: "sibling",
      label: "Sibling Bridge",
      colorClass: "text-success",
      linePreview: <div className="w-12 h-1 bg-success/60 rounded" />
    },
    {
      type: "spouse",
      label: "Marriage / Partner",
      colorClass: "text-terracotta",
      linePreview: (
        <div className="flex flex-col gap-0.5 w-12 justify-center">
          <div className="h-0.5 bg-terracotta/75 w-full rounded" />
          <div className="h-0.5 bg-terracotta/75 w-full rounded" />
        </div>
      )
    },
    {
      type: "guardian",
      label: "Guardian Link",
      colorClass: "text-amber/80",
      linePreview: <div className="w-12 h-0.5 border-t border-dashed border-amber/60" />
    },
    {
      type: "adopted",
      label: "Adopted Link",
      colorClass: "text-success/80",
      linePreview: <div className="w-12 h-0.5 border-t border-dotted border-success/60" />
    },
    {
      type: "emergency",
      label: "Emergency Dependency",
      colorClass: "text-warning",
      linePreview: <div className="w-12 h-1 bg-warning rounded shadow-[0_0_8px_var(--warning)] animate-pulse" />
    },
    {
      type: "medical",
      label: "Medical Dependency",
      colorClass: "text-terracotta",
      linePreview: <div className="w-12 h-0.5 border-t-2 border-dashed border-terracotta/80 animate-pulse" />
    },
    {
      type: "inherited",
      label: "Inherited Condition",
      colorClass: "text-amber",
      linePreview: <div className="w-12 h-1 bg-gradient-to-r from-terracotta to-amber rounded" />
    },
    {
      type: "deceased",
      label: "Deceased Link",
      colorClass: "text-white/20",
      linePreview: <div className="w-12 h-0.5 bg-white/10 rounded" />
    }
  ]

  return (
    <div className="frosted-panel rounded-3xl p-5 border border-white/5 space-y-3.5 bg-charcoal/40 backdrop-blur-md">
      <div className="flex items-center justify-between">
        <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-white/50 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-amber" />
          Relationship Legend &amp; Filter
        </h4>
        <span className="text-[9px] text-white/30 uppercase font-semibold">Toggle filters</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 pt-1">
        {legends.map((legend) => {
          const isActive = activeTypes[legend.type]
          return (
            <div
              key={legend.type}
              onClick={() => onToggleType(legend.type)}
              className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between h-20 bg-white/5 ${
                isActive 
                  ? "border-white/10 hover:border-white/20" 
                  : "border-transparent opacity-40 hover:opacity-60"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className={`text-[10px] font-bold ${legend.colorClass}`}>
                  {legend.label}
                </span>
                {isActive ? (
                  <Eye className="w-3.5 h-3.5 text-white/40 shrink-0" />
                ) : (
                  <EyeOff className="w-3.5 h-3.5 text-white/20 shrink-0" />
                )}
              </div>
              <div className="flex items-center justify-start h-4 mt-2">
                {legend.linePreview}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
export default TreeLegend
