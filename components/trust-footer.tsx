"use client"

import { motion } from "framer-motion"

const badges = [
  "HIPAA Compliant",
  "SOC 2 Certified",
  "Zero-Knowledge Encryption",
]

const links = [
  { label: "About", href: "/about" },
  { label: "Privacy", href: "/privacy" },
  { label: "Contact", href: "/contact" },
]

export function TrustFooter() {
  return (
    <footer className="relative py-16 px-6 lg:px-12 border-t border-amber/10">
      <div className="container mx-auto max-w-4xl text-center space-y-8">
        <motion.p
          className="text-ivory/80 text-lg"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          End-to-end encrypted. Consent-gated. Zero-trust architecture.
        </motion.p>
        
        <motion.div
          className="flex flex-wrap justify-center gap-3"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {badges.map((badge) => (
            <span
              key={badge}
              className="px-4 py-2 rounded-full text-sm font-medium glass-card text-ivory/90"
            >
              {badge}
            </span>
          ))}
        </motion.div>
        
        <motion.div
          className="flex justify-center gap-6 pt-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {links.map((link, index) => (
            <span key={link.label} className="flex items-center gap-6">
              <a
                href={link.href}
                className="text-sm text-ivory/60 hover:text-terracotta transition-colors duration-200"
              >
                {link.label}
              </a>
              {index < links.length - 1 && (
                <span className="text-ivory/20">|</span>
              )}
            </span>
          ))}
        </motion.div>
      </div>
    </footer>
  )
}
