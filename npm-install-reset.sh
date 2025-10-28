#!/usr/bin/env bash
set -euo pipefail

# Reset npm registry
npm config set registry https://registry.npmjs.org

# Clean up old modules and cache
rm -rf node_modules package-lock.json
npm cache clean --force

# Install dependencies safely
npm install --legacy-peer-deps
