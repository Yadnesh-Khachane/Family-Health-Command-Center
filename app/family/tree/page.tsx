"use client"

import React, { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { 
  ArrowLeft, 
  GitBranch, 
  Users, 
  Clock, 
  LineChart, 
  Activity, 
  Plus, 
  UserPlus, 
  Share2, 
  ShieldAlert,
  Play,
  Pause,
  RotateCcw
} from "lucide-react"

import { familyMembers, timelineEvents } from "@/lib/mock-data/mockData"
import { FamilyTree } from "@/components/family/FamilyTree"
import { TreeControls } from "@/components/family/TreeControls"
import { MemberDrawer } from "@/components/family/MemberDrawer"
import { useFamily } from "../layout"
import { fadeInUp, staggerContainer } from "@/components/family/animations"

export default function FamilyTreePage() {
  const { setCrisisActive } = useFamily()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  
  // Tree Controls States
  const [layoutMode, setLayoutMode] = useState<"vertical" | "horizontal" | "radial">("vertical")
  const [activeRisk, setActiveRisk] = useState<"none" | "diabetes" | "hypertension" | "cardiac">("none")
  const [searchQuery, setSearchQuery] = useState("")
  const [generationFilter, setGenerationFilter] = useState("all")

  // Timeline Replay States
  const [replayYear, setReplayYear] = useState(2026)
  const [isReplaying, setIsReplaying] = useState(false)

  // Quick Action States
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  // Filter members based on search query
  const searchedMembers = familyMembers.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.relation.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const selectedMember = familyMembers.find(m => m.id === selectedId) || null

  // Mini Analytics calculation
  const totalMembers = familyMembers.length
  const criticalCount = familyMembers.filter(m => m.status === "critical").length

  // Play Timeline history simulation
  const handlePlayReplay = () => {
    setIsReplaying(true)
    let currentYear = 2015
    setReplayYear(currentYear)
    
    const interval = setInterval(() => {
      currentYear += 1
      if (currentYear > 2026) {
        clearInterval(interval)
        setIsReplaying(false)
      } else {
        setReplayYear(currentYear)
      }
    }, 800)
  }

  // Find events matching the selected replay year
  const activeReplayEvents = timelineEvents.filter(evt => {
    const year = new Date(evt.date).getFullYear()
    return year === replayYear
  })

  return (
    <main className="max-w-[1600px] mx-auto px-6 py-8 space-y-8 select-none">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-lg frosted-glass border border-amber/30 bg-charcoal"
          >
            <p className="text-ivory text-xs font-semibold">{toastMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Link href="/family/dashboard" className="flex items-center gap-2 text-xs text-ivory/60 hover:text-amber font-semibold uppercase tracking-wider transition-colors mb-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="font-[family-name:var(--font-space-grotesk)] text-2xl md:text-3xl font-extrabold text-ivory tracking-tight">
            Immersive relationship tree
          </h1>
        </div>

        {/* Floating Quick Links */}
        <div className="flex flex-wrap gap-2.5 bg-white/5 border border-white/5 p-1 rounded-xl">
          <Link href="/family/dashboard" className="px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-white/5 text-ivory/60 hover:text-ivory transition-colors">
            Dashboard
          </Link>
          <Link href="/family/profile" className="px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-white/5 text-ivory/60 hover:text-ivory transition-colors">
            Profile
          </Link>
          <Link href="/family/timeline" className="px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-white/5 text-ivory/60 hover:text-ivory transition-colors">
            Timeline
          </Link>
          <Link href="/family/insights" className="px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-white/5 text-ivory/60 hover:text-ivory transition-colors">
            Insights
          </Link>
        </div>
      </div>

      {/* 2. Mini Analytics & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Layout & Filter Controls */}
        <div className="lg:col-span-8 space-y-6">
          <TreeControls
            layoutMode={layoutMode}
            setLayoutMode={setLayoutMode}
            activeRisk={activeRisk}
            setActiveRisk={setActiveRisk}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            generationFilter={generationFilter}
            setGenerationFilter={setGenerationFilter}
          />

          {/* Immersive Tree Graph */}
          <FamilyTree
            members={searchedMembers}
            selectedId={selectedId}
            onNodeSelect={(id) => setSelectedId(id)}
            layoutMode={layoutMode}
            activeRisk={activeRisk}
            generationFilter={generationFilter}
          />
        </div>

        {/* Right Column: Timeline Replay & Mini Analytics */}
        <div className="lg:col-span-4 space-y-6">
          {/* Mini Analytics */}
          <div className="frosted-panel rounded-3xl p-5 border border-white/5 space-y-4">
            <h3 className="font-[family-name:var(--font-space-grotesk)] text-xs font-bold uppercase tracking-wider text-white/50">
              Tree Analytics
            </h3>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-white/5 border border-white/5 rounded-2xl">
                <span className="text-xl font-[family-name:var(--font-space-grotesk)] font-bold text-white">{totalMembers}</span>
                <p className="text-[9px] text-white/40 uppercase mt-0.5">Members</p>
              </div>
              <div className="p-3 bg-white/5 border border-white/5 rounded-2xl">
                <span className="text-xl font-[family-name:var(--font-space-grotesk)] font-bold text-success">84%</span>
                <p className="text-[9px] text-white/40 uppercase mt-0.5">Health</p>
              </div>
              <div className="p-3 bg-white/5 border border-white/5 rounded-2xl">
                <span className="text-xl font-[family-name:var(--font-space-grotesk)] font-bold text-destructive">{criticalCount}</span>
                <p className="text-[9px] text-white/40 uppercase mt-0.5">Critical</p>
              </div>
            </div>
          </div>

          {/* Timeline Replay Widget */}
          <div className="frosted-panel rounded-3xl p-5 border border-white/5 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-[family-name:var(--font-space-grotesk)] text-xs font-bold uppercase tracking-wider text-white/50">
                Timeline Replay Simulation
              </h3>
              <span className="text-2xl font-[family-name:var(--font-space-grotesk)] font-extrabold text-amber animate-pulse">
                {replayYear}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={handlePlayReplay} 
                disabled={isReplaying}
                className="p-2 rounded-full bg-amber text-obsidian hover:bg-amber/80 disabled:opacity-50 transition-colors shrink-0"
                title="Play Historical Replay"
              >
                <Play className="w-4 h-4 fill-obsidian" />
              </button>
              <button 
                onClick={() => setReplayYear(2026)} 
                className="p-2 rounded-full bg-white/5 border border-white/10 text-ivory hover:text-white transition-colors shrink-0"
                title="Reset Timeline"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <input
                type="range"
                min="2015"
                max="2026"
                value={replayYear}
                onChange={e => setReplayYear(parseInt(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber"
              />
            </div>

            {/* Replay event announcements */}
            <div className="h-28 overflow-y-auto space-y-2 mt-2 pr-1 scrollbar-thin">
              {activeReplayEvents.length > 0 ? (
                activeReplayEvents.map(evt => (
                  <div key={evt.id} className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-[11px] leading-normal animate-pulse">
                    <span className="text-[9px] uppercase tracking-wide text-amber font-semibold">{evt.category}</span>
                    <p className="font-bold text-white mt-0.5">{evt.title}</p>
                    <p className="text-white/60">{evt.subtitle} ({evt.doctor})</p>
                  </div>
                ))
              ) : (
                <p className="text-[10px] text-white/40 italic text-center py-8">No clinical events registered in {replayYear}.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Quick Action Buttons */}
      <div className="fixed bottom-6 right-6 flex items-center gap-3 z-30">
        <button 
          onClick={() => showToast("Add Member dialog would open.")}
          className="p-3.5 rounded-full bg-terracotta text-white hover:bg-terracotta-dark shadow-2xl transition-all" 
          title="Add Member"
        >
          <Plus className="w-5 h-5" />
        </button>
        <button 
          onClick={() => showToast("Invite Link copied to clipboard.")}
          className="p-3.5 rounded-full bg-[#1A1A1A] border border-white/10 text-ivory hover:text-white shadow-2xl transition-all" 
          title="Invite Relative"
        >
          <UserPlus className="w-5 h-5" />
        </button>
        <button 
          onClick={() => showToast("Tree structure exported successfully.")}
          className="p-3.5 rounded-full bg-[#1A1A1A] border border-white/10 text-ivory hover:text-white shadow-2xl transition-all" 
          title="Export Diagram"
        >
          <Share2 className="w-5 h-5" />
        </button>
      </div>

      {/* Node detail side drawer */}
      <MemberDrawer
        isOpen={selectedId !== null}
        onClose={() => setSelectedId(null)}
        member={selectedMember}
      />
    </main>
  )
}
