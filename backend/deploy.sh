#!/bin/bash

# Railway deployment script
echo "🚀 Starting WMS Backend deployment..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Build the application
echo "🏗️ Building application..."
npm run build

# Start the application
echo "✅ Starting application..."
npm start
