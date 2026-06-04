"use client"

import React, { useState, createContext, useContext } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Home, 
  GitBranch,
  Users,
  Clock, 
  LineChart, 
  ShieldCheck, 
  AlertCircle, 
  FileText, 
  CheckSquare, 
  Settings, 
  Bell, 
  Menu, 
  X, 
  AlertOctagon, 
  QrCode, 
  ShieldAlert,
  ChevronRight
} from "lucide-react"
import { familyMembers, emergencyContacts } from "@/lib/mock-data/mockData"
import { StatusOrb } from "@/components/family/StatusOrb"
import { UserMenu } from "@/components/layout/user-menu"

// Define a context to control Crisis Mode globally
interface FamilyContextType {
  isCrisisActive: boolean
  setCrisisActive: (val: boolean) => void
}

const FamilyContext = createContext<FamilyContextType | undefined>(undefined)

export function useFamily() {
  const context = useContext(FamilyContext)
  if (!context) {
    throw new Error("useFamily must be used within a FamilyLayout")
  }
  return context
}

const navItems = [
  { icon: Home, label: "Dashboard", href: "/family/dashboard" },
  { icon: GitBranch, label: "Family Tree", href: "/family/tree" },
  { icon: Users, label: "Family Profile", href: "/family/profile" },
  { icon: Clock, label: "Timeline", href: "/family/timeline" },
  { icon: LineChart, label: "Insights", href: "/family/insights" },
  { icon: ShieldCheck, label: "Consent", href: "/family/consent" },
  { icon: FileText, label: "Records", href: "/family/records" },
  { icon: CheckSquare, label: "Tasks", href: "/family/tasks" },
  { icon: AlertCircle, label: "Emergency", href: "/family/emergency" },
  { icon: Settings, label: "Settings", href: "/family/settings" }
]

export default function FamilyLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isCrisisActive, setCrisisActive] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  // Demo Notification Messages
  const notifications = [
    { id: "n1", text: "FDA Recall #REC-2024-0891 affects Gayatri's hip implant lot.", type: "critical" },
    { id: "n2", text: "Dr. Sen posted lab results for Gayatri Sharma.", type: "normal" },
    { id: "n3", text: "Emergency access request approved for Apollo Medical Center.", type: "success" }
  ]

  return (
    <FamilyContext.Provider value={{ isCrisisActive, setCrisisActive }}>
      <div className="relative min-h-screen bg-background text-foreground flex overflow-hidden">
        {/* Noise overlay */}
        <div className="noise-overlay" />
        {/* Ambient glow orbs */}
        <div className="ambient-glow-top" />
        <div className="ambient-glow-bottom" />

        {/* Left Side Rail */}
        <nav className="fixed left-0 top-16 bottom-0 w-[70px] frosted-panel border-r border-amber/10 z-40 flex flex-col items-center py-6 gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.label} href={item.href} title={item.label}>
                <motion.div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-amber/10 border-l-2 border-amber text-terracotta"
                      : "hover:bg-white/5 text-ivory/60 hover:text-ivory"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <item.icon className="w-5 h-5" />
                </motion.div>
              </Link>
            )
          })}
        </nav>

        {/* Top Header Bar */}
        <header className="fixed top-0 left-0 right-0 h-16 frosted-glass z-50 flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-terracotta to-amber flex items-center justify-center">
                <span className="font-[family-name:var(--font-space-grotesk)] text-obsidian text-lg font-bold">F</span>
              </div>
              <span className="font-[family-name:var(--font-space-grotesk)] text-ivory text-base font-semibold tracking-tight hidden sm:inline">
                FHCC Command
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {/* Crisis Toggle Button */}
            <button
              onClick={() => setCrisisActive(true)}
              className="px-4 py-1.5 rounded-full bg-destructive text-white text-xs font-bold flex items-center gap-1.5 pulse-glow hover:bg-destructive/80 transition-colors"
            >
              <ShieldAlert className="w-4 h-4" />
              CRISIS MODE
            </button>

            {/* Notifications Bell */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                <Bell className="w-5 h-5 text-ivory/80" />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-terracotta notification-pulse" />
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    className="absolute right-0 mt-3 w-80 frosted-panel border border-amber/10 rounded-2xl p-4 shadow-2xl z-50"
                  >
                    <div className="flex justify-between items-center mb-3 pb-2 border-b border-white/5">
                      <h4 className="font-[family-name:var(--font-space-grotesk)] text-xs uppercase tracking-wider text-ivory/60 font-semibold">
                        Alert Center
                      </h4>
                      <button onClick={() => setShowNotifications(false)} className="p-1 rounded-full hover:bg-white/5">
                        <X className="w-4 h-4 text-ivory/60" />
                      </button>
                    </div>
                    <div className="space-y-2">
                      {notifications.map((notif) => (
                        <div 
                          key={notif.id} 
                          className={`p-2.5 rounded-lg border text-xs leading-relaxed ${
                            notif.type === "critical" 
                              ? "bg-destructive/10 border-destructive/20 text-destructive" 
                              : notif.type === "success"
                              ? "bg-success/10 border-success/20 text-success"
                              : "bg-white/5 border-white/10 text-ivory/80"
                          }`}
                        >
                          {notif.text}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile */}
            <UserMenu />
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 pt-16 pl-[70px] h-screen overflow-y-auto">
          {children}
        </div>

        {/* Crisis Mode Fullscreen Overlay */}
        <AnimatePresence>
          {isCrisisActive && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-[#0A0202] text-white flex flex-col justify-between overflow-y-auto p-6 md:p-12 font-sans select-none"
            >
              {/* Emergency grid background */}
              <div 
                className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                style={{
                  backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")"
                }}
              />

              {/* Header */}
              <header className="flex justify-between items-center relative z-10 border-b border-destructive/20 pb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-destructive flex items-center justify-center critical-blink">
                    <AlertOctagon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-black tracking-tight text-destructive">
                      CRISIS OVERRIDE PROTOCOL
                    </h1>
                    <p className="text-xs text-white/50">Consent gates relaxed • Direct clinical bypass active</p>
                  </div>
                </div>
                <button
                  onClick={() => setCrisisActive(false)}
                  className="px-4 py-2 border border-white/20 rounded-full text-xs font-semibold hover:bg-white/10 transition-colors"
                >
                  Exit Crisis Mode
                </button>
              </header>

              {/* Crisis Core Info */}
              <main className="grid grid-cols-1 lg:grid-cols-3 gap-8 my-8 relative z-10">
                {/* Left: Patient Emergency Packet */}
                <div className="lg:col-span-2 space-y-6">
                  {familyMembers.map((member) => (
                    <div key={member.id} className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold">
                            {member.initials}
                          </div>
                          <div>
                            <h3 className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold">
                              {member.name}
                            </h3>
                            <p className="text-xs text-white/60">{member.relation} • Age {member.age}</p>
                          </div>
                        </div>
                        <span className="px-3 py-1 bg-destructive/30 border border-destructive/50 rounded-full text-xs font-bold text-destructive">
                          Blood Group: {member.bloodGroup}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        {/* Allergies */}
                        <div className="p-3.5 rounded-xl bg-white/5 border border-white/5">
                          <p className="text-xs text-white/40 font-semibold mb-1">ALLERGIES</p>
                          <p className="font-semibold text-destructive">
                            {member.allergies.length > 0 ? member.allergies.join(", ") : "No Known Allergies"}
                          </p>
                        </div>
                        {/* Medications */}
                        <div className="p-3.5 rounded-xl bg-white/5 border border-white/5">
                          <p className="text-xs text-white/40 font-semibold mb-1">ESSENTIAL MEDICATIONS</p>
                          <p className="text-white/80 font-medium">
                            {member.activeMedications.length > 0 
                              ? member.activeMedications.map(m => `${m.name} (${m.dose})`).join(", ") 
                              : "No Active Medications"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Right: Emergency Contacts & Quick QR Code */}
                <div className="space-y-6">
                  {/* Contacts */}
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                    <h3 className="font-[family-name:var(--font-space-grotesk)] text-sm font-bold uppercase tracking-wider text-white/60">
                      Emergency Contacts
                    </h3>
                    <div className="space-y-3">
                      {emergencyContacts.map((contact) => (
                        <div key={contact.id} className="p-3 rounded-xl bg-white/5 border border-white/5">
                          <p className="text-xs text-white/50">{contact.relation}</p>
                          <p className="font-semibold text-white">{contact.name}</p>
                          <p className="text-xs font-mono text-white/80 mt-1">{contact.phone}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* QR code simulation */}
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center text-center space-y-4">
                    <QrCode className="w-28 h-28 text-white" />
                    <div>
                      <h4 className="font-[family-name:var(--font-space-grotesk)] text-sm font-bold text-white">
                        Emergency Data QR
                      </h4>
                      <p className="text-[11px] text-white/60 mt-1">
                        Scan to verify consent logs and download emergency medical dossier immediately.
                      </p>
                    </div>
                  </div>
                </div>
              </main>

              {/* Footer status warning */}
              <footer className="border-t border-destructive/20 pt-6 text-center text-xs text-white/40 relative z-10">
                FHCC Critical System Protocol. All access events during Crisis Override are logged under zero-trust metadata tracking.
              </footer>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </FamilyContext.Provider>
  )
}
