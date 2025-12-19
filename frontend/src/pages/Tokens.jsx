import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { paymentAPI } from '../utils/api';
import { Coins, ShoppingCart, CheckCircle, Clock, Loader, TrendingDown, TrendingUp } from 'lucide-react';
import './Tokens.css';

export default function Tokens() {
  const { tokens, updateTokens } = useAuth();
  const [packages, setPackages] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [packagesRes, transactionsRes] = await Promise.all([
        paymentAPI.getPackages(),
        paymentAPI.getTransactions()
      ]);
      setPackages(packagesRes.data.packages);
      setTransactions(transactionsRes.data.transactions);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (packageId) => {
    setCheckoutLoading(true);
    try {
      const response = await paymentAPI.createCheckout({ packageId });
      
      // In production, redirect to Tebex checkout
      // window.location.href = response.data.checkoutUrl;
      
      // For demo purposes, simulate payment
      const selectedPackage = packages.find(p => p.id === packageId);
      if (selectedPackage && confirm(`Simulate purchase of ${selectedPackage.tokens} tokens for $${selectedPackage.price}?`)) {
        const manualResponse = await paymentAPI.addTokensManual({
          amount: selectedPackage.tokens,
          checkoutToken: response.data.checkoutToken
        });
        updateTokens(manualResponse.data.newBalance);
        fetchData();
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to create checkout session');
    } finally {
      setCheckoutLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="container tokens-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container tokens-container">
      <div className="tokens-header fade-in">
        <div>
          <h1>
            <Coins size={32} />
            Token Management
          </h1>
          <p className="text-secondary">Purchase tokens to power your plugin creation</p>
        </div>
        <div className="token-balance-card">
          <div className="balance-label">Current Balance</div>
          <div className="balance-value">{tokens.toLocaleString()}</div>
          <div className="balance-sublabel">tokens</div>
        </div>
      </div>

      <div className="packages-section fade-in">
        <h2>Token Packages</h2>
        <div className="packages-grid">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`package-card ${pkg.popular ? 'popular' : ''}`}
            >
              {pkg.popular && <div className="popular-badge">Most Popular</div>}
              
              <h3>{pkg.name}</h3>
              <div className="package-tokens">
                <Coins size={32} />
                <span>{pkg.tokens.toLocaleString()}</span>
              </div>
              <div className="package-price">
                <span className="price-currency">$</span>
                <span className="price-amount">{pkg.price}</span>
              </div>
              <p className="package-description">{pkg.description}</p>
              <button
                onClick={() => handlePurchase(pkg.id)}
                className="btn btn-primary w-full"
                disabled={checkoutLoading}
              >
                {checkoutLoading ? (
                  <>
                    <Loader className="spinner-icon" size={18} />
                    Processing...
                  </>
                ) : (
                  <>
                    <ShoppingCart size={18} />
                    Purchase
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="transactions-section fade-in">
        <h2>
          <Clock size={24} />
          Transaction History
        </h2>
        
        {transactions.length === 0 ? (
          <div className="empty-transactions">
            <Clock size={48} className="text-muted" />
            <p>No transactions yet</p>
          </div>
        ) : (
          <div className="transactions-list">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="transaction-item">
                <div className="transaction-icon">
                  {transaction.type === 'addition' ? (
                    <TrendingUp size={20} className="text-success" />
                  ) : (
                    <TrendingDown size={20} className="text-error" />
                  )}
                </div>
                <div className="transaction-details">
                  <div className="transaction-description">
                    {transaction.description}
                  </div>
                  <div className="transaction-date text-muted">
                    {formatDate(transaction.created_at)}
                  </div>
                </div>
                <div
                  className={`transaction-amount ${
                    transaction.type === 'addition' ? 'positive' : 'negative'
                  }`}
                >
                  {transaction.type === 'addition' ? '+' : ''}
                  {transaction.amount.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
