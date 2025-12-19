import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { pluginsAPI, profileAPI } from '../utils/api';
import { Plus, Code, Clock, Download, Trash2, Edit, TrendingUp } from 'lucide-react';
import './Dashboard.css';

export default function Dashboard() {
  const { user, tokens } = useAuth();
  const [plugins, setPlugins] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [pluginsRes, statsRes] = await Promise.all([
        pluginsAPI.getAll(),
        profileAPI.getStats()
      ]);
      setPlugins(pluginsRes.data.plugins);
      setStats(statsRes.data.stats);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this plugin?')) return;

    try {
      await pluginsAPI.delete(id);
      setPlugins(plugins.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting plugin:', error);
      alert('Failed to delete plugin');
    }
  };

  const handleDownload = async (id, name) => {
    try {
      const response = await pluginsAPI.download(id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${name.replace(/\s+/g, '_')}.js`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading plugin:', error);
      alert('Failed to download plugin');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="container dashboard-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container dashboard-container">
      <div className="dashboard-header fade-in">
        <div>
          <h1>Welcome back, {user?.username}!</h1>
          <p className="text-secondary">Manage your AI-powered plugins</p>
        </div>
        <Link to="/create" className="btn btn-primary">
          <Plus size={20} />
          Create New Plugin
        </Link>
      </div>

      {stats && (
        <div className="stats-grid fade-in">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.1)' }}>
              <Code size={24} style={{ color: 'var(--primary)' }} />
            </div>
            <div>
              <div className="stat-value">{stats.totalPlugins}</div>
              <div className="stat-label">Total Plugins</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
              <TrendingUp size={24} style={{ color: 'var(--success)' }} />
            </div>
            <div>
              <div className="stat-value">{stats.completedPlugins}</div>
              <div className="stat-label">Completed</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)' }}>
              <Clock size={24} style={{ color: 'var(--warning)' }} />
            </div>
            <div>
              <div className="stat-value">{stats.totalTokensUsed.toLocaleString()}</div>
              <div className="stat-label">Tokens Used</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
              <Download size={24} style={{ color: '#3b82f6' }} />
            </div>
            <div>
              <div className="stat-value">{tokens.toLocaleString()}</div>
              <div className="stat-label">Tokens Available</div>
            </div>
          </div>
        </div>
      )}

      <div className="plugins-section fade-in">
        <h2>Your Plugins</h2>
        
        {plugins.length === 0 ? (
          <div className="empty-state">
            <Code size={64} className="text-muted" />
            <h3>No plugins yet</h3>
            <p className="text-secondary">Create your first AI-powered plugin to get started</p>
            <Link to="/create" className="btn btn-primary mt-3">
              <Plus size={20} />
              Create Plugin
            </Link>
          </div>
        ) : (
          <div className="plugins-grid">
            {plugins.map((plugin) => (
              <div key={plugin.id} className="plugin-card">
                <div className="plugin-header">
                  <h3>{plugin.name}</h3>
                  <span className={`status-badge status-${plugin.status}`}>
                    {plugin.status}
                  </span>
                </div>

                {plugin.description && (
                  <p className="plugin-description">{plugin.description}</p>
                )}

                <div className="plugin-meta">
                  <span className="text-muted">
                    <Clock size={14} />
                    {formatDate(plugin.updated_at)}
                  </span>
                  <span className="text-muted">
                    {plugin.tokens_used} tokens used
                  </span>
                </div>

                <div className="plugin-actions">
                  <Link to={`/plugin/${plugin.id}`} className="btn btn-secondary btn-sm">
                    <Edit size={16} />
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDownload(plugin.id, plugin.name)}
                    className="btn btn-secondary btn-sm"
                  >
                    <Download size={16} />
                    Download
                  </button>
                  <button
                    onClick={() => handleDelete(plugin.id)}
                    className="btn btn-danger btn-sm"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
