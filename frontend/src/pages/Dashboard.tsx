import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner" />
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="container">
          <div className="dashboard-header-content">
            <h1>Dashboard</h1>
            <div className="dashboard-header-right">
              <span className="user-name">{user.name}</span>
              <button onClick={logout} className="btn btn-outline btn-sm">Sign out</button>
            </div>
          </div>
        </div>
      </header>

      <main className="container dashboard-content">
        <div className="welcome-section">
          <h2>Welcome, {user.name}!</h2>
          <p>Manage your landing pages, track signups, and build your product roadmap.</p>
        </div>

        <div className="dashboard-tabs">
          <div className="tab-list">
            <button className="tab active">Landing Pages</button>
            <button className="tab">Signups</button>
            <button className="tab">Invite Users</button>
          </div>

          <div className="tab-panel">
            <div className="empty-state">
              <div className="empty-state-icon">📄</div>
              <h3>No landing pages yet</h3>
              <p>Create your first landing page to start collecting signups.</p>
              <button className="btn btn-primary">Create Landing Page</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
