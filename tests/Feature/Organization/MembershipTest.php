<?php

use App\Enums\OrganizationRole;
use App\Models\Membership;
use App\Models\Organization;
use App\Models\User;

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

test('admins can add a member to the organization', function () {
    $admin = User::factory()->create();
    $newMember = User::factory()->create();
    $organization = Organization::factory()->create();
    Membership::factory()->for($admin)->for($organization)->admin()->create();

    $this->actingAs($admin)
        ->post(route('organizations.members.store', $organization), [
            'email' => $newMember->email,
            'role' => 'member',
        ])
        ->assertRedirect();

    expect($organization->memberships()->where('user_id', $newMember->id)->exists())->toBeTrue();
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

test('adding a non-existent user fails validation', function () {
    $admin = User::factory()->create();
    $organization = Organization::factory()->create();
    Membership::factory()->for($admin)->for($organization)->admin()->create();

    $this->actingAs($admin)
        ->post(route('organizations.members.store', $organization), [
            'email' => 'nonexistent@example.com',
            'role' => 'member',
        ])
        ->assertSessionHasErrors('email');
});
