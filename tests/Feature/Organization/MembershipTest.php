<?php

use App\Enums\OrganizationRole;
use App\Models\Membership;
use App\Models\Organization;
use App\Models\OrganizationInvitation;
use App\Models\User;
use App\Notifications\OrganizationInvitationNotification;
use Illuminate\Support\Facades\Notification;

test('admins can view the members page', function () {
    $user = User::factory()->create();
    $organization = Organization::factory()->create();
    Membership::factory()->for($user)->for($organization)->admin()->create();

    $this->actingAs($user)
        ->get(route('organizations.members.index', $organization))
        ->assertOk();
});

test('regular members cannot view the members page', function () {
    $user = User::factory()->create();
    $organization = Organization::factory()->create();
    Membership::factory()->for($user)->for($organization)->create();

    $this->actingAs($user)
        ->get(route('organizations.members.index', $organization))
        ->assertForbidden();
});

test('admins can invite a member to the organization', function () {
    Notification::fake();

    $admin = User::factory()->create();
    $organization = Organization::factory()->create();
    Membership::factory()->for($admin)->for($organization)->admin()->create();

    $this->actingAs($admin)
        ->post(route('organizations.members.store', $organization), [
            'email' => 'newuser@example.com',
            'role' => 'member',
        ])
        ->assertRedirect();

    expect($organization->invitations()->where('email', 'newuser@example.com')->exists())->toBeTrue();

    Notification::assertSentOnDemand(OrganizationInvitationNotification::class);
});

test('admins can update a member role', function () {
    $admin = User::factory()->create();
    $organization = Organization::factory()->create();
    Membership::factory()->for($admin)->for($organization)->admin()->create();

    $membership = Membership::factory()->for($organization)->create(['role' => OrganizationRole::Member]);

    $this->actingAs($admin)
        ->put(route('organizations.members.update', [$organization, $membership->id]), [
            'role' => 'admin',
        ])
        ->assertRedirect();

    expect($membership->fresh()->role)->toBe(OrganizationRole::Admin);
});

test('admins can remove a member from the organization', function () {
    $admin = User::factory()->create();
    $organization = Organization::factory()->create();
    Membership::factory()->for($admin)->for($organization)->admin()->create();

    $membership = Membership::factory()->for($organization)->create();

    $this->actingAs($admin)
        ->delete(route('organizations.members.destroy', [$organization, $membership->id]))
        ->assertRedirect();

    expect(Membership::find($membership->id))->toBeNull();
});

test('inviting an existing member returns an error', function () {
    Notification::fake();

    $admin = User::factory()->create();
    $existingMember = User::factory()->create();
    $organization = Organization::factory()->create();
    Membership::factory()->for($admin)->for($organization)->admin()->create();
    Membership::factory()->for($existingMember)->for($organization)->create();

    $this->actingAs($admin)
        ->post(route('organizations.members.store', $organization), [
            'email' => $existingMember->email,
            'role' => 'member',
        ])
        ->assertSessionHasErrors('email');

    Notification::assertNothingSent();
});

test('admins can cancel a pending invitation', function () {
    $admin = User::factory()->create();
    $organization = Organization::factory()->create();
    Membership::factory()->for($admin)->for($organization)->admin()->create();

    $invitation = OrganizationInvitation::factory()
        ->for($organization)
        ->create(['invited_by' => $admin->id]);

    $this->actingAs($admin)
        ->delete(route('organizations.invitations.destroy', [$organization, $invitation]))
        ->assertRedirect();

    expect(OrganizationInvitation::find($invitation->id))->toBeNull();
});

test('members index shows pending invitations', function () {
    $admin = User::factory()->create();
    $organization = Organization::factory()->create();
    Membership::factory()->for($admin)->for($organization)->admin()->create();

    OrganizationInvitation::factory()
        ->for($organization)
        ->create(['invited_by' => $admin->id, 'email' => 'pending@example.com']);

    $this->actingAs($admin)
        ->get(route('organizations.members.index', $organization))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('invitations', 1)
        );
});
