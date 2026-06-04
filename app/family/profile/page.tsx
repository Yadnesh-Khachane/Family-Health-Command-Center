"use client"

import React, { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { 
  ArrowLeft, 
  Calendar, 
  Activity, 
  ShieldAlert, 
  Heart, 
  Download, 
  FileText, 
  ShieldCheck, 
  Lock, 
  Bell, 
  Database,
  ArrowRight,
  Plus
} from "lucide-react"

import { familyMembers, hospitalConsents, consentAudits } from "@/lib/mock-data/mockData"
import { FamilyHeader } from "@/components/family/FamilyHeader"
import { FamilyStats } from "@/components/family/FamilyStats"
import { ProfileSidebar } from "@/components/family/ProfileSidebar"
import { MemberGrid } from "@/components/family/MemberGrid"
import { HealthSummary } from "@/components/family/HealthSummary"
import { ConsentSummary } from "@/components/family/ConsentSummary"
import { ActivityFeed } from "@/components/family/ActivityFeed"
import { MemberCreator } from "@/components/family/MemberCreator"

import { fadeInUp, staggerContainer } from "@/components/family/animations"
import { FamilyMember } from "@/types/family"

export default function FamilyProfilePage() {
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  
  // Client state for members list to enable dynamic insertions
  const [membersList, setMembersList] = useState<FamilyMember[]>(familyMembers)
  
  // Member Creator state
  const [isCreatorOpen, setIsCreatorOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null)

  // Settings State Toggles
  const [zeroKnowledge, setZeroKnowledge] = useState(true)
  const [emergencyBypass, setEmergencyBypass] = useState(true)
  const [anonymousAggregation, setAnonymousAggregation] = useState(false)

  const [fdaAlerts, setFdaAlerts] = useState(true)
  const [appointmentReminders, setAppointmentReminders] = useState(true)
  const [accessAuditAlerts, setAccessAuditAlerts] = useState(false)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  // Calculate member summaries dynamically
  const totalMembers = membersList.length
  const childrenCount = membersList.filter(m => m.age < 18).length
  const seniorsCount = membersList.filter(m => m.age >= 65).length
  const adultsCount = totalMembers - childrenCount - seniorsCount
  const activeCases = membersList.filter(m => m.status !== "healthy").length

  // Handlers for Member Management actions
  const handleCreateOrUpdateMember = (member: FamilyMember, relationships: any) => {
    const exists = membersList.some(m => m.id === member.id)
    if (exists) {
      // Update
      setMembersList(membersList.map(m => m.id === member.id ? member : m))
      showToast(`Successfully updated credentials for ${member.name}.`)
    } else {
      // Create new
      setMembersList([...membersList, member])
      showToast(`Successfully registered and animated ${member.name} into the household.`)
    }
    setEditingMember(null)
  }

  const handleEditMember = (member: FamilyMember) => {
    setEditingMember(member)
    setIsCreatorOpen(true)
  }

  const handleArchiveMember = (member: FamilyMember) => {
    setMembersList(membersList.filter(m => m.id !== member.id))
    showToast(`Archived member ${member.name}. Clinical access keys revoked.`)
  }

  const handleTransferOwnership = (member: FamilyMember) => {
    showToast(`Transferred admin ownership key of household to ${member.name}.`)
  }

  const handleMergeDuplicate = (member: FamilyMember) => {
    showToast(`Merged duplicate metadata entries for ${member.name} successfully.`)
  }

  return (
    <main className="max-w-[1600px] mx-auto px-6 py-8 space-y-8 select-none">
      
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

      {/* Navigation & Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Link href="/family/dashboard" className="flex items-center gap-2 text-xs text-ivory/60 hover:text-amber font-semibold uppercase tracking-wider transition-colors mb-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl md:text-3xl font-extrabold text-ivory tracking-tight">
            Household Identity &amp; Management
          </h2>
        </div>

        {/* Floating Quick Links */}
        <div className="flex flex-wrap gap-2 bg-white/5 border border-white/5 p-1 rounded-xl">
          <Link href="/family/dashboard" className="px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-white/5 text-ivory/60 hover:text-ivory transition-colors">
            Dashboard
          </Link>
          <Link href="/family/tree" className="px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-white/5 text-ivory/60 hover:text-ivory transition-colors">
            Tree
          </Link>
          <Link href="/family/timeline" className="px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-white/5 text-ivory/60 hover:text-ivory transition-colors">
            Timeline
          </Link>
          <Link href="/family/insights" className="px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-white/5 text-ivory/60 hover:text-ivory transition-colors">
            Insights
          </Link>
        </div>
      </div>

      {/* 1. FAMILY HEADER HERO */}
      <FamilyHeader
        familyName="Sharma Household"
        familyMotto="Health in Unity, Care in Action"
        createdDate="June 2023"
        primaryContact="Rajesh Sharma"
        healthIndex={84}
        onEdit={() => showToast("Modify Identity Form is ready for customization.")}
        onShare={() => showToast("Access Control list share payload generated.")}
        onExport={() => showToast("FHIR Compliant Patient Resource downloaded.")}
      />

      {/* 2. HOUSEHOLD STATS OVERVIEW */}
      <FamilyStats
        totalMembers={totalMembers}
        childrenCount={childrenCount}
        adultsCount={adultsCount}
        seniorsCount={seniorsCount}
        activeCases={activeCases}
      />

      {/* 3. TWO-COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Family Identity Sidebar & Medical Snapshot */}
        <div className="lg:col-span-4 space-y-6">
          <ProfileSidebar
            avatarText="S"
            initialAddress="Plot 12, Sector 5, Vashi, Navi Mumbai, MH, 400703"
            initialEmergencyContact="Rajesh Sharma (+91 98765 43210)"
            initialHospital="Apollo Medical Center, Belapur"
            initialInsurance="Star Health Premier - #SH-99281-9"
            onSave={(data) => showToast("Identity settings updated successfully.")}
          />

          {/* Medical Snapshot */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="show"
            className="frosted-panel rounded-3xl p-5 border border-white/5 space-y-4"
          >
            <h3 className="font-[family-name:var(--font-space-grotesk)] text-xs font-bold uppercase tracking-wider text-white/50">
              Medical Snapshot
            </h3>
            
            <div className="space-y-3.5">
              {/* Upcoming Visits */}
              <div className="p-3 bg-white/5 border border-white/5 rounded-2xl space-y-2">
                <span className="text-[9px] uppercase tracking-wide text-amber font-semibold flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber" />
                  Upcoming Visits
                </span>
                <p className="text-xs font-bold text-white leading-normal">
                  Orthopedic surgeon consultation
                </p>
                <p className="text-[10px] text-white/50">
                  Dec 15 at 10:30 AM • Gayatri Sharma (Dr. Mehta)
                </p>
              </div>

              {/* Recent Surgeries */}
              <div className="p-3 bg-white/5 border border-white/5 rounded-2xl space-y-2">
                <span className="text-[9px] uppercase tracking-wide text-success font-semibold flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-success" />
                  Recent Surgeries
                </span>
                <p className="text-xs font-bold text-white leading-normal">
                  Hip Replacement Surgery
                </p>
                <p className="text-[10px] text-white/50">
                  Jun 15, 2023 • Gayatri Sharma (Dr. Mehta)
                </p>
              </div>

              {/* Active Alerts */}
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-2xl space-y-1.5 critical-blink">
                <span className="text-[9px] uppercase tracking-wide text-destructive font-semibold flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-destructive" />
                  Active Warnings
                </span>
                <p className="text-xs font-bold text-white">
                  FDA Implant Recall ZX-500
                </p>
                <p className="text-[10px] text-white/70">
                  Affects Gayatri Sharma's left femur hip joint.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Members, Health Metrics, Consent, Settings & Logs */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Members Grid */}
          <div className="space-y-3">
            <div className="flex justify-between items-center px-1">
              <h3 className="font-[family-name:var(--font-space-grotesk)] text-sm font-extrabold text-white flex items-center gap-2">
                <Heart className="w-4.5 h-4.5 text-terracotta" />
                Household Members Dossiers
              </h3>
              <button
                onClick={() => {
                  setEditingMember(null)
                  setIsCreatorOpen(true)
                }}
                className="px-4.5 py-2 bg-amber hover:bg-amber/90 text-obsidian text-xs font-black rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-amber/10 uppercase tracking-wider"
              >
                <Plus className="w-4 h-4 text-obsidian" />
                Add New Member
              </button>
            </div>
            
            <MemberGrid 
              members={membersList} 
              onEditMember={handleEditMember}
              onArchiveMember={handleArchiveMember}
              onTransferOwnership={handleTransferOwnership}
              onMergeDuplicate={handleMergeDuplicate}
            />
          </div>

          {/* Health Metrics Chart panel */}
          <HealthSummary />

          {/* Consent Matrix Overview */}
          <ConsentSummary 
            hospitalConsents={hospitalConsents} 
            consentAudits={consentAudits} 
          />

          {/* Grid of Settings & Activity Logs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            
            {/* Activity Feed */}
            <ActivityFeed />

            {/* Privacy & Notification Settings */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="show"
              className="frosted-panel rounded-3xl p-5 border border-white/5 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="font-[family-name:var(--font-space-grotesk)] text-sm font-extrabold text-white flex items-center gap-2">
                    <Lock className="w-4.5 h-4.5 text-terracotta" />
                    Security &amp; Consent Settings
                  </h3>
                  <p className="text-[11px] text-white/50">Configure zero-trust privacy gates</p>
                </div>

                {/* Privacy Options */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5">
                    <div>
                      <h4 className="text-xs font-bold text-white">Zero-Knowledge Telemetry</h4>
                      <p className="text-[9px] text-white/40 mt-0.5">Encrypt sensor vitals end-to-end</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={zeroKnowledge}
                      onChange={(e) => setZeroKnowledge(e.target.checked)}
                      className="w-4 h-4 rounded border-white/10 bg-white/5 text-amber focus:ring-0 focus:ring-offset-0 cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5">
                    <div>
                      <h4 className="text-xs font-bold text-white">Emergency Crisis Bypass</h4>
                      <p className="text-[9px] text-white/40 mt-0.5">Allow immediate paramedic EHR access</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={emergencyBypass}
                      onChange={(e) => setEmergencyBypass(e.target.checked)}
                      className="w-4 h-4 rounded border-white/10 bg-white/5 text-amber focus:ring-0 focus:ring-offset-0 cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5">
                    <div>
                      <h4 className="text-xs font-bold text-white">Anonymous Aggregation</h4>
                      <p className="text-[9px] text-white/40 mt-0.5">Contribute data to public cardiac research</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={anonymousAggregation}
                      onChange={(e) => setAnonymousAggregation(e.target.checked)}
                      className="w-4 h-4 rounded border-white/10 bg-white/5 text-amber focus:ring-0 focus:ring-offset-0 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Notification Settings */}
                <div className="space-y-3 pt-2">
                  <span className="text-[9px] uppercase font-bold tracking-wider text-white/40 flex items-center gap-1.5">
                    <Bell className="w-3.5 h-3.5 text-amber" />
                    Alert Notifications
                  </span>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-xs font-semibold text-white">Critical FDA Implant recalls</span>
                    <input
                      type="checkbox"
                      checked={fdaAlerts}
                      onChange={(e) => setFdaAlerts(e.target.checked)}
                      className="w-4 h-4 rounded border-white/10 bg-white/5 text-amber focus:ring-0 focus:ring-offset-0 cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-xs font-semibold text-white">Appointment &amp; pill checkups</span>
                    <input
                      type="checkbox"
                      checked={appointmentReminders}
                      onChange={(e) => setAppointmentReminders(e.target.checked)}
                      className="w-4 h-4 rounded border-white/10 bg-white/5 text-amber focus:ring-0 focus:ring-offset-0 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Data Export Utilities */}
              <div className="border-t border-white/5 pt-4 mt-4 space-y-2">
                <span className="text-[9px] uppercase font-bold tracking-wider text-white/40 flex items-center gap-1.5 mb-2">
                  <Database className="w-3.5 h-3.5 text-blue-400" />
                  EHR Portability Hub
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button 
                    onClick={() => showToast("All health files exported to JSON packet.")}
                    className="py-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl font-bold transition-all text-ivory/80 hover:text-white flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    JSON EMR
                  </button>
                  <button 
                    onClick={() => showToast("FHIR Compliant XML bundle downloaded.")}
                    className="py-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl font-bold transition-all text-ivory/80 hover:text-white flex items-center justify-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    FHIR Patient
                  </button>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>

      {/* Member Creator Dialog Modal */}
      <MemberCreator
        isOpen={isCreatorOpen}
        onClose={() => setIsCreatorOpen(false)}
        existingMembers={membersList}
        onCreateMember={handleCreateOrUpdateMember}
        editingMember={editingMember}
      />
    </main>
  )
}
