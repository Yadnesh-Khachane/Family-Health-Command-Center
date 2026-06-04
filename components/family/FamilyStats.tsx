"use client"

import React from "react"
import { motion } from "framer-motion"
import { Users, Baby, User, UserCheck, ShieldAlert } from "lucide-react"
import { fadeInUp, staggerContainer } from "./animations"

interface FamilyStatsProps {
  totalMembers: number
  childrenCount: number
  adultsCount: number
  seniorsCount: number
  activeCases: number
}

export function FamilyStats({
  totalMembers,
  childrenCount,
  adultsCount,
  seniorsCount,
  activeCases
}: FamilyStatsProps) {
  const cards = [
    {
      label: "Total Members",
      value: totalMembers,
      icon: Users,
      colorClass: "text-amber",
      bgClass: "bg-amber/10 border-amber/20"
    },
    {
      label: "Children",
      value: childrenCount,
      icon: Baby,
      colorClass: "text-blue-400",
      bgClass: "bg-blue-400/10 border-blue-400/20"
    },
    {
      label: "Adults",
      value: adultsCount,
      icon: User,
      colorClass: "text-success",
      bgClass: "bg-success/10 border-success/20"
    },
    {
      label: "Seniors",
      value: seniorsCount,
      icon: UserCheck,
      colorClass: "text-purple-400",
      bgClass: "bg-purple-400/10 border-purple-400/20"
    },
    {
      label: "Active Cases",
      value: activeCases,
      icon: ShieldAlert,
      colorClass: "text-destructive",
      bgClass: "bg-destructive/10 border-destructive/20"
    }
  ]

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 md:grid-cols-5 gap-4"
    >
      {cards.map((card, idx) => (
        <motion.div
          key={card.label}
          variants={fadeInUp}
          whileHover={{ y: -4, borderColor: "rgba(255, 255, 255, 0.15)" }}
          className="frosted-panel rounded-2xl p-4 border border-white/5 flex flex-col justify-between h-32 transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-wider text-ivory/40">
              {card.label}
            </span>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${card.bgClass} ${card.colorClass}`}>
              <card.icon className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="font-[family-name:var(--font-space-grotesk)] text-3xl font-black text-white">
              {card.value}
            </span>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}
