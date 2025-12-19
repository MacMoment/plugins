import express from 'express';
import bcrypt from 'bcryptjs';
import db from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get user profile
router.get('/', authenticateToken, (req, res) => {
  try {
    const user = db.prepare(`
      SELECT id, email, username, tokens, created_at
      FROM users
      WHERE id = ?
    `).get(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get plugin statistics
    const stats = db.prepare(`
      SELECT 
        COUNT(*) as total_plugins,
        SUM(tokens_used) as total_tokens_used
      FROM plugins
      WHERE user_id = ?
    `).get(req.user.id);

    res.json({
      user: {
        ...user,
        totalPlugins: stats.total_plugins || 0,
        totalTokensUsed: stats.total_tokens_used || 0
      }
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update profile
router.patch('/', authenticateToken, async (req, res) => {
  try {
    const { username, email, currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updates = [];
    const values = [];

    // Update username
    if (username && username !== user.username) {
      const existing = db.prepare('SELECT id FROM users WHERE username = ? AND id != ?').get(username, userId);
      if (existing) {
        return res.status(400).json({ error: 'Username already taken' });
      }
      updates.push('username = ?');
      values.push(username);
    }

    // Update email
    if (email && email !== user.email) {
      const existing = db.prepare('SELECT id FROM users WHERE email = ? AND id != ?').get(email, userId);
      if (existing) {
        return res.status(400).json({ error: 'Email already taken' });
      }
      updates.push('email = ?');
      values.push(email);
    }

    // Update password
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ error: 'Current password is required to set new password' });
      }

      const validPassword = await bcrypt.compare(currentPassword, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: 'Current password is incorrect' });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      updates.push('password = ?');
      values.push(hashedPassword);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No updates provided' });
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(userId);

    db.prepare(`
      UPDATE users SET ${updates.join(', ')} WHERE id = ?
    `).run(...values);

    const updatedUser = db.prepare(`
      SELECT id, email, username, tokens, created_at
      FROM users
      WHERE id = ?
    `).get(userId);

    res.json({
      success: true,
      user: updatedUser
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Get user statistics
router.get('/stats', authenticateToken, (req, res) => {
  try {
    const userId = req.user.id;

    const stats = {
      totalPlugins: 0,
      completedPlugins: 0,
      draftPlugins: 0,
      totalTokensUsed: 0,
      totalTokensPurchased: 0,
      recentActivity: []
    };

    // Plugin stats
    const pluginStats = db.prepare(`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
        COUNT(CASE WHEN status = 'draft' THEN 1 END) as draft,
        SUM(tokens_used) as tokens_used
      FROM plugins
      WHERE user_id = ?
    `).get(userId);

    stats.totalPlugins = pluginStats.total || 0;
    stats.completedPlugins = pluginStats.completed || 0;
    stats.draftPlugins = pluginStats.draft || 0;
    stats.totalTokensUsed = pluginStats.tokens_used || 0;

    // Token purchase stats
    const tokenStats = db.prepare(`
      SELECT SUM(amount) as total
      FROM token_transactions
      WHERE user_id = ? AND type = 'addition'
    `).get(userId);

    stats.totalTokensPurchased = tokenStats.total || 0;

    // Recent activity
    const recentPlugins = db.prepare(`
      SELECT id, name, created_at, updated_at, status
      FROM plugins
      WHERE user_id = ?
      ORDER BY updated_at DESC
      LIMIT 5
    `).all(userId);

    stats.recentActivity = recentPlugins;

    res.json({ stats });
  } catch (error) {
    console.error('Stats fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

export default router;
