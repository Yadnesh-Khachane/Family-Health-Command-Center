"use client"

import React, { useEffect } from "react"
import Link from "next/link"
import { AlertOctagon, RefreshCw } from "lucide-react"

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function FamilyError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Family Module Error Boundary:", error)
  }, [error])

  return (
    <div className="w-full h-[80vh] flex flex-col items-center justify-center space-y-6 text-center px-6 select-none">
      <div className="noise-overlay" />
      
      <div className="w-16 h-16 rounded-full bg-destructive/10 border border-destructive/30 flex items-center justify-center text-destructive animate-bounce">
        <AlertOctagon className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold text-white">
          Decryption Failure / Care Bridge Interrupted
        </h2>
        <p className="text-xs text-white/50 max-w-sm mx-auto leading-relaxed">
          The security channel encountered a transmission signature anomaly or local data synchronization block.
        </p>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="px-5 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-bold uppercase tracking-wider rounded-full transition-colors flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Retry Connection
        </button>
        <Link href="/family/dashboard">
          <button className="px-5 py-2.5 bg-terracotta hover:bg-terracotta-dark text-white text-xs font-bold uppercase tracking-wider rounded-full transition-colors">
            Return to Command Center
          </button>
        </Link>
      </div>
    </div>
  )
}
