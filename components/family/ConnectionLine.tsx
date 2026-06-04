"use client"

import React from "react"
import { motion } from "framer-motion"

interface ConnectionLineProps {
  fromX: number
  fromY: number
  toX: number
  toY: number
  dashed?: boolean
  layoutMode: "vertical" | "horizontal" | "radial"
}

export function ConnectionLine({
  fromX,
  fromY,
  toX,
  toY,
  dashed = false,
  layoutMode
}: ConnectionLineProps) {
  // Compute Bezier control points depending on layout orientation
  let pathD = ""
  if (layoutMode === "vertical") {
    // Vertical curve: split vertically
    const midY = (fromY + toY) / 2
    pathD = `M ${fromX} ${fromY} C ${fromX} ${midY}, ${toX} ${midY}, ${toX} ${toY}`
  } else if (layoutMode === "horizontal") {
    // Horizontal curve: split horizontally
    const midX = (fromX + toX) / 2
    pathD = `M ${fromX} ${fromY} C ${midX} ${fromY}, ${midX} ${toY}, ${toX} ${toY}`
  } else {
    // Radial simple line
    pathD = `M ${fromX} ${fromY} L ${toX} ${toY}`
  }

  return (
    <motion.path
      d={pathD}
      fill="none"
      stroke="var(--amber)"
      strokeWidth={dashed ? "1.5" : "2"}
      strokeOpacity={dashed ? "0.2" : "0.45"}
      strokeDasharray={dashed ? "4 4" : "0"}
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 1.2, ease: "easeInOut" }}
    />
  )
}
export default ConnectionLine
