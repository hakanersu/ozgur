<?php

namespace App\Policies;

use App\Models\RightsRequest;
use App\Models\User;

class RightsRequestPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, RightsRequest $rightsRequest): bool
    {
        return $user->belongsToOrganization($rightsRequest->organization);
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, RightsRequest $rightsRequest): bool
    {
        return $user->belongsToOrganization($rightsRequest->organization);
    }

    public function delete(User $user, RightsRequest $rightsRequest): bool
    {
        return $user->belongsToOrganization($rightsRequest->organization);
    }
}
