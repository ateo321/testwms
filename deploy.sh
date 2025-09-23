#!/bin/bash

# Simple Railway deployment script
echo "🚀 Deploying WMS Backend to Railway..."

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Installing..."
    npm install -g @railway/cli
fi

# Login to Railway (if not already logged in)
echo "🔐 Logging in to Railway..."
railway login

# Go to backend directory
cd backend

# Deploy to Railway
echo "📦 Deploying backend..."
railway up

# Add environment variables
echo "🔧 Setting up environment variables..."
echo "Please add these environment variables in Railway dashboard:"
echo "- DATABASE_URL=your-postgresql-url"
echo "- JWT_SECRET=your-jwt-secret"
echo "- NODE_ENV=production"

# Open the deployed app
echo "🌐 Opening deployed application..."
railway open

echo "✅ Deployment complete!"
