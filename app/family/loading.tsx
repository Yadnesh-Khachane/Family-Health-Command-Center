"use client"

import React from "react"
import { motion } from "framer-motion"

export default function FamilyLoading() {
  return (
    <div className="w-full h-[80vh] flex flex-col items-center justify-center space-y-4">
      {/* Noise texture */}
      <div className="noise-overlay" />
      
      {/* Glow spinner */}
      <div className="relative w-16 h-16">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-full h-full rounded-full border-t-2 border-r-2 border-terracotta border-b-2 border-l-2 border-b-transparent border-l-transparent"
        />
        <div className="absolute inset-2 rounded-full border border-amber/20 animate-pulse bg-charcoal" />
      </div>
      
      <p className="text-xs font-[family-name:var(--font-space-grotesk)] font-semibold uppercase tracking-widest text-ivory/60 animate-pulse">
        Securing Encryption Tunnel...
      </p>
    </div>
  )
}
