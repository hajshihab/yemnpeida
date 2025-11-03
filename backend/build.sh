#!/usr/bin/env bash
# Build script for Render deployment

set -e

echo "🚀 Starting Yemen-Pedia Backend Build..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Seed database with initial data
echo "🌱 Seeding database..."

# Seed categories (15 Yemeni categories)
echo "📚 Seeding categories..."
node database/seed-categories.js

# Seed sources (10 Yemeni sources)
echo "📰 Seeding sources..."
node database/seed-sources.js

# Seed sample articles (5 articles about Yemen)
echo "📝 Seeding sample articles..."
node database/seed-articles.js

# Create super admin account
echo "👤 Creating super admin account..."
node database/create-super-admin.js

echo "✅ Build completed successfully!"
echo "🎉 Yemen-Pedia Backend is ready to deploy!"
