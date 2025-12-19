import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User, Coins, Plus } from 'lucide-react';
import './Header.css';

export default function Header() {
  const { user, tokens, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo-link">
            <h1 className="logo">Kodella.ai</h1>
          </Link>

          {user && (
            <nav className="nav">
              <Link to="/dashboard" className="nav-link">
                Dashboard
              </Link>
              <Link to="/create" className="nav-link btn-create">
                <Plus size={18} />
                Create Plugin
              </Link>
              <Link to="/tokens" className="nav-link token-display">
                <Coins size={18} />
                <span>{tokens.toLocaleString()} tokens</span>
              </Link>
              <Link to="/profile" className="nav-link">
                <User size={18} />
              </Link>
              <button onClick={handleLogout} className="nav-link btn-logout">
                <LogOut size={18} />
              </button>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}
