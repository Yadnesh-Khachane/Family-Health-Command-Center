"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Activity, ShieldAlert, MapPin, Clock, Search,
  Filter, PlayCircle, Ban, AlertTriangle, CheckCircle2,
  Lock, X, Loader2
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function AnomaliesPage() {
  const supabase = createClient();

  const [anomalies, setAnomalies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAnomaly, setSelectedAnomaly] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchAnomalies = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('anomalies')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (!error && data) {
      setAnomalies(data);
      if (data.length > 0 && !selectedAnomaly) setSelectedAnomaly(data[0].id);
    }
    setIsLoading(false);
  }, [supabase, selectedAnomaly]);

  useEffect(() => {
    fetchAnomalies();
  }, [fetchAnomalies]);

  const activeAnomaly = anomalies.find(a => a.id === selectedAnomaly);

  const handleAction = async (actionId: string) => {
    if (!activeAnomaly) return;

    let newStatus = activeAnomaly.status;
    let toastAction = "";

    if (actionId === 'freeze') {
      newStatus = 'Investigating';
      toastAction = 'Account Frozen';
    } else if (actionId === 'block') {
      newStatus = 'Resolved';
      toastAction = 'IP Blocked';
    } else if (actionId === 'dismiss') {
      newStatus = 'Resolved';
      toastAction = 'Alert Dismissed';
    }

    // Optimistic
    setAnomalies(prev => prev.map(a => a.id === activeAnomaly.id ? { ...a, status: newStatus } : a));
    showToast(`${toastAction} for ${activeAnomaly.entity}`);

    // DB Update
    await supabase.from('anomalies').update({ status: newStatus }).eq('id', activeAnomaly.id);

    // Audit Log
    await supabase.from('audit_logs').insert({
      actor: "Security Engine",
      action: toastAction,
      target: activeAnomaly.entity,
      details: `Response to ${activeAnomaly.type}`,
      ip_address: "System"
    });
  };

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
          <h1 className="text-2xl font-bold text-ivory font-space-grotesk">Anomaly Detection</h1>
          <p className="text-ivory/50">AI-driven behavior analysis and threat mitigation (Live DB)</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        
        {/* Left Col - Inbox */}
        <div className="lg:col-span-4 frosted-panel rounded-xl flex flex-col border border-white/5">
          <div className="p-4 border-b border-white/10 bg-black/40 shrink-0">
            <h2 className="text-ivory font-medium flex items-center gap-2 mb-4">
              <Activity className="text-amber-500" size={18} /> Alert Queue
            </h2>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ivory/40" />
                <input 
                  type="text" 
                  placeholder="Filter alerts..."
                  className="w-full pl-9 pr-3 py-1.5 bg-black/40 border border-white/10 rounded-lg text-sm text-ivory focus:outline-none focus:border-amber-500/50"
                />
              </div>
              <button className="p-1.5 bg-black/40 border border-white/10 rounded-lg text-ivory/60 hover:text-ivory"><Filter size={16}/></button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar relative">
            {isLoading && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/20 backdrop-blur-sm text-amber-500">
                <Loader2 className="animate-spin mb-2" size={32} />
              </div>
            )}
            {anomalies.map(anom => (
              <button 
                key={anom.id}
                onClick={() => setSelectedAnomaly(anom.id)}
                className={`w-full text-left p-3 rounded-lg border transition-all ${
                  selectedAnomaly === anom.id 
                    ? 'bg-amber-500/10 border-amber-500/30' 
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                    anom.severity === 'Critical' ? 'bg-crimson/20 text-crimson' :
                    anom.severity === 'High' ? 'bg-amber-500/20 text-amber-500' :
                    'bg-sage/20 text-sage'
                  }`}>
                    {anom.severity}
                  </span>
                  <span className="text-[10px] text-ivory/40">{new Date(anom.created_at).toLocaleTimeString()}</span>
                </div>
                <h3 className="font-medium text-ivory text-sm truncate">{anom.type}</h3>
                <p className="text-xs text-ivory/50 truncate mt-0.5">{anom.entity}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Right Col - Investigation Dashboard */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {activeAnomaly ? (
            <>
              {/* Top - Analysis */}
              <div className="frosted-panel rounded-xl p-6 border border-white/5 relative overflow-hidden flex-shrink-0">
                <div className="absolute right-0 top-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2" />
                
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-ivory font-space-grotesk flex items-center gap-3">
                      {activeAnomaly.type}
                      {activeAnomaly.status === 'Resolved' && <CheckCircle2 className="text-sage" size={20}/>}
                    </h2>
                    <p className="text-ivory/70 mt-1 flex items-center gap-2">
                      Entity: <span className="font-medium text-ivory">{activeAnomaly.entity}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-3 py-1 rounded text-xs font-bold uppercase mb-2 ${
                      activeAnomaly.status === 'Resolved' ? 'bg-sage/20 text-sage' : 
                      activeAnomaly.status === 'Investigating' ? 'bg-amber-500/20 text-amber-500' : 'bg-white/10 text-ivory'
                    }`}>
                      {activeAnomaly.status || 'Pending'}
                    </span>
                    <p className="text-xs text-ivory/40">ID: {activeAnomaly.id.split('-')[0]}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-black/40 border border-white/10 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-ivory/50 text-xs mb-1"><MapPin size={12}/> Origin Location</div>
                    <div className="font-medium text-ivory">{activeAnomaly.location || 'Unknown'}</div>
                  </div>
                  <div className="bg-black/40 border border-white/10 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-ivory/50 text-xs mb-1"><ShieldAlert size={12}/> IP Address</div>
                    <div className="font-mono text-sm text-ivory">{activeAnomaly.ip_address || 'Unknown'}</div>
                  </div>
                  <div className="bg-black/40 border border-white/10 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-ivory/50 text-xs mb-1"><AlertTriangle size={12}/> AI Confidence</div>
                    <div className="font-medium text-amber-500">94.2% (Flagged)</div>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-sm text-ivory/80 leading-relaxed mb-6">
                  {activeAnomaly.description || 'Behavior falls outside of normal predictive parameters for this entity.'}
                  <br/><br/>
                  <span className="font-mono text-xs text-amber-500">CONTEXT: {activeAnomaly.action_context || 'N/A'}</span>
                </div>

                {/* Actions */}
                {activeAnomaly.status !== 'Resolved' && (
                  <div className="flex gap-3">
                    <button onClick={() => handleAction('freeze')} className="flex-1 flex items-center justify-center gap-2 py-3 bg-amber-500 text-obsidian font-bold rounded-lg hover:bg-amber-500/80 transition-colors">
                      <Lock size={16}/> Freeze Account
                    </button>
                    <button onClick={() => handleAction('block')} className="flex-1 flex items-center justify-center gap-2 py-3 bg-crimson/20 border border-crimson/50 text-crimson font-bold rounded-lg hover:bg-crimson/30 transition-colors">
                      <Ban size={16}/> Block IP Range
                    </button>
                    <button onClick={() => handleAction('dismiss')} className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 text-ivory/70 font-bold rounded-lg hover:bg-white/10 transition-colors">
                      <X size={16}/> Dismiss False Positive
                    </button>
                  </div>
                )}
              </div>

              {/* Session Replay (Visual Mock) */}
              <div className="frosted-panel rounded-xl p-6 border border-white/5 flex-1 flex flex-col min-h-[250px]">
                <h3 className="text-ivory font-medium flex items-center gap-2 mb-4">
                  <PlayCircle className="text-sage" size={18} /> Session Replay Timeline
                </h3>
                <div className="flex-1 relative flex flex-col justify-center px-8">
                  {/* Timeline line */}
                  <div className="absolute top-1/2 left-8 right-8 h-0.5 bg-white/10 -translate-y-1/2 z-0" />
                  
                  <div className="relative z-10 flex justify-between">
                    <div className="flex flex-col items-center gap-2 group">
                      <div className="text-xs text-ivory/40 opacity-0 group-hover:opacity-100 transition-opacity absolute -top-6">T-04:00</div>
                      <div className="w-4 h-4 rounded-full bg-sage shadow-[0_0_10px_rgba(125,155,118,0.5)] border-2 border-[#1a1a1a]" />
                      <div className="text-xs text-ivory/70 text-center mt-2 w-24">Valid Login (Mumbai)</div>
                    </div>
                    
                    <div className="flex flex-col items-center gap-2 group">
                      <div className="text-xs text-ivory/40 opacity-0 group-hover:opacity-100 transition-opacity absolute -top-6">T-01:30</div>
                      <div className="w-4 h-4 rounded-full bg-sage shadow-[0_0_10px_rgba(125,155,118,0.5)] border-2 border-[#1a1a1a]" />
                      <div className="text-xs text-ivory/70 text-center mt-2 w-24">Viewed Dashboard</div>
                    </div>
                    
                    <div className="flex flex-col items-center gap-2 group">
                      <div className="text-xs text-crimson font-bold absolute -top-6">T-00:05</div>
                      <div className="w-6 h-6 rounded-full bg-crimson shadow-[0_0_15px_rgba(192,57,43,0.8)] border-2 border-[#1a1a1a] flex items-center justify-center animate-pulse">
                        <div className="w-2 h-2 bg-white rounded-full"/>
                      </div>
                      <div className="text-xs text-crimson font-medium text-center mt-2 w-24">Mass Export Attempt</div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="frosted-panel rounded-xl flex-1 flex flex-col items-center justify-center text-ivory/30 border border-white/5">
              <ShieldAlert size={48} className="mb-4 opacity-50" />
              <p>Select an anomaly alert to investigate.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
