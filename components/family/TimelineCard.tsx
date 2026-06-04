"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { TimelineEvent } from "@/types/family"
import { AlertTriangle, ChevronDown, ChevronUp } from "lucide-react"

interface TimelineCardProps {
  event: TimelineEvent
  onToggleExpand?: () => void
}

export function TimelineCard({ event }: TimelineCardProps) {
  const [expanded, setExpanded] = useState(false)

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case "surgery": return "text-warning border-warning/20 bg-warning/5"
      case "implant": return "text-destructive border-destructive/20 bg-destructive/5"
      case "imaging": return "text-success border-success/20 bg-success/5"
      case "medication": return "text-terracotta border-terracotta/20 bg-terracotta/5"
      case "labs": return "text-amber border-amber/20 bg-amber/5"
      default: return "text-ivory/60 border-white/10 bg-white/5"
    }
  }

  return (
    <div className="relative pl-6 border-l border-white/5 py-1">
      {/* Dot node indicator */}
      <div className={`absolute left-[-4.5px] top-4 w-2 h-2 rounded-full ${
        event.status === "recalled" ? "bg-destructive critical-blink" : "bg-amber/60"
      }`} />
      
      <div className="frosted-panel bg-white/5 p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
        <div className="flex justify-between items-start text-[10px] text-ivory/50">
          <span>{event.date}</span>
          <div className="flex items-center gap-1.5">
            <span className={`px-2 py-0.5 border rounded text-[8px] uppercase tracking-wider font-extrabold ${getCategoryColor(event.category)}`}>
              {event.category}
            </span>
            {event.status === "recalled" && (
              <span className="px-1.5 py-0.5 bg-destructive/20 text-destructive border border-destructive/40 rounded text-[8px] uppercase font-bold flex items-center gap-0.5">
                <AlertTriangle className="w-2.5 h-2.5" /> Recall
              </span>
            )}
          </div>
        </div>

        <div className="flex justify-between items-start mt-2">
          <div>
            <h4 className="font-bold text-xs text-white">{event.title}</h4>
            <p className="text-[11px] text-white/60 mt-0.5">{event.subtitle}</p>
          </div>
          {event.notes && (
            <button 
              onClick={() => setExpanded(!expanded)} 
              className="p-1 rounded-full hover:bg-white/5 text-ivory/40 hover:text-ivory transition-colors shrink-0"
            >
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          )}
        </div>

        <AnimatePresence>
          {expanded && event.notes && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mt-2 pt-2 border-t border-white/5"
            >
              <p className="text-[11px] text-white/70 leading-relaxed italic">
                "{event.notes}"
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/5 text-[9px] text-ivory/40">
          <span>{event.doctor}</span>
          <span>{event.hospital}</span>
        </div>
      </div>
    </div>
  )
}
export default TimelineCard
