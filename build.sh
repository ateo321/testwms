#!/bin/bash

echo "🚀 Starting WMS build process..."

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install

# Build frontend
echo "🏗️ Building frontend..."
npm run build

# Copy frontend build to backend
echo "📋 Copying frontend build to backend..."
cp -r out ../backend/

# Build backend
echo "🔧 Building backend..."
cd ../backend
npm run build

echo "✅ Build completed successfully!"
