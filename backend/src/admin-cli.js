#!/usr/bin/env node
/**
 * Kodella.ai Admin CLI
 * 
 * Command-line tool for administrators to manage users and tokens
 * via SSH console/terminal.
 * 
 * Usage:
 *   node src/admin-cli.js <command> [options]
 * 
 * Commands:
 *   add-tokens     Add tokens to a user
 *   set-tokens     Set user's token balance
 *   list-users     List all users
 *   user-info      Get user information
 *   help           Show this help message
 * 
 * Examples:
 *   node src/admin-cli.js add-tokens --user john@example.com --amount 1000
 *   node src/admin-cli.js set-tokens --username john --amount 5000
 *   node src/admin-cli.js list-users
 *   node src/admin-cli.js user-info --user 1
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Database from 'better-sqlite3';
import fs from 'fs';

// Load environment
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

// Ensure data directory exists
const dataDir = join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize database
const db = new Database(join(__dirname, '../data/kodella.db'));

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize database schema if needed
function initDatabaseSchema() {
  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      username TEXT UNIQUE NOT NULL,
      tokens INTEGER DEFAULT 1000,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Token transactions table
  db.exec(`
    CREATE TABLE IF NOT EXISTS token_transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      plugin_id INTEGER,
      amount INTEGER NOT NULL,
      type TEXT NOT NULL,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Plugins table
  db.exec(`
    CREATE TABLE IF NOT EXISTS plugins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      code TEXT NOT NULL,
      prompt TEXT NOT NULL,
      status TEXT DEFAULT 'draft',
      tokens_used INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
}

initDatabaseSchema();

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function success(message) {
  log(`✓ ${message}`, 'green');
}

function error(message) {
  log(`✗ ${message}`, 'red');
}

function info(message) {
  log(`ℹ ${message}`, 'cyan');
}

function parseArgs(args) {
  const parsed = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const key = args[i].slice(2);
      const value = args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : true;
      parsed[key] = value;
      if (value !== true) i++;
    }
  }
  return parsed;
}

function findUser(identifier) {
  // Try to find user by id, email, or username
  let user;
  
  if (!isNaN(identifier)) {
    user = db.prepare('SELECT * FROM users WHERE id = ?').get(parseInt(identifier));
  }
  
  if (!user) {
    user = db.prepare('SELECT * FROM users WHERE email = ?').get(identifier);
  }
  
  if (!user) {
    user = db.prepare('SELECT * FROM users WHERE username = ?').get(identifier);
  }
  
  return user;
}

function addTokens(userId, amount, description) {
  db.prepare('UPDATE users SET tokens = tokens + ? WHERE id = ?').run(amount, userId);
  
  db.prepare(`
    INSERT INTO token_transactions (user_id, amount, type, description)
    VALUES (?, ?, ?, ?)
  `).run(userId, amount, 'admin_addition', description);
}

function setTokens(userId, amount, description) {
  const currentTokens = db.prepare('SELECT tokens FROM users WHERE id = ?').get(userId).tokens;
  db.prepare('UPDATE users SET tokens = ? WHERE id = ?').run(amount, userId);
  
  const diff = amount - currentTokens;
  db.prepare(`
    INSERT INTO token_transactions (user_id, amount, type, description)
    VALUES (?, ?, ?, ?)
  `).run(userId, diff, 'admin_set', description);
}

// Command handlers
const commands = {
  'add-tokens': (args) => {
    const { user, amount, reason } = args;
    
    if (!user) {
      error('User identifier required. Use --user <email|username|id>');
      return;
    }
    
    if (!amount || isNaN(parseInt(amount))) {
      error('Valid amount required. Use --amount <number>');
      return;
    }
    
    const foundUser = findUser(user);
    if (!foundUser) {
      error(`User not found: ${user}`);
      return;
    }
    
    const tokenAmount = parseInt(amount);
    const description = reason || `Admin grant: ${tokenAmount} tokens`;
    
    addTokens(foundUser.id, tokenAmount, description);
    
    const updatedUser = findUser(foundUser.id);
    success(`Added ${tokenAmount} tokens to ${foundUser.username}`);
    info(`New balance: ${updatedUser.tokens} tokens`);
  },
  
  'set-tokens': (args) => {
    const { user, username, amount, reason } = args;
    const userIdentifier = user || username;
    
    if (!userIdentifier) {
      error('User identifier required. Use --user <email|username|id>');
      return;
    }
    
    if (!amount || isNaN(parseInt(amount))) {
      error('Valid amount required. Use --amount <number>');
      return;
    }
    
    const foundUser = findUser(userIdentifier);
    if (!foundUser) {
      error(`User not found: ${userIdentifier}`);
      return;
    }
    
    const tokenAmount = parseInt(amount);
    const description = reason || `Admin set balance: ${tokenAmount} tokens`;
    
    const previousBalance = foundUser.tokens;
    setTokens(foundUser.id, tokenAmount, description);
    
    success(`Set ${foundUser.username}'s tokens from ${previousBalance} to ${tokenAmount}`);
  },
  
  'list-users': (args) => {
    const { limit = 50 } = args;
    const users = db.prepare(`
      SELECT id, email, username, tokens, created_at 
      FROM users 
      ORDER BY created_at DESC 
      LIMIT ?
    `).all(parseInt(limit));
    
    if (users.length === 0) {
      info('No users found');
      return;
    }
    
    console.log('\n' + colors.bright + 'Users:' + colors.reset);
    console.log('─'.repeat(80));
    console.log(
      'ID'.padEnd(6) + 
      'Username'.padEnd(20) + 
      'Email'.padEnd(30) + 
      'Tokens'.padEnd(12) + 
      'Created'
    );
    console.log('─'.repeat(80));
    
    users.forEach(user => {
      console.log(
        String(user.id).padEnd(6) +
        user.username.padEnd(20) +
        user.email.padEnd(30) +
        String(user.tokens).padEnd(12) +
        user.created_at.substring(0, 10)
      );
    });
    
    console.log('─'.repeat(80));
    info(`Showing ${users.length} users`);
  },
  
  'user-info': (args) => {
    const { user } = args;
    
    if (!user) {
      error('User identifier required. Use --user <email|username|id>');
      return;
    }
    
    const foundUser = findUser(user);
    if (!foundUser) {
      error(`User not found: ${user}`);
      return;
    }
    
    // Get plugin count
    const pluginCount = db.prepare(
      'SELECT COUNT(*) as count FROM plugins WHERE user_id = ?'
    ).get(foundUser.id).count;
    
    // Get recent transactions
    const transactions = db.prepare(`
      SELECT * FROM token_transactions 
      WHERE user_id = ? 
      ORDER BY created_at DESC 
      LIMIT 5
    `).all(foundUser.id);
    
    console.log('\n' + colors.bright + 'User Information:' + colors.reset);
    console.log('─'.repeat(50));
    console.log(`ID:        ${foundUser.id}`);
    console.log(`Username:  ${foundUser.username}`);
    console.log(`Email:     ${foundUser.email}`);
    console.log(`Tokens:    ${foundUser.tokens}`);
    console.log(`Plugins:   ${pluginCount}`);
    console.log(`Created:   ${foundUser.created_at}`);
    console.log(`Updated:   ${foundUser.updated_at}`);
    
    if (transactions.length > 0) {
      console.log('\n' + colors.bright + 'Recent Transactions:' + colors.reset);
      console.log('─'.repeat(50));
      transactions.forEach(tx => {
        const sign = tx.amount >= 0 ? '+' : '';
        console.log(`  ${tx.created_at.substring(0, 16)} | ${sign}${tx.amount} | ${tx.type}`);
      });
    }
  },
  
  'help': () => {
    console.log(`
${colors.bright}╔═══════════════════════════════════════╗
║      Kodella.ai Admin CLI Tool        ║
╚═══════════════════════════════════════╝${colors.reset}

${colors.cyan}Usage:${colors.reset}
  node src/admin-cli.js <command> [options]

${colors.cyan}Commands:${colors.reset}
  ${colors.green}add-tokens${colors.reset}     Add tokens to a user's balance
                 --user <email|username|id>  User identifier (required)
                 --amount <number>            Tokens to add (required)
                 --reason <text>              Optional description

  ${colors.green}set-tokens${colors.reset}     Set a user's token balance to a specific value
                 --user <email|username|id>  User identifier (required)
                 --amount <number>            New token balance (required)
                 --reason <text>              Optional description

  ${colors.green}list-users${colors.reset}     List all registered users
                 --limit <number>             Max users to show (default: 50)

  ${colors.green}user-info${colors.reset}      Get detailed information about a user
                 --user <email|username|id>  User identifier (required)

  ${colors.green}help${colors.reset}           Show this help message

${colors.cyan}Examples:${colors.reset}
  node src/admin-cli.js add-tokens --user john@example.com --amount 1000
  node src/admin-cli.js add-tokens --user john --amount 500 --reason "Promotional bonus"
  node src/admin-cli.js set-tokens --user 1 --amount 5000
  node src/admin-cli.js list-users --limit 20
  node src/admin-cli.js user-info --user john@example.com
`);
  }
};

// Main execution
function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  if (!command || command === '--help' || command === '-h') {
    commands.help();
    process.exit(0);
  }
  
  if (!commands[command]) {
    error(`Unknown command: ${command}`);
    console.log('Run with --help for usage information');
    process.exit(1);
  }
  
  const parsedArgs = parseArgs(args.slice(1));
  
  try {
    commands[command](parsedArgs);
  } catch (err) {
    error(`Error: ${err.message}`);
    process.exit(1);
  }
}

main();
