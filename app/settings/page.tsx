"use client"

import React, { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { 
  ArrowLeft, 
  Monitor, 
  Shield, 
  Bell, 
  Database, 
  ShieldCheck, 
  Accessibility as AccessIcon, 
  CheckCircle,
  RotateCcw
} from "lucide-react"
import { fadeInUp, staggerContainer } from "@/components/family/animations"

export default function UserSettingsPage() {
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Appearance States
  const [compactUi, setCompactUi] = useState(false)
  const [spaceFont, setSpaceFont] = useState(true)

  // Security States
  const [twoFactor, setTwoFactor] = useState(true)
  const [autoLogout, setAutoLogout] = useState("15")

  // Notification States
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [smsAlerts, setSmsAlerts] = useState(true)

  // Consent States
  const [emergencyBypass, setEmergencyBypass] = useState(true)
  const [promptLink, setPromptLink] = useState(true)

  // Accessibility States
  const [highContrast, setHighContrast] = useState(false)
  const [largeText, setLargeText] = useState(false)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const handleResetSettings = () => {
    setCompactUi(false)
    setSpaceFont(true)
    setTwoFactor(true)
    setAutoLogout("15")
    setEmailAlerts(true)
    setSmsAlerts(true)
    setEmergencyBypass(true)
    setPromptLink(true)
    setHighContrast(false)
    setLargeText(false)
    showToast("Settings reset to factory defaults.")
  }

  return (
    <main className="max-w-[1200px] mx-auto px-6 py-12 space-y-8 select-none">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-lg frosted-glass border border-amber/30 bg-charcoal shadow-2xl"
          >
            <p className="text-ivory text-xs font-semibold">{toastMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Headers */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Link href="/family/dashboard" className="flex items-center gap-2 text-xs text-ivory/60 hover:text-amber font-semibold uppercase tracking-wider transition-colors mb-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h2 className="font-heading font-black text-2xl md:text-3xl text-ivory tracking-tight">
            Account Preferences &amp; Config
          </h2>
        </div>

        <button
          onClick={handleResetSettings}
          className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 hover:border-amber/20 text-xs font-bold text-white transition-all flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Settings
        </button>
      </div>

      {/* Grid configuration panels */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        {/* 1. APPEARANCE PANEL */}
        <motion.div variants={fadeInUp} className="frosted-panel rounded-3xl p-6 border border-white/5 space-y-4">
          <h3 className="font-heading text-sm font-extrabold text-white flex items-center gap-2">
            <Monitor className="w-4.5 h-4.5 text-amber" />
            Appearance Toggles
          </h3>
          <p className="text-[11px] text-white/50">Personalize your layout font styles and panels spacing</p>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded-2xl">
              <div>
                <h4 className="text-xs font-bold text-white font-heading">Space Grotesk Font</h4>
                <p className="text-[9px] text-white/40 mt-0.5">Toggle heading styling between Sans and Space Grotesk</p>
              </div>
              <input
                type="checkbox"
                checked={spaceFont}
                onChange={(e) => setSpaceFont(e.target.checked)}
                className="w-4 h-4 rounded border-white/10 bg-white/5 text-amber focus:ring-0 focus:ring-offset-0 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded-2xl">
              <div>
                <h4 className="text-xs font-bold text-white font-heading">Compact Viewport</h4>
                <p className="text-[9px] text-white/40 mt-0.5">Minimize panel paddings for detailed grid inspections</p>
              </div>
              <input
                type="checkbox"
                checked={compactUi}
                onChange={(e) => setCompactUi(e.target.checked)}
                className="w-4 h-4 rounded border-white/10 bg-white/5 text-amber focus:ring-0 focus:ring-offset-0 cursor-pointer"
              />
            </div>
          </div>
        </motion.div>

        {/* 2. SECURITY PANEL */}
        <motion.div variants={fadeInUp} className="frosted-panel rounded-3xl p-6 border border-white/5 space-y-4">
          <h3 className="font-heading text-sm font-extrabold text-white flex items-center gap-2">
            <Shield className="w-4.5 h-4.5 text-terracotta" />
            Security &amp; MFA Settings
          </h3>
          <p className="text-[11px] text-white/50">Configure access authorization levels and auto timeout rules</p>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded-2xl">
              <div>
                <h4 className="text-xs font-bold text-white font-heading">2-Factor Authentication</h4>
                <p className="text-[9px] text-white/40 mt-0.5">Require TOTP token for clinical key revisions</p>
              </div>
              <input
                type="checkbox"
                checked={twoFactor}
                onChange={(e) => setTwoFactor(e.target.checked)}
                className="w-4 h-4 rounded border-white/10 bg-white/5 text-amber focus:ring-0 focus:ring-offset-0 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded-2xl">
              <div>
                <h4 className="text-xs font-bold text-white font-heading">Auto Logout Timeout</h4>
                <p className="text-[9px] text-white/40 mt-0.5">Log out of credentials after inactivity interval</p>
              </div>
              <select
                value={autoLogout}
                onChange={(e) => setAutoLogout(e.target.value)}
                className="text-xs bg-charcoal border border-white/10 rounded-lg p-1.5 text-white focus:outline-none"
              >
                <option value="5">5 Minutes</option>
                <option value="15">15 Minutes</option>
                <option value="30">30 Minutes</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* 3. NOTIFICATIONS PANEL */}
        <motion.div variants={fadeInUp} className="frosted-panel rounded-3xl p-6 border border-white/5 space-y-4">
          <h3 className="font-heading text-sm font-extrabold text-white flex items-center gap-2">
            <Bell className="w-4.5 h-4.5 text-success" />
            Notification Settings
          </h3>
          <p className="text-[11px] text-white/50">Configure alert preferences for medical events and logins</p>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded-2xl">
              <div>
                <h4 className="text-xs font-bold text-white font-heading">Email Alerts</h4>
                <p className="text-[9px] text-white/40 mt-0.5">Receive summary reports on consent access events</p>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 rounded border-white/10 bg-white/5 text-amber focus:ring-0 focus:ring-offset-0 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded-2xl">
              <div>
                <h4 className="text-xs font-bold text-white font-heading">SMS Emergency Broadcast</h4>
                <p className="text-[9px] text-white/40 mt-0.5">Dispatch high-priority SMS during Crisis Override triggers</p>
              </div>
              <input
                type="checkbox"
                checked={smsAlerts}
                onChange={(e) => setSmsAlerts(e.target.checked)}
                className="w-4 h-4 rounded border-white/10 bg-white/5 text-amber focus:ring-0 focus:ring-offset-0 cursor-pointer"
              />
            </div>
          </div>
        </motion.div>

        {/* 4. CONSENT PREFERENCES */}
        <motion.div variants={fadeInUp} className="frosted-panel rounded-3xl p-6 border border-white/5 space-y-4">
          <h3 className="font-heading text-sm font-extrabold text-white flex items-center gap-2">
            <ShieldCheck className="w-4.5 h-4.5 text-blue-400" />
            Consent Preferences
          </h3>
          <p className="text-[11px] text-white/50">Manage default verification and proxy gates overrides</p>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded-2xl">
              <div>
                <h4 className="text-xs font-bold text-white font-heading">Auto-Emergency Bypass</h4>
                <p className="text-[9px] text-white/40 mt-0.5">Grant paramedic bypass rights for first responders</p>
              </div>
              <input
                type="checkbox"
                checked={emergencyBypass}
                onChange={(e) => setEmergencyBypass(e.target.checked)}
                className="w-4 h-4 rounded border-white/10 bg-white/5 text-amber focus:ring-0 focus:ring-offset-0 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded-2xl">
              <div>
                <h4 className="text-xs font-bold text-white font-heading">Verification Prompts</h4>
                <p className="text-[9px] text-white/40 mt-0.5">Prompt for confirmation before linking new hospital systems</p>
              </div>
              <input
                type="checkbox"
                checked={promptLink}
                onChange={(e) => setPromptLink(e.target.checked)}
                className="w-4 h-4 rounded border-white/10 bg-white/5 text-amber focus:ring-0 focus:ring-offset-0 cursor-pointer"
              />
            </div>
          </div>
        </motion.div>

        {/* 5. ACCESSIBILITY OPTIONS */}
        <motion.div variants={fadeInUp} className="frosted-panel rounded-3xl p-6 border border-white/5 space-y-4">
          <h3 className="font-heading text-sm font-extrabold text-white flex items-center gap-2">
            <AccessIcon className="w-4.5 h-4.5 text-purple-400" />
            Accessibility Tools
          </h3>
          <p className="text-[11px] text-white/50">Manage contrast ratios and screen scaling layouts</p>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded-2xl">
              <div>
                <h4 className="text-xs font-bold text-white font-heading">High Contrast Mode</h4>
                <p className="text-[9px] text-white/40 mt-0.5">Enhance text contours for medical records visibility</p>
              </div>
              <input
                type="checkbox"
                checked={highContrast}
                onChange={(e) => setHighContrast(e.target.checked)}
                className="w-4 h-4 rounded border-white/10 bg-white/5 text-amber focus:ring-0 focus:ring-offset-0 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded-2xl">
              <div>
                <h4 className="text-xs font-bold text-white font-heading">Scalable Text</h4>
                <p className="text-[9px] text-white/40 mt-0.5">Increase system typography sizes by 20%</p>
              </div>
              <input
                type="checkbox"
                checked={largeText}
                onChange={(e) => setLargeText(e.target.checked)}
                className="w-4 h-4 rounded border-white/10 bg-white/5 text-amber focus:ring-0 focus:ring-offset-0 cursor-pointer"
              />
            </div>
          </div>
        </motion.div>

        {/* 6. DATA EXPORT PACKS */}
        <motion.div variants={fadeInUp} className="frosted-panel rounded-3xl p-6 border border-white/5 space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <h3 className="font-heading text-sm font-extrabold text-white flex items-center gap-2">
              <Database className="w-4.5 h-4.5 text-blue-400" />
              EHR Portability Hub
            </h3>
            <p className="text-[11px] text-white/50">Download full medical registries under portable secure formats</p>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
            <button
              onClick={() => showToast("Exported JSON medical history bundle.")}
              className="py-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl font-bold transition-all text-ivory/80 hover:text-white flex items-center justify-center gap-1.5"
            >
              <Database className="w-4 h-4" />
              Export EMR JSON
            </button>
            <button
              onClick={() => showToast("Exported FHIR Patient Resource XML.")}
              className="py-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl font-bold transition-all text-ivory/80 hover:text-white flex items-center justify-center gap-1.5"
            >
              <CheckCircle className="w-4 h-4 text-success" />
              Export FHIR XML
            </button>
          </div>
        </motion.div>
      </motion.div>
    </main>
  )
}
