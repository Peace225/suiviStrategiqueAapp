import { db } from '../config/firebase';
import * as admin from 'firebase-admin';

export const taskService = {
  // Démarrer une tâche (Chrono)
  start: async (taskData: any) => {
    return await db.collection('tasks').add({
      ...taskData,
      status: 'EN_COURS',
      startTime: admin.firestore.FieldValue.serverTimestamp(),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      durationSeconds: 0
    });
  },

  // Arrêter une tâche et calculer la durée réelle
  stop: async (taskId: string) => {
    const taskDoc = await db.collection('tasks').doc(taskId).get();
    if (!taskDoc.exists) throw new Error("Tâche introuvable");

    const data = taskDoc.data();
    const startTime = data?.startTime.toDate();
    const endTime = new Date();
    const durationSeconds = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);

    return await db.collection('tasks').doc(taskId).update({
      endTime: admin.firestore.Timestamp.fromDate(endTime),
      durationSeconds,
      status: 'TERMINE'
    });
  },

  // Validation Manager
  processValidation: async (taskId: string, managerData: any) => {
    return await db.collection('tasks').doc(taskId).update({
      status: managerData.approved ? 'VALIDE' : 'EN_COURS',
      managerComment: managerData.comment,
      validatedAt: admin.firestore.FieldValue.serverTimestamp(),
      validatedBy: managerData.managerName
    });
  }
};