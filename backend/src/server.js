import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { initDatabase } from './config/database.js';
import authRoutes from './routes/auth.js';
import pluginRoutes from './routes/plugins.js';
import profileRoutes from './routes/profile.js';
import paymentRoutes from './routes/payment.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Ensure data directory exists
const dataDir = join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize database
initDatabase();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'kodella.ai' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/plugins', pluginRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/payment', paymentRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`
  ╔═══════════════════════════════════════╗
  ║                                       ║
  ║         Kodella.ai Backend            ║
  ║     AI Plugin Making Platform         ║
  ║                                       ║
  ╚═══════════════════════════════════════╝
  
  Server running on port ${PORT}
  Environment: ${process.env.NODE_ENV || 'development'}
  
  API Endpoints:
  - POST   /api/auth/register
  - POST   /api/auth/login
  - GET    /api/profile
  - PATCH  /api/profile
  - GET    /api/profile/stats
  - POST   /api/plugins/generate
  - GET    /api/plugins
  - GET    /api/plugins/:id
  - GET    /api/plugins/:id/history
  - POST   /api/plugins/:id/improve
  - POST   /api/plugins/:id/fix
  - GET    /api/plugins/:id/download
  - DELETE /api/plugins/:id
  - PATCH  /api/plugins/:id
  - GET    /api/payment/packages
  - POST   /api/payment/create-checkout
  - POST   /api/payment/webhook/tebex
  - GET    /api/payment/balance
  - GET    /api/payment/transactions
  `);
});

export default app;
