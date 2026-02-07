<?php

namespace App\Policies;

use App\Models\TrustCenter;
use App\Models\User;

class TrustCenterPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, TrustCenter $trustCenter): bool
    {
        return $user->belongsToOrganization($trustCenter->organization);
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, TrustCenter $trustCenter): bool
    {
        return $user->belongsToOrganization($trustCenter->organization);
    }

    public function delete(User $user, TrustCenter $trustCenter): bool
    {
        return $user->belongsToOrganization($trustCenter->organization);
    }
}
