#!/bin/bash
set -e

# Wait for MySQL to be ready
echo "Waiting for MySQL to be ready..."
until mysql -h db -u freedom_user -pfreedom_password -e "SELECT 1" >/dev/null 2>&1; do
  echo "MySQL is unavailable - sleeping"
  sleep 2
done

echo "MySQL is up - executing database setup"

# Import your database schema and initial data
mysql -h db -u freedom_user -pfreedom_password freedom_db < /app/db/schema.sql

echo "Database initialization completed"
