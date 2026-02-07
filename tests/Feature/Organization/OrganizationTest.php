<?php

use App\Enums\OrganizationRole;
use App\Models\Membership;
use App\Models\Organization;
use App\Models\User;

test('guests cannot access organizations', function () {
    $this->get(route('organizations.index'))
        ->assertRedirect(route('login'));
});

test('authenticated users can view their organizations', function () {
    $user = User::factory()->create();
    $organization = Organization::factory()->create();
    Membership::factory()->for($user)->for($organization)->owner()->create();

    $this->actingAs($user)
        ->get(route('organizations.index'))
        ->assertOk();
});

test('authenticated users can view the create organization page', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('organizations.create'))
        ->assertOk();
});

test('authenticated users can create an organization', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('organizations.store'), [
            'name' => 'Acme Corp',
        ])
        ->assertRedirect();

    $organization = Organization::where('name', 'Acme Corp')->first();

    expect($organization)->not->toBeNull()
        ->and($organization->slug)->toBe('acme-corp')
        ->and($organization->memberships)->toHaveCount(1)
        ->and($organization->memberships->first()->role)->toBe(OrganizationRole::Owner)
        ->and($organization->memberships->first()->user_id)->toBe($user->id);
});

test('organization name is required', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('organizations.store'), [
            'name' => '',
        ])
        ->assertSessionHasErrors('name');
});

test('members can view their organization', function () {
    $user = User::factory()->create();
    $organization = Organization::factory()->create();
    Membership::factory()->for($user)->for($organization)->create();

    $this->actingAs($user)
        ->get(route('organizations.show', $organization))
        ->assertOk();
});

test('non-members cannot view an organization', function () {
    $user = User::factory()->create();
    $organization = Organization::factory()->create();

    $this->actingAs($user)
        ->get(route('organizations.show', $organization))
        ->assertForbidden();
});

test('owners can edit their organization', function () {
    $user = User::factory()->create();
    $organization = Organization::factory()->create();
    Membership::factory()->for($user)->for($organization)->owner()->create();

    $this->actingAs($user)
        ->get(route('organizations.edit', $organization))
        ->assertOk();
});

test('members cannot edit an organization', function () {
    $user = User::factory()->create();
    $organization = Organization::factory()->create();
    Membership::factory()->for($user)->for($organization)->create();

    $this->actingAs($user)
        ->get(route('organizations.edit', $organization))
        ->assertForbidden();
});

test('owners can update their organization', function () {
    $user = User::factory()->create();
    $organization = Organization::factory()->create(['name' => 'Old Name']);
    Membership::factory()->for($user)->for($organization)->owner()->create();

    $this->actingAs($user)
        ->put(route('organizations.update', $organization), [
            'name' => 'New Name',
        ])
        ->assertRedirect();

    expect($organization->fresh()->name)->toBe('New Name')
        ->and($organization->fresh()->slug)->toBe('new-name');
});

test('owners can delete their organization', function () {
    $user = User::factory()->create();
    $organization = Organization::factory()->create();
    Membership::factory()->for($user)->for($organization)->owner()->create();

    $this->actingAs($user)
        ->delete(route('organizations.destroy', $organization))
        ->assertRedirect(route('organizations.index'));

    expect(Organization::find($organization->id))->toBeNull();
});

test('non-owners cannot delete an organization', function () {
    $user = User::factory()->create();
    $organization = Organization::factory()->create();
    Membership::factory()->for($user)->for($organization)->admin()->create();

    $this->actingAs($user)
        ->delete(route('organizations.destroy', $organization))
        ->assertForbidden();
});
