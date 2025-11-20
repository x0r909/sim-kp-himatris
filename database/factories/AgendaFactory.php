<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Agenda>
 */
class AgendaFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $tanggalMulai = $this->faker->dateTimeBetween('now', '+3 months');
        $tanggalSelesai = (clone $tanggalMulai)->modify('+'.$this->faker->numberBetween(1, 4).' hours');

        return [
            'judul' => $this->faker->randomElement([
                'Rapat Koordinasi BPH',
                'Seminar Nasional Teknologi',
                'Workshop Web Development',
                'Kegiatan Bakti Sosial',
                'Rapat Pleno Anggota',
                'Pelatihan Soft Skill',
                'Diskusi Proker Semester',
                'Open Recruitment Anggota Baru',
            ]),
            'deskripsi' => $this->faker->paragraph(3),
            'tanggal_mulai' => $tanggalMulai,
            'tanggal_selesai' => $tanggalSelesai,
            'lokasi' => $this->faker->randomElement([
                'Ruang Seminar Gedung A',
                'Aula Kampus',
                'Lab Komputer 1',
                'Ruang Rapat BPH',
                'Online via Zoom',
                'Lapangan Kampus',
            ]),
            'jenis' => $this->faker->randomElement(['rapat', 'seminar', 'workshop', 'kegiatan', 'lainnya']),
            'penanggung_jawab_id' => \App\Models\User::inRandomOrder()->first()->id,
            'kegiatan_id' => null,
            'status' => $this->faker->randomElement(['draft', 'published', 'completed']),
            'catatan' => $this->faker->optional(0.3)->sentence(),
            'created_by' => \App\Models\User::inRandomOrder()->first()->id,
            'updated_by' => null,
        ];
    }
}
