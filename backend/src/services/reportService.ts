import { db } from '../config/firebase';

export const reportService = {
  /**
   * Calcule la répartition du temps par objectif stratégique
   */
  getStrategicDistribution: async () => {
    // On ne récupère que les tâches validées pour les rapports officiels
    const snapshot = await db.collection('tasks')
      .where('status', '==', 'VALIDE')
      .get();

    const stats: Record<string, number> = {
      "PNB": 0,
      "Développement Commercial": 0,
      "Expérience Client": 0,
      "Maîtrise des Frais Généraux": 0,
      "Maîtrise des Pertes Opérationnelles": 0
    };

    snapshot.forEach(doc => {
      const data = doc.data();
      const objective = data.objectiveId;
      const duration = data.durationSeconds || 0;

      if (stats.hasOwnProperty(objective)) {
        stats[objective] += duration;
      } else {
        // Pour les objectifs personnalisés non listés par défaut
        stats[objective] = (stats[objective] || 0) + duration;
      }
    });

    // Conversion en heures pour la lisibilité DG
    const statsInHours = Object.keys(stats).reduce((acc, key) => {
      acc[key] = parseFloat((stats[key] / 3600).toFixed(2));
      return acc;
    }, {} as Record<string, number>);

    return statsInHours;
  },

  /**
   * Performance par département
   */
  getDepartmentStats: async (deptId: string) => {
    const snapshot = await db.collection('tasks')
      .where('departmentId', '==', deptId)
      .where('status', '==', 'VALIDE')
      .get();

    let totalDuration = 0;
    snapshot.forEach(doc => {
      totalDuration += doc.data().durationSeconds || 0;
    });

    return {
      departmentId: deptId,
      totalHours: parseFloat((totalDuration / 3600).toFixed(2)),
      taskCount: snapshot.size
    };
  }
};