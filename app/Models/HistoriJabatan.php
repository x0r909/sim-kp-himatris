<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HistoriJabatan extends Model
{
    protected $table = 'histori_jabatan';

    protected $fillable = [
        'anggota_id',
        'jabatan',
        'tahun_mulai',
        'tahun_selesai',
        'periode',
        'keterangan',
    ];

    protected function casts(): array
    {
        return [
            'tahun_mulai' => 'integer',
            'tahun_selesai' => 'integer',
        ];
    }

    public function anggota(): BelongsTo
    {
        return $this->belongsTo(Anggota::class);
    }
}
