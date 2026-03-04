import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../services/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { User } from '../types';

interface AuthContextType {
  user: FirebaseUser | null;
  profile: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, profile: null, loading: true });

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const docRef = doc(db, 'users', currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setProfile({ uid: docSnap.id, ...docSnap.data() } as User);
          } else {
            setProfile(null);
          }
        } catch (error) {
          console.error("Erreur profil:", error);
        }
      } else {
        setProfile(null);
      }
      // On débloque l'écran ici
      setLoading(false); 
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading }}>
      {!loading ? children : (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-bgfi-blue border-t-transparent mb-4"></div>
          <p className="text-gray-500 font-medium animate-pulse">Connexion à BGFIBank...</p>
        </div>
      )}
    </AuthContext.Provider>
  );
};