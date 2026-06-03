"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

// Mock data
const familyMembers = [
  { id: 1, name: "Gayatri Sharma", age: 72 },
  { id: 2, name: "Ravi Sharma", age: 48 },
  { id: 3, name: "Priya Sharma", age: 45 },
  { id: 4, name: "Aarav Sharma", age: 16 },
];

const hospitals = [
  { id: 1, name: "Apollo Medical Center" },
  { id: 2, name: "City General Hospital" },
];

type AccessLevel = "none" | "readonly" | "full";

const initialMatrix: Record<string, AccessLevel> = {
  "1-1": "full",    // Gayatri - Apollo
  "1-2": "readonly", // Gayatri - City General
  "2-1": "full",    // Ravi - Apollo
  "2-2": "none",    // Ravi - City General
  "3-1": "readonly", // Priya - Apollo
  "3-2": "full",    // Priya - City General
  "4-1": "none",    // Aarav - Apollo
  "4-2": "none",    // Aarav - City General
};

const pendingRequests = [
  { id: 1, hospital: "Apollo Medical Center", family: "Sharma Family", member: "Gayatri", type: "Full Access Request", reason: "Upcoming surgery consultation", time: "2h ago" },
  { id: 2, hospital: "City General Hospital", family: "Sharma Family", member: "Ravi", type: "Read-Only Request", reason: "Second opinion on lab results", time: "5h ago" },
  { id: 3, hospital: "Metro Hospital", family: "Gupta Family", member: "Rajesh", type: "Emergency Access", reason: "Emergency room admission", time: "8h ago" },
  { id: 4, hospital: "Apollo Medical Center", family: "Patel Family", member: "Anita", type: "Full Access Request", reason: "Specialist referral", time: "1d ago" },
];

interface AuditEntry {
  id: number;
  action: string;
  member: string;
  hospital: string;
  level: string;
  time: string;
}

export default function ConsentPage() {
  const [matrix, setMatrix] = useState(initialMatrix);
  const [auditLog, setAuditLog] = useState<AuditEntry[]>([
    { id: 1, action: "granted", member: "Gayatri Sharma", hospital: "Apollo", level: "Full Access", time: "Just now" },
    { id: 2, action: "revoked", member: "Aarav Sharma", hospital: "City General", level: "Read-Only", time: "2 min ago" },
    { id: 3, action: "modified", member: "Priya Sharma", hospital: "Apollo", level: "Read-Only", time: "15 min ago" },
  ]);
  const [requestStatuses, setRequestStatuses] = useState<Record<number, "approved" | "denied" | null>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const cycleAccessLevel = (memberId: number, hospitalId: number) => {
    const key = `${memberId}-${hospitalId}`;
    const currentLevel = matrix[key];
    const member = familyMembers.find(m => m.id === memberId);
    const hospital = hospitals.find(h => h.id === hospitalId);
    
    let newLevel: AccessLevel;
    let levelLabel: string;
    let action: string;
    
    switch (currentLevel) {
      case "none":
        newLevel = "readonly";
        levelLabel = "Read-Only";
        action = "granted";
        break;
      case "readonly":
        newLevel = "full";
        levelLabel = "Full Access";
        action = "upgraded";
        break;
      case "full":
        newLevel = "none";
        levelLabel = "No Access";
        action = "revoked";
        break;
      default:
        newLevel = "none";
        levelLabel = "No Access";
        action = "revoked";
    }
    
    setMatrix(prev => ({ ...prev, [key]: newLevel }));
    
    // Add to audit log
    const newEntry: AuditEntry = {
      id: Date.now(),
      action,
      member: member?.name || "",
      hospital: hospital?.name || "",
      level: levelLabel,
      time: "Just now",
    };
    setAuditLog(prev => [newEntry, ...prev.slice(0, 9)]);
    showToast(`Consent updated for ${member?.name}`);
  };

  const handleApprove = (id: number) => {
    setRequestStatuses(prev => ({ ...prev, [id]: "approved" }));
    showToast("Request approved");
  };

  const handleDeny = (id: number) => {
    setRequestStatuses(prev => ({ ...prev, [id]: "denied" }));
    showToast("Request denied");
  };

  const getAccessColor = (level: AccessLevel) => {
    switch (level) {
      case "full": return "bg-amber-500";
      case "readonly": return "bg-transparent border-2 border-amber-500";
      case "none": return "bg-white/5 border border-white/10";
    }
  };

  const getAccessLabel = (level: AccessLevel) => {
    switch (level) {
      case "full": return "Full";
      case "readonly": return "Read";
      case "none": return "None";
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 opacity-30 pointer-events-none" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")" }} />
      <div className="fixed top-20 left-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-20 right-20 w-80 h-80 bg-terracotta/10 rounded-full blur-3xl pointer-events-none" />

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

      {/* Top Bar */}
      <header className="sticky top-0 z-40 frosted-glass px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-6">
          <Link href="/admin/dashboard" className="flex items-center gap-2 text-ivory/70 hover:text-ivory transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-xl font-semibold text-ivory font-space-grotesk">Consent Governance</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Left: Consent Matrix */}
          <div className="lg:col-span-2">
            <div className="frosted-panel rounded-xl p-6 mb-8">
              <h2 className="text-ivory font-semibold text-lg mb-6">Visual Consent Matrix</h2>
              
              {/* Matrix Header */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left text-ivory/50 text-sm font-normal pb-4 pr-4 min-w-[160px]">Family Member</th>
                      {hospitals.map(hospital => (
                        <th key={hospital.id} className="text-center text-ivory/50 text-sm font-normal pb-4 px-2 min-w-[140px]">
                          {hospital.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {familyMembers.map(member => (
                      <tr key={member.id}>
                        <td className="py-3 pr-4">
                          <div>
                            <p className="text-ivory font-medium">{member.name}</p>
                            <p className="text-ivory/50 text-sm">Age {member.age}</p>
                          </div>
                        </td>
                        {hospitals.map(hospital => {
                          const key = `${member.id}-${hospital.id}`;
                          const level = matrix[key];
                          return (
                            <td key={hospital.id} className="py-3 px-2">
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => cycleAccessLevel(member.id, hospital.id)}
                                className={`w-full h-16 rounded-lg flex items-center justify-center transition-all ${getAccessColor(level)}`}
                              >
                                <span className={`text-sm font-medium ${level === "full" ? "text-obsidian" : level === "readonly" ? "text-amber-500" : "text-ivory/30"}`}>
                                  {getAccessLabel(level)}
                                </span>
                              </motion.button>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-6 mt-6 pt-4 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-amber-500"></div>
                  <span className="text-ivory/50 text-sm">Full Access</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded border-2 border-amber-500"></div>
                  <span className="text-ivory/50 text-sm">Read-Only</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-white/5 border border-white/10"></div>
                  <span className="text-ivory/50 text-sm">No Access</span>
                </div>
              </div>
            </div>

            {/* Pending Requests */}
            <div className="frosted-panel rounded-xl p-6">
              <h2 className="text-ivory font-semibold text-lg mb-4">Pending Access Requests</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left text-ivory/50 text-sm font-normal pb-3">Hospital</th>
                      <th className="text-left text-ivory/50 text-sm font-normal pb-3">Patient</th>
                      <th className="text-left text-ivory/50 text-sm font-normal pb-3">Type</th>
                      <th className="text-left text-ivory/50 text-sm font-normal pb-3">Reason</th>
                      <th className="text-left text-ivory/50 text-sm font-normal pb-3">Time</th>
                      <th className="text-right text-ivory/50 text-sm font-normal pb-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingRequests.map(req => (
                      <tr key={req.id} className="border-b border-white/5">
                        <td className="py-4 text-ivory text-sm">{req.hospital}</td>
                        <td className="py-4 text-ivory text-sm">{req.member} ({req.family})</td>
                        <td className="py-4">
                          <span className={`px-2 py-1 rounded text-xs ${req.type.includes("Emergency") ? "bg-crimson/20 text-crimson" : req.type.includes("Full") ? "bg-amber-500/20 text-amber-500" : "bg-white/10 text-ivory/70"}`}>
                            {req.type}
                          </span>
                        </td>
                        <td className="py-4 text-ivory/70 text-sm max-w-[200px] truncate">{req.reason}</td>
                        <td className="py-4 text-ivory/50 text-sm">{req.time}</td>
                        <td className="py-4 text-right">
                          {requestStatuses[req.id] === "approved" ? (
                            <span className="text-sage text-sm">Approved</span>
                          ) : requestStatuses[req.id] === "denied" ? (
                            <span className="text-crimson text-sm">Denied</span>
                          ) : (
                            <div className="flex gap-2 justify-end">
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
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right: Audit Log */}
          <div className="lg:col-span-1">
            <div className="frosted-panel rounded-xl p-6 sticky top-24">
              <h2 className="text-ivory font-semibold text-lg mb-4">Recent Consent Changes</h2>
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                <AnimatePresence>
                  {auditLog.map(entry => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="p-3 rounded-lg bg-white/5 border border-white/10"
                    >
                      <p className="text-ivory text-sm">
                        <span className="text-amber-500 font-medium">Admin SA</span>
                        {" "}{entry.action}{" "}
                        <span className="text-ivory/70">{entry.hospital}</span>
                        {" "}{entry.level} to{" "}
                        <span className="text-ivory/70">{entry.member}</span>
                      </p>
                      <p className="text-ivory/40 text-xs mt-1">{entry.time}</p>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
