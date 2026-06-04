"use client"

import React from "react"
import Link from "next/link"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StatusOrb } from "./StatusOrb"
import { RiskGauge } from "./RiskGauge"
import { FamilyMember } from "@/types/family"
import { vitalsHistory, timelineEvents } from "@/lib/mock-data/mockData"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface MemberDrawerProps {
  isOpen: boolean
  onClose: () => void
  member: FamilyMember | null
}

export function MemberDrawer({ isOpen, onClose, member }: MemberDrawerProps) {
  if (!member) return null

  const vitals = vitalsHistory[member.id] || []

  // Filter events related to this member
  const memberEvents = timelineEvents.filter(evt => {
    if (member.id === "grandma" && evt.id.match(/e1|e2|e3|e4|e8|e9/)) return true
    if (member.id === "dad" && evt.id.match(/e5|e7/)) return true
    if (member.id === "mom" && evt.id.match(/e5/)) return true
    if (member.id === "son" && evt.id.match(/e6/)) return true
    return evt.title.includes(member.initials)
  })

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg bg-[#0F0F0F] border-l border-amber/10 text-white overflow-y-auto p-0 z-50">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-white/5 relative bg-gradient-to-b from-[#141414] to-[#0F0F0F] shrink-0">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber to-terracotta flex items-center justify-center text-xl font-bold text-obsidian">
                {member.initials}
              </div>
              <div>
                <h3 className="font-[family-name:var(--font-space-grotesk)] text-xl font-bold text-white flex items-center gap-2">
                  {member.name}
                  <StatusOrb status={member.status} />
                </h3>
                <p className="text-xs text-white/50">{member.relation} • Age {member.age}</p>
                <Link 
                  href={`/family/members/${member.id}`}
                  className="text-xs text-amber hover:text-amber/80 transition-colors mt-1 inline-block"
                  onClick={onClose}
                >
                  View Complete Medical Dossier →
                </Link>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="overview" className="flex-1 flex flex-col min-h-0">
            <TabsList className="grid grid-cols-4 bg-[#141414] rounded-none border-b border-white/5 shrink-0 h-11 text-xs">
              <TabsTrigger value="overview" className="text-white/60 data-[state=active]:text-white">Overview</TabsTrigger>
              <TabsTrigger value="vitals" className="text-white/60 data-[state=active]:text-white">Vitals</TabsTrigger>
              <TabsTrigger value="timeline" className="text-white/60 data-[state=active]:text-white">Timeline</TabsTrigger>
              <TabsTrigger value="ai" className="text-white/60 data-[state=active]:text-white">AI Insights</TabsTrigger>
            </TabsList>

            {/* Tab: Overview */}
            <TabsContent value="overview" className="p-6 space-y-6 flex-1 overflow-y-auto scrollbar-thin mt-0">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-white/5 border border-white/5 rounded-xl">
                  <p className="text-[10px] text-white/40 font-semibold uppercase">Blood Group</p>
                  <p className="text-sm font-bold text-white mt-1">{member.bloodGroup}</p>
                </div>
                <div className="p-3 bg-white/5 border border-white/5 rounded-xl">
                  <p className="text-[10px] text-white/40 font-semibold uppercase">Last Checkup</p>
                  <p className="text-sm font-bold text-white mt-1">{member.lastCheckup}</p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs uppercase tracking-wider text-white/40 font-semibold">Active Medications</h4>
                {member.activeMedications.length > 0 ? (
                  <div className="space-y-2">
                    {member.activeMedications.map((med, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 bg-white/5 border border-white/5 rounded-xl">
                        <div>
                          <p className="text-xs font-bold text-white">{med.name}</p>
                          <p className="text-[10px] text-white/50">{med.category}</p>
                        </div>
                        <span className="text-xs bg-white/10 px-2 py-1 rounded text-white/80">{med.dose}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-white/40 italic">No active daily medications</p>
                )}
              </div>

              <div className="space-y-2">
                <h4 className="text-xs uppercase tracking-wider text-white/40 font-semibold">Allergies</h4>
                <div className="flex flex-wrap gap-2">
                  {member.allergies.length > 0 ? (
                    member.allergies.map((al, idx) => (
                      <span key={idx} className="px-2.5 py-1 bg-destructive/15 border border-destructive/30 rounded-lg text-xs text-destructive font-semibold">
                        {al}
                      </span>
                    ))
                  ) : (
                    <p className="text-xs text-white/40 italic">No known allergies</p>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Tab: Vitals */}
            <TabsContent value="vitals" className="p-6 space-y-6 flex-1 overflow-y-auto scrollbar-thin mt-0">
              <h4 className="text-xs uppercase tracking-wider text-white/40 font-semibold">Recent Vital Trends</h4>
              {vitals.length > 0 ? (
                <div className="w-full h-48 text-xs">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={vitals} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                      <XAxis dataKey="timestamp" stroke="rgba(245, 240, 232, 0.4)" />
                      <YAxis stroke="rgba(245, 240, 232, 0.4)" />
                      <Tooltip contentStyle={{ backgroundColor: "#141414", borderColor: "rgba(255,255,255,0.1)" }} />
                      <Line type="monotone" dataKey="systolic" stroke="var(--terracotta)" strokeWidth={2} />
                      <Line type="monotone" dataKey="heartRate" stroke="var(--amber)" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-xs text-white/40 italic">No vitals registered.</p>
              )}
            </TabsContent>

            {/* Tab: Timeline */}
            <TabsContent value="timeline" className="p-6 space-y-4 flex-1 overflow-y-auto scrollbar-thin mt-0">
              <h4 className="text-xs uppercase tracking-wider text-white/40 font-semibold">Case History</h4>
              <div className="space-y-2.5">
                {memberEvents.map(evt => (
                  <div key={evt.id} className="p-3 bg-white/5 border border-white/5 rounded-xl">
                    <div className="flex justify-between items-center text-[9px] text-white/45">
                      <span>{evt.date}</span>
                      <span className="uppercase font-semibold tracking-wide text-amber">{evt.category}</span>
                    </div>
                    <p className="text-xs font-bold text-white mt-1">{evt.title}</p>
                    <p className="text-[10px] text-white/60">{evt.subtitle}</p>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Tab: AI Insights */}
            <TabsContent value="ai" className="p-6 space-y-6 flex-1 overflow-y-auto scrollbar-thin mt-0">
              <h4 className="text-xs uppercase tracking-wider text-white/40 font-semibold">Predictive Health Score</h4>
              {member.id === "grandma" ? (
                <>
                  <RiskGauge score={78} label="Severe Adhesion & Recall Risk" />
                  <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-xs text-white/80 leading-relaxed mt-4">
                    <strong>Surveillance Alert:</strong> Active surveillance required. Scheduling consultation for replacement review.
                  </div>
                </>
              ) : (
                <div className="text-center py-10">
                  <p className="text-xs text-white/40 italic">Zero predictive anomaly alerts detected for this member.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  )
}
export default MemberDrawer
