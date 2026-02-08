<?php

namespace App\Http\Controllers;

use App\Models\OrganizationInvitation;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class InvitationController extends Controller
{
    public function show(string $token): Response|RedirectResponse
    {
        $invitation = OrganizationInvitation::where('token', $token)
            ->whereNull('accepted_at')
            ->firstOrFail();

        if ($invitation->isExpired()) {
            abort(410);
        }

        $existingUser = User::where('email', $invitation->email)->first();

        if ($existingUser && Auth::id() === $existingUser->id) {
            return $this->acceptInvitation($invitation, $existingUser);
        }

        return Inertia::render('invitations/accept', [
            'invitation' => [
                'token' => $invitation->token,
                'email' => $invitation->email,
                'organization_name' => $invitation->organization->name,
                'role' => $invitation->role->value,
            ],
            'userExists' => $existingUser !== null,
        ]);
    }

    public function accept(Request $request, string $token): RedirectResponse
    {
        $invitation = OrganizationInvitation::where('token', $token)
            ->whereNull('accepted_at')
            ->firstOrFail();

        if ($invitation->isExpired()) {
            abort(410);
        }

        $existingUser = User::where('email', $invitation->email)->first();

        if ($existingUser) {
            $this->acceptInvitation($invitation, $existingUser);

            return to_route('login');
        }

        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $user = User::create([
            'name' => $request->input('name'),
            'email' => $invitation->email,
            'password' => Hash::make($request->input('password')),
            'email_verified_at' => now(),
        ]);

        $this->acceptInvitation($invitation, $user);

        Auth::login($user);

        return to_route('organizations.show', $invitation->organization);
    }

    private function acceptInvitation(OrganizationInvitation $invitation, User $user): RedirectResponse
    {
        $invitation->organization->memberships()->firstOrCreate(
            ['user_id' => $user->id],
            ['role' => $invitation->role],
        );

        $invitation->update(['accepted_at' => now()]);

        return to_route('organizations.show', $invitation->organization);
    }
}
