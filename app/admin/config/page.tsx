"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Settings, ToggleLeft, Globe, Scale, Mail, 
  Save, AlertTriangle, ShieldCheck
} from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, ResponsiveContainer, Legend
} from "recharts";

// Mock Data
const fairnessData = [
  { group: "Demographic A", score: 72, expected: 70 },
  { group: "Demographic B", score: 68, expected: 70 },
  { group: "Demographic C", score: 85, expected: 70 }, // Outlier
  { group: "Demographic D", score: 71, expected: 70 },
];

export default function SystemConfigPage() {
  const [activeTab, setActiveTab] = useState<"features" | "global" | "fairness" | "templates">("features");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Toggles State
  const [toggles, setToggles] = useState({
    crisisMode: true,
    drugScanner: true,
    cogTracker: false,
    geoSymp: true
  });

  // Settings State
  const [settings, setSettings] = useState({
    timeout: "30",
    crisisExpiry: "24",
    pwdComplex: "high",
    uploadLimit: "50"
  });

  // Fairness State
  const [correctionFactor, setCorrectionFactor] = useState(1.0);

  // Templates State
  const [activeTemplate, setActiveTemplate] = useState("welcome");
  const [templateContent, setTemplateContent] = useState(
    "Hello {primary_contact},\n\nWelcome to the Family Health Command Center. Your family ({family_name}) has been successfully registered.\n\nPlease log in to complete your profile.\n\nBest,\nFHCC Admin Team"
  );

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSave = () => {
    showToast("Configuration saved successfully");
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
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

      <header className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-ivory font-space-grotesk">System Configuration</h1>
          <p className="text-ivory/50">Manage platform behavior, algorithms, and global variables</p>
        </div>
        <button 
          onClick={handleSave}
          className="px-6 py-2 bg-sage hover:bg-sage/80 text-obsidian font-semibold rounded-lg transition-colors flex items-center gap-2"
        >
          <Save size={16} /> Save Changes
        </button>
      </header>

      {/* Tabs */}
      <div className="flex border-b border-white/10 mb-6">
        {[
          { id: "features", label: "Feature Toggles", icon: ToggleLeft },
          { id: "global", label: "Global Settings", icon: Globe },
          { id: "fairness", label: "Fairness Monitor", icon: Scale },
          { id: "templates", label: "Notifications", icon: Mail },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors border-b-2 ${
              activeTab === tab.id ? 'border-amber-500 text-amber-500' : 'border-transparent text-ivory/50 hover:text-ivory hover:bg-white/5'
            }`}
          >
            <tab.icon size={18} /> {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[500px]">
        {/* FEATURE TOGGLES */}
        {activeTab === "features" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { id: "crisisMode", name: "Crisis Mode Overlay", desc: "Allows families to trigger emergency mode, relaxing consent gates temporarily." },
              { id: "drugScanner", name: "Cross-Family Drug Scanner", desc: "Analyzes household prescriptions for contraindications." },
              { id: "cogTracker", name: "Post-Anesthesia Cognitive Tracker", desc: "Beta feature: tracking micro-cognitive changes post-surgery." },
              { id: "geoSymp", name: "Geospatial Symptom Correlation", desc: "Heatmap generation for localized symptom clustering." }
            ].map(feature => (
              <div key={feature.id} className="frosted-panel p-6 rounded-xl border border-white/5">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-ivory font-medium">{feature.name}</h3>
                    <p className="text-ivory/50 text-sm mt-1">{feature.desc}</p>
                  </div>
                  <div 
                    onClick={() => setToggles(prev => ({ ...prev, [feature.id]: !prev[feature.id as keyof typeof prev] }))}
                    className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${
                      toggles[feature.id as keyof typeof toggles] ? 'bg-amber-500' : 'bg-white/20'
                    }`}
                  >
                    <motion.div 
                      layout
                      className="absolute top-1 bottom-1 w-4 rounded-full bg-obsidian"
                      style={{ left: toggles[feature.id as keyof typeof toggles] ? 'calc(100% - 20px)' : '4px' }}
                    />
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/5 flex gap-2">
                  <span className="text-xs text-ivory/40">Overrides active for 12 entities</span>
                  <button className="text-xs text-amber-500 hover:underline">Manage Overrides</button>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* GLOBAL SETTINGS */}
        {activeTab === "global" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="frosted-panel rounded-xl p-8 max-w-3xl">
            <h2 className="text-xl font-medium text-ivory mb-6">Security & Environment</h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-8 border-b border-white/10 pb-6">
                <div>
                  <label className="block text-ivory/70 text-sm mb-2">Admin Session Timeout (Minutes)</label>
                  <input 
                    type="number" 
                    value={settings.timeout}
                    onChange={e => setSettings({...settings, timeout: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-ivory focus:border-amber-500 outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-ivory/70 text-sm mb-2">Crisis Mode Auto-Expiry (Hours)</label>
                  <input 
                    type="number" 
                    value={settings.crisisExpiry}
                    onChange={e => setSettings({...settings, crisisExpiry: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-ivory focus:border-amber-500 outline-none" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 border-b border-white/10 pb-6">
                <div>
                  <label className="block text-ivory/70 text-sm mb-2">Password Complexity</label>
                  <select 
                    value={settings.pwdComplex}
                    onChange={e => setSettings({...settings, pwdComplex: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-ivory focus:border-amber-500 outline-none"
                  >
                    <option value="low">Low (8 chars)</option>
                    <option value="medium">Medium (Alphanumeric)</option>
                    <option value="high">High (Special chars + length)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-ivory/70 text-sm mb-2">Max File Upload Size (MB)</label>
                  <input 
                    type="number" 
                    value={settings.uploadLimit}
                    onChange={e => setSettings({...settings, uploadLimit: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-ivory focus:border-amber-500 outline-none" 
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ALGORITHMIC FAIRNESS */}
        {activeTab === "fairness" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="p-4 bg-crimson/10 border border-crimson/30 rounded-lg flex items-start gap-4">
              <AlertTriangle className="text-crimson mt-1 shrink-0" />
              <div>
                <h3 className="text-crimson font-medium">Bias Detected in Surgical Advisory Model</h3>
                <p className="text-crimson/80 text-sm mt-1">
                  The Adhesion Risk predictive model is scoring Demographic C consistently higher than the baseline expectation. 
                  Please review the outputs or apply a correction factor.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 frosted-panel rounded-xl p-6 h-96">
                <h3 className="text-ivory font-medium mb-4">Adhesion Risk Score Distribution</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={fairnessData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                    <XAxis dataKey="group" stroke="#888" tick={{fill: '#888', fontSize: 12}} />
                    <YAxis stroke="#888" tick={{fill: '#888', fontSize: 12}} />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid #333' }}
                      itemStyle={{ color: '#E85D3A' }}
                      cursor={{fill: 'rgba(255,255,255,0.05)'}}
                    />
                    <Legend />
                    <Bar dataKey="expected" name="Baseline Expected" fill="#333" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="score" name="Actual Score Avg" fill="#F5A623" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="frosted-panel rounded-xl p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-ivory font-medium mb-4">Manual Correction</h3>
                  <p className="text-ivory/50 text-sm mb-6">Apply a temporary mathematical weight to predictions for Demographic C until the model is retrained.</p>
                  
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-ivory">Correction Factor</span>
                    <span className="text-amber-500 font-mono">{correctionFactor.toFixed(2)}x</span>
                  </div>
                  <input 
                    type="range" 
                    min="0.5" max="1.5" step="0.05" 
                    value={correctionFactor}
                    onChange={e => setCorrectionFactor(parseFloat(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                  <div className="flex justify-between text-xs text-ivory/40 mt-1">
                    <span>Deflate (0.5x)</span>
                    <span>Neutral (1.0x)</span>
                    <span>Inflate (1.5x)</span>
                  </div>
                </div>

                <div className="p-4 bg-white/5 rounded-lg border border-white/10 mt-6">
                  <div className="flex items-center gap-2 text-sage text-sm mb-1"><ShieldCheck size={16}/> Audit Ready</div>
                  <p className="text-ivory/40 text-xs">Correction factor applications are immutably logged for regulatory compliance.</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* NOTIFICATION TEMPLATES */}
        {activeTab === "templates" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-4 gap-6 h-[600px]">
            
            <div className="md:col-span-1 frosted-panel rounded-xl border border-white/5 overflow-hidden flex flex-col">
              <div className="p-4 border-b border-white/10 bg-black/40">
                <h3 className="text-ivory font-medium text-sm">Templates</h3>
              </div>
              <div className="flex-1 overflow-y-auto">
                {[
                  { id: "welcome", label: "Family Welcome" },
                  { id: "recall", label: "Recall Alert" },
                  { id: "consent", label: "Consent Request" },
                  { id: "emergency", label: "Emergency Broadcast" },
                  { id: "password", label: "Password Reset" },
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTemplate(t.id)}
                    className={`w-full text-left p-4 text-sm transition-colors border-b border-white/5 ${
                      activeTemplate === t.id ? 'bg-amber-500/10 text-amber-500' : 'text-ivory/70 hover:bg-white/5'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="md:col-span-3 frosted-panel rounded-xl flex flex-col">
              <div className="p-4 border-b border-white/10 bg-black/40 flex justify-between items-center">
                <h3 className="text-ivory font-medium text-sm">Edit Template</h3>
                <div className="text-xs text-ivory/50 flex gap-2">
                  Variables: 
                  <span className="text-amber-500 bg-amber-500/10 px-1 rounded">{'{primary_contact}'}</span>
                  <span className="text-amber-500 bg-amber-500/10 px-1 rounded">{'{family_name}'}</span>
                </div>
              </div>
              <div className="flex-1 p-4">
                <textarea
                  value={templateContent}
                  onChange={e => setTemplateContent(e.target.value)}
                  className="w-full h-full bg-[#0A0A0A] border border-white/10 rounded-lg p-4 text-ivory text-sm focus:border-amber-500 outline-none resize-none"
                />
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
