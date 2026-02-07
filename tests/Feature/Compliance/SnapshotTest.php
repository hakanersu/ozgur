<?php

use App\Models\Membership;
use App\Models\Organization;
use App\Models\Snapshot;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->organization = Organization::factory()->create();
    Membership::factory()->for($this->user)->for($this->organization)->owner()->create();
});

test('guests cannot access snapshots', function () {
    $this->get(route('organizations.snapshots.index', $this->organization))
        ->assertRedirect(route('login'));
});

test('members can view snapshots index', function () {
    $this->actingAs($this->user)
        ->get(route('organizations.snapshots.index', $this->organization))
        ->assertOk();
});

test('members can view the create snapshot page', function () {
    $this->actingAs($this->user)
        ->get(route('organizations.snapshots.create', $this->organization))
        ->assertOk();
});

test('members can create a snapshot', function () {
    $this->actingAs($this->user)
        ->post(route('organizations.snapshots.store', $this->organization), [
            'name' => 'Q1 Risk Snapshot',
            'description' => 'Quarterly risk assessment snapshot',
            'type' => 'risks',
        ])
        ->assertRedirect();

    expect(Snapshot::where('name', 'Q1 Risk Snapshot')->first())->not->toBeNull();
});

test('snapshot name is required', function () {
    $this->actingAs($this->user)
        ->post(route('organizations.snapshots.store', $this->organization), [
            'name' => '',
            'type' => 'assets',
        ])
        ->assertSessionHasErrors('name');
});

test('snapshot type must be a valid enum value', function () {
    $this->actingAs($this->user)
        ->post(route('organizations.snapshots.store', $this->organization), [
            'name' => 'Test Snapshot',
            'type' => 'invalid_type',
        ])
        ->assertSessionHasErrors('type');
});

test('members can view a snapshot', function () {
    $snapshot = Snapshot::factory()->for($this->organization)->create();

    $this->actingAs($this->user)
        ->get(route('organizations.snapshots.show', [$this->organization, $snapshot]))
        ->assertOk();
});

test('members can delete a snapshot', function () {
    $snapshot = Snapshot::factory()->for($this->organization)->create();

    $this->actingAs($this->user)
        ->delete(route('organizations.snapshots.destroy', [$this->organization, $snapshot]))
        ->assertRedirect();

    expect(Snapshot::find($snapshot->id))->toBeNull();
});
