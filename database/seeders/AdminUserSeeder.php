<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        // Ketua Himpunan
        User::create([
            'name' => 'Ketua Himpunan',
            'username' => 'ketua',
            'email' => 'ketua@himatris.com',
            'password' => Hash::make('password'),
            'role' => 'ketua',
            'status' => 'aktif',
            'email_verified_at' => now(),
        ]);

        // Wakil Ketua Himpunan
        User::create([
            'name' => 'Wakil Ketua Himpunan',
            'username' => 'wakilketua',
            'email' => 'wakilketua@himatris.com',
            'password' => Hash::make('password'),
            'role' => 'wakil_ketua',
            'status' => 'aktif',
            'email_verified_at' => now(),
        ]);

        // Sekretaris Umum
        User::create([
            'name' => 'Sekretaris Umum',
            'username' => 'sekretaris',
            'email' => 'sekretaris@himatris.com',
            'password' => Hash::make('password'),
            'role' => 'sekretaris_umum',
            'status' => 'aktif',
            'email_verified_at' => now(),
        ]);

        // Bendahara 1
        User::create([
            'name' => 'Bendahara 1',
            'username' => 'bendahara',
            'email' => 'bendahara@himatris.com',
            'password' => Hash::make('password'),
            'role' => 'bendahara_1',
            'status' => 'aktif',
            'email_verified_at' => now(),
        ]);

        // Anggota Demo (untuk testing)
        User::create([
            'name' => 'Anggota Demo',
            'username' => 'anggota',
            'email' => 'anggota@himatris.com',
            'password' => Hash::make('password'),
            'role' => 'anggota',
            'status' => 'aktif',
            'email_verified_at' => now(),
        ]);
    }
}
