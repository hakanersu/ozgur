<?php

namespace App\Policies;

use App\Models\Snapshot;
use App\Models\User;

class SnapshotPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Snapshot $snapshot): bool
    {
        return $user->belongsToOrganization($snapshot->organization);
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function delete(User $user, Snapshot $snapshot): bool
    {
        return $user->belongsToOrganization($snapshot->organization);
    }
}
