<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Update existing 'bendahara' role to 'bendahara_1' temporarily
        DB::statement("UPDATE users SET role = 'anggota' WHERE role = 'bendahara'");

        // Update enum untuk role dengan jabatan BPH yang lebih spesifik
        DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('admin', 'ketua', 'wakil_ketua', 'sekretaris_umum', 'sekretaris_1', 'sekretaris_2', 'bendahara_1', 'bendahara_2', 'anggota') NOT NULL DEFAULT 'anggota'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Rollback ke enum lama
        DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('admin', 'bendahara', 'anggota') NOT NULL DEFAULT 'anggota'");
    }
};
