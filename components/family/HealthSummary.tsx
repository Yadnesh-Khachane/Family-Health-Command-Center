"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts"
import { ShieldCheck, Heart, Pill, CalendarCheck } from "lucide-react"
import { fadeInUp } from "./animations"

const trendData = [
  { month: "Jan", score: 80 },
  { month: "Feb", score: 81 },
  { month: "Mar", score: 79 },
  { month: "Apr", score: 83 },
  { month: "May", score: 82 },
  { month: "Jun", score: 84 }
]

const vaccineData = [
  { name: "Gayatri (GM)", coverage: 100 },
  { name: "Rajesh (Dad)", coverage: 85 },
  { name: "Priya (Mom)", coverage: 90 },
  { name: "Aarav (Son)", coverage: 95 }
]

const medsData = [
  { name: "Gayatri (GM)", meds: 3 },
  { name: "Rajesh (Dad)", meds: 2 },
  { name: "Priya (Mom)", meds: 1 },
  { name: "Aarav (Son)", meds: 0 }
]

export function HealthSummary() {
  const [activeTab, setActiveTab] = useState<"trend" | "vaccines" | "meds" | "checkups">("trend")

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="show"
      className="frosted-panel rounded-3xl p-6 border border-white/5 space-y-6 flex flex-col justify-between h-[450px]"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-[family-name:var(--font-space-grotesk)] text-sm font-extrabold text-white flex items-center gap-2">
            <Heart className="w-4.5 h-4.5 text-terracotta" />
            Family Health Surveillance Metrics
          </h3>
          <p className="text-[11px] text-white/50 mt-0.5">Real-time aggregate data &amp; coverage tracking</p>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-white/5 border border-white/5 p-0.5 rounded-xl self-start sm:self-auto overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab("trend")}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${
              activeTab === "trend" ? "bg-amber text-obsidian" : "text-white/60 hover:text-white"
            }`}
          >
            Health Trend
          </button>
          <button
            onClick={() => setActiveTab("vaccines")}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${
              activeTab === "vaccines" ? "bg-amber text-obsidian" : "text-white/60 hover:text-white"
            }`}
          >
            Vaccination
          </button>
          <button
            onClick={() => setActiveTab("meds")}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${
              activeTab === "meds" ? "bg-amber text-obsidian" : "text-white/60 hover:text-white"
            }`}
          >
            Medication Usage
          </button>
          <button
            onClick={() => setActiveTab("checkups")}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${
              activeTab === "checkups" ? "bg-amber text-obsidian" : "text-white/60 hover:text-white"
            }`}
          >
            Checkups
          </button>
        </div>
      </div>

      <div className="flex-1 w-full min-h-[280px] flex items-center justify-center">
        {activeTab === "trend" && (
          <div className="w-full h-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--terracotta)" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="var(--terracotta)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                <XAxis dataKey="month" stroke="rgba(245, 240, 232, 0.4)" />
                <YAxis domain={[70, 90]} stroke="rgba(245, 240, 232, 0.4)" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#141414", borderColor: "rgba(245, 166, 35, 0.15)", borderRadius: 12 }}
                  labelStyle={{ color: "var(--ivory)", fontWeight: "bold" }}
                />
                <Area type="monotone" dataKey="score" stroke="var(--terracotta)" strokeWidth={2.5} fillOpacity={1} fill="url(#colorTrend)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {activeTab === "vaccines" && (
          <div className="w-full h-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={vaccineData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                <XAxis dataKey="name" stroke="rgba(245, 240, 232, 0.4)" />
                <YAxis stroke="rgba(245, 240, 232, 0.4)" unit="%" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#141414", borderColor: "rgba(245, 166, 35, 0.15)", borderRadius: 12 }}
                  labelStyle={{ color: "var(--ivory)", fontWeight: "bold" }}
                />
                <Bar dataKey="coverage" fill="var(--success)" radius={[6, 6, 0, 0]} maxBarSize={45} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {activeTab === "meds" && (
          <div className="w-full h-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={medsData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                <XAxis dataKey="name" stroke="rgba(245, 240, 232, 0.4)" />
                <YAxis stroke="rgba(245, 240, 232, 0.4)" allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#141414", borderColor: "rgba(245, 166, 35, 0.15)", borderRadius: 12 }}
                  labelStyle={{ color: "var(--ivory)", fontWeight: "bold" }}
                />
                <Bar dataKey="meds" fill="var(--amber)" radius={[6, 6, 0, 0]} maxBarSize={45} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {activeTab === "checkups" && (
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col justify-between">
              <div>
                <span className="flex items-center gap-1.5 text-success font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  Gayatri Sharma
                </span>
                <p className="text-[11px] text-white/50 mt-1">Geriatric Wellness panel completed last month.</p>
              </div>
              <span className="text-[9px] text-white/30 uppercase font-bold tracking-wider mt-4">Status: Cleared</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col justify-between">
              <div>
                <span className="flex items-center gap-1.5 text-warning font-semibold">
                  <CalendarCheck className="w-4 h-4" />
                  Rajesh Sharma
                </span>
                <p className="text-[11px] text-white/50 mt-1">Cardiac Stress test due in 30 days.</p>
              </div>
              <span className="text-[9px] text-warning uppercase font-bold tracking-wider mt-4">Status: Pending Booking</span>
            </div>
            
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col justify-between">
              <div>
                <span className="flex items-center gap-1.5 text-success font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  Priya Sharma
                </span>
                <p className="text-[11px] text-white/50 mt-1">Annual checkup completed May 20.</p>
              </div>
              <span className="text-[9px] text-white/30 uppercase font-bold tracking-wider mt-4">Status: Cleared</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col justify-between">
              <div>
                <span className="flex items-center gap-1.5 text-success font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  Aarav Sharma
                </span>
                <p className="text-[11px] text-white/50 mt-1">School vaccination checklist satisfied Feb 15.</p>
              </div>
              <span className="text-[9px] text-white/30 uppercase font-bold tracking-wider mt-4">Status: Cleared</span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
