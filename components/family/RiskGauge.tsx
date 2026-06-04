"use client"

import React from "react"
import { motion } from "framer-motion"

interface RiskGaugeProps {
  score: number
  title?: string
  label?: string
  className?: string
}

export function RiskGauge({ score, title, label = "High Risk", className = "" }: RiskGaugeProps) {
  // Convert 0-100 score to 0-180 degree angle
  const angle = (score / 100) * 180
  
  // Calculate needle tip position on a 100x50 SVG viewport (radius 40, center at 50,50)
  const rad = (Math.PI * (180 - angle)) / 180
  const needleX = parseFloat((50 + 30 * Math.cos(rad)).toFixed(4))
  const needleY = parseFloat((50 - 30 * Math.sin(rad)).toFixed(4))

  const getRiskColor = (val: number) => {
    if (val >= 75) return "var(--destructive)"
    if (val >= 45) return "var(--warning)"
    return "var(--success)"
  }

  const riskColor = getRiskColor(score)

  return (
    <div className={`frosted-panel rounded-2xl p-5 flex flex-col items-center justify-center ${className}`}>
      {title && (
        <h4 className="text-xs uppercase tracking-wider text-ivory/50 font-semibold mb-4 text-center">
          {title}
        </h4>
      )}

      <div className="relative w-40 h-20">
        <svg viewBox="0 0 100 50" className="w-full h-full">
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--success)" />
              <stop offset="50%" stopColor="var(--warning)" />
              <stop offset="100%" stopColor="var(--destructive)" />
            </linearGradient>
          </defs>
          {/* Base Track */}
          <path
            d="M 10 50 A 40 40 0 0 1 90 50"
            fill="none"
            stroke="rgba(245,166,35,0.05)"
            strokeWidth="8"
            strokeLinecap="round"
          />
          {/* Active Gradient Range */}
          <path
            d="M 10 50 A 40 40 0 0 1 90 50"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray="126"
            strokeDashoffset={126 - (score / 100) * 126}
          />
          {/* Center Point */}
          <circle cx="50" cy="50" r="4" fill="var(--ivory)" />
          {/* Animated Needle */}
          <motion.line
            x1="50"
            y1="50"
            x2={needleX}
            y2={needleY}
            stroke="var(--ivory)"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ x2: 20, y2: 50 }}
            animate={{ x2: needleX, y2: needleY }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </svg>

        <div className="absolute bottom-0 left-0 right-0 text-center flex flex-col items-center">
          <span className="text-2xl font-[family-name:var(--font-space-grotesk)] font-bold text-ivory">
            {score}%
          </span>
        </div>
      </div>

      <div className="mt-3 text-center">
        <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: riskColor }}>
          {label}
        </p>
      </div>
    </div>
  )
}
