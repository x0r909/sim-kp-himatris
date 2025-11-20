#!/usr/bin/env bash

# Script untuk setup testing database dan environment

echo "🔧 Setting up Testing Environment..."

# Check if .env.testing exists
if [ ! -f .env.testing ]; then
    echo "📄 Creating .env.testing file..."
    cp .env.example .env.testing
    
    # Update database name in .env.testing
    sed -i 's/DB_DATABASE=himatris/DB_DATABASE=himatris_testing/' .env.testing
    echo "✅ .env.testing created"
else
    echo "✅ .env.testing already exists"
fi

# Check if testing database exists
echo "🗄️  Checking MySQL testing database..."

DB_EXISTS=$(mysql -u himatris -ppassword -e "SHOW DATABASES LIKE 'himatris_testing';" | grep himatris_testing || true)

if [ -z "$DB_EXISTS" ]; then
    echo "📦 Creating testing database..."
    mysql -u himatris -ppassword -e "CREATE DATABASE himatris_testing;" 2>/dev/null || {
        echo "⚠️  Could not create database as user 'himatris', trying as root..."
        mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS himatris_testing; GRANT ALL PRIVILEGES ON himatris_testing.* TO 'himatris'@'localhost'; FLUSH PRIVILEGES;"
    }
    echo "✅ Testing database created"
else
    echo "✅ Testing database already exists"
fi

# Run migrations for testing
echo "🚀 Running migrations for testing database..."
php artisan migrate --env=testing --force

echo ""
echo "✨ Testing environment is ready!"
echo ""
echo "You can now run tests with:"
echo "  php artisan test"
echo "  ./vendor/bin/pest"
echo "  composer test"
