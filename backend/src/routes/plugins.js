import express from 'express';
import db from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';
import { generatePluginCode, improvePluginCode, fixPluginCode } from '../utils/megallm.js';
import { deductTokens, calculateTokenCost, getUserTokens } from '../utils/tokens.js';

const router = express.Router();

// Create a new plugin with AI
router.post('/generate', authenticateToken, async (req, res) => {
  try {
    const { prompt, name, description, model } = req.body;
    const userId = req.user.id;

    if (!prompt || !name) {
      return res.status(400).json({ error: 'Prompt and name are required' });
    }

    // Check user has tokens
    const userTokens = getUserTokens(userId);
    if (userTokens < 10) {
      return res.status(402).json({ error: 'Insufficient tokens. Please purchase more tokens.' });
    }

    // Generate plugin code using MegaLLM
    const { code, inputLength, outputLength } = await generatePluginCode(prompt, model);

    // Calculate token cost
    const tokenCost = calculateTokenCost(inputLength, outputLength);

    // Deduct tokens
    const newBalance = deductTokens(userId, tokenCost, null, `Plugin generation: ${name}`);

    // Save plugin
    const result = db.prepare(`
      INSERT INTO plugins (user_id, name, description, code, prompt, status, tokens_used)
      VALUES (?, ?, ?, ?, ?, 'completed', ?)
    `).run(userId, name, description || '', code, prompt, tokenCost);

    const pluginId = result.lastInsertRowid;

    // Save initial version
    db.prepare(`
      INSERT INTO plugin_versions (plugin_id, version, code, prompt, tokens_used)
      VALUES (?, 1, ?, ?, ?)
    `).run(pluginId, code, prompt, tokenCost);

    res.json({
      success: true,
      plugin: {
        id: pluginId,
        name,
        description,
        code,
        prompt,
        status: 'completed',
        tokensUsed: tokenCost
      },
      tokensRemaining: newBalance
    });
  } catch (error) {
    console.error('Plugin generation error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate plugin' });
  }
});

// Get all user's plugins
router.get('/', authenticateToken, (req, res) => {
  try {
    const plugins = db.prepare(`
      SELECT id, name, description, status, tokens_used, created_at, updated_at
      FROM plugins
      WHERE user_id = ?
      ORDER BY updated_at DESC
    `).all(req.user.id);

    res.json({ plugins });
  } catch (error) {
    console.error('Plugin fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch plugins' });
  }
});

// Get specific plugin
router.get('/:id', authenticateToken, (req, res) => {
  try {
    const plugin = db.prepare(`
      SELECT * FROM plugins
      WHERE id = ? AND user_id = ?
    `).get(req.params.id, req.user.id);

    if (!plugin) {
      return res.status(404).json({ error: 'Plugin not found' });
    }

    res.json({ plugin });
  } catch (error) {
    console.error('Plugin fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch plugin' });
  }
});

// Get plugin versions/history
router.get('/:id/history', authenticateToken, (req, res) => {
  try {
    const plugin = db.prepare(`
      SELECT id FROM plugins WHERE id = ? AND user_id = ?
    `).get(req.params.id, req.user.id);

    if (!plugin) {
      return res.status(404).json({ error: 'Plugin not found' });
    }

    const versions = db.prepare(`
      SELECT * FROM plugin_versions
      WHERE plugin_id = ?
      ORDER BY version DESC
    `).all(req.params.id);

    res.json({ versions });
  } catch (error) {
    console.error('Version fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch plugin history' });
  }
});

// Improve/modify plugin
router.post('/:id/improve', authenticateToken, async (req, res) => {
  try {
    const { instructions, model } = req.body;
    const userId = req.user.id;
    const pluginId = req.params.id;

    if (!instructions) {
      return res.status(400).json({ error: 'Improvement instructions are required' });
    }

    // Get current plugin
    const plugin = db.prepare(`
      SELECT * FROM plugins WHERE id = ? AND user_id = ?
    `).get(pluginId, userId);

    if (!plugin) {
      return res.status(404).json({ error: 'Plugin not found' });
    }

    // Check user has tokens
    const userTokens = getUserTokens(userId);
    if (userTokens < 10) {
      return res.status(402).json({ error: 'Insufficient tokens. Please purchase more tokens.' });
    }

    // Improve code using MegaLLM
    const { code, inputLength, outputLength } = await improvePluginCode(
      plugin.code,
      instructions,
      model
    );

    // Calculate token cost
    const tokenCost = calculateTokenCost(inputLength, outputLength);

    // Deduct tokens
    const newBalance = deductTokens(userId, tokenCost, pluginId, `Plugin improvement: ${plugin.name}`);

    // Get current version number
    const latestVersion = db.prepare(`
      SELECT MAX(version) as max_version FROM plugin_versions WHERE plugin_id = ?
    `).get(pluginId);

    const newVersion = (latestVersion.max_version || 0) + 1;

    // Update plugin
    db.prepare(`
      UPDATE plugins
      SET code = ?, tokens_used = tokens_used + ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(code, tokenCost, pluginId);

    // Save new version
    db.prepare(`
      INSERT INTO plugin_versions (plugin_id, version, code, prompt, tokens_used)
      VALUES (?, ?, ?, ?, ?)
    `).run(pluginId, newVersion, code, instructions, tokenCost);

    res.json({
      success: true,
      plugin: {
        id: pluginId,
        name: plugin.name,
        code,
        version: newVersion,
        tokensUsed: tokenCost
      },
      tokensRemaining: newBalance
    });
  } catch (error) {
    console.error('Plugin improvement error:', error);
    res.status(500).json({ error: error.message || 'Failed to improve plugin' });
  }
});

// Fix plugin
router.post('/:id/fix', authenticateToken, async (req, res) => {
  try {
    const { errorDescription, model } = req.body;
    const userId = req.user.id;
    const pluginId = req.params.id;

    if (!errorDescription) {
      return res.status(400).json({ error: 'Error description is required' });
    }

    // Get current plugin
    const plugin = db.prepare(`
      SELECT * FROM plugins WHERE id = ? AND user_id = ?
    `).get(pluginId, userId);

    if (!plugin) {
      return res.status(404).json({ error: 'Plugin not found' });
    }

    // Check user has tokens
    const userTokens = getUserTokens(userId);
    if (userTokens < 10) {
      return res.status(402).json({ error: 'Insufficient tokens. Please purchase more tokens.' });
    }

    // Fix code using MegaLLM
    const { code, inputLength, outputLength } = await fixPluginCode(
      plugin.code,
      errorDescription,
      model
    );

    // Calculate token cost
    const tokenCost = calculateTokenCost(inputLength, outputLength);

    // Deduct tokens
    const newBalance = deductTokens(userId, tokenCost, pluginId, `Plugin fix: ${plugin.name}`);

    // Get current version number
    const latestVersion = db.prepare(`
      SELECT MAX(version) as max_version FROM plugin_versions WHERE plugin_id = ?
    `).get(pluginId);

    const newVersion = (latestVersion.max_version || 0) + 1;

    // Update plugin
    db.prepare(`
      UPDATE plugins
      SET code = ?, tokens_used = tokens_used + ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(code, tokenCost, pluginId);

    // Save new version
    db.prepare(`
      INSERT INTO plugin_versions (plugin_id, version, code, prompt, tokens_used)
      VALUES (?, ?, ?, ?, ?)
    `).run(pluginId, newVersion, code, `Fix: ${errorDescription}`, tokenCost);

    res.json({
      success: true,
      plugin: {
        id: pluginId,
        name: plugin.name,
        code,
        version: newVersion,
        tokensUsed: tokenCost
      },
      tokensRemaining: newBalance
    });
  } catch (error) {
    console.error('Plugin fix error:', error);
    res.status(500).json({ error: error.message || 'Failed to fix plugin' });
  }
});

// Download plugin
router.get('/:id/download', authenticateToken, (req, res) => {
  try {
    const plugin = db.prepare(`
      SELECT * FROM plugins WHERE id = ? AND user_id = ?
    `).get(req.params.id, req.user.id);

    if (!plugin) {
      return res.status(404).json({ error: 'Plugin not found' });
    }

    // Set headers for file download
    res.setHeader('Content-Type', 'application/javascript');
    res.setHeader('Content-Disposition', `attachment; filename="${plugin.name.replace(/\s+/g, '_')}.js"`);
    res.send(plugin.code);
  } catch (error) {
    console.error('Plugin download error:', error);
    res.status(500).json({ error: 'Failed to download plugin' });
  }
});

// Delete plugin
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const result = db.prepare(`
      DELETE FROM plugins WHERE id = ? AND user_id = ?
    `).run(req.params.id, req.user.id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Plugin not found' });
    }

    res.json({ success: true, message: 'Plugin deleted successfully' });
  } catch (error) {
    console.error('Plugin deletion error:', error);
    res.status(500).json({ error: 'Failed to delete plugin' });
  }
});

// Update plugin details
router.patch('/:id', authenticateToken, (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.user.id;
    const pluginId = req.params.id;

    const plugin = db.prepare(`
      SELECT id FROM plugins WHERE id = ? AND user_id = ?
    `).get(pluginId, userId);

    if (!plugin) {
      return res.status(404).json({ error: 'Plugin not found' });
    }

    const updates = [];
    const values = [];

    if (name) {
      updates.push('name = ?');
      values.push(name);
    }
    if (description !== undefined) {
      updates.push('description = ?');
      values.push(description);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No updates provided' });
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(pluginId);

    db.prepare(`
      UPDATE plugins SET ${updates.join(', ')} WHERE id = ?
    `).run(...values);

    const updatedPlugin = db.prepare(`
      SELECT * FROM plugins WHERE id = ?
    `).get(pluginId);

    res.json({ success: true, plugin: updatedPlugin });
  } catch (error) {
    console.error('Plugin update error:', error);
    res.status(500).json({ error: 'Failed to update plugin' });
  }
});

export default router;
