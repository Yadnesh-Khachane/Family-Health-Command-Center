"use client"

import React from "react"
import { motion } from "framer-motion"
import { Clock, PlusCircle, UploadCloud, ShieldAlert, Key } from "lucide-react"
import { fadeInUp, staggerContainer } from "./animations"

interface ActivityEvent {
  id: string
  date: string
  time: string
  type: "member" | "record" | "permission" | "alert"
  title: string
  description: string
  actor: string
}

const mockActivities: ActivityEvent[] = [
  {
    id: "act-1",
    date: "Jun 04, 2026",
    time: "10:12 AM",
    type: "permission",
    title: "Authorized Full Access",
    description: "Granted Apollo Medical Center full access to Gayatri Sharma's dossier.",
    actor: "Rajesh Sharma (Proxy)"
  },
  {
    id: "act-2",
    date: "Jun 03, 2026",
    time: "02:45 PM",
    type: "permission",
    title: "Revoked Access Gate",
    description: "Revoked City General Hospital access to Aarav Sharma's records.",
    actor: "Priya Sharma (Guardian)"
  },
  {
    id: "act-3",
    date: "May 28, 2026",
    time: "09:15 AM",
    type: "permission",
    title: "Emergency Restrict",
    description: "Restricted Metro Hospital Group to Emergency Access only for Rajesh Sharma.",
    actor: "Rajesh Sharma"
  },
  {
    id: "act-4",
    date: "Nov 20, 2024",
    time: "11:30 AM",
    type: "record",
    title: "Clinical Document Upload",
    description: "MRI Scan & Revision Plan 'gayatri_sharma_mri_hip_2024.pdf' uploaded.",
    actor: "Apollo Orthopedics"
  },
  {
    id: "act-5",
    date: "Feb 15, 2024",
    time: "09:00 AM",
    type: "member",
    title: "Family Member Joined",
    description: "Aarav Sharma added to household registry.",
    actor: "Priya Sharma"
  }
]

export function ActivityFeed() {
  const getIcon = (type: string) => {
    switch (type) {
      case "member":
        return <PlusCircle className="w-4 h-4 text-success" />
      case "record":
        return <UploadCloud className="w-4 h-4 text-blue-400" />
      case "alert":
        return <ShieldAlert className="w-4 h-4 text-destructive" />
      default:
        return <Key className="w-4 h-4 text-amber" />
    }
  }

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="show"
      className="frosted-panel rounded-3xl p-5 border border-white/5 space-y-4 flex flex-col justify-between h-full"
    >
      <div className="space-y-1">
        <h3 className="font-[family-name:var(--font-space-grotesk)] text-sm font-extrabold text-white flex items-center gap-2">
          <Clock className="w-4.5 h-4.5 text-amber" />
          Audit Trail Log
        </h3>
        <p className="text-[11px] text-white/50">Chronological household clinical transactions</p>
      </div>

      <motion.div 
        variants={staggerContainer}
        className="space-y-4 mt-2 overflow-y-auto max-h-[300px] pr-1 scrollbar-thin"
      >
        {mockActivities.map((act) => (
          <motion.div 
            key={act.id} 
            variants={fadeInUp}
            className="relative pl-6 pb-2 border-l border-white/10 last:border-0 last:pb-0"
          >
            {/* Dot Indicator */}
            <div className="absolute -left-[9px] top-1.5 w-4.5 h-4.5 rounded-full bg-charcoal border border-white/10 flex items-center justify-center">
              {getIcon(act.type)}
            </div>

            <div className="bg-white/5 border border-white/5 rounded-2xl p-3 text-[11px] space-y-1 hover:border-white/10 transition-colors">
              <div className="flex justify-between items-center text-white/40 font-semibold">
                <span>{act.date} • {act.time}</span>
                <span className="font-mono text-[9px] text-white/30">{act.id}</span>
              </div>
              <h4 className="font-bold text-white text-xs mt-0.5">{act.title}</h4>
              <p className="text-white/60 leading-normal">{act.description}</p>
              <div className="text-[9px] text-white/40 pt-1">
                Triggered by: <span className="font-semibold text-white/70">{act.actor}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}
