<?php

namespace App\Policies;

use App\Models\PendaftaranAnggota;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class PendaftaranAnggotaPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        // Admin, Ketua, Wakil, Sekretaris Umum dapat melihat daftar pendaftaran
        return $user->canAccessAllModules() || $user->isSekretaris();
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, PendaftaranAnggota $pendaftaranAnggota): bool
    {
        return $user->canAccessAllModules() || $user->isSekretaris();
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(?User $user): bool
    {
        // Siapa saja bisa mendaftar (bahkan guest/belum login)
        return true;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, PendaftaranAnggota $pendaftaranAnggota): bool
    {
        // Hanya bisa update jika masih pending
        return ($user->canAccessAllModules() || $user->isSekretaris()) 
            && $pendaftaranAnggota->status === 'pending';
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, PendaftaranAnggota $pendaftaranAnggota): bool
    {
        return $user->canAccessAllModules();
    }

    /**
     * Determine whether the user can approve the registration.
     */
    public function approve(User $user, PendaftaranAnggota $pendaftaranAnggota): bool
    {
        // Admin, Ketua, Wakil, Sekretaris Umum dapat menyetujui
        return ($user->canAccessAllModules() || $user->isSekretaris())
            && $pendaftaranAnggota->status === 'pending';
    }

    /**
     * Determine whether the user can reject the registration.
     */
    public function reject(User $user, PendaftaranAnggota $pendaftaranAnggota): bool
    {
        return ($user->canAccessAllModules() || $user->isSekretaris())
            && $pendaftaranAnggota->status === 'pending';
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, PendaftaranAnggota $pendaftaranAnggota): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, PendaftaranAnggota $pendaftaranAnggota): bool
    {
        return false;
    }
}
