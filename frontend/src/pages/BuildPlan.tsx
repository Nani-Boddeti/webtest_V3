import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function BuildPlan() {
  const { user, isAuthenticated, isLoading } = useAuth();
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
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="page-container">
      <header className="page-header">
        <div className="container">
          <h1>Build Plan</h1>
          <p>Generate and manage your product roadmap</p>
        </div>
      </header>

      <main className="container page-content">
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <h3>Build Plan Board</h3>
          <p>
            Select a landing page to generate a build plan with tasks organized
            in a Kanban-style board. Drag and drop tasks to update their status.
          </p>
          <div className="build-plan-statuses">
            <div className="status-column">
              <h4>To Do</h4>
              <p className="status-placeholder">Tasks will appear here</p>
            </div>
            <div className="status-column">
              <h4>In Progress</h4>
              <p className="status-placeholder">Tasks will appear here</p>
            </div>
            <div className="status-column">
              <h4>Done</h4>
              <p className="status-placeholder">Tasks will appear here</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
