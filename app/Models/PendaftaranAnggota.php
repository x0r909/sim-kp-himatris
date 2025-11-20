<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class PendaftaranAnggota extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'pendaftaran_anggota';

    protected $fillable = [
        'nama_lengkap',
        'nim',
        'email',
        'no_hp',
        'jenis_kelamin',
        'jurusan',
        'angkatan',
        'alamat',
        'alasan_bergabung',
        'foto',
        'status',
        'catatan_penolakan',
        'reviewed_by',
        'reviewed_at',
    ];

    protected function casts(): array
    {
        return [
            'reviewed_at' => 'datetime',
        ];
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }
}
