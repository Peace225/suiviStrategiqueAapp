import { db, auth } from './firebase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  Timestamp,
  setDoc,
  getDocs
} from 'firebase/firestore';
import { Task, UserProfile } from '../types';

/**
 * SERVICE API - BGFIBANK STRATEGIC PILOTING
 * Centralisation des appels Firestore & Auth
 */

// --- GESTION DES DÉPARTEMENTS ---
export const apiDepartments = {
  // Ajouter un département
  add: (name: string) => {
    return addDoc(collection(db, "departments"), {
      name,
      createdAt: Timestamp.now()
    });
  },
  // Les écouteurs (onSnapshot) restent souvent dans les composants 
  // pour le rafraîchissement immédiat de l'UI.
};

// --- GESTION DES OBJECTIFS ---
export const apiObjectives = {
  add: (name: string) => {
    return addDoc(collection(db, "objectives"), {
      name,
      createdAt: Timestamp.now()
    });
  }
};

// --- GESTION DES PROCESSUS ---
export const apiProcesses = {
  add: (name: string, departmentId: string, objectiveId: string) => {
    return addDoc(collection(db, "processes"), {
      name,
      departmentId,
      objectiveId,
      createdAt: Timestamp.now()
    });
  }
};

// --- GESTION DES UTILISATEURS ---
export const apiUsers = {
  // Créer le profil Firestore après l'inscription Auth
  createProfile: (uid: string, profile: Omit<UserProfile, 'uid'>) => {
    return setDoc(doc(db, "users", uid), {
      ...profile,
      createdAt: Timestamp.now()
    });
  },
  
  // Récupérer tous les utilisateurs (pour l'admin)
  getAll: async () => {
    const q = query(collection(db, "users"), orderBy("name"));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ uid: d.id, ...d.data() } as UserProfile));
  }
};

// --- CŒUR DE L'APPLI : GESTION DES TÂCHES (SUIVI DU TEMPS) ---
export const apiTasks = {
  // Démarrer une tâche (Chrono)
  start: (taskData: Partial<Task>) => {
    return addDoc(collection(db, "tasks"), {
      ...taskData,
      status: 'EN_COURS',
      startTime: Timestamp.now(),
      durationSeconds: 0,
      createdAt: Timestamp.now()
    });
  },

  // Arrêter une tâche et calculer la durée
  stop: (taskId: string, startTimeSeconds: number) => {
    const endTime = Timestamp.now();
    const duration = endTime.seconds - startTimeSeconds;
    
    return updateDoc(doc(db, "tasks", taskId), {
      endTime,
      durationSeconds: duration,
      status: 'TERMINE'
    });
  },

  // Validation par le Manager
  validate: (taskId: string, managerName: string, comment: string) => {
    return updateDoc(doc(db, "tasks", taskId), {
      status: 'VALIDE',
      validatedBy: managerName,
      managerComment: comment,
      validatedAt: Timestamp.now()
    });
  },

  // Rejet (Renvoi à l'agent)
  reject: (taskId: string, comment: string) => {
    return updateDoc(doc(db, "tasks", taskId), {
      status: 'EN_COURS',
      managerComment: comment,
      rejectedAt: Timestamp.now()
    });
  }
};