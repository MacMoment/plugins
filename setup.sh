#!/bin/bash

# Kodella.ai Setup Script
# This script helps set up the Kodella.ai platform

echo "╔═══════════════════════════════════════╗"
echo "║                                       ║"
echo "║    Kodella.ai Platform Setup          ║"
echo "║                                       ║"
echo "╚═══════════════════════════════════════╝"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install

# Create data directory if it doesn't exist
if [ ! -d "data" ]; then
    mkdir -p data
    echo "✅ Created backend data directory"
fi

# Setup backend .env if it doesn't exist
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "✅ Created backend .env file (please configure with your API keys)"
else
    echo "ℹ️  Backend .env file already exists"
fi

cd ..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install

# Setup frontend .env if it doesn't exist
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "✅ Created frontend .env file"
else
    echo "ℹ️  Frontend .env file already exists"
fi

cd ..

echo ""
echo "╔═══════════════════════════════════════╗"
echo "║                                       ║"
echo "║         Setup Complete! 🎉            ║"
echo "║                                       ║"
echo "╚═══════════════════════════════════════╝"
echo ""
echo "📝 Next Steps:"
echo ""
echo "1. Configure your API keys in backend/.env:"
echo "   - MEGALLM_API_KEY: Your MegaLLM API key"
echo "   - TEBEX_WEBHOOK_SECRET: Your Tebex webhook secret"
echo "   - JWT_SECRET: A secure random string"
echo ""
echo "2. Start the development servers:"
echo "   npm run dev"
echo ""
echo "3. Access the application:"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:3001"
echo ""
echo "For more information, see README.md"
echo ""
