<?php

namespace App\Policies;

use App\Models\Risk;
use App\Models\User;

class RiskPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Risk $risk): bool
    {
        return $user->belongsToOrganization($risk->organization);
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Risk $risk): bool
    {
        return $user->belongsToOrganization($risk->organization);
    }

    public function delete(User $user, Risk $risk): bool
    {
        return $user->belongsToOrganization($risk->organization);
    }
}
