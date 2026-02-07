<?php

namespace App\Policies;

use App\Models\Framework;
use App\Models\User;

class FrameworkPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Framework $framework): bool
    {
        return $user->belongsToOrganization($framework->organization);
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Framework $framework): bool
    {
        return $user->belongsToOrganization($framework->organization);
    }

    public function delete(User $user, Framework $framework): bool
    {
        return $user->belongsToOrganization($framework->organization);
    }
}
