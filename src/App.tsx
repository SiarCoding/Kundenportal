import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import RegistrationSuccess from './pages/RegistrationSuccess';
import AdminDashboard from './pages/admin/Dashboard';
import UserDashboard from './pages/UserDashboard';
import ProfileSettings from './pages/ProfileSettings';
import PartnerProgram from './pages/PartnerProgram';
import TutorialManagement from './pages/admin/TutorialManagement';
import ContentManagement from './pages/admin/ContentManagement';
import UserTracking from './pages/admin/UserTracking';
import AdminApproval from './pages/admin/AdminApproval';
import Tutorials from './pages/Tutorials';
import TutorialDetail from './pages/TutorialDetail';
import { AuthProvider } from './context/AuthContext';
import { OnboardingProvider } from './context/OnboardingContext';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <AuthProvider>
      <OnboardingProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-[#1a1b1e] text-gray-100">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/registration-success" element={<RegistrationSuccess />} />
              
              {/* Protected Routes */}
              
              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requireAdmin>
                    <Navigate to="/admin/dashboard" replace />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/tutorials"
                element={
                  <ProtectedRoute requireAdmin>
                    <TutorialManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/content"
                element={
                  <ProtectedRoute requireAdmin>
                    <ContentManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/tracking"
                element={
                  <ProtectedRoute requireAdmin>
                    <UserTracking />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/approvals"
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminApproval />
                  </ProtectedRoute>
                }
              />

              {/* User Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute requireUser>
                    <UserDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute requireUser>
                    <ProfileSettings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/partner"
                element={
                  <ProtectedRoute requireUser>
                    <PartnerProgram />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tutorials"
                element={
                  <ProtectedRoute requireUser>
                    <Tutorials />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tutorials/:id"
                element={
                  <ProtectedRoute requireUser>
                    <TutorialDetail />
                  </ProtectedRoute>
                }
              />

              {/* Default Routes */}
              <Route
                path="/"
                element={
                  <Navigate to="/login" replace />
                }
              />
            </Routes>
          </div>
        </BrowserRouter>
      </OnboardingProvider>
    </AuthProvider>
  );
}