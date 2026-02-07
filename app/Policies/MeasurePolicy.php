<?php

namespace App\Policies;

use App\Models\Measure;
use App\Models\User;

class MeasurePolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Measure $measure): bool
    {
        return $user->belongsToOrganization($measure->organization);
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Measure $measure): bool
    {
        return $user->belongsToOrganization($measure->organization);
    }

    public function delete(User $user, Measure $measure): bool
    {
        return $user->belongsToOrganization($measure->organization);
    }
}
