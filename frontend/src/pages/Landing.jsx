import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Code, Zap, Shield, TrendingUp, Download } from 'lucide-react';
import './Landing.css';

export default function Landing() {
  return (
    <div className="landing">
      <div className="hero-section">
        <div className="container">
          <div className="hero-content fade-in">
            <h1 className="hero-title">
              <span className="gradient-text">Kodella.ai</span>
              <br />
              AI-Powered Plugin Creation
            </h1>
            <p className="hero-subtitle">
              Create, improve, and deploy plugins with the power of AI.
              Fast, intelligent, and effortless.
            </p>
            <div className="hero-buttons">
              <Link to="/register" className="btn btn-primary btn-large">
                <Sparkles size={20} />
                Get Started
              </Link>
              <Link to="/login" className="btn btn-secondary btn-large">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="features-section">
        <div className="container">
          <h2 className="section-title fade-in">Why Choose Kodella.ai?</h2>
          
          <div className="features-grid">
            <div className="feature-card fade-in">
              <div className="feature-icon">
                <Sparkles size={32} />
              </div>
              <h3>AI-Powered Generation</h3>
              <p>
                Describe your plugin in plain English and watch AI generate
                production-ready code instantly.
              </p>
            </div>

            <div className="feature-card fade-in">
              <div className="feature-icon">
                <Zap size={32} />
              </div>
              <h3>Lightning Fast</h3>
              <p>
                Generate complex plugins in seconds, not hours. Our advanced
                AI models work at unprecedented speeds.
              </p>
            </div>

            <div className="feature-card fade-in">
              <div className="feature-icon">
                <Code size={32} />
              </div>
              <h3>Smart Improvements</h3>
              <p>
                Iterate on your plugins with AI assistance. Fix bugs, add
                features, and optimize performance.
              </p>
            </div>

            <div className="feature-card fade-in">
              <div className="feature-icon">
                <Shield size={32} />
              </div>
              <h3>Secure & Reliable</h3>
              <p>
                Your data is encrypted and secure. We use industry-leading
                security practices to protect your work.
              </p>
            </div>

            <div className="feature-card fade-in">
              <div className="feature-icon">
                <TrendingUp size={32} />
              </div>
              <h3>Version Control</h3>
              <p>
                Track every change with built-in version history. Roll back
                or compare versions anytime.
              </p>
            </div>

            <div className="feature-card fade-in">
              <div className="feature-icon">
                <Download size={32} />
              </div>
              <h3>Easy Export</h3>
              <p>
                Download your plugins as ready-to-use files. Integrate
                seamlessly with your projects.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="cta-section">
        <div className="container">
          <div className="cta-content fade-in">
            <h2>Ready to Transform Your Development?</h2>
            <p>
              Join thousands of developers using Kodella.ai to build plugins faster
            </p>
            <Link to="/register" className="btn btn-primary btn-large">
              <Sparkles size={20} />
              Start Creating Now
            </Link>
          </div>
        </div>
      </div>

      <footer className="landing-footer">
        <div className="container">
          <div className="footer-content">
            <div className="logo gradient-text">Kodella.ai</div>
            <p className="text-muted">
              © 2024 Kodella.ai. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
