"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import { 
  Activity, Users, Building2, Server, ArrowRight,
  ShieldAlert, Radio, ActivitySquare, ShieldCheck, Database,
  Loader2
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";

// Mock data for the system health chart
const performanceData = [
  { time: '00:00', ms: 120 }, { time: '04:00', ms: 135 }, { time: '08:00', ms: 210 }, 
  { time: '12:00', ms: 180 }, { time: '16:00', ms: 145 }, { time: '20:00', ms: 110 }, { time: '24:00', ms: 115 }
];

export default function AdminDashboard() {
  const supabase = createClient();
  
  const [showConfirm, setShowConfirm] = useState(false);
  const [stats, setStats] = useState({ fams: 0, hosps: 0, admins: 0 });
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    const [famRes, hospRes, adminRes, auditRes] = await Promise.all([
      supabase.from('families').select('*', { count: 'exact', head: true }),
      supabase.from('hospitals').select('*', { count: 'exact', head: true }),
      supabase.from('admins').select('*', { count: 'exact', head: true }),
      supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(10)
    ]);
    
    setStats({
      fams: famRes.count || 0,
      hosps: hospRes.count || 0,
      admins: adminRes.count || 0
    });
    
    if (auditRes.data) {
      setEvents(auditRes.data);
    }
    setIsLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-ivory font-space-grotesk tracking-tight">Control Room</h1>
          <p className="text-ivory/50 mt-1">System Health & Live Telemetry (Supabase Connected)</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 frosted-glass text-ivory text-sm rounded-lg hover:bg-white/10 transition-colors border border-white/10 flex items-center gap-2">
            <Database size={16}/> Refresh Data
          </button>
          <button 
            onClick={() => setShowConfirm(true)}
            className="px-4 py-2 bg-crimson/20 border border-crimson text-crimson text-sm rounded-lg hover:bg-crimson hover:text-white transition-all font-bold uppercase tracking-wider"
          >
            Emergency Override
          </button>
        </div>
      </header>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Registered Families", val: isLoading ? "-" : stats.fams, icon: Users, color: "text-sage", border: "border-sage/20", bg: "bg-sage/5" },
          { label: "Partnered Hospitals", val: isLoading ? "-" : stats.hosps, icon: Building2, color: "text-amber-500", border: "border-amber-500/20", bg: "bg-amber-500/5" },
          { label: "Active Admins", val: isLoading ? "-" : stats.admins, icon: ShieldCheck, color: "text-terracotta", border: "border-terracotta/20", bg: "bg-terracotta/5" },
          { label: "System Uptime", val: "99.98%", icon: Server, color: "text-sage", border: "border-sage/20", bg: "bg-sage/5" },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`p-6 rounded-xl border ${stat.border} ${stat.bg} backdrop-blur-md relative overflow-hidden group`}
          >
            <div className="flex justify-between items-start mb-4">
              <stat.icon className={`${stat.color} opacity-80 group-hover:opacity-100 transition-opacity`} size={24} />
              {isLoading && <Loader2 size={14} className="animate-spin text-ivory/30" />}
            </div>
            <h3 className="text-3xl font-bold text-ivory font-space-grotesk">{stat.val}</h3>
            <p className="text-xs text-ivory/50 uppercase tracking-wider mt-1">{stat.label}</p>
            {/* Glow effect */}
            <div className={`absolute -bottom-8 -right-8 w-24 h-24 ${stat.bg.replace('/5', '/20')} rounded-full blur-2xl group-hover:bg-opacity-40 transition-all`} />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Chart */}
        <div className="lg:col-span-2 frosted-panel rounded-xl p-6 border border-white/5">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-ivory flex items-center gap-2">
              <Activity className="text-sage" /> System Health Pulse
            </h2>
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-sage/20 text-sage text-xs rounded border border-sage/30">API: Normal</span>
              <span className="px-2 py-1 bg-sage/20 text-sage text-xs rounded border border-sage/30">DB: Normal</span>
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="time" stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#0D0D0D', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#F5A623' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="ms" 
                  stroke="#F5A623" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#0D0D0D', stroke: '#F5A623', strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: '#F5A623' }}
                  animationDuration={1500}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Event Feed */}
        <div className="frosted-panel rounded-xl p-6 border border-white/5 flex flex-col h-[400px]">
          <div className="flex justify-between items-center mb-4 shrink-0">
            <h2 className="text-lg font-bold text-ivory flex items-center gap-2">
              <Radio className="text-amber-500 animate-pulse" /> Live Event Feed
            </h2>
            <button className="text-xs text-amber-500 hover:underline">View All</button>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar relative">
            {isLoading && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/20 backdrop-blur-sm text-amber-500">
                <Loader2 className="animate-spin mb-2" size={32} />
              </div>
            )}
            <AnimatePresence>
              {events.map((evt, i) => (
                <motion.div 
                  key={evt.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-3 bg-white/5 rounded-lg border border-white/10"
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-bold text-amber-500">{evt.action}</span>
                    <span className="text-[10px] text-ivory/40">{new Date(evt.created_at).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-sm text-ivory/80">{evt.target}</p>
                  {evt.details && <p className="text-xs text-ivory/50 mt-1">{evt.details}</p>}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

      </div>

      {/* Emergency Modal */}
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
              <ShieldAlert size={64} className="text-crimson mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">ACTIVATE PROTOCOL?</h2>
              <p className="text-crimson/80 mb-6 text-sm leading-relaxed">
                This will override all standard consent gates network-wide. Action will be heavily audited.
              </p>
              
              <div className="flex flex-col gap-3">
                <button
                  className="w-full py-3 rounded-lg bg-crimson text-white font-bold uppercase tracking-wider hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                >
                  <ActivitySquare size={18} /> Confirm Activation
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

    </div>
  );
}
