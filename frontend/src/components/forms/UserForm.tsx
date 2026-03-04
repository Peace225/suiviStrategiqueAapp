import React, { useState } from 'react';
import { auth, db } from '../../services/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, Timestamp } from 'firebase/firestore';

interface UserFormProps {
  departments: { id: string; name: string }[];
  onSuccess: () => void;
}

export default function UserForm({ departments, onSuccess }: UserFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Agent' as 'Agent' | 'Chef de département' | 'Administrateur',
    departmentId: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || !formData.departmentId) return;

    setIsSubmitting(true);
    try {
      // 1. Création dans Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );

      // 2. Enregistrement du profil dans Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        departmentId: formData.departmentId,
        createdAt: Timestamp.now()
      });

      // 3. Réinitialisation
      setFormData({ name: '', email: '', password: '', role: 'Agent', departmentId: '' });
      onSuccess();
      alert("Collaborateur créé avec succès !");
    } catch (error: any) {
      alert("Erreur: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-visible">
      <div className="h-2 bg-bgfi-blue w-full rounded-t-2xl"></div>
      <div className="p-6">
        <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-bgfi-blue"></span> Nouveau Compte
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Nom Complet</label>
            <input 
              type="text" required value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-bgfi-blue/20 outline-none transition-all text-sm font-medium"
              placeholder="ex: Jean Dupont"
            />
          </div>

          <div className="grid grid-cols-1 gap-4">
            {/* SÉLECTEUR DE RÔLE */}
            <div className="relative">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Rôle au sein de la banque</label>
              <select 
                value={formData.role} 
                onChange={e => setFormData({...formData, role: e.target.value as any})}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700 focus:ring-2 focus:ring-bgfi-blue/20 outline-none cursor-pointer hover:border-bgfi-blue/50 transition-colors shadow-sm"
              >
                <option value="Agent">Agent Opérationnel</option>
                <option value="Chef de département">Chef de Département</option>
                <option value="Administrateur">Administrateur Système</option>
              </select>
            </div>

            {/* SÉLECTEUR DE DIRECTION */}
            <div className="relative">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Direction / Département</label>
              <select 
                required value={formData.departmentId} 
                onChange={e => setFormData({...formData, departmentId: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700 focus:ring-2 focus:ring-bgfi-blue/20 outline-none cursor-pointer hover:border-bgfi-blue/50 transition-colors shadow-sm"
              >
                <option value="" disabled>Choisir la direction...</option>
                {departments.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Identifiants de connexion</label>
            <input 
              type="email" required value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-3 mb-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-bgfi-blue/20 outline-none transition-all text-sm font-medium"
              placeholder="email@bgfi.com"
            />
            <input 
              type="password" required value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-bgfi-blue/20 outline-none transition-all text-sm font-medium"
              placeholder="Mot de passe"
            />
          </div>

          <button 
            type="submit" disabled={isSubmitting}
            className="w-full mt-6 py-4 bg-bgfi-blue text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-bgfi-blue/30 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
          >
            {isSubmitting ? "Initialisation..." : "Valider l'inscription"}
          </button>
        </form>
      </div>
    </div>
  );
}