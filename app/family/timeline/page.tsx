"use client"

import React, { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { 
  Clock, 
  Search, 
  Filter, 
  ArrowLeft,
  ChevronDown,
  Calendar,
  AlertTriangle
} from "lucide-react"

import { timelineEvents, familyMembers } from "@/lib/mock-data/mockData"
import { EventCategory } from "@/types/family"
import { staggerContainer, fadeInUp } from "@/components/family/animations"

export default function TimelineExplorerPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMember, setSelectedMember] = useState<string>("all")
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | "all">("all")
  const [zoomLevel, setZoomLevel] = useState<"year" | "month">("month")

  // Filter list
  const filteredEvents = timelineEvents
    .filter(evt => {
      const matchSearch = 
        searchQuery === "" || 
        evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        evt.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        evt.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        evt.hospital.toLowerCase().includes(searchQuery.toLowerCase())

      const matchMember = 
        selectedMember === "all" ||
        (selectedMember === "grandma" && evt.id.match(/e1|e2|e3|e4|e8|e9/)) ||
        (selectedMember === "dad" && evt.id.match(/e5|e7/)) ||
        (selectedMember === "mom" && evt.id.match(/e5/)) ||
        (selectedMember === "son" && evt.id.match(/e6/)) ||
        evt.title.includes(familyMembers.find(m => m.id === selectedMember)?.initials || "NEVER_MATCH")

      const matchCat = selectedCategory === "all" || evt.category === selectedCategory

      return matchSearch && matchMember && matchCat
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  // Group events by Month/Year or Year depending on Zoom Level
  const getGroupedKey = (dateStr: string) => {
    const d = new Date(dateStr)
    if (zoomLevel === "year") {
      return d.getFullYear().toString()
    }
    return d.toLocaleDateString("en-US", { month: "long", year: "numeric" })
  }

  const groups: Record<string, typeof timelineEvents> = {}
  filteredEvents.forEach(evt => {
    const key = getGroupedKey(evt.date)
    if (!groups[key]) {
      groups[key] = []
    }
    groups[key].push(evt)
  })

  // Get color for categories
  const getCategoryColor = (cat: EventCategory) => {
    switch (cat) {
      case "surgery": return "text-warning bg-warning/10 border-warning/20"
      case "implant": return "text-destructive bg-destructive/10 border-destructive/20"
      case "imaging": return "text-success bg-success/10 border-success/20"
      case "medication": return "text-terracotta bg-terracotta/10 border-terracotta/20"
      case "labs": return "text-amber bg-amber/10 border-amber/20"
      default: return "text-ivory/60 bg-white/5 border-white/10"
    }
  }

  return (
    <main className="max-w-[1200px] mx-auto px-6 py-8 space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Link href="/family/dashboard" className="flex items-center gap-2 text-xs text-ivory/60 hover:text-amber font-semibold uppercase tracking-wider transition-colors mb-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="font-[family-name:var(--font-space-grotesk)] text-2xl md:text-3xl font-extrabold text-ivory tracking-tight">
            Case Timeline Explorer
          </h1>
        </div>

        {/* Zoom Year -> Month */}
        <div className="flex border border-white/10 bg-white/5 rounded-lg overflow-hidden shrink-0">
          <button 
            onClick={() => setZoomLevel("year")}
            className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
              zoomLevel === "year" ? "bg-amber text-obsidian font-bold" : "text-ivory/60 hover:text-white"
            }`}
          >
            Year Zoom
          </button>
          <button 
            onClick={() => setZoomLevel("month")}
            className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
              zoomLevel === "month" ? "bg-amber text-obsidian font-bold" : "text-ivory/60 hover:text-white"
            }`}
          >
            Month Zoom
          </button>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="frosted-panel rounded-2xl p-5 border border-white/5 grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ivory/40" />
          <input
            type="text"
            placeholder="Search symptoms, doctors..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-xl bg-obsidian border border-white/5 text-xs text-ivory placeholder:text-ivory/40 focus:outline-none focus:border-amber/40 transition-colors"
          />
        </div>

        {/* Member Selector */}
        <div>
          <select
            value={selectedMember}
            onChange={e => setSelectedMember(e.target.value)}
            className="w-full h-10 px-3 rounded-xl bg-obsidian border border-white/5 text-xs text-ivory focus:outline-none focus:border-amber/40 transition-colors"
          >
            <option value="all">All Family Members</option>
            {familyMembers.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>

        {/* Category Selector */}
        <div>
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value as EventCategory | "all")}
            className="w-full h-10 px-3 rounded-xl bg-obsidian border border-white/5 text-xs text-ivory focus:outline-none focus:border-amber/40 transition-colors"
          >
            <option value="all">All Event Types</option>
            <option value="surgery">Surgeries</option>
            <option value="implant">Implants</option>
            <option value="imaging">Imaging</option>
            <option value="medication">Medications</option>
            <option value="labs">Labs</option>
            <option value="vaccine">Vaccinations</option>
          </select>
        </div>

        <div className="flex items-center text-xs text-ivory/50 gap-2 justify-end">
          <Filter className="w-4 h-4 stroke-1" />
          <span>{filteredEvents.length} items cataloged</span>
        </div>
      </div>

      {/* Grouped Timeline */}
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="space-y-10 relative pl-4 md:pl-8 border-l border-white/5"
      >
        {Object.entries(groups).map(([groupTitle, evts]) => (
          <div key={groupTitle} className="space-y-4 relative">
            {/* Year/Month node label */}
            <div className="absolute left-[-26px] md:left-[-42px] top-0 w-8 h-8 rounded-full bg-charcoal border border-amber/30 flex items-center justify-center text-[10px] font-bold text-amber">
              <Calendar className="w-3.5 h-3.5" />
            </div>
            <h2 className="font-[family-name:var(--font-space-grotesk)] text-lg font-extrabold text-amber pl-4">
              {groupTitle}
            </h2>

            {/* Events belonging to the group */}
            <div className="space-y-4 pl-4">
              {evts.map((evt) => (
                <motion.div
                  key={evt.id}
                  variants={fadeInUp}
                  className="frosted-panel rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="text-[10px] text-ivory/40 font-semibold">{evt.date}</span>
                      <span className={`px-2 py-0.5 border rounded text-[9px] uppercase tracking-wider font-extrabold ${getCategoryColor(evt.category)}`}>
                        {evt.category}
                      </span>
                      {evt.status === "recalled" && (
                        <span className="px-2 py-0.5 bg-destructive/20 border border-destructive/40 text-destructive rounded text-[9px] uppercase tracking-wider font-extrabold flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Recall Active
                        </span>
                      )}
                    </div>
                    <div>
                      <h4 className="font-[family-name:var(--font-space-grotesk)] text-sm font-bold text-white">
                        {evt.title}
                      </h4>
                      <p className="text-xs text-white/70 mt-1">{evt.subtitle}</p>
                      {evt.notes && (
                        <p className="text-xs text-ivory/50 mt-2 bg-white/5 border border-white/5 rounded-lg p-2.5 max-w-2xl leading-relaxed italic">
                          "{evt.notes}"
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col text-xs text-ivory/40 items-start md:items-end justify-center shrink-0 border-t md:border-t-0 border-white/5 pt-3 md:pt-0">
                    <p className="font-semibold text-white/80">{evt.doctor}</p>
                    <p className="text-[11px] mt-0.5">{evt.hospital}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}

        {filteredEvents.length === 0 && (
          <div className="text-center py-20 text-ivory/40 text-sm">
            <Clock className="w-10 h-10 mx-auto mb-3 stroke-1" />
            No records matched your filter criteria.
          </div>
        )}
      </motion.div>
    </main>
  )
}
