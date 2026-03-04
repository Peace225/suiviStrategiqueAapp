import React, { useEffect, useState } from 'react';
import { db } from '../services/firebase';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { Task } from '../types';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "tasks"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTasks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task)));
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const statsByObjective: { [key: string]: number } = {
    'PNB': 0,
    'Développement Commercial': 0,
    'Expérience Client': 0,
    'Maîtrise des Frais Généraux': 0,
    'Maîtrise des Pertes Opérationnelles': 0
  };

  tasks.forEach(task => {
    if (task.objectiveId && statsByObjective.hasOwnProperty(task.objectiveId)) {
      statsByObjective[task.objectiveId] += (task.durationSeconds || 0) / 3600;
    }
  });

  const chartLabels = Object.keys(statsByObjective);
  const chartDataValues = Object.values(statsByObjective);

  const doughnutData = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Heures allouées',
        data: chartDataValues,
        backgroundColor: [
          '#0E4A7A', // Bleu BGFI
          '#A9B18F', // Olive BGFI
          '#1E293B', // Slate 800
          '#64748B', // Slate 500
          '#CBD5E1'  // Slate 300
        ],
        borderWidth: 0, // Retrait des bordures pour un look plus "smooth"
        hoverOffset: 4,
        borderRadius: 4, // Arrondit subtilement les segments du graphique
      },
    ],
  };

  const chartOptions = {
    maintainAspectRatio: false,
    cutout: '80%', // Anneau plus fin et élégant
    plugins: {
      legend: {
        display: false, // On masque la légende par défaut pour utiliser notre tableau personnalisé à côté
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)', // Tooltip sombre premium
        titleFont: { size: 13, family: "'Inter', sans-serif" },
        bodyFont: { size: 12, family: "'Inter', sans-serif" },
        padding: 12,
        cornerRadius: 6,
        boxPadding: 6,
      }
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
          <p className="text-slate-400 font-semibold animate-pulse text-xs uppercase tracking-widest">Synchronisation des données...</p>
        </div>
      </div>
    );
  }

  const totalHours = chartDataValues.reduce((a, b) => a + b, 0);
  const pendingTasks = tasks.filter(t => t.status === 'En attente' || t.status === 'Terminé').length;
  const validationRate = tasks.length > 0 ? ((tasks.filter(t => t.status === 'Validé').length / tasks.length) * 100).toFixed(0) : 0;

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full font-sans">
      
      {/* En-tête Premium */}
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <div className="h-12 w-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-bgfi-blue">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-800 tracking-tight">Tableau de Synthèse</h1>
              <p className="text-slate-500 text-sm font-medium mt-0.5">
                Pilotage des performances et allocation des ressources
              </p>
            </div>
          </div>
        </div>
        
        <button className="group bg-white text-slate-700 px-5 py-2.5 rounded-lg text-sm font-semibold shadow-sm border border-slate-200 hover:border-bgfi-blue hover:text-bgfi-blue transition-all flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:-translate-y-0.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
          Générer l'extrait
        </button>
      </header>

      {/* Section : Cartes KPI avec design "Float" */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        
        {/* Carte 1 */}
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-6 flex flex-col justify-between relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-bgfi-blue to-bgfi-blue/60"></div>
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Volume Global Saisi</h3>
            <div className="p-2.5 bg-slate-50 text-bgfi-blue rounded-lg group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-4xl font-black text-slate-800 tracking-tight">
              {totalHours.toFixed(1)}
            </p>
            <span className="text-sm font-semibold text-slate-400">heures cumulées</span>
          </div>
        </div>

        {/* Carte 2 */}
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-6 flex flex-col justify-between relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-bgfi-olive to-bgfi-olive/60"></div>
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Tâches en Attente</h3>
            <div className="p-2.5 bg-slate-50 text-bgfi-olive rounded-lg group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-4xl font-black text-slate-800 tracking-tight">
              {pendingTasks}
            </p>
            <span className="text-sm font-semibold text-slate-400">à clôturer</span>
          </div>
        </div>

        {/* Carte 3 */}
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-6 flex flex-col justify-between relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-emerald-400"></div>
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Taux de Complétion</h3>
            <div className="p-2.5 bg-slate-50 text-emerald-500 rounded-lg group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <p className="text-4xl font-black text-slate-800 tracking-tight">
              {validationRate}
            </p>
            <span className="text-xl font-bold text-emerald-500">%</span>
          </div>
        </div>
      </div>

      {/* Section : Graphique & Tableau */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Graphique (Doughnut) - Prend 5 colonnes */}
        <div className="xl:col-span-5 bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Allocation Stratégique</h2>
              <p className="text-xs text-slate-400 mt-1">Distribution en temps réel</p>
            </div>
          </div>
          <div className="flex-1 flex justify-center items-center relative py-6">
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-4xl font-black text-slate-800 tracking-tighter">{totalHours.toFixed(0)}<span className="text-xl text-slate-400 ml-1">h</span></span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Total Enregistré</span>
            </div>
            <div className="w-full max-w-[280px] h-[280px]">
              <Doughnut data={doughnutData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Tableau de bord détaillé - Prend 7 colonnes */}
        <div className="xl:col-span-7 bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Détail Analytique</h2>
              <p className="text-xs text-slate-400 mt-1">Ventilation des heures par axe de développement</p>
            </div>
          </div>
          
          <div className="overflow-x-auto flex-1 mt-2">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Axe Stratégique</th>
                  <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 text-right">Volume</th>
                  <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 w-2/5 text-right">Répartition</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {chartLabels.map((label, index) => {
                  const percentage = totalHours > 0 ? ((chartDataValues[index] / totalHours) * 100).toFixed(1) : "0.0";
                  const color = doughnutData.datasets[0].backgroundColor[index];
                  
                  return (
                    <tr key={label} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="py-4 text-sm font-semibold text-slate-700 flex items-center gap-3">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }}></span>
                        {label}
                      </td>
                      <td className="py-4 text-sm font-mono font-medium text-slate-600 text-right pr-4">
                        {chartDataValues[index].toFixed(1)}h
                      </td>
                      <td className="py-4">
                        <div className="flex items-center justify-end gap-4">
                          <span className="text-xs font-bold text-slate-500 w-12 text-right">{percentage}%</span>
                          <div className="w-28 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full rounded-full transition-all duration-1000 ease-out"
                              style={{ width: `${percentage}%`, backgroundColor: color }}
                            ></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}