import { db } from '../config/firebase';
import * as admin from 'firebase-admin';

export const auditService = {
  /**
   * Enregistre une action dans la piste d'audit
   */
  log: async (userId: string, userEmail: string, action: string, details: any = {}) => {
    try {
      await db.collection('logs').add({
        userId,
        userEmail,
        action,
        details,
        ipAddress: details.ip || 'internal',
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        severity: details.severity || 'INFO' // INFO, WARNING, CRITICAL
      });
    } catch (error) {
      console.error("CRITICAL: Erreur lors de l'écriture du log d'audit", error);
    }
  }
};