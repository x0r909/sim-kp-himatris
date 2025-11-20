# PowerShell script untuk setup testing database dan environment

Write-Host "🔧 Setting up Testing Environment..." -ForegroundColor Cyan

# Check if .env.testing exists
if (-Not (Test-Path .env.testing)) {
    Write-Host "📄 Creating .env.testing file..." -ForegroundColor Yellow
    Copy-Item .env.example .env.testing
    
    # Update database name in .env.testing
    (Get-Content .env.testing) -replace 'DB_DATABASE=himatris', 'DB_DATABASE=himatris_testing' | Set-Content .env.testing
    Write-Host "✅ .env.testing created" -ForegroundColor Green
} else {
    Write-Host "✅ .env.testing already exists" -ForegroundColor Green
}

# Check if testing database exists
Write-Host "🗄️  Checking MySQL testing database..." -ForegroundColor Cyan

try {
    $dbExists = mysql -u himatris -ppassword -e "SHOW DATABASES LIKE 'himatris_testing';" 2>&1 | Select-String "himatris_testing"
    
    if (-Not $dbExists) {
        Write-Host "📦 Creating testing database..." -ForegroundColor Yellow
        mysql -u himatris -ppassword -e "CREATE DATABASE himatris_testing;" 2>$null
        
        if ($LASTEXITCODE -ne 0) {
            Write-Host "⚠️  Could not create database as user 'himatris', trying as root..." -ForegroundColor Yellow
            $rootPassword = Read-Host "Enter MySQL root password" -AsSecureString
            $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($rootPassword)
            $password = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
            mysql -u root -p"$password" -e "CREATE DATABASE IF NOT EXISTS himatris_testing; GRANT ALL PRIVILEGES ON himatris_testing.* TO 'himatris'@'localhost'; FLUSH PRIVILEGES;"
        }
        Write-Host "✅ Testing database created" -ForegroundColor Green
    } else {
        Write-Host "✅ Testing database already exists" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  Error checking/creating database: $_" -ForegroundColor Red
}

# Run migrations for testing
Write-Host "🚀 Running migrations for testing database..." -ForegroundColor Cyan
php artisan migrate --env=testing --force

Write-Host ""
Write-Host "✨ Testing environment is ready!" -ForegroundColor Green
Write-Host ""
Write-Host "You can now run tests with:" -ForegroundColor Cyan
Write-Host "  php artisan test" -ForegroundColor White
Write-Host "  ./vendor/bin/pest" -ForegroundColor White
Write-Host "  composer test" -ForegroundColor White
