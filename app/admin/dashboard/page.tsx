"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

// Mock data
const consentRequests = [
  { id: 1, hospital: "Apollo Medical Center", family: "Sharma Family", member: "Gayatri", type: "Full Access Request", time: "2h ago" },
  { id: 2, hospital: "City General", family: "Gupta Family", member: "Rajesh", type: "Read-Only Request", time: "5h ago" },
  { id: 3, hospital: "Metro Hospital", family: "Patel Family", member: "Anita", type: "Emergency Access", time: "8h ago" },
];

const fdaRecalls = [
  { id: "REC-2024-0891", name: "OrthoTech Hip Implant ZX-500", families: 23, hospitals: 2, familiesConfirmed: 18, hospitalsConfirmed: 2 },
  { id: "REC-2024-0902", name: "MedCorp Insulin Pump V3", families: 8, hospitals: 1, familiesConfirmed: 5, hospitalsConfirmed: 1 },
];

const anomalies = [
  { id: 1, type: "access", message: "Unusual access pattern — Hospital XYZ accessing 45 records in 2 minutes" },
  { id: 2, type: "credential", message: "Credential anomaly — Multiple failed logins for Admin account" },
];

const recentEntities = [
  { name: "The Sharma Family", details: "4 members", status: "Active" },
  { name: "Apollo Medical Center", details: "12 departments", status: "Active" },
  { name: "City General Hospital", details: "8 departments", status: "Active" },
];

export default function AdminDashboard() {
  const [requestStatuses, setRequestStatuses] = useState<Record<number, "approved" | "denied" | null>>({});
  const [showDenyConfirm, setShowDenyConfirm] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleApprove = (id: number) => {
    setRequestStatuses(prev => ({ ...prev, [id]: "approved" }));
  };

  const handleDeny = (id: number) => {
    setShowDenyConfirm(id);
  };

  const confirmDeny = (id: number) => {
    setRequestStatuses(prev => ({ ...prev, [id]: "denied" }));
    setShowDenyConfirm(null);
  };

  const pushRecallAlert = (families: number, hospitals: number) => {
    setToastMessage(`Recall alert pushed to ${families} families and ${hospitals} hospitals`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 opacity-30 pointer-events-none" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")" }} />
      
      {/* Ambient Orbs */}
      <div className="fixed top-20 left-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-20 right-20 w-80 h-80 bg-terracotta/10 rounded-full blur-3xl pointer-events-none" />

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-lg frosted-glass border border-amber-500/30"
          >
            <p className="text-ivory font-medium">{toastMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Deny Confirmation Modal */}
      <AnimatePresence>
        {showDenyConfirm !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setShowDenyConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="frosted-panel rounded-xl p-6 max-w-sm mx-4"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-ivory font-semibold text-lg mb-2">Confirm Denial</h3>
              <p className="text-ivory/70 mb-4">Are you sure you want to deny this access request?</p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowDenyConfirm(null)}
                  className="px-4 py-2 rounded-lg text-ivory/70 hover:text-ivory transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => confirmDeny(showDenyConfirm)}
                  className="px-4 py-2 rounded-lg bg-crimson text-ivory font-medium hover:bg-crimson/80 transition-colors"
                >
                  Deny Access
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Bar */}
      <header className="sticky top-0 z-40 frosted-glass px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left: Logo + Title */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-terracotta flex items-center justify-center">
                <span className="text-obsidian font-bold text-lg">F</span>
              </div>
            </Link>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold text-ivory font-space-grotesk">Command Center: Admin</h1>
              <svg className="w-5 h-5 text-terracotta" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
              </svg>
            </div>
          </div>

          {/* Center: System Health Pulse */}
          <div className="hidden md:flex items-center gap-3">
            <span className="text-ivory/50 text-sm">System Health</span>
            <div className="w-48 h-8 relative overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 200 40" preserveAspectRatio="none">
                <motion.path
                  d="M0,20 L20,20 L25,10 L30,30 L35,15 L40,25 L45,20 L200,20"
                  fill="none"
                  stroke="rgba(245,166,35,0.6)"
                  strokeWidth="2"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              </svg>
            </div>
          </div>

          {/* Right: Notifications + Avatar + Menu */}
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-lg hover:bg-white/5 transition-colors">
              <svg className="w-6 h-6 text-ivory/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-terracotta rounded-full text-xs text-ivory flex items-center justify-center font-medium">8</span>
            </button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-terracotta flex items-center justify-center">
              <span className="text-obsidian font-bold text-sm">SA</span>
            </div>
            <button className="p-2 rounded-lg hover:bg-white/5 transition-colors">
              <svg className="w-6 h-6 text-ivory/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content - 3x2 Grid */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card 1: Consent Governance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="frosted-panel rounded-xl p-6"
          >
            <h2 className="text-ivory font-semibold text-lg mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Consent Governance
            </h2>
            
            <div className="mb-4">
              <p className="text-amber-500 text-3xl font-bold font-space-grotesk">1,247</p>
              <p className="text-ivory/50 text-sm">Active Consent Links</p>
            </div>

            <div className="space-y-3 mb-4">
              {consentRequests.map(req => (
                <div key={req.id} className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-ivory text-sm font-medium">{req.hospital} → {req.family} ({req.member})</p>
                      <p className="text-ivory/50 text-xs">{req.type}</p>
                    </div>
                    <span className="text-ivory/40 text-xs">{req.time}</span>
                  </div>
                  {requestStatuses[req.id] === "approved" ? (
                    <span className="text-sage text-sm font-medium">Approved ✓</span>
                  ) : requestStatuses[req.id] === "denied" ? (
                    <span className="text-crimson text-sm font-medium">Denied ✗</span>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(req.id)}
                        className="px-3 py-1 text-xs rounded bg-sage/20 text-sage hover:bg-sage/30 transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleDeny(req.id)}
                        className="px-3 py-1 text-xs rounded bg-crimson/20 text-crimson hover:bg-crimson/30 transition-colors"
                      >
                        Deny
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <Link href="/admin/consent" className="text-amber-500 text-sm hover:text-amber-400 transition-colors">
              View All Requests →
            </Link>
          </motion.div>

          {/* Card 2: FDA Recall Propagation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="frosted-panel rounded-xl p-6"
          >
            <h2 className="text-ivory font-semibold text-lg mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-crimson" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              FDA Recall Propagation
            </h2>

            <div className="space-y-4 mb-4">
              {fdaRecalls.map(recall => (
                <div key={recall.id} className="p-3 rounded-lg bg-white/5 border border-crimson/20">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-crimson text-xs font-mono">{recall.id}</p>
                      <p className="text-ivory text-sm font-medium">{recall.name}</p>
                      <p className="text-ivory/50 text-xs">Affected: {recall.families} families, {recall.hospitals} hospitals</p>
                    </div>
                    <button
                      onClick={() => pushRecallAlert(recall.families, recall.hospitals)}
                      className="px-3 py-1 text-xs rounded bg-terracotta text-ivory hover:bg-terracotta/80 transition-colors shrink-0"
                    >
                      Push Alert
                    </button>
                  </div>
                  <div className="text-xs text-ivory/50">
                    Acknowledged: {recall.familiesConfirmed}/{recall.families} families, {recall.hospitalsConfirmed}/{recall.hospitals} hospitals
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Card 3: Anomaly Detection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="frosted-panel rounded-xl p-6"
          >
            <h2 className="text-ivory font-semibold text-lg mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-saffron" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Anomaly Detection
            </h2>

            <div className="flex items-center gap-4 mb-4">
              <div>
                <p className="text-crimson text-3xl font-bold font-space-grotesk">3</p>
                <p className="text-ivory/50 text-sm">Flagged Today</p>
              </div>
              <div className="flex-1 h-12">
                <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                  <path
                    d="M0,30 L10,28 L20,32 L30,25 L40,27 L50,20 L60,22 L70,18 L80,15 L90,8"
                    fill="none"
                    stroke="rgba(245,166,35,0.6)"
                    strokeWidth="2"
                  />
                  <circle cx="90" cy="8" r="4" fill="#DC2626" className="critical-blink" />
                </svg>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              {anomalies.map(anomaly => (
                <div key={anomaly.id} className="p-3 rounded-lg bg-crimson/10 border border-crimson/20">
                  <p className="text-ivory text-sm">{anomaly.message}</p>
                </div>
              ))}
            </div>

            <Link href="/admin/anomalies" className="text-amber-500 text-sm hover:text-amber-400 transition-colors">
              Investigate →
            </Link>
          </motion.div>

          {/* Card 4: Entity Management */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="frosted-panel rounded-xl p-6"
          >
            <h2 className="text-ivory font-semibold text-lg mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Entity Management
            </h2>

            <div className="flex gap-6 mb-4">
              <div>
                <p className="text-amber-500 text-2xl font-bold font-space-grotesk">342</p>
                <p className="text-ivory/50 text-xs">Families</p>
              </div>
              <div>
                <p className="text-terracotta text-2xl font-bold font-space-grotesk">28</p>
                <p className="text-ivory/50 text-xs">Hospitals</p>
              </div>
              <div>
                <p className="text-sage text-2xl font-bold font-space-grotesk">6</p>
                <p className="text-ivory/50 text-xs">Admins</p>
              </div>
            </div>

            <div className="mb-4">
              <input
                type="text"
                placeholder="Search entities..."
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-ivory placeholder:text-ivory/30 focus:outline-none focus:border-amber-500/50 transition-colors"
              />
            </div>

            <div className="space-y-2 mb-4">
              {recentEntities.map((entity, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                  <div>
                    <p className="text-ivory text-sm">{entity.name}</p>
                    <p className="text-ivory/50 text-xs">{entity.details}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-xs bg-sage/20 text-sage">{entity.status}</span>
                </div>
              ))}
            </div>

            <Link href="/admin/entities" className="text-amber-500 text-sm hover:text-amber-400 transition-colors">
              Manage All Entities →
            </Link>
          </motion.div>

          {/* Card 5: Emergency Protocol */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="frosted-panel rounded-xl p-6"
          >
            <h2 className="text-ivory font-semibold text-lg mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-crimson" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              Emergency Protocol
            </h2>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 rounded-full bg-sage"></div>
              <p className="text-sage font-medium">No Active Emergencies</p>
            </div>

            <Link
              href="/admin/emergency"
              className="block w-full text-center px-4 py-3 rounded-lg border-2 border-terracotta text-terracotta font-medium hover:bg-terracotta/10 transition-colors mb-4"
            >
              Declare Emergency
            </Link>

            <div className="p-3 rounded-lg bg-white/5 mb-4">
              <p className="text-ivory/50 text-xs mb-1">Last Emergency</p>
              <p className="text-ivory text-sm">Nov 15, 2026 — Flood Response, East District</p>
              <p className="text-ivory/40 text-xs">Ended Nov 18, 2026</p>
            </div>

            <Link href="/admin/emergency/scheduler" className="text-amber-500 text-sm hover:text-amber-400 transition-colors">
              Emergency Drill Scheduler →
            </Link>
          </motion.div>

          {/* Card 6: System Configuration */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="frosted-panel rounded-xl p-6"
          >
            <h2 className="text-ivory font-semibold text-lg mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              System Configuration
            </h2>

            <div className="space-y-3 mb-4">
              {[
                { label: "Crisis Mode", enabled: true },
                { label: "Cross-Family Scanning", enabled: true },
                { label: "AI Predictions", enabled: true },
              ].map((toggle, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                  <span className="text-ivory text-sm">{toggle.label}</span>
                  <span className={`px-2 py-0.5 rounded text-xs ${toggle.enabled ? "bg-sage/20 text-sage" : "bg-crimson/20 text-crimson"}`}>
                    {toggle.enabled ? "Enabled" : "Disabled"}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-lg bg-white/5 mb-4">
              <p className="text-ivory/50 text-xs mb-1">Algorithmic Fairness</p>
              <div className="flex items-center gap-2">
                <p className="text-ivory text-sm">Bias Score:</p>
                <span className="text-sage font-mono">0.03</span>
                <span className="text-sage/60 text-xs">(within threshold)</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Link href="/admin/audit" className="text-amber-500 text-sm hover:text-amber-400 transition-colors">
                View Full Audit Trail →
              </Link>
              <Link href="/admin/backup" className="text-amber-500 text-sm hover:text-amber-400 transition-colors">
                System Backup →
              </Link>
            </div>
          </motion.div>

        </div>
      </main>
    </div>
  );
}
