"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Megaphone, Send, Clock, Users, Building2, Globe,
  Bold, Italic, Link2, List, AlignLeft,
  MessageSquare, Mail, AlertTriangle, CheckCircle2
} from "lucide-react";

const mockHistory = [
  { id: 1, title: "System Maintenance Window", sent: "Oct 12, 2024 - 08:00", audience: "All Users", method: "Banner + Email", status: "Delivered", failed: 0 },
  { id: 2, draw: true, title: "Updated Privacy Policy v2.1", sent: "Sep 28, 2024 - 10:00", audience: "Families", method: "Email Only", status: "Partial", failed: 12 },
  { id: 3, title: "New Module: Surgery Predictor", sent: "Sep 15, 2024 - 14:30", audience: "Hospitals", method: "Banner", status: "Delivered", failed: 0 },
];

export default function AnnouncementsPage() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [audience, setAudience] = useState("all");
  const [methods, setMethods] = useState({ banner: true, email: false, sms: false });
  const [schedule, setSchedule] = useState("now");
  
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handlePublish = () => {
    if (!title.trim() || !body.trim()) {
      showToast("Please provide both a title and message body.");
      return;
    }
    showToast(schedule === 'now' ? "Announcement published successfully." : "Announcement scheduled.");
    setTitle("");
    setBody("");
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

      <header className="flex items-end justify-between shrink-0 mb-4">
        <div>
          <h1 className="text-2xl font-bold text-ivory font-space-grotesk">Global Announcements</h1>
          <p className="text-ivory/50">Push critical updates, maintenance notices, and policy changes</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        
        {/* Compose Panel */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="frosted-panel rounded-xl p-6 flex flex-col h-full border border-white/5">
            <h2 className="text-ivory font-medium mb-6 flex items-center gap-2">
              <Megaphone className="text-amber-500" size={18}/> Compose Message
            </h2>

            <div className="space-y-6 flex-1 flex flex-col">
              
              {/* Audience & Delivery */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs text-ivory/50 mb-2 uppercase tracking-wider font-bold">Target Audience</label>
                  <div className="flex bg-black/40 p-1 rounded-lg border border-white/10">
                    <button onClick={() => setAudience('all')} className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded text-xs transition-colors ${audience === 'all' ? 'bg-amber-500 text-obsidian font-medium' : 'text-ivory/50 hover:text-ivory'}`}><Globe size={14}/> All</button>
                    <button onClick={() => setAudience('families')} className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded text-xs transition-colors ${audience === 'families' ? 'bg-amber-500 text-obsidian font-medium' : 'text-ivory/50 hover:text-ivory'}`}><Users size={14}/> Families</button>
                    <button onClick={() => setAudience('hospitals')} className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded text-xs transition-colors ${audience === 'hospitals' ? 'bg-amber-500 text-obsidian font-medium' : 'text-ivory/50 hover:text-ivory'}`}><Building2 size={14}/> Hospitals</button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-ivory/50 mb-2 uppercase tracking-wider font-bold">Delivery Method</label>
                  <div className="flex gap-4 h-8 items-center">
                    <label className="flex items-center gap-2 text-sm text-ivory/80 cursor-pointer">
                      <input type="checkbox" checked={methods.banner} onChange={e => setMethods({...methods, banner: e.target.checked})} className="accent-amber-500 w-4 h-4 rounded bg-black/40 border-white/20"/> 
                      <Megaphone size={14} className="text-ivory/40"/> Banner
                    </label>
                    <label className="flex items-center gap-2 text-sm text-ivory/80 cursor-pointer">
                      <input type="checkbox" checked={methods.email} onChange={e => setMethods({...methods, email: e.target.checked})} className="accent-amber-500 w-4 h-4 rounded bg-black/40 border-white/20"/> 
                      <Mail size={14} className="text-ivory/40"/> Email
                    </label>
                    <label className="flex items-center gap-2 text-sm text-ivory/80 cursor-pointer">
                      <input type="checkbox" checked={methods.sms} onChange={e => setMethods({...methods, sms: e.target.checked})} className="accent-amber-500 w-4 h-4 rounded bg-black/40 border-white/20"/> 
                      <MessageSquare size={14} className="text-ivory/40"/> SMS
                    </label>
                  </div>
                </div>
              </div>

              {/* Editor */}
              <div className="flex-1 flex flex-col border border-white/10 rounded-lg bg-[#0A0A0A] overflow-hidden min-h-[300px]">
                <input 
                  type="text" 
                  placeholder="Announcement Title"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full bg-transparent p-4 border-b border-white/10 text-lg font-medium text-ivory focus:outline-none placeholder:text-ivory/30"
                />
                
                <div className="flex items-center gap-1 p-2 border-b border-white/5 bg-black/40">
                  <button className="p-1.5 rounded hover:bg-white/10 text-ivory/60 hover:text-ivory transition-colors"><Bold size={16}/></button>
                  <button className="p-1.5 rounded hover:bg-white/10 text-ivory/60 hover:text-ivory transition-colors"><Italic size={16}/></button>
                  <div className="w-px h-4 bg-white/10 mx-1" />
                  <button className="p-1.5 rounded hover:bg-white/10 text-ivory/60 hover:text-ivory transition-colors"><Link2 size={16}/></button>
                  <div className="w-px h-4 bg-white/10 mx-1" />
                  <button className="p-1.5 rounded hover:bg-white/10 text-ivory/60 hover:text-ivory transition-colors"><List size={16}/></button>
                  <button className="p-1.5 rounded hover:bg-white/10 text-ivory/60 hover:text-ivory transition-colors"><AlignLeft size={16}/></button>
                </div>
                
                <textarea 
                  placeholder="Write your message here..."
                  value={body}
                  onChange={e => setBody(e.target.value)}
                  className="w-full flex-1 bg-transparent p-4 text-ivory/80 focus:outline-none placeholder:text-ivory/20 resize-none"
                />
              </div>

              {/* Scheduling & Publish */}
              <div className="flex items-center justify-between pt-4 border-t border-white/5 shrink-0">
                <div className="flex items-center gap-3">
                  <select 
                    value={schedule}
                    onChange={e => setSchedule(e.target.value)}
                    className="bg-black/40 border border-white/10 rounded-lg py-2 px-3 text-sm text-ivory focus:outline-none focus:border-amber-500/50"
                  >
                    <option value="now">Publish Immediately</option>
                    <option value="later">Schedule for Later...</option>
                  </select>
                  {schedule === 'later' && (
                    <input type="datetime-local" className="bg-black/40 border border-white/10 rounded-lg p-1.5 text-ivory text-sm focus:border-amber-500 outline-none" />
                  )}
                </div>
                <button 
                  onClick={handlePublish}
                  className="px-6 py-2 bg-amber-500 hover:bg-amber-500/80 text-obsidian font-bold rounded-lg transition-colors flex items-center gap-2"
                >
                  {schedule === 'now' ? <><Send size={16}/> Publish Now</> : <><Clock size={16}/> Schedule</>}
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* Right Col: Preview & History */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Live Preview */}
          <div className="frosted-panel rounded-xl flex flex-col overflow-hidden border border-white/5 h-64 shrink-0">
            <div className="p-4 border-b border-white/10 bg-black/40 shrink-0">
              <h3 className="text-ivory font-medium text-sm">Dashboard Banner Preview</h3>
            </div>
            <div className="flex-1 bg-[#0D0D0D] p-6 flex flex-col items-center justify-center border-t border-b border-[#222]">
              {/* Mock Dashboard context */}
              <div className="w-full max-w-sm">
                <div className="h-4 w-1/3 bg-white/5 rounded mb-4"></div>
                
                {/* The Banner */}
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-4 relative overflow-hidden group">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500"></div>
                  <h4 className="text-amber-500 font-medium text-sm mb-1">{title || "Announcement Title"}</h4>
                  <p className="text-ivory/70 text-xs line-clamp-2 leading-relaxed">{body || "The message body will appear here. Users can click to read the full details in a modal..."}</p>
                </div>
                
                <div className="h-20 w-full bg-white/5 rounded"></div>
              </div>
            </div>
          </div>

          {/* History */}
          <div className="frosted-panel rounded-xl flex-1 flex flex-col border border-white/5 overflow-hidden">
            <div className="p-4 border-b border-white/10 bg-black/40 flex items-center justify-between shrink-0">
              <h3 className="text-ivory font-medium text-sm">Broadcast History</h3>
              <button className="text-xs text-amber-500 hover:underline">View All</button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {mockHistory.map(item => (
                <div key={item.id} className="p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-sm font-medium text-ivory truncate pr-2">{item.title}</h4>
                    <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded shrink-0 ${
                      item.status === 'Delivered' ? 'bg-sage/20 text-sage' : 'bg-saffron/20 text-saffron'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-[10px] text-ivory/40 mb-2">
                    <span className="flex items-center gap-1"><Clock size={10}/> {item.sent}</span>
                    <span className="flex items-center gap-1"><Users size={10}/> {item.audience}</span>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <span className="text-[10px] text-ivory/50">{item.method}</span>
                    {item.failed > 0 && (
                      <span className="text-[10px] text-crimson flex items-center gap-1"><AlertTriangle size={10}/> {item.failed} failed</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
