<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'username',
        'email',
        'password',
        'role',
        'foto',
        'status',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }

    public function anggota(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(Anggota::class);
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isBPHInti(): bool
    {
        return in_array($this->role, ['ketua', 'wakil_ketua', 'sekretaris_umum']);
    }

    public function isSekretaris(): bool
    {
        return in_array($this->role, ['sekretaris_umum', 'sekretaris_1', 'sekretaris_2']);
    }

    public function isBendahara(): bool
    {
        return in_array($this->role, ['bendahara_1', 'bendahara_2']);
    }

    public function canManageUsers(): bool
    {
        return $this->role === 'admin';
    }

    public function canAccessAllModules(): bool
    {
        return in_array($this->role, ['admin', 'ketua', 'wakil_ketua', 'sekretaris_umum']);
    }

    public function canManageAnggota(): bool
    {
        return $this->canAccessAllModules();
    }

    public function canManagePersuratan(): bool
    {
        return $this->canAccessAllModules() || $this->isSekretaris();
    }

    public function canManageAbsensi(): bool
    {
        return $this->canAccessAllModules() || $this->isSekretaris();
    }

    public function canManageKeuangan(): bool
    {
        return $this->isAdmin() || $this->isBPHInti() || $this->isBendahara();
    }

    public function canViewKeuangan(): bool
    {
        return $this->canAccessAllModules() || $this->isBendahara();
    }
}
