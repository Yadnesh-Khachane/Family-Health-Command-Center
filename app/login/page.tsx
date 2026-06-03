"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"

type EntityType = "family" | "hospital" | "admin" | null

interface EntityConfig {
  id: EntityType
  title: string
  description: string
  buttonText: string
  route: string
  seedEmail: string
  seedPassword: string
  registerText: string
}

const entities: EntityConfig[] = [
  {
    id: "family",
    title: "Families",
    description: "Access your family health command center",
    buttonText: "Login as Family",
    route: "/family/dashboard",
    seedEmail: "sharma@family.com",
    seedPassword: "password",
    registerText: "Family",
  },
  {
    id: "hospital",
    title: "Hospitals",
    description: "Access patient intelligence and surgical advisory",
    buttonText: "Login as Hospital",
    route: "/hospital/dashboard",
    seedEmail: "apollo@hospital.com",
    seedPassword: "password",
    registerText: "Hospital",
  },
  {
    id: "admin",
    title: "Admins",
    description: "Govern data, consent, and system integrity",
    buttonText: "Login as Admin",
    route: "/admin/dashboard",
    seedEmail: "admin@fhcc.com",
    seedPassword: "password",
    registerText: "Admin Account",
  },
]

function EntityIcon({ type, selected }: { type: EntityType; selected: boolean }) {
  const baseClass = `w-12 h-12 transition-colors duration-300 ${selected ? "text-terracotta" : "text-ivory/60"}`
  
  if (type === "family") {
    return (
      <svg viewBox="0 0 48 48" fill="none" className={baseClass}>
        <circle cx="18" cy="24" r="10" stroke="currentColor" strokeWidth="2" />
        <circle cx="30" cy="24" r="10" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  
  if (type === "hospital") {
    return (
      <svg viewBox="0 0 48 48" fill="none" className={baseClass}>
        <rect x="8" y="32" width="8" height="12" stroke="currentColor" strokeWidth="2" />
        <rect x="20" y="24" width="8" height="20" stroke="currentColor" strokeWidth="2" />
        <rect x="32" y="16" width="8" height="28" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  
  if (type === "admin") {
    return (
      <svg viewBox="0 0 48 48" fill="none" className={baseClass}>
        <path d="M24 4L40 12V24C40 34 32 42 24 44C16 42 8 34 8 24V12L24 4Z" stroke="currentColor" strokeWidth="2" />
        <circle cx="24" cy="22" r="6" stroke="currentColor" strokeWidth="2" />
        <circle cx="24" cy="22" r="10" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.5" />
      </svg>
    )
  }
  
  return null
}

function FluidAnimation({ isPulsing }: { isPulsing: boolean }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Frosted glass overlay */}
      <div className="absolute inset-0 bg-charcoal/40 backdrop-blur-xl z-10" />
      
      {/* Fluid shapes */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-gradient-to-br from-terracotta/40 to-amber/30 blur-3xl"
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -40, 20, 0],
          scale: isPulsing ? [1, 1.15, 1] : [1, 1.05, 1],
        }}
        transition={{
          duration: isPulsing ? 1.5 : 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-gradient-to-tl from-amber/30 to-terracotta/20 blur-3xl"
        animate={{
          x: [0, -40, 30, 0],
          y: [0, 30, -30, 0],
          scale: isPulsing ? [1, 1.2, 1] : [1, 1.08, 1],
        }}
        transition={{
          duration: isPulsing ? 1.5 : 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-r from-terracotta/25 via-amber/20 to-terracotta/25 blur-3xl"
        animate={{
          rotate: [0, 180, 360],
          scale: isPulsing ? [1, 1.1, 1] : [1, 1.03, 1],
        }}
        transition={{
          duration: isPulsing ? 2 : 15,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  )
}

export default function LoginPage() {
  const router = useRouter()
  const [selectedEntity, setSelectedEntity] = useState<EntityType>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [isTyping, setIsTyping] = useState(false)

  // Update seed credentials when entity is selected
  useEffect(() => {
    if (selectedEntity) {
      const entity = entities.find((e) => e.id === selectedEntity)
      if (entity) {
        setEmail(entity.seedEmail)
        setPassword(entity.seedPassword)
      }
    } else {
      setEmail("")
      setPassword("")
    }
    setErrors({})
  }, [selectedEntity])

  // Handle typing pulse effect
  useEffect(() => {
    if (isTyping) {
      const timer = setTimeout(() => setIsTyping(false), 500)
      return () => clearTimeout(timer)
    }
  }, [isTyping])

  const handleInputChange = (setter: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setter(e.target.value)
    setIsTyping(true)
    setErrors({})
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: { email?: string; password?: string } = {}
    
    if (!email.trim()) newErrors.email = "Required"
    if (!password.trim()) newErrors.password = "Required"
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    const entity = entities.find((ent) => ent.id === selectedEntity)
    if (entity) {
      router.push(entity.route)
    }
  }

  const handleCardClick = (entityId: EntityType) => {
    if (selectedEntity === entityId) {
      setSelectedEntity(null)
    } else {
      setSelectedEntity(entityId)
    }
  }

  return (
    <main className="relative min-h-screen flex overflow-hidden">
      {/* Noise overlay */}
      <div className="noise-overlay" />
      
      {/* Ambient glow orbs */}
      <div className="ambient-glow-top" />
      <div className="ambient-glow-bottom" />

      {/* Left side - Login content (60%) */}
      <div className="relative z-10 w-full lg:w-[60%] min-h-screen flex flex-col justify-center px-6 md:px-12 lg:px-16 py-12">
        {/* Back link */}
        <Link
          href="/"
          className="absolute top-6 left-6 md:left-12 lg:left-16 text-sm text-ivory/60 hover:text-terracotta transition-colors"
        >
          ← Back to Home
        </Link>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="font-[family-name:var(--font-space-grotesk)] text-4xl md:text-5xl lg:text-6xl font-bold text-ivory leading-tight">
            Welcome back
            <br />
            <span className="text-ivory/90">to the Command Center.</span>
          </h1>
        </motion.div>

        {/* Login cards */}
        <div className="space-y-4 max-w-xl">
          {entities.map((entity, index) => {
            const isSelected = selectedEntity === entity.id
            const isOtherSelected = selectedEntity !== null && !isSelected

            return (
              <motion.div
                key={entity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <motion.div
                  className={`glass-card rounded-2xl p-6 cursor-pointer transition-all duration-300 ${
                    isSelected ? "border-terracotta" : ""
                  }`}
                  style={{
                    opacity: isOtherSelected ? 0.4 : 1,
                    borderColor: isSelected ? "var(--terracotta)" : undefined,
                  }}
                  animate={{
                    scale: isSelected ? 1.02 : 1,
                  }}
                  onClick={() => handleCardClick(entity.id)}
                >
                  <div className="flex items-start gap-4">
                    <EntityIcon type={entity.id} selected={isSelected} />
                    <div className="flex-1">
                      <h3 className="font-[family-name:var(--font-space-grotesk)] text-xl font-semibold text-ivory mb-1">
                        {entity.title}
                      </h3>
                      <p className="text-ivory/60 text-sm mb-4">{entity.description}</p>
                      
                      {!isSelected && (
                        <button
                          type="button"
                          className="px-6 py-2.5 border border-terracotta text-terracotta rounded-full text-sm font-medium hover:bg-terracotta hover:text-white transition-all duration-300"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedEntity(entity.id)
                          }}
                        >
                          {entity.buttonText}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Expanded form */}
                  <AnimatePresence>
                    {isSelected && (
                      <motion.form
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        onSubmit={handleSubmit}
                        className="mt-6 pt-6 border-t border-amber/10 overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="space-y-4">
                          <div>
                            <input
                              type="email"
                              placeholder="Email"
                              value={email}
                              onChange={handleInputChange(setEmail)}
                              className={`w-full px-4 py-3 rounded-xl bg-obsidian border text-ivory placeholder:text-ivory/40 focus:outline-none transition-colors ${
                                errors.email
                                  ? "border-terracotta"
                                  : "border-amber/10 focus:border-amber focus:ring-2 focus:ring-amber/20"
                              }`}
                            />
                            {errors.email && (
                              <p className="text-terracotta text-xs mt-1">{errors.email}</p>
                            )}
                          </div>
                          <div>
                            <input
                              type="password"
                              placeholder="Password"
                              value={password}
                              onChange={handleInputChange(setPassword)}
                              className={`w-full px-4 py-3 rounded-xl bg-obsidian border text-ivory placeholder:text-ivory/40 focus:outline-none transition-colors ${
                                errors.password
                                  ? "border-terracotta"
                                  : "border-amber/10 focus:border-amber focus:ring-2 focus:ring-amber/20"
                              }`}
                            />
                            {errors.password && (
                              <p className="text-terracotta text-xs mt-1">{errors.password}</p>
                            )}
                          </div>
                          <button
                            type="submit"
                            className="w-full py-3 bg-terracotta hover:bg-terracotta-dark text-white font-semibold rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-amber/20"
                          >
                            Sign In
                          </button>
                          <div className="text-center space-y-2">
                            <button
                              type="button"
                              className="text-amber text-sm hover:text-amber/80 transition-colors"
                            >
                              Forgot password?
                            </button>
                            <p className="text-ivory/60 text-sm">
                              {"Don't have an account? "}
                              <button type="button" className="text-ivory hover:text-terracotta transition-colors">
                                Register your {entity.registerText}
                              </button>
                            </p>
                          </div>
                        </div>
                      </motion.form>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Right side - Fluid animation (40%) */}
      <div className="hidden lg:block w-[40%] relative">
        <FluidAnimation isPulsing={isTyping} />
      </div>
    </main>
  )
}
