"use client"

import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ShieldAlert, Key, Heart, Calendar } from "lucide-react"

interface RelationshipInspectorProps {
  isOpen: boolean
  onClose: () => void
  fromMemberName: string
  toMemberName: string
  relationshipType: string
}

export function RelationshipInspector({
  isOpen,
  onClose,
  fromMemberName,
  toMemberName,
  relationshipType
}: RelationshipInspectorProps) {
  if (!isOpen) return null

  // Get mock descriptive details based on the selected relationship type
  const getRelationDetails = () => {
    switch (relationshipType) {
      case "spouse":
        return {
          title: "Marriage / Partner Union",
          desc: `${fromMemberName} is legally married to ${toMemberName}. Connected since October 2005.`,
          implication: "Consent records permit immediate medical proxy override permissions for each other unless explicitly revoked.",
          badgeClass: "bg-terracotta/10 border-terracotta/20 text-terracotta"
        }
      case "parent-child":
        return {
          title: "Direct Lineage (Parent → Child)",
          desc: `${fromMemberName} is the biological parent of ${toMemberName}.`,
          implication: "Inherited cardiac and metabolic risk factors are automatically propagated on risk overlays (50% direct DNA coefficient).",
          badgeClass: "bg-amber/10 border-amber/20 text-amber"
        }
      case "sibling":
        return {
          title: "Sibling Bond",
          desc: `${fromMemberName} and ${toMemberName} are biological siblings.`,
          implication: "Shares matching HLA antigen compatibility profiles for donor compatibility matching (25% match probability).",
          badgeClass: "bg-success/10 border-success/20 text-success"
        }
      case "guardian":
        return {
          title: "Legal Guardian Delegation",
          desc: `${fromMemberName} is the designated legal guardian of ${toMemberName}.`,
          implication: "Designee retains proxy signature rights for pediatric immunization approvals and hospital consent agreements.",
          badgeClass: "bg-blue-400/10 border-blue-400/20 text-blue-400"
        }
      case "emergency":
        return {
          title: "Emergency Dependency Gate",
          desc: `${fromMemberName} has emergency care dependence on ${toMemberName}.`,
          implication: "Crisis Override automatically shares vitals history, active prescriptions, and implant recall codes.",
          badgeClass: "bg-destructive/10 border-destructive/20 text-destructive animate-pulse"
        }
      case "medical":
        return {
          title: "Medical Proxy Linkage",
          desc: `${fromMemberName} designates ${toMemberName} as primary medical proxy.`,
          implication: "Proxy has legal authorization to query complete clinical histories, revision surgery records, and FDA registries.",
          badgeClass: "bg-purple-400/10 border-purple-400/20 text-purple-400"
        }
      default:
        return {
          title: "Active Household Connection",
          desc: `Link active between ${fromMemberName} and ${toMemberName}.`,
          implication: "Verified by zero-knowledge secure registry keys.",
          badgeClass: "bg-white/5 border-white/5 text-ivory/60"
        }
    }
  }

  const details = getRelationDetails()

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 15 }}
        className="frosted-panel rounded-3xl p-5 border border-white/10 bg-charcoal/95 backdrop-blur-xl shadow-2xl relative max-w-sm w-full z-40 space-y-4"
      >
        {/* Header */}
        <div className="flex justify-between items-start pb-3 border-b border-white/5">
          <div>
            <span className={`inline-block px-2.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider border mb-1.5 ${details.badgeClass}`}>
              {relationshipType}
            </span>
            <h4 className="font-heading font-extrabold text-white text-sm">{details.title}</h4>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full bg-white/5 text-white/50 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Info */}
        <div className="space-y-3 text-xs leading-normal">
          <p className="text-white/80 font-medium">{details.desc}</p>
          
          <div className="p-3 bg-white/5 border border-white/5 rounded-2xl space-y-2">
            <span className="text-[9px] uppercase tracking-wider font-bold text-white/40 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-amber" />
              Consent Implications
            </span>
            <p className="text-[11px] text-white/60 font-medium leading-relaxed">
              {details.implication}
            </p>
          </div>
        </div>

        {/* Audit footer */}
        <div className="flex items-center gap-1 text-[9px] text-white/30 uppercase font-semibold">
          <ShieldAlert className="w-3.5 h-3.5" />
          Zero-trust verified link audit
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
export default RelationshipInspector
