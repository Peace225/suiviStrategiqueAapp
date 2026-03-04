import { db } from '../config/firebase';

export const userService = {
  // Récupérer tous les collaborateurs triés par nom
  fetchAllUsers: async () => {
    const snapshot = await db.collection('users').orderBy('name').get();
    return snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
  },

  // Mettre à jour le rôle ou le département d'un agent
  updateAccess: async (uid: string, data: { role?: string, departmentId?: string }) => {
    await db.collection('users').doc(uid).update({
      ...data,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
  }
};