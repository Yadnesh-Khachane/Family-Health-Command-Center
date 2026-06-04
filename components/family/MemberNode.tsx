"use client"

import React from "react"
import { motion } from "framer-motion"
import { FamilyMember } from "@/types/family"
import { StatusOrb } from "./StatusOrb"

interface MemberNodeProps {
  member: FamilyMember
  isSelected?: boolean
  onClick?: () => void
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  className?: string
}

export function MemberNode({
  member,
  isSelected = false,
  onClick,
  onMouseEnter,
  onMouseLeave,
  className = ""
}: MemberNodeProps) {
  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`relative w-20 h-20 rounded-full frosted-panel flex items-center justify-center cursor-pointer transition-all duration-300 ${
        isSelected ? "border-terracotta border-2 node-selected" : "border border-amber/10 hover:border-amber/50"
      } ${className}`}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.96 }}
    >
      <div className="flex flex-col items-center">
        <span className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold text-ivory">
          {member.initials}
        </span>
        <span className="text-[9px] uppercase tracking-wide text-ivory/40 font-semibold mt-0.5">
          {member.relation.substring(0, 5)}
        </span>
      </div>
      <StatusOrb status={member.status} className="absolute top-1.5 right-1.5" />
    </motion.button>
  )
}
export default MemberNode
