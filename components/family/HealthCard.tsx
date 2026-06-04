"use client"

import React from "react"
import { motion } from "framer-motion"

interface HealthCardProps {
  title: string
  value: string | number
  subtext?: string
  icon?: React.ReactNode
  accentColor?: string
  onClick?: () => void
  className?: string
}

export function HealthCard({
  title,
  value,
  subtext,
  icon,
  accentColor = "var(--amber)",
  onClick,
  className = ""
}: HealthCardProps) {
  const isClickable = !!onClick

  return (
    <motion.div
      onClick={onClick}
      whileHover={isClickable ? { y: -4, scale: 1.01 } : undefined}
      whileTap={isClickable ? { scale: 0.98 } : undefined}
      className={`relative frosted-panel rounded-2xl p-5 border border-white/5 flex flex-col justify-between overflow-hidden ${
        isClickable ? "cursor-pointer hover:border-white/10" : ""
      } ${className}`}
    >
      {/* Subtle indicator strip */}
      <div 
        className="absolute top-0 left-0 bottom-0 w-1 rounded-l-2xl" 
        style={{ backgroundColor: accentColor }}
      />

      <div className="flex justify-between items-start">
        <span className="text-[10px] uppercase tracking-wider text-ivory/50 font-bold">
          {title}
        </span>
        {icon && <div style={{ color: accentColor }}>{icon}</div>}
      </div>

      <div className="mt-4">
        <h3 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-black text-white">
          {value}
        </h3>
        {subtext && <p className="text-[10px] text-white/40 mt-1">{subtext}</p>}
      </div>
    </motion.div>
  )
}
export default HealthCard
