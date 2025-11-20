# Contributing to SIM-KP HIMATRIS

Terima kasih atas minat Anda untuk berkontribusi pada SIM-KP HIMATRIS! Dokumen ini berisi panduan untuk berkontribusi pada project ini.

## 📋 Daftar Isi

- [Code of Conduct](#code-of-conduct)
- [Cara Memulai](#cara-memulai)
- [Workflow Development](#workflow-development)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)

## 🤝 Code of Conduct

Dengan berpartisipasi dalam project ini, Anda diharapkan untuk:

- Menghormati semua kontributor
- Memberikan feedback yang konstruktif
- Fokus pada yang terbaik untuk komunitas
- Menunjukkan empati terhadap anggota komunitas lainnya

## 🚀 Cara Memulai

### 1. Fork Repository

```bash
# Fork repository melalui GitHub UI
# Kemudian clone fork Anda
git clone https://github.com/YOUR_USERNAME/sim-kp-himatris.git
cd sim-kp-himatris
```

### 2. Setup Development Environment

```bash
# Install dependencies
composer install
npm install

# Setup environment
cp .env.example .env
php artisan key:generate

# Setup database
php artisan migrate --seed

# Build assets
npm run dev
```

### 3. Buat Branch Baru

```bash
git checkout -b feature/nama-fitur-anda
# atau
git checkout -b fix/nama-bug-yang-diperbaiki
```

## 🔄 Workflow Development

### Branch Naming Convention

- `feature/` - Fitur baru (contoh: `feature/export-pdf`)
- `fix/` - Bug fix (contoh: `fix/login-validation`)
- `hotfix/` - Urgent production fix
- `refactor/` - Code refactoring
- `docs/` - Documentation only
- `test/` - Testing improvements

### Development Process

1. **Pastikan branch up to date**
   ```bash
   git checkout main
   git pull origin main
   git checkout feature/your-feature
   git rebase main
   ```

2. **Develop & Test**
   - Tulis code yang clean dan maintainable
   - Tambahkan/update tests
   - Jalankan test suite
   - Test secara manual

3. **Commit Changes**
   ```bash
   git add .
   git commit -m "type: descriptive message"
   ```

4. **Push ke Fork**
   ```bash
   git push origin feature/your-feature
   ```

## 📝 Coding Standards

### PHP (Laravel)

- Ikuti **PSR-12** coding standard
- Gunakan **Laravel Pint** untuk formatting:
  ```bash
  ./vendor/bin/pint
  ```
- Gunakan type hints untuk parameters dan return types
- Tulis PHPDoc untuk methods yang kompleks
- Gunakan **Eloquent** daripada raw queries
- Gunakan **Form Requests** untuk validation

**Contoh Code Style:**

```php
<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAnggotaRequest;
use App\Models\Anggota;
use Illuminate\Http\RedirectResponse;
use Inertia\Response;

class AnggotaController extends Controller
{
    public function store(StoreAnggotaRequest $request): RedirectResponse
    {
        $anggota = Anggota::create($request->validated());

        return redirect()
            ->route('anggota.index')
            ->with('success', 'Anggota berhasil ditambahkan.');
    }
}
```

### JavaScript/TypeScript (React)

- Ikuti **ESLint** configuration
- Gunakan **Prettier** untuk formatting:
  ```bash
  npm run format
  ```
- Gunakan **TypeScript** types
- Gunakan **functional components** dan **hooks**
- Pisahkan components yang reusable
- Gunakan **Tailwind CSS** untuk styling

**Contoh Component:**

```tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface AnggotaFormProps {
    onSubmit: (data: AnggotaData) => void;
    initialData?: AnggotaData;
}

export function AnggotaForm({ onSubmit, initialData }: AnggotaFormProps) {
    const [formData, setFormData] = useState(initialData ?? {});

    return (
        <form onSubmit={(e) => {
            e.preventDefault();
            onSubmit(formData);
        }}>
            {/* Form fields */}
            <Button type="submit">Submit</Button>
        </form>
    );
}
```

### CSS (Tailwind)

- Gunakan **Tailwind utility classes**
- Hindari custom CSS kecuali diperlukan
- Gunakan **dark mode variants** jika applicable
- Extract repeated patterns ke components

## 📌 Commit Guidelines

Gunakan **Conventional Commits** format:

```
type(scope): subject

body (optional)

footer (optional)
```

### Types

- `feat`: Fitur baru
- `fix`: Bug fix
- `docs`: Dokumentasi
- `style`: Formatting, missing semicolons, dll
- `refactor`: Code refactoring
- `test`: Menambah/update tests
- `chore`: Maintenance tasks

### Contoh Commits

```bash
# Good commits
feat(anggota): add export to PDF functionality
fix(auth): resolve login redirect issue
docs(readme): update installation steps
test(kegiatan): add unit tests for KegiatanController

# Bad commits
update stuff
fix bug
changes
WIP
```

## 🔍 Pull Request Process

### 1. Persiapan

- [ ] Code sudah diformat (Pint & Prettier)
- [ ] Semua tests passing
- [ ] Type checking passing (`npm run types`)
- [ ] No linting errors (`npm run lint`)
- [ ] Manual testing sudah dilakukan
- [ ] Documentation updated (jika perlu)

### 2. Buat Pull Request

**Title Format:**
```
type: Brief description
```

**Description Template:**
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Changes Made
- List of changes
- Another change

## Testing
How to test these changes

## Screenshots (if applicable)
Add screenshots here

## Related Issues
Fixes #123
```

### 3. Review Process

- Tunggu review dari maintainers
- Respond to feedback
- Make requested changes
- Re-request review

### 4. Merge

- Setelah approved, PR akan di-merge oleh maintainer
- Branch akan di-delete setelah merge

## 🧪 Testing

### Running Tests

```bash
# Run all tests
php artisan test

# Run specific test
php artisan test --filter=AnggotaTest

# Run with coverage
php artisan test --coverage
```

### Writing Tests

```php
<?php

use App\Models\Anggota;
use App\Models\User;

test('admin can create anggota', function () {
    $user = User::factory()->create(['role' => 'admin']);
    
    $this->actingAs($user)
        ->post(route('anggota.store'), [
            'nim' => '12345678',
            'nama' => 'Test Anggota',
            // ... other fields
        ])
        ->assertRedirect(route('anggota.index'))
        ->assertSessionHas('success');
    
    $this->assertDatabaseHas('anggota', [
        'nim' => '12345678',
    ]);
});
```

## 🐛 Reporting Bugs

Gunakan GitHub Issues dengan template:

```markdown
## Bug Description
Clear description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Screenshots
If applicable

## Environment
- OS: [e.g., Windows 11]
- Browser: [e.g., Chrome 120]
- PHP Version: [e.g., 8.4]
- Laravel Version: [e.g., 12.0]
```

## 💡 Suggesting Features

Gunakan GitHub Issues dengan label `enhancement`:

```markdown
## Feature Description
Clear description of the feature

## Use Case
Why is this feature needed?

## Proposed Solution
How should this work?

## Alternatives Considered
Other approaches you've considered

## Additional Context
Any other relevant information
```

## 📚 Resources

- [Laravel Documentation](https://laravel.com/docs)
- [React Documentation](https://react.dev)
- [Inertia.js Documentation](https://inertiajs.com)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [TypeScript Documentation](https://www.typescriptlang.org)

## ❓ Questions?

Jika ada pertanyaan, jangan ragu untuk:
- Buat GitHub Issue
- Hubungi maintainers
- Diskusi di PR/Issue yang relevan

---

**Terima kasih atas kontribusi Anda! 🎉**
