"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  Database, 
  Users, 
  ShieldCheck, 
  AlertTriangle, 
  Activity, 
  Settings, 
  Siren, 
  FileSearch, 
  Megaphone,
  ChevronLeft,
  ChevronRight,
  ActivitySquare
} from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Database Studio", href: "/admin/database", icon: Database },
  { name: "Entity Management", href: "/admin/entities", icon: Users },
  { name: "Consent Governance", href: "/admin/consent", icon: ShieldCheck },
  { name: "FDA Recalls", href: "/admin/recalls", icon: AlertTriangle },
  { name: "Anomaly Detection", href: "/admin/anomalies", icon: Activity },
  { name: "System Config", href: "/admin/config", icon: Settings },
  { name: "Emergency Protocol", href: "/admin/emergency", icon: Siren },
  { name: "Audit Trail", href: "/admin/audit", icon: FileSearch },
  { name: "Announcements", href: "/admin/announcements", icon: Megaphone },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#0D0D0D] relative overflow-hidden">
      {/* Shared Background Effects */}
      <div className="fixed inset-0 opacity-30 pointer-events-none" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")" }} />
      <div className="fixed top-20 left-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-20 right-20 w-80 h-80 bg-terracotta/10 rounded-full blur-3xl pointer-events-none" />

      {/* Sidebar Navigation */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 80 : 280 }}
        className="relative z-40 flex flex-col border-r border-white/10 frosted-glass h-screen sticky top-0"
      >
        <div className="p-4 flex items-center justify-between border-b border-white/10 h-16">
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="overflow-hidden whitespace-nowrap"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-terracotta flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-obsidian" />
                  </div>
                  <span className="font-space-grotesk font-bold text-ivory tracking-wide">COMMAND CENTER</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors text-ivory/70 hover:text-ivory"
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-hide">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link key={item.name} href={item.href}>
                <div
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all relative group ${
                    isActive
                      ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                      : "text-ivory/70 hover:bg-white/5 hover:text-ivory border border-transparent"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-indicator"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500 rounded-l-lg"
                    />
                  )}
                  <item.icon size={20} className={`shrink-0 ${isActive ? "text-amber-500" : ""}`} />
                  <AnimatePresence mode="wait">
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        className="font-medium whitespace-nowrap overflow-hidden"
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  
                  {isCollapsed && (
                    <div className="absolute left-full ml-4 px-3 py-1.5 rounded-md bg-obsidian border border-white/20 text-ivory text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                      {item.name}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* System Health Pulse Footer */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/5 border border-white/5 overflow-hidden">
            <div className="relative flex h-3 w-3 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sage opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-sage"></span>
            </div>
            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="overflow-hidden whitespace-nowrap flex flex-col"
                >
                  <span className="text-xs font-medium text-sage">System Healthy</span>
                  <span className="text-[10px] text-ivory/50">Ping: 12ms</span>
                </motion.div>
              )}
            </AnimatePresence>
            {isCollapsed && (
              <div className="absolute left-full ml-4 px-3 py-1.5 rounded-md bg-obsidian border border-white/20 text-ivory text-sm whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity z-50">
                System Healthy (12ms)
              </div>
            )}
          </div>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 relative z-30 h-screen overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

// Ensure AnimatePresence is imported
import { AnimatePresence } from "framer-motion";
