"use client"

import React, { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { 
  User, 
  Home, 
  Settings as SettingsIcon, 
  Bell, 
  Monitor, 
  Accessibility, 
  Shield, 
  Lock, 
  History, 
  LogOut,
  X,
  ChevronRight,
  Sun,
  Moon
} from "lucide-react"
import { StatusOrb } from "@/components/family/StatusOrb"

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [theme, setTheme] = useState<"dark" | "light">("dark")
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Detect screen size for responsive layouts (desktop vs mobile bottom sheet)
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen && !isMobile) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen, isMobile])

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark"
    setTheme(nextTheme)
    // In a real app we would update the document classList, but this is a mock:
    document.documentElement.classList.toggle("light", nextTheme === "light")
  }

  const handleLogout = () => {
    // Redirect to login page after a brief delay
    setIsOpen(false)
    window.location.href = "/login"
  }

  // Animation variants
  const desktopVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -10 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 20 }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95, 
      y: -10,
      transition: { duration: 0.15 }
    }
  }

  const mobileVariants = {
    hidden: { y: "100%" },
    visible: { 
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 25 }
    },
    exit: { 
      y: "100%",
      transition: { duration: 0.2 }
    }
  }

  const renderMenuContent = () => (
    <div className="space-y-4 max-h-[85vh] overflow-y-auto pr-1 select-none scrollbar-thin">
      {/* 1. PROFILE SECTION */}
      <div className="p-3 bg-white/5 rounded-2xl border border-white/5 space-y-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-terracotta to-amber flex items-center justify-center text-obsidian text-lg font-black font-heading">
              RS
            </div>
            <div className="absolute -bottom-1 -right-1 bg-charcoal rounded-full p-0.5 border border-white/10">
              <StatusOrb status="warning" className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <h4 className="font-heading font-bold text-white text-sm">Rajesh Sharma</h4>
            <p className="text-[10px] text-white/50">Household Administrator</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 pt-1">
          <Link href="/profile" onClick={() => setIsOpen(false)} className="w-full">
            <button className="w-full py-1.5 bg-white/5 hover:bg-white/10 border border-white/5 text-[10px] font-bold text-white uppercase tracking-wider rounded-lg transition-colors">
              Open Profile
            </button>
          </Link>
          <Link href="/settings" onClick={() => setIsOpen(false)} className="w-full">
            <button className="w-full py-1.5 bg-amber text-obsidian text-[10px] font-black uppercase tracking-wider rounded-lg transition-colors">
              Edit Settings
            </button>
          </Link>
        </div>
      </div>

      {/* 2. NAVIGATION */}
      <div className="space-y-1">
        <span className="text-[9px] uppercase tracking-wider font-bold text-white/30 px-2 block">
          Navigation
        </span>
        <div className="grid grid-cols-2 gap-1.5">
          <Link href="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-2 p-2 rounded-xl hover:bg-white/5 text-xs text-white/70 hover:text-white transition-colors border border-transparent hover:border-white/5">
            <User className="w-4 h-4 text-amber" />
            My Profile
          </Link>
          <Link href="/family/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-2 p-2 rounded-xl hover:bg-white/5 text-xs text-white/70 hover:text-white transition-colors border border-transparent hover:border-white/5">
            <Home className="w-4 h-4 text-terracotta" />
            Dashboard
          </Link>
          <Link href="/settings" onClick={() => setIsOpen(false)} className="flex items-center gap-2 p-2 rounded-xl hover:bg-white/5 text-xs text-white/70 hover:text-white transition-colors border border-transparent hover:border-white/5">
            <SettingsIcon className="w-4 h-4 text-blue-400" />
            Settings
          </Link>
          <Link href="/family/settings" onClick={() => setIsOpen(false)} className="flex items-center gap-2 p-2 rounded-xl hover:bg-white/5 text-xs text-white/70 hover:text-white transition-colors border border-transparent hover:border-white/5">
            <Bell className="w-4 h-4 text-success" />
            Notifications
          </Link>
        </div>
      </div>

      {/* 3. ACCOUNT SETTINGS */}
      <div className="space-y-1">
        <span className="text-[9px] uppercase tracking-wider font-bold text-white/30 px-2 block">
          Account &amp; Appearance
        </span>
        <div className="space-y-1">
          <button 
            onClick={toggleTheme}
            className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-white/5 text-xs text-white/70 hover:text-white transition-colors border border-transparent hover:border-white/5"
          >
            <div className="flex items-center gap-2">
              <Monitor className="w-4 h-4 text-amber" />
              <span>Theme Mode</span>
            </div>
            <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-white/50">
              {theme === "dark" ? <Moon className="w-3.5 h-3.5 text-amber" /> : <Sun className="w-3.5 h-3.5 text-amber" />}
              {theme}
            </span>
          </button>

          <Link href="/settings" onClick={() => setIsOpen(false)} className="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 text-xs text-white/70 hover:text-white transition-colors border border-transparent hover:border-white/5">
            <div className="flex items-center gap-2">
              <Accessibility className="w-4 h-4 text-purple-400" />
              <span>Accessibility Toggles</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-white/30" />
          </Link>
        </div>
      </div>

      {/* 4. SYSTEM UTILITIES */}
      <div className="space-y-1">
        <span className="text-[9px] uppercase tracking-wider font-bold text-white/30 px-2 block">
          System Integrity
        </span>
        <div className="grid grid-cols-3 gap-1 pt-1">
          <Link href="/settings" onClick={() => setIsOpen(false)} className="p-2 bg-white/5 border border-white/5 rounded-xl text-center hover:border-amber/20 transition-all">
            <Shield className="w-4.5 h-4.5 mx-auto text-success mb-1" />
            <span className="text-[9px] font-bold text-white/70 block">Security</span>
          </Link>
          <Link href="/family/settings" onClick={() => setIsOpen(false)} className="p-2 bg-white/5 border border-white/5 rounded-xl text-center hover:border-amber/20 transition-all">
            <Lock className="w-4.5 h-4.5 mx-auto text-terracotta mb-1" />
            <span className="text-[9px] font-bold text-white/70 block">Privacy</span>
          </Link>
          <Link href="/family/settings" onClick={() => setIsOpen(false)} className="p-2 bg-white/5 border border-white/5 rounded-xl text-center hover:border-amber/20 transition-all">
            <History className="w-4.5 h-4.5 mx-auto text-blue-400 mb-1" />
            <span className="text-[9px] font-bold text-white/70 block">Audits</span>
          </Link>
        </div>
      </div>

      {/* LOGOUT BUTTON */}
      <div className="pt-2 border-t border-white/5">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-destructive/10 border border-destructive/20 text-destructive hover:bg-destructive/15 hover:border-destructive/30 rounded-xl text-xs font-bold transition-all uppercase tracking-wider"
        >
          <LogOut className="w-4 h-4" />
          Sign Out of Command
        </button>
      </div>
    </div>
  )

  return (
    <div ref={dropdownRef} className="relative z-50">
      {/* Target Avatar click */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-9 h-9 rounded-full bg-amber/20 border border-amber/30 hover:border-amber/60 flex items-center justify-center cursor-pointer transition-all active:scale-95"
      >
        <span className="font-heading text-sm font-bold text-amber">RS</span>
      </button>

      {/* Dropdown container */}
      <AnimatePresence>
        {isOpen && (
          <>
            {isMobile ? (
              /* Mobile Bottom Sheet Drawer */
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsOpen(false)}
                  className="fixed inset-0 bg-black z-50"
                />
                <motion.div
                  variants={mobileVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="fixed bottom-0 left-0 right-0 rounded-t-3xl frosted-glass border-t border-white/10 p-6 z-50 shadow-2xl flex flex-col gap-4 bg-charcoal"
                >
                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <h3 className="font-heading font-black text-ivory text-base">Account Panel</h3>
                    <button 
                      onClick={() => setIsOpen(false)}
                      className="p-1 rounded-full bg-white/5 text-white/50 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  {renderMenuContent()}
                </motion.div>
              </>
            ) : (
              /* Desktop scale-fade popup menu */
              <motion.div
                variants={desktopVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="absolute right-0 mt-3.5 w-80 rounded-2xl frosted-panel border border-amber/10 p-4 shadow-2xl bg-charcoal/95 backdrop-blur-xl z-50"
              >
                {renderMenuContent()}
              </motion.div>
            )}
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
export default UserMenu
