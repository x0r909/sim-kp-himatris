<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class BphUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Clear existing users except admin
        User::where('email', '!=', 'admin@himatris.com')->delete();

        $bphAccounts = [
            [
                'name' => 'Administrator',
                'username' => 'admin',
                'email' => 'admin@himatris.com',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'status' => 'aktif',
            ],
            [
                'name' => 'Ketua Himpunan',
                'username' => 'ketua',
                'email' => 'ketua@himatris.com',
                'password' => Hash::make('password'),
                'role' => 'ketua',
                'status' => 'aktif',
            ],
            [
                'name' => 'Wakil Ketua Himpunan',
                'username' => 'wakilketua',
                'email' => 'wakilketua@himatris.com',
                'password' => Hash::make('password'),
                'role' => 'wakil_ketua',
                'status' => 'aktif',
            ],
            [
                'name' => 'Sekretaris Umum',
                'username' => 'sekretaris_umum',
                'email' => 'sekretaris.umum@himatris.com',
                'password' => Hash::make('password'),
                'role' => 'sekretaris_umum',
                'status' => 'aktif',
            ],
            [
                'name' => 'Sekretaris 1',
                'username' => 'sekretaris1',
                'email' => 'sekretaris1@himatris.com',
                'password' => Hash::make('password'),
                'role' => 'sekretaris_1',
                'status' => 'aktif',
            ],
            [
                'name' => 'Sekretaris 2',
                'username' => 'sekretaris2',
                'email' => 'sekretaris2@himatris.com',
                'password' => Hash::make('password'),
                'role' => 'sekretaris_2',
                'status' => 'aktif',
            ],
            [
                'name' => 'Bendahara 1',
                'username' => 'bendahara1',
                'email' => 'bendahara1@himatris.com',
                'password' => Hash::make('password'),
                'role' => 'bendahara_1',
                'status' => 'aktif',
            ],
            [
                'name' => 'Bendahara 2',
                'username' => 'bendahara2',
                'email' => 'bendahara2@himatris.com',
                'password' => Hash::make('password'),
                'role' => 'bendahara_2',
                'status' => 'aktif',
            ],
            [
                'name' => 'Anggota Biasa',
                'username' => 'anggota',
                'email' => 'anggota@himatris.com',
                'password' => Hash::make('password'),
                'role' => 'anggota',
                'status' => 'aktif',
            ],
        ];

        foreach ($bphAccounts as $account) {
            User::updateOrCreate(
                ['email' => $account['email']],
                $account
            );
        }

        $this->command->info('BPH accounts created successfully!');
        $this->command->info('Default password for all accounts: password');
    }
}
