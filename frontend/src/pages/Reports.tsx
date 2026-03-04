import React, { useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Task } from '../types';

export default function Reports() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const q = query(collection(db, "tasks"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        setTasks(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task)));
      } catch (error) {
        console.error("Erreur lors de la récupération des rapports:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  // --- EXPORT EXCEL ---
  const exportToExcel = () => {
    const dataToExport = tasks.map(t => ({
      "Agent ID": t.agentId,
      "Axe Stratégique": t.objectiveId,
      "Désignation Tâche": t.nom,
      "Durée (Minutes)": Math.floor(t.durationSeconds / 60),
      "Statut Validation": t.status,
      "Date d'enregistrement": t.createdAt ? new Date(t.createdAt.seconds * 1000).toLocaleDateString() : "N/A",
      "Commentaire": t.comment || ""
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data_BGFIBank");
    XLSX.writeFile(workbook, `BGFIBank_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  // --- EXPORT PDF ---
  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Header Institutionnel
    doc.setFillColor(14, 74, 122); // Bleu BGFI
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text("BGFIBank", 15, 20);
    doc.setFontSize(10);
    doc.text("RAPPORT DE PILOTAGE STRATÉGIQUE", 15, 30);
    
    doc.setTextColor(100, 100, 100);
    doc.text(`Généré le : ${new Date().toLocaleString()}`, 140, 30);

    const tableRows = tasks.map(t => [
      t.agentId,
      t.objectiveId,
      t.nom,
      `${Math.floor(t.durationSeconds / 60)} min`,
      t.status
    ]);

    autoTable(doc, {
      head: [["Agent", "Objectif", "Tâche", "Durée", "Statut"]],
      body: tableRows,
      startY: 50,
      headStyles: { fillColor: [14, 74, 122], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [248, 250, 252] },
    });
    
    doc.save("BGFIBank_Export_Officiel.pdf");
  };

  if (loading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-bgfi-blue border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full font-sans">
      
      {/* Header */}
      <header className="mb-10">
        <div className="flex items-center gap-4 mb-2">
          <div className="h-12 w-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-bgfi-blue text-2xl">
            📈
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Reporting & Audit</h1>
            <p className="text-slate-500 text-sm font-medium">Extractions consolidées des activités opérationnelles</p>
          </div>
        </div>
      </header>

      {/* Cartes d'exportation Premium */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        
        {/* Option Excel */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 group hover:border-emerald-500/30 transition-all cursor-pointer overflow-hidden relative" onClick={exportToExcel}>
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/><line x1="8" y1="9" x2="9" y2="9"/></svg>
          </div>
          <h3 className="text-emerald-700 font-bold text-lg mb-2 flex items-center gap-2">
            📊 Microsoft Excel
          </h3>
          <p className="text-slate-500 text-sm mb-6 leading-relaxed">
            Format idéal pour l'analyse de données, les tableaux croisés dynamiques et le retraitement financier.
          </p>
          <button className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-emerald-200 group-hover:bg-emerald-700 transition-colors">
            Télécharger .xlsx
          </button>
        </div>

        {/* Option PDF */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 group hover:border-red-500/30 transition-all cursor-pointer overflow-hidden relative" onClick={exportToPDF}>
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M9 15h3a2 2 0 0 1 0 4h-3v-4Z"/><path d="M17 15v4"/><path d="m15 15 2 2"/></svg>
          </div>
          <h3 className="text-red-700 font-bold text-lg mb-2 flex items-center gap-2">
            📄 Rapport Officiel PDF
          </h3>
          <p className="text-slate-500 text-sm mb-6 leading-relaxed">
            Document formaté pour archivage, impression ou présentation lors des comités de direction.
          </p>
          <button className="bg-red-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-red-200 group-hover:bg-red-700 transition-colors">
            Télécharger .pdf
          </button>
        </div>
      </div>

      {/* Aperçu des données */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-800 tracking-tight">Registre d'audit (Aperçu)</h2>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Données synchronisées
          </span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white">
                <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Collaborateur</th>
                <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Axe de Pilotage</th>
                <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Charge horaire</th>
                <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 text-right">Validation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {tasks.slice(0, 8).map(t => (
                <tr key={t.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="p-4 text-sm font-semibold text-slate-700">{t.agentId}</td>
                  <td className="p-4 text-sm font-medium text-slate-500 italic">{t.objectiveId}</td>
                  <td className="p-4">
                    <span className="text-sm font-mono font-bold text-slate-800">{Math.floor(t.durationSeconds / 60)} min</span>
                  </td>
                  <td className="p-4 text-right">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter border ${
                      t.status === 'Validé' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                      t.status === 'Terminé' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-slate-50 text-slate-400 border-slate-100'
                    }`}>
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 bg-slate-50 border-t border-slate-100">
           <p className="text-center text-[11px] text-slate-400 font-medium">Affichage des 8 enregistrements les plus récents pour contrôle visuel rapide.</p>
        </div>
      </div>
    </div>
  );
}