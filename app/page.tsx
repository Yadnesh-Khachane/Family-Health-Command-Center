"use client"

import { HeroSection } from "@/components/hero-section"
import { PillarsSection } from "@/components/pillars-section"
import { TrustFooter } from "@/components/trust-footer"

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      {/* Noise overlay */}
      <div className="noise-overlay" />
      
      {/* Ambient glow orbs */}
      <div className="ambient-glow-top" />
      <div className="ambient-glow-bottom" />
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* How It Works / Pillars Section */}
      <PillarsSection />
      
      {/* Trust Footer */}
      <TrustFooter />
    </main>
  )
}
