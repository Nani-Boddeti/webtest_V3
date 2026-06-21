import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import BuildPlan from './pages/BuildPlan';
import Invite from './pages/Invite';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/build-plan" element={<BuildPlan />} />
        <Route path="/invite" element={<Invite />} />
        <Route path="*" element={
          <div className="not-found">
            <h1>404</h1>
            <p>Page not found</p>
            <a href="/dashboard" className="btn btn-primary">Go to Dashboard</a>
          </div>
        } />
      </Routes>
    </AuthProvider>
  );
}
