# Quick Start Guide - Kodella.ai

Get up and running with Kodella.ai in minutes!

## Prerequisites

- Node.js 18 or higher
- npm or yarn
- A MegaLLM API key (for AI features)
- A Tebex account (for payment processing)

## Installation Steps

### Option 1: Automated Setup (Recommended)

```bash
# Clone the repository
git clone https://github.com/MacMoment/plugins.git
cd plugins

# Run the setup script
./setup.sh

# Configure your API keys in backend/.env
nano backend/.env  # or use your preferred editor

# Start the platform
npm run dev
```

### Option 2: Manual Setup

```bash
# Clone the repository
git clone https://github.com/MacMoment/plugins.git
cd plugins

# Install all dependencies
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..

# Create environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Create data directory
mkdir -p backend/data

# Configure backend/.env with your API keys
# Edit backend/.env and add:
# - MEGALLM_API_KEY=your-api-key
# - JWT_SECRET=your-secret-key
# - TEBEX_WEBHOOK_SECRET=your-webhook-secret

# Start development servers
npm run dev
```

## Access the Platform

Once started, you can access:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

## First Steps

### 1. Create an Account

- Navigate to http://localhost:5173
- Click "Get Started" or "Sign Up"
- Fill in your details (email, username, password)
- Click "Sign Up"

### 2. Purchase Tokens

- After logging in, click on "Tokens" in the navigation
- Select a token package
- Complete the purchase (in dev mode, this is simulated)

### 3. Create Your First Plugin

- Click "Create Plugin" button
- Enter a name for your plugin (e.g., "Email Validator")
- Add a description (optional)
- Write detailed requirements in the prompt field

Example prompt:
```
Create a JavaScript plugin that validates email addresses.
It should:
- Check for proper email format
- Verify the domain has valid characters
- Return true for valid emails, false for invalid
- Include error messages for different failure types
- Handle edge cases like multiple @ symbols
```

- Select an AI model (GPT-4 recommended for best quality)
- Click "Generate Plugin"

### 4. Review and Improve

- View the generated code in the plugin editor
- Use "Improve" to add features or optimize
- Use "Fix" to resolve any issues
- Download the plugin when ready

## Configuration

### Backend Environment Variables

Edit `backend/.env`:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Security
JWT_SECRET=your-super-secret-jwt-key-change-this

# MegaLLM API
MEGALLM_API_KEY=your-megallm-api-key-here
MEGALLM_API_URL=https://api.megallm.com/v1

# Tebex Payment Gateway
TEBEX_WEBHOOK_SECRET=your-tebex-webhook-secret

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

### Frontend Environment Variables

Edit `frontend/.env`:

```env
VITE_API_URL=http://localhost:3001/api
```

## Common Issues

### Database Error

**Problem**: `Cannot open database because the directory does not exist`

**Solution**: Create the data directory:
```bash
mkdir -p backend/data
```

### Port Already in Use

**Problem**: Port 3001 or 5173 is already in use

**Solution**: Change the port in the respective config files:
- Backend: Edit `backend/.env` and change `PORT`
- Frontend: Edit `frontend/vite.config.js` and change `server.port`

### Dependencies Not Installing

**Problem**: npm install fails

**Solution**: 
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

## Development Tips

### Hot Reload

Both frontend and backend support hot reload during development:
- Frontend: Vite hot module replacement
- Backend: nodemon auto-restart

### Debugging

Enable verbose logging:
```bash
# Backend
cd backend
DEBUG=* npm run dev

# Frontend  
cd frontend
npm run dev
```

### Database Reset

To reset the database:
```bash
rm backend/data/kodella.db
# Restart the backend server to recreate the database
```

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Check out [CONTRIBUTING.md](CONTRIBUTING.md) to contribute
- Explore the API endpoints documentation
- Customize the branding and colors

## Support

If you encounter issues:
1. Check the [README.md](README.md) for detailed information
2. Search existing GitHub issues
3. Create a new issue with detailed information

Happy building with Kodella.ai! 🚀
