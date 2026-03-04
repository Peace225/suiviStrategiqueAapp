import React, { useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { collection, addDoc, query, onSnapshot, Timestamp } from 'firebase/firestore';

// Interfaces locales
interface Process {
  id: string;
  name: string;
  departmentId: string;
  objectiveId: string;
}

interface Department { id: string; name: string; }
interface Objective { id: string; name: string; }

export default function Processes() {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [objectives, setObjectives] = useState<Objective[]>([]);
  
  const [newProcessName, setNewProcessName] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedObj, setSelectedObj] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const unsubDepts = onSnapshot(collection(db, "departments"), (snapshot) => {
      setDepartments(snapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name })));
    });

    const unsubObjs = onSnapshot(collection(db, "objectives"), (snapshot) => {
      setObjectives(snapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name })));
    });

    const unsubProcesses = onSnapshot(collection(db, "processes"), (snapshot) => {
      const fetchedProcesses = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as Process));
      
      fetchedProcesses.sort((a, b) => a.name.localeCompare(b.name));
      setProcesses(fetchedProcesses);
      setLoading(false);
    });

    return () => {
      unsubDepts();
      unsubObjs();
      unsubProcesses();
    };
  }, []);

  const handleAddProcess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProcessName.trim() || !selectedDept || !selectedObj) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "processes"), {
        name: newProcessName.trim(),
        departmentId: selectedDept,
        objectiveId: selectedObj,
        createdAt: Timestamp.now()
      });
      setNewProcessName('');
      setSelectedDept('');
      setSelectedObj('');
    } catch (error) {
      console.error("Erreur lors de l'ajout :", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDeptName = (id: string) => departments.find(d => d.id === id)?.name || "Non assigné";
  const getObjName = (id: string) => objectives.find(o => o.id === id)?.name || "Non assigné";

  if (loading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-5">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-bgfi-blue border-t-transparent"></div>
          <p className="text-slate-400 font-semibold animate-pulse text-xs uppercase tracking-widest">Initialisation de la cartographie...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full font-sans">
      
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-bgfi-blue">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Cartographie Métier</h1>
            <p className="text-slate-500 text-sm font-medium mt-0.5">Liaison des processus opérationnels aux axes stratégiques</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Formulaire de création */}
        <div className="xl:col-span-4">
          <div className="sticky top-6 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="h-1 bg-bgfi-blue w-full opacity-80"></div>
            <div className="p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-bgfi-blue"></span>
                Nouveau Processus
              </h2>
              
              <form onSubmit={handleAddProcess} className="space-y-5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Libellé du processus</label>
                  <input 
                    type="text" placeholder="Ex: Gestion des virements..." value={newProcessName}
                    onChange={(e) => setNewProcessName(e.target.value)} required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-bgfi-blue/20 focus:border-bgfi-blue transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Direction responsable</label>
                  <select 
                    value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)} required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-bgfi-blue/20 transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Sélectionner une direction...</option>
                    {departments.map(dept => <option key={dept.id} value={dept.id}>{dept.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Axe Stratégique rattaché</label>
                  <select 
                    value={selectedObj} onChange={(e) => setSelectedObj(e.target.value)} required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-bgfi-blue/20 transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Sélectionner un axe...</option>
                    {objectives.map(obj => <option key={obj.id} value={obj.id}>{obj.name}</option>)}
                  </select>
                </div>

                <button 
                  type="submit" disabled={isSubmitting}
                  className="w-full py-3.5 bg-bgfi-blue text-white rounded-xl font-bold shadow-lg shadow-bgfi-blue/20 hover:scale-[1.02] transition-all disabled:opacity-50"
                >
                  {isSubmitting ? "Création..." : "Enregistrer le processus"}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Liste des processus */}
        <div className="xl:col-span-8">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex justify-between items-center">
              <h3 className="font-bold text-slate-800">Répertoire des Processus ({processes.length})</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="py-4 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Désignation</th>
                    <th className="py-4 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Liaisons</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {processes.map((proc) => (
                    <tr key={proc.id} className="group hover:bg-slate-50/80 transition-colors">
                      <td className="py-5 px-6">
                        <p className="font-bold text-slate-700 group-hover:text-bgfi-blue transition-colors">{proc.name}</p>
                        <p className="text-[10px] font-mono text-slate-400 mt-1 uppercase tracking-tighter">REF: {proc.id.substring(0,8)}</p>
                      </td>
                      <td className="py-5 px-6">
                        <div className="flex flex-wrap gap-2">
                          <span className="px-3 py-1 bg-blue-50 text-bgfi-blue text-[10px] font-bold rounded-full border border-blue-100 uppercase tracking-wider">
                            🏢 {getDeptName(proc.departmentId)}
                          </span>
                          <span className="px-3 py-1 bg-bgfi-olive/10 text-bgfi-olive text-[10px] font-bold rounded-full border border-bgfi-olive/20 uppercase tracking-wider">
                            🎯 {getObjName(proc.objectiveId)}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}