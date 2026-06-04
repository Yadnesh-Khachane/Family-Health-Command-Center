"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { MapPin, Phone, Hospital, Shield, Save, CheckCircle } from "lucide-react"
import { fadeInUp } from "./animations"

interface ProfileSidebarProps {
  initialAddress: string
  initialEmergencyContact: string
  initialHospital: string
  initialInsurance: string
  avatarText: string
  onSave?: (data: { address: string; emergencyContact: string; hospital: string; insurance: string }) => void
}

export function ProfileSidebar({
  initialAddress,
  initialEmergencyContact,
  initialHospital,
  initialInsurance,
  avatarText,
  onSave
}: ProfileSidebarProps) {
  const [address, setAddress] = useState(initialAddress)
  const [emergencyContact, setEmergencyContact] = useState(initialEmergencyContact)
  const [hospital, setHospital] = useState(initialHospital)
  const [insurance, setInsurance] = useState(initialInsurance)
  const [isEditing, setIsEditing] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSave) {
      onSave({ address, emergencyContact, hospital, insurance })
    }
    setIsEditing(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="show"
      className="frosted-panel rounded-3xl p-6 border border-white/5 space-y-6"
    >
      <div className="flex flex-col items-center text-center space-y-4 pb-4 border-b border-white/5">
        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-terracotta to-amber flex items-center justify-center text-3xl font-black text-obsidian shadow-xl shadow-terracotta/15 select-none relative overflow-hidden">
          <span className="relative z-10">{avatarText}</span>
          <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
            <span className="text-[10px] text-white font-bold uppercase">Change</span>
          </div>
        </div>
        <div>
          <h3 className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold text-white">Sharma Residence</h3>
          <p className="text-xs text-white/50">Navi Mumbai, India</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        {/* Address */}
        <div className="space-y-1.5">
          <label className="text-[9px] uppercase tracking-wider font-bold text-white/40 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-amber" />
            Family Address
          </label>
          {isEditing ? (
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full text-xs bg-white/5 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber/40 resize-none h-18"
            />
          ) : (
            <p className="text-xs text-white/80 leading-relaxed font-medium bg-white/5 border border-white/5 rounded-xl p-2.5">
              {address}
            </p>
          )}
        </div>

        {/* Emergency Contact */}
        <div className="space-y-1.5">
          <label className="text-[9px] uppercase tracking-wider font-bold text-white/40 flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-destructive" />
            Emergency Contact
          </label>
          {isEditing ? (
            <input
              type="text"
              value={emergencyContact}
              onChange={(e) => setEmergencyContact(e.target.value)}
              className="w-full text-xs bg-white/5 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber/40"
            />
          ) : (
            <p className="text-xs text-white/80 font-mono font-medium bg-white/5 border border-white/5 rounded-xl p-2.5">
              {emergencyContact}
            </p>
          )}
        </div>

        {/* Preferred Hospital */}
        <div className="space-y-1.5">
          <label className="text-[9px] uppercase tracking-wider font-bold text-white/40 flex items-center gap-1.5">
            <Hospital className="w-3.5 h-3.5 text-success" />
            Preferred Hospital
          </label>
          {isEditing ? (
            <input
              type="text"
              value={hospital}
              onChange={(e) => setHospital(e.target.value)}
              className="w-full text-xs bg-white/5 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber/40"
            />
          ) : (
            <p className="text-xs text-white/80 font-medium bg-white/5 border border-white/5 rounded-xl p-2.5">
              {hospital}
            </p>
          )}
        </div>

        {/* Insurance */}
        <div className="space-y-1.5">
          <label className="text-[9px] uppercase tracking-wider font-bold text-white/40 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-blue-400" />
            Family Insurance Policy
          </label>
          {isEditing ? (
            <input
              type="text"
              value={insurance}
              onChange={(e) => setInsurance(e.target.value)}
              className="w-full text-xs bg-white/5 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber/40"
            />
          ) : (
            <p className="text-xs text-white/80 font-medium bg-white/5 border border-white/5 rounded-xl p-2.5">
              {insurance}
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="pt-2">
          {isEditing ? (
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-amber hover:bg-amber/90 text-obsidian text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              Save Identity Settings
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold rounded-xl transition-all"
              >
                Modify Identity
              </button>
              {saved && (
                <div className="shrink-0 p-2 rounded-xl bg-success/20 border border-success/30 text-success flex items-center justify-center" title="Saved">
                  <CheckCircle className="w-4 h-4" />
                </div>
              )}
            </div>
          )}
        </div>
      </form>
    </motion.div>
  )
}
