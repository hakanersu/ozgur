<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Vendor;

class VendorPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Vendor $vendor): bool
    {
        return $user->belongsToOrganization($vendor->organization);
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Vendor $vendor): bool
    {
        return $user->belongsToOrganization($vendor->organization);
    }

    public function delete(User $user, Vendor $vendor): bool
    {
        return $user->belongsToOrganization($vendor->organization);
    }
}
