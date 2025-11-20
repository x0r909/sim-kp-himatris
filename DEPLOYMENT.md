# Panduan Deployment SIM-KP HIMATRIS

Dokumen ini menjelaskan langkah-langkah deployment aplikasi SIM-KP HIMATRIS ke production environment.

## 📋 Daftar Isi

- [Persiapan](#persiapan)
- [Deployment ke Shared Hosting](#deployment-ke-shared-hosting)
- [Deployment ke VPS](#deployment-ke-vps)
- [Deployment dengan Laravel Forge](#deployment-dengan-laravel-forge)
- [Konfigurasi Web Server](#konfigurasi-web-server)
- [Post-Deployment](#post-deployment)
- [Troubleshooting](#troubleshooting)

## 🚀 Persiapan

### Requirements Production

- PHP 8.2+ dengan extensions:
  - BCMath
  - Ctype
  - Fileinfo
  - JSON
  - Mbstring
  - OpenSSL
  - PDO
  - Tokenizer
  - XML
- MySQL 8.0+ atau MariaDB 10.3+
- Composer 2.x
- Node.js 20.x+ & npm
- SSL Certificate (Let's Encrypt recommended)
- Git

### Checklist Pre-Deployment

- [ ] Semua tests passing
- [ ] Code review completed
- [ ] Database backup tersedia
- [ ] Environment variables ready
- [ ] SSL certificate ready
- [ ] Domain/subdomain configured
- [ ] Email service configured
- [ ] File storage configured

## 📦 Deployment ke Shared Hosting

### 1. Build Assets Locally

```bash
# Install dependencies
composer install --optimize-autoloader --no-dev
npm install

# Build production assets
npm run build

# Optimize Laravel
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### 2. Upload Files

Upload semua files kecuali:
- `/node_modules`
- `/tests`
- `/.git`
- `.env` (buat baru di server)

### 3. Setup di Server

```bash
# Setup permissions
chmod -R 755 storage bootstrap/cache
chmod -R 777 storage/logs

# Copy environment
cp .env.example .env
php artisan key:generate

# Run migrations
php artisan migrate --force

# Create storage link
php artisan storage:link
```

### 4. Konfigurasi `.htaccess`

Pastikan document root mengarah ke folder `/public`:

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteRule ^(.*)$ public/$1 [L]
</IfModule>
```

## 🖥️ Deployment ke VPS

### Option 1: Manual Setup

#### 1. Install Required Software

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install PHP 8.2
sudo apt install -y php8.2 php8.2-fpm php8.2-mysql php8.2-xml php8.2-mbstring \
    php8.2-curl php8.2-zip php8.2-gd php8.2-bcmath php8.2-redis

# Install MySQL
sudo apt install -y mysql-server

# Install Nginx
sudo apt install -y nginx

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install Composer
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer
```

#### 2. Setup Database

```bash
sudo mysql -u root -p

CREATE DATABASE himatris;
CREATE USER 'himatris_user'@'localhost' IDENTIFIED BY 'strong_password_here';
GRANT ALL PRIVILEGES ON himatris.* TO 'himatris_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

#### 3. Clone & Setup Application

```bash
# Clone repository
cd /var/www
sudo git clone https://github.com/x0r909/sim-kp-himatris.git
cd sim-kp-himatris

# Set ownership
sudo chown -R www-data:www-data /var/www/sim-kp-himatris
sudo chmod -R 755 /var/www/sim-kp-himatris

# Install dependencies
composer install --optimize-autoloader --no-dev
npm install
npm run build

# Setup environment
cp .env.example .env
php artisan key:generate

# Update .env dengan database credentials
nano .env

# Run migrations
php artisan migrate --force

# Setup storage
php artisan storage:link

# Cache configuration
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

#### 4. Setup Nginx

```nginx
# /etc/nginx/sites-available/himatris.conf

server {
    listen 80;
    server_name your-domain.com;
    root /var/www/sim-kp-himatris/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/himatris.conf /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

#### 5. Setup SSL dengan Let's Encrypt

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal sudah dikonfigurasi otomatis
```

#### 6. Setup Queue Worker (Supervisor)

```bash
# Install Supervisor
sudo apt install -y supervisor

# Create configuration
sudo nano /etc/supervisor/conf.d/himatris-worker.conf
```

```ini
[program:himatris-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/sim-kp-himatris/artisan queue:work --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=2
redirect_stderr=true
stdout_logfile=/var/www/sim-kp-himatris/storage/logs/worker.log
stopwaitsecs=3600
```

```bash
# Update Supervisor
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start himatris-worker:*
```

#### 7. Setup Cron Job

```bash
sudo crontab -e
```

Add:
```cron
* * * * * cd /var/www/sim-kp-himatris && php artisan schedule:run >> /dev/null 2>&1
```

### Option 2: Menggunakan Laravel Forge

#### 1. Buat Server di Forge
- Pilih provider (DigitalOcean, AWS, dll)
- Setup specifications
- Install software stack

#### 2. Deploy Application
- Connect Git repository
- Setup deployment script
- Configure environment variables
- Enable quick deploy

#### 3. Deployment Script (Forge)

```bash
cd /home/forge/your-domain.com

git pull origin main

composer install --no-interaction --prefer-dist --optimize-autoloader --no-dev

npm install
npm run build

php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache

php artisan queue:restart
```

#### 4. Setup SSL
- Forge menyediakan Let's Encrypt integration
- Aktifkan melalui dashboard

## ⚙️ Konfigurasi Environment Production

### .env Configuration

```env
APP_NAME="SIM-KP HIMATRIS"
APP_ENV=production
APP_KEY=base64:YOUR_GENERATED_KEY
APP_DEBUG=false
APP_URL=https://your-domain.com

# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=himatris
DB_USERNAME=himatris_user
DB_PASSWORD=strong_password_here

# Cache & Session
CACHE_STORE=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis

# Redis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

# Mail (contoh: Gmail SMTP)
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="noreply@your-domain.com"
MAIL_FROM_NAME="${APP_NAME}"

# AWS S3 (Optional untuk file storage)
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_DEFAULT_REGION=ap-southeast-1
AWS_BUCKET=your-bucket
FILESYSTEM_DISK=s3
```

## 🔄 Post-Deployment

### 1. Verification Checklist

- [ ] Website accessible via HTTPS
- [ ] Login functionality works
- [ ] Database connections working
- [ ] Email sending works
- [ ] File uploads working
- [ ] Queue jobs processing
- [ ] Cron jobs running
- [ ] No console errors
- [ ] SSL certificate valid

### 2. Performance Optimization

```bash
# Enable OPcache (php.ini)
opcache.enable=1
opcache.memory_consumption=256
opcache.max_accelerated_files=20000

# Enable Redis untuk cache
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Optimize autoloader
composer dump-autoload --optimize
```

### 3. Monitoring & Logging

```bash
# Setup Laravel Telescope (development only)
composer require laravel/telescope --dev
php artisan telescope:install
php artisan migrate

# Setup error monitoring (Sentry, Bugsnag, dll)
composer require sentry/sentry-laravel
php artisan sentry:publish
```

### 4. Backup Strategy

```bash
# Database backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mysqldump -u username -p'password' himatris > /backups/db_$DATE.sql
find /backups -name "db_*.sql" -mtime +7 -delete
```

Setup cron untuk otomatis backup:
```cron
0 2 * * * /path/to/backup-script.sh
```

## 🐛 Troubleshooting

### Permission Issues

```bash
# Fix permissions
sudo chown -R www-data:www-data /var/www/sim-kp-himatris
sudo chmod -R 755 /var/www/sim-kp-himatris
sudo chmod -R 775 /var/www/sim-kp-himatris/storage
sudo chmod -R 775 /var/www/sim-kp-himatris/bootstrap/cache
```

### 500 Internal Server Error

1. Check error logs:
```bash
tail -f /var/www/sim-kp-himatris/storage/logs/laravel.log
tail -f /var/log/nginx/error.log
```

2. Clear cache:
```bash
php artisan config:clear
php artisan cache:clear
php artisan view:clear
php artisan route:clear
```

### Database Connection Issues

```bash
# Test database connection
php artisan tinker
>>> DB::connection()->getPdo();
```

### Queue Not Processing

```bash
# Restart queue workers
sudo supervisorctl restart himatris-worker:*

# Check status
sudo supervisorctl status
```

### Storage Link Issues

```bash
# Recreate storage link
php artisan storage:link
```

## 🔐 Security Checklist

- [ ] APP_DEBUG=false di production
- [ ] Strong APP_KEY generated
- [ ] Database credentials secure
- [ ] HTTPS enabled dengan valid SSL
- [ ] .env file tidak ter-commit ke Git
- [ ] Directory listing disabled
- [ ] Rate limiting configured
- [ ] CSRF protection enabled
- [ ] SQL injection protection (use Eloquent)
- [ ] XSS protection
- [ ] File upload validation
- [ ] Regular security updates

## 📊 Monitoring

### Server Monitoring
- CPU usage
- Memory usage
- Disk space
- Database connections
- Queue jobs

### Application Monitoring
- Response times
- Error rates
- User sessions
- Database queries
- API calls

### Recommended Tools
- **Laravel Telescope** - Development debugging
- **Sentry** - Error tracking
- **New Relic** - Application performance
- **Uptime Robot** - Website monitoring
- **CloudFlare** - CDN & DDoS protection

## 🔄 Update Strategy

### Zero-Downtime Deployment

1. Enable maintenance mode:
```bash
php artisan down --secret="your-secret-token"
```

2. Pull latest code & update:
```bash
git pull origin main
composer install --no-dev
npm install && npm run build
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

3. Disable maintenance mode:
```bash
php artisan up
```

## 📞 Support

Untuk bantuan deployment, hubungi tim development atau buat issue di GitHub repository.

---

**Last Updated:** November 2025
