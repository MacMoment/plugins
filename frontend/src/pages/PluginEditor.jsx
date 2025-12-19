import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { pluginsAPI } from '../utils/api';
import {
  Code,
  Download,
  Sparkles,
  Wrench,
  Clock,
  Loader,
  AlertCircle,
  ChevronRight,
  Save,
  ArrowLeft
} from 'lucide-react';
import './PluginEditor.css';

export default function PluginEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tokens, updateTokens } = useAuth();
  
  const [plugin, setPlugin] = useState(null);
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [showImprove, setShowImprove] = useState(false);
  const [showFix, setShowFix] = useState(false);
  const [improveInstructions, setImproveInstructions] = useState('');
  const [fixDescription, setFixDescription] = useState('');
  const [editedName, setEditedName] = useState('');
  const [editedDescription, setEditedDescription] = useState('');

  useEffect(() => {
    fetchPlugin();
    fetchVersions();
  }, [id]);

  const fetchPlugin = async () => {
    try {
      const response = await pluginsAPI.getById(id);
      setPlugin(response.data.plugin);
      setEditedName(response.data.plugin.name);
      setEditedDescription(response.data.plugin.description || '');
    } catch (err) {
      setError('Failed to load plugin');
    } finally {
      setLoading(false);
    }
  };

  const fetchVersions = async () => {
    try {
      const response = await pluginsAPI.getHistory(id);
      setVersions(response.data.versions);
    } catch (err) {
      console.error('Failed to load versions:', err);
    }
  };

  const handleImprove = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setError('');

    try {
      const response = await pluginsAPI.improve(id, {
        instructions: improveInstructions,
        model: 'gpt-4'
      });

      setPlugin({ ...plugin, code: response.data.plugin.code });
      updateTokens(response.data.tokensRemaining);
      setShowImprove(false);
      setImproveInstructions('');
      fetchVersions();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to improve plugin');
    } finally {
      setActionLoading(false);
    }
  };

  const handleFix = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setError('');

    try {
      const response = await pluginsAPI.fix(id, {
        errorDescription: fixDescription,
        model: 'gpt-4'
      });

      setPlugin({ ...plugin, code: response.data.plugin.code });
      updateTokens(response.data.tokensRemaining);
      setShowFix(false);
      setFixDescription('');
      fetchVersions();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fix plugin');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await pluginsAPI.update(id, {
        name: editedName,
        description: editedDescription
      });
      setPlugin({ ...plugin, name: editedName, description: editedDescription });
    } catch (err) {
      setError('Failed to save changes');
    }
  };

  const handleDownload = async () => {
    try {
      const response = await pluginsAPI.download(id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${plugin.name.replace(/\s+/g, '_')}.js`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError('Failed to download plugin');
    }
  };

  if (loading) {
    return (
      <div className="container editor-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (!plugin) {
    return (
      <div className="container editor-container">
        <div className="error-state">Plugin not found</div>
      </div>
    );
  }

  return (
    <div className="container editor-container">
      <button onClick={() => navigate('/dashboard')} className="btn btn-ghost back-btn">
        <ArrowLeft size={18} />
        Back to Dashboard
      </button>

      <div className="editor-header fade-in">
        <div className="header-info">
          <input
            type="text"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            className="plugin-name-input"
          />
          <input
            type="text"
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            placeholder="Add a description..."
            className="plugin-desc-input"
          />
          <button onClick={handleSave} className="btn btn-secondary btn-sm">
            <Save size={16} />
            Save Details
          </button>
        </div>

        <div className="header-actions">
          <button
            onClick={() => setShowImprove(!showImprove)}
            className="btn btn-secondary"
            disabled={actionLoading}
          >
            <Sparkles size={18} />
            Improve
          </button>
          <button
            onClick={() => setShowFix(!showFix)}
            className="btn btn-secondary"
            disabled={actionLoading}
          >
            <Wrench size={18} />
            Fix
          </button>
          <button onClick={handleDownload} className="btn btn-primary">
            <Download size={18} />
            Download
          </button>
        </div>
      </div>

      {error && (
        <div className="error-banner fade-in">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {showImprove && (
        <div className="action-panel fade-in">
          <h3>
            <Sparkles size={20} />
            Improve Plugin
          </h3>
          <form onSubmit={handleImprove}>
            <textarea
              value={improveInstructions}
              onChange={(e) => setImproveInstructions(e.target.value)}
              placeholder="Describe how you want to improve the plugin. E.g., 'Add error handling', 'Optimize performance', 'Add documentation'"
              rows={4}
              required
            />
            <div className="action-buttons">
              <button type="submit" className="btn btn-primary" disabled={actionLoading}>
                {actionLoading ? (
                  <>
                    <Loader className="spinner-icon" size={18} />
                    Processing...
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    Apply Improvements
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowImprove(false)}
                className="btn btn-ghost"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {showFix && (
        <div className="action-panel fade-in">
          <h3>
            <Wrench size={20} />
            Fix Plugin
          </h3>
          <form onSubmit={handleFix}>
            <textarea
              value={fixDescription}
              onChange={(e) => setFixDescription(e.target.value)}
              placeholder="Describe the error or issue you're experiencing. E.g., 'Function returns undefined', 'Syntax error on line 10'"
              rows={4}
              required
            />
            <div className="action-buttons">
              <button type="submit" className="btn btn-primary" disabled={actionLoading}>
                {actionLoading ? (
                  <>
                    <Loader className="spinner-icon" size={18} />
                    Processing...
                  </>
                ) : (
                  <>
                    <Wrench size={18} />
                    Fix Issues
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowFix(false)}
                className="btn btn-ghost"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="editor-content">
        <div className="code-section">
          <div className="section-header">
            <h3>
              <Code size={20} />
              Plugin Code
            </h3>
            <span className="text-muted">Version {versions.length}</span>
          </div>
          <pre className="code-display">
            <code>{plugin.code}</code>
          </pre>
        </div>

        {versions.length > 0 && (
          <div className="versions-section">
            <h3>
              <Clock size={20} />
              Version History
            </h3>
            <div className="versions-list">
              {versions.map((version) => (
                <div key={version.id} className="version-item">
                  <div className="version-header">
                    <span className="version-number">v{version.version}</span>
                    <span className="text-muted">
                      {new Date(version.created_at).toLocaleString()}
                    </span>
                  </div>
                  <div className="version-prompt text-muted">{version.prompt}</div>
                  <div className="version-meta">
                    {version.tokens_used} tokens used
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
