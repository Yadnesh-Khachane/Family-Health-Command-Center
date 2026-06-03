"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

type Tab = "families" | "hospitals" | "admins";

interface Family {
  id: number;
  name: string;
  members: number;
  created: string;
  status: "Active" | "Inactive";
}

interface Hospital {
  id: number;
  name: string;
  departments: number;
  created: string;
  status: "Active" | "Inactive";
}

interface Admin {
  id: number;
  name: string;
  email: string;
  role: string;
  created: string;
  status: "Active" | "Inactive";
}

const initialFamilies: Family[] = [
  { id: 1, name: "Sharma Family", members: 4, created: "Jan 15, 2024", status: "Active" },
  { id: 2, name: "Gupta Family", members: 3, created: "Feb 22, 2024", status: "Active" },
  { id: 3, name: "Patel Family", members: 5, created: "Mar 10, 2024", status: "Active" },
  { id: 4, name: "Kumar Family", members: 6, created: "Apr 5, 2024", status: "Active" },
  { id: 5, name: "Singh Family", members: 4, created: "May 18, 2024", status: "Inactive" },
];

const initialHospitals: Hospital[] = [
  { id: 1, name: "Apollo Medical Center", departments: 12, created: "Jan 1, 2024", status: "Active" },
  { id: 2, name: "City General Hospital", departments: 8, created: "Jan 15, 2024", status: "Active" },
  { id: 3, name: "Metro Hospital", departments: 10, created: "Feb 1, 2024", status: "Active" },
  { id: 4, name: "Sunrise Clinic", departments: 4, created: "Mar 1, 2024", status: "Inactive" },
];

const initialAdmins: Admin[] = [
  { id: 1, name: "Dr. Suresh Agarwal", email: "suresh.a@fhcc.com", role: "Super Admin", created: "Jan 1, 2024", status: "Active" },
  { id: 2, name: "Meera Krishnan", email: "meera.k@fhcc.com", role: "Admin", created: "Jan 15, 2024", status: "Active" },
  { id: 3, name: "Rahul Verma", email: "rahul.v@fhcc.com", role: "Admin", created: "Feb 1, 2024", status: "Active" },
];

export default function EntitiesPage() {
  const [activeTab, setActiveTab] = useState<Tab>("families");
  const [families, setFamilies] = useState(initialFamilies);
  const [hospitals, setHospitals] = useState(initialHospitals);
  const [admins, setAdmins] = useState(initialAdmins);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [showDeactivateModal, setShowDeactivateModal] = useState<{ type: Tab; id: number; name: string } | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [newHospital, setNewHospital] = useState({ name: "", address: "", adminEmail: "", adminPassword: "" });

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDeactivate = () => {
    if (!showDeactivateModal) return;
    const { type, id, name } = showDeactivateModal;
    
    if (type === "families") {
      setFamilies(prev => prev.map(f => f.id === id ? { ...f, status: "Inactive" } : f));
    } else if (type === "hospitals") {
      setHospitals(prev => prev.map(h => h.id === id ? { ...h, status: "Inactive" } : h));
    } else {
      setAdmins(prev => prev.map(a => a.id === id ? { ...a, status: "Inactive" } : a));
    }
    
    showToast(`${name} has been deactivated`);
    setShowDeactivateModal(null);
  };

  const startEditing = (id: number, currentValue: string) => {
    setEditingId(id);
    setEditValue(currentValue);
  };

  const saveEdit = (type: Tab, id: number) => {
    if (type === "families") {
      setFamilies(prev => prev.map(f => f.id === id ? { ...f, name: editValue } : f));
    } else if (type === "hospitals") {
      setHospitals(prev => prev.map(h => h.id === id ? { ...h, name: editValue } : h));
    } else {
      setAdmins(prev => prev.map(a => a.id === id ? { ...a, name: editValue } : a));
    }
    setEditingId(null);
    showToast("Changes saved");
  };

  const addHospital = () => {
    if (!newHospital.name || !newHospital.adminEmail) return;
    const newId = Math.max(...hospitals.map(h => h.id)) + 1;
    setHospitals(prev => [...prev, {
      id: newId,
      name: newHospital.name,
      departments: 0,
      created: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      status: "Active"
    }]);
    setNewHospital({ name: "", address: "", adminEmail: "", adminPassword: "" });
    setShowAddModal(false);
    showToast(`${newHospital.name} has been added`);
  };

  const filteredFamilies = families.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredHospitals = hospitals.filter(h => h.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredAdmins = admins.filter(a => a.name.toLowerCase().includes(searchQuery.toLowerCase()) || a.email.toLowerCase().includes(searchQuery.toLowerCase()));

  const tabs: { key: Tab; label: string }[] = [
    { key: "families", label: "Families" },
    { key: "hospitals", label: "Hospitals" },
    { key: "admins", label: "Admins" },
  ];

  return (
    <div className="min-h-screen bg-[#0D0D0D] relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 opacity-30 pointer-events-none" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")" }} />
      <div className="fixed top-20 left-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-20 right-20 w-80 h-80 bg-terracotta/10 rounded-full blur-3xl pointer-events-none" />

      {/* Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-lg frosted-glass border border-amber-500/30"
          >
            <p className="text-ivory font-medium">{toastMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Deactivate Modal */}
      <AnimatePresence>
        {showDeactivateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setShowDeactivateModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="frosted-panel rounded-xl p-6 max-w-sm mx-4"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-ivory font-semibold text-lg mb-2">Confirm Deactivation</h3>
              <p className="text-ivory/70 mb-4">
                Are you sure you want to deactivate <span className="text-ivory font-medium">{showDeactivateModal.name}</span>? 
                This {showDeactivateModal.type === "families" ? "family" : showDeactivateModal.type === "hospitals" ? "hospital" : "admin"} will lose access.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowDeactivateModal(null)}
                  className="px-4 py-2 rounded-lg text-ivory/70 hover:text-ivory transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeactivate}
                  className="px-4 py-2 rounded-lg bg-crimson text-ivory font-medium hover:bg-crimson/80 transition-colors"
                >
                  Deactivate
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Hospital Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="frosted-panel rounded-xl p-6 w-full max-w-md mx-4"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-ivory font-semibold text-lg mb-4">Add New Hospital Partner</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-ivory/70 text-sm block mb-1">Hospital Name</label>
                  <input
                    type="text"
                    value={newHospital.name}
                    onChange={e => setNewHospital(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-ivory placeholder:text-ivory/30 focus:outline-none focus:border-amber-500/50 transition-colors"
                    placeholder="Enter hospital name"
                  />
                </div>
                <div>
                  <label className="text-ivory/70 text-sm block mb-1">Address</label>
                  <input
                    type="text"
                    value={newHospital.address}
                    onChange={e => setNewHospital(prev => ({ ...prev, address: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-ivory placeholder:text-ivory/30 focus:outline-none focus:border-amber-500/50 transition-colors"
                    placeholder="Enter address"
                  />
                </div>
                <div>
                  <label className="text-ivory/70 text-sm block mb-1">Admin Email</label>
                  <input
                    type="email"
                    value={newHospital.adminEmail}
                    onChange={e => setNewHospital(prev => ({ ...prev, adminEmail: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-ivory placeholder:text-ivory/30 focus:outline-none focus:border-amber-500/50 transition-colors"
                    placeholder="admin@hospital.com"
                  />
                </div>
                <div>
                  <label className="text-ivory/70 text-sm block mb-1">Admin Password</label>
                  <input
                    type="password"
                    value={newHospital.adminPassword}
                    onChange={e => setNewHospital(prev => ({ ...prev, adminPassword: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-ivory placeholder:text-ivory/30 focus:outline-none focus:border-amber-500/50 transition-colors"
                    placeholder="Create password"
                  />
                </div>
              </div>
              <div className="flex gap-3 justify-end mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg text-ivory/70 hover:text-ivory transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={addHospital}
                  className="px-4 py-2 rounded-lg bg-terracotta text-ivory font-medium hover:bg-terracotta/80 transition-colors"
                >
                  Add Hospital
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Bar */}
      <header className="sticky top-0 z-40 frosted-glass px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-6">
          <Link href="/admin/dashboard" className="flex items-center gap-2 text-ivory/70 hover:text-ivory transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-xl font-semibold text-ivory font-space-grotesk">Entity Management</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="frosted-panel rounded-xl p-6"
        >
          {/* Tabs + Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex gap-2">
              {tabs.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.key
                      ? "bg-amber-500 text-obsidian"
                      : "bg-white/5 text-ivory/70 hover:text-ivory hover:bg-white/10"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="flex-1 sm:w-64 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-ivory placeholder:text-ivory/30 focus:outline-none focus:border-amber-500/50 transition-colors"
              />
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 rounded-lg bg-terracotta text-ivory font-medium hover:bg-terracotta/80 transition-colors whitespace-nowrap"
              >
                + Add Hospital
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {activeTab === "families" && (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left text-ivory/50 text-sm font-normal pb-3">Family Name</th>
                    <th className="text-left text-ivory/50 text-sm font-normal pb-3">Members</th>
                    <th className="text-left text-ivory/50 text-sm font-normal pb-3">Created</th>
                    <th className="text-left text-ivory/50 text-sm font-normal pb-3">Status</th>
                    <th className="text-right text-ivory/50 text-sm font-normal pb-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFamilies.map(family => (
                    <tr key={family.id} className="border-b border-white/5">
                      <td className="py-4">
                        {editingId === family.id ? (
                          <input
                            type="text"
                            value={editValue}
                            onChange={e => setEditValue(e.target.value)}
                            onBlur={() => saveEdit("families", family.id)}
                            onKeyDown={e => e.key === "Enter" && saveEdit("families", family.id)}
                            className="px-2 py-1 rounded bg-white/10 border border-amber-500/50 text-ivory focus:outline-none"
                            autoFocus
                          />
                        ) : (
                          <span className="text-ivory">{family.name}</span>
                        )}
                      </td>
                      <td className="py-4 text-ivory/70">{family.members} members</td>
                      <td className="py-4 text-ivory/50 text-sm">{family.created}</td>
                      <td className="py-4">
                        <span className={`px-2 py-1 rounded text-xs ${family.status === "Active" ? "bg-sage/20 text-sage" : "bg-white/10 text-ivory/50"}`}>
                          {family.status}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <button className="p-2 rounded hover:bg-white/10 transition-colors" title="View">
                            <svg className="w-4 h-4 text-ivory/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button 
                            onClick={() => startEditing(family.id, family.name)}
                            className="p-2 rounded hover:bg-white/10 transition-colors" 
                            title="Edit"
                          >
                            <svg className="w-4 h-4 text-ivory/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button 
                            onClick={() => setShowDeactivateModal({ type: "families", id: family.id, name: family.name })}
                            className="p-2 rounded hover:bg-crimson/20 transition-colors" 
                            title="Deactivate"
                          >
                            <svg className="w-4 h-4 text-crimson/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === "hospitals" && (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left text-ivory/50 text-sm font-normal pb-3">Hospital Name</th>
                    <th className="text-left text-ivory/50 text-sm font-normal pb-3">Departments</th>
                    <th className="text-left text-ivory/50 text-sm font-normal pb-3">Created</th>
                    <th className="text-left text-ivory/50 text-sm font-normal pb-3">Status</th>
                    <th className="text-right text-ivory/50 text-sm font-normal pb-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHospitals.map(hospital => (
                    <tr key={hospital.id} className="border-b border-white/5">
                      <td className="py-4">
                        {editingId === hospital.id ? (
                          <input
                            type="text"
                            value={editValue}
                            onChange={e => setEditValue(e.target.value)}
                            onBlur={() => saveEdit("hospitals", hospital.id)}
                            onKeyDown={e => e.key === "Enter" && saveEdit("hospitals", hospital.id)}
                            className="px-2 py-1 rounded bg-white/10 border border-amber-500/50 text-ivory focus:outline-none"
                            autoFocus
                          />
                        ) : (
                          <span className="text-ivory">{hospital.name}</span>
                        )}
                      </td>
                      <td className="py-4 text-ivory/70">{hospital.departments} departments</td>
                      <td className="py-4 text-ivory/50 text-sm">{hospital.created}</td>
                      <td className="py-4">
                        <span className={`px-2 py-1 rounded text-xs ${hospital.status === "Active" ? "bg-sage/20 text-sage" : "bg-white/10 text-ivory/50"}`}>
                          {hospital.status}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <button className="p-2 rounded hover:bg-white/10 transition-colors" title="View">
                            <svg className="w-4 h-4 text-ivory/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button 
                            onClick={() => startEditing(hospital.id, hospital.name)}
                            className="p-2 rounded hover:bg-white/10 transition-colors" 
                            title="Edit"
                          >
                            <svg className="w-4 h-4 text-ivory/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button 
                            onClick={() => setShowDeactivateModal({ type: "hospitals", id: hospital.id, name: hospital.name })}
                            className="p-2 rounded hover:bg-crimson/20 transition-colors" 
                            title="Deactivate"
                          >
                            <svg className="w-4 h-4 text-crimson/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === "admins" && (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left text-ivory/50 text-sm font-normal pb-3">Name</th>
                    <th className="text-left text-ivory/50 text-sm font-normal pb-3">Email</th>
                    <th className="text-left text-ivory/50 text-sm font-normal pb-3">Role</th>
                    <th className="text-left text-ivory/50 text-sm font-normal pb-3">Created</th>
                    <th className="text-left text-ivory/50 text-sm font-normal pb-3">Status</th>
                    <th className="text-right text-ivory/50 text-sm font-normal pb-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAdmins.map(admin => (
                    <tr key={admin.id} className="border-b border-white/5">
                      <td className="py-4">
                        {editingId === admin.id ? (
                          <input
                            type="text"
                            value={editValue}
                            onChange={e => setEditValue(e.target.value)}
                            onBlur={() => saveEdit("admins", admin.id)}
                            onKeyDown={e => e.key === "Enter" && saveEdit("admins", admin.id)}
                            className="px-2 py-1 rounded bg-white/10 border border-amber-500/50 text-ivory focus:outline-none"
                            autoFocus
                          />
                        ) : (
                          <span className="text-ivory">{admin.name}</span>
                        )}
                      </td>
                      <td className="py-4 text-ivory/70">{admin.email}</td>
                      <td className="py-4">
                        <span className={`px-2 py-1 rounded text-xs ${admin.role === "Super Admin" ? "bg-amber-500/20 text-amber-500" : "bg-white/10 text-ivory/70"}`}>
                          {admin.role}
                        </span>
                      </td>
                      <td className="py-4 text-ivory/50 text-sm">{admin.created}</td>
                      <td className="py-4">
                        <span className={`px-2 py-1 rounded text-xs ${admin.status === "Active" ? "bg-sage/20 text-sage" : "bg-white/10 text-ivory/50"}`}>
                          {admin.status}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <button className="p-2 rounded hover:bg-white/10 transition-colors" title="View">
                            <svg className="w-4 h-4 text-ivory/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button 
                            onClick={() => startEditing(admin.id, admin.name)}
                            className="p-2 rounded hover:bg-white/10 transition-colors" 
                            title="Edit"
                          >
                            <svg className="w-4 h-4 text-ivory/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button 
                            onClick={() => setShowDeactivateModal({ type: "admins", id: admin.id, name: admin.name })}
                            className="p-2 rounded hover:bg-crimson/20 transition-colors" 
                            title="Deactivate"
                          >
                            <svg className="w-4 h-4 text-crimson/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
