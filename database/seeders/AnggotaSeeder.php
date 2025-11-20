<?php

namespace Database\Seeders;

use App\Models\Anggota;
use App\Models\User;
use Illuminate\Database\Seeder;

class AnggotaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $jurusanList = [
            'Teknik Informatika',
            'Sistem Informasi',
            'Teknologi Informasi',
            'Ilmu Komputer',
            'Teknik Komputer',
        ];

        $jabatanList = [
            'Ketua Umum',
            'Wakil Ketua',
            'Sekretaris',
            'Wakil Sekretaris',
            'Bendahara',
            'Wakil Bendahara',
            'Koordinator Divisi',
            'Anggota Divisi',
            'Anggota Aktif',
        ];

        $statusList = ['aktif', 'nonaktif', 'alumni'];

        // Seed 20 anggota dengan data dummy
        for ($i = 1; $i <= 20; $i++) {
            $tahunMasuk = rand(2020, 2024);
            $status = $tahunMasuk < 2022 ? 'alumni' : ($tahunMasuk < 2024 ? 'aktif' : 'aktif');
            $spLevel = rand(0, 10) > 7 ? rand(1, 3) : 0; // 30% chance ada SP

            $anggota = Anggota::create([
                'nim' => '2024'.str_pad($i, 4, '0', STR_PAD_LEFT),
                'jurusan' => $jurusanList[array_rand($jurusanList)],
                'jabatan' => $jabatanList[array_rand($jabatanList)],
                'tahun_masuk' => $tahunMasuk,
                'status' => $status,
                'sp_level' => $spLevel,
                'keterangan_sp' => $spLevel > 0 ? 'Terlambat mengumpulkan tugas dan tidak hadir rapat sebanyak '.$spLevel.' kali' : null,
                'total_absen' => rand(0, 5),
                'user_id' => null, // Anggota biasa tidak punya akun
            ]);

            // Buat histori jabatan
            $anggota->historiJabatan()->create([
                'jabatan' => $anggota->jabatan,
                'tahun_mulai' => $anggota->tahun_masuk,
                'tahun_selesai' => $status === 'alumni' ? $anggota->tahun_masuk + 2 : null,
                'periode' => $status === 'alumni' ? 'selesai' : 'aktif',
                'keterangan' => $status === 'alumni' ? 'Periode '.$anggota->tahun_masuk.'-'.($anggota->tahun_masuk + 2) : 'Periode '.$anggota->tahun_masuk.' - sekarang',
            ]);
        }

        // Tambah beberapa anggota BPH yang punya akun user
        $adminUser = User::where('role', 'admin')->first();
        if ($adminUser && ! $adminUser->anggota) {
            $anggota = Anggota::create([
                'user_id' => $adminUser->id,
                'nim' => '202400001',
                'jurusan' => 'Teknik Informatika',
                'jabatan' => 'Ketua Umum',
                'tahun_masuk' => 2023,
                'status' => 'aktif',
                'sp_level' => 0,
                'total_absen' => 0,
            ]);

            $anggota->historiJabatan()->create([
                'jabatan' => $anggota->jabatan,
                'tahun_mulai' => $anggota->tahun_masuk,
                'periode' => 'aktif',
                'keterangan' => 'Ketua Umum periode '.$anggota->tahun_masuk.' - sekarang',
            ]);
        }
    }
}
