# PowerShell script to switch to Docker configuration

# Backup the original connection file if it doesn't exist yet
if (!(Test-Path src/config/connectDB.original.js)) {
  Write-Host "Backing up original connection file..."
  Copy-Item src/config/connectDB.js src/config/connectDB.original.js
}

# Copy the Docker connection file to be the active one
Write-Host "Switching to Docker database configuration..."
Copy-Item src/config/connectDB.docker.js src/config/connectDB.js

# Copy Docker environment file
Write-Host "Setting up Docker environment variables..."
if (Test-Path .env.docker) {
  Copy-Item .env.docker .env
}

Write-Host "Done! Your application is now configured to run in Docker."
Write-Host "Run 'docker-compose up -d' to start the containers."
