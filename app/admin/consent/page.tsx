"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, AlertTriangle, FileCheck2, Clock, Check, 
  X, History, Server, Eye, Edit3, Trash2, LayoutTemplate,
  Loader2
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";

type AccessLevel = "none" | "readonly" | "full" | "emergency";

export default function ConsentPage() {
  const supabase = createClient();
  
  const [families, setFamilies] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [consentLinks, setConsentLinks] = useState<any[]>([]);
  const [auditLog, setAuditLog] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Pending Requests (Mock for now, as schema doesn't have a requests table yet)
  const [requests, setRequests] = useState([
    { id: 1, hospital: "Apollo Medical Center", member: "Gayatri (Sharma)", type: "Full Access", reason: "Upcoming surgery", time: "2h ago" }
  ]);
  const [selectedRequests, setSelectedRequests] = useState<Set<number>>(new Set());
  
  // Modals
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showOverride, setShowOverride] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    const [famRes, memRes, hospRes, linkRes, auditRes] = await Promise.all([
      supabase.from('families').select('*'),
      supabase.from('members').select('*'),
      supabase.from('hospitals').select('*').order('name'),
      supabase.from('consent_links').select('*'),
      supabase.from('audit_logs')
        .select('*')
        .or('action.eq.Consent Granted,action.eq.Consent Revoked,action.eq.Consent Updated')
        .order('created_at', { ascending: false })
        .limit(20)
    ]);
    
    if (famRes.data) setFamilies(famRes.data);
    if (memRes.data) setMembers(memRes.data);
    if (hospRes.data) setHospitals(hospRes.data);
    if (linkRes.data) setConsentLinks(linkRes.data);
    if (auditRes.data) setAuditLog(auditRes.data);
    
    setIsLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Build matrix state
  // key: "memberId-hospitalId", value: access_level
  const matrix: Record<string, AccessLevel> = {};
  consentLinks.forEach(link => {
    matrix[`${link.member_id}-${link.hospital_id}`] = link.access_level;
  });

  const getMatrixValue = (memberId: string, hospitalId: string): AccessLevel => {
    return matrix[`${memberId}-${hospitalId}`] || "none";
  };

  const cycleAccessLevel = async (memberId: string, hospitalId: string) => {
    const current = getMatrixValue(memberId, hospitalId);
    const member = members.find(m => m.id === memberId);
    const hospital = hospitals.find(h => h.id === hospitalId);
    
    let next: AccessLevel = "none";
    if (current === "none") next = "readonly";
    else if (current === "readonly") next = "full";
    else if (current === "full") next = "none";
    else if (current === "emergency") next = "none";
    
    // Optimistic UI Update
    setConsentLinks(prev => {
      const exists = prev.find(p => p.member_id === memberId && p.hospital_id === hospitalId);
      if (exists) {
        return prev.map(p => p.member_id === memberId && p.hospital_id === hospitalId ? { ...p, access_level: next } : p);
      } else {
        return [...prev, { member_id: memberId, hospital_id: hospitalId, access_level: next }];
      }
    });

    // DB Upsert
    const { error } = await supabase
      .from('consent_links')
      .upsert({ member_id: memberId, hospital_id: hospitalId, access_level: next }, { onConflict: 'member_id,hospital_id' });
    
    if (error) {
      console.error("Error upserting consent:", error);
      fetchData(); // Revert
      return;
    }

    // Add audit
    const actionMap = {
      'none': 'Consent Revoked',
      'readonly': 'Consent Granted',
      'full': 'Consent Updated'
    };
    
    await supabase.from('audit_logs').insert({
      actor: "Admin SA",
      action: actionMap[next],
      target: `${member?.first_name} at ${hospital?.name}`,
      details: `${current} -> ${next}`,
      ip_address: "192.168.1.100" // Mock IP
    });

    fetchData(); // Refresh audit logs
    showToast(`Consent updated for ${member?.first_name}`);
  };

  const handleBulkAction = (action: 'approve' | 'deny') => {
    setRequests(prev => prev.filter(r => !selectedRequests.has(r.id)));
    setSelectedRequests(new Set());
    showToast(`Successfully ${action}d selected requests`);
  };

  const getAccessColor = (level: AccessLevel) => {
    switch (level) {
      case "full": return "bg-amber-500 shadow-[0_0_15px_rgba(245,166,35,0.3)] border border-amber-400";
      case "readonly": return "bg-amber-500/10 border-2 border-amber-500 text-amber-500";
      case "emergency": return "bg-crimson/20 shadow-[0_0_15px_rgba(220,38,38,0.25)] border border-crimson text-crimson";
      case "none": return "bg-white/5 border border-white/10 hover:bg-white/10";
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 relative">
      {/* Toast */}
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

      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ivory font-space-grotesk">Consent Governance</h1>
          <p className="text-ivory/50">Manage data sharing permissions between families and hospitals (Live DB)</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowTemplates(true)}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-ivory rounded-lg text-sm transition-colors flex items-center gap-2"
          >
            <LayoutTemplate size={16} /> Consent Templates
          </button>
          <button 
            onClick={() => setShowOverride(true)}
            className="px-4 py-2 bg-crimson/10 hover:bg-crimson/20 border border-crimson/30 text-crimson rounded-lg text-sm transition-colors flex items-center gap-2 font-medium"
          >
            <AlertTriangle size={16} /> Mass Override
          </button>
        </div>
      </header>

      {isLoading && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/20 backdrop-blur-sm text-amber-500 h-[500px]">
          <Loader2 className="animate-spin mb-4" size={48} />
          <p>Loading consent matrix...</p>
        </div>
      )}

      {/* Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Main Column - Matrix & Requests */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* Matrix Panel */}
          <div className="frosted-panel rounded-xl p-6">
            <h2 className="text-ivory font-semibold mb-6 flex items-center gap-2">
              <ShieldCheck className="text-amber-500" /> Visual Consent Matrix
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-left font-normal text-ivory/50 pb-4 pr-4 w-48">Family Member</th>
                    {hospitals.map(h => (
                      <th key={h.id} className="text-center font-normal text-ivory/50 pb-4 px-2 w-32">
                        <div className="truncate max-w-[120px] mx-auto" title={h.name}>{h.name}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {members.map(member => {
                    const family = families.find(f => f.id === member.family_id);
                    return (
                      <tr key={member.id}>
                        <td className="py-2 pr-4 border-b border-white/5">
                          <p className="text-ivory font-medium">{member.first_name}</p>
                          <p className="text-xs text-ivory/40">{family?.name || 'Unknown Family'}</p>
                        </td>
                        {hospitals.map(hospital => {
                          const level = getMatrixValue(member.id, hospital.id);
                          return (
                            <td key={hospital.id} className="p-2 border-b border-white/5">
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => cycleAccessLevel(member.id, hospital.id)}
                                className={`w-full h-10 rounded-lg flex items-center justify-center transition-all ${getAccessColor(level)}`}
                              >
                                <span className={`text-xs font-bold uppercase tracking-wider ${level === 'full' ? 'text-obsidian' : level === 'readonly' ? 'text-amber-500' : 'text-ivory/30'}`}>
                                  {level === 'readonly' ? 'Read' : level}
                                </span>
                              </motion.button>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            <div className="flex gap-6 mt-6 pt-4 border-t border-white/10 text-xs text-ivory/50">
              <span className="flex items-center gap-2"><div className="w-3 h-3 bg-amber-500 rounded-sm"/> Full Access</span>
              <span className="flex items-center gap-2"><div className="w-3 h-3 border-2 border-amber-500 rounded-sm"/> Read-Only</span>
              <span className="flex items-center gap-2"><div className="w-3 h-3 bg-white/5 border border-white/10 rounded-sm"/> No Access</span>
            </div>
          </div>

          {/* Pending Requests */}
          <div className="frosted-panel rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-ivory font-semibold flex items-center gap-2">
                <FileCheck2 className="text-sage" /> Pending Access Requests
              </h2>
              {selectedRequests.size > 0 && (
                <div className="flex gap-2">
                  <button onClick={() => handleBulkAction('approve')} className="px-3 py-1 bg-sage/20 text-sage hover:bg-sage/30 rounded text-xs font-medium transition-colors">
                    Approve Selected
                  </button>
                  <button onClick={() => handleBulkAction('deny')} className="px-3 py-1 bg-crimson/20 text-crimson hover:bg-crimson/30 rounded text-xs font-medium transition-colors">
                    Deny Selected
                  </button>
                </div>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-[#141414] border-b border-white/10">
                  <tr>
                    <th className="px-4 py-3 w-10">
                      <input 
                        type="checkbox" 
                        checked={selectedRequests.size === requests.length && requests.length > 0}
                        onChange={() => {
                          if (selectedRequests.size === requests.length) setSelectedRequests(new Set());
                          else setSelectedRequests(new Set(requests.map(r => r.id)));
                        }}
                        className="rounded border-white/20 bg-black/40 text-sage focus:ring-sage/50"
                      />
                    </th>
                    <th className="px-4 py-3 font-medium text-ivory/50">Hospital</th>
                    <th className="px-4 py-3 font-medium text-ivory/50">Patient</th>
                    <th className="px-4 py-3 font-medium text-ivory/50">Type</th>
                    <th className="px-4 py-3 font-medium text-ivory/50">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {requests.map(req => (
                    <tr key={req.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3">
                        <input 
                          type="checkbox" 
                          checked={selectedRequests.has(req.id)}
                          onChange={() => {
                            const newSet = new Set(selectedRequests);
                            if (newSet.has(req.id)) newSet.delete(req.id);
                            else newSet.add(req.id);
                            setSelectedRequests(newSet);
                          }}
                          className="rounded border-white/20 bg-black/40 text-sage focus:ring-sage/50"
                        />
                      </td>
                      <td className="px-4 py-3 text-ivory">{req.hospital}</td>
                      <td className="px-4 py-3 text-ivory">{req.member}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${req.type.includes('Emergency') ? 'bg-crimson/20 text-crimson' : 'bg-amber-500/20 text-amber-500'}`}>
                          {req.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-ivory/50 text-xs flex items-center gap-1">
                        <Clock size={12}/> {req.time}
                      </td>
                    </tr>
                  ))}
                  {requests.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-ivory/40">No pending requests</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column - Audit Trail */}
        <div className="xl:col-span-1">
          <div className="frosted-panel rounded-xl p-6 sticky top-6 h-[calc(100vh-140px)] flex flex-col">
            <h2 className="text-ivory font-semibold mb-4 flex items-center gap-2">
              <History className="text-terracotta" /> Live Audit Trail
            </h2>
            
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
              <AnimatePresence initial={false}>
                {auditLog.length === 0 && !isLoading && (
                  <p className="text-ivory/40 text-sm text-center mt-10">No consent changes logged yet.</p>
                )}
                {auditLog.map(log => (
                  <motion.div 
                    key={log.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-3 bg-white/5 border border-white/10 rounded-lg text-sm"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-amber-500 text-xs">{log.actor}</span>
                      <span className="text-ivory/40 text-[10px] flex items-center gap-1"><Clock size={10}/>{new Date(log.created_at).toLocaleTimeString()}</span>
                    </div>
                    
                    <p className="text-ivory/80 mb-2 leading-relaxed text-xs">
                      {log.action} for 
                      <span className="text-ivory font-medium"> {log.target}</span>.
                    </p>
                    
                    <div className="flex items-center gap-2 text-xs p-2 bg-black/40 rounded border border-white/5">
                      <span className="text-ivory font-medium">{log.details}</span>
                    </div>
                    
                    <div className="mt-2 flex items-center gap-1 text-[10px] text-ivory/30 font-mono">
                      <Server size={10} /> IP: {log.ip_address}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
