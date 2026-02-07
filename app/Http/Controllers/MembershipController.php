<?php

namespace App\Http\Controllers;

use App\Http\Requests\Organization\StoreMembershipRequest;
use App\Models\Membership;
use App\Models\Organization;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class MembershipController extends Controller
{
    public function index(Organization $organization): Response
    {
        $this->authorize('manageMembers', $organization);

        return Inertia::render('organizations/members/index', [
            'organization' => $organization,
            'memberships' => $organization->memberships()
                ->with('user:id,name,email')
                ->orderBy('created_at')
                ->get(),
        ]);
    }

    public function store(StoreMembershipRequest $request, Organization $organization): RedirectResponse
    {
        $this->authorize('manageMembers', $organization);

        $user = User::where('email', $request->validated('email'))->firstOrFail();

        $organization->memberships()->create([
            'user_id' => $user->id,
            'role' => $request->validated('role'),
        ]);

        return to_route('organizations.members.index', $organization);
    }

    public function update(StoreMembershipRequest $request, Organization $organization, Membership $member): RedirectResponse
    {
        $this->authorize('manageMembers', $organization);

        $member->update([
            'role' => $request->validated('role'),
        ]);

        return to_route('organizations.members.index', $organization);
    }

    public function destroy(Organization $organization, Membership $member): RedirectResponse
    {
        $this->authorize('manageMembers', $organization);

        $member->delete();

        return to_route('organizations.members.index', $organization);
    }
}
