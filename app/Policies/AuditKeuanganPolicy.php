<?php

namespace App\Policies;

use App\Models\AuditKeuangan;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class AuditKeuanganPolicy
{
    private function canManageAudit(User $user): bool
    {
        return $user->canManageKeuangan();
    }

    private function canViewAudit(User $user): bool
    {
        return $user->canViewKeuangan();
    }

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $this->canViewAudit($user);
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, AuditKeuangan $auditKeuangan): bool
    {
        return $this->canViewAudit($user);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $this->canManageAudit($user);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, AuditKeuangan $auditKeuangan): bool
    {
        return $this->canManageAudit($user);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, AuditKeuangan $auditKeuangan): bool
    {
        return $this->canManageAudit($user);
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, AuditKeuangan $auditKeuangan): bool
    {
        return $this->canManageAudit($user);
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, AuditKeuangan $auditKeuangan): bool
    {
        return $this->canManageAudit($user);
    }
}
