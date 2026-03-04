import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Import des contextes et de la sécurité
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

// Import du nouveau Layout Premium
import DashboardLayout from "./layouts/DashboardLayout";

// Import des pages métier
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Validation from "./pages/Validation";
import Reports from "./pages/Reports";

// Import des pages d'administration
import Users from "./pages/Users";
import Departments from "./pages/Departments";
import Objectives from "./pages/Objectives";
import Processes from "./pages/Processes";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* 1. Portail de connexion (Public) */}
          <Route path="/login" element={<Login />} />

          {/* 2. Espace de travail sécurisé (Privé) */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            {/* Index : Tableau de bord accessible à tous les connectés */}
            <Route index element={<Dashboard />} />

            {/* --- ESPACE COLLABORATEUR --- */}
            <Route path="tasks" element={<Tasks />} />
            
            {/* --- ESPACE MANAGEMENT --- */}
            {/* Seuls les Chefs et l'Admin peuvent accéder à la validation */}
            <Route 
              path="validation" 
              element={
                <ProtectedRoute allowedRoles={['Chef de département', 'Administrateur']}>
                  <Validation />
                </ProtectedRoute>
              } 
            />

            {/* --- REPORTING & AUDIT --- */}
            <Route path="reports" element={<Reports />} />

            {/* --- MODULES ADMINISTRATION (Réservés à l'Admin) --- */}
            <Route 
              path="users" 
              element={
                <ProtectedRoute allowedRoles={['Administrateur']}>
                  <Users />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="departments" 
              element={
                <ProtectedRoute allowedRoles={['Administrateur']}>
                  <Departments />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="objectives" 
              element={
                <ProtectedRoute allowedRoles={['Administrateur']}>
                  <Objectives />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="processes" 
              element={
                <ProtectedRoute allowedRoles={['Administrateur']}>
                  <Processes />
                </ProtectedRoute>
              } 
            />
          </Route>

          {/* 3. Sécurité : Redirection automatique vers le Dashboard si route inconnue */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}