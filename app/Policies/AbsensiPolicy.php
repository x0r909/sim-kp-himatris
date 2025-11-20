<?php

namespace App\Policies;

use App\Models\Absensi;
use App\Models\User;

class AbsensiPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->canManageAnggota();
    }

    public function view(User $user, Absensi $absensi): bool
    {
        return $user->canManageAnggota();
    }

    public function create(User $user): bool
    {
        return $user->canManageAnggota();
    }

    public function update(User $user, Absensi $absensi): bool
    {
        return $user->canManageAnggota();
    }

    public function delete(User $user, Absensi $absensi): bool
    {
        return $user->canManageAnggota();
    }

    public function restore(User $user, Absensi $absensi): bool
    {
        return $user->canManageAnggota();
    }

    public function forceDelete(User $user, Absensi $absensi): bool
    {
        return $user->canManageAnggota();
    }
}
