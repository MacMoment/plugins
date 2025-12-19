# Kodella.ai - AI Plugin Making Platform

![Kodella.ai](https://img.shields.io/badge/Kodella.ai-AI%20Plugin%20Platform-8b5cf6)
![License](https://img.shields.io/badge/license-MIT-green)

## 🚀 Overview

Kodella.ai is a high-tech, AI-powered plugin making platform with a dark, slick, minimalistic design. It enables users to create, improve, and manage plugins using advanced AI models through a token-based system integrated with Tebex payment gateway.

## ✨ Features

- **AI-Powered Plugin Generation**: Create plugins from natural language descriptions
- **Smart Improvements**: Enhance existing plugins with AI assistance
- **Auto-Fix**: Automatically fix bugs and errors in your plugins
- **Version History**: Track all changes with comprehensive version control
- **Token-Based System**: Pay-per-use model with Tebex payment integration
- **User Profiles**: Manage account settings and view statistics
- **Plugin Management**: Full CRUD operations for your plugins
- **Download & Export**: Download plugins as ready-to-use files
- **Dark Minimalistic UI**: Professional, sleek interface optimized for developers

## 🏗️ Tech Stack

### Backend
- **Node.js** with Express
- **SQLite** (better-sqlite3) for database
- **JWT** for authentication
- **MegaLLM API** for AI capabilities
- **Tebex Integration** for payments

### Frontend
- **React 18** with modern hooks
- **React Router** for navigation
- **Axios** for API calls
- **Lucide React** for icons
- **Vite** for fast development

## 📦 Installation

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Quick Start

1. **Clone the repository**
```bash
git clone https://github.com/MacMoment/plugins.git
cd plugins
```

2. **Install all dependencies**
```bash
npm run install:all
```

3. **Configure Backend Environment**
```bash
cd backend
cp .env.example .env
# Edit .env and add your API keys
```

Required environment variables:
```env
PORT=3001
JWT_SECRET=your-secret-key-change-this-in-production
MEGALLM_API_KEY=your-megallm-api-key
MEGALLM_API_URL=https://api.megallm.com/v1
TEBEX_WEBHOOK_SECRET=your-tebex-webhook-secret
NODE_ENV=development
```

4. **Configure Frontend Environment**
```bash
cd ../frontend
cp .env.example .env
```

5. **Start Development Servers**

From the root directory:
```bash
npm run dev
```

This starts both backend (port 3001) and frontend (port 5173) concurrently.

Alternatively, run them separately:
```bash
# Backend
cd backend
npm run dev

# Frontend (in another terminal)
cd frontend
npm run dev
```

## 🌐 Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Plugins
- `POST /api/plugins/generate` - Generate new plugin with AI
- `GET /api/plugins` - Get all user's plugins
- `GET /api/plugins/:id` - Get specific plugin
- `GET /api/plugins/:id/history` - Get plugin version history
- `POST /api/plugins/:id/improve` - Improve plugin with AI
- `POST /api/plugins/:id/fix` - Fix plugin issues with AI
- `GET /api/plugins/:id/download` - Download plugin file
- `DELETE /api/plugins/:id` - Delete plugin
- `PATCH /api/plugins/:id` - Update plugin details

### Profile
- `GET /api/profile` - Get user profile
- `PATCH /api/profile` - Update profile
- `GET /api/profile/stats` - Get user statistics

### Payment (Tebex Integration)
- `GET /api/payment/packages` - Get available token packages
- `POST /api/payment/create-checkout` - Create Tebex checkout session
- `POST /api/payment/webhook/tebex` - Tebex webhook handler
- `GET /api/payment/balance` - Get token balance
- `GET /api/payment/transactions` - Get transaction history

## 💰 Token System

The platform uses a token-based billing system where:

- **Token Cost Calculation**: Based on input and output length
- **Formula**: `inputTokens × 0.1 + outputTokens × 0.2`
- **1 Token** ≈ 4 characters
- Users purchase tokens through Tebex payment gateway
- Each AI operation (generate, improve, fix) deducts tokens

### Token Packages

| Package | Tokens | Price |
|---------|--------|-------|
| Starter Pack | 1,000 | $4.99 |
| Creator Pack | 5,000 | $19.99 |
| Pro Pack | 15,000 | $49.99 |
| Enterprise Pack | 50,000 | $149.99 |

## 🎨 UI/UX Design

The platform features a **dark, minimalistic, high-tech design**:

- **Color Scheme**:
  - Primary: Purple (#8b5cf6)
  - Background: Deep Black (#0a0a0a)
  - Surface: Dark Gray (#1a1a1a)
  - Text: White with varying opacity

- **Typography**: System fonts for performance
- **Animations**: Smooth transitions and fade-ins
- **Responsive**: Mobile-first design approach

## 🔒 Security

- JWT-based authentication
- Password hashing with bcryptjs
- Rate limiting on API endpoints
- CORS protection
- Input validation
- SQL injection protection (parameterized queries)

## 🏗️ Project Structure

```
plugins/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── plugins.js
│   │   │   ├── profile.js
│   │   │   └── payment.js
│   │   ├── utils/
│   │   │   ├── tokens.js
│   │   │   └── megallm.js
│   │   └── server.js
│   ├── data/
│   │   └── kodella.db (auto-generated)
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Header.jsx
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── CreatePlugin.jsx
│   │   │   ├── PluginEditor.jsx
│   │   │   ├── Tokens.jsx
│   │   │   └── Profile.jsx
│   │   ├── styles/
│   │   │   └── global.css
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── .gitignore
├── package.json
└── README.md
```

## 🚀 Production Build

```bash
# Build both frontend and backend
npm run build

# Start production server
npm start
```

## 🌐 VPS Deployment

### Server Configuration

The backend server binds to `0.0.0.0` by default, allowing connections from any IP address. Configure these environment variables for your VPS:

**Backend (`backend/.env`):**
```env
PORT=3001
HOST=0.0.0.0
JWT_SECRET=your-secure-secret-change-this
MEGALLM_API_KEY=your-megallm-api-key
MEGALLM_API_URL=https://api.megallm.com/v1
NODE_ENV=production
FRONTEND_URL=https://your-domain.com,http://your-vps-ip:5173
ADMIN_SECRET=your-admin-secret-change-this
TEBEX_WEBHOOK_SECRET=your-tebex-webhook-secret
```

**Frontend (`frontend/.env`):**
```env
VITE_API_URL=https://your-domain.com/api
```

### CORS Configuration

The backend supports multiple CORS origins (comma-separated):
```env
FRONTEND_URL=https://your-domain.com,https://www.your-domain.com
```

### Running with PM2

```bash
# Install PM2
npm install -g pm2

# Start backend
cd backend
pm2 start src/server.js --name kodella-backend

# View logs
pm2 logs kodella-backend
```

### Nginx Reverse Proxy (Recommended)

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    location / {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🔧 Admin CLI Tool

The admin CLI allows administrators to manage users and tokens via SSH console/terminal.

### Usage

```bash
cd backend
npm run admin -- <command> [options]
# or
node src/admin-cli.js <command> [options]
```

### Available Commands

| Command | Description |
|---------|-------------|
| `add-tokens` | Add tokens to a user's balance |
| `set-tokens` | Set a user's token balance to a specific value |
| `list-users` | List all registered users |
| `user-info` | Get detailed information about a user |
| `help` | Show help message |

### Examples

```bash
# List all users
node src/admin-cli.js list-users

# Add 1000 tokens to a user
node src/admin-cli.js add-tokens --user john@example.com --amount 1000

# Add tokens with a reason
node src/admin-cli.js add-tokens --user john --amount 500 --reason "Promotional bonus"

# Set user's token balance
node src/admin-cli.js set-tokens --user 1 --amount 5000

# Get user information
node src/admin-cli.js user-info --user john@example.com
```

### User Identification

You can identify users by:
- **Email**: `--user john@example.com`
- **Username**: `--user john`
- **User ID**: `--user 1`

## 🔧 Configuration

### Tebex Webhook Setup

1. Log in to your Tebex account
2. Navigate to Settings → Webhooks
3. Add webhook URL: `https://yourdomain.com/api/payment/webhook/tebex`
4. Copy the webhook secret to your `.env` file
5. Configure webhook events: `payment.completed`

### MegaLLM API Setup

1. Sign up for MegaLLM API access
2. Get your API key
3. Add to backend `.env`:
```env
MEGALLM_API_KEY=your-key-here
MEGALLM_API_URL=https://api.megallm.com/v1
```

## 📖 Usage Guide

### Creating Your First Plugin

1. **Sign Up**: Create an account at the registration page
2. **Purchase Tokens**: Navigate to Tokens page and purchase a token package
3. **Create Plugin**:
   - Click "Create Plugin" button
   - Enter plugin name and description
   - Write detailed requirements
   - Select AI model
   - Click "Generate Plugin"
4. **Review & Edit**: View generated code in the plugin editor
5. **Improve/Fix**: Use AI assistance to improve or fix issues
6. **Download**: Export your plugin as a file

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please open an issue in the GitHub repository.

## 🎯 Roadmap

- [ ] Multi-language plugin generation
- [ ] Plugin marketplace
- [ ] Team collaboration features
- [ ] API access for integration
- [ ] Plugin testing environment
- [ ] Advanced analytics dashboard
- [ ] Plugin templates library
- [ ] GitHub integration

## 👏 Acknowledgments

- MegaLLM for AI capabilities
- Tebex for payment processing
- React and Node.js communities

---

Built with ❤️ by the Kodella.ai team