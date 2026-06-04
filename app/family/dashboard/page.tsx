"use client"

import React from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { 
  FileText, 
  ShieldAlert, 
  Activity, 
  AlertTriangle, 
  Clock, 
  Zap,
  Calendar,
  ChevronRight,
  GitBranch,
  Users,
  Brain
} from "lucide-react"

import { familyMembers, timelineEvents } from "@/lib/mock-data/mockData"
import { useFamily } from "../layout"
import { HealthRing } from "@/components/family/HealthRing"
import { StatusOrb } from "@/components/family/StatusOrb"
import { fadeInUp, staggerContainer } from "@/components/family/animations"

// Simple area chart representation using CSS/SVG
const miniTrend = [80, 78, 82, 83, 84]

export default function FamilyDashboard() {
  const { setCrisisActive } = useFamily()

  // Filter recent 3 events
  const recentEvents = [...timelineEvents]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3)

  return (
    <main className="max-w-[1400px] mx-auto px-6 py-8 space-y-8 select-none">
      
      {/* 1. HERO COMMAND CENTER */}
      <motion.section 
        variants={fadeInUp}
        initial="hidden"
        animate="show"
        className="relative frosted-panel rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden border border-white/5"
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-terracotta/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-center gap-6 z-10 text-center sm:text-left">
          <HealthRing score={84} size={110} strokeWidth={8} />
          <div>
            <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl sm:text-3xl font-extrabold text-ivory tracking-tight">
              Sharma Family Command
            </h2>
            <p className="text-sm text-ivory/60 mt-1 max-w-md">
              A streamlined overview of active treatments, critical alerts, and upcoming medical appointments.
            </p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/5 text-ivory/80">
                <StatusOrb status="critical" />
                1 Critical Recall
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/5 text-ivory/80">
                <span className="w-2 h-2 rounded-full bg-warning warning-pulse" />
                1 Appointment
              </span>
            </div>
          </div>
        </div>

        {/* Quick crisis mode override */}
        <div className="z-10 shrink-0">
          <button 
            onClick={() => setCrisisActive(true)}
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-destructive text-white font-bold text-xs hover:bg-destructive/80 transition-colors uppercase tracking-wider flex items-center justify-center gap-1.5 pulse-glow"
          >
            <ShieldAlert className="w-4 h-4" />
            Crisis Override
          </button>
        </div>
      </motion.section>

      {/* 2. DIRECT ACCESS SHORTCUTS */}
      <motion.section 
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <Link href="/family/tree">
          <motion.div 
            variants={fadeInUp}
            whileHover={{ y: -4, borderColor: "var(--amber)" }}
            className="frosted-panel rounded-2xl p-4 border border-white/5 flex items-center gap-3 cursor-pointer transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-amber/10 border border-amber/20 flex items-center justify-center text-amber">
              <GitBranch className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Family Tree</h4>
              <p className="text-[10px] text-white/50 mt-0.5">Immersive Node Graph</p>
            </div>
          </motion.div>
        </Link>

        <Link href="/family/profile">
          <motion.div 
            variants={fadeInUp}
            whileHover={{ y: -4, borderColor: "var(--terracotta)" }}
            className="frosted-panel rounded-2xl p-4 border border-white/5 flex items-center gap-3 cursor-pointer transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-terracotta/10 border border-terracotta/20 flex items-center justify-center text-terracotta">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Family Profile</h4>
              <p className="text-[10px] text-white/50 mt-0.5">Household Settings</p>
            </div>
          </motion.div>
        </Link>

        <Link href="/family/emergency">
          <motion.div 
            variants={fadeInUp}
            whileHover={{ y: -4, borderColor: "var(--destructive)" }}
            className="frosted-panel rounded-2xl p-4 border border-white/5 flex items-center gap-3 cursor-pointer transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center justify-center text-destructive">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Emergency</h4>
              <p className="text-[10px] text-white/50 mt-0.5">High-Contrast Packet</p>
            </div>
          </motion.div>
        </Link>

        <Link href="/family/records">
          <motion.div 
            variants={fadeInUp}
            whileHover={{ y: -4, borderColor: "rgba(255,255,255,0.2)" }}
            className="frosted-panel rounded-2xl p-4 border border-white/5 flex items-center gap-3 cursor-pointer transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/80">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Records</h4>
              <p className="text-[10px] text-white/50 mt-0.5">Document Vault</p>
            </div>
          </motion.div>
        </Link>
      </motion.section>

      {/* 3. LIGHTWEIGHT TWO-COLUMN OVERVIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Side: Recent Timeline & Alerts */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-[family-name:var(--font-space-grotesk)] text-sm font-extrabold text-white flex items-center gap-2">
              <Clock className="w-4.5 h-4.5 text-amber" />
              Recent Cases &amp; Events
            </h3>
            <Link href="/family/timeline" className="text-xs text-amber hover:text-amber/80 font-semibold">
              Full Archive →
            </Link>
          </div>

          <div className="frosted-panel rounded-3xl p-5 border border-white/5 space-y-3.5">
            {recentEvents.map(evt => (
              <div key={evt.id} className="p-3 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between text-xs transition-colors hover:border-white/10">
                <div>
                  <span className="text-[9px] text-white/40">{evt.date}</span>
                  <p className="font-bold text-white mt-0.5">{evt.title}</p>
                  <p className="text-[10px] text-white/60">{evt.subtitle}</p>
                </div>
                <span className="text-[9px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-ivory/60 uppercase font-semibold">
                  {evt.category}
                </span>
              </div>
            ))}
          </div>

          {/* Alerts Banner */}
          <div className="frosted-panel rounded-3xl p-5 border border-destructive/20 bg-destructive/5 flex items-start gap-4">
            <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5 critical-blink rounded-full" />
            <div>
              <h4 className="text-xs font-bold text-white">Surveillance Trigger Alert</h4>
              <p className="text-[11px] text-white/70 mt-1 leading-relaxed">
                FDA Implant recall active on Gayatri Sharma's OrthoTech ZX-500 hip joint. Pre-op surgical consultation is scheduled for December 15.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Quick Insights & Upcoming Events */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-[family-name:var(--font-space-grotesk)] text-sm font-extrabold text-white flex items-center gap-2">
              <Brain className="w-4.5 h-4.5 text-terracotta" />
              Quick Intelligence Insights
            </h3>
            <Link href="/family/insights" className="text-xs text-terracotta hover:text-terracotta-dark font-semibold">
              Advanced Analytics →
            </Link>
          </div>

          <div className="frosted-panel rounded-3xl p-5 border border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-white/5 border border-white/5 rounded-2xl space-y-1.5">
              <span className="text-[9px] uppercase tracking-wider text-white/40 font-bold">Cabinet Integrity</span>
              <p className="text-xs font-bold text-white">Beta Blocker overlap</p>
              <p className="text-[10px] text-white/60 leading-relaxed">
                Grandma (Metoprolol) and Dad (Lisinopril) mix-up risk: keep boxes separated.
              </p>
            </div>

            {/* Micro Sparkline display using SVG */}
            <div className="p-4 bg-white/5 border border-white/5 rounded-2xl flex flex-col justify-between">
              <span className="text-[9px] uppercase tracking-wider text-white/40 font-bold">Health Trend</span>
              <div className="flex items-end justify-between mt-2">
                <span className="text-xl font-[family-name:var(--font-space-grotesk)] font-bold text-white">84 Index</span>
                <svg width="60" height="20" className="stroke-success stroke-2 fill-none">
                  <polyline points="0,15 15,18 30,10 45,5 60,3" />
                </svg>
              </div>
            </div>
          </div>

          {/* Upcoming Schedule */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white/40">Upcoming Calendar</h4>
              <Link href="/family/tasks" className="text-xs text-amber hover:text-amber/80 font-semibold">Log Task</Link>
            </div>

            <div className="p-4 bg-white/5 border border-white/5 rounded-3xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-amber shrink-0" />
                <div>
                  <p className="text-xs font-bold text-white">Orthopedic Surgeon Consultation</p>
                  <p className="text-[10px] text-white/50">Dec 15 at 10:30 AM • Gayatri Sharma (Dr. Mehta)</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-white/40" />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
