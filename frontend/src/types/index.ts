export type UserRole = 'Agent' | 'Chef de département' | 'Administrateur';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  departmentId: string;
}

export interface Task {
  id?: string;
  nom: string;
  description: string;
  processId: string;
  objectiveId: string; // PNB, Expérience Client, etc.
  agentId: string;
  status: 'En cours' | 'Terminé' | 'Validé';
  startTime: any; // Timestamp Firebase
  endTime?: any;
  durationSeconds: number;
  comment?: string; // Pour la validation hiérarchique
}