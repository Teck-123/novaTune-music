#!/bin/bash
echo "Stopping any running Vite processes..."
pkill -f vite || true

echo "Cleaning Vite cache..."
rm -rf node_modules/.vite

echo "Starting development server..."
npm run dev