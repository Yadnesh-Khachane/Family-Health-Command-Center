"use client"

import React from "react"
import { motion } from "framer-motion"

interface HealthRingProps {
  score: number
  size?: number
  strokeWidth?: number
}

export function HealthRing({ score, size = 120, strokeWidth = 10 }: HealthRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = parseFloat((radius * 2 * Math.PI).toFixed(4))
  const strokeDashoffset = parseFloat((circumference - (score / 100) * circumference).toFixed(4))

  // Color mapping based on health score
  const getColor = (val: number) => {
    if (val >= 80) return "var(--success)"
    if (val >= 60) return "var(--warning)"
    return "var(--destructive)"
  }

  const ringColor = getColor(score)

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(245, 166, 35, 0.05)"
          strokeWidth={strokeWidth}
        />
        {/* Progress Ring */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={ringColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          strokeLinecap="round"
        />
      </svg>
      {/* Centered Score */}
      <div className="absolute flex flex-col items-center justify-center">
        <motion.span 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="font-[family-name:var(--font-space-grotesk)] text-3xl font-extrabold text-ivory"
        >
          {score}
        </motion.span>
        <span className="text-[10px] uppercase tracking-wider text-ivory/40 font-semibold">Index</span>
      </div>
    </div>
  )
}
