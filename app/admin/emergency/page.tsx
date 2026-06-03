"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface Emergency {
  id: number;
  name: string;
  scope: string;
  declared: string;
  ended: string;
  duration: string;
  affectedEntities: number;
  accessesGranted: number;
}

const emergencyHistory: Emergency[] = [
  {
    id: 1,
    name: "Flood Response - East District",
    scope: "East District (3 hospitals, 156 families)",
    declared: "Nov 15, 2026, 8:00 AM",
    ended: "Nov 18, 2026, 6:00 PM",
    duration: "3 days, 10 hours",
    affectedEntities: 159,
    accessesGranted: 1247
  },
  {
    id: 2,
    name: "Hospital System Outage",
    scope: "Apollo Medical Center",
    declared: "Oct 3, 2026, 2:30 PM",
    ended: "Oct 3, 2026, 8:45 PM",
    duration: "6 hours, 15 minutes",
    affectedEntities: 1,
    accessesGranted: 89
  },
  {
    id: 3,
    name: "Mass Casualty Event - Industrial Accident",
    scope: "West Industrial Zone (2 hospitals)",
    declared: "Aug 22, 2026, 11:00 AM",
    ended: "Aug 23, 2026, 4:00 PM",
    duration: "1 day, 5 hours",
    affectedEntities: 2,
    accessesGranted: 234
  },
];

const scopeOptions = [
  { value: "all", label: "All Entities (System-wide)" },
  { value: "east", label: "East District (3 hospitals, 156 families)" },
  { value: "west", label: "West District (2 hospitals, 98 families)" },
  { value: "central", label: "Central District (4 hospitals, 203 families)" },
  { value: "apollo", label: "Apollo Medical Center only" },
  { value: "city-general", label: "City General Hospital only" },
  { value: "metro", label: "Metro Hospital only" },
];

export default function EmergencyPage() {
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  const [activeEmergency, setActiveEmergency] = useState<{
    name: string;
    scope: string;
    declared: Date;
    affectedEntities: number;
  } | null>(null);
  const [showDeclareModal, setShowDeclareModal] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const [emergencyName, setEmergencyName] = useState("");
  const [selectedScope, setSelectedScope] = useState("east");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const declareEmergency = () => {
    if (!emergencyName.trim()) return;
    
    const scope = scopeOptions.find(s => s.value === selectedScope);
    const affectedCount = selectedScope === "all" ? 376 : 
                          selectedScope.includes("District") ? parseInt(selectedScope.match(/\d+/)?.[0] || "0") : 1;
    
    setActiveEmergency({
      name: emergencyName,
      scope: scope?.label || "",
      declared: new Date(),
      affectedEntities: affectedCount
    });
    setIsEmergencyActive(true);
    setShowDeclareModal(false);
    setEmergencyName("");
    showToast("Emergency declared - consent gates relaxed");
  };

  const endEmergency = () => {
    setIsEmergencyActive(false);
    setActiveEmergency(null);
    setShowEndModal(false);
    showToast("Emergency ended - normal consent restored");
  };

  const getTimeSinceDeclared = () => {
    if (!activeEmergency) return "";
    const diff = Date.now() - activeEmergency.declared.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 opacity-30 pointer-events-none" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")" }} />
      <div className="fixed top-20 left-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className={`fixed bottom-20 right-20 w-80 h-80 rounded-full blur-3xl pointer-events-none transition-colors duration-500 ${isEmergencyActive ? "bg-crimson/20" : "bg-terracotta/10"}`} />

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

      {/* Declare Emergency Modal */}
      <AnimatePresence>
        {showDeclareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setShowDeclareModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="frosted-panel rounded-xl p-6 w-full max-w-md mx-4 border border-crimson/30"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-crimson/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-crimson" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-ivory font-semibold text-lg">Declare Emergency</h3>
              </div>

              <div className="space-y-4 mb-4">
                <div>
                  <label className="text-ivory/70 text-sm block mb-1">Emergency Name</label>
                  <input
                    type="text"
                    value={emergencyName}
                    onChange={e => setEmergencyName(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-ivory placeholder:text-ivory/30 focus:outline-none focus:border-crimson/50 transition-colors"
                    placeholder="e.g., Flood Response - East District"
                  />
                </div>
                <div>
                  <label className="text-ivory/70 text-sm block mb-1">Scope</label>
                  <select
                    value={selectedScope}
                    onChange={e => setSelectedScope(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-ivory focus:outline-none focus:border-crimson/50 transition-colors"
                  >
                    {scopeOptions.map(opt => (
                      <option key={opt.value} value={opt.value} className="bg-charcoal">{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-crimson/10 border border-crimson/20 mb-4">
                <p className="text-crimson text-sm">
                  This will temporarily relax consent gates for emergency access. All activity will be logged and audited.
                </p>
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowDeclareModal(false)}
                  className="px-4 py-2 rounded-lg text-ivory/70 hover:text-ivory transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={declareEmergency}
                  disabled={!emergencyName.trim()}
                  className="px-4 py-2 rounded-lg bg-crimson text-ivory font-medium hover:bg-crimson/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirm &amp; Declare
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* End Emergency Modal */}
      <AnimatePresence>
        {showEndModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setShowEndModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="frosted-panel rounded-xl p-6 w-full max-w-md mx-4"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-ivory font-semibold text-lg mb-4">End Emergency Protocol</h3>
              
              <div className="p-4 rounded-lg bg-white/5 mb-4">
                <p className="text-ivory/50 text-xs mb-1">Emergency Summary</p>
                <p className="text-ivory font-medium">{activeEmergency?.name}</p>
                <p className="text-ivory/70 text-sm mt-1">Duration: {getTimeSinceDeclared()}</p>
                <p className="text-ivory/70 text-sm">Affected Entities: {activeEmergency?.affectedEntities}</p>
              </div>

              <p className="text-ivory/70 mb-4">
                This will restore normal consent gates and generate an audit report of all emergency accesses.
              </p>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowEndModal(false)}
                  className="px-4 py-2 rounded-lg text-ivory/70 hover:text-ivory transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={endEmergency}
                  className="px-4 py-2 rounded-lg bg-sage text-ivory font-medium hover:bg-sage/80 transition-colors"
                >
                  End Emergency
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
          <h1 className="text-xl font-semibold text-ivory font-space-grotesk">Emergency Protocol</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Current Status Card */}
          <div className={`frosted-panel rounded-xl p-8 text-center border ${isEmergencyActive ? "border-crimson/50" : "border-white/10"}`}>
            {isEmergencyActive && activeEmergency ? (
              <>
                {/* Active Emergency State */}
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className="mb-6"
                >
                  <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-crimson/20 border border-crimson/50 mb-4">
                    <div className="w-3 h-3 rounded-full bg-crimson critical-blink" />
                    <span className="text-crimson font-bold text-lg">EMERGENCY ACTIVE</span>
                  </div>
                </motion.div>

                <h2 className="text-2xl font-bold text-ivory font-space-grotesk mb-2">{activeEmergency.name}</h2>
                <p className="text-ivory/70 mb-6">{activeEmergency.scope}</p>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="p-4 rounded-lg bg-white/5">
                    <p className="text-ivory/50 text-sm">Time Active</p>
                    <p className="text-amber-500 text-2xl font-bold font-space-grotesk">{getTimeSinceDeclared()}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-white/5">
                    <p className="text-ivory/50 text-sm">Affected Entities</p>
                    <p className="text-amber-500 text-2xl font-bold font-space-grotesk">{activeEmergency.affectedEntities}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-white/5">
                    <p className="text-ivory/50 text-sm">Consent Gates</p>
                    <p className="text-crimson text-lg font-bold">RELAXED</p>
                  </div>
                </div>

                <button
                  onClick={() => setShowEndModal(true)}
                  className="px-8 py-3 rounded-lg bg-sage text-ivory font-semibold hover:bg-sage/80 transition-colors"
                >
                  End Emergency
                </button>
              </>
            ) : (
              <>
                {/* No Emergency State */}
                <div className="w-20 h-20 rounded-full bg-sage/20 flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>

                <h2 className="text-2xl font-bold text-sage font-space-grotesk mb-2">No Active Emergency</h2>
                <p className="text-ivory/70 mb-6">All consent gates are operating normally.</p>

                <button
                  onClick={() => setShowDeclareModal(true)}
                  className="px-8 py-4 rounded-lg bg-crimson text-ivory font-semibold text-lg hover:bg-crimson/80 transition-colors warm-glow"
                >
                  Declare Emergency
                </button>
              </>
            )}
          </div>

          {/* Emergency History */}
          <div className="frosted-panel rounded-xl p-6">
            <h2 className="text-ivory font-semibold text-lg mb-4">Emergency History</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left text-ivory/50 text-sm font-normal pb-3">Emergency</th>
                    <th className="text-left text-ivory/50 text-sm font-normal pb-3">Scope</th>
                    <th className="text-left text-ivory/50 text-sm font-normal pb-3">Duration</th>
                    <th className="text-left text-ivory/50 text-sm font-normal pb-3">Accesses</th>
                  </tr>
                </thead>
                <tbody>
                  {emergencyHistory.map(emergency => (
                    <tr key={emergency.id} className="border-b border-white/5">
                      <td className="py-4">
                        <p className="text-ivory font-medium">{emergency.name}</p>
                        <p className="text-ivory/50 text-xs">{emergency.declared}</p>
                      </td>
                      <td className="py-4 text-ivory/70 text-sm">{emergency.scope}</td>
                      <td className="py-4 text-ivory/70 text-sm">{emergency.duration}</td>
                      <td className="py-4">
                        <span className="px-2 py-1 rounded text-xs bg-amber-500/20 text-amber-500">
                          {emergency.accessesGranted} grants
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
