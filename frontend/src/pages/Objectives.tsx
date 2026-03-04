import React, { useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { collection, addDoc, query, onSnapshot, Timestamp } from 'firebase/firestore';

// Interface locale pour le typage
interface Objective {
  id: string;
  name: string;
  createdAt?: any;
}

export default function Objectives() {
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [newObjectiveName, setNewObjectiveName] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Récupération des objectifs stratégiques en temps réel
  useEffect(() => {
    const q = query(collection(db, "objectives"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedObjectives = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as Objective));
      
      // Tri alphabétique côté client
      fetchedObjectives.sort((a, b) => a.name.localeCompare(b.name));
      setObjectives(fetchedObjectives);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // 2. Ajout d'un nouvel objectif
  const handleAddObjective = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newObjectiveName.trim()) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "objectives"), {
        name: newObjectiveName.trim(),
        createdAt: Timestamp.now()
      });
      setNewObjectiveName(''); // Réinitialisation du champ
    } catch (error) {
      console.error("Erreur lors de l'ajout :", error);
      alert("Une erreur est survenue lors de la création de l'objectif.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-5">
          <div className="relative flex justify-center items-center">
            <div className="absolute h-12 w-12 rounded-full border-4 border-slate-100"></div>
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-bgfi-blue border-t-transparent"></div>
          </div>
          <p className="text-slate-400 font-semibold animate-pulse text-xs uppercase tracking-widest">Chargement des axes stratégiques...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full font-sans">
      
      {/* En-tête de la page Premium */}
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <div className="h-12 w-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-bgfi-blue">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-800 tracking-tight">Axes Stratégiques</h1>
              <p className="text-slate-500 text-sm font-medium mt-0.5">
                Définition et pilotage des objectifs de performance de la banque
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Colonne Gauche : Formulaire de création */}
        <div className="xl:col-span-4">
          <div className="sticky top-6 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-bgfi-blue to-bgfi-blue/60"></div>
            
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-bgfi-blue/10 text-bgfi-blue rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </div>
                <h2 className="text-lg font-bold text-slate-800">Nouvel Objectif</h2>
              </div>

              <form onSubmit={handleAddObjective} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                    Nom de l'axe stratégique
                  </label>
                  <input 
                    type="text"
                    placeholder="Ex: PNB, Maîtrise des risques..." 
                    value={newObjectiveName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewObjectiveName(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-bgfi-blue/20 focus:border-bgfi-blue focus:bg-white transition-all duration-200 font-medium"
                  />
                </div>
                
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full flex justify-center items-center gap-2 bg-bgfi-blue text-white py-3 rounded-xl font-bold shadow-md shadow-bgfi-blue/20 hover:bg-opacity-90 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                      Enregistrer l'axe
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Colonne Droite : Liste des objectifs */}
        <div className="xl:col-span-8">
          <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col h-full overflow-hidden">
            
            <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-white/50">
              <div>
                <h2 className="text-lg font-bold text-slate-800">Axes Définis</h2>
                <p className="text-xs text-slate-400 mt-1">Objectifs stratégiques pour la période en cours</p>
              </div>
              <span className="bg-bgfi-blue/10 text-bgfi-blue text-xs px-3 py-1.5 rounded-full font-bold border border-bgfi-blue/20">
                {objectives.length} objectif{objectives.length > 1 ? 's' : ''}
              </span>
            </div>
            
            <div className="overflow-x-auto flex-1 p-2">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr>
                    <th className="pb-4 pt-2 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Intitulé de l'Objectif</th>
                    <th className="pb-4 pt-2 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 text-right w-1/3">UID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {objectives.length === 0 ? (
                    <tr>
                      <td colSpan={2} className="py-12 text-center text-slate-400 italic text-sm">
                        Aucun axe stratégique n'a encore été défini.
                      </td>
                    </tr>
                  ) : (
                    objectives.map((obj) => (
                      <tr key={obj.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3.5">
                            <div className="h-9 w-9 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-xs border border-slate-200 group-hover:bg-bgfi-olive group-hover:text-white group-hover:border-bgfi-olive transition-all shadow-sm">
                              {obj.name.substring(0, 1).toUpperCase()}
                            </div>
                            <span className="font-semibold text-sm text-slate-700">{obj.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <span className="font-mono text-[11px] text-slate-400 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                            {obj.id}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}