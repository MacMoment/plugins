import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { profileAPI } from '../utils/api';
import { User, Mail, Lock, Save, Loader, CheckCircle } from 'lucide-react';
import './Profile.css';

export default function Profile() {
  const { user, refreshUserData } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
    }
    fetchStats();
  }, [user]);

  const fetchStats = async () => {
    try {
      const response = await profileAPI.getStats();
      setStats(response.data.stats);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword && newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword && newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const updateData = {
        username,
        email
      };

      if (newPassword) {
        updateData.currentPassword = currentPassword;
        updateData.newPassword = newPassword;
      }

      await profileAPI.updateProfile(updateData);
      await refreshUserData();
      
      setSuccess('Profile updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container profile-container">
      <h1 className="profile-title fade-in">
        <User size={32} />
        Profile Settings
      </h1>

      <div className="profile-content">
        <div className="profile-form-section fade-in">
          <h2>Account Information</h2>
          
          <form onSubmit={handleSubmit} className="profile-form">
            {error && (
              <div className="error-message">{error}</div>
            )}
            
            {success && (
              <div className="success-message">
                <CheckCircle size={20} />
                {success}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="username">
                <User size={18} />
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">
                <Mail size={18} />
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="divider">
              <span>Change Password (Optional)</span>
            </div>

            <div className="form-group">
              <label htmlFor="currentPassword">
                <Lock size={18} />
                Current Password
              </label>
              <input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
              />
            </div>

            <div className="form-group">
              <label htmlFor="newPassword">
                <Lock size={18} />
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">
                <Lock size={18} />
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
              />
            </div>

            <button type="submit" className="btn btn-primary w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader className="spinner-icon" size={18} />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Changes
                </>
              )}
            </button>
          </form>
        </div>

        {stats && (
          <div className="profile-stats-section fade-in">
            <h2>Account Statistics</h2>
            
            <div className="stats-list">
              <div className="stat-item">
                <div className="stat-label">Member Since</div>
                <div className="stat-value">
                  {new Date(user.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>

              <div className="stat-item">
                <div className="stat-label">Total Plugins</div>
                <div className="stat-value">{stats.totalPlugins}</div>
              </div>

              <div className="stat-item">
                <div className="stat-label">Completed Plugins</div>
                <div className="stat-value">{stats.completedPlugins}</div>
              </div>

              <div className="stat-item">
                <div className="stat-label">Draft Plugins</div>
                <div className="stat-value">{stats.draftPlugins}</div>
              </div>

              <div className="stat-item">
                <div className="stat-label">Total Tokens Used</div>
                <div className="stat-value">{stats.totalTokensUsed.toLocaleString()}</div>
              </div>

              <div className="stat-item">
                <div className="stat-label">Tokens Purchased</div>
                <div className="stat-value">{stats.totalTokensPurchased.toLocaleString()}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
