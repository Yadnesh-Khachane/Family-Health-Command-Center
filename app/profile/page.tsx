"use client"

import React, { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { 
  ArrowLeft, 
  User, 
  ShieldCheck, 
  Hospital, 
  History, 
  Lock, 
  Bell, 
  Download, 
  Key,
  Database
} from "lucide-react"
import { StatusOrb } from "@/components/family/StatusOrb"
import { fadeInUp, staggerContainer } from "@/components/family/animations"

export default function UserProfilePage() {
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
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

      {/* Back button */}
      <div>
        <Link href="/family/dashboard" className="flex items-center gap-2 text-xs text-ivory/60 hover:text-amber font-semibold uppercase tracking-wider transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
      >
        
        {/* Left Column: Avatar & Account Info */}
        <motion.div 
          variants={fadeInUp} 
          className="lg:col-span-4 space-y-6"
        >
          <div className="frosted-panel rounded-3xl p-6 border border-white/5 text-center space-y-4">
            <div className="relative w-28 h-28 mx-auto">
              <div className="w-full h-full rounded-2xl bg-gradient-to-br from-terracotta to-amber flex items-center justify-center text-4xl font-black text-obsidian font-heading shadow-xl shadow-terracotta/15">
                RS
              </div>
              <div className="absolute -bottom-1 -right-1 bg-charcoal rounded-full p-1.5 border border-white/10">
                <StatusOrb status="warning" className="w-4.5 h-4.5" />
              </div>
            </div>

            <div>
              <h3 className="font-heading font-black text-white text-xl">Rajesh Sharma</h3>
              <p className="text-xs text-white/50 mt-1">Primary Account Owner</p>
              <span className="inline-block mt-3 px-3 py-1 bg-amber/10 border border-amber/25 text-amber text-[9px] uppercase font-bold tracking-wider rounded-full">
                Household Administrator
              </span>
            </div>
          </div>

          {/* Account Info Details */}
          <div className="frosted-panel rounded-3xl p-5 border border-white/5 space-y-4">
            <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-white/50 flex items-center gap-1.5">
              <User className="w-4 h-4 text-amber" />
              Account Details
            </h4>

            <div className="space-y-3 text-xs">
              <div className="p-2.5 bg-white/5 border border-white/5 rounded-xl">
                <span className="text-[9px] text-white/40 block uppercase font-bold">Email Address</span>
                <span className="text-white font-medium">rajesh@sharma.com</span>
              </div>
              <div className="p-2.5 bg-white/5 border border-white/5 rounded-xl">
                <span className="text-[9px] text-white/40 block uppercase font-bold">Registry Key</span>
                <span className="text-white font-mono">usr_keys_f827a391</span>
              </div>
              <div className="p-2.5 bg-white/5 border border-white/5 rounded-xl">
                <span className="text-[9px] text-white/40 block uppercase font-bold">Security Clearance</span>
                <span className="text-success font-bold uppercase">Level 3 (Full Authority)</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Linked Hospitals, Activity Logs, and Privacy Toggles */}
        <motion.div 
          variants={fadeInUp} 
          className="lg:col-span-8 space-y-8"
        >
          {/* Linked Hospitals */}
          <div className="frosted-panel rounded-3xl p-6 border border-white/5 space-y-4">
            <h3 className="font-heading text-sm font-extrabold text-white flex items-center gap-2">
              <Hospital className="w-4.5 h-4.5 text-terracotta" />
              Linked Clinical Bridges
            </h3>
            <p className="text-[11px] text-white/50">Clinical interfaces with active OAuth 2.0 and FHIR credentials</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div className="p-4 bg-white/5 border border-white/5 rounded-2xl flex justify-between items-center">
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-white">Apollo Medical Center</h4>
                  <p className="text-[9px] text-white/40">Linked: 12 Jun 2023</p>
                </div>
                <span className="px-2.5 py-0.5 rounded bg-success/10 border border-success/20 text-success text-[9px] uppercase font-bold">
                  Connected
                </span>
              </div>

              <div className="p-4 bg-white/5 border border-white/5 rounded-2xl flex justify-between items-center">
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-white">City General Hospital</h4>
                  <p className="text-[9px] text-white/40">Linked: 20 Aug 2023</p>
                </div>
                <span className="px-2.5 py-0.5 rounded bg-success/10 border border-success/20 text-success text-[9px] uppercase font-bold">
                  Connected
                </span>
              </div>
            </div>
          </div>

          {/* Privacy controls */}
          <div className="frosted-panel rounded-3xl p-6 border border-white/5 space-y-4">
            <h3 className="font-heading text-sm font-extrabold text-white flex items-center gap-2">
              <Lock className="w-4.5 h-4.5 text-success" />
              Privacy &amp; Data Sovereign Sovereignty
            </h3>
            <p className="text-[11px] text-white/50">Zero-knowledge data controls and cryptography keys</p>

            <div className="space-y-3.5 mt-2">
              <div className="flex items-center justify-between p-3.5 bg-white/5 border border-white/5 rounded-2xl">
                <div>
                  <h4 className="text-xs font-bold text-white">End-to-End Cryptography Key</h4>
                  <p className="text-[10px] text-white/50 mt-0.5">Encrypt sensor and telemetry clinical feeds</p>
                </div>
                <button
                  onClick={() => showToast("Rotated private keys. Re-encrypting health data...")}
                  className="px-3.5 py-1.5 bg-white/5 border border-white/5 hover:border-amber/20 text-white hover:text-white rounded-xl text-[10px] uppercase font-bold transition-all"
                >
                  Rotate Key
                </button>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-white/5 border border-white/5 rounded-2xl">
                <div>
                  <h4 className="text-xs font-bold text-white">Audit Log Portability</h4>
                  <p className="text-[10px] text-white/50 mt-0.5">Download full HIPAA compliance logs</p>
                </div>
                <button
                  onClick={() => showToast("HIPAA Audit transaction packet exported.")}
                  className="px-3.5 py-1.5 bg-white/5 border border-white/5 hover:border-amber/20 text-white hover:text-white rounded-xl text-[10px] uppercase font-bold transition-all"
                >
                  Export Logs
                </button>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="frosted-panel rounded-3xl p-6 border border-white/5 space-y-4">
            <h3 className="font-heading text-sm font-extrabold text-white flex items-center gap-2">
              <History className="w-4.5 h-4.5 text-amber" />
              Recent Personal Activity
            </h3>
            
            <div className="space-y-3">
              <div className="p-3 bg-white/5 border border-white/5 rounded-2xl text-[11px] flex justify-between items-center">
                <div>
                  <p className="font-bold text-white">Modified Household Settings</p>
                  <p className="text-[10px] text-white/40">Updated primary address details</p>
                </div>
                <span className="font-mono text-white/40">Today, 10:15 AM</span>
              </div>

              <div className="p-3 bg-white/5 border border-white/5 rounded-2xl text-[11px] flex justify-between items-center">
                <div>
                  <p className="font-bold text-white">Authorized Consent Bypass</p>
                  <p className="text-[10px] text-white/40">Modified permission matrices for Apollo</p>
                </div>
                <span className="font-mono text-white/40">Yesterday, 02:30 PM</span>
              </div>
            </div>
          </div>

        </motion.div>
      </motion.div>
    </main>
  )
}
