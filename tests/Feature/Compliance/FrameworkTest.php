<?php

use App\Models\Framework;
use App\Models\Membership;
use App\Models\Organization;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->organization = Organization::factory()->create();
    Membership::factory()->for($this->user)->for($this->organization)->owner()->create();
});

test('guests cannot access frameworks', function () {
    $this->get(route('organizations.frameworks.index', $this->organization))
        ->assertRedirect(route('login'));
});

test('members can view frameworks index', function () {
    $this->actingAs($this->user)
        ->get(route('organizations.frameworks.index', $this->organization))
        ->assertOk();
});

test('members can view the create framework page', function () {
    $this->actingAs($this->user)
        ->get(route('organizations.frameworks.create', $this->organization))
        ->assertOk();
});

test('members can create a framework', function () {
    $this->actingAs($this->user)
        ->post(route('organizations.frameworks.store', $this->organization), [
            'name' => 'ISO 27001',
            'description' => 'Information security management',
            'version' => '2022',
            'status' => 'draft',
        ])
        ->assertRedirect();

    expect(Framework::where('name', 'ISO 27001')->first())->not->toBeNull();
});

test('framework name is required', function () {
    $this->actingAs($this->user)
        ->post(route('organizations.frameworks.store', $this->organization), [
            'name' => '',
            'status' => 'draft',
        ])
        ->assertSessionHasErrors('name');
});

test('framework status must be valid', function () {
    $this->actingAs($this->user)
        ->post(route('organizations.frameworks.store', $this->organization), [
            'name' => 'Test',
            'status' => 'invalid',
        ])
        ->assertSessionHasErrors('status');
});

test('members can view a framework', function () {
    $framework = Framework::factory()->for($this->organization)->create();

    $this->actingAs($this->user)
        ->get(route('organizations.frameworks.show', [$this->organization, $framework]))
        ->assertOk();
});

test('non-members cannot view a framework', function () {
    $otherUser = User::factory()->create();
    $framework = Framework::factory()->for($this->organization)->create();

    $this->actingAs($otherUser)
        ->get(route('organizations.frameworks.show', [$this->organization, $framework]))
        ->assertForbidden();
});

test('members can edit a framework', function () {
    $framework = Framework::factory()->for($this->organization)->create();

    $this->actingAs($this->user)
        ->get(route('organizations.frameworks.edit', [$this->organization, $framework]))
        ->assertOk();
});

test('members can update a framework', function () {
    $framework = Framework::factory()->for($this->organization)->create(['name' => 'Old Name']);

    $this->actingAs($this->user)
        ->put(route('organizations.frameworks.update', [$this->organization, $framework]), [
            'name' => 'New Name',
            'status' => 'active',
        ])
        ->assertRedirect();

    expect($framework->fresh()->name)->toBe('New Name');
});

test('members can delete a framework', function () {
    $framework = Framework::factory()->for($this->organization)->create();

    $this->actingAs($this->user)
        ->delete(route('organizations.frameworks.destroy', [$this->organization, $framework]))
        ->assertRedirect();

    expect(Framework::find($framework->id))->toBeNull();
});
