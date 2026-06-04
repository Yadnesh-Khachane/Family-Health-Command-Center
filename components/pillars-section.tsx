"use client"

import { motion } from "framer-motion"

const pillars = [
  {
    icon: "circles",
    title: "Families",
    description: "Weave your health story. Track everyone, everywhere, every record.",
  },
  {
    icon: "ascending",
    title: "Hospitals",
    description: "Access surgical intelligence. See what the patient's history is whispering.",
  },
  {
    icon: "shield",
    title: "Admins",
    description: "Orchestrate consent. Govern data. Protect the ecosystem.",
  },
]

function PillarIcon({ type }: { type: string }) {
  if (type === "circles") {
    return (
      <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="18" r="10" stroke="currentColor" strokeWidth="1.5" className="text-terracotta" />
        <circle cx="16" cy="30" r="10" stroke="currentColor" strokeWidth="1.5" className="text-amber/60" />
        <circle cx="32" cy="30" r="10" stroke="currentColor" strokeWidth="1.5" className="text-amber/60" />
      </svg>
    )
  }
  
  if (type === "ascending") {
    return (
      <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none">
        <path d="M12 36L24 12L36 36" stroke="currentColor" strokeWidth="1.5" className="text-terracotta" />
        <path d="M16 28L24 16L32 28" stroke="currentColor" strokeWidth="1.5" className="text-amber/60" />
        <path d="M20 22L24 18L28 22" stroke="currentColor" strokeWidth="1.5" className="text-amber/40" />
      </svg>
    )
  }
  
  if (type === "shield") {
    return (
      <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none">
        <path d="M24 6L38 12V24C38 32 32 40 24 44C16 40 10 32 10 24V12L24 6Z" stroke="currentColor" strokeWidth="1.5" className="text-terracotta" />
        <path d="M24 12L32 16V24C32 28 28 34 24 36C20 34 16 28 16 24V16L24 12Z" stroke="currentColor" strokeWidth="1.5" className="text-amber/60" />
        <circle cx="24" cy="24" r="4" stroke="currentColor" strokeWidth="1.5" className="text-amber/40" />
      </svg>
    )
  }
  
  return null
}

export function PillarsSection() {
  return (
    <section className="relative py-24 px-6 lg:px-12">
      <div className="container mx-auto max-w-6xl">
        <motion.h2 
          className="font-[family-name:var(--font-space-grotesk)] text-3xl sm:text-4xl lg:text-5xl font-bold text-center text-ivory mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Built for Three Pillars
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {pillars.map((pillar, index) => (
            <motion.div
              key={pillar.title}
              className="group relative glass-card rounded-xl p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-amber/5 border-l-2 border-l-transparent hover:border-l-terracotta"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <div className="mb-6">
                <PillarIcon type={pillar.icon} />
              </div>
              
              <h3 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-semibold text-ivory mb-3">
                {pillar.title}
              </h3>
              
              <p className="text-ivory/70 leading-relaxed">
                {pillar.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
