import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { pluginsAPI } from '../utils/api';
import { Sparkles, Loader, AlertCircle, Coins } from 'lucide-react';
import './CreatePlugin.css';

export default function CreatePlugin() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState('gpt-4');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { tokens, updateTokens } = useAuth();
  const navigate = useNavigate();

  const handleGenerate = async (e) => {
    e.preventDefault();
    
    if (tokens < 10) {
      setError('Insufficient tokens. Please purchase more tokens to continue.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await pluginsAPI.generate({
        name,
        description,
        prompt,
        model
      });

      updateTokens(response.data.tokensRemaining);
      navigate(`/plugin/${response.data.plugin.id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate plugin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container create-container">
      <div className="create-header fade-in">
        <h1>
          <Sparkles size={32} />
          Create New Plugin
        </h1>
        <p className="text-secondary">
          Describe your plugin and let AI generate it for you
        </p>
      </div>

      <div className="create-content fade-in">
        <form onSubmit={handleGenerate} className="create-form">
          {error && (
            <div className="error-banner">
              <AlertCircle size={20} />
              {error}
            </div>
          )}

          <div className="form-section">
            <label htmlFor="name">Plugin Name *</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Image Optimizer, Data Validator"
              required
            />
          </div>

          <div className="form-section">
            <label htmlFor="description">Description (Optional)</label>
            <input
              id="description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of what your plugin does"
            />
          </div>

          <div className="form-section">
            <label htmlFor="prompt">Plugin Requirements *</label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe what you want your plugin to do. Be as specific as possible.

Example: Create a plugin that validates email addresses, checks if they have proper format, and verifies the domain exists. Include error messages for different validation failures."
              rows={10}
              required
            />
            <span className="text-muted">
              Be specific about functionality, input/output, and any special requirements
            </span>
          </div>

          <div className="form-section">
            <label htmlFor="model">AI Model</label>
            <select
              id="model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
            >
              <option value="gpt-4">GPT-4 (Best Quality)</option>
              <option value="gpt-3.5-turbo">GPT-3.5 (Faster, Lower Cost)</option>
              <option value="claude-2">Claude 2</option>
            </select>
          </div>

          <div className="token-info">
            <Coins size={20} />
            <span>
              You have <strong>{tokens.toLocaleString()}</strong> tokens available
            </span>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-large"
            disabled={loading || tokens < 10}
          >
            {loading ? (
              <>
                <Loader className="spinner-icon" size={20} />
                Generating Plugin...
              </>
            ) : (
              <>
                <Sparkles size={20} />
                Generate Plugin
              </>
            )}
          </button>

          {tokens < 10 && (
            <div className="warning-banner">
              <AlertCircle size={20} />
              Insufficient tokens. Please purchase more tokens to generate plugins.
            </div>
          )}
        </form>

        <div className="tips-section">
          <h3>💡 Tips for Better Results</h3>
          <ul>
            <li>Be specific about the plugin's functionality and features</li>
            <li>Include examples of inputs and expected outputs</li>
            <li>Mention any error handling or edge cases</li>
            <li>Specify the programming language or framework if needed</li>
            <li>Describe the API or interface you want</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
