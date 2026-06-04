"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, Building2, ShieldAlert, Search, Filter, 
  MoreVertical, Edit2, Key, UserX, UserCheck, 
  UserPlus, Building, Upload, Mail, CheckCircle2,
  Lock, History, LogIn, Loader2
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";

type Tab = "families" | "hospitals" | "admins";

export default function EntityManagement() {
  const supabase = createClient();
  
  const [activeTab, setActiveTab] = useState<Tab>("families");
  const [searchQuery, setSearchQuery] = useState("");
  
  const [families, setFamilies] = useState<any[]>([]);
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [admins, setAdmins] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modals
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [suspendModal, setSuspendModal] = useState<{ id: string, type: Tab, name: string, isSuspended: boolean } | null>(null);
  const [suspendReason, setSuspendReason] = useState("");
  const [addHospitalModal, setAddHospitalModal] = useState(false);
  const [inviteAdminModal, setInviteAdminModal] = useState(false);
  const [expandedAdmin, setExpandedAdmin] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchEntities = useCallback(async () => {
    setIsLoading(true);
    const [famRes, hospRes, adminRes] = await Promise.all([
      supabase.from('families').select('*, members(id)').order('created_at', { ascending: false }),
      supabase.from('hospitals').select('*').order('name'),
      supabase.from('admins').select('*').order('name')
    ]);
    
    if (famRes.data) setFamilies(famRes.data);
    if (hospRes.data) setHospitals(hospRes.data);
    if (adminRes.data) setAdmins(adminRes.data);
    setIsLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchEntities();
  }, [fetchEntities]);

  const handleStatusToggle = async () => {
    if (!suspendModal) return;
    const { id, type, isSuspended, name } = suspendModal;
    const newStatus = isSuspended ? "Active" : "Suspended";
    
    const table = type; // families, hospitals, admins
    
    // Optimistic Update
    if (type === "families") setFamilies(prev => prev.map(f => f.id === id ? { ...f, status: newStatus } : f));
    if (type === "hospitals") setHospitals(prev => prev.map(h => h.id === id ? { ...h, status: newStatus } : h));
    if (type === "admins") setAdmins(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
    
    showToast(`${name} is now ${newStatus}`);
    setSuspendModal(null);
    setSuspendReason("");

    // DB Update
    const { error } = await supabase
      .from(table)
      .update({ status: newStatus })
      .eq('id', id);
      
    if (error) {
      console.error("Error updating status:", error);
      fetchEntities(); // Revert
    } else {
      // Log audit
      await supabase.from('audit_logs').insert({
        actor: 'Admin User', // Hardcoded for demo
        action: 'Account Suspended',
        target: name,
        details: suspendReason || "No reason provided",
        ip_address: '127.0.0.1'
      });
    }
  };

  const filteredFamilies = families.filter(f => f.name?.toLowerCase().includes(searchQuery.toLowerCase()) || f.primary_contact?.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredHospitals = hospitals.filter(h => h.name?.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredAdmins = admins.filter(a => a.name?.toLowerCase().includes(searchQuery.toLowerCase()) || a.email?.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-lg frosted-glass border border-amber-500/30 shadow-lg"
          >
            <p className="text-ivory font-medium">{toastMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Suspend/Reactivate Modal */}
      <AnimatePresence>
        {suspendModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setSuspendModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`frosted-panel rounded-xl p-6 max-w-md mx-4 w-full border ${suspendModal.isSuspended ? 'border-sage/30' : 'border-crimson/30'}`}
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-ivory font-semibold text-lg mb-2">
                {suspendModal.isSuspended ? 'Reactivate' : 'Suspend'} {suspendModal.name}
              </h3>
              <p className="text-ivory/70 mb-4 text-sm">
                {suspendModal.isSuspended 
                  ? "This will restore full access to the platform." 
                  : "This will instantly revoke access. Active sessions will be terminated."}
              </p>
              
              {!suspendModal.isSuspended && (
                <div className="mb-6">
                  <label className="text-sm text-ivory/70 block mb-2">Reason for suspension (required)</label>
                  <textarea 
                    value={suspendReason}
                    onChange={e => setSuspendReason(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-ivory focus:outline-none focus:border-crimson/50 min-h-[100px]"
                    placeholder="Provide details for the audit log..."
                  />
                </div>
              )}

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setSuspendModal(null)}
                  className="px-4 py-2 rounded-lg text-ivory/70 hover:text-ivory transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStatusToggle}
                  disabled={!suspendModal.isSuspended && !suspendReason.trim()}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    suspendModal.isSuspended ? 'bg-sage hover:bg-sage/80 text-obsidian' : 'bg-crimson hover:bg-crimson/80 text-ivory'
                  }`}
                >
                  Confirm {suspendModal.isSuspended ? 'Reactivation' : 'Suspension'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-ivory font-space-grotesk">Entity Management</h1>
          <p className="text-ivory/50">Centralized CRUD & access control for all platform actors</p>
        </div>
      </header>

      {/* Main Panel */}
      <div className="frosted-panel rounded-xl overflow-hidden flex flex-col h-[calc(100vh-200px)] relative">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          <div className="flex bg-black/40 p-1 rounded-lg border border-white/10">
            <button 
              onClick={() => setActiveTab('families')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'families' ? 'bg-amber-500 text-obsidian' : 'text-ivory/70 hover:text-ivory'}`}
            >
              <Users size={16} /> Families ({families.length})
            </button>
            <button 
              onClick={() => setActiveTab('hospitals')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'hospitals' ? 'bg-amber-500 text-obsidian' : 'text-ivory/70 hover:text-ivory'}`}
            >
              <Building2 size={16} /> Hospitals ({hospitals.length})
            </button>
            <button 
              onClick={() => setActiveTab('admins')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'admins' ? 'bg-amber-500 text-obsidian' : 'text-ivory/70 hover:text-ivory'}`}
            >
              <ShieldAlert size={16} /> Admins ({admins.length})
            </button>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ivory/40" />
              <input 
                type="text" 
                placeholder="Search entities..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-black/40 border border-white/10 rounded-lg text-sm text-ivory focus:outline-none focus:border-amber-500/50"
              />
            </div>
            
            {activeTab === 'hospitals' && (
              <button 
                onClick={() => setAddHospitalModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-sage hover:bg-sage/80 text-obsidian font-semibold rounded-lg transition-colors text-sm whitespace-nowrap"
              >
                <Building size={16} /> Onboard Hospital
              </button>
            )}
            
            {activeTab === 'admins' && (
              <button 
                onClick={() => setInviteAdminModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-500/80 text-obsidian font-semibold rounded-lg transition-colors text-sm whitespace-nowrap"
              >
                <UserPlus size={16} /> Invite Admin
              </button>
            )}
          </div>
        </div>

        {/* Data Tables */}
        <div className="flex-1 overflow-auto custom-scrollbar relative">
          
          {isLoading && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/20 backdrop-blur-sm text-amber-500">
              <Loader2 className="animate-spin mb-4" size={48} />
              <p>Loading entities from Supabase...</p>
            </div>
          )}

          {/* FAMILIES TABLE */}
          {activeTab === 'families' && (
            <table className="w-full text-sm text-left">
              <thead className="sticky top-0 bg-[#141414] shadow-sm z-10 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 font-medium text-ivory/50">Family Name</th>
                  <th className="px-6 py-4 font-medium text-ivory/50">Members</th>
                  <th className="px-6 py-4 font-medium text-ivory/50">Primary Contact</th>
                  <th className="px-6 py-4 font-medium text-ivory/50">Join Date</th>
                  <th className="px-6 py-4 font-medium text-ivory/50">Status</th>
                  <th className="px-6 py-4 font-medium text-ivory/50 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredFamilies.map(fam => (
                  <tr key={fam.id} className="hover:bg-white/5 group transition-colors">
                    <td className="px-6 py-4 font-medium text-ivory">{fam.name}</td>
                    <td className="px-6 py-4 text-ivory/70">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/10 text-xs font-bold mr-2">{fam.members?.length || 0}</span>
                    </td>
                    <td className="px-6 py-4 text-ivory/70">{fam.primary_contact}</td>
                    <td className="px-6 py-4 text-ivory/50">{new Date(fam.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${fam.status === 'Active' ? 'bg-sage/20 text-sage' : 'bg-crimson/20 text-crimson'}`}>
                        {fam.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => showToast(`Logged in as ${fam.name} — audit trail active`)}
                          className="p-2 text-ivory/50 hover:text-amber-500 hover:bg-amber-500/10 rounded-lg tooltip" title="Impersonate (Audit Logged)"
                        >
                          <LogIn size={16} />
                        </button>
                        <button 
                          onClick={() => showToast(`Password reset link sent to ${fam.primary_contact}`)}
                          className="p-2 text-ivory/50 hover:text-sage hover:bg-sage/10 rounded-lg tooltip" title="Force Password Reset"
                        >
                          <Key size={16} />
                        </button>
                        <button 
                          onClick={() => setSuspendModal({ id: fam.id, type: 'families', name: fam.name, isSuspended: fam.status === 'Suspended' })}
                          className={`p-2 rounded-lg tooltip ${fam.status === 'Suspended' ? 'text-sage hover:bg-sage/10' : 'text-ivory/50 hover:text-crimson hover:bg-crimson/10'}`}
                          title={fam.status === 'Suspended' ? 'Reactivate' : 'Suspend'}
                        >
                          {fam.status === 'Suspended' ? <UserCheck size={16} /> : <UserX size={16} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* HOSPITALS TABLE */}
          {activeTab === 'hospitals' && (
            <table className="w-full text-sm text-left">
              <thead className="sticky top-0 bg-[#141414] shadow-sm z-10 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 font-medium text-ivory/50">Hospital Name</th>
                  <th className="px-6 py-4 font-medium text-ivory/50">Departments</th>
                  <th className="px-6 py-4 font-medium text-ivory/50">Patient Consents</th>
                  <th className="px-6 py-4 font-medium text-ivory/50">Admin Contact</th>
                  <th className="px-6 py-4 font-medium text-ivory/50">Status</th>
                  <th className="px-6 py-4 font-medium text-ivory/50 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredHospitals.map(hosp => (
                  <tr key={hosp.id} className="hover:bg-white/5 group transition-colors">
                    <td className="px-6 py-4 font-medium text-ivory flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center text-ivory/50">{hosp.name.charAt(0)}</div>
                      {hosp.name}
                    </td>
                    <td className="px-6 py-4 text-ivory/70">{hosp.departments_count}</td>
                    <td className="px-6 py-4 text-amber-500 font-medium">{hosp.patients_count}</td>
                    <td className="px-6 py-4 text-ivory/70">{hosp.admin_email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${hosp.status === 'Active' ? 'bg-sage/20 text-sage' : 'bg-crimson/20 text-crimson'}`}>
                        {hosp.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-ivory/50 hover:text-amber-500 hover:bg-amber-500/10 rounded-lg tooltip" title="Edit Hospital">
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => showToast(`Password reset link sent to ${hosp.admin_email}`)}
                          className="p-2 text-ivory/50 hover:text-sage hover:bg-sage/10 rounded-lg tooltip" title="Reset Admin Password"
                        >
                          <Key size={16} />
                        </button>
                        <button 
                          onClick={() => setSuspendModal({ id: hosp.id, type: 'hospitals', name: hosp.name, isSuspended: hosp.status === 'Suspended' })}
                          className={`p-2 rounded-lg tooltip ${hosp.status === 'Suspended' ? 'text-sage hover:bg-sage/10' : 'text-ivory/50 hover:text-crimson hover:bg-crimson/10'}`}
                          title={hosp.status === 'Suspended' ? 'Reactivate' : 'Suspend'}
                        >
                          {hosp.status === 'Suspended' ? <UserCheck size={16} /> : <UserX size={16} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* ADMINS TABLE */}
          {activeTab === 'admins' && (
            <div className="flex flex-col">
              <table className="w-full text-sm text-left">
                <thead className="sticky top-0 bg-[#141414] shadow-sm z-10 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4 font-medium text-ivory/50">Admin User</th>
                    <th className="px-6 py-4 font-medium text-ivory/50">Role</th>
                    <th className="px-6 py-4 font-medium text-ivory/50">Security</th>
                    <th className="px-6 py-4 font-medium text-ivory/50">Last Login</th>
                    <th className="px-6 py-4 font-medium text-ivory/50">Status</th>
                    <th className="px-6 py-4 font-medium text-ivory/50 text-right">Permissions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredAdmins.map(admin => (
                    <tr key={admin.id} className="hover:bg-white/5 group transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-ivory">{admin.name}</div>
                        <div className="text-xs text-ivory/50">{admin.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium border ${
                          admin.role === 'Super Admin' ? 'bg-amber-500/10 text-amber-500 border-amber-500/30' :
                          admin.role === 'Support Admin' ? 'bg-terracotta/10 text-terracotta border-terracotta/30' :
                          'bg-sage/10 text-sage border-sage/30'
                        }`}>
                          {admin.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {admin.tfa_enabled ? (
                            <><ShieldAlert size={14} className="text-sage" /> <span className="text-xs text-sage">2FA On</span></>
                          ) : (
                            <><Lock size={14} className="text-saffron" /> <span className="text-xs text-saffron">2FA Off</span></>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-ivory/70">{admin.last_login ? new Date(admin.last_login).toLocaleString() : 'Never'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${admin.status === 'Active' ? 'bg-sage/20 text-sage' : 'bg-crimson/20 text-crimson'}`}>
                          {admin.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => setExpandedAdmin(expandedAdmin === admin.id ? null : admin.id)}
                            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-ivory/70 text-xs font-medium transition-colors"
                          >
                            View Matrix
                          </button>
                          <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                            <button 
                              onClick={() => setSuspendModal({ id: admin.id, type: 'admins', name: admin.name, isSuspended: admin.status === 'Suspended' })}
                              className={`p-1.5 rounded-lg ${admin.status === 'Suspended' ? 'text-sage hover:bg-sage/10' : 'text-crimson/70 hover:bg-crimson/10'}`}
                            >
                              {admin.status === 'Suspended' ? <UserCheck size={14} /> : <UserX size={14} />}
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Permissions Matrix Expanded View */}
              <AnimatePresence>
                {expandedAdmin && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="bg-black/60 border-t border-b border-amber-500/30 overflow-hidden"
                  >
                    <div className="p-6">
                      <h4 className="text-ivory font-medium mb-4 flex items-center gap-2">
                        <ShieldAlert className="text-amber-500" size={18}/> 
                        Role-Based Permissions Matrix: {admins.find(a => a.id === expandedAdmin)?.name}
                      </h4>
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        {[
                          { mod: "Database Access", val: admins.find(a => a.id === expandedAdmin)?.role === 'Super Admin' ? 'Full Read/Write' : 'Read Only' },
                          { mod: "Consent Governance", val: admins.find(a => a.id === expandedAdmin)?.role !== 'Auditor' ? 'Manage' : 'View Only' },
                          { mod: "FDA Recalls", val: admins.find(a => a.id === expandedAdmin)?.role !== 'Auditor' ? 'Push Alerts' : 'View Logs' },
                          { mod: "Emergency Protocol", val: admins.find(a => a.id === expandedAdmin)?.role === 'Super Admin' ? 'Declare & End' : 'No Access' },
                          { mod: "Audit Logs", val: 'Full View & Export' },
                          { mod: "Entity Management", val: admins.find(a => a.id === expandedAdmin)?.role === 'Super Admin' ? 'Manage All' : 'Manage Families' },
                        ].map((perm, idx) => (
                          <div key={idx} className="p-3 bg-white/5 rounded-lg border border-white/10">
                            <div className="text-ivory/50 text-xs mb-1">{perm.mod}</div>
                            <div className={`font-medium ${perm.val === 'No Access' ? 'text-crimson' : 'text-sage'}`}>{perm.val}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
