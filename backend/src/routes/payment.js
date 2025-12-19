import express from 'express';
import crypto from 'crypto';
import db from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';
import { addTokens } from '../utils/tokens.js';

const router = express.Router();

// Tebex webhook secret - should be set in environment
const TEBEX_WEBHOOK_SECRET = process.env.TEBEX_WEBHOOK_SECRET || 'your-tebex-webhook-secret';

// Get available token packages
router.get('/packages', (req, res) => {
  const packages = [
    {
      id: 1,
      name: 'Starter Pack',
      tokens: 1000,
      price: 4.99,
      currency: 'USD',
      description: 'Perfect for trying out the platform'
    },
    {
      id: 2,
      name: 'Creator Pack',
      tokens: 5000,
      price: 19.99,
      currency: 'USD',
      description: 'Great for regular plugin development',
      popular: true
    },
    {
      id: 3,
      name: 'Pro Pack',
      tokens: 15000,
      price: 49.99,
      currency: 'USD',
      description: 'Best value for power users'
    },
    {
      id: 4,
      name: 'Enterprise Pack',
      tokens: 50000,
      price: 149.99,
      currency: 'USD',
      description: 'For large-scale development'
    }
  ];

  res.json({ packages });
});

// Create payment session (returns Tebex checkout URL)
router.post('/create-checkout', authenticateToken, (req, res) => {
  try {
    const { packageId } = req.body;
    const userId = req.user.id;

    const packages = {
      1: { tokens: 1000, price: 4.99 },
      2: { tokens: 5000, price: 19.99 },
      3: { tokens: 15000, price: 49.99 },
      4: { tokens: 50000, price: 149.99 }
    };

    const selectedPackage = packages[packageId];
    if (!selectedPackage) {
      return res.status(400).json({ error: 'Invalid package' });
    }

    // In production, this would call Tebex API to create a checkout session
    // For now, we'll return a mock checkout URL with embedded data
    const checkoutData = {
      userId,
      packageId,
      tokens: selectedPackage.tokens,
      price: selectedPackage.price,
      timestamp: Date.now()
    };

    // Create a simple encoded checkout token
    const checkoutToken = Buffer.from(JSON.stringify(checkoutData)).toString('base64');

    res.json({
      checkoutUrl: `https://checkout.tebex.io/kodella-ai?token=${checkoutToken}`,
      checkoutToken,
      packageInfo: selectedPackage
    });
  } catch (error) {
    console.error('Checkout creation error:', error);
    res.status(500).json({ error: 'Failed to create checkout' });
  }
});

// Tebex webhook handler for payment completion
router.post('/webhook/tebex', express.raw({ type: 'application/json' }), (req, res) => {
  try {
    // Verify webhook signature (Tebex specific)
    const signature = req.headers['x-signature'];
    
    // In production, verify the signature:
    // const computedSignature = crypto
    //   .createHmac('sha256', TEBEX_WEBHOOK_SECRET)
    //   .update(req.body)
    //   .digest('hex');
    
    // if (signature !== computedSignature) {
    //   return res.status(401).json({ error: 'Invalid signature' });
    // }

    const payload = JSON.parse(req.body.toString());
    
    // Handle different webhook types
    if (payload.type === 'payment.completed' || payload.type === 'validation.webhook') {
      const { userId, tokens } = payload.custom || {};
      
      if (userId && tokens) {
        // Add tokens to user account
        addTokens(userId, tokens, `Tebex payment - ${tokens} tokens purchased`);
        
        console.log(`Added ${tokens} tokens to user ${userId} via Tebex payment`);
      }
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Tebex webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Manual token addition endpoint (for testing/admin purposes)
router.post('/add-tokens-manual', authenticateToken, (req, res) => {
  try {
    const { amount, checkoutToken } = req.body;
    const userId = req.user.id;

    // Decode and verify checkout token
    try {
      const checkoutData = JSON.parse(Buffer.from(checkoutToken, 'base64').toString());
      
      if (checkoutData.userId !== userId) {
        return res.status(403).json({ error: 'Invalid checkout token' });
      }

      if (checkoutData.tokens !== amount) {
        return res.status(400).json({ error: 'Token amount mismatch' });
      }

      // Add tokens
      addTokens(userId, amount, `Token purchase - ${amount} tokens`);

      const updatedUser = db.prepare('SELECT tokens FROM users WHERE id = ?').get(userId);

      res.json({
        success: true,
        message: `${amount} tokens added successfully`,
        newBalance: updatedUser.tokens
      });
    } catch (decodeError) {
      return res.status(400).json({ error: 'Invalid checkout token' });
    }
  } catch (error) {
    console.error('Token addition error:', error);
    res.status(500).json({ error: 'Failed to add tokens' });
  }
});

// Get user's token balance
router.get('/balance', authenticateToken, (req, res) => {
  try {
    const user = db.prepare('SELECT tokens FROM users WHERE id = ?').get(req.user.id);
    
    res.json({
      tokens: user.tokens
    });
  } catch (error) {
    console.error('Balance fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch balance' });
  }
});

// Get token transaction history
router.get('/transactions', authenticateToken, (req, res) => {
  try {
    const transactions = db.prepare(`
      SELECT * FROM token_transactions
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT 50
    `).all(req.user.id);

    res.json({ transactions });
  } catch (error) {
    console.error('Transaction fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

export default router;
