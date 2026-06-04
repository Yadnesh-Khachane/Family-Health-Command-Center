"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Siren, ShieldAlert, AlertTriangle, CheckCircle2, 
  Activity, Calendar, FileText, XCircle, Unlock,
  Lock, RotateCcw
} from "lucide-react";

type EmergencyState = "standby" | "active" | "de-escalating";

const mockHistory = [
  { id: 1, type: "Real Emergency", reason: "City-wide power grid failure", duration: "4h 12m", date: "Oct 12, 2023", initiator: "SA - Vikram" },
  { id: 2, type: "Drill", reason: "Q3 Compliance Drill - Consent Bypass", duration: "1h 00m", date: "Sep 01, 2023", initiator: "SA - Suresh" },
  { id: 3, type: "Drill", reason: "Regional Network Outage Sim", duration: "2h 30m", date: "May 15, 2023", initiator: "SA - Meera" },
];

export default function EmergencyProtocolPage() {
  const [state, setState] = useState<EmergencyState>("standby");
  const [reason, setReason] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Drill Scheduler State
  const [showDrillModal, setShowDrillModal] = useState(false);
  
  // De-escalation Checklist
  const [checklist, setChecklist] = useState([
    { id: 1, text: "Verify primary systems are stable", checked: false },
    { id: 2, text: "Confirm with regional directors", checked: false },
    { id: 3, text: "Prepare post-incident report draft", checked: false },
    { id: 4, text: "Re-enable strict consent gates", checked: false },
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleActivate = () => {
    setState("active");
    setShowConfirm(false);
    showToast("CRITICAL: Emergency Protocol Activated");
  };

  const startDeescalation = () => {
    setState("de-escalating");
  };

  const completeDeescalation = () => {
    if (checklist.some(c => !c.checked)) {
      showToast("Please complete the de-escalation checklist first.");
      return;
    }
    setState("standby");
    setReason("");
    setChecklist(c => c.map(item => ({ ...item, checked: false })));
    showToast("Emergency Protocol Ended. Systems normalized.");
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-lg border shadow-lg backdrop-blur-md ${
              state === 'active' ? 'bg-crimson/90 border-crimson text-white' : 'bg-obsidian/90 border-amber-500/30 text-ivory'
            }`}
          >
            <p className="font-medium">{toastMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-ivory font-space-grotesk flex items-center gap-3">
            <Siren className={state === 'active' ? 'text-crimson animate-pulse' : 'text-ivory/50'} /> 
            Emergency Protocol (Break-Glass)
          </h1>
          <p className="text-ivory/50 mt-1">Override standard consent gates in mass casualty or regional crisis events.</p>
        </div>
      </header>

      {/* Live Emergency Monitor Banner */}
      <AnimatePresence>
        {state === 'active' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-crimson/20 border-2 border-crimson rounded-xl p-4 flex items-center justify-between mb-6 shadow-[0_0_30px_rgba(192,57,43,0.3)]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-crimson rounded-full flex items-center justify-center animate-pulse shrink-0">
                  <AlertTriangle className="text-white" size={24} />
                </div>
                <div>
                  <h2 className="text-crimson font-bold text-lg uppercase tracking-wider">Protocol Active</h2>
                  <p className="text-crimson/80 text-sm font-mono">Consent gates bypassed. Global read access granted to all authenticated medical personnel.</p>
                </div>
              </div>
              <div className="text-right flex flex-col items-end">
                <span className="text-crimson font-mono text-sm">T+ 00:14:23</span>
                <span className="text-crimson/60 text-xs">Reason: {reason}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Col: Activation / De-escalation */}
        <div className="space-y-6">
          <div className={`frosted-panel rounded-xl p-8 border-2 transition-colors ${state === 'active' ? 'border-crimson/50' : 'border-white/5'}`}>
            
            {state === "standby" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                    <ShieldAlert size={32} className="text-ivory/30" />
                  </div>
                  <h2 className="text-xl font-medium text-ivory">System Standby</h2>
                  <p className="text-ivory/50 mt-2 text-sm max-w-sm mx-auto">Activating this protocol removes all patient consent requirements globally. All actions will be strictly audited.</p>
                </div>
                
                <div className="space-y-4">
                  <label className="block text-sm text-ivory/70">Reason for activation (required)</label>
                  <textarea 
                    value={reason}
                    onChange={e => setReason(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-ivory focus:border-crimson focus:outline-none min-h-[100px]"
                    placeholder="E.g., Earthquake in Zone A, mass casualties at Metro Hospital..."
                  />
                  
                  <button 
                    onClick={() => setShowConfirm(true)}
                    disabled={!reason.trim()}
                    className="w-full py-4 rounded-lg bg-crimson/20 border border-crimson text-crimson font-bold uppercase tracking-wider hover:bg-crimson hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Initiate Break-Glass Protocol
                  </button>
                </div>
              </motion.div>
            )}

            {state === "active" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
                <Unlock size={48} className="text-crimson mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-crimson mb-2">Systems Unlocked</h2>
                <p className="text-ivory/70 mb-8 max-w-md mx-auto">All medical staff currently have unimpeded access to patient records. Do not end the protocol until the crisis is resolved.</p>
                
                <button 
                  onClick={startDeescalation}
                  className="px-8 py-3 rounded-lg bg-sage text-obsidian font-bold uppercase tracking-wider hover:bg-sage/80 transition-all shadow-[0_0_20px_rgba(125,155,118,0.4)]"
                >
                  Begin De-escalation
                </button>
              </motion.div>
            )}

            {state === "de-escalating" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="text-xl font-medium text-sage flex items-center gap-2 mb-6">
                  <RotateCcw size={20} /> De-escalation Checklist
                </h2>
                <p className="text-ivory/70 text-sm mb-6">Complete the following steps before system normalization can occur.</p>
                
                <div className="space-y-3 mb-8">
                  {checklist.map((item) => (
                    <label key={item.id} className="flex items-start gap-3 p-3 bg-white/5 border border-white/10 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                      <input 
                        type="checkbox" 
                        checked={item.checked}
                        onChange={() => setChecklist(c => c.map(x => x.id === item.id ? { ...x, checked: !x.checked } : x))}
                        className="mt-1 rounded border-white/20 bg-black/40 text-sage focus:ring-sage/50 w-4 h-4"
                      />
                      <span className={`text-sm ${item.checked ? 'text-ivory/50 line-through' : 'text-ivory'}`}>{item.text}</span>
                    </label>
                  ))}
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => setState("active")}
                    className="px-6 py-3 rounded-lg border border-white/20 text-ivory hover:bg-white/10 transition-all flex-1"
                  >
                    Abort (Return to Active)
                  </button>
                  <button 
                    onClick={completeDeescalation}
                    className={`px-6 py-3 rounded-lg font-bold uppercase tracking-wider transition-all flex-1 ${
                      checklist.every(c => c.checked) ? 'bg-sage text-obsidian hover:bg-sage/80' : 'bg-white/10 text-ivory/30 cursor-not-allowed'
                    }`}
                  >
                    Normalize Systems
                  </button>
                </div>
              </motion.div>
            )}

          </div>

          {/* Drill Scheduler Trigger */}
          <div className="frosted-panel rounded-xl p-6 flex items-center justify-between">
            <div>
              <h3 className="text-ivory font-medium">Compliance Drills</h3>
              <p className="text-ivory/50 text-sm mt-1">Schedule simulated emergencies for training.</p>
            </div>
            <button 
              onClick={() => setShowDrillModal(true)}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-500/80 text-obsidian font-semibold rounded-lg flex items-center gap-2 text-sm transition-colors"
            >
              <Calendar size={16} /> Schedule Drill
            </button>
          </div>
        </div>

        {/* Right Col: History & Drill Reports */}
        <div className="space-y-6">
          <div className="frosted-panel rounded-xl p-6">
            <h2 className="text-ivory font-semibold mb-4 flex items-center gap-2">
              <Activity className="text-amber-500" /> Protocol History
            </h2>
            <div className="space-y-3">
              {mockHistory.map(h => (
                <div key={h.id} className="p-4 bg-white/5 border border-white/10 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded ${h.type === 'Real Emergency' ? 'bg-crimson/20 text-crimson' : 'bg-amber-500/20 text-amber-500'}`}>
                      {h.type}
                    </span>
                    <span className="text-ivory/40 text-xs">{h.date}</span>
                  </div>
                  <p className="text-ivory font-medium mb-1 text-sm">{h.reason}</p>
                  <div className="flex items-center gap-4 text-xs text-ivory/50">
                    <span>Duration: {h.duration}</span>
                    <span>By: {h.initiator}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="frosted-panel rounded-xl p-6 border border-sage/20 bg-sage/5">
            <h2 className="text-sage font-semibold mb-4 flex items-center gap-2">
              <FileText size={18} /> Latest Post-Drill Report
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-ivory/70 text-sm font-medium mb-1">Q3 Compliance Drill - Consent Bypass</p>
                <p className="text-ivory/40 text-xs mb-3">Executed on Sep 01, 2023</p>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between p-2 bg-black/40 rounded border border-white/5">
                  <span className="text-ivory/80">Audit Log Generation</span>
                  <CheckCircle2 size={16} className="text-sage" />
                </div>
                <div className="flex items-center justify-between p-2 bg-black/40 rounded border border-white/5">
                  <span className="text-ivory/80">Consent Overrides Applied</span>
                  <CheckCircle2 size={16} className="text-sage" />
                </div>
                <div className="flex items-center justify-between p-2 bg-black/40 rounded border border-white/5">
                  <span className="text-ivory/80">External Notifications Sent</span>
                  <XCircle size={16} className="text-crimson" />
                </div>
              </div>
              <p className="text-xs text-crimson mt-2">Note: SMS Gateway failed during notification phase. Issue ticket #9021 logged.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-[#1A0A0A] border-2 border-crimson rounded-xl p-8 max-w-md mx-4 w-full text-center"
            >
              <AlertTriangle size={64} className="text-crimson mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">ARE YOU ABSOLUTELY SURE?</h2>
              <p className="text-crimson/80 mb-6 text-sm leading-relaxed">
                You are about to override global privacy settings. Every medical professional in the network will have unimpeded access to all patient records.
              </p>
              
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleActivate}
                  className="w-full py-3 rounded-lg bg-crimson text-white font-bold uppercase tracking-wider hover:bg-red-600 transition-colors"
                >
                  Yes, Activate Protocol
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="w-full py-3 rounded-lg border border-white/20 text-ivory/70 hover:text-ivory hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Drill Scheduler Modal */}
      <AnimatePresence>
        {showDrillModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setShowDrillModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="frosted-panel rounded-xl p-6 max-w-md mx-4 w-full"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-ivory font-semibold text-lg mb-4 flex items-center gap-2">
                <Calendar className="text-amber-500" size={20} /> Schedule Drill
              </h3>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs text-ivory/50 mb-1">Drill Date & Time</label>
                  <input type="datetime-local" className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-ivory text-sm focus:border-amber-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs text-ivory/50 mb-1">Drill Type</label>
                  <select className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-ivory text-sm focus:border-amber-500 outline-none">
                    <option>Consent Bypass Test</option>
                    <option>Network Outage Simulation</option>
                    <option>Ransomware Lockdown Sim</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-ivory/50 mb-1">Scope</label>
                  <select className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-ivory text-sm focus:border-amber-500 outline-none">
                    <option>Global (All Hospitals)</option>
                    <option>Zone A (North Region)</option>
                    <option>Single Hospital (Select...)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDrillModal(false)}
                  className="px-4 py-2 rounded-lg text-ivory/70 hover:text-ivory transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={() => { setShowDrillModal(false); showToast("Drill scheduled successfully."); }}
                  className="px-4 py-2 bg-amber-500 text-obsidian font-medium rounded-lg hover:bg-amber-500/80 transition-colors text-sm"
                >
                  Confirm Schedule
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
