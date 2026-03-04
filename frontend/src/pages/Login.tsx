import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';
import { useNavigate } from 'react-router-dom';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/'); 
    } catch (err) {
      setError("Identifiants incorrects. Veuillez vérifier votre email et mot de passe.");
      setIsSubmitting(false);
    } 
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8 sm:p-10 space-y-8 relative overflow-hidden">
        
        {/* Ligne décorative avec les deux couleurs du logo */}
        <div className="absolute top-0 left-0 w-full h-2 flex">
          <div className="w-1/2 h-full bg-bgfi-blue"></div>
          <div className="w-1/2 h-full bg-bgfi-olive"></div>
        </div>

        {/* En-tête BGFIBank avec le Logo */}
        <div className="text-center mt-2">
          {/* Le Logo */}
          <img 
            src="/images/logo.png" 
            alt="Logo BGFIBank" 
            className="h-24 mx-auto mb-3 object-contain"
          />
          
          <h2 className="text-3xl font-black text-bgfi-blue tracking-tight">
            BGFI<span className="text-bgfi-olive">Bank</span>
          </h2>
          <p className="text-gray-500 mt-2 text-sm font-medium uppercase tracking-wider">
            Suivi & Pilotage Stratégique
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-1">
            <label className="block text-sm font-bold text-gray-700">Email professionnel</label>
            <Input 
              type="email" placeholder="prenom.nom@bgfi.com" required 
              value={email} onChange={(e: any) => setEmail(e.target.value)}
              className="py-2.5 focus:ring-bgfi-blue"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-bold text-gray-700">Mot de passe</label>
            <Input 
              type="password" placeholder="••••••••" required 
              value={password} onChange={(e: any) => setPassword(e.target.value)}
              className="py-2.5 focus:ring-bgfi-blue"
            />
          </div>

          <button 
            type="submit" disabled={isSubmitting}
            className="w-full py-3 text-base flex justify-center items-center gap-2 mt-4 bg-bgfi-blue hover:bg-opacity-90 text-white rounded-md font-medium transition-colors"
          >
            {isSubmitting ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
}