"use client"

import React from "react"
import { motion } from "framer-motion"
import { Edit2, Share2, Download, ShieldCheck } from "lucide-react"
import { HealthRing } from "./HealthRing"
import { fadeInUp } from "./animations"

interface FamilyHeaderProps {
  familyName: string
  familyMotto: string
  createdDate: string
  primaryContact: string
  healthIndex: number
  onEdit?: () => void
  onShare?: () => void
  onExport?: () => void
}

export function FamilyHeader({
  familyName,
  familyMotto,
  createdDate,
  primaryContact,
  healthIndex,
  onEdit,
  onShare,
  onExport
}: FamilyHeaderProps) {
  return (
    <motion.section
      variants={fadeInUp}
      initial="hidden"
      animate="show"
      className="relative overflow-hidden rounded-3xl frosted-panel border border-white/5 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6"
    >
      {/* Background glow overlay */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-terracotta/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber/5 rounded-full blur-3xl pointer-events-none" />

      {/* Info left side */}
      <div className="flex flex-col sm:flex-row items-center gap-6 z-10 text-center sm:text-left">
        <HealthRing score={healthIndex} size={110} strokeWidth={8} />
        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
            <h1 className="font-[family-name:var(--font-space-grotesk)] text-2xl sm:text-3xl font-extrabold text-ivory tracking-tight">
              {familyName}
            </h1>
            <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-success/10 border border-success/20 text-success text-[10px] uppercase font-bold tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Household
            </span>
          </div>
          <p className="text-sm italic text-amber font-medium">
            &ldquo;{familyMotto}&rdquo;
          </p>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 text-xs text-ivory/60 font-medium">
            <span>Primary Contact: <strong className="text-ivory font-semibold">{primaryContact}</strong></span>
            <span className="hidden sm:inline text-white/20">•</span>
            <span>Created: <strong className="text-ivory font-semibold">{createdDate}</strong></span>
          </div>
        </div>
      </div>

      {/* Actions right side */}
      <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 z-10 shrink-0">
        <button
          onClick={onEdit}
          className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-white/5 border border-white/5 text-ivory hover:text-white rounded-full hover:bg-white/10 transition-all flex items-center gap-2"
        >
          <Edit2 className="w-3.5 h-3.5 text-amber" />
          Edit Identity
        </button>
        <button
          onClick={onShare}
          className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-white/5 border border-white/5 text-ivory hover:text-white rounded-full hover:bg-white/10 transition-all flex items-center gap-2"
        >
          <Share2 className="w-3.5 h-3.5 text-terracotta" />
          Share Access
        </button>
        <button
          onClick={onExport}
          className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-amber text-obsidian rounded-full hover:bg-amber/95 font-black transition-all flex items-center gap-2"
        >
          <Download className="w-3.5 h-3.5 text-obsidian" />
          Export Packet
        </button>
      </div>
    </motion.section>
  )
}
