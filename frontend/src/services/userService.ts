import { db } from './firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  updateDoc, 
  orderBy,
  setDoc,
  Timestamp 
} from 'firebase/firestore';
import { UserProfile } from '../types';

/**
 * USER SERVICE - BGFIBANK
 * Centralise la gestion des identités et des accès collaborateurs.
 */

export const userService = {
  
  /**
   * Récupère le profil complet d'un utilisateur par son UID
   */
  getUserProfile: async (uid: string): Promise<UserProfile | null> => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        return { uid: userDoc.id, ...userDoc.data() } as UserProfile;
      }
      return null;
    } catch (error) {
      console.error("Erreur lors de la récupération du profil:", error);
      throw error;
    }
  },

  /**
   * Récupère tous les collaborateurs de la banque (Vue Administrateur)
   */
  getAllUsers: async (): Promise<UserProfile[]> => {
    try {
      const q = query(collection(db, "users"), orderBy("name", "asc"));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(d => ({ uid: d.id, ...d.data() } as UserProfile));
    } catch (error) {
      console.error("Erreur lors de la récupération de la liste des utilisateurs:", error);
      return [];
    }
  },

  /**
   * Récupère les collaborateurs d'un département spécifique (Vue Manager)
   * Utile pour le Chef de département qui veut voir son équipe.
   */
  getUsersByDepartment: async (departmentId: string): Promise<UserProfile[]> => {
    try {
      const q = query(
        collection(db, "users"), 
        where("departmentId", "==", departmentId),
        orderBy("name", "asc")
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(d => ({ uid: d.id, ...d.data() } as UserProfile));
    } catch (error) {
      console.error("Erreur lors de la récupération de l'équipe:", error);
      return [];
    }
  },

  /**
   * Crée ou initialise un profil utilisateur dans Firestore
   */
  saveUserProfile: async (uid: string, profileData: Omit<UserProfile, 'uid'>) => {
    try {
      await setDoc(doc(db, "users", uid), {
        ...profileData,
        updatedAt: Timestamp.now()
      }, { merge: true });
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du profil:", error);
      throw error;
    }
  },

  /**
   * Met à jour le rôle ou le département d'un collaborateur
   */
  updateUserAccess: async (uid: string, updates: Partial<UserProfile>) => {
    try {
      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, {
        ...updates,
        lastModified: Timestamp.now()
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour des accès:", error);
      throw error;
    }
  }
};