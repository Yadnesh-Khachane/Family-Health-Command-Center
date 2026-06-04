"use client"

import React, { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { FamilyMember } from "@/types/family"
import { TreeNode } from "./TreeNode"
import { RelationshipLine } from "./RelationshipLine"
import { TreeLegend, RelationType } from "./TreeLegend"
import { TreeMiniMap } from "./TreeMiniMap"
import { RelationshipInspector } from "./RelationshipInspector"
import { ZoomIn, ZoomOut, Maximize2 } from "lucide-react"

interface FamilyTreeProps {
  members: FamilyMember[]
  selectedId: string | null
  onNodeSelect: (id: string) => void
  layoutMode: "vertical" | "horizontal" | "radial"
  activeRisk: "none" | "diabetes" | "hypertension" | "cardiac"
  generationFilter: string
}

// Percentages for layouts (left = x%, top = y%)
const layouts: Record<string, Record<string, { x: number; y: number }>> = {
  vertical: {
    grandma: { x: 50, y: 15 },
    dad: { x: 28, y: 50 },
    mom: { x: 72, y: 50 },
    son: { x: 50, y: 85 }
  },
  horizontal: {
    grandma: { x: 15, y: 50 },
    dad: { x: 50, y: 20 },
    mom: { x: 50, y: 80 },
    son: { x: 85, y: 50 }
  },
  radial: {
    grandma: { x: 50, y: 50 },
    dad: { x: 22, y: 22 },
    mom: { x: 78, y: 22 },
    son: { x: 50, y: 82 }
  }
}

export function FamilyTree({
  members,
  selectedId,
  onNodeSelect,
  layoutMode,
  activeRisk,
  generationFilter
}: FamilyTreeProps) {
  // Advanced View Modes: "classic", "medical", "relationship", "dna"
  const [viewMode, setViewMode] = useState<"classic" | "medical" | "relationship" | "dna">("classic")

  // Zoom & Pan states
  const [scale, setScale] = useState(1)
  const [panX, setPanX] = useState(0)
  const [panY, setPanY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  // Active filters for relationship types
  const [activeTypes, setActiveTypes] = useState<Record<RelationType, boolean>>({
    "parent-child": true,
    "sibling": true,
    "spouse": true,
    "guardian": true,
    "adopted": true,
    "emergency": true,
    "medical": true,
    "inherited": true,
    "deceased": true
  })

  // Inspector States
  const [inspectorOpen, setInspectorOpen] = useState(false)
  const [inspectorData, setInspectorData] = useState({
    from: "",
    to: "",
    type: ""
  })

  const getCoords = (id: string) => {
    const layout = layouts[layoutMode] || layouts.vertical
    return layout[id] || { x: 0, y: 0 }
  }

  // Filter members based on Generation
  const isMemberVisible = (m: FamilyMember) => {
    if (generationFilter === "all") return true
    if (generationFilter === "g1") return m.id === "grandma"
    if (generationFilter === "g2") return m.id === "dad" || m.id === "mom"
    if (generationFilter === "g3") return m.id === "son"
    return true
  }

  const visibleMembers = members.filter(isMemberVisible)

  // Define connections list with custom relation mapping based on viewMode
  const getConnections = (): Array<{ from: string; to: string; type: RelationType }> => {
    switch (viewMode) {
      case "medical":
        return [
          { from: "grandma", to: "dad", type: "medical" },
          { from: "grandma", to: "mom", type: "emergency" }
        ]
      case "relationship":
        return [
          { from: "dad", to: "mom", type: "spouse" },
          { from: "mom", to: "son", type: "adopted" },
          { from: "grandma", to: "son", type: "guardian" }
        ]
      case "dna":
        return [
          { from: "grandma", to: "dad", type: "inherited" },
          { from: "dad", to: "son", type: "inherited" }
        ]
      case "classic":
      default:
        return [
          { from: "grandma", to: "dad", type: "parent-child" },
          { from: "dad", to: "mom", type: "spouse" },
          { from: "dad", to: "son", type: "parent-child" },
          { from: "mom", to: "son", type: "parent-child" }
        ]
    }
  }

  const connections = getConnections()

  // Zoom & Pan Wheel handlers
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const zoomFactor = 0.08
    const nextScale = e.deltaY < 0 ? scale + zoomFactor : scale - zoomFactor
    setScale(Math.min(Math.max(nextScale, 0.6), 2.2))
  }

  // Mouse Drag Panning Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).tagName === "BUTTON" || (e.target as HTMLElement).closest(".node-btn")) return
    setIsDragging(true)
    setDragStart({ x: e.clientX - panX, y: e.clientY - panY })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    setPanX(e.clientX - dragStart.x)
    setPanY(e.clientY - dragStart.y)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const resetZoom = () => {
    setScale(1)
    setPanX(0)
    setPanY(0)
  }

  const handleToggleRelationType = (type: RelationType) => {
    setActiveTypes(prev => ({ ...prev, [type]: !prev[type] }))
  }

  const handleLineClick = (conn: { from: string; to: string; type: RelationType }) => {
    const fromName = members.find(m => m.id === conn.from)?.name || conn.from
    const toName = members.find(m => m.id === conn.to)?.name || conn.to
    setInspectorData({
      from: fromName,
      to: toName,
      type: conn.type
    })
    setInspectorOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* View Mode Tabs */}
      <div className="flex bg-white/5 border border-white/5 p-0.5 rounded-xl self-start w-fit">
        <button
          onClick={() => setViewMode("classic")}
          className={`px-3.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors ${
            viewMode === "classic" ? "bg-amber text-obsidian font-extrabold" : "text-white/60 hover:text-white"
          }`}
        >
          Classic Tree
        </button>
        <button
          onClick={() => setViewMode("medical")}
          className={`px-3.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors ${
            viewMode === "medical" ? "bg-amber text-obsidian font-extrabold" : "text-white/60 hover:text-white"
          }`}
        >
          Medical Tree
        </button>
        <button
          onClick={() => setViewMode("relationship")}
          className={`px-3.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors ${
            viewMode === "relationship" ? "bg-amber text-obsidian font-extrabold" : "text-white/60 hover:text-white"
          }`}
        >
          Relationship Map
        </button>
        <button
          onClick={() => setViewMode("dna")}
          className={`px-3.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors ${
            viewMode === "dna" ? "bg-amber text-obsidian font-extrabold" : "text-white/60 hover:text-white"
          }`}
        >
          DNA Flow
        </button>
      </div>

      {/* Main Drag-to-Pan Container */}
      <div 
        ref={containerRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="relative w-full h-[540px] rounded-3xl border border-white/5 bg-charcoal/30 backdrop-blur-md overflow-hidden select-none cursor-grab active:cursor-grabbing"
      >
        {/* Hex Mesh Grid */}
        <div className="absolute inset-0 hex-grid opacity-15 pointer-events-none" />

        {/* Floating Zoom Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-30 pointer-events-auto">
          <button 
            onClick={() => setScale(Math.min(scale + 0.15, 2.2))}
            className="p-2 rounded-xl bg-charcoal/80 border border-white/10 hover:border-amber/40 text-ivory hover:text-white transition-all shadow-xl"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setScale(Math.max(scale - 0.15, 0.6))}
            className="p-2 rounded-xl bg-charcoal/80 border border-white/10 hover:border-amber/40 text-ivory hover:text-white transition-all shadow-xl"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button 
            onClick={resetZoom}
            className="p-2 rounded-xl bg-charcoal/80 border border-white/10 hover:border-amber/40 text-ivory hover:text-white transition-all shadow-xl"
            title="Reset Zoom"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        {/* Canvas wrapper with scale/pan transform */}
        <div 
          className="absolute inset-0 w-full h-full transform-gpu"
          style={{
            transform: `translate(${panX}px, ${panY}px) scale(${scale})`,
            transformOrigin: "center center",
            transition: isDragging ? "none" : "transform 0.15s ease-out"
          }}
        >
          {/* SVG Canvas for links */}
          <svg 
            viewBox="0 0 100 100" 
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full pointer-events-none z-0"
          >
            {connections.map((conn, idx) => {
              const fromCoords = getCoords(conn.from)
              const toCoords = getCoords(conn.to)

              // Check if both nodes are visible
              const fromMember = members.find(m => m.id === conn.from)
              const toMember = members.find(m => m.id === conn.to)
              
              if (!fromMember || !toMember || !isMemberVisible(fromMember) || !isMemberVisible(toMember)) {
                return null
              }

              // Check if relationship type filter is active
              if (!activeTypes[conn.type]) return null

              return (
                <RelationshipLine
                  key={`${conn.from}-${conn.to}-${idx}`}
                  fromX={fromCoords.x}
                  fromY={fromCoords.y}
                  toX={toCoords.x}
                  toY={toCoords.y}
                  type={conn.type}
                  layoutMode={layoutMode}
                  onClick={() => handleLineClick(conn)}
                />
              )
            })}
          </svg>

          {/* Render Node Buttons */}
          {visibleMembers.map((member) => {
            const coords = getCoords(member.id)

            return (
              <div
                key={member.id}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-10 node-btn"
                style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
              >
                <TreeNode
                  member={member}
                  isSelected={selectedId === member.id}
                  onClick={() => onNodeSelect(member.id)}
                  layoutMode={layoutMode}
                  activeRiskOverlay={activeRisk}
                />
              </div>
            )
          })}
        </div>

        {/* Floating MiniMap */}
        <TreeMiniMap
          members={visibleMembers}
          layoutMode={layoutMode}
          activeRisk={activeRisk}
          selectedId={selectedId}
          layouts={layouts}
          connections={connections.filter(c => activeTypes[c.type])}
        />

        {/* Floating Inspector overlay */}
        {inspectorOpen && (
          <div className="absolute top-4 left-4 z-40">
            <RelationshipInspector
              isOpen={inspectorOpen}
              onClose={() => setInspectorOpen(false)}
              fromMemberName={inspectorData.from}
              toMemberName={inspectorData.to}
              relationshipType={inspectorData.type}
            />
          </div>
        )}
      </div>

      {/* Interactive Legend and Filter panel */}
      <TreeLegend
        activeTypes={activeTypes}
        onToggleType={handleToggleRelationType}
      />
    </div>
  )
}
export default FamilyTree
