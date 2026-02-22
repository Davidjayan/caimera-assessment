#!/bin/bash
# deploy.sh
# Deploys updates to the application and restarts PM2 processes

set -e

echo "Pulling latest changes from git..."
git pull

echo "Installing dependencies..."
pnpm install

echo "Building applications..."
npx nx run-many -t build -p api caimera-assess

echo "Restarting PM2 processes..."
pm2 restart api
pm2 restart caimera-assess

echo "Deployment complete!"
