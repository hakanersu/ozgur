<?php

namespace App\Policies;

use App\Models\People;
use App\Models\User;

class PeoplePolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, People $people): bool
    {
        return $user->belongsToOrganization($people->organization);
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, People $people): bool
    {
        return $user->belongsToOrganization($people->organization);
    }

    public function delete(User $user, People $people): bool
    {
        return $user->belongsToOrganization($people->organization);
    }
}
