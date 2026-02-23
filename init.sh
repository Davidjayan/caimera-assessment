#!/bin/bash
# init.sh
# Initializes the application on the server using PM2

set -e

# Optimize for low-memory environment (t3.micro - 1GB RAM)
export NX_DAEMON=false
export NODE_OPTIONS="--max_old_space_size=512"
export NODE_ENV="production"

echo "Installing dependencies..."
pnpm install

echo "Building applications sequentially to save memory..."
npx nx build api
npx nx build caimera-assess

echo "Starting applications with PM2..."
# Start API (Node.js) with strict memory bounds
pm2 start dist/apps/api/src/main.js --name "api" --node-args="--max_old_space_size=256"

# Start Frontend (Next.js) with strict memory bounds
pm2 start "pnpm nx start caimera-assess" --name "caimera-assess" --node-args="--max_old_space_size=256"

echo "Saving PM2 configuration..."
pm2 save
pm2 startup

echo "Initialization complete! Applications 'api' and 'caimera-assess' are now managed by PM2."
