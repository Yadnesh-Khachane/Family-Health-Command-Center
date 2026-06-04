"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  AlertOctagon, RadioTower, ShieldAlert, Activity,
  CheckCircle2, AlertTriangle, Info, Clock, Search,
  Filter, ChevronRight, ActivitySquare, Users, Building2,
  Loader2
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function FDARecallsPage() {
  const supabase = createClient();
  
  const [recalls, setRecalls] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRecall, setSelectedRecall] = useState<string | null>(null);
  const [isPropagating, setIsPropagating] = useState(false);
  const [propagationProgress, setPropagationProgress] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchRecalls = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('fda_recalls')
      .select('*')
      .order('issue_date', { ascending: false });
      
    if (!error && data) {
      setRecalls(data.map(r => ({ ...r, propagated: false })));
      if (data.length > 0 && !selectedRecall) setSelectedRecall(data[0].id);
    }
    setIsLoading(false);
  }, [supabase, selectedRecall]);

  useEffect(() => {
    fetchRecalls();
  }, [fetchRecalls]);

  const activeRecall = recalls.find(r => r.id === selectedRecall);

  const startPropagation = () => {
    if (!activeRecall) return;
    setIsPropagating(true);
    setPropagationProgress(0);
    
    // Simulate propagation across network
    const interval = setInterval(() => {
      setPropagationProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setIsPropagating(false);
          setRecalls(prev => prev.map(r => r.id === activeRecall.id ? { ...r, propagated: true } : r));
          showToast(`Recall ${activeRecall.id} successfully broadcasted to ${activeRecall.hosp_count} hospitals.`);
          
          // Log audit
          supabase.from('audit_logs').insert({
            actor: "Admin SA",
            action: "FDA Recall Propagated",
            target: activeRecall.product,
            details: `Broadcast to ${activeRecall.fam_count} families, ${activeRecall.hosp_count} hospitals`,
            ip_address: "127.0.0.1"
          }).then();

          return 100;
        }
        return p + Math.floor(Math.random() * 15) + 5;
      });
    }, 400);
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
          <h1 className="text-2xl font-bold text-ivory font-space-grotesk">FDA Recall Propagation</h1>
          <p className="text-ivory/50">Real-time device and pharmaceutical recall broadcasts</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        
        {/* Left Col - Inbox */}
        <div className="lg:col-span-4 frosted-panel rounded-xl flex flex-col border border-white/5">
          <div className="p-4 border-b border-white/10 bg-black/40 shrink-0">
            <h2 className="text-ivory font-medium flex items-center gap-2 mb-4">
              <AlertOctagon className="text-crimson" size={18} /> Recall Inbox
            </h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ivory/40" />
              <input 
                type="text" 
                placeholder="Search IDs or products..."
                className="w-full pl-9 pr-4 py-2 bg-black/40 border border-white/10 rounded-lg text-sm text-ivory focus:outline-none focus:border-amber-500/50"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar relative">
            {isLoading && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/20 backdrop-blur-sm text-amber-500">
                <Loader2 className="animate-spin mb-2" size={32} />
              </div>
            )}
            {recalls.map(recall => (
              <button 
                key={recall.id}
                onClick={() => setSelectedRecall(recall.id)}
                className={`w-full text-left p-4 rounded-lg border transition-all ${
                  selectedRecall === recall.id 
                    ? 'bg-amber-500/10 border-amber-500/30' 
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-mono text-xs text-ivory/50">{recall.id}</span>
                  <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                    recall.severity === 'critical' ? 'bg-crimson/20 text-crimson' :
                    recall.severity === 'high' ? 'bg-amber-500/20 text-amber-500' :
                    'bg-sage/20 text-sage'
                  }`}>
                    {recall.severity}
                  </span>
                </div>
                <h3 className="font-medium text-ivory text-sm truncate">{recall.product}</h3>
                <div className="flex items-center justify-between mt-3 text-xs">
                  <span className="text-ivory/40">{new Date(recall.issue_date).toLocaleDateString()}</span>
                  {recall.propagated ? (
                    <span className="text-sage flex items-center gap-1"><CheckCircle2 size={12}/> Broadcasted</span>
                  ) : (
                    <span className="text-amber-500 flex items-center gap-1"><Activity size={12}/> Pending</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Col - Details & Action */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {activeRecall ? (
            <>
              {/* Top - Analysis */}
              <div className="frosted-panel rounded-xl p-6 border border-white/5 relative overflow-hidden">
                <div className="absolute right-0 top-0 w-64 h-64 bg-crimson/5 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2" />
                
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-2 py-1 text-xs font-bold uppercase rounded border ${
                        activeRecall.severity === 'critical' ? 'bg-crimson/10 text-crimson border-crimson/30' :
                        activeRecall.severity === 'high' ? 'bg-amber-500/10 text-amber-500 border-amber-500/30' :
                        'bg-sage/10 text-sage border-sage/30'
                      }`}>
                        Class I - {activeRecall.severity}
                      </span>
                      <span className="font-mono text-sm text-ivory/50">{activeRecall.id}</span>
                    </div>
                    <h2 className="text-2xl font-bold text-ivory font-space-grotesk">{activeRecall.product}</h2>
                    <p className="text-ivory/70 mt-1">{activeRecall.manufacturer} • Lots: <span className="font-mono text-ivory">{activeRecall.lots}</span></p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-ivory/40 mb-1">Issue Date</p>
                    <p className="text-sm font-medium text-ivory">{new Date(activeRecall.issue_date).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-black/40 border border-white/10 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-ivory/50 text-sm mb-2"><Users size={16}/> Impacted Families</div>
                    <div className="text-3xl font-bold text-amber-500">{activeRecall.fam_count.toLocaleString()}</div>
                    <div className="text-xs text-ivory/40 mt-1">Cross-referenced via implant registries</div>
                  </div>
                  <div className="bg-black/40 border border-white/10 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-ivory/50 text-sm mb-2"><Building2 size={16}/> Stocking Hospitals</div>
                    <div className="text-3xl font-bold text-amber-500">{activeRecall.hosp_count.toLocaleString()}</div>
                    <div className="text-xs text-ivory/40 mt-1">Inventory active in 4 regions</div>
                  </div>
                </div>

                {/* Broadcast Engine */}
                <div className="border-t border-white/10 pt-6">
                  {activeRecall.propagated ? (
                    <div className="bg-sage/10 border border-sage/30 rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-sage/20 rounded-full flex items-center justify-center text-sage">
                          <CheckCircle2 size={24} />
                        </div>
                        <div>
                          <h3 className="text-sage font-medium">Broadcast Complete</h3>
                          <p className="text-sage/70 text-xs">All parties notified via push and SMS.</p>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-black/40 text-sage border border-sage/30 rounded hover:bg-black/60 transition-colors text-sm">
                        View Audit Log
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-ivory font-medium flex items-center gap-2">
                          <RadioTower className="text-amber-500" size={18} /> Propagation Engine
                        </h3>
                        {isPropagating && <span className="text-amber-500 text-sm font-mono">{propagationProgress}%</span>}
                      </div>

                      {isPropagating ? (
                        <div className="space-y-2">
                          <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden border border-white/10">
                            <motion.div 
                              className="h-full bg-amber-500"
                              initial={{ width: 0 }}
                              animate={{ width: `${propagationProgress}%` }}
                            />
                          </div>
                          <p className="text-xs text-ivory/50 text-center animate-pulse">Syncing matrix endpoints... Please do not close.</p>
                        </div>
                      ) : (
                        <button 
                          onClick={startPropagation}
                          className="w-full py-4 bg-crimson/20 border border-crimson text-crimson hover:bg-crimson hover:text-ivory transition-all font-bold uppercase tracking-widest rounded-lg flex items-center justify-center gap-3"
                        >
                          <ActivitySquare size={20} /> Initiate Global Broadcast
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom - Live Feeds */}
              <div className="grid grid-cols-2 gap-6 flex-1 min-h-0">
                <div className="frosted-panel rounded-xl p-4 border border-white/5 flex flex-col">
                  <h3 className="text-ivory/70 text-sm font-medium mb-4 flex items-center gap-2"><Info size={14}/> Action Required</h3>
                  <ul className="space-y-3 text-sm text-ivory flex-1 overflow-y-auto">
                    <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0"/> Immediate quarantine of affected lots.</li>
                    <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0"/> Contact patients scheduled for surgery in next 48h.</li>
                    <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0"/> Submit inventory audit to FDA portal by EOD.</li>
                  </ul>
                </div>
                <div className="frosted-panel rounded-xl p-4 border border-white/5 flex flex-col">
                  <h3 className="text-ivory/70 text-sm font-medium mb-4 flex items-center gap-2"><Activity size={14}/> Network Ack</h3>
                  {activeRecall.propagated ? (
                    <div className="flex-1 flex flex-col justify-center items-center">
                      <div className="text-4xl font-space-grotesk font-bold text-sage mb-1">100%</div>
                      <p className="text-xs text-ivory/50">Acknowledgment Received</p>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col justify-center items-center opacity-30">
                      <div className="text-4xl font-space-grotesk font-bold text-ivory mb-1">0%</div>
                      <p className="text-xs text-ivory/50">Awaiting Broadcast</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="frosted-panel rounded-xl flex-1 flex flex-col items-center justify-center text-ivory/30 border border-white/5">
              <AlertOctagon size={48} className="mb-4 opacity-50" />
              <p>Select a recall from the inbox to view details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
