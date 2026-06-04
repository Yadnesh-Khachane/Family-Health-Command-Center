"use client"

import { motion } from "framer-motion"
import { GeometricNodes } from "./geometric-nodes"

export function HeroSection() {
  const handleEnterClick = () => {
    window.location.href = "/login"
  }

  return (
    <section className="relative min-h-screen flex items-center hex-grid">
      <div className="container mx-auto px-6 lg:px-12 py-20 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
          {/* Left side - Content */}
          <motion.div 
            className="w-full lg:w-[60%] space-y-8"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="font-[family-name:var(--font-space-grotesk)] text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] tracking-tight text-ivory">
              {"Your Family's Health,"}
              <br />
              <span className="bg-gradient-to-r from-terracotta to-terracotta-dark bg-clip-text text-transparent">
                Woven
              </span>{" "}
              Together.
            </h1>
            
            <p className="font-sans text-lg sm:text-xl text-ivory/80 max-w-xl leading-relaxed">
              A living tapestry of medical history across generations.
              <br />
              Not a record keeper. A command center.
            </p>
            
            <div className="space-y-6">
              <motion.button
                onClick={handleEnterClick}
                className="px-8 py-4 bg-terracotta hover:bg-terracotta-dark text-white font-semibold rounded-full transition-colors duration-300 pulse-glow"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Enter Command Center
              </motion.button>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <p className="text-sm text-ivory/60">
                  Trusted by 12,000+ families across 340 hospitals
                </p>
                <div className="flex gap-2">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-md glass-card"
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Right side - Geometric decoration */}
          <motion.div 
            className="w-full lg:w-[40%] flex justify-center items-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          >
            <GeometricNodes />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
