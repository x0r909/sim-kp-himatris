<?php

namespace App\Policies;

use App\Models\Kegiatan;
use App\Models\User;

class KegiatanPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->canManageAnggota();
    }

    public function view(User $user, Kegiatan $kegiatan): bool
    {
        return $user->canManageAnggota();
    }

    public function create(User $user): bool
    {
        return $user->canManageAnggota();
    }

    public function update(User $user, Kegiatan $kegiatan): bool
    {
        return $user->canManageAnggota();
    }

    public function delete(User $user, Kegiatan $kegiatan): bool
    {
        return $user->canManageAnggota();
    }

    public function restore(User $user, Kegiatan $kegiatan): bool
    {
        return $user->canManageAnggota();
    }

    public function forceDelete(User $user, Kegiatan $kegiatan): bool
    {
        return $user->canManageAnggota();
    }
}
