import React, { useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { collection, addDoc, query, onSnapshot, Timestamp, writeBatch, doc } from 'firebase/firestore';

// Interface locale pour le typage
interface Department {
  id: string;
  name: string;
  createdAt?: any;
}

export default function Departments() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [newDeptName, setNewDeptName] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Récupération des départements en temps réel
  useEffect(() => {
    const q = query(collection(db, "departments"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedDepts = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as Department));
      
      // Tri alphabétique pour un affichage professionnel
      fetchedDepts.sort((a, b) => a.name.localeCompare(b.name));
      setDepartments(fetchedDepts);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // 2. Fonction de "Seeding" pour ajouter les directions BGFIBank par défaut
  const seedDepartments = async () => {
    if (!window.confirm("Voulez-vous injecter les directions institutionnelles par défaut ?")) return;
    
    setIsSubmitting(true);
    const defaultDepts = [
      "Direction Générale",
      "Direction des Systèmes d'Information (DSI)",
      "Direction Financière et Comptable",
      "Direction du Capital Humain",
      "Direction du Crédit et des Risques",
      "Direction de l'Audit et du Contrôle",
      "Direction de l'Expérience Client",
      "Direction des Opérations"
    ];

    try {
      const batch = writeBatch(db);
      defaultDepts.forEach((name) => {
        const newDocRef = doc(collection(db, "departments"));
        batch.set(newDocRef, {
          name,
          createdAt: Timestamp.now()
        });
      });
      await batch.commit();
      alert("Configuration initiale terminée avec succès !");
    } catch (error) {
      console.error("Erreur lors du seeding :", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. Ajout manuel d'un nouveau département
  const handleAddDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeptName.trim()) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "departments"), {
        name: newDeptName.trim(),
        createdAt: Timestamp.now()
      });
      setNewDeptName(''); 
    } catch (error) {
      console.error("Erreur lors de l'ajout :", error);
      alert("Une erreur est survenue.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-5">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-bgfi-blue border-t-transparent"></div>
          <p className="text-slate-400 font-bold animate-pulse text-xs uppercase tracking-widest">Initialisation structurelle...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full font-sans">
      
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <div className="h-12 w-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-bgfi-blue">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-800 tracking-tight">Gestion des Directions</h1>
              <p className="text-slate-500 text-sm font-medium">Administration de l'organigramme institutionnel</p>
            </div>
          </div>
        </div>

        {/* Bouton de configuration rapide (Seeder) */}
        {departments.length === 0 && (
          <button 
            onClick={seedDepartments}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg text-xs font-bold hover:bg-black transition-all shadow-lg"
          >
            🚀 Configuration Rapide
          </button>
        )}
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Formulaire de création */}
        <div className="xl:col-span-4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden sticky top-6">
            <div className="h-1 bg-bgfi-blue w-full"></div>
            <div className="p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-bgfi-blue"></span>
                Nouvelle Entité
              </h2>
              <form onSubmit={handleAddDepartment} className="space-y-5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Libellé de la direction</label>
                  <input 
                    type="text" placeholder="Ex: Direction IT..." value={newDeptName}
                    onChange={(e) => setNewDeptName(e.target.value)} required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-bgfi-blue/20 outline-none transition-all font-medium"
                  />
                </div>
                <button 
                  type="submit" disabled={isSubmitting}
                  className="w-full py-3.5 bg-bgfi-blue text-white rounded-xl font-bold shadow-lg shadow-bgfi-blue/20 hover:scale-[1.01] transition-all disabled:opacity-50"
                >
                  {isSubmitting ? "Traitement..." : "Enregistrer la direction"}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Liste des directions */}
        <div className="xl:col-span-8">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
              <h3 className="font-bold text-slate-800 tracking-tight">Registre des Entités ({departments.length})</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white">
                    <th className="py-4 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Direction / Département</th>
                    <th className="py-4 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 text-right">Identifiant</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {departments.length === 0 ? (
                    <tr>
                      <td colSpan={2} className="py-20 text-center text-slate-400 italic text-sm">
                        Aucune entité n'est configurée pour le moment.
                      </td>
                    </tr>
                  ) : (
                    departments.map((dept) => (
                      <tr key={dept.id} className="group hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-4">
                            <div className="h-9 w-9 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-[10px] border border-slate-200 group-hover:bg-bgfi-blue group-hover:text-white transition-all">
                              {dept.name.substring(0, 2).toUpperCase()}
                            </div>
                            <span className="font-bold text-slate-700 text-sm">{dept.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <span className="font-mono text-[10px] text-slate-400 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                            {dept.id}
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