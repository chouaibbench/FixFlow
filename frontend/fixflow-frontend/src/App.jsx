import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';

import { AuthProvider } from './context/AuthContext';
import { TicketProvider } from './context/TicketContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { WorkerLayout } from './layouts/WorkerLayout';
import { TechnicianLayout } from './layouts/TechnicianLayout';
import { LoginPage } from './pages/LoginPage';
import { WorkerDashboard } from './pages/worker/Dashboard';
import { TechnicianDashboard } from './pages/technician/Dashboard';

const App = () => {
  return (
    <AuthProvider>
      <TicketProvider>
        <Router>
          <Toaster position="top-right" richColors />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/worker"
              element={
                <ProtectedRoute allowedRoles={['worker']}>
                  <WorkerLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/worker/dashboard" replace />} />
              <Route path="dashboard" element={<WorkerDashboard />} />
              <Route path="machines" element={<div className="p-8 text-center">Worker Machines View (Coming Soon)</div>} />
              <Route path="tickets" element={<div className="p-8 text-center">Worker Tickets View (Coming Soon)</div>} />
            </Route>
            <Route
              path="/technician"
              element={
                <ProtectedRoute allowedRoles={['technician']}>
                  <TechnicianLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/technician/dashboard" replace />} />
              <Route path="dashboard" element={<TechnicianDashboard />} />
              <Route path="machines" element={<div className="p-8 text-center">Technician Machines View (Coming Soon)</div>} />
              <Route path="tickets" element={<div className="p-8 text-center">Technician Tickets View (Coming Soon)</div>} />
              <Route path="team" element={<div className="p-8 text-center">Technician Team View (Coming Soon)</div>} />
              <Route path="settings" element={<div className="p-8 text-center">Technician Settings View (Coming Soon)</div>} />
            </Route>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </TicketProvider>
    </AuthProvider>
  );
};

export default App;
