<?php

namespace App\Http\Controllers;

use App\Http\Requests\Organization\StoreMembershipRequest;
use App\Models\Membership;
use App\Models\Organization;
use App\Models\OrganizationInvitation;
use App\Notifications\OrganizationInvitationNotification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Str;
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
            'invitations' => $organization->invitations()
                ->whereNull('accepted_at')
                ->where('expires_at', '>', now())
                ->with('inviter:id,name')
                ->orderByDesc('created_at')
                ->get(),
        ]);
    }

    public function store(StoreMembershipRequest $request, Organization $organization): RedirectResponse
    {
        $this->authorize('manageMembers', $organization);

        $email = $request->validated('email');

        $isAlreadyMember = $organization->memberships()
            ->whereHas('user', fn ($query) => $query->where('email', $email))
            ->exists();

        if ($isAlreadyMember) {
            return back()->withErrors(['email' => __('This user is already a member of this organization.')]);
        }

        $organization->invitations()
            ->where('email', $email)
            ->whereNull('accepted_at')
            ->delete();

        $invitation = $organization->invitations()->create([
            'invited_by' => $request->user()->id,
            'email' => $email,
            'role' => $request->validated('role'),
            'token' => Str::random(64),
            'expires_at' => now()->addDays(7),
        ]);

        Notification::route('mail', $email)
            ->notify(new OrganizationInvitationNotification($invitation));

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

    public function destroyInvitation(Organization $organization, OrganizationInvitation $invitation): RedirectResponse
    {
        $this->authorize('manageMembers', $organization);

        $invitation->delete();

        return to_route('organizations.members.index', $organization);
    }
}
