"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  X, 
  User, 
  Activity, 
  ShieldCheck, 
  Plus, 
  Trash2, 
  UserCheck, 
  Baby, 
  Users,
  ChevronLeft,
  ChevronRight,
  Info
} from "lucide-react"
import { FamilyMember, HealthStatus } from "@/types/family"

interface MemberCreatorProps {
  isOpen: boolean
  onClose: () => void
  existingMembers: FamilyMember[]
  onCreateMember: (member: FamilyMember, relationships: RelationshipLink[]) => void
  editingMember?: FamilyMember | null
}

export interface RelationshipLink {
  type: "parent" | "child" | "sibling" | "spouse" | "guardian"
  targetId: string
}

export function MemberCreator({
  isOpen,
  onClose,
  existingMembers,
  onCreateMember,
  editingMember = null
}: MemberCreatorProps) {
  const [step, setStep] = useState(1)

  // Step 1: Basic Info
  const [name, setName] = useState("")
  const [gender, setGender] = useState("male")
  const [dob, setDob] = useState("2000-01-01")
  const [role, setRole] = useState("Relative")
  const [initials, setInitials] = useState("")

  // Step 2: Relationships
  const [relations, setRelations] = useState<RelationshipLink[]>([])
  const [newRelationType, setNewRelationType] = useState<RelationshipLink["type"]>("child")
  const [newRelationTarget, setNewRelationTarget] = useState("")

  // Step 3: Health Metadata
  const [bloodGroup, setBloodGroup] = useState("O+")
  const [conditions, setConditions] = useState<string[]>([])
  const [allergies, setAllergies] = useState<string[]>([])
  const [newAllergy, setNewAllergy] = useState("")
  const [newCondition, setNewCondition] = useState("")
  const [emergencyPhone, setEmergencyPhone] = useState("+91 ")

  // Step 4: Security Consent
  const [permissions, setPermissions] = useState<"none" | "readonly" | "full" | "emergency">("readonly")

  // Auto-generate initials
  useEffect(() => {
    if (name) {
      const parts = name.split(" ")
      const init = parts.map(p => p[0]).join("").toUpperCase().substring(0, 2)
      setInitials(init)
    }
  }, [name])

  // Pre-fill if editing
  useEffect(() => {
    if (editingMember) {
      setName(editingMember.name)
      setRole(editingMember.relation)
      setInitials(editingMember.initials)
      setBloodGroup(editingMember.bloodGroup)
      setAllergies(editingMember.allergies || [])
      setConditions(editingMember.activeMedications.map(m => m.name) || [])
      // Set default relations
      if (editingMember.id === "son") {
        setRelations([
          { type: "child", targetId: "dad" },
          { type: "child", targetId: "mom" }
        ])
      } else if (editingMember.id === "dad") {
        setRelations([
          { type: "spouse", targetId: "mom" },
          { type: "child", targetId: "grandma" }
        ])
      } else if (editingMember.id === "mom") {
        setRelations([
          { type: "spouse", targetId: "dad" }
        ])
      }
    } else {
      setName("")
      setGender("male")
      setDob("2000-01-01")
      setRole("Relative")
      setInitials("")
      setRelations([])
      setBloodGroup("O+")
      setConditions([])
      setAllergies([])
      setEmergencyPhone("+91 ")
      setPermissions("readonly")
    }
    setStep(1)
  }, [editingMember, isOpen])

  // Add relationship helper
  const addRelation = () => {
    if (!newRelationTarget) return
    // Prevent duplicate relation targets
    if (relations.find(r => r.targetId === newRelationTarget)) return
    setRelations([...relations, { type: newRelationType, targetId: newRelationTarget }])
    setNewRelationTarget("")
  }

  // Remove relation
  const removeRelation = (idx: number) => {
    setRelations(relations.filter((_, i) => i !== idx))
  }

  // Allergy helper
  const addAllergy = () => {
    if (newAllergy && !allergies.includes(newAllergy)) {
      setAllergies([...allergies, newAllergy])
      setNewAllergy("")
    }
  }

  // Condition helper
  const addCondition = () => {
    if (newCondition && !conditions.includes(newCondition)) {
      setConditions([...conditions, newCondition])
      setNewCondition("")
    }
  }

  const handleSubmit = () => {
    if (!name) return

    // Calculate age based on DOB
    const birthYear = new Date(dob).getFullYear()
    const currentYear = 2026
    const calculatedAge = editingMember ? editingMember.age : Math.max(1, currentYear - birthYear)

    // Setup active medications based on conditions list (as mockup)
    const activeMedications = conditions.map(c => ({
      name: c,
      dose: "Daily dosage",
      frequency: "1x Daily",
      category: "Prescription"
    }))

    // Determine status from conditions
    let status: HealthStatus = "healthy"
    if (conditions.length > 0) status = "warning"
    if (conditions.includes("Cardiac risk") || conditions.includes("Severe degradation")) status = "critical"

    const newId = editingMember ? editingMember.id : name.toLowerCase().split(" ")[0] || "member-" + Date.now()

    const memberObject: FamilyMember = {
      id: newId,
      name,
      age: calculatedAge,
      relation: role,
      bloodGroup,
      initials,
      status,
      alertText: status !== "healthy" ? `Surveillance active: ${conditions.join(", ")}` : null,
      medicationCount: activeMedications.length,
      lastCheckup: new Date().toISOString().split("T")[0],
      allergies,
      activeMedications
    }

    onCreateMember(memberObject, relations)
    onClose()
  }

  const steps = [
    { title: "Basic Info", step: 1 },
    { title: "Relationships", step: 2 },
    { title: "Clinical Data", step: 3 },
    { title: "Permissions", step: 4 }
  ]

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal Panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-xl frosted-panel border border-white/10 rounded-3xl p-6 bg-charcoal shadow-2xl z-50 text-left flex flex-col justify-between"
        >
          {/* Header */}
          <div className="flex justify-between items-center pb-4 border-b border-white/5">
            <div>
              <h3 className="font-heading font-black text-white text-lg">
                {editingMember ? "Modify Family Member" : "Add Family Member Registry"}
              </h3>
              <p className="text-[10px] text-white/50">FHCC secure credential registry</p>
            </div>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/5 text-white/50 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stepper Progress bar */}
          <div className="flex justify-between items-center gap-1 my-5 text-center text-[9px] uppercase font-bold tracking-wider text-white/40">
            {steps.map((s) => (
              <div key={s.step} className="flex-1">
                <div className={`h-1.5 rounded-full mb-1 transition-all duration-300 ${
                  step >= s.step ? "bg-amber" : "bg-white/10"
                }`} />
                <span className={step === s.step ? "text-amber font-extrabold" : ""}>{s.title}</span>
              </div>
            ))}
          </div>

          {/* Step Contents */}
          <div className="flex-1 min-h-[300px] py-2">
            {step === 1 && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-4 bg-white/5 p-3 rounded-2xl border border-white/5">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-terracotta to-amber flex items-center justify-center text-obsidian text-2xl font-black font-heading select-none">
                    {initials || "+"}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-xs font-bold text-white">Registry Initials Preview</p>
                    <p className="text-[10px] text-white/40 leading-relaxed">Auto-computed from full name. Profile photo avatar is managed via patient credentials.</p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] uppercase tracking-wider font-bold text-white/50 flex items-center gap-1"><User className="w-3.5 h-3.5" />Full Name</label>
                  <input
                    type="text"
                    placeholder="Enter full name..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-xs bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-amber/40"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-wider font-bold text-white/50">Gender</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full text-xs bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-amber/40"
                    >
                      <option value="male" className="bg-charcoal text-white">Male</option>
                      <option value="female" className="bg-charcoal text-white">Female</option>
                      <option value="other" className="bg-charcoal text-white">Other</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-wider font-bold text-white/50">Date of Birth</label>
                    <input
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full text-xs bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-amber/40"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] uppercase tracking-wider font-bold text-white/50">Household Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full text-xs bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-amber/40"
                  >
                    <option value="Grandmother" className="bg-charcoal text-white">Grandparent</option>
                    <option value="Father" className="bg-charcoal text-white">Father</option>
                    <option value="Mother" className="bg-charcoal text-white">Mother</option>
                    <option value="Son" className="bg-charcoal text-white">Child</option>
                    <option value="Guardian" className="bg-charcoal text-white">Guardian</option>
                    <option value="Relative" className="bg-charcoal text-white">Relative</option>
                  </select>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <p className="text-xs font-bold text-white">Symmetrical Relationships Linker</p>
                  <p className="text-[10px] text-white/50 leading-relaxed">Map connections to existing members to rebuild paths in the Family Tree explorer.</p>
                </div>

                {/* Symmetrical Picker form */}
                <div className="flex gap-2 items-end bg-white/5 p-3 rounded-2xl border border-white/5">
                  <div className="flex-1 space-y-1.5">
                    <label className="text-[9px] uppercase tracking-wider font-bold text-white/40">Relationship Type</label>
                    <select
                      value={newRelationType}
                      onChange={(e) => setNewRelationType(e.target.value as RelationshipLink["type"])}
                      className="w-full text-[11px] bg-charcoal border border-white/10 rounded-lg p-2 text-white focus:outline-none"
                    >
                      <option value="parent">Parent Of</option>
                      <option value="child">Child Of</option>
                      <option value="sibling">Sibling Of</option>
                      <option value="spouse">Spouse Of</option>
                      <option value="guardian">Guardian Of</option>
                    </select>
                  </div>

                  <div className="flex-1 space-y-1.5">
                    <label className="text-[9px] uppercase tracking-wider font-bold text-white/40">Target Member</label>
                    <select
                      value={newRelationTarget}
                      onChange={(e) => setNewRelationTarget(e.target.value)}
                      className="w-full text-[11px] bg-charcoal border border-white/10 rounded-lg p-2 text-white focus:outline-none"
                    >
                      <option value="">-- Choose Member --</option>
                      {existingMembers
                        .filter(m => m.id !== editingMember?.id)
                        .map(m => (
                          <option key={m.id} value={m.id}>{m.name} ({m.relation})</option>
                        ))
                      }
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={addRelation}
                    className="p-2 rounded-lg bg-amber text-obsidian font-bold flex items-center justify-center"
                    title="Add Relationship"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Active Relations preview list */}
                <div className="space-y-2">
                  <p className="text-[9px] uppercase tracking-wider font-bold text-white/40">Active Links Preview</p>
                  <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1 scrollbar-thin">
                    {relations.length > 0 ? (
                      relations.map((rel, idx) => {
                        const targetName = existingMembers.find(m => m.id === rel.targetId)?.name || rel.targetId
                        return (
                          <div key={idx} className="flex justify-between items-center p-2 rounded-xl bg-white/5 border border-white/5 text-[11px] font-medium text-white/80">
                            <span className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber" />
                              {name || "New Member"} <strong className="text-amber uppercase text-[9px] tracking-wide border border-amber/20 px-1.5 rounded">{rel.type}</strong> {targetName}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeRelation(idx)}
                              className="text-destructive/60 hover:text-destructive p-1 rounded-full hover:bg-white/5"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )
                      })
                    ) : (
                      <p className="text-[10px] text-white/40 italic py-4 text-center">No relationships set up. This member will float as a single node.</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-wider font-bold text-white/50">Blood Group</label>
                    <select
                      value={bloodGroup}
                      onChange={(e) => setBloodGroup(e.target.value)}
                      className="w-full text-xs bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-amber/40"
                    >
                      <option value="A+" className="bg-charcoal text-white">A+</option>
                      <option value="A-" className="bg-charcoal text-white">A-</option>
                      <option value="B+" className="bg-charcoal text-white">B+</option>
                      <option value="B-" className="bg-charcoal text-white">B-</option>
                      <option value="AB+" className="bg-charcoal text-white">AB+</option>
                      <option value="AB-" className="bg-charcoal text-white">AB-</option>
                      <option value="O+" className="bg-charcoal text-white">O+</option>
                      <option value="O-" className="bg-charcoal text-white">O-</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-wider font-bold text-white/50">Emergency Line</label>
                    <input
                      type="text"
                      value={emergencyPhone}
                      onChange={(e) => setEmergencyPhone(e.target.value)}
                      className="w-full text-xs bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-amber/40"
                    />
                  </div>
                </div>

                {/* Conditions list */}
                <div className="space-y-1.5">
                  <label className="text-[9px] uppercase tracking-wider font-bold text-white/50">Active Conditions</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Hypertension, Cardiac risk..."
                      value={newCondition}
                      onChange={(e) => setNewCondition(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addCondition()}
                      className="w-full text-xs bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-amber/40"
                    />
                    <button
                      type="button"
                      onClick={addCondition}
                      className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white font-bold"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {conditions.map(c => (
                      <span key={c} className="px-2.5 py-1 bg-amber/10 border border-amber/20 text-amber text-[10px] font-bold rounded-lg flex items-center gap-1.5">
                        {c}
                        <button type="button" onClick={() => setConditions(conditions.filter(con => con !== c))} className="font-black">×</button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Allergies list */}
                <div className="space-y-1.5">
                  <label className="text-[9px] uppercase tracking-wider font-bold text-white/50">Allergies</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Penicillin, Peanuts..."
                      value={newAllergy}
                      onChange={(e) => setNewAllergy(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addAllergy()}
                      className="w-full text-xs bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-amber/40"
                    />
                    <button
                      type="button"
                      onClick={addAllergy}
                      className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white font-bold"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {allergies.map(al => (
                      <span key={al} className="px-2.5 py-1 bg-destructive/10 border border-destructive/20 text-destructive text-[10px] font-bold rounded-lg flex items-center gap-1.5">
                        {al}
                        <button type="button" onClick={() => setAllergies(allergies.filter(a => a !== al))} className="font-black">×</button>
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex gap-3 text-xs leading-relaxed text-white/70">
                  <Info className="w-5 h-5 text-amber shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white">EHR Visibility Consent Policy</span>
                    <p className="text-[11px] text-white/50 mt-1">Configure which hospital bridges and proxies can query logs and download clinical parameters for this member registry.</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div 
                    onClick={() => setPermissions("none")}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex justify-between items-center ${
                      permissions === "none" ? "bg-white/5 border-amber" : "bg-white/5 border-white/5 hover:border-white/10"
                    }`}
                  >
                    <div>
                      <h4 className="text-xs font-bold text-white">View Access Only</h4>
                      <p className="text-[9px] text-white/40 mt-0.5">Restrict medical records and only share identity fields.</p>
                    </div>
                    {permissions === "none" && <ShieldCheck className="w-5 h-5 text-amber" />}
                  </div>

                  <div 
                    onClick={() => setPermissions("readonly")}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex justify-between items-center ${
                      permissions === "readonly" ? "bg-white/5 border-amber" : "bg-white/5 border-white/5 hover:border-white/10"
                    }`}
                  >
                    <div>
                      <h4 className="text-xs font-bold text-white">Medical Access level</h4>
                      <p className="text-[9px] text-white/40 mt-0.5">Allow reading lab trends, vitals history, and immunizations.</p>
                    </div>
                    {permissions === "readonly" && <ShieldCheck className="w-5 h-5 text-amber" />}
                  </div>

                  <div 
                    onClick={() => setPermissions("full")}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex justify-between items-center ${
                      permissions === "full" ? "bg-white/5 border-amber" : "bg-white/5 border-white/5 hover:border-white/10"
                    }`}
                  >
                    <div>
                      <h4 className="text-xs font-bold text-white">Full Proxy Authorization</h4>
                      <p className="text-[9px] text-white/40 mt-0.5">Complete proxy permissions to sign medical consent and update EHR file records.</p>
                    </div>
                    {permissions === "full" && <ShieldCheck className="w-5 h-5 text-amber" />}
                  </div>

                  <div 
                    onClick={() => setPermissions("emergency")}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex justify-between items-center ${
                      permissions === "emergency" ? "bg-white/5 border-amber animate-pulse" : "bg-white/5 border-white/5 hover:border-white/10"
                    }`}
                  >
                    <div>
                      <h4 className="text-xs font-bold text-white">Bypass Emergency Only</h4>
                      <p className="text-[9px] text-white/40 mt-0.5">Automatically trigger clinical override locks under Crisis Mode bypass.</p>
                    </div>
                    {permissions === "emergency" && <ShieldCheck className="w-5 h-5 text-amber" />}
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Footer Navigation */}
          <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-5">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/5 text-xs text-white/80 hover:text-white rounded-xl transition-all flex items-center gap-1.5 font-bold uppercase tracking-wider"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={() => {
                  if (step === 1 && !name) return
                  setStep(step + 1)
                }}
                disabled={step === 1 && !name}
                className="px-5 py-2.5 bg-amber hover:bg-amber/90 text-obsidian text-xs font-black rounded-xl transition-all flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed uppercase tracking-wider"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="px-6 py-2.5 bg-success text-white text-xs font-black rounded-xl hover:bg-success/90 transition-all uppercase tracking-wider shadow-lg shadow-success/10"
              >
                {editingMember ? "Apply Changes" : "Register Member"}
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
export default MemberCreator
