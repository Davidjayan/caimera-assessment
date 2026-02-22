#!/bin/bash
# deploy.sh
# Deploys updates to the application and restarts PM2 processes

set -e

# Optimize for low-memory environment (t3.micro - 1GB RAM)
export NX_DAEMON=false
export NODE_OPTIONS="--max_old_space_size=512"

echo "Pulling latest changes from git..."
git pull

echo "Installing dependencies..."
pnpm install

echo "Building applications sequentially to save memory..."
npx nx build api
npx nx build caimera-assess

echo "Restarting PM2 processes..."
pm2 restart api
pm2 restart caimera-assess

echo "Deployment complete!"
