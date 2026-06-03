"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

type Severity = "low" | "medium" | "high" | "critical";
type FilterType = "all" | Severity;

interface Anomaly {
  id: number;
  timestamp: string;
  entity: string;
  entityType: "family" | "hospital" | "admin";
  type: string;
  severity: Severity;
  description: string;
  details: {
    ip: string;
    location: string;
    action: string;
    recordsAccessed: number;
    context: string;
  };
  status: "pending" | "dismissed" | "escalated" | "frozen";
}

const initialAnomalies: Anomaly[] = [
  {
    id: 1,
    timestamp: "Today, 2:34 PM",
    entity: "Hospital XYZ Admin",
    entityType: "hospital",
    type: "Unusual Access Pattern",
    severity: "critical",
    description: "Accessed 45 patient records in under 2 minutes",
    details: {
      ip: "192.168.1.105",
      location: "Mumbai, India",
      action: "Bulk record access",
      recordsAccessed: 45,
      context: "Average access rate for this user is 5 records/hour. This spike is 540x the normal rate, suggesting potential data exfiltration or compromised credentials."
    },
    status: "pending"
  },
  {
    id: 2,
    timestamp: "Today, 1:15 PM",
    entity: "Admin Account: rahul.v",
    entityType: "admin",
    type: "Multiple Failed Logins",
    severity: "high",
    description: "8 failed login attempts from different IPs",
    details: {
      ip: "Multiple (8 unique)",
      location: "Various - including overseas",
      action: "Authentication attempts",
      recordsAccessed: 0,
      context: "Login attempts originated from 5 different countries within 10 minutes. This pattern suggests a credential stuffing attack or brute force attempt."
    },
    status: "pending"
  },
  {
    id: 3,
    timestamp: "Today, 11:42 AM",
    entity: "Apollo Medical Center",
    entityType: "hospital",
    type: "After-Hours Access",
    severity: "medium",
    description: "Accessed patient records at 3:00 AM local time",
    details: {
      ip: "10.0.0.45",
      location: "Delhi, India",
      action: "Record viewing",
      recordsAccessed: 12,
      context: "Access occurred outside hospital operating hours (6 AM - 11 PM). The accessing account belongs to day-shift personnel."
    },
    status: "pending"
  },
  {
    id: 4,
    timestamp: "Yesterday, 8:30 PM",
    entity: "Sharma Family Portal",
    entityType: "family",
    type: "Concurrent Sessions",
    severity: "low",
    description: "Same account logged in from 3 devices simultaneously",
    details: {
      ip: "Multiple (3 unique)",
      location: "Mumbai, Delhi, Bangalore",
      action: "Multiple active sessions",
      recordsAccessed: 8,
      context: "While family accounts may be shared, simultaneous access from 3 different cities is unusual. Could indicate credential sharing or compromise."
    },
    status: "pending"
  },
  {
    id: 5,
    timestamp: "Yesterday, 3:15 PM",
    entity: "City General Hospital",
    entityType: "hospital",
    type: "Unauthorized Export Attempt",
    severity: "high",
    description: "Attempted to export 200+ records in PDF format",
    details: {
      ip: "172.16.0.89",
      location: "Pune, India",
      action: "Bulk export attempt",
      recordsAccessed: 0,
      context: "Export was blocked by system controls. The user attempted to export records for patients not currently under their care."
    },
    status: "pending"
  },
  {
    id: 6,
    timestamp: "2 days ago",
    entity: "Metro Hospital Admin",
    entityType: "hospital",
    type: "Permission Escalation",
    severity: "medium",
    description: "User attempted to access admin-only features",
    details: {
      ip: "192.168.2.50",
      location: "Chennai, India",
      action: "Privilege escalation attempt",
      recordsAccessed: 0,
      context: "A standard hospital user attempted to access the consent management panel, which requires admin privileges."
    },
    status: "dismissed"
  },
];

export default function AnomaliesPage() {
  const [anomalies, setAnomalies] = useState(initialAnomalies);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [showFreezeModal, setShowFreezeModal] = useState<Anomaly | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const getSeverityColor = (severity: Severity) => {
    switch (severity) {
      case "critical": return "bg-crimson text-white";
      case "high": return "bg-orange-500 text-white";
      case "medium": return "bg-saffron text-obsidian";
      case "low": return "bg-sage/50 text-ivory";
    }
  };

  const getSeverityBorder = (severity: Severity) => {
    switch (severity) {
      case "critical": return "border-crimson/50";
      case "high": return "border-orange-500/50";
      case "medium": return "border-saffron/50";
      case "low": return "border-sage/50";
    }
  };

  const handleDismiss = (id: number) => {
    setAnomalies(prev => prev.map(a => a.id === id ? { ...a, status: "dismissed" } : a));
    showToast("Anomaly dismissed");
    setExpandedId(null);
  };

  const handleEscalate = (id: number) => {
    setAnomalies(prev => prev.map(a => a.id === id ? { ...a, status: "escalated" } : a));
    showToast("Anomaly escalated to security team");
    setExpandedId(null);
  };

  const handleFreeze = () => {
    if (!showFreezeModal) return;
    setAnomalies(prev => prev.map(a => a.id === showFreezeModal.id ? { ...a, status: "frozen" } : a));
    showToast(`Account frozen: ${showFreezeModal.entity}`);
    setShowFreezeModal(null);
    setExpandedId(null);
  };

  const filteredAnomalies = activeFilter === "all" 
    ? anomalies 
    : anomalies.filter(a => a.severity === activeFilter);

  const filters: { key: FilterType; label: string; color: string }[] = [
    { key: "all", label: "All", color: "bg-white/10 text-ivory" },
    { key: "low", label: "Low", color: "bg-sage/20 text-sage" },
    { key: "medium", label: "Medium", color: "bg-saffron/20 text-saffron" },
    { key: "high", label: "High", color: "bg-orange-500/20 text-orange-400" },
    { key: "critical", label: "Critical", color: "bg-crimson/20 text-crimson" },
  ];

  return (
    <div className="min-h-screen bg-[#0D0D0D] relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 opacity-30 pointer-events-none" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")" }} />
      <div className="fixed top-20 left-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-20 right-20 w-80 h-80 bg-crimson/10 rounded-full blur-3xl pointer-events-none" />

      {/* Toast */}
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

      {/* Freeze Modal */}
      <AnimatePresence>
        {showFreezeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setShowFreezeModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="frosted-panel rounded-xl p-6 max-w-md mx-4 border border-crimson/30"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-crimson/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-crimson" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-ivory font-semibold text-lg">Freeze Account</h3>
              </div>
              <p className="text-ivory/70 mb-4">
                This will immediately disable access for <span className="text-ivory font-medium">{showFreezeModal.entity}</span>. 
                The audit log will be updated and the entity will be notified.
              </p>
              <div className="p-3 rounded-lg bg-crimson/10 border border-crimson/20 mb-4">
                <p className="text-crimson text-sm">This action requires supervisor approval and will trigger an incident report.</p>
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowFreezeModal(null)}
                  className="px-4 py-2 rounded-lg text-ivory/70 hover:text-ivory transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleFreeze}
                  className="px-4 py-2 rounded-lg bg-crimson text-ivory font-medium hover:bg-crimson/80 transition-colors"
                >
                  Freeze Account
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Bar */}
      <header className="sticky top-0 z-40 frosted-glass px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-6">
          <Link href="/admin/dashboard" className="flex items-center gap-2 text-ivory/70 hover:text-ivory transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-xl font-semibold text-ivory font-space-grotesk">Anomaly Investigation</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {filters.map(filter => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeFilter === filter.key
                    ? filter.color + " ring-2 ring-white/20"
                    : "bg-white/5 text-ivory/50 hover:text-ivory hover:bg-white/10"
                }`}
              >
                {filter.label}
                {filter.key !== "all" && (
                  <span className="ml-2 text-xs opacity-70">
                    ({anomalies.filter(a => a.severity === filter.key).length})
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Anomaly Timeline */}
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-amber-500/50 via-amber-500/20 to-transparent" />

            {/* Anomaly Cards */}
            <div className="space-y-4">
              <AnimatePresence>
                {filteredAnomalies.map((anomaly, index) => (
                  <motion.div
                    key={anomaly.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className="relative pl-14"
                  >
                    {/* Timeline Dot */}
                    <div className={`absolute left-4 top-6 w-4 h-4 rounded-full border-2 ${
                      anomaly.severity === "critical" ? "bg-crimson border-crimson critical-blink" :
                      anomaly.severity === "high" ? "bg-orange-500 border-orange-500" :
                      anomaly.severity === "medium" ? "bg-saffron border-saffron" :
                      "bg-sage border-sage"
                    }`} />

                    {/* Card */}
                    <div className={`frosted-panel rounded-xl overflow-hidden border ${getSeverityBorder(anomaly.severity)} ${anomaly.status !== "pending" ? "opacity-60" : ""}`}>
                      {/* Header - Always Visible */}
                      <button
                        onClick={() => setExpandedId(expandedId === anomaly.id ? null : anomaly.id)}
                        className="w-full p-4 text-left hover:bg-white/5 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-ivory/50 text-sm">{anomaly.timestamp}</span>
                              <span className={`px-2 py-0.5 rounded text-xs font-medium ${getSeverityColor(anomaly.severity)}`}>
                                {anomaly.severity.toUpperCase()}
                              </span>
                              {anomaly.status !== "pending" && (
                                <span className={`px-2 py-0.5 rounded text-xs ${
                                  anomaly.status === "dismissed" ? "bg-white/10 text-ivory/50" :
                                  anomaly.status === "escalated" ? "bg-amber-500/20 text-amber-500" :
                                  "bg-crimson/20 text-crimson"
                                }`}>
                                  {anomaly.status.toUpperCase()}
                                </span>
                              )}
                            </div>
                            <p className="text-ivory font-medium">{anomaly.entity}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="px-2 py-0.5 rounded text-xs bg-white/10 text-ivory/70">{anomaly.type}</span>
                            </div>
                            <p className="text-ivory/70 text-sm mt-2">{anomaly.description}</p>
                          </div>
                          <svg 
                            className={`w-5 h-5 text-ivory/50 transition-transform ${expandedId === anomaly.id ? "rotate-180" : ""}`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </button>

                      {/* Expanded Details */}
                      <AnimatePresence>
                        {expandedId === anomaly.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 pb-4 border-t border-white/10 pt-4">
                              {/* Details Grid */}
                              <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                  <p className="text-ivory/50 text-xs mb-1">IP Address</p>
                                  <p className="text-ivory text-sm font-mono">{anomaly.details.ip}</p>
                                </div>
                                <div>
                                  <p className="text-ivory/50 text-xs mb-1">Location</p>
                                  <p className="text-ivory text-sm">{anomaly.details.location}</p>
                                </div>
                                <div>
                                  <p className="text-ivory/50 text-xs mb-1">Action Attempted</p>
                                  <p className="text-ivory text-sm">{anomaly.details.action}</p>
                                </div>
                                <div>
                                  <p className="text-ivory/50 text-xs mb-1">Records Accessed</p>
                                  <p className="text-ivory text-sm">{anomaly.details.recordsAccessed}</p>
                                </div>
                              </div>

                              {/* Context */}
                              <div className="p-3 rounded-lg bg-white/5 mb-4">
                                <p className="text-ivory/50 text-xs mb-1">Context</p>
                                <p className="text-ivory/80 text-sm">{anomaly.details.context}</p>
                              </div>

                              {/* Actions */}
                              {anomaly.status === "pending" && (
                                <div className="flex gap-3">
                                  <button
                                    onClick={() => handleDismiss(anomaly.id)}
                                    className="px-4 py-2 rounded-lg border border-amber-500/50 text-amber-500 text-sm font-medium hover:bg-amber-500/10 transition-colors"
                                  >
                                    Dismiss
                                  </button>
                                  <button
                                    onClick={() => handleEscalate(anomaly.id)}
                                    className="px-4 py-2 rounded-lg border border-terracotta text-terracotta text-sm font-medium hover:bg-terracotta/10 transition-colors"
                                  >
                                    Escalate
                                  </button>
                                  <button
                                    onClick={() => setShowFreezeModal(anomaly)}
                                    className="px-4 py-2 rounded-lg bg-crimson text-ivory text-sm font-medium hover:bg-crimson/80 transition-colors"
                                  >
                                    Freeze Account
                                  </button>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
