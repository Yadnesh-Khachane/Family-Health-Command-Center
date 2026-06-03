"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { 
  Home, 
  GitBranch, 
  Clock, 
  Upload, 
  AlertTriangle, 
  Bell, 
  Menu, 
  X,
  Camera,
  Syringe,
  Pill,
  Settings,
  ChevronDown,
  ChevronUp
} from "lucide-react"

// Medical event types with their colors and icons
const eventTypes = {
  imaging: { label: "Imaging", color: "var(--success)", Icon: Camera },
  surgery: { label: "Surgeries", color: "var(--amber)", Icon: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M14 4l6 6-8 8-6-6 8-8z" />
      <path d="M4 20l2-2" />
      <path d="M18 6l2-2" />
    </svg>
  )},
  vaccine: { label: "Vaccines", color: "var(--amber)", Icon: Syringe },
  medication: { label: "Medications", color: "var(--terracotta)", Icon: Pill },
  implant: { label: "Implants", color: "var(--destructive)", Icon: Settings },
}

// Medical events data for family members
const memberEvents: Record<string, Array<{
  type: keyof typeof eventTypes
  date: string
  title: string
  subtitle: string
  notes?: string
}>> = {
  grandma: [
    {
      type: "surgery",
      date: "2023-06-15",
      title: "Hip Replacement Surgery",
      subtitle: "Apollo Medical Center — Dr. Mehta",
      notes: "Titanium implant. Model ZX-500. Manufacturer: OrthoTech. 15-year expected lifespan.",
    },
    {
      type: "imaging",
      date: "2023-06-14",
      title: "Pre-Op Hip X-Ray",
      subtitle: "Apollo Radiology",
      notes: "Severe osteoarthritis confirmed.",
    },
    {
      type: "vaccine",
      date: "2023-01-10",
      title: "Tdap Booster",
      subtitle: "Dr. Sharma — Family Clinic",
    },
    {
      type: "implant",
      date: "2023-06-15",
      title: "Hip Implant ZX-500",
      subtitle: "Status: Active — Recall Pending",
      notes: "FDA Recall #REC-2024-0891 issued Nov 2024. Affects lot #ZX-2023-B.",
    },
    {
      type: "medication",
      date: "2024-03-01",
      title: "Metoprolol 50mg",
      subtitle: "1 daily — Beta Blocker",
    },
  ],
  dad: [
    {
      type: "imaging",
      date: "2024-02-20",
      title: "Chest X-Ray",
      subtitle: "City Hospital Radiology",
      notes: "Annual checkup, no abnormalities detected.",
    },
    {
      type: "vaccine",
      date: "2023-11-15",
      title: "Flu Shot",
      subtitle: "Dr. Sharma — Family Clinic",
    },
    {
      type: "medication",
      date: "2024-01-10",
      title: "Lisinopril 10mg",
      subtitle: "1 daily — Blood Pressure",
    },
  ],
  mom: [
    {
      type: "imaging",
      date: "2024-01-05",
      title: "Mammogram",
      subtitle: "Women&apos;s Health Center",
      notes: "Routine screening, all clear.",
    },
    {
      type: "vaccine",
      date: "2023-10-20",
      title: "Flu Shot",
      subtitle: "Dr. Sharma — Family Clinic",
    },
  ],
  son: [
    {
      type: "vaccine",
      date: "2024-02-15",
      title: "MMR Booster",
      subtitle: "Pediatric Care — Dr. Patel",
    },
    {
      type: "vaccine",
      date: "2023-09-01",
      title: "Flu Shot",
      subtitle: "School Health Program",
    },
  ],
}

// Family member data
const familyMembers = [
  {
    id: "grandma",
    name: "Gayatri Sharma",
    age: 72,
    relation: "Grandmother",
    bloodGroup: "B+",
    initials: "GS",
    status: "critical",
    alertText: "Implant recall notice",
    position: { top: "20%", left: "25%" },
  },
  {
    id: "dad",
    name: "Rajesh Sharma",
    age: 45,
    relation: "Father",
    bloodGroup: "O+",
    initials: "RS",
    status: "warning",
    alertText: "Upcoming vaccine",
    position: { top: "45%", left: "55%" },
  },
  {
    id: "mom",
    name: "Priya Sharma",
    age: 42,
    relation: "Mother",
    bloodGroup: "A+",
    initials: "PS",
    status: "healthy",
    alertText: null,
    position: { top: "60%", left: "30%" },
  },
  {
    id: "son",
    name: "Aarav Sharma",
    age: 8,
    relation: "Son",
    bloodGroup: "O+",
    initials: "AS",
    status: "healthy",
    alertText: null,
    position: { top: "75%", left: "60%" },
  },
]

// Connection data (from, to, thickness)
const connections = [
  { from: "grandma", to: "dad", thickness: 3 },
  { from: "dad", to: "mom", thickness: 2 },
  { from: "mom", to: "son", thickness: 2 },
  { from: "grandma", to: "son", thickness: 1 },
]

// Nav items
const navItems = [
  { icon: Home, label: "Home", active: true },
  { icon: GitBranch, label: "Family Tree", active: false },
  { icon: Clock, label: "Timeline", active: false },
  { icon: Upload, label: "Upload", active: false },
  { icon: AlertTriangle, label: "Crisis", active: false, crisis: true },
]

// Filter categories
const filterCategories = [
  { key: "all", label: "All Records" },
  { key: "imaging", label: "Imaging" },
  { key: "surgery", label: "Surgeries" },
  { key: "vaccine", label: "Vaccines" },
  { key: "medication", label: "Medications" },
  { key: "implant", label: "Implants" },
]

function LogoMark() {
  return (
    <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8">
      <circle cx="10" cy="16" r="6" stroke="currentColor" strokeWidth="1.5" className="text-amber" />
      <circle cx="22" cy="16" r="6" stroke="currentColor" strokeWidth="1.5" className="text-terracotta" />
      <circle cx="16" cy="10" r="4" stroke="currentColor" strokeWidth="1.5" className="text-ivory/60" />
      <line x1="10" y1="16" x2="22" y2="16" stroke="currentColor" strokeWidth="1" className="text-amber/40" />
      <line x1="10" y1="16" x2="16" y2="10" stroke="currentColor" strokeWidth="1" className="text-amber/40" />
      <line x1="22" y1="16" x2="16" y2="10" stroke="currentColor" strokeWidth="1" className="text-amber/40" />
    </svg>
  )
}

function StatusOrb({ status }: { status: string }) {
  if (status === "critical") {
    return (
      <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-destructive critical-blink" />
    )
  }
  if (status === "warning") {
    return (
      <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-warning warning-pulse" />
    )
  }
  return (
    <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-success" />
  )
}

function FamilyNode({
  member,
  isSelected,
  onSelect,
  index,
}: {
  member: (typeof familyMembers)[0]
  isSelected: boolean
  onSelect: () => void
  index: number
}) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className="absolute"
      style={{ top: member.position.top, left: member.position.left }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
    >
      {/* Tooltip */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute -top-20 left-1/2 -translate-x-1/2 frosted-panel rounded-lg px-3 py-2 whitespace-nowrap z-20"
          >
            <p className="font-[family-name:var(--font-space-grotesk)] text-sm font-semibold text-ivory">
              {member.name}
            </p>
            <p className="text-xs text-ivory/60">Age {member.age}</p>
            <p className={`text-xs ${member.status === "critical" ? "text-destructive" : member.status === "warning" ? "text-warning" : "text-success"}`}>
              {member.alertText || "Healthy"}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Node */}
      <motion.button
        className={`relative w-20 h-20 rounded-full frosted-panel flex items-center justify-center cursor-pointer transition-all duration-300 ${
          isSelected ? "border-terracotta node-selected" : "hover:border-amber/40"
        }`}
        style={{
          borderColor: isSelected ? "var(--terracotta)" : undefined,
          borderWidth: isSelected ? "2px" : "1px",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onSelect}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
      >
        <span className="font-[family-name:var(--font-space-grotesk)] text-xl font-bold text-ivory">
          {member.initials}
        </span>
        <StatusOrb status={member.status} />
      </motion.button>
    </motion.div>
  )
}

function ConnectionLines({
  members,
  connections: conns,
}: {
  members: typeof familyMembers
  connections: typeof connections
}) {
  const getMemberPosition = (id: string) => {
    const member = members.find((m) => m.id === id)
    if (!member) return { x: 0, y: 0 }
    return {
      x: parseFloat(member.position.left) + 5,
      y: parseFloat(member.position.top) + 5,
    }
  }

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
      {conns.map((conn, index) => {
        const from = getMemberPosition(conn.from)
        const to = getMemberPosition(conn.to)
        return (
          <motion.line
            key={`${conn.from}-${conn.to}`}
            x1={`${from.x}%`}
            y1={`${from.y}%`}
            x2={`${to.x}%`}
            y2={`${to.y}%`}
            stroke="var(--amber)"
            strokeWidth={conn.thickness}
            strokeOpacity={0.4}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
          />
        )
      })}
    </svg>
  )
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

function TimelineEvent({ 
  event, 
  isExpanded, 
  onToggle 
}: { 
  event: typeof memberEvents.grandma[0]
  isExpanded: boolean
  onToggle: () => void
}) {
  const eventType = eventTypes[event.type]
  const EventIcon = eventType.Icon

  return (
    <motion.div
      className="relative pl-8"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      {/* Timeline dot */}
      <div 
        className="absolute left-0 top-2 w-4 h-4 rounded-full flex items-center justify-center"
        style={{ backgroundColor: `${eventType.color}20`, border: `2px solid ${eventType.color}` }}
      >
        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: eventType.color }} />
      </div>

      {/* Event card */}
      <div className="frosted-panel rounded-xl p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${eventType.color}15` }}
            >
              <span style={{ color: eventType.color }}>
                <EventIcon />
              </span>
            </div>
            <div>
              <p className="text-xs text-ivory/50">{formatDate(event.date)}</p>
              <p className="font-[family-name:var(--font-space-grotesk)] text-sm font-semibold text-ivory">
                {event.title}
              </p>
            </div>
          </div>
          {event.notes && (
            <button 
              onClick={onToggle}
              className="p-1 rounded-full hover:bg-amber/10 transition-colors"
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-ivory/60" />
              ) : (
                <ChevronDown className="w-4 h-4 text-ivory/60" />
              )}
            </button>
          )}
        </div>
        <p className="text-xs text-ivory/60">{event.subtitle}</p>
        
        <AnimatePresence>
          {isExpanded && event.notes && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-2 mt-2 border-t border-amber/10">
                <p className="text-xs text-ivory/70">{event.notes}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

function MemberProfilePanel({ 
  member, 
  onClose 
}: { 
  member: (typeof familyMembers)[0]
  onClose: () => void
}) {
  const [activeFilter, setActiveFilter] = useState("all")
  const [expandedEvent, setExpandedEvent] = useState<number | null>(null)
  const [showToast, setShowToast] = useState(false)

  const events = memberEvents[member.id] || []
  const filteredEvents = activeFilter === "all" 
    ? events 
    : events.filter(e => e.type === activeFilter)

  // Sort by date, newest first
  const sortedEvents = [...filteredEvents].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  const handleUpload = () => {
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  return (
    <motion.aside
      className="w-[350px] h-full frosted-panel border-l border-amber/10 flex flex-col overflow-hidden"
      initial={{ x: 350 }}
      animate={{ x: 0 }}
      exit={{ x: 350 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
    >
      {/* Header */}
      <div className="p-6 border-b border-amber/10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            {/* Large Avatar */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber/30 to-amber/10 border-2 border-amber/30 flex items-center justify-center">
              <span className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-amber">
                {member.initials}
              </span>
            </div>
            <div>
              <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-bold text-ivory">
                {member.name}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-0.5 rounded-full bg-terracotta/20 text-terracotta text-xs font-medium">
                  Age {member.age} • {member.bloodGroup}
                </span>
              </div>
              <button className="text-xs text-amber hover:text-amber/80 mt-2 transition-colors">
                Edit Profile
              </button>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-amber/10 transition-colors"
          >
            <X className="w-5 h-5 text-ivory/60" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-6 px-6 scrollbar-hide">
          {filterCategories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveFilter(cat.key)}
              className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-all ${
                activeFilter === cat.key
                  ? "bg-terracotta text-ivory"
                  : "frosted-panel text-ivory/80 hover:text-ivory hover:border-amber/30"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="relative">
          {/* Vertical timeline line */}
          <div className="absolute left-[7px] top-0 bottom-0 w-0.5 bg-amber/30" />

          {/* Events */}
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {sortedEvents.length > 0 ? (
                sortedEvents.map((event, index) => (
                  <TimelineEvent
                    key={`${event.type}-${event.date}-${index}`}
                    event={event}
                    isExpanded={expandedEvent === index}
                    onToggle={() => setExpandedEvent(expandedEvent === index ? null : index)}
                  />
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8"
                >
                  <p className="text-ivory/40 text-sm">No records found for this category</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Upload Button */}
      <div className="p-6 border-t border-amber/10">
        <button
          onClick={handleUpload}
          className="w-full py-3 rounded-xl border-2 border-dashed border-amber/40 text-amber text-sm font-medium hover:border-amber hover:bg-amber/5 transition-all flex items-center justify-center gap-2"
        >
          <Upload className="w-4 h-4" />
          Upload New Record
        </button>
      </div>

      {/* Toast notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-24 left-6 right-6 frosted-panel rounded-xl p-4 border border-amber/30"
          >
            <p className="text-sm text-ivory text-center">Upload modal would open</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.aside>
  )
}

function DefaultRightPanel() {
  return (
    <motion.aside
      className="w-[350px] h-full frosted-panel border-l border-amber/10 p-6 overflow-y-auto"
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 50, opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-6">
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-bold text-ivory">
          At a Glance
        </h2>

        {/* Upcoming */}
        <div className="frosted-panel rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-ivory">Upcoming</h3>
            <span className="text-xs text-amber bg-amber/10 px-2 py-0.5 rounded-full">
              2 Appointments
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex items-start gap-3">
              <div className="w-1 h-1 rounded-full bg-destructive mt-2" />
              <div>
                <p className="text-sm text-ivory">Grandma: Implant Review</p>
                <p className="text-xs text-ivory/50">Dec 15</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-1 h-1 rounded-full bg-warning mt-2" />
              <div>
                <p className="text-sm text-ivory">Aarav: Tdap Booster</p>
                <p className="text-xs text-ivory/50">Nov 20</p>
              </div>
            </div>
          </div>
        </div>

        {/* Alert */}
        <div className="frosted-panel rounded-xl p-4 space-y-3 border-destructive/30">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-ivory">Active Alert</h3>
            <span className="text-xs text-destructive bg-destructive/10 px-2 py-0.5 rounded-full">
              1 Alert
            </span>
          </div>
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-ivory">{"Grandma's hip implant"}</p>
              <p className="text-xs text-destructive/80">Recall notice issued</p>
            </div>
          </div>
        </div>

        {/* Recent */}
        <div className="frosted-panel rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-ivory">Recent Uploads</h3>
            <span className="text-xs text-ivory/60 bg-ivory/5 px-2 py-0.5 rounded-full">
              3 Files
            </span>
          </div>
          <div className="space-y-2">
            {["Mom's blood work", "Dad's X-ray", "Aarav's vaccine record"].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-ivory/80">
                <div className="w-1 h-1 rounded-full bg-amber/60" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.aside>
  )
}

export default function FamilyDashboard() {
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null)
  const [hoveredNav, setHoveredNav] = useState<string | null>(null)

  const selectedMember = familyMembers.find((m) => m.id === selectedMemberId) || null

  const handleNodeSelect = (memberId: string) => {
    setSelectedMemberId(selectedMemberId === memberId ? null : memberId)
  }

  const handleClosePanel = () => {
    setSelectedMemberId(null)
  }

  return (
    <main className="relative h-screen overflow-hidden bg-background">
      {/* Noise overlay */}
      <div className="noise-overlay" />

      {/* Ambient glow orbs */}
      <div className="ambient-glow-top" />
      <div className="ambient-glow-bottom" />

      {/* Hex grid background */}
      <div className="fixed inset-0 hex-grid opacity-50" />

      {/* Top Bar */}
      <header className="fixed top-0 left-0 right-0 h-16 frosted-glass z-50 flex items-center justify-between px-4">
        {/* Left: Logo */}
        <div className="flex items-center gap-3">
          <LogoMark />
        </div>

        {/* Center: Family name */}
        <motion.h1
          className="font-[family-name:var(--font-space-grotesk)] text-xl font-bold shimmer-text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          The Sharma Family
        </motion.h1>

        {/* Right: Avatar, notifications, menu */}
        <div className="flex items-center gap-4">
          {/* Crisis Mode Button */}
          <Link
            href="/family/crisis"
            className="hidden md:flex px-4 py-1.5 rounded-full bg-terracotta text-white text-sm font-semibold items-center gap-2 pulse-glow hover:bg-terracotta-dark transition-colors"
          >
            <AlertTriangle className="w-4 h-4" />
            CRISIS MODE
          </Link>

          {/* Notification bell */}
          <button className="relative p-2 rounded-full hover:bg-amber/10 transition-colors">
            <Bell className="w-5 h-5 text-ivory/80" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-terracotta notification-pulse" />
          </button>

          {/* Avatar */}
          <div className="w-9 h-9 rounded-full bg-amber/20 border border-amber/30 flex items-center justify-center">
            <span className="font-[family-name:var(--font-space-grotesk)] text-sm font-bold text-amber">
              RS
            </span>
          </div>

          {/* Menu */}
          <button className="p-2 rounded-full hover:bg-amber/10 transition-colors">
            <Menu className="w-5 h-5 text-ivory/80" />
          </button>
        </div>
      </header>

      {/* Left Rail */}
      <nav className="fixed left-0 top-16 bottom-0 w-[60px] frosted-panel border-r border-amber/10 z-40 flex flex-col items-center py-6 gap-2">
        {navItems.map((item) => (
          <div
            key={item.label}
            className="relative"
            onMouseEnter={() => setHoveredNav(item.label)}
            onMouseLeave={() => setHoveredNav(null)}
          >
            <button
              className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                item.active
                  ? "bg-amber/10 border-l-2 border-amber"
                  : "hover:bg-amber/5"
              } ${item.crisis ? "text-terracotta" : "text-ivory/60 hover:text-ivory"}`}
              style={{
                marginLeft: item.active ? "-1px" : "0",
              }}
            >
              <item.icon
                className={`w-5 h-5 ${item.active ? "text-terracotta" : ""}`}
              />
            </button>

            {/* Expanded label on hover */}
            <AnimatePresence>
              {hoveredNav === item.label && (
                <motion.div
                  initial={{ opacity: 0, x: -10, width: 0 }}
                  animate={{ opacity: 1, x: 0, width: "auto" }}
                  exit={{ opacity: 0, x: -10, width: 0 }}
                  className="absolute left-full top-1/2 -translate-y-1/2 ml-2 frosted-panel rounded-lg px-3 py-1.5 whitespace-nowrap z-50 border-l-2 border-amber"
                >
                  <span className="text-sm text-ivory">{item.label}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </nav>

      {/* Main content area */}
      <div className="pt-16 pl-[60px] h-screen flex">
        {/* Center: Node network */}
        <div className="flex-1 relative">
          <ConnectionLines members={familyMembers} connections={connections} />
          {familyMembers.map((member, index) => (
            <FamilyNode
              key={member.id}
              member={member}
              isSelected={selectedMemberId === member.id}
              onSelect={() => handleNodeSelect(member.id)}
              index={index}
            />
          ))}

          {/* Floating actions */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4">
            <button className="px-6 py-3 rounded-full bg-terracotta text-white font-semibold warm-glow hover:bg-terracotta-dark transition-colors">
              Add Member
            </button>
          </div>
          <div className="absolute bottom-8 right-8">
            <button className="px-4 py-2 rounded-full border border-amber text-amber text-sm font-medium hover:bg-amber/10 transition-colors">
              Log Event
            </button>
          </div>

          {/* Mobile Crisis Mode Button */}
          <div className="md:hidden absolute top-4 right-4">
            <Link
              href="/family/crisis"
              className="px-3 py-1.5 rounded-full bg-terracotta text-white text-xs font-semibold flex items-center gap-1.5 pulse-glow"
            >
              <AlertTriangle className="w-3 h-3" />
              CRISIS
            </Link>
          </div>
        </div>

        {/* Right Panel */}
        <AnimatePresence mode="wait">
          {selectedMember ? (
            <MemberProfilePanel
              key={selectedMember.id}
              member={selectedMember}
              onClose={handleClosePanel}
            />
          ) : (
            <DefaultRightPanel key="default" />
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}
