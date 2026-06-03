"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

// Hardcoded patient data for search
const allPatients = [
  { id: "sharma-gayatri", name: "Gayatri Sharma", family: "Sharma Family" },
  { id: "sharma-rajiv", name: "Rajiv Sharma", family: "Sharma Family" },
  { id: "sharma-priya", name: "Priya Sharma", family: "Sharma Family" },
  { id: "sharma-arjun", name: "Arjun Sharma", family: "Sharma Family" },
  { id: "gupta-rajesh", name: "Rajesh Gupta", family: "Gupta Family" },
  { id: "gupta-sunita", name: "Sunita Gupta", family: "Gupta Family" },
  { id: "patel-meena", name: "Meena Patel", family: "Patel Family" },
  { id: "patel-vikram", name: "Vikram Patel", family: "Patel Family" },
  { id: "singh-amit", name: "Amit Singh", family: "Singh Family" },
];

// Emergency intake requests
const emergencyIntake = [
  {
    id: "sharma-gayatri",
    family: "The Sharma Family",
    patient: "Gayatri Sharma",
    status: "ready",
    time: "8 min ago",
  },
  {
    id: "gupta-rajesh",
    family: "The Gupta Family",
    patient: "Rajesh Gupta",
    status: "ready",
    time: "23 min ago",
  },
  {
    id: "patel-meena",
    family: "The Patel Family",
    patient: "Meena Patel",
    status: "generating",
    time: "1 min ago",
  },
];

// Surgical advisory queue
const surgicalQueue = [
  {
    id: "sharma-gayatri",
    patient: "Gayatri Sharma",
    surgery: "Hip Revision Surgery",
    riskScore: 78,
    scheduled: "Dec 15, 2026",
    details: {
      adhesionRisk: "High risk due to previous hip replacement (2019) and subsequent revision (2022). Scar tissue density estimated at 4.2mm based on last MRI.",
      recommendations: [
        "Pre-op adhesiolysis consultation recommended",
        "Consider laparoscopic approach if feasible",
        "Extended OR time allocation (est. 4.5 hrs)",
        "Post-op ICU bed reservation advised",
      ],
    },
  },
  {
    id: "singh-amit",
    patient: "Amit Singh",
    surgery: "Abdominal Surgery",
    riskScore: 45,
    scheduled: "Dec 22, 2026",
    details: {
      adhesionRisk: "Moderate risk. Patient has history of appendectomy (2018). No previous complications noted.",
      recommendations: [
        "Standard pre-op protocol sufficient",
        "Standard OR time allocation (est. 2.5 hrs)",
        "Regular ward post-op monitoring",
      ],
    },
  },
];

// Post-op cognitive surveillance
const postOpPatients = [
  {
    name: "Sunita Verma",
    surgeryDate: "Nov 28, 2026",
    trend: "up",
    status: "normal",
    data: [40, 45, 50, 55, 62, 68, 72],
  },
  {
    name: "Mohan Desai",
    surgeryDate: "Nov 25, 2026",
    trend: "flat",
    status: "monitor",
    data: [65, 64, 66, 65, 64, 65, 66],
  },
  {
    name: "Lakshmi Nair",
    surgeryDate: "Nov 30, 2026",
    trend: "down",
    status: "normal",
    data: [80, 78, 75, 72, 70, 68, 65],
  },
];

// Polypharmacy alerts
const polypharmacyAlerts = [
  {
    family: "Sharma Family",
    alert: "Beta-blocker + ADHD stimulant interaction risk",
  },
  {
    family: "Verma Family",
    alert: "Warfarin + NSAID overlap detected",
  },
];

// Vaccine gap data
const vaccineGaps = [
  { area: "West District", percentage: 23 },
  { area: "East Colony", percentage: 17 },
];

export default function HospitalDashboard() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [expandedSurgery, setExpandedSurgery] = useState<string | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Filter patients based on search
  const filteredPatients = searchQuery.length > 0
    ? allPatients.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.family.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // Close search dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Mini sparkline component
  const Sparkline = ({ data, trend }: { data: number[]; trend: string }) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const points = data
      .map((v, i) => {
        const x = (i / (data.length - 1)) * 60;
        const y = 20 - ((v - min) / range) * 16;
        return `${x},${y}`;
      })
      .join(" ");

    return (
      <svg width="60" height="24" className="inline-block">
        <polyline
          points={points}
          fill="none"
          stroke={trend === "down" ? "var(--amber)" : "var(--amber)"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-obsidian hex-grid relative overflow-hidden">
      {/* Background effects */}
      <div className="ambient-glow-top" />
      <div className="ambient-glow-bottom" />
      <div className="noise-overlay" />

      {/* Top Bar */}
      <header className="frosted-glass fixed top-0 left-0 right-0 h-16 z-50 flex items-center justify-between px-6">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-terracotta to-amber flex items-center justify-center">
            <span className="font-heading text-white text-lg font-bold">F</span>
          </div>
          <span className="font-heading text-ivory text-lg tracking-tight">
            Apollo Medical Center
          </span>
        </Link>

        {/* Center: Search */}
        <div ref={searchRef} className="relative w-[500px]">
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              placeholder="Search patients, families, or records..."
              className="w-full h-11 pl-12 pr-4 rounded-xl bg-charcoal/60 border border-amber/20 text-ivory placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber/50 focus:border-amber/40 transition-all"
            />
          </div>

          {/* Search Dropdown */}
          <AnimatePresence>
            {searchFocused && filteredPatients.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full mt-2 w-full frosted-panel rounded-xl overflow-hidden"
              >
                {filteredPatients.map((patient) => (
                  <button
                    key={patient.id}
                    onClick={() => {
                      router.push(`/hospital/patient/${patient.id}`);
                      setSearchQuery("");
                      setSearchFocused(false);
                    }}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-amber/10 transition-colors text-left"
                  >
                    <div>
                      <p className="text-ivory font-medium">{patient.name}</p>
                      <p className="text-muted-foreground text-sm">
                        {patient.family}
                      </p>
                    </div>
                    <svg
                      className="w-4 h-4 text-muted-foreground"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Notifications + Avatar */}
        <div className="flex items-center gap-4">
          <button className="relative p-2 rounded-lg hover:bg-amber/10 transition-colors">
            <svg
              className="w-6 h-6 text-ivory"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-terracotta rounded-full text-xs text-white flex items-center justify-center font-medium">
              5
            </span>
          </button>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber to-terracotta flex items-center justify-center">
            <span className="font-heading text-white text-sm font-bold">
              AMC
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-8 px-8">
        <div className="max-w-[1600px] mx-auto flex gap-8">
          {/* Left Column - Patient Intelligence Feed (60%) */}
          <div className="flex-[3] space-y-8">
            <h1 className="font-heading text-2xl text-ivory shimmer-text">
              Patient Intelligence Feed
            </h1>

            {/* Section 1: Emergency Intake Requests */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-6 bg-amber rounded-full" />
                <h2 className="font-heading text-lg text-ivory">
                  Emergency Intake Requests
                </h2>
              </div>
              <div className="space-y-3 max-h-[280px] overflow-y-auto pr-2 scrollbar-thin">
                {emergencyIntake.map((intake, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="frosted-panel rounded-xl p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-ivory font-medium">
                          {intake.family} —{" "}
                          <span className="text-amber">{intake.patient}</span>
                        </p>
                        <p className="text-muted-foreground text-sm">
                          {intake.time}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {intake.status === "ready" ? (
                        <>
                          <span className="px-3 py-1 rounded-full bg-success/20 text-success text-sm font-medium">
                            Handoff Ready
                          </span>
                          <button
                            onClick={() =>
                              router.push(`/hospital/patient/${intake.id}`)
                            }
                            className="px-4 py-2 rounded-lg bg-terracotta hover:bg-terracotta-dark text-white text-sm font-medium transition-colors"
                          >
                            View
                          </button>
                        </>
                      ) : (
                        <>
                          <span className="px-3 py-1 rounded-full bg-amber/20 text-amber text-sm font-medium warning-pulse">
                            Generating...
                          </span>
                          <button
                            disabled
                            className="px-4 py-2 rounded-lg bg-charcoal text-muted-foreground text-sm font-medium cursor-not-allowed"
                          >
                            View
                          </button>
                        </>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Section 2: Surgical Advisory Queue */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-6 bg-amber rounded-full" />
                <h2 className="font-heading text-lg text-ivory">
                  Surgical Advisory Queue
                </h2>
              </div>
              <div className="space-y-3">
                {surgicalQueue.map((surgery, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 + 0.3 }}
                    className="frosted-panel rounded-xl overflow-hidden"
                  >
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-ivory font-medium">
                          {surgery.patient} —{" "}
                          <span className="text-amber">{surgery.surgery}</span>
                        </p>
                        <p className="text-muted-foreground text-sm mt-1">
                          Scheduled: {surgery.scheduled}
                        </p>
                        {/* Risk Score Bar */}
                        <div className="mt-3 flex items-center gap-3">
                          <span className="text-sm text-muted-foreground">
                            Adhesion Risk:
                          </span>
                          <div className="flex-1 max-w-[200px] h-2 rounded-full bg-charcoal overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${surgery.riskScore}%`,
                                background: `linear-gradient(90deg, var(--amber) 0%, ${
                                  surgery.riskScore > 60
                                    ? "var(--destructive)"
                                    : "var(--amber)"
                                } 100%)`,
                              }}
                            />
                          </div>
                          <span
                            className={`text-sm font-medium ${
                              surgery.riskScore > 60
                                ? "text-destructive"
                                : "text-amber"
                            }`}
                          >
                            {surgery.riskScore}/100
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          setExpandedSurgery(
                            expandedSurgery === surgery.id ? null : surgery.id
                          )
                        }
                        className="px-4 py-2 rounded-lg border border-amber/30 text-amber hover:bg-amber/10 text-sm font-medium transition-colors"
                      >
                        {expandedSurgery === surgery.id ? "Close" : "Review"}
                      </button>
                    </div>

                    {/* Expanded Details */}
                    <AnimatePresence>
                      {expandedSurgery === surgery.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t border-amber/10 overflow-hidden"
                        >
                          <div className="p-4 bg-charcoal/30">
                            <p className="text-ivory text-sm mb-3">
                              {surgery.details.adhesionRisk}
                            </p>
                            <div className="space-y-2">
                              <p className="text-amber text-sm font-medium">
                                Recommendations:
                              </p>
                              <ul className="space-y-1">
                                {surgery.details.recommendations.map(
                                  (rec, i) => (
                                    <li
                                      key={i}
                                      className="text-muted-foreground text-sm flex items-start gap-2"
                                    >
                                      <span className="text-success mt-0.5">
                                        •
                                      </span>
                                      {rec}
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Section 3: Post-Op Cognitive Surveillance */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-6 bg-amber rounded-full" />
                <h2 className="font-heading text-lg text-ivory">
                  Post-Op Cognitive Surveillance
                </h2>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {postOpPatients.map((patient, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 + 0.6 }}
                    className="frosted-panel rounded-xl p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-ivory font-medium text-sm">
                        {patient.name}
                      </p>
                      <div
                        className={`w-2 h-2 rounded-full ${
                          patient.status === "normal"
                            ? "bg-success"
                            : "bg-amber warning-pulse"
                        }`}
                      />
                    </div>
                    <p className="text-muted-foreground text-xs mb-3">
                      Surgery: {patient.surgeryDate}
                    </p>
                    <div className="flex items-center justify-between">
                      <Sparkline data={patient.data} trend={patient.trend} />
                      <span className="text-muted-foreground text-xs">
                        {patient.trend === "up"
                          ? "Improving"
                          : patient.trend === "down"
                          ? "Declining"
                          : "Stable"}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column - Population Lens (40%) */}
          <div className="flex-[2] space-y-6">
            <h2 className="font-heading text-xl text-ivory">Population Lens</h2>

            {/* Catchment Symptom Clusters */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="frosted-panel rounded-xl p-5"
            >
              <h3 className="font-heading text-ivory mb-4">
                Catchment Symptom Clusters
              </h3>
              {/* Abstract heatmap using CSS */}
              <div className="relative h-48 rounded-lg bg-charcoal/50 overflow-hidden">
                {/* Hospital marker */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-ivory rounded-full z-10" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 border-2 border-ivory/50 rounded-full z-10" />

                {/* Heatmap blobs */}
                <div className="absolute top-[30%] left-[25%] w-24 h-24 rounded-full bg-amber/30 blur-xl" />
                <div className="absolute top-[45%] left-[35%] w-16 h-16 rounded-full bg-amber/40 blur-lg" />
                <div className="absolute top-[55%] left-[60%] w-20 h-20 rounded-full bg-terracotta/25 blur-xl" />
                <div className="absolute top-[25%] left-[65%] w-14 h-14 rounded-full bg-amber/35 blur-lg" />
                <div className="absolute top-[70%] left-[30%] w-12 h-12 rounded-full bg-terracotta/30 blur-lg" />
                <div className="absolute top-[40%] left-[70%] w-10 h-10 rounded-full bg-amber/25 blur-md" />

                {/* Grid overlay */}
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage:
                      "linear-gradient(var(--amber) 1px, transparent 1px), linear-gradient(90deg, var(--amber) 1px, transparent 1px)",
                    backgroundSize: "20px 20px",
                  }}
                />
              </div>
              <p className="text-muted-foreground text-sm mt-3">
                Respiratory symptoms concentrated in West District
              </p>
            </motion.div>

            {/* Vaccine Gap Neighborhoods */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="frosted-panel rounded-xl p-5"
            >
              <h3 className="font-heading text-ivory mb-4">
                Vaccine Gap Neighborhoods
              </h3>
              <div className="space-y-3">
                {vaccineGaps.map((gap, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-lg bg-charcoal/40"
                  >
                    <span className="text-ivory">{gap.area}</span>
                    <span className="text-amber font-medium">
                      {gap.percentage}% under-protected
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Polypharmacy Household Alerts */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="frosted-panel rounded-xl p-5"
            >
              <h3 className="font-heading text-ivory mb-4">
                Polypharmacy Household Alerts
              </h3>
              <div className="space-y-3">
                {polypharmacyAlerts.map((alert, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-destructive/10 border border-destructive/20"
                  >
                    <p className="text-ivory font-medium text-sm">
                      {alert.family}
                    </p>
                    <p className="text-destructive text-sm mt-1">
                      {alert.alert}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
