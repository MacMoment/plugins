import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { initDatabase } from './config/database.js';
import authRoutes from './routes/auth.js';
import pluginRoutes from './routes/plugins.js';
import profileRoutes from './routes/profile.js';
import paymentRoutes from './routes/payment.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '0.0.0.0'; // Bind to all interfaces for VPS

// Initialize database
initDatabase();

// Parse CORS origins (supports comma-separated values for multiple origins)
const corsOrigins = process.env.FRONTEND_URL 
  ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
  : ['http://localhost:5173'];

// Middleware
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list
    if (corsOrigins.includes(origin) || corsOrigins.includes('*')) {
      return callback(null, true);
    }
    
    // For development, be more permissive
    if (process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
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
app.listen(PORT, HOST, () => {
  console.log(`
  ╔═══════════════════════════════════════╗
  ║                                       ║
  ║         Kodella.ai Backend            ║
  ║     AI Plugin Making Platform         ║
  ║                                       ║
  ╚═══════════════════════════════════════╝
  
  Server running on ${HOST}:${PORT}
  Environment: ${process.env.NODE_ENV || 'development'}
  CORS Origins: ${corsOrigins.join(', ')}
  
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
  
  Admin CLI:
  Run 'node src/admin-cli.js --help' for token management commands
  `);
});

export default app;
