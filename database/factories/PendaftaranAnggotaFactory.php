<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PendaftaranAnggota>
 */
class PendaftaranAnggotaFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nama_lengkap' => $this->faker->name(),
            'nim' => $this->faker->unique()->numerify('########'),
            'email' => $this->faker->unique()->safeEmail(),
            'no_hp' => $this->faker->numerify('08##########'),
            'jenis_kelamin' => $this->faker->randomElement(['Laki-laki', 'Perempuan']),
            'jurusan' => $this->faker->randomElement(['Teknik Informatika', 'Sistem Informasi', 'Teknik Komputer', 'Manajemen Informatika']),
            'angkatan' => $this->faker->randomElement(['2021', '2022', '2023', '2024', '2025']),
            'alamat' => $this->faker->address(),
            'alasan_bergabung' => $this->faker->paragraph(2),
            'foto' => null,
            'status' => $this->faker->randomElement(['pending', 'approved', 'rejected']),
            'catatan_penolakan' => null,
            'reviewed_by' => null,
            'reviewed_at' => null,
        ];
    }
}
