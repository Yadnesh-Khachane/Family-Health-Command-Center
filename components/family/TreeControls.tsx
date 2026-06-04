"use client"

import React from "react"
import { Search, SlidersHorizontal, Eye } from "lucide-react"

interface TreeControlsProps {
  layoutMode: "vertical" | "horizontal" | "radial"
  setLayoutMode: (mode: "vertical" | "horizontal" | "radial") => void
  activeRisk: "none" | "diabetes" | "hypertension" | "cardiac"
  setActiveRisk: (risk: "none" | "diabetes" | "hypertension" | "cardiac") => void
  searchQuery: string
  setSearchQuery: (val: string) => void
  generationFilter: string
  setGenerationFilter: (val: string) => void
}

export function TreeControls({
  layoutMode,
  setLayoutMode,
  activeRisk,
  setActiveRisk,
  searchQuery,
  setSearchQuery,
  generationFilter,
  setGenerationFilter
}: TreeControlsProps) {
  return (
    <div className="frosted-panel rounded-3xl p-5 border border-white/5 grid grid-cols-1 lg:grid-cols-4 gap-4 items-center shrink-0 z-10 relative">
      {/* 1. Layout Mode */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[9px] uppercase tracking-wider text-white/40 font-bold">Tree Orientation</label>
        <div className="flex border border-white/10 bg-white/5 rounded-xl overflow-hidden">
          {(["vertical", "horizontal", "radial"] as const).map(mode => (
            <button
              key={mode}
              onClick={() => setLayoutMode(mode)}
              className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors ${
                layoutMode === mode ? "bg-amber text-obsidian" : "text-white/60 hover:text-white"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Risk Overlays */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[9px] uppercase tracking-wider text-white/40 font-bold flex items-center gap-1">
          <Eye className="w-3.5 h-3.5 text-amber" />
          Risk Propagation Overlay
        </label>
        <select
          value={activeRisk}
          onChange={e => setActiveRisk(e.target.value as any)}
          className="h-9 px-3 rounded-xl bg-obsidian border border-white/10 text-xs text-white focus:outline-none"
        >
          <option value="none">No Overlays</option>
          <option value="diabetes">Diabetes Risk propagation</option>
          <option value="hypertension">Hypertension Risk propagation</option>
          <option value="cardiac">Cardiac Risk propagation</option>
        </select>
      </div>

      {/* 3. Search members */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[9px] uppercase tracking-wider text-white/40 font-bold">Search Node</label>
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Find relative..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-8 pr-3 rounded-xl bg-obsidian border border-white/10 text-xs text-white placeholder:text-white/30 focus:outline-none"
          />
        </div>
      </div>

      {/* 4. Generation Filter */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[9px] uppercase tracking-wider text-white/40 font-bold">Generation Filter</label>
        <select
          value={generationFilter}
          onChange={e => setGenerationFilter(e.target.value)}
          className="h-9 px-3 rounded-xl bg-obsidian border border-white/10 text-xs text-white focus:outline-none"
        >
          <option value="all">All Generations</option>
          <option value="g1">Generation 1 (Grandparents)</option>
          <option value="g2">Generation 2 (Parents)</option>
          <option value="g3">Generation 3 (Children)</option>
        </select>
      </div>
    </div>
  )
}
export default TreeControls
