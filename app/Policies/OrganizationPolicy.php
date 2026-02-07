<?php

namespace App\Policies;

use App\Enums\OrganizationRole;
use App\Models\Organization;
use App\Models\User;

class OrganizationPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Organization $organization): bool
    {
        return $user->belongsToOrganization($organization);
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Organization $organization): bool
    {
        $role = $user->organizationRole($organization);

        return in_array($role, [OrganizationRole::Owner, OrganizationRole::Admin]);
    }

    public function delete(User $user, Organization $organization): bool
    {
        return $user->organizationRole($organization) === OrganizationRole::Owner;
    }

    public function manageMembers(User $user, Organization $organization): bool
    {
        $role = $user->organizationRole($organization);

        return in_array($role, [OrganizationRole::Owner, OrganizationRole::Admin]);
    }
}
