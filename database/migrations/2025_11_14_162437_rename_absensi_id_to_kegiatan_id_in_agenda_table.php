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
        Schema::table('agenda', function (Blueprint $table) {
            // Drop foreign key first if it exists
            $table->dropForeign(['absensi_id']);
            
            // Rename column
            $table->renameColumn('absensi_id', 'kegiatan_id');
            
            // Add new foreign key
            $table->foreign('kegiatan_id')
                ->references('id')
                ->on('kegiatan')
                ->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('agenda', function (Blueprint $table) {
            // Drop foreign key
            $table->dropForeign(['kegiatan_id']);
            
            // Rename column back
            $table->renameColumn('kegiatan_id', 'absensi_id');
            
            // Add old foreign key back
            $table->foreign('absensi_id')
                ->references('id')
                ->on('absensi')
                ->onDelete('set null');
        });
    }
};
