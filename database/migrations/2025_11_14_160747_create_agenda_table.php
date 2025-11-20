<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('agenda', function (Blueprint $table) {
            $table->id();
            $table->string('judul');
            $table->text('deskripsi')->nullable();
            $table->dateTime('tanggal_mulai');
            $table->dateTime('tanggal_selesai');
            $table->string('lokasi')->nullable();
            $table->enum('jenis', ['rapat', 'seminar', 'workshop', 'kegiatan', 'lainnya'])->default('kegiatan');
            $table->foreignId('penanggung_jawab_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('absensi_id')->nullable()->constrained('absensi')->onDelete('set null');
            $table->enum('status', ['draft', 'published', 'completed', 'cancelled'])->default('published');
            $table->text('catatan')->nullable();
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->foreignId('updated_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('agenda');
    }
};
