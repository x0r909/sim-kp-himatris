<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AuditKeuangan extends Model
{
    use HasFactory;

    protected $table = 'audit_keuangan';

    protected $fillable = [
        'keuangan_id',
        'auditor_id',
        'catatan',
        'status_audit',
        'tanggal_audit',
    ];

    protected function casts(): array
    {
        return [
            'tanggal_audit' => 'date',
        ];
    }

    public function keuangan(): BelongsTo
    {
        return $this->belongsTo(Keuangan::class, 'keuangan_id');
    }

    public function auditor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'auditor_id');
    }
}
