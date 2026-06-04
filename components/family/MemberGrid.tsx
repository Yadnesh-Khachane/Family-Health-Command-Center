"use client"

import React, { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { 
  ExternalLink, 
  Edit2, 
  ShieldAlert, 
  Heart, 
  Calendar, 
  Pill,
  MoreVertical,
  Archive,
  UserCheck,
  Combine
} from "lucide-react"
import { FamilyMember } from "@/types/family"
import { StatusOrb } from "./StatusOrb"
import { fadeInUp, staggerContainer } from "./animations"

interface MemberGridProps {
  members: FamilyMember[]
  onEditMember?: (member: FamilyMember) => void
  onArchiveMember?: (member: FamilyMember) => void
  onTransferOwnership?: (member: FamilyMember) => void
  onMergeDuplicate?: (member: FamilyMember) => void
}

export function MemberGrid({ 
  members, 
  onEditMember,
  onArchiveMember,
  onTransferOwnership,
  onMergeDuplicate
}: MemberGridProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  const toggleMenu = (id: string) => {
    if (openMenuId === id) {
      setOpenMenuId(null)
    } else {
      setOpenMenuId(id)
    }
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 gap-6"
    >
      {members.map((member) => (
        <motion.div
          key={member.id}
          variants={fadeInUp}
          whileHover={{ y: -4, borderColor: "rgba(255, 255, 255, 0.12)" }}
          className="frosted-panel rounded-3xl p-5 border border-white/5 flex flex-col justify-between gap-4 transition-all duration-300 relative overflow-hidden"
        >
          {/* Subtle accent light depending on status */}
          <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-10 pointer-events-none ${
            member.status === "critical" 
              ? "bg-destructive" 
              : member.status === "warning" 
              ? "bg-amber" 
              : "bg-success"
          }`} />

          <div className="flex items-start justify-between z-10">
            <div className="flex items-center gap-4">
              {/* Avatar Container */}
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-white/5 to-white/15 border border-white/10 flex items-center justify-center text-lg font-black text-ivory select-none">
                  {member.initials}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-charcoal rounded-full p-1 border border-white/5">
                  <StatusOrb status={member.status} className="w-3.5 h-3.5" />
                </div>
              </div>

              <div>
                <h4 className="font-[family-name:var(--font-space-grotesk)] font-bold text-white text-base">
                  {member.name}
                </h4>
                <p className="text-xs text-white/50 mt-0.5">
                  {member.relation} • Age {member.age}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 relative z-20">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-ivory/60">
                {member.bloodGroup}
              </span>
              
              {/* Options Toggle */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => toggleMenu(member.id)}
                  className="p-1 rounded-lg bg-white/5 border border-white/5 hover:border-white/20 text-white/60 hover:text-white transition-all cursor-pointer"
                >
                  <MoreVertical className="w-4.5 h-4.5" />
                </button>

                <AnimatePresence>
                  {openMenuId === member.id && (
                    <>
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setOpenMenuId(null)}
                      />
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -5 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -5 }}
                        className="absolute right-0 mt-1.5 w-40 rounded-xl bg-charcoal/95 border border-white/10 p-1.5 shadow-2xl z-20 text-[11px] font-semibold text-white/80"
                      >
                        <button
                          type="button"
                          onClick={() => {
                            onTransferOwnership?.(member)
                            setOpenMenuId(null)
                          }}
                          className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 text-left text-white/70 hover:text-white"
                        >
                          <UserCheck className="w-3.5 h-3.5 text-amber" />
                          Transfer Admin
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            onMergeDuplicate?.(member)
                            setOpenMenuId(null)
                          }}
                          className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 text-left text-white/70 hover:text-white"
                        >
                          <Combine className="w-3.5 h-3.5 text-blue-400" />
                          Merge Duplicate
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            onArchiveMember?.(member)
                            setOpenMenuId(null)
                          }}
                          className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-destructive/10 hover:text-destructive text-left text-white/70"
                        >
                          <Archive className="w-3.5 h-3.5 text-destructive" />
                          Archive Member
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-3 z-10 text-xs">
            <div className="p-3 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-2">
              <Pill className="w-4 h-4 text-amber shrink-0" />
              <div>
                <p className="text-[9px] uppercase font-semibold text-white/40 leading-none">Meds</p>
                <p className="font-bold text-white mt-1">{member.medicationCount} Active</p>
              </div>
            </div>

            <div className="p-3 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-2">
              <Calendar className="w-4 h-4 text-success shrink-0" />
              <div>
                <p className="text-[9px] uppercase font-semibold text-white/40 leading-none">Checkup</p>
                <p className="font-bold text-white mt-1">{member.lastCheckup}</p>
              </div>
            </div>
          </div>

          {/* Alert Warning banner if critical */}
          {member.alertText && (
            <div className="px-3.5 py-2 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive flex items-center gap-2 text-xs font-semibold critical-blink z-10">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span className="truncate">{member.alertText}</span>
            </div>
          )}

          {/* Actions Footer */}
          <div className="flex items-center gap-2 border-t border-white/5 pt-3.5 mt-2 z-10 justify-end">
            <button
              onClick={() => onEditMember?.(member)}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-xs text-white/70 hover:text-white font-semibold transition-colors flex items-center gap-1.5"
            >
              <Edit2 className="w-3.5 h-3.5" />
              Edit
            </button>
            <Link href={`/family/members/${member.id}`} className="w-full sm:w-auto">
              <button className="w-full px-4.5 py-1.5 rounded-xl bg-amber text-obsidian text-xs font-black transition-colors flex items-center justify-center gap-1.5 hover:bg-amber/90">
                Open Dossier
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </Link>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}
export default MemberGrid
