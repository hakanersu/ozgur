<?php

namespace App\Policies;

use App\Models\ProcessingActivity;
use App\Models\User;

class ProcessingActivityPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, ProcessingActivity $processingActivity): bool
    {
        return $user->belongsToOrganization($processingActivity->organization);
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, ProcessingActivity $processingActivity): bool
    {
        return $user->belongsToOrganization($processingActivity->organization);
    }

    public function delete(User $user, ProcessingActivity $processingActivity): bool
    {
        return $user->belongsToOrganization($processingActivity->organization);
    }
}
