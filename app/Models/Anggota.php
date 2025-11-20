<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Anggota extends Model
{
    protected $table = 'anggota';

    protected $fillable = [
        'user_id',
        'nim',
        'jurusan',
        'jabatan',
        'tahun_masuk',
        'status',
        'foto',
        'sp_level',
        'keterangan_sp',
        'total_absen',
    ];

    protected function casts(): array
    {
        return [
            'tahun_masuk' => 'integer',
            'sp_level' => 'integer',
            'total_absen' => 'integer',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function historiJabatan(): HasMany
    {
        return $this->hasMany(HistoriJabatan::class);
    }

    public function getStatusPeringatanAttribute(): ?string
    {
        return match($this->sp_level) {
            1 => 'SP1',
            2 => 'SP2',
            3 => 'SP3',
            default => null,
        };
    }

    public function getNamaLengkapAttribute(): string
    {
        return $this->user?->name ?? 'Tidak ada akun';
    }
}
