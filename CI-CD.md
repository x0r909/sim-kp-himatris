# CI/CD Configuration

Dokumentasi tentang Continuous Integration dan Continuous Deployment untuk SIM-KP HIMATRIS.

## GitHub Actions

### Workflow: Tests

File: `.github/workflows/tests.yml`

Workflow ini berjalan otomatis pada:
- Push ke branch `main` atau `develop`
- Pull request ke branch `main` atau `develop`

#### Jobs yang Dijalankan:

1. **Setup Environment**
   - PHP 8.4
   - Node.js 22
   - MySQL 8.0 service container

2. **Install Dependencies**
   - Composer packages
   - NPM packages

3. **Build Assets**
   - Vite build production

4. **Database Setup**
   - Wait for MySQL to be ready
   - Run migrations

5. **Run Tests**
   - Pest (PHPUnit) tests
   - All feature and unit tests

6. **Code Quality Checks**
   - Laravel Pint (PHP code style)
   - Prettier (JavaScript/TypeScript formatting)
   - ESLint (JavaScript/TypeScript linting)
   - TypeScript type checking

### MySQL Service Configuration

```yaml
services:
  mysql:
    image: mysql:8.0
    env:
      MYSQL_ROOT_PASSWORD: password
      MYSQL_DATABASE: himatris_testing
      MYSQL_USER: himatris
      MYSQL_PASSWORD: password
    ports:
      - 3306:3306
    options: --health-cmd="mysqladmin ping" --health-interval=10s --health-timeout=5s --health-retries=3
```

### Environment Variables for Tests

Tests menggunakan environment variables berikut:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=himatris_testing
DB_USERNAME=himatris
DB_PASSWORD=password
```

## Local Testing vs CI Testing

### Perbedaan Konfigurasi

| Aspek | Local Development | GitHub Actions CI |
|-------|-------------------|-------------------|
| Database | MySQL lokal atau SQLite | MySQL service container |
| PHP Version | 8.2+ (flexible) | 8.4 (fixed) |
| Node Version | 20+ (flexible) | 22 (fixed) |
| Environment | `.env.testing` | Environment variables |
| Cache | Dapat digunakan | Fresh build setiap run |

### Best Practices

1. **Selalu run tests sebelum push:**
   ```bash
   ./vendor/bin/pest
   ./vendor/bin/pint --test
   npm run lint
   npm run types
   ```

2. **Gunakan pre-commit hooks (optional):**
   ```bash
   # Install husky atau laravel pint git hooks
   composer require --dev laravel/pint-action
   ```

3. **Branch protection rules:**
   - Require status checks before merging
   - Require tests to pass
   - Require code review

## Troubleshooting CI/CD

### Tests Gagal di CI tapi Berhasil di Local

**Kemungkinan Penyebab:**

1. **Perbedaan versi PHP/Node**
   - Pastikan versi lokal sama dengan CI
   - Check dengan: `php -v` dan `node -v`

2. **Database differences**
   - CI menggunakan fresh MySQL 8.0
   - Pastikan migrations berjalan dengan benar

3. **Environment variables**
   - Check semua env vars yang dibutuhkan
   - Pastikan tidak ada dependency ke `.env` file

4. **Cache issues**
   - CI selalu fresh install
   - Clear cache lokal: `php artisan config:clear`

### GitHub Actions Timeout

Jika workflow timeout (biasanya > 6 jam):

1. **Optimize composer install:**
   ```yaml
   - name: Get Composer Cache Directory
     id: composer-cache
     run: echo "dir=$(composer config cache-files-dir)" >> $GITHUB_OUTPUT
   
   - uses: actions/cache@v4
     with:
       path: ${{ steps.composer-cache.outputs.dir }}
       key: ${{ runner.os }}-composer-${{ hashFiles('**/composer.lock') }}
       restore-keys: ${{ runner.os }}-composer-
   ```

2. **Optimize npm install:**
   ```yaml
   - uses: actions/setup-node@v4
     with:
       node-version: '22'
       cache: 'npm'  # Auto cache
   ```

### Failed Migrations

Jika migrations gagal di CI:

1. **Check migration order:**
   - Pastikan foreign keys dibuat setelah parent table
   - Check dependency antar migrations

2. **Check for raw SQL:**
   - Beberapa raw SQL mungkin tidak compatible
   - Test di MySQL 8.0 lokal

3. **Database permissions:**
   - User `himatris` memiliki semua privileges
   - Check GRANT statements

## Adding New Checks

### Menambah Static Analysis (PHPStan)

1. Install PHPStan:
   ```bash
   composer require --dev phpstan/phpstan
   ```

2. Tambahkan ke workflow:
   ```yaml
   - name: Run PHPStan
     run: ./vendor/bin/phpstan analyse
   ```

### Menambah Browser Tests (Laravel Dusk)

1. Install Dusk:
   ```bash
   composer require --dev laravel/dusk
   php artisan dusk:install
   ```

2. Update workflow untuk Chrome:
   ```yaml
   - name: Prepare Dusk
     run: |
       php artisan dusk:chrome-driver
       ./vendor/laravel/dusk/bin/chromedriver-linux &
   
   - name: Run Dusk Tests
     run: php artisan dusk
   ```

### Menambah Code Coverage Report

1. Update workflow:
   ```yaml
   - name: Run Tests with Coverage
     run: ./vendor/bin/pest --coverage --coverage-clover coverage.xml
   
   - name: Upload Coverage
     uses: codecov/codecov-action@v4
     with:
       file: ./coverage.xml
   ```

## Deployment Workflow (Coming Soon)

Untuk production deployment, akan ditambahkan workflow terpisah:

```yaml
name: deploy

on:
  push:
    branches:
      - main
    tags:
      - 'v*'

jobs:
  deploy:
    runs-on: ubuntu-latest
    # ... deployment steps
```

---

**Last Updated:** November 2025
