import React, { useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { collection, addDoc, query, where, onSnapshot, updateDoc, doc, Timestamp, orderBy } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { Task } from '../types';

export default function Tasks() {
  const { user, profile } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [objectives, setObjectives] = useState<{id: string, name: string}[]>([]);
  const [taskName, setTaskName] = useState('');
  const [selectedObjective, setSelectedObjective] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  // 1. Rafraîchissement du chrono interne toutes les secondes
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 2. Récupération des données (Tâches + Objectifs réels)
  useEffect(() => {
    if (!user) return;

    // Charger les objectifs pour le sélecteur
    const unsubObjs = onSnapshot(collection(db, "objectives"), (snap) => {
      setObjectives(snap.docs.map(d => ({ id: d.id, name: d.data().name })));
    });
    
    // Charger les tâches de l'utilisateur
    const q = query(
      collection(db, "tasks"), 
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );
    
    const unsubTasks = onSnapshot(q, (snapshot) => {
      setTasks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task)));
    });
    
    return () => { unsubObjs(); unsubTasks(); };
  }, [user]);

  // 3. Actions : Démarrer / Arrêter
  const handleStartTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskName || !selectedObjective || !user || !profile) return;

    const newTask = {
      name: taskName,
      objectiveId: selectedObjective,
      userId: user.uid,
      agentName: profile.name,
      departmentId: profile.departmentId,
      status: 'EN_COURS',
      startTime: Timestamp.now(),
      durationSeconds: 0,
      createdAt: Timestamp.now()
    };

    await addDoc(collection(db, "tasks"), newTask);
    setTaskName('');
    setSelectedObjective('');
  };

  const handleStopTask = async (taskId: string, startTime: any) => {
    const endTime = Timestamp.now();
    const duration = endTime.seconds - startTime.seconds;
    
    await updateDoc(doc(db, "tasks", taskId), {
      endTime: endTime,
      durationSeconds: duration,
      status: 'TERMINE'
    });
  };

  // Formatage élégant de la durée
  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + 'h ' : ''}${m}m ${s}s`;
  };

  const activeTasks = tasks.filter(t => t.status === 'EN_COURS');
  const completedTasks = tasks.filter(t => t.status !== 'EN_COURS');

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full font-sans">
      
      {/* Header */}
      <header className="mb-10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-bgfi-blue">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Time Tracking</h1>
            <p className="text-slate-500 text-sm font-medium">Déclarez vos activités en temps réel</p>
          </div>
        </div>
      </header>

      {/* Formulaire de démarrage rapide */}
      <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 mb-10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-bgfi-blue to-bgfi-olive"></div>
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Nouvelle Session de Travail</h2>
        <form onSubmit={handleStartTask} className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-end">
          <div className="lg:col-span-2">
            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Désignation de l'activité</label>
            <input 
              type="text" placeholder="Sur quoi travaillez-vous ?" 
              value={taskName} onChange={(e) => setTaskName(e.target.value)} required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-bgfi-blue/20 transition-all outline-none"
            />
          </div>
          <div className="lg:col-span-2">
            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Axe Stratégique</label>
            <select 
              value={selectedObjective} onChange={(e) => setSelectedObjective(e.target.value)} required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-bgfi-blue/20 transition-all outline-none appearance-none"
            >
              <option value="">Sélectionner un objectif...</option>
              {objectives.map(obj => <option key={obj.id} value={obj.name}>{obj.name}</option>)}
            </select>
          </div>
          <button type="submit" className="bg-bgfi-blue text-white h-[50px] rounded-xl font-bold flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-bgfi-blue/20">
            <span className="flex h-2 w-2 rounded-full bg-red-400 animate-ping"></span>
            Lancer le chrono
          </button>
        </form>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Colonne GAUCHE : Activités en cours */}
        <div className="xl:col-span-4 space-y-6">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 px-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            En direct ({activeTasks.length})
          </h3>
          
          {activeTasks.length === 0 ? (
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-10 text-center">
              <p className="text-slate-400 text-sm font-medium italic">Aucun chronomètre actif.</p>
            </div>
          ) : (
            activeTasks.map(task => {
              const start = task.startTime?.toDate();
              const elapsed = start ? Math.floor((currentTime.getTime() - start.getTime()) / 1000) : 0;
              
              return (
                <div key={task.id} className="bg-white border-2 border-bgfi-blue/10 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-2 py-1 bg-bgfi-blue/5 text-bgfi-blue text-[10px] font-bold rounded uppercase tracking-tighter">
                      {task.objectiveId}
                    </span>
                    <span className="text-xs font-mono font-bold text-red-500 animate-pulse">LIVE</span>
                  </div>
                  <h4 className="font-bold text-slate-800 text-lg mb-1">{task.name}</h4>
                  <div className="text-2xl font-black text-slate-900 mb-6 font-mono tracking-tighter">
                    {formatDuration(elapsed)}
                  </div>
                  <button 
                    onClick={() => handleStopTask(task.id, task.startTime)}
                    className="w-full py-3 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-xl font-bold transition-all border border-red-100"
                  >
                    Clôturer l'activité
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Colonne DROITE : Historique */}
        <div className="xl:col-span-8 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
            <h3 className="font-bold text-slate-800 tracking-tight">Registre d'activité récent</h3>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Dernières 24h</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-50">
                  <th className="p-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Activité</th>
                  <th className="p-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Axe</th>
                  <th className="p-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Durée</th>
                  <th className="p-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">État</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {completedTasks.length === 0 ? (
                  <tr><td colSpan={4} className="p-10 text-center text-slate-400 text-sm italic">Aucun historique disponible.</td></tr>
                ) : (
                  completedTasks.map(task => (
                    <tr key={task.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="p-5">
                        <p className="font-bold text-slate-700 text-sm">{task.name}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5 uppercase tracking-tighter">Le {new Date(task.createdAt?.toDate()).toLocaleDateString()}</p>
                      </td>
                      <td className="p-5">
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-full border border-slate-200 uppercase tracking-tighter">
                          {task.objectiveId}
                        </span>
                      </td>
                      <td className="p-5 text-center font-mono font-bold text-slate-600 text-sm">
                        {formatDuration(task.durationSeconds)}
                      </td>
                      <td className="p-5 text-right">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${
                          task.status === 'VALIDE' 
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                          : 'bg-amber-50 text-amber-600 border-amber-100'
                        }`}>
                          {task.status === 'VALIDE' ? 'Validé' : 'En attente'}
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
  );
}