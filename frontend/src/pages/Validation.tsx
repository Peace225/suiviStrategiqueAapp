import React, { useEffect, useState } from 'react';
import { db } from '../services/firebase';
import { collection, query, where, onSnapshot, updateDoc, doc, Timestamp, orderBy } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { Task } from '../types';

export default function Validation() {
  const { profile } = useAuth(); 
  const [pendingTasks, setPendingTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    // On attend que le profil soit chargé et qu'il possède un département
    if (!profile?.departmentId) return;

    // Requête optimisée : Tâches "TERMINE" du département, triées par date
    const q = query(
      collection(db, "tasks"),
      where("departmentId", "==", profile.departmentId),
      where("status", "==", "TERMINE"),
      orderBy("createdAt", "desc") // Nécessite un index composite dans Firebase
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as Task));
      setPendingTasks(fetched);
      setLoading(false);
    }, (error) => {
      console.error("Erreur Firestore (Vérifiez vos index) :", error);
      setLoading(false);
    });

    return unsubscribe;
  }, [profile?.departmentId]);

  // Validation d'une activité
  const handleValidate = async (taskId: string) => {
    try {
      await updateDoc(doc(db, "tasks", taskId), {
        status: 'VALIDE',
        validatedBy: profile?.name || "Manager",
        managerComment: comment[taskId] || "",
        validatedAt: Timestamp.now()
      });
      
      // Nettoyage du commentaire après validation
      setComment(prev => {
        const newState = { ...prev };
        delete newState[taskId];
        return newState;
      });
    } catch (error) {
      console.error("Erreur de validation:", error);
    }
  };

  // Rejet pour correction (renvoie vers l'agent en statut 'EN_COURS')
  const handleReject = async (taskId: string) => {
    if (!comment[taskId]?.trim()) {
      alert("Un commentaire est obligatoire pour justifier le rejet d'une activité.");
      return;
    }
    
    try {
      await updateDoc(doc(db, "tasks", taskId), {
        status: 'EN_COURS', // Redevient modifiable par l'agent
        managerComment: comment[taskId],
        rejectedAt: Timestamp.now()
      });
    } catch (error) {
      console.error("Erreur de rejet:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-bgfi-blue border-t-transparent"></div>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Chargement du flux de validation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full font-sans">
      
      {/* Header Premium */}
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-bgfi-blue">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Validation Hiérarchique</h1>
            <p className="text-slate-500 text-sm font-medium">Entité : <span className="text-bgfi-blue font-bold">{profile?.departmentId}</span></p>
          </div>
        </div>
      </header>

      {pendingTasks.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-20 text-center shadow-sm">
          <div className="mx-auto w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-300">
             <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
          <h3 className="text-xl font-bold text-slate-400">Aucune attente</h3>
          <p className="text-slate-400 text-sm mt-2 font-medium">Toutes les activités de votre département ont été traitées.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {pendingTasks.map((task) => (
            <div key={task.id} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:border-bgfi-blue/10 transition-all group relative overflow-hidden">
              <div className="absolute top-0 left-0 h-full w-1.5 bg-amber-400 group-hover:bg-bgfi-blue transition-colors"></div>
              
              <div className="flex flex-col xl:flex-row justify-between gap-8 pl-2">
                
                {/* Détails de l'activité */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-bgfi-blue text-white text-[10px] font-black rounded-full uppercase tracking-widest shadow-sm">
                      {task.objectiveId}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                      Agent: {task.agentName || "Utilisateur"}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-bgfi-blue transition-colors">{task.name}</h3>
                  
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      <span className="text-sm font-black font-mono tracking-tighter">
                        {Math.floor(task.durationSeconds / 3600)}h {Math.floor((task.durationSeconds % 3600) / 60)}min
                      </span>
                    </div>
                    <p className="text-slate-400 text-[11px] font-bold uppercase tracking-tight">
                      Soumis le {task.createdAt ? new Date(task.createdAt.toDate()).toLocaleDateString() : '---'}
                    </p>
                  </div>
                </div>

                {/* Zone de décision Manager */}
                <div className="xl:w-[420px] flex flex-col gap-4">
                  <div className="relative">
                    <textarea
                      placeholder="Instructions de validation ou motif de rejet..."
                      className="w-full text-sm border border-slate-200 bg-slate-50 rounded-2xl p-4 h-28 resize-none focus:ring-4 focus:ring-bgfi-blue/5 focus:border-bgfi-blue outline-none transition-all placeholder:text-slate-400 font-medium"
                      value={comment[task.id!] || ""}
                      onChange={(e) => setComment({ ...comment, [task.id!]: e.target.value })}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => handleReject(task.id!)}
                      className="py-3.5 px-4 bg-white border-2 border-slate-100 text-slate-500 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all flex items-center justify-center gap-2 active:scale-95"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                      Rejeter
                    </button>
                    <button
                      onClick={() => handleValidate(task.id!)}
                      className="py-3.5 px-4 bg-bgfi-blue text-white rounded-xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-bgfi-blue/20 hover:bg-slate-800 hover:translate-y-[-2px] active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                      Approuver
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}