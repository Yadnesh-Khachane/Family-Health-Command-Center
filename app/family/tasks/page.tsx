"use client"

import React, { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { 
  ArrowLeft, 
  CheckSquare, 
  Calendar, 
  DollarSign, 
  Plus,
  Trash2,
  AlertCircle,
  X,
  CreditCard
} from "lucide-react"

import { medicalTasks, expenseRecords, familyMembers } from "@/lib/mock-data/mockData"
import { MedicalTask, ExpenseRecord } from "@/types/family"
import { fadeInUp, staggerContainer } from "@/components/family/animations"

export default function TasksPage() {
  const [tasks, setTasks] = useState<MedicalTask[]>(medicalTasks)
  const [expenses, setExpenses] = useState<ExpenseRecord[]>(expenseRecords)
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [showExpenseModal, setShowExpenseModal] = useState(false)

  // Form states for new task
  const [taskTitle, setTaskTitle] = useState("")
  const [taskMember, setTaskMember] = useState(familyMembers[0].id)
  const [taskCategory, setTaskCategory] = useState<"medication" | "appointment" | "lab" | "other">("medication")
  const [taskDate, setTaskDate] = useState("")

  // Form states for new expense
  const [expTitle, setExpTitle] = useState("")
  const [expMember, setExpMember] = useState(familyMembers[0].id)
  const [expAmount, setExpAmount] = useState("")
  const [expCategory, setExpCategory] = useState<"consultation" | "medication" | "surgery" | "insurance">("consultation")

  // Toggle tasks
  const handleToggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
  }

  // Delete task
  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  // Delete expense
  const handleDeleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id))
  }

  // Add Task
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!taskTitle) return

    const newTask: MedicalTask = {
      id: `t-${Date.now()}`,
      title: taskTitle,
      memberId: taskMember,
      dueDate: taskDate || new Date().toISOString().split("T")[0],
      category: taskCategory,
      completed: false
    }

    setTasks(prev => [...prev, newTask])
    setTaskTitle("")
    setShowTaskModal(false)
  }

  // Add Expense
  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault()
    if (!expTitle || !expAmount) return

    const newExpense: ExpenseRecord = {
      id: `ex-${Date.now()}`,
      title: expTitle,
      memberId: expMember,
      amount: parseInt(expAmount) || 0,
      date: new Date().toISOString().split("T")[0],
      category: expCategory,
      status: "paid"
    }

    setExpenses(prev => [newExpense, ...prev])
    setExpTitle("")
    setExpAmount("")
    setShowExpenseModal(false)
  }

  const getMemberInitials = (id: string) => {
    return familyMembers.find(m => m.id === id)?.initials || "FHCC"
  }

  const totalExpense = expenses.reduce((acc, curr) => acc + curr.amount, 0)
  const completedTaskRatio = tasks.length > 0 
    ? (tasks.filter(t => t.completed).length / tasks.length) * 100 
    : 0

  return (
    <main className="max-w-[1400px] mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <div>
        <Link href="/family/dashboard" className="flex items-center gap-2 text-xs text-ivory/60 hover:text-amber font-semibold uppercase tracking-wider transition-colors mb-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-2xl md:text-3xl font-extrabold text-ivory tracking-tight">
          Shared Household Operations
        </h1>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="frosted-panel rounded-2xl p-5 border border-white/5 space-y-2">
          <span className="text-[10px] uppercase tracking-wider text-white/40 font-bold">Task Progress</span>
          <div className="flex justify-between items-end">
            <span className="text-2xl font-[family-name:var(--font-space-grotesk)] font-bold text-ivory">
              {tasks.filter(t => t.completed).length} / {tasks.length}
            </span>
            <span className="text-xs text-success font-semibold">{Math.round(completedTaskRatio)}% Done</span>
          </div>
          <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
            <div className="h-full bg-success transition-all duration-300" style={{ width: `${completedTaskRatio}%` }} />
          </div>
        </div>

        <div className="frosted-panel rounded-2xl p-5 border border-white/5 space-y-2">
          <span className="text-[10px] uppercase tracking-wider text-white/40 font-bold">Quarterly Health Cost</span>
          <div className="flex justify-between items-baseline">
            <span className="text-2xl font-[family-name:var(--font-space-grotesk)] font-bold text-ivory">
              ₹{totalExpense.toLocaleString()}
            </span>
            <span className="text-xs text-white/40">INR Ledger</span>
          </div>
          <p className="text-[10px] text-white/40">Includes consults, surgical deposits, premiums.</p>
        </div>

        <div className="frosted-panel rounded-2xl p-5 border border-white/5 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-white/40 font-bold">Surveillance Status</span>
            <p className="text-sm font-bold text-white mt-1">Surgeries Pending</p>
            <p className="text-[10px] text-white/50 mt-1">1 Patient under active advisories</p>
          </div>
          <AlertCircle className="w-8 h-8 text-warning warning-pulse" />
        </div>
      </div>

      {/* Grid: Tasks lists & expenses logs */}
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        {/* Task List Section */}
        <motion.div variants={fadeInUp} className="frosted-panel rounded-3xl p-6 border border-white/5 flex flex-col h-[520px]">
          <div className="flex justify-between items-center pb-3 border-b border-white/5 mb-4 shrink-0">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-amber" />
              <h3 className="font-[family-name:var(--font-space-grotesk)] text-sm font-bold text-white">Daily Medication &amp; Clinical Tasks</h3>
            </div>
            <button 
              onClick={() => setShowTaskModal(true)}
              className="p-1 rounded-full bg-white/5 hover:bg-white/10 text-amber transition-colors"
            >
              <Plus className="w-4.5 h-4.5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 scrollbar-thin">
            {tasks.map(task => (
              <div 
                key={task.id}
                className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors"
              >
                <div 
                  onClick={() => handleToggleTask(task.id)}
                  className="flex items-center gap-3 flex-1 cursor-pointer"
                >
                  <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                    task.completed ? "bg-success border-success text-white" : "border-white/30"
                  }`}>
                    {task.completed && <CheckSquare className="w-3.5 h-3.5 fill-success text-obsidian" />}
                  </div>
                  <div>
                    <p className={`text-xs font-bold ${task.completed ? "line-through text-white/30" : "text-white"}`}>
                      {task.title}
                    </p>
                    <p className="text-[10px] text-white/40">Due: {task.dueDate}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[9px] bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-ivory/60 font-semibold uppercase">
                    {getMemberInitials(task.memberId)}
                  </span>
                  <button 
                    onClick={() => handleDeleteTask(task.id)}
                    className="text-white/30 hover:text-destructive p-1 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Expense Ledger Section */}
        <motion.div variants={fadeInUp} className="frosted-panel rounded-3xl p-6 border border-white/5 flex flex-col h-[520px]">
          <div className="flex justify-between items-center pb-3 border-b border-white/5 mb-4 shrink-0">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-terracotta" />
              <h3 className="font-[family-name:var(--font-space-grotesk)] text-sm font-bold text-white">Expense Ledger</h3>
            </div>
            <button 
              onClick={() => setShowExpenseModal(true)}
              className="p-1 rounded-full bg-white/5 hover:bg-white/10 text-terracotta transition-colors"
            >
              <Plus className="w-4.5 h-4.5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 scrollbar-thin">
            {expenses.map(exp => (
              <div 
                key={exp.id}
                className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-bold text-xs text-amber">
                    {getMemberInitials(exp.memberId)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{exp.title}</p>
                    <p className="text-[10px] text-white/40 uppercase tracking-wide">{exp.category} • {exp.date}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-ivory">₹{exp.amount.toLocaleString()}</span>
                  <button 
                    onClick={() => handleDeleteExpense(exp.id)}
                    className="text-white/30 hover:text-destructive p-1 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Task Creation Modal */}
      <AnimatePresence>
        {showTaskModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setShowTaskModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="frosted-panel rounded-2xl p-6 w-full max-w-sm border border-white/10 bg-[#0F0F0F]"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center pb-4 border-b border-white/5 mb-4">
                <h3 className="font-[family-name:var(--font-space-grotesk)] text-sm font-bold text-white">Create Medical Task</h3>
                <button onClick={() => setShowTaskModal(false)} className="p-1 rounded-full hover:bg-white/5">
                  <X className="w-5 h-5 text-ivory/60" />
                </button>
              </div>

              <form onSubmit={handleAddTask} className="space-y-4">
                <div>
                  <label className="text-[10px] uppercase font-bold text-white/40 block mb-1">Task Title</label>
                  <input
                    type="text"
                    required
                    value={taskTitle}
                    onChange={e => setTaskTitle(e.target.value)}
                    placeholder="e.g. Schedule Ortho Consult"
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-ivory focus:outline-none focus:border-amber/40"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-white/40 block mb-1">Assigned Member</label>
                  <select
                    value={taskMember}
                    onChange={e => setTaskMember(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-ivory focus:outline-none"
                  >
                    {familyMembers.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-white/40 block mb-1">Category</label>
                    <select
                      value={taskCategory}
                      onChange={e => setTaskCategory(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-ivory focus:outline-none"
                    >
                      <option value="medication">Meds</option>
                      <option value="appointment">Appointment</option>
                      <option value="lab">Lab Work</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-white/40 block mb-1">Due Date</label>
                    <input
                      type="date"
                      value={taskDate}
                      onChange={e => setTaskDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-ivory focus:outline-none"
                    />
                  </div>
                </div>

                <button type="submit" className="w-full py-2.5 rounded-lg bg-terracotta hover:bg-terracotta-dark text-white text-xs font-bold uppercase tracking-wider transition-colors mt-6">
                  Add Task
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expense Ledger Modal */}
      <AnimatePresence>
        {showExpenseModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setShowExpenseModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="frosted-panel rounded-2xl p-6 w-full max-w-sm border border-white/10 bg-[#0F0F0F]"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center pb-4 border-b border-white/5 mb-4">
                <h3 className="font-[family-name:var(--font-space-grotesk)] text-sm font-bold text-white">Log Health Expense</h3>
                <button onClick={() => setShowExpenseModal(false)} className="p-1 rounded-full hover:bg-white/5">
                  <X className="w-5 h-5 text-ivory/60" />
                </button>
              </div>

              <form onSubmit={handleAddExpense} className="space-y-4">
                <div>
                  <label className="text-[10px] uppercase font-bold text-white/40 block mb-1">Expense Description</label>
                  <input
                    type="text"
                    required
                    value={expTitle}
                    onChange={e => setExpTitle(e.target.value)}
                    placeholder="e.g. Grandma Eye Drops purchase"
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-ivory focus:outline-none focus:border-amber/40"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-white/40 block mb-1">Amount (₹)</label>
                    <input
                      type="number"
                      required
                      value={expAmount}
                      onChange={e => setExpAmount(e.target.value)}
                      placeholder="800"
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-ivory focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-white/40 block mb-1">Category</label>
                    <select
                      value={expCategory}
                      onChange={e => setExpCategory(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-ivory focus:outline-none"
                    >
                      <option value="consultation">Consult</option>
                      <option value="medication">Meds</option>
                      <option value="surgery">Surgery</option>
                      <option value="insurance">Insurance</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-white/40 block mb-1">Family Member</label>
                  <select
                    value={expMember}
                    onChange={e => setExpMember(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-ivory focus:outline-none"
                  >
                    {familyMembers.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>

                <button type="submit" className="w-full py-2.5 rounded-lg bg-terracotta hover:bg-terracotta-dark text-white text-xs font-bold uppercase tracking-wider transition-colors mt-6">
                  Log Ledger Item
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
