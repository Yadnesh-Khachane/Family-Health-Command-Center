"use client"

import React, { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { 
  ArrowLeft, 
  Settings, 
  ShieldAlert, 
  Lock, 
  Eye, 
  CheckCircle,
  Clock,
  RefreshCw,
  Sliders
} from "lucide-react"

import { fadeInUp, staggerContainer } from "@/components/family/animations"

// Simulated HIPAA compliance security audits
const securityAudits = [
  { id: "sa1", timestamp: "2026-06-04 10:15", event: "EMR Export Requested", status: "Success", user: "Rajesh Sharma", client: "Family Dashboard Portal (Web)" },
  { id: "sa2", timestamp: "2026-06-03 14:12", event: "Consent Level Modification", status: "Success", user: "Priya Sharma", client: "Guardian API Bridge" },
  { id: "sa3", timestamp: "2026-06-01 09:30", event: "HIPAA Audit Trail Exported", status: "Success", user: "Rajesh Sharma", client: "Admin Audit Console" },
  { id: "sa4", timestamp: "2026-05-28 11:22", event: "Access Revocation", status: "Success", user: "Rajesh Sharma", client: "Zero-Trust Gatekeeper" }
]

export default function SettingsPage() {
  const [phone, setPhone] = useState("+91 98765 43210")
  const [email, setEmail] = useState("family@sharma.com")
  const [scanning, setScanning] = useState(true)
  const [predictions, setPredictions] = useState(true)
  const [mfa, setMfa] = useState(true)
  const [toast, setToast] = useState<string | null>(null)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setToast("Security configurations updated and signed.")
    setTimeout(() => setToast(null), 3000)
  }

  return (
    <main className="max-w-[1200px] mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <div>
        <Link href="/family/dashboard" className="flex items-center gap-2 text-xs text-ivory/60 hover:text-amber font-semibold uppercase tracking-wider transition-colors mb-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-2xl md:text-3xl font-extrabold text-ivory tracking-tight">
          System Settings &amp; Security
        </h1>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-lg frosted-glass border border-amber/30 bg-charcoal"
          >
            <p className="text-ivory text-xs font-semibold">{toast}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* Left Columns: Configuration Settings Form */}
        <motion.div variants={fadeInUp} className="lg:col-span-2 space-y-6">
          <div className="frosted-panel rounded-3xl p-6 border border-white/5 space-y-6">
            <h3 className="font-[family-name:var(--font-space-grotesk)] text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-amber" />
              Surveillance &amp; Contact Configurations
            </h3>

            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-bold text-white/40 block mb-1">Coordinator Emergency Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-xs text-ivory focus:outline-none focus:border-amber/40"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-white/40 block mb-1">Alert Email Group</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-xs text-ivory focus:outline-none focus:border-amber/40"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-4 pt-4 border-t border-white/5">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-xs font-bold text-white">Cross-Family Predictive Scanning</h4>
                    <p className="text-[10px] text-white/50 mt-0.5">Allows algorithms to evaluate family risk indexes in cohorts.</p>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setScanning(!scanning)}
                    className={`w-12 h-6 rounded-full p-1 transition-colors ${
                      scanning ? "bg-amber" : "bg-white/10"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-obsidian transition-transform ${
                      scanning ? "translate-x-6" : "translate-x-0"
                    }`} />
                  </button>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-xs font-bold text-white">Real-Time Risk Predictions</h4>
                    <p className="text-[10px] text-white/50 mt-0.5">Enable continuous alerts on medication interactions.</p>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setPredictions(!predictions)}
                    className={`w-12 h-6 rounded-full p-1 transition-colors ${
                      predictions ? "bg-amber" : "bg-white/10"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-obsidian transition-transform ${
                      predictions ? "translate-x-6" : "translate-x-0"
                    }`} />
                  </button>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-xs font-bold text-white">Require Multi-Factor Authentication</h4>
                    <p className="text-[10px] text-white/50 mt-0.5">Enforces biometric checks during EMR downloads.</p>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setMfa(!mfa)}
                    className={`w-12 h-6 rounded-full p-1 transition-colors ${
                      mfa ? "bg-amber" : "bg-white/10"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-obsidian transition-transform ${
                      mfa ? "translate-x-6" : "translate-x-0"
                    }`} />
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-full bg-terracotta hover:bg-terracotta-dark text-white text-xs font-bold uppercase tracking-wider transition-colors mt-6"
              >
                Save Settings
              </button>
            </form>
          </div>
        </motion.div>

        {/* Right Column: HIPAA Compliance Certifications */}
        <motion.div variants={fadeInUp} className="space-y-6">
          <div className="frosted-panel rounded-3xl p-6 border border-white/5 space-y-4">
            <div className="flex items-center gap-2 text-success">
              <CheckCircle className="w-5 h-5" />
              <h3 className="font-[family-name:var(--font-space-grotesk)] text-sm font-bold text-white">Compliance Status</h3>
            </div>
            <p className="text-xs text-white/70 leading-relaxed">
              This client vault operates under AES-256 zero-knowledge encryption protocols and matches HIPAA Title II requirements for electronic storage.
            </p>
          </div>

          <div className="frosted-panel rounded-3xl p-6 border border-white/5 space-y-4">
            <h3 className="font-[family-name:var(--font-space-grotesk)] text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4.5 h-4.5 text-amber" />
              HIPAA Access Logs
            </h3>
            <div className="space-y-3">
              {securityAudits.map(log => (
                <div key={log.id} className="p-3 rounded-xl bg-white/5 border border-white/5 text-[11px] leading-relaxed">
                  <div className="flex justify-between items-center text-[9px] text-white/50">
                    <span>{log.timestamp}</span>
                    <span className="text-success font-semibold">{log.status}</span>
                  </div>
                  <p className="font-bold text-white mt-1">{log.event}</p>
                  <p className="text-white/60">{log.user} via {log.client}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </main>
  )
}
