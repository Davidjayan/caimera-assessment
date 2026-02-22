#!/bin/bash
# init.sh
# Initializes the application on the server using PM2

set -e

echo "Installing dependencies..."
pnpm install

echo "Building applications..."
npx nx run-many -t build -p api caimera-assess

echo "Starting applications with PM2..."
# Start API (Node.js)
pm2 start dist/apps/api/main.js --name "api"

# Start Frontend (Next.js)
pm2 start "npx nx start caimera-assess" --name "caimera-assess"

echo "Saving PM2 configuration..."
pm2 save
pm2 startup

echo "Initialization complete! Applications 'api' and 'caimera-assess' are now managed by PM2."
