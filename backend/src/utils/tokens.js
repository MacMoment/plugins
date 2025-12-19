import db from '../config/database.js';

export function deductTokens(userId, amount, pluginId, description) {
  const user = db.prepare('SELECT tokens FROM users WHERE id = ?').get(userId);
  
  if (!user) {
    throw new Error('User not found');
  }

  if (user.tokens < amount) {
    throw new Error('Insufficient tokens');
  }

  // Update user tokens
  db.prepare('UPDATE users SET tokens = tokens - ? WHERE id = ?').run(amount, userId);

  // Record transaction
  db.prepare(`
    INSERT INTO token_transactions (user_id, plugin_id, amount, type, description)
    VALUES (?, ?, ?, ?, ?)
  `).run(userId, pluginId, -amount, 'deduction', description);

  return user.tokens - amount;
}

export function addTokens(userId, amount, description) {
  db.prepare('UPDATE users SET tokens = tokens + ? WHERE id = ?').run(amount, userId);

  db.prepare(`
    INSERT INTO token_transactions (user_id, amount, type, description)
    VALUES (?, ?, ?, ?)
  `).run(userId, amount, 'addition', description);
}

export function calculateTokenCost(inputLength, outputLength) {
  // Calculate tokens: roughly 1 token per 4 characters
  const inputTokens = Math.ceil(inputLength / 4);
  const outputTokens = Math.ceil(outputLength / 4);
  
  // Cost formula: input tokens * 0.1 + output tokens * 0.2
  return Math.ceil(inputTokens * 0.1 + outputTokens * 0.2);
}

export function getUserTokens(userId) {
  const user = db.prepare('SELECT tokens FROM users WHERE id = ?').get(userId);
  return user ? user.tokens : 0;
}
