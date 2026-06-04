"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Database, Table2, Search, Download, Trash2, Copy, Plus, 
  ChevronDown, ArrowUpDown, Shield, AlertCircle, Play, Server,
  Columns, Loader2
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";

// Define the real schema based on our Supabase implementation
const MOCK_SCHEMA: Record<string, { columns: string[], types: string[], pks: string[] }> = {
  families: { columns: ['id', 'name', 'primary_contact', 'created_at', 'status'], types: ['uuid', 'text', 'text', 'timestamp', 'text'], pks: ['id'] },
  members: { columns: ['id', 'family_id', 'first_name', 'dob', 'blood_type'], types: ['uuid', 'uuid', 'text', 'date', 'text'], pks: ['id'] },
  hospitals: { columns: ['id', 'name', 'address', 'admin_email', 'status', 'departments_count', 'patients_count'], types: ['uuid', 'text', 'text', 'text', 'text', 'integer', 'integer'], pks: ['id'] },
  admins: { columns: ['id', 'name', 'email', 'role', 'last_login', 'status', 'tfa_enabled'], types: ['uuid', 'text', 'text', 'text', 'timestamp', 'text', 'boolean'], pks: ['id'] },
  consent_links: { columns: ['id', 'member_id', 'hospital_id', 'access_level'], types: ['uuid', 'uuid', 'uuid', 'text'], pks: ['id'] },
  audit_logs: { columns: ['id', 'actor', 'action', 'target', 'details', 'ip_address', 'created_at'], types: ['uuid', 'text', 'text', 'text', 'text', 'text', 'timestamp'], pks: ['id'] },
  fda_recalls: { columns: ['id', 'product', 'manufacturer', 'lots', 'severity', 'issue_date', 'fam_count', 'hosp_count'], types: ['text', 'text', 'text', 'text', 'text', 'timestamp', 'integer', 'integer'], pks: ['id'] },
  anomalies: { columns: ['id', 'entity', 'type', 'severity', 'description', 'status', 'ip_address', 'location', 'action_context', 'created_at'], types: ['uuid', 'text', 'text', 'text', 'text', 'text', 'text', 'text', 'text', 'timestamp'], pks: ['id'] }
};

const TABLES = Object.keys(MOCK_SCHEMA);

export default function DatabaseStudio() {
  const supabase = createClient();
  
  const [activeTable, setActiveTable] = useState<string>('families');
  const [activeTab, setActiveTab] = useState<'data' | 'schema' | 'query'>('data');
  
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  
  // Editing state
  const [editingCell, setEditingCell] = useState<{ rowId: string, col: string } | null>(null);
  const [editValue, setEditValue] = useState("");

  // Query state
  const [query, setQuery] = useState("SELECT * FROM families WHERE status = 'Active';");
  const [queryResult, setQueryResult] = useState<any[] | null>(null);

  const schema = MOCK_SCHEMA[activeTable];

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    const { data: result, error } = await supabase
      .from(activeTable)
      .select('*')
      .order('id', { ascending: true });
    
    if (error) {
      console.error("Error fetching data:", error);
    } else {
      setData(result || []);
    }
    setIsLoading(false);
    setSelectedRows(new Set());
  }, [activeTable, supabase]);

  useEffect(() => {
    if (activeTab === 'data') {
      fetchData();
    }
  }, [fetchData, activeTab]);

  // Filtering
  const filteredData = useMemo(() => {
    if (!searchQuery) return data;
    const lowerQuery = searchQuery.toLowerCase();
    return data.filter(row => 
      Object.values(row).some(val => String(val).toLowerCase().includes(lowerQuery))
    );
  }, [data, searchQuery]);

  const handleCellDoubleCLick = (rowId: string, col: string, value: any) => {
    setEditingCell({ rowId, col });
    setEditValue(value === null ? "" : String(value));
  };

  const handleCellSave = async () => {
    if (!editingCell) return;
    const { rowId, col } = editingCell;
    
    // Optimistic UI update
    setData(prev => prev.map(row => 
      row.id === rowId ? { ...row, [col]: editValue } : row
    ));
    setEditingCell(null);

    // Save to DB
    const { error } = await supabase
      .from(activeTable)
      .update({ [col]: editValue })
      .eq('id', rowId);

    if (error) {
      console.error("Error updating cell:", error);
      fetchData(); // Revert on error
    }
  };

  const handleDelete = async () => {
    if (selectedRows.size === 0) return;
    
    const idsToDelete = Array.from(selectedRows);
    
    // Optimistic update
    setData(prev => prev.filter(row => !idsToDelete.includes(row.id)));
    setSelectedRows(new Set());

    // DB operation
    const { error } = await supabase
      .from(activeTable)
      .delete()
      .in('id', idsToDelete);
      
    if (error) {
      console.error("Error deleting rows:", error);
      fetchData(); // Revert
    }
  };

  const handleRowSelect = (id: string) => {
    const newSel = new Set(selectedRows);
    if (newSel.has(id)) newSel.delete(id);
    else newSel.add(id);
    setSelectedRows(newSel);
  };

  const handleSelectAll = () => {
    if (selectedRows.size === filteredData.length) setSelectedRows(new Set());
    else setSelectedRows(new Set(filteredData.map(r => r.id)));
  };

  const runQuery = async () => {
    // Note: Arbitrary SQL execution requires Postgres Functions (RPC) in Supabase.
    // For this demo GUI, we just mock the result if it's a simple SELECT or show error.
    if (query.toLowerCase().includes('select * from ' + activeTable)) {
      setQueryResult(data.filter(d => query.includes('Active') ? d.status === 'Active' : true));
    } else {
      setQueryResult([{ error: "Direct arbitrary SQL execution via frontend is disabled for security. Use backend RPCs." }]);
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#0D0D0D]">
      
      {/* Top Header */}
      <header className="px-6 py-4 border-b border-white/10 frosted-glass flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-500">
            <Database size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-ivory font-space-grotesk">Database Management Studio</h1>
            <p className="text-xs text-ivory/50">Supabase DB Connection (fhcc-prod)</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex bg-black/40 p-1 rounded-lg border border-white/10">
            <button 
              onClick={() => setActiveTab('data')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'data' ? 'bg-amber-500 text-obsidian' : 'text-ivory/70 hover:text-ivory'}`}
            >
              Data Grid
            </button>
            <button 
              onClick={() => setActiveTab('schema')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'schema' ? 'bg-amber-500 text-obsidian' : 'text-ivory/70 hover:text-ivory'}`}
            >
              Schema Inspector
            </button>
            <button 
              onClick={() => setActiveTab('query')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'query' ? 'bg-amber-500 text-obsidian' : 'text-ivory/70 hover:text-ivory'}`}
            >
              Query Runner
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Tables */}
        <div className="w-64 border-r border-white/10 bg-black/20 flex flex-col overflow-y-auto shrink-0">
          <div className="p-4 border-b border-white/10 flex justify-between items-center">
            <h3 className="text-xs font-bold tracking-wider text-ivory/50 uppercase">Tables ({TABLES.length})</h3>
            <button onClick={fetchData} className="text-ivory/40 hover:text-ivory" title="Refresh DB">
              <Database size={14} />
            </button>
          </div>
          <nav className="p-2 space-y-0.5">
            {TABLES.map(table => (
              <button
                key={table}
                onClick={() => { setActiveTable(table); setSelectedRows(new Set()); setSearchQuery(""); }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                  activeTable === table 
                    ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' 
                    : 'text-ivory/70 hover:bg-white/5 hover:text-ivory border border-transparent'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Table2 size={16} className={activeTable === table ? 'text-amber-500' : 'text-ivory/40'} />
                  {table}
                </span>
                {isLoading && activeTable === table && <Loader2 size={12} className="animate-spin text-amber-500" />}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Workspace */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#0D0D0D]/50 relative">
          
          {activeTab === 'data' && (
            <>
              {/* Toolbar */}
              <div className="p-4 border-b border-white/10 flex items-center justify-between gap-4 shrink-0">
                <div className="flex items-center gap-2 flex-1">
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ivory/40" />
                    <input 
                      type="text" 
                      placeholder={`Search in ${activeTable}...`}
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-black/40 border border-white/10 rounded-lg text-sm text-ivory focus:outline-none focus:border-amber-500/50"
                    />
                  </div>
                  <button className="p-2 text-ivory/50 hover:text-ivory hover:bg-white/10 rounded-lg">
                    <Columns size={18} />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <AnimatePresence>
                    {selectedRows.size > 0 && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="flex items-center gap-2 mr-2"
                      >
                        <span className="text-sm text-amber-500 font-medium">{selectedRows.size} selected</span>
                        <button className="p-2 text-ivory/70 hover:text-ivory hover:bg-white/10 rounded-lg tooltip" title="Duplicate">
                          <Copy size={16} />
                        </button>
                        <button onClick={handleDelete} className="p-2 text-crimson/70 hover:text-crimson hover:bg-crimson/10 rounded-lg">
                          <Trash2 size={16} />
                        </button>
                        <div className="w-px h-6 bg-white/10 mx-1" />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-ivory transition-colors">
                    <Plus size={16} /> Add Row
                  </button>
                  <button className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-ivory transition-colors">
                    <Download size={16} /> Export <ChevronDown size={14} />
                  </button>
                </div>
              </div>

              {/* Data Grid */}
              <div className="flex-1 overflow-auto custom-scrollbar relative">
                {isLoading && data.length === 0 ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-ivory/40 z-20 bg-black/20 backdrop-blur-sm">
                    <Loader2 size={48} className="animate-spin mb-4 text-amber-500" />
                    <p>Fetching records from Supabase...</p>
                  </div>
                ) : filteredData.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-ivory/40">
                    <Table2 size={48} className="mb-4 opacity-20" />
                    <p>No records found in {activeTable}</p>
                  </div>
                ) : (
                  <table className="w-full text-sm text-left whitespace-nowrap">
                    <thead className="sticky top-0 bg-[#141414] shadow-sm z-10 border-b border-white/10">
                      <tr>
                        <th className="px-4 py-3 w-10">
                          <input 
                            type="checkbox" 
                            checked={selectedRows.size === filteredData.length && filteredData.length > 0}
                            onChange={handleSelectAll}
                            className="rounded border-white/20 bg-black/40 text-amber-500 focus:ring-amber-500/50"
                          />
                        </th>
                        {schema.columns.map(col => (
                          <th key={col} className="px-4 py-3 font-medium text-ivory/50 cursor-pointer hover:text-ivory group">
                            <div className="flex items-center gap-2">
                              {col}
                              {schema.pks.includes(col) && <Shield size={12} className="text-amber-500" title="Primary Key" />}
                              <ArrowUpDown size={12} className="opacity-0 group-hover:opacity-100" />
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredData.map(row => (
                        <tr 
                          key={row.id} 
                          className={`hover:bg-white/5 transition-colors ${selectedRows.has(row.id) ? 'bg-amber-500/5' : ''}`}
                        >
                          <td className="px-4 py-2">
                            <input 
                              type="checkbox" 
                              checked={selectedRows.has(row.id)}
                              onChange={() => handleRowSelect(row.id)}
                              className="rounded border-white/20 bg-black/40 text-amber-500 focus:ring-amber-500/50"
                            />
                          </td>
                          {schema.columns.map(col => (
                            <td 
                              key={col} 
                              className="px-4 py-2 text-ivory/80 cursor-cell"
                              onDoubleClick={() => handleCellDoubleCLick(row.id, col, row[col])}
                            >
                              {editingCell?.rowId === row.id && editingCell.col === col ? (
                                <input
                                  type="text"
                                  value={editValue}
                                  onChange={e => setEditValue(e.target.value)}
                                  onBlur={handleCellSave}
                                  onKeyDown={e => e.key === 'Enter' && handleCellSave()}
                                  className="bg-[#1A1A1A] border border-amber-500 text-ivory px-2 py-1 rounded w-full outline-none"
                                  autoFocus
                                />
                              ) : (
                                <div className="truncate max-w-[250px]" title={String(row[col])}>
                                  {row[col] !== null && row[col] !== undefined ? String(row[col]) : <span className="text-ivory/30 italic">NULL</span>}
                                </div>
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
              
              {/* Pagination Footer */}
              <div className="p-3 border-t border-white/10 bg-black/40 flex items-center justify-between text-xs text-ivory/50 shrink-0">
                <span>Showing 1 to {filteredData.length} of {filteredData.length} rows</span>
                <div className="flex items-center gap-4">
                  <span>Rows per page: 50 <ChevronDown size={12} className="inline" /></span>
                  <div className="flex gap-1">
                    <button className="px-2 py-1 hover:bg-white/10 rounded disabled:opacity-30" disabled>&lt; Prev</button>
                    <button className="px-2 py-1 hover:bg-white/10 rounded disabled:opacity-30" disabled>Next &gt;</button>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'schema' && (
            <div className="p-8 max-w-4xl mx-auto w-full">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-ivory font-space-grotesk mb-2">Table: {activeTable}</h2>
                <p className="text-ivory/50">Schema definition and constraints</p>
              </div>
              
              <div className="frosted-panel rounded-xl overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-black/40 border-b border-white/10">
                    <tr>
                      <th className="px-6 py-4 text-ivory/50 font-medium text-sm">Column Name</th>
                      <th className="px-6 py-4 text-ivory/50 font-medium text-sm">Data Type</th>
                      <th className="px-6 py-4 text-ivory/50 font-medium text-sm">Constraints</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm">
                    {schema.columns.map((col, idx) => (
                      <tr key={col}>
                        <td className="px-6 py-4 font-medium text-ivory flex items-center gap-2">
                          {col}
                          {schema.pks.includes(col) && <Shield size={14} className="text-amber-500" title="Primary Key" />}
                        </td>
                        <td className="px-6 py-4 text-amber-500/80 font-mono text-xs">{schema.types[idx].toUpperCase()}</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            {schema.pks.includes(col) ? (
                              <span className="px-2 py-1 rounded bg-amber-500/10 text-amber-500 text-xs border border-amber-500/20">PRIMARY KEY</span>
                            ) : (
                              <span className="px-2 py-1 rounded bg-white/5 text-ivory/50 text-xs border border-white/10">NULLABLE</span>
                            )}
                            {col.endsWith('_id') && (
                              <span className="px-2 py-1 rounded bg-terracotta/10 text-terracotta text-xs border border-terracotta/20">FOREIGN KEY</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'query' && (
            <div className="flex flex-col h-full">
              <div className="p-4 border-b border-white/10 bg-black/40">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium text-ivory/70">SQL Editor</h3>
                  <button 
                    onClick={runQuery}
                    className="flex items-center gap-2 px-4 py-2 bg-sage hover:bg-sage/80 text-obsidian font-bold rounded-lg transition-colors text-sm"
                  >
                    <Play size={14} /> Run Query (F5)
                  </button>
                </div>
                <textarea 
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  className="w-full h-32 bg-[#0A0A0A] border border-white/10 rounded-lg p-4 text-amber-500 font-mono text-sm focus:outline-none focus:border-amber-500/50 resize-y"
                  spellCheck="false"
                />
                <div className="mt-2 flex gap-4 text-xs text-ivory/40">
                  <span className="flex items-center gap-1"><AlertCircle size={12}/> Limited query mode</span>
                  <span className="flex items-center gap-1"><Server size={12}/> Target: fhcc-prod-db-01</span>
                </div>
              </div>
              
              <div className="flex-1 p-4 bg-[#0D0D0D] overflow-auto">
                <h3 className="text-sm font-medium text-ivory/70 mb-4">Results</h3>
                {queryResult ? (
                  queryResult[0]?.error ? (
                    <div className="p-4 rounded-lg bg-crimson/10 border border-crimson/20 text-crimson text-sm font-mono">
                      {queryResult[0].error}
                    </div>
                  ) : (
                    <div className="frosted-panel rounded-xl overflow-hidden border border-white/10">
                      <table className="w-full text-sm text-left whitespace-nowrap">
                        <thead className="bg-black/40 border-b border-white/10">
                          <tr>
                            {Object.keys(queryResult[0] || {}).map(k => (
                              <th key={k} className="px-4 py-3 font-medium text-ivory/50">{k}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {queryResult.map((r, i) => (
                            <tr key={i} className="hover:bg-white/5">
                              {Object.values(r).map((v: any, vi) => (
                                <td key={vi} className="px-4 py-2 text-ivory/80">{String(v)}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-ivory/20">
                    <p>Run a query to see results here</p>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
