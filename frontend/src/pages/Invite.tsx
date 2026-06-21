import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Invite() {
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
          <h1>Invite Users</h1>
          <p>Invite team members to collaborate on your projects</p>
        </div>
      </header>

      <main className="container page-content">
        <div className="empty-state">
          <div className="empty-state-icon">✉️</div>
          <h3>Invitation Links</h3>
          <p>
            Generate invitation links to share with team members. Invitations
            are single-use and expire after 7 days.
          </p>
          <div className="invite-placeholder">
            <p>
              To invite someone, first create a landing page, then generate
              an invitation link from the dashboard.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
