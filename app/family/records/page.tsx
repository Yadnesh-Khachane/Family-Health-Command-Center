"use client"

import React, { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { 
  ArrowLeft, 
  FileText, 
  Search, 
  Download, 
  Upload, 
  Plus, 
  File, 
  CheckCircle,
  X,
  Trash2
} from "lucide-react"

import { medicalRecords, familyMembers } from "@/lib/mock-data/mockData"
import { MedicalRecord, EventCategory } from "@/types/family"
import { fadeInUp, staggerContainer } from "@/components/family/animations"

const categoriesList: { key: EventCategory | "all"; label: string }[] = [
  { key: "all", label: "All Records" },
  { key: "imaging", label: "Imaging" },
  { key: "labs", label: "Lab Reports" },
  { key: "surgery", label: "Surgical Files" },
  { key: "medication", label: "Prescriptions" }
]

export default function RecordsPage() {
  const [records, setRecords] = useState<MedicalRecord[]>(medicalRecords)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | "all">("all")
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<number | null>(null)
  
  // New file input state
  const [newTitle, setNewTitle] = useState("")
  const [newFileName, setNewFileName] = useState("")
  const [newCategory, setNewCategory] = useState<EventCategory>("labs")
  const [newDoctor, setNewDoctor] = useState("")
  const [newHospital, setNewHospital] = useState("")

  // Filter records
  const filteredRecords = records.filter(rec => {
    const matchSearch = 
      searchQuery === "" || 
      rec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.hospitalName.toLowerCase().includes(searchQuery.toLowerCase())

    const matchCat = selectedCategory === "all" || rec.category === selectedCategory

    return matchSearch && matchCat
  })

  // Simulated upload handler
  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle || !newFileName) return

    setUploadProgress(10)
    
    // Simulate loading bar
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev === null) return null
        if (prev >= 100) {
          clearInterval(interval)
          // Add record
          const newRecord: MedicalRecord = {
            id: `r-${Date.now()}`,
            title: newTitle,
            category: newCategory,
            fileName: newFileName,
            fileSize: "1.5 MB",
            uploadedBy: "Rajesh Sharma (Self)",
            uploadedAt: new Date().toISOString().split("T")[0],
            doctorName: newDoctor || "Unassigned Physician",
            hospitalName: newHospital || "Self Logged",
            notes: "Uploaded by family coordinator."
          }
          setRecords(prevRecs => [newRecord, ...prevRecs])
          setUploadProgress(null)
          setShowUploadModal(false)
          // Reset fields
          setNewTitle("")
          setNewFileName("")
          setNewDoctor("")
          setNewHospital("")
          return null
        }
        return prev + 30
      })
    }, 200)
  }

  // Delete record handler
  const handleDelete = (id: string) => {
    setRecords(prev => prev.filter(r => r.id !== id))
  }

  return (
    <main className="max-w-[1200px] mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Link href="/family/dashboard" className="flex items-center gap-2 text-xs text-ivory/60 hover:text-amber font-semibold uppercase tracking-wider transition-colors mb-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="font-[family-name:var(--font-space-grotesk)] text-2xl md:text-3xl font-extrabold text-ivory tracking-tight">
            Family Medical Records
          </h1>
        </div>

        <button 
          onClick={() => setShowUploadModal(true)}
          className="px-5 py-2.5 rounded-full bg-terracotta text-white font-semibold text-xs uppercase tracking-wider hover:bg-terracotta-dark transition-colors flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Upload Record
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="frosted-panel rounded-2xl p-5 border border-white/5 grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative md:col-span-2">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ivory/40" />
          <input
            type="text"
            placeholder="Search records by title, doctor, facility..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-xl bg-obsidian border border-white/5 text-xs text-ivory placeholder:text-ivory/40 focus:outline-none focus:border-amber/40 transition-colors"
          />
        </div>

        {/* Category select */}
        <div>
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value as EventCategory | "all")}
            className="w-full h-10 px-3 rounded-xl bg-obsidian border border-white/5 text-xs text-ivory focus:outline-none focus:border-amber/40 transition-colors"
          >
            {categoriesList.map(cat => (
              <option key={cat.key} value={cat.key}>{cat.label}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center text-xs text-ivory/50 gap-2 justify-end">
          <span>{filteredRecords.length} records archived</span>
        </div>
      </div>

      {/* Records grid layout */}
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredRecords.map((rec) => (
          <motion.div 
            key={rec.id}
            variants={fadeInUp}
            className="frosted-panel rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-colors flex flex-col justify-between h-56"
          >
            <div>
              <div className="flex justify-between items-start">
                <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                  <File className="w-5 h-5 text-amber" />
                </div>
                <span className="text-[9px] bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-ivory/60 font-semibold uppercase tracking-wider">
                  {rec.category}
                </span>
              </div>
              <h4 className="font-[family-name:var(--font-space-grotesk)] text-sm font-bold text-white mt-3 truncate">
                {rec.title}
              </h4>
              <p className="text-[11px] text-white/50 truncate mt-1">{rec.fileName} • {rec.fileSize}</p>
              <p className="text-[10px] text-ivory/40 mt-3">Uploaded: {rec.uploadedAt} by {rec.uploadedBy}</p>
            </div>

            <div className="flex justify-between items-center border-t border-white/5 pt-3 mt-4 text-[10px] text-white/55">
              <span>{rec.doctorName} ({rec.hospitalName})</span>
              <div className="flex items-center gap-2">
                <button className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-ivory/60 hover:text-ivory transition-colors">
                  <Download className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(rec.id)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-destructive/10 text-ivory/40 hover:text-destructive transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {filteredRecords.length === 0 && (
          <div className="col-span-full text-center py-20 text-ivory/40 text-xs">
            <File className="w-10 h-10 mx-auto mb-3 stroke-1" />
            No records matched your search query.
          </div>
        )}
      </motion.div>

      {/* Upload Record Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setShowUploadModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="frosted-panel rounded-2xl p-6 w-full max-w-md border border-white/10 bg-[#0F0F0F]"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center pb-4 border-b border-white/5 mb-4">
                <h3 className="font-[family-name:var(--font-space-grotesk)] text-base font-bold text-white">Upload New Case Document</h3>
                <button onClick={() => setShowUploadModal(false)} className="p-1 rounded-full hover:bg-white/5">
                  <X className="w-5 h-5 text-ivory/60" />
                </button>
              </div>

              {uploadProgress !== null ? (
                <div className="py-12 flex flex-col items-center justify-center space-y-4">
                  <Upload className="w-10 h-10 text-amber animate-bounce" />
                  <div className="w-full max-w-[250px] h-2 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full bg-amber transition-all duration-200" style={{ width: `${uploadProgress}%` }} />
                  </div>
                  <span className="text-xs text-white/55">Uploading file to encrypted vault... {uploadProgress}%</span>
                </div>
              ) : (
                <form onSubmit={handleUpload} className="space-y-4">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-white/40 block mb-1">Record Title</label>
                    <input
                      type="text"
                      required
                      value={newTitle}
                      onChange={e => setNewTitle(e.target.value)}
                      placeholder="e.g. Grandma Lung X-Ray Report"
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-ivory focus:outline-none focus:border-amber/40"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-white/40 block mb-1">File Name</label>
                    <input
                      type="text"
                      required
                      value={newFileName}
                      onChange={e => setNewFileName(e.target.value)}
                      placeholder="e.g. lung_scan_june2026.pdf"
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-ivory focus:outline-none focus:border-amber/40"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-white/40 block mb-1">Record Category</label>
                    <select
                      value={newCategory}
                      onChange={e => setNewCategory(e.target.value as EventCategory)}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-ivory focus:outline-none focus:border-amber/40"
                    >
                      <option value="labs">Lab Report</option>
                      <option value="imaging">Imaging (X-Ray / MRI)</option>
                      <option value="surgery">Surgical Clearance</option>
                      <option value="medication">Prescription Sheet</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-white/40 block mb-1">Doctor Name</label>
                      <input
                        type="text"
                        value={newDoctor}
                        onChange={e => setNewDoctor(e.target.value)}
                        placeholder="Dr. Mehta"
                        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-ivory focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-white/40 block mb-1">Hospital</label>
                      <input
                        type="text"
                        value={newHospital}
                        onChange={e => setNewHospital(e.target.value)}
                        placeholder="Apollo Clinic"
                        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-ivory focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-lg bg-terracotta hover:bg-terracotta-dark text-white text-xs font-bold uppercase tracking-wider transition-colors mt-6"
                  >
                    Confirm Upload
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
