<?php

namespace App\Policies;

use App\Models\Document;
use App\Models\User;

class DocumentPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Document $document): bool
    {
        return $user->belongsToOrganization($document->organization);
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Document $document): bool
    {
        return $user->belongsToOrganization($document->organization);
    }

    public function delete(User $user, Document $document): bool
    {
        return $user->belongsToOrganization($document->organization);
    }
}
