"use client"

import React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from "recharts"
import { 
  ArrowLeft, 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  Activity, 
  ShieldAlert, 
  Info 
} from "lucide-react"

import { familyMembers } from "@/lib/mock-data/mockData"
import { fadeInUp, staggerContainer } from "@/components/family/animations"

// Family health index timeline mock data
const healthTrendData = [
  { name: "Jan", index: 80, alerts: 1 },
  { name: "Feb", index: 78, alerts: 2 },
  { name: "Mar", index: 82, alerts: 1 },
  { name: "Apr", index: 83, alerts: 0 },
  { name: "May", index: 84, alerts: 1 }
]

// Prescription distribution mock data
const medicationData = familyMembers.map(m => ({
  name: m.initials,
  count: m.medicationCount
}))

// Cross-household predictive risk scoring
const riskMatrix = [
  { category: "Adhesions", score: 78, level: "CRITICAL", member: "Gayatri" },
  { category: "Hypertension", score: 55, level: "MONITOR", member: "Rajesh" },
  { category: "Polypharmacy", score: 45, level: "MONITOR", member: "Shared" },
  { category: "Immunization", score: 20, level: "LOW", member: "Aarav" }
]

export default function InsightsPage() {
  return (
    <main className="max-w-[1600px] mx-auto px-6 py-8 space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Link href="/family/dashboard" className="flex items-center gap-2 text-xs text-ivory/60 hover:text-amber font-semibold uppercase tracking-wider transition-colors mb-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="font-[family-name:var(--font-space-grotesk)] text-2xl md:text-3xl font-extrabold text-ivory tracking-tight">
            Predictive Health Insights
          </h1>
        </div>
        <span className="text-[10px] bg-white/5 border border-white/10 px-3 py-1 rounded-full text-ivory/60 font-semibold uppercase tracking-wider flex items-center gap-1.5">
          <Brain className="w-3.5 h-3.5 text-amber animate-pulse" />
          AI Engine Active
        </span>
      </div>

      {/* Grid: Charts */}
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        {/* Chart 1: Family Health Index Trend */}
        <motion.div variants={fadeInUp} className="frosted-panel rounded-3xl p-5 border border-white/5 h-[380px] flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-[family-name:var(--font-space-grotesk)] text-sm font-bold text-white">Family Health Score Trend</h3>
              <p className="text-[10px] text-white/40">Aggregated generational wellness rating</p>
            </div>
            <TrendingUp className="w-4 h-4 text-success" />
          </div>
          <div className="flex-1 w-full text-xs min-h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={healthTrendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIndex" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--amber)" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="var(--amber)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                <XAxis dataKey="name" stroke="rgba(245, 240, 232, 0.4)" />
                <YAxis domain={[50, 100]} stroke="rgba(245, 240, 232, 0.4)" />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#141414", borderColor: "rgba(245, 166, 35, 0.15)", borderRadius: 12 }}
                  labelStyle={{ color: "var(--ivory)", fontWeight: "bold" }}
                />
                <Area type="monotone" dataKey="index" stroke="var(--amber)" strokeWidth={2.5} fillOpacity={1} fill="url(#colorIndex)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Chart 2: Medication Distribution by Member */}
        <motion.div variants={fadeInUp} className="frosted-panel rounded-3xl p-5 border border-white/5 h-[380px] flex flex-col justify-between">
          <div>
            <h3 className="font-[family-name:var(--font-space-grotesk)] text-sm font-bold text-white">Active Daily Medications</h3>
            <p className="text-[10px] text-white/40">Total active prescriptions per family member</p>
          </div>
          <div className="flex-1 w-full text-xs min-h-[220px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={medicationData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                <XAxis dataKey="name" stroke="rgba(245, 240, 232, 0.4)" />
                <YAxis stroke="rgba(245, 240, 232, 0.4)" allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#141414", borderColor: "rgba(245, 166, 35, 0.15)", borderRadius: 12 }}
                  labelStyle={{ color: "var(--ivory)", fontWeight: "bold" }}
                />
                <Bar dataKey="count" fill="var(--terracotta)" radius={[6, 6, 0, 0]} maxBarSize={45} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </motion.div>

      {/* Grid: Predictive Reports & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Risk Assessment List */}
        <div className="frosted-panel rounded-2xl p-5 border border-white/5 space-y-4">
          <h3 className="font-[family-name:var(--font-space-grotesk)] text-sm font-bold text-white">Risk Heatmap</h3>
          <div className="space-y-3">
            {riskMatrix.map((item, idx) => (
              <div key={idx} className="p-3 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[9px] uppercase tracking-wide text-ivory/50 font-bold">{item.member}</span>
                  <h4 className="text-xs font-bold text-white">{item.category}</h4>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                    item.level === "CRITICAL"
                      ? "bg-destructive/10 border-destructive/20 text-destructive"
                      : item.level === "MONITOR"
                      ? "bg-warning/10 border-warning/20 text-warning"
                      : "bg-success/10 border-success/30 text-success"
                  }`}>
                    {item.score}% Risk
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Prediction Cards */}
        <div className="frosted-panel rounded-2xl p-5 border border-white/5 space-y-4 lg:col-span-2">
          <h3 className="font-[family-name:var(--font-space-grotesk)] text-sm font-bold text-white">System Diagnostics</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Prediction Card 1 */}
            <div className="p-4 bg-white/5 border border-white/5 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-warning">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-[10px] uppercase tracking-wider font-extrabold">Cross-Cabinet Anomaly</span>
              </div>
              <h4 className="text-xs font-bold text-white">Lisinopril + Metoprolol Safety</h4>
              <p className="text-[11px] text-white/60 leading-relaxed">
                Both agents trigger moderate bradycardia warnings. System flags high importance to verify Rajesh's and Gayatri's pillboxes are physically separate to prevent mix-ups.
              </p>
            </div>

            {/* Prediction Card 2 */}
            <div className="p-4 bg-white/5 border border-white/5 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-amber">
                <Info className="w-4 h-4" />
                <span className="text-[10px] uppercase tracking-wider font-extrabold">Preventative Schedule</span>
              </div>
              <h4 className="text-xs font-bold text-white">Cardiac Scan Frequency</h4>
              <p className="text-[11px] text-white/60 leading-relaxed">
                Based on Grandma's age (72) and metoprolol dosage, recommended ECG frequency is once every 6 months. Her last logged ECG was 8 months ago.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
