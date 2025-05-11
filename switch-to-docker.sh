#!/bin/bash

# Backup the original connection file if it doesn't exist yet
if [ ! -f src/config/connectDB.original.js ]; then
  echo "Backing up original connection file..."
  cp src/config/connectDB.js src/config/connectDB.original.js
fi

# Copy the Docker connection file to be the active one
echo "Switching to Docker database configuration..."
cp src/config/connectDB.docker.js src/config/connectDB.js

# Copy Docker environment file
echo "Setting up Docker environment variables..."
cp .env.docker .env

echo "Done! Your application is now configured to run in Docker."
echo "Run 'docker-compose up -d' to start the containers."
