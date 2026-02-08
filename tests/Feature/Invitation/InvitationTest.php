<?php

use App\Models\Membership;
use App\Models\Organization;
use App\Models\OrganizationInvitation;
use App\Models\User;
use Illuminate\Support\Facades\URL;

test('existing user can accept an invitation via signed link', function () {
    $user = User::factory()->create();
    $organization = Organization::factory()->create();
    $invitation = OrganizationInvitation::factory()
        ->for($organization)
        ->create(['email' => $user->email]);

    $url = URL::temporarySignedRoute('invitations.show', now()->addDays(7), ['token' => $invitation->token]);

    $this->actingAs($user)
        ->get($url)
        ->assertRedirect(route('organizations.show', $organization));

    expect($organization->memberships()->where('user_id', $user->id)->exists())->toBeTrue();
    expect($invitation->fresh()->accepted_at)->not->toBeNull();
});

test('new user can register and accept an invitation', function () {
    $organization = Organization::factory()->create();
    $invitation = OrganizationInvitation::factory()
        ->for($organization)
        ->create(['email' => 'newuser@example.com']);

    $acceptUrl = URL::temporarySignedRoute('invitations.accept', now()->addDays(7), ['token' => $invitation->token]);

    $this->post($acceptUrl, [
        'name' => 'New User',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ])->assertRedirect(route('organizations.show', $organization));

    $newUser = User::where('email', 'newuser@example.com')->first();
    expect($newUser)->not->toBeNull();
    expect($newUser->name)->toBe('New User');
    expect($organization->memberships()->where('user_id', $newUser->id)->exists())->toBeTrue();
    expect($invitation->fresh()->accepted_at)->not->toBeNull();
});

test('existing user accepting invitation redirects to login', function () {
    $user = User::factory()->create();
    $organization = Organization::factory()->create();
    $invitation = OrganizationInvitation::factory()
        ->for($organization)
        ->create(['email' => $user->email]);

    $acceptUrl = URL::temporarySignedRoute('invitations.accept', now()->addDays(7), ['token' => $invitation->token]);

    $this->post($acceptUrl)
        ->assertRedirect(route('login'));

    expect($organization->memberships()->where('user_id', $user->id)->exists())->toBeTrue();
    expect($invitation->fresh()->accepted_at)->not->toBeNull();
});

test('expired invitation cannot be viewed', function () {
    $invitation = OrganizationInvitation::factory()->expired()->create();

    $url = URL::temporarySignedRoute('invitations.show', now()->addDays(7), ['token' => $invitation->token]);

    $this->get($url)->assertGone();
});

test('already accepted invitation returns 404', function () {
    $invitation = OrganizationInvitation::factory()->accepted()->create();

    $url = URL::temporarySignedRoute('invitations.show', now()->addDays(7), ['token' => $invitation->token]);

    $this->get($url)->assertNotFound();
});

test('unsigned URL returns 403', function () {
    $invitation = OrganizationInvitation::factory()->create();

    $this->get(route('invitations.show', ['token' => $invitation->token]))
        ->assertForbidden();
});

test('re-inviting replaces old pending invitation', function () {
    $admin = User::factory()->create();
    $organization = Organization::factory()->create();
    Membership::factory()->for($admin)->for($organization)->admin()->create();

    $oldInvitation = OrganizationInvitation::factory()
        ->for($organization)
        ->create([
            'invited_by' => $admin->id,
            'email' => 'test@example.com',
        ]);

    \Illuminate\Support\Facades\Notification::fake();

    $this->actingAs($admin)
        ->post(route('organizations.members.store', $organization), [
            'email' => 'test@example.com',
            'role' => 'member',
        ])
        ->assertRedirect();

    expect(OrganizationInvitation::find($oldInvitation->id))->toBeNull();
    expect($organization->invitations()->where('email', 'test@example.com')->count())->toBe(1);
});

test('show page renders for non-logged-in user with existing account', function () {
    $user = User::factory()->create();
    $organization = Organization::factory()->create();
    $invitation = OrganizationInvitation::factory()
        ->for($organization)
        ->create(['email' => $user->email]);

    $url = URL::temporarySignedRoute('invitations.show', now()->addDays(7), ['token' => $invitation->token]);

    $this->get($url)
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('invitations/accept')
            ->where('userExists', true)
        );
});

test('show page renders for new user', function () {
    $organization = Organization::factory()->create();
    $invitation = OrganizationInvitation::factory()
        ->for($organization)
        ->create(['email' => 'brand-new@example.com']);

    $url = URL::temporarySignedRoute('invitations.show', now()->addDays(7), ['token' => $invitation->token]);

    $this->get($url)
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('invitations/accept')
            ->where('userExists', false)
        );
});
