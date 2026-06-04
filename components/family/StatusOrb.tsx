"use client"

import React from "react"
import { HealthStatus } from "@/types/family"

interface StatusOrbProps {
  status: HealthStatus
  className?: string
}

export function StatusOrb({ status, className = "" }: StatusOrbProps) {
  if (status === "critical") {
    return (
      <div 
        className={`w-3.5 h-3.5 rounded-full bg-destructive critical-blink ${className}`} 
        title="Critical Notice Active"
      />
    )
  }
  if (status === "warning") {
    return (
      <div 
        className={`w-3.5 h-3.5 rounded-full bg-warning warning-pulse ${className}`} 
        title="Warning Notice Active"
      />
    )
  }
  return (
    <div 
      className={`w-3.5 h-3.5 rounded-full bg-success ${className}`} 
      title="Status Healthy"
    />
  )
}
