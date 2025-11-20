# SIM-KP HIMATRIS

Sistem Informasi Manajemen Kepengurusan Himpunan Mahasiswa Komputer dan Bisnis (HIMATRIS).

## 📋 Deskripsi

SIM-KP HIMATRIS adalah aplikasi web berbasis Laravel 12 dan React 19 yang dirancang untuk mengelola kegiatan organisasi kemahasiswaan HIMATRIS. Aplikasi ini menyediakan sistem manajemen yang komprehensif untuk data keanggotaan, persuratan, absensi, keuangan, dan kegiatan organisasi.

## ✨ Fitur Utama

### 1. **Manajemen Autentikasi & User**
- Login dengan username/email dan password
- Registrasi pengguna baru
- Email verification
- Password reset
- Two-Factor Authentication (2FA)
- Role-based access control dengan 9 roles:
  - `admin` - Administrator sistem
  - `ketua` - Ketua Himpunan
  - `wakil_ketua` - Wakil Ketua
  - `sekretaris_umum` - Sekretaris Umum
  - `sekretaris_1` - Sekretaris 1
  - `sekretaris_2` - Sekretaris 2
  - `bendahara_1` - Bendahara 1
  - `bendahara_2` - Bendahara 2
  - `anggota` - Anggota Biasa

### 2. **Manajemen Anggota**
- Data anggota lengkap (NIM, nama, jurusan, angkatan, dll)
- Histori jabatan anggota
- Sistem pendaftaran anggota baru
- Approval/reject pendaftaran oleh admin
- Relasi dengan user account
- Status aktif/nonaktif

**Akses:** Admin, Ketua, Wakil Ketua, Sekretaris Umum

### 3. **Manajemen Persuratan**
- **Surat Masuk**
  - Nomor surat, pengirim, perihal
  - Tanggal diterima dan surat
  - Upload file surat
  - Keterangan/disposisi
  
- **Surat Keluar**
  - Nomor surat, tujuan, perihal
  - Tanggal surat
  - Upload file surat
  - Penanggungjawab/pembuat surat

**Akses:** Admin, BPH Inti, Semua Sekretaris

### 4. **Manajemen Kegiatan & Absensi**
- **Kegiatan**
  - Nama, tanggal, tempat kegiatan
  - Deskripsi dan jenis kegiatan
  - Penanggung jawab
  - Status kegiatan

- **Absensi**
  - Sistem absensi per kegiatan
  - Tracking kehadiran anggota
  - Status: Hadir, Izin, Sakit, Tidak Hadir
  - Keterangan absensi

**Akses:** Admin, BPH Inti, Semua Sekretaris

### 5. **Agenda/Kalender**
- Penjadwalan kegiatan
- Relasi dengan kegiatan dan absensi
- Manajemen waktu dan tempat
- Status agenda

**Akses:** Admin, BPH Inti, Semua Sekretaris

### 6. **Manajemen Keuangan**
- **Transaksi Keuangan**
  - Pemasukan dan pengeluaran
  - Kategori transaksi
  - Tanggal dan nominal
  - Keterangan detail
  - Bukti transaksi (upload)

- **Analisis Keuangan**
  - Dashboard analisis keuangan
  - Visualisasi data keuangan
  - Laporan periode tertentu

- **Audit Keuangan**
  - Sistem audit transaksi
  - Tracking perubahan
  - Catatan audit

**Akses:** Admin, BPH Inti, Semua Bendahara

### 7. **Dashboard**
- Dashboard khusus per role
- Statistik dan overview data
- Quick access ke fitur utama

### 8. **Settings/Pengaturan**
- Profile management
- Password change
- Two-factor authentication setup
- Account preferences

## 🛠️ Teknologi yang Digunakan

### Backend
- **Laravel 12** - PHP Framework
- **PHP 8.2+** - Programming Language
- **MySQL** - Database
- **Laravel Fortify** - Authentication
- **Inertia.js** - Modern Monolith Stack

### Frontend
- **React 19** - JavaScript Library
- **TypeScript** - Type Safety
- **Tailwind CSS 4** - Utility-first CSS
- **Vite 7** - Frontend Build Tool
- **Radix UI** - UI Components
- **Lucide React** - Icons
- **Laravel Wayfinder** - Type-safe routing

### Development Tools
- **Pest 4** - Testing Framework
- **Laravel Pint** - Code Style Fixer
- **ESLint** - JavaScript Linter
- **Prettier** - Code Formatter
- **Laravel Sail** - Docker Development Environment
- **Laravel Boost** - MCP Server untuk development

## 📦 Persyaratan Sistem

### Minimum Requirements
- PHP >= 8.2
- Composer >= 2.0
- Node.js >= 20.x
- npm >= 10.x
- MySQL >= 8.0 / MariaDB >= 10.3
- Git

### Recommended
- PHP 8.4
- MySQL 8.0+
- Node.js 22.x
- 2GB RAM minimum
- SSD Storage

## 🚀 Instalasi & Setup

### 1. Clone Repository

```bash
git clone https://github.com/x0r909/sim-kp-himatris.git
cd sim-kp-himatris
```

### 2. Install Dependencies

```bash
# Install PHP dependencies
composer install

# Install JavaScript dependencies
npm install
```

### 3. Environment Configuration

```bash
# Copy file .env.example ke .env
cp .env.example .env

# Generate application key
php artisan key:generate
```

### 4. Database Setup

Edit file `.env` dan sesuaikan konfigurasi database:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=himatris
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

Buat database baru:

```bash
# Untuk MySQL
mysql -u root -p
CREATE DATABASE himatris;
EXIT;
```

### 5. Run Migrations & Seeders

```bash
# Jalankan migrasi dan seeder
php artisan migrate --seed
```

Seeder akan membuat user default:

| Username | Email | Password | Role |
|----------|-------|----------|------|
| ketua | ketua@himatris.com | password | ketua |
| wakilketua | wakilketua@himatris.com | password | wakil_ketua |
| sekretaris | sekretaris@himatris.com | password | sekretaris_umum |
| bendahara | bendahara@himatris.com | password | bendahara_1 |
| anggota | anggota@himatris.com | password | anggota |

### 6. Storage Link

```bash
# Buat symbolic link untuk storage
php artisan storage:link
```

### 7. Build Frontend Assets

```bash
# Development mode
npm run dev

# Production build
npm run build
```

## 🎮 Menjalankan Aplikasi

### Development Mode

#### Opsi 1: Manual (3 Terminal)

Terminal 1 - Laravel Server:
```bash
php artisan serve
```

Terminal 2 - Queue Worker:
```bash
php artisan queue:listen
```

Terminal 3 - Vite Dev Server:
```bash
npm run dev
```

#### Opsi 2: Composer Script (Recommended)

```bash
composer run dev
```

Perintah ini akan menjalankan semua service sekaligus menggunakan concurrently.

### Production Mode

```bash
# Build assets
npm run build

# Configure web server (Apache/Nginx)
# Point document root ke folder /public
```

### Menggunakan Laravel Sail (Docker)

```bash
# Start services
./vendor/bin/sail up -d

# Run migrations
./vendor/bin/sail artisan migrate --seed

# Install npm dependencies
./vendor/bin/sail npm install

# Build assets
./vendor/bin/sail npm run build
```

## 🧪 Testing

### Setup Testing Database

Untuk menjalankan tests, buat database testing terpisah:

```bash
# Buat database testing
mysql -u root -p

# Di MySQL prompt:
CREATE DATABASE himatris_testing;
GRANT ALL PRIVILEGES ON himatris_testing.* TO 'himatris'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# Jalankan migrations untuk testing database
php artisan migrate --env=testing
```

### Menjalankan Tests

```bash
# Jalankan semua tests
php artisan test

# Menggunakan Pest langsung
./vendor/bin/pest

# Menggunakan composer script
composer test

# Jalankan test spesifik
php artisan test --filter=UserTest

# Jalankan test dengan coverage
php artisan test --coverage

# Jalankan test untuk specific file
php artisan test tests/Feature/UserManagementTest.php

# Jalankan hanya Unit tests
./vendor/bin/pest --testsuite=Unit

# Jalankan hanya Feature tests
./vendor/bin/pest --testsuite=Feature
```

### Testing di GitHub Actions

GitHub Actions workflow (`.github/workflows/tests.yml`) sudah dikonfigurasi dengan:
- MySQL 8.0 service container
- Automatic database migration
- Code quality checks (Pint, ESLint, TypeScript)
- Asset building

Workflow akan berjalan otomatis pada:
- Push ke branch `main` atau `develop`
- Pull request ke branch `main` atau `develop`

### Membuat Test Baru

```bash
# Feature test (untuk testing end-to-end functionality)
php artisan make:test UserManagementTest

# Unit test (untuk testing isolated components)
php artisan make:test --unit CalculationTest --pest

# Test dengan Pest
php artisan make:test --pest AnggotaTest
```

### Troubleshooting Testing

**Error: "could not find driver"**
- Pastikan PHP memiliki extension `pdo_mysql` atau `pdo_sqlite`
- Check dengan: `php -m | grep pdo`

**Error: "Access denied for user"**
- Periksa credentials di `.env.testing`
- Pastikan database user memiliki privileges

**Error: "Database does not exist"**
- Jalankan script setup: `.\setup-testing.ps1` atau `./setup-testing.sh`
- Atau buat database manual seperti di atas

## 📝 Code Quality

### Format Code

```bash
# Format PHP dengan Laravel Pint
./vendor/bin/pint

# Format JavaScript/TypeScript dengan Prettier
npm run format

# Check format
npm run format:check
```

### Linting

```bash
# Lint dan fix JavaScript/TypeScript
npm run lint

# Type checking
npm run types
```

## 📂 Struktur Project

```
himatris/
├── app/
│   ├── Actions/           # Fortify actions
│   ├── Http/
│   │   ├── Controllers/   # API & Web controllers
│   │   ├── Middleware/    # Custom middleware
│   │   └── Requests/      # Form request validation
│   ├── Models/            # Eloquent models
│   └── Policies/          # Authorization policies
├── bootstrap/
├── config/                # Configuration files
├── database/
│   ├── factories/         # Model factories
│   ├── migrations/        # Database migrations
│   └── seeders/           # Database seeders
├── public/                # Public assets
├── resources/
│   ├── css/               # Stylesheets
│   ├── js/
│   │   ├── components/    # React components
│   │   ├── pages/         # Inertia pages
│   │   ├── types/         # TypeScript types
│   │   └── app.tsx        # Main React app
│   └── views/             # Blade templates
├── routes/
│   ├── console.php        # Console commands
│   ├── settings.php       # Settings routes
│   └── web.php            # Web routes
├── storage/               # Storage files
├── tests/                 # Test files
│   ├── Feature/           # Feature tests
│   └── Unit/              # Unit tests
└── vendor/                # Composer dependencies
```

## 🔒 Security

### Best Practices

1. **Jangan commit file `.env`** - File ini berisi kredensial sensitif
2. **Gunakan HTTPS** - Di production environment
3. **Update dependencies** - Secara berkala untuk security patches
4. **Strong passwords** - Untuk user accounts
5. **Enable 2FA** - Untuk admin dan BPH

### Environment Variables

Pastikan variable berikut di-set dengan benar di `.env`:

```env
APP_ENV=production          # Di production
APP_DEBUG=false             # Di production
APP_KEY=                    # Generate dengan artisan key:generate
```

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

1. Fork repository
2. Buat branch baru (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

### Coding Standards

- PHP: Ikuti PSR-12, gunakan Laravel Pint
- JavaScript/TypeScript: Ikuti ESLint config
- Commits: Gunakan conventional commits

## 📄 License

Project ini dilisensikan di bawah [MIT License](LICENSE).

## 👥 Tim Pengembang

**Repository:** [sim-kp-himatris](https://github.com/x0r909/sim-kp-himatris)

## 📞 Support

Jika ada pertanyaan atau issue, silakan buat issue di GitHub repository atau hubungi tim pengembang.

## 🔄 Changelog

### Version 1.0.0 (Current)
- Initial release
- Fitur manajemen anggota
- Fitur persuratan
- Fitur absensi & kegiatan
- Fitur keuangan
- Authentication dengan Fortify
- Role-based access control
- Dashboard per role

## 🎯 Roadmap

- [ ] Export data ke PDF/Excel
- [ ] Notifikasi real-time
- [ ] Mobile responsive improvements
- [ ] API documentation
- [ ] Integration dengan sistem akademik
- [ ] Laporan statistik advanced
- [ ] Backup otomatis
- [ ] Multi-language support

---

**Dibuat dengan cinta❤️ untuk HIMATRIS**
