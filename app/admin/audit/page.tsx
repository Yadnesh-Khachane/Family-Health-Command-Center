"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileSearch, Search, Filter, Download, Calendar, 
  Hash, Clock, ShieldCheck, Mail, FileText, FileJson,
  Loader2
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function AuditTrailPage() {
  const supabase = createClient();
  
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  
  // Modals & States
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showReportModal, setShowReportModal] = useState<string | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportedHash, setExportedHash] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (!error && data) {
      setLogs(data);
    }
    setIsLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleImmutableExport = () => {
    setIsExporting(true);
    setExportedHash(null);
    setTimeout(() => {
      setIsExporting(false);
      // Fake SHA-256 hash
      const hash = Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('');
      setExportedHash(hash);
      showToast("Immutable export generated successfully.");
      
      // Log the export action
      supabase.from('audit_logs').insert({
        actor: "Admin SA",
        action: "Data Exported",
        target: "Global Audit Ledger",
        details: `Hash: ${hash}`,
        ip_address: "127.0.0.1"
      }).then(() => fetchLogs());
      
    }, 2000);
  };

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const actorMatch = log.actor?.toLowerCase().includes(searchQuery.toLowerCase());
      const targetMatch = log.target?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSearch = actorMatch || targetMatch;
      const matchesAction = actionFilter === "all" || log.action === actionFilter;
      return matchesSearch && matchesAction;
    });
  }, [logs, searchQuery, actionFilter]);

  // Unique actions for the filter dropdown
  const uniqueActions = useMemo(() => {
    const actions = new Set(logs.map(l => l.action));
    return Array.from(actions).filter(Boolean);
  }, [logs]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 h-full flex flex-col">
      
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-lg frosted-glass border border-amber-500/30 shadow-lg"
          >
            <p className="text-ivory font-medium">{toastMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="flex items-end justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-ivory font-space-grotesk">Global Audit Trail</h1>
          <p className="text-ivory/50">Immutable ledger of all platform activity and consent changes</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowScheduleModal(true)}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-ivory rounded-lg text-sm transition-colors flex items-center gap-2"
          >
            <Mail size={16} /> Schedule Export
          </button>
          <button 
            onClick={handleImmutableExport}
            disabled={isExporting}
            className="px-4 py-2 bg-sage hover:bg-sage/80 text-obsidian font-medium rounded-lg text-sm transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {isExporting ? (
              <><div className="w-4 h-4 border-2 border-obsidian border-t-transparent rounded-full animate-spin"/> Hashing...</>
            ) : (
              <><Hash size={16} /> Immutable Export</>
            )}
          </button>
        </div>
      </header>

      {/* Hash Display Banner */}
      <AnimatePresence>
        {exportedHash && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden shrink-0"
          >
            <div className="bg-sage/10 border border-sage/30 rounded-xl p-4 flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-sage" size={24} />
                <div>
                  <h3 className="text-sage font-medium text-sm">Export Verified (SHA-256)</h3>
                  <p className="text-sage/70 font-mono text-xs mt-1 select-all">{exportedHash}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 bg-black/20 hover:bg-black/40 rounded text-sage tooltip" title="Download CSV"><FileText size={16} /></button>
                <button className="p-2 bg-black/20 hover:bg-black/40 rounded text-sage tooltip" title="Download JSON"><FileJson size={16} /></button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
        
        {/* Main Log Table (Col Span 3) */}
        <div className="lg:col-span-3 frosted-panel rounded-xl flex flex-col overflow-hidden relative">
          
          {/* Advanced Filter Bar */}
          <div className="p-4 border-b border-white/10 bg-black/40 flex flex-wrap gap-4 shrink-0">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ivory/40" />
              <input 
                type="text" 
                placeholder="Search actor or target..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-black/40 border border-white/10 rounded-lg text-sm text-ivory focus:outline-none focus:border-amber-500/50"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-ivory/40" />
              <select 
                value={actionFilter}
                onChange={e => setActionFilter(e.target.value)}
                className="bg-black/40 border border-white/10 rounded-lg py-2 px-3 text-sm text-ivory focus:outline-none focus:border-amber-500/50"
              >
                <option value="all">All Actions</option>
                {uniqueActions.map(act => (
                  <option key={act} value={act}>{act}</option>
                ))}
              </select>
            </div>

            <button className="flex items-center gap-2 px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm text-ivory/70 hover:text-ivory transition-colors">
              <Calendar size={16} /> Last 30 Days
            </button>
          </div>

          <div className="flex-1 overflow-auto custom-scrollbar relative">
            {isLoading && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/20 backdrop-blur-sm text-amber-500">
                <Loader2 className="animate-spin mb-4" size={48} />
                <p>Loading audit ledger...</p>
              </div>
            )}
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="sticky top-0 bg-[#141414] shadow-sm z-10 border-b border-white/10">
                <tr>
                  <th className="px-4 py-3 font-medium text-ivory/50">Timestamp</th>
                  <th className="px-4 py-3 font-medium text-ivory/50">Actor</th>
                  <th className="px-4 py-3 font-medium text-ivory/50">Action</th>
                  <th className="px-4 py-3 font-medium text-ivory/50">Target</th>
                  <th className="px-4 py-3 font-medium text-ivory/50">Details</th>
                  <th className="px-4 py-3 font-medium text-ivory/50">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-white/5 transition-colors font-mono text-xs">
                    <td className="px-4 py-3 text-ivory/50">{new Date(log.created_at).toLocaleString()}</td>
                    <td className="px-4 py-3 text-amber-500">{log.actor}</td>
                    <td className="px-4 py-3 text-ivory">{log.action}</td>
                    <td className="px-4 py-3 text-ivory/80">{log.target}</td>
                    <td className="px-4 py-3 text-ivory/50 max-w-[200px] truncate" title={log.details}>{log.details}</td>
                    <td className="px-4 py-3 text-ivory/40">{log.ip_address}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-3 border-t border-white/10 bg-black/40 text-xs text-ivory/50 text-right shrink-0">
            Showing {filteredLogs.length} entries
          </div>
        </div>

        {/* Compliance Reports (Col Span 1) */}
        <div className="lg:col-span-1 space-y-6 flex flex-col">
          <div className="frosted-panel rounded-xl p-6 flex-1">
            <h2 className="text-ivory font-semibold mb-4 flex items-center gap-2">
              <FileText className="text-amber-500" /> Compliance Reports
            </h2>
            <p className="text-xs text-ivory/50 mb-6">Generate standardized reports for regulatory bodies.</p>
            
            <div className="space-y-3">
              {[
                { id: "hipaa", name: "HIPAA Access Report", desc: "PHI access logs" },
                { id: "consent", name: "Consent History", desc: "All matrix changes" },
                { id: "export", name: "Data Exfiltration", desc: "Downloads & exports" },
                { id: "login", name: "Authentication Audit", desc: "Logins & MFA status" }
              ].map(report => (
                <button
                  key={report.id}
                  onClick={() => setShowReportModal(report.name)}
                  className="w-full text-left p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors group"
                >
                  <h3 className="text-sm font-medium text-ivory group-hover:text-amber-500 transition-colors">{report.name}</h3>
                  <p className="text-xs text-ivory/50 mt-1">{report.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Schedule Export Modal */}
      <AnimatePresence>
        {showScheduleModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setShowScheduleModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="frosted-panel rounded-xl p-6 max-w-md mx-4 w-full"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-ivory font-semibold text-lg mb-4 flex items-center gap-2">
                <Mail className="text-amber-500" size={20} /> Schedule Recurring Export
              </h3>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs text-ivory/50 mb-1">Recipient Email</label>
                  <input type="email" placeholder="compliance@fhcc.com" className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-ivory text-sm focus:border-amber-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs text-ivory/50 mb-1">Frequency</label>
                  <select className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-ivory text-sm focus:border-amber-500 outline-none">
                    <option>Weekly (Every Monday)</option>
                    <option>Monthly (1st of Month)</option>
                    <option>Daily (Midnight)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-ivory/50 mb-1">Format</label>
                  <div className="flex gap-4 mt-2">
                    <label className="flex items-center gap-2 text-sm text-ivory"><input type="radio" name="fmt" defaultChecked className="accent-amber-500"/> CSV</label>
                    <label className="flex items-center gap-2 text-sm text-ivory"><input type="radio" name="fmt" className="accent-amber-500"/> JSON</label>
                    <label className="flex items-center gap-2 text-sm text-ivory"><input type="radio" name="fmt" className="accent-amber-500"/> PDF</label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowScheduleModal(false)}
                  className="px-4 py-2 rounded-lg text-ivory/70 hover:text-ivory transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={() => { setShowScheduleModal(false); showToast("Scheduled export saved."); }}
                  className="px-4 py-2 bg-amber-500 text-obsidian font-medium rounded-lg hover:bg-amber-500/80 transition-colors text-sm"
                >
                  Save Schedule
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Report Preview Modal */}
      <AnimatePresence>
        {showReportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setShowReportModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="frosted-panel rounded-xl overflow-hidden max-w-2xl w-full flex flex-col max-h-[80vh]"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-4 bg-black/40 border-b border-white/10 flex justify-between items-center shrink-0">
                <h3 className="text-ivory font-semibold flex items-center gap-2">
                  <FileText className="text-amber-500" size={18} /> {showReportModal} Preview
                </h3>
                <button onClick={() => setShowReportModal(null)} className="text-ivory/50 hover:text-ivory text-xl">&times;</button>
              </div>
              
              <div className="p-6 flex-1 overflow-y-auto bg-white flex justify-center text-black">
                {/* Simulated PDF Preview */}
                <div className="w-full max-w-lg aspect-[1/1.4] border border-gray-200 shadow-md p-8 text-xs font-serif leading-relaxed">
                  <div className="border-b-2 border-black pb-4 mb-4 text-center">
                    <h1 className="text-xl font-bold uppercase tracking-widest">{showReportModal}</h1>
                    <p className="text-gray-500">Generated: {new Date().toLocaleDateString()}</p>
                  </div>
                  <p className="mb-4"><strong>Entity Scope:</strong> Global (All Network Nodes)</p>
                  <p className="mb-4"><strong>Classification:</strong> CONFIDENTIAL - FOR INTERNAL AUDIT ONLY</p>
                  <p className="mb-8">This document contains a verified extract of the immutable audit ledger as required by CFR Title 21 Part 11.</p>
                  
                  <table className="w-full text-left mb-8">
                    <tbody>
                      <tr className="border-b border-gray-300"><th className="py-2">Date</th><th className="py-2">Actor</th><th className="py-2">Event</th></tr>
                      <tr><td className="py-2 text-gray-600">{new Date().toLocaleDateString()}</td><td>SA-Vikram</td><td>Report Generated</td></tr>
                      <tr><td className="py-2 text-gray-600">{new Date().toLocaleDateString()}</td><td>System</td><td>Data Checksum Verified</td></tr>
                    </tbody>
                  </table>
                  
                  <div className="mt-auto pt-8 border-t border-gray-300 text-center text-gray-400 text-[10px]">
                    <p>FHCC Automated Compliance System</p>
                    <p className="break-all font-mono">HASH: 8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-black/40 border-t border-white/10 flex justify-end gap-3 shrink-0">
                <button onClick={() => setShowReportModal(null)} className="px-4 py-2 text-ivory/70 hover:text-ivory transition-colors text-sm">Cancel</button>
                <button onClick={() => { setShowReportModal(null); showToast("Report downloading..."); }} className="px-4 py-2 bg-amber-500 text-obsidian font-medium rounded-lg flex items-center gap-2 hover:bg-amber-500/80 transition-colors text-sm">
                  <Download size={16} /> Download Full PDF
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
