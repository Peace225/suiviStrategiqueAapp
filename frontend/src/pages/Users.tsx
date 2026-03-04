import React, { useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { collection, query, onSnapshot } from 'firebase/firestore';
import UserForm from '../components/forms/UserForm';
import { UserProfile } from '../types';

export default function Users() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [departments, setDepartments] = useState<{id: string, name: string}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Écoute des départements pour le formulaire
    const unsubDepts = onSnapshot(collection(db, "departments"), (snap) => {
      setDepartments(snap.docs.map(d => ({ id: d.id, name: d.data().name })));
    });

    // Écoute des utilisateurs pour la liste
    const unsubUsers = onSnapshot(query(collection(db, "users")), (snap) => {
      setUsers(snap.docs.map(d => ({ uid: d.id, ...d.data() } as UserProfile)));
      setLoading(false);
    });

    return () => { unsubDepts(); unsubUsers(); };
  }, []);

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center font-black text-bgfi-blue">
      BGFIBank - Chargement...
    </div>
  );

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full font-sans">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-bgfi-blue">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Gestion des Collaborateurs</h1>
            <p className="text-slate-500 text-sm font-medium italic">Administration des accès institutionnels</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* COLONNE GAUCHE : FORMULAIRE EXTRÉISÉ */}
        <div className="xl:col-span-4">
          <UserForm departments={departments} onSuccess={() => {}} />
        </div>

        {/* COLONNE DROITE : LISTE */}
        <div className="xl:col-span-8">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
             <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                <h3 className="font-bold text-slate-800 tracking-tight">Répertoire des Utilisateurs ({users.length})</h3>
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="py-4 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Collaborateur</th>
                      <th className="py-4 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Lieu d'affectation</th>
                      <th className="py-4 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">État</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {users.map((u) => (
                      <tr key={u.uid} className="group hover:bg-slate-50/80 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-bgfi-blue text-white flex items-center justify-center font-black text-xs shadow-inner">
                              {u.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-slate-700 text-sm">{u.name}</p>
                              <p className="text-[10px] text-slate-400 font-medium">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                           <p className="text-xs font-black text-bgfi-blue uppercase mb-0.5">{u.role}</p>
                           <p className="text-[10px] font-bold text-slate-400 uppercase">🏢 {u.departmentId}</p>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 inline-block ring-4 ring-emerald-50"></span>
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