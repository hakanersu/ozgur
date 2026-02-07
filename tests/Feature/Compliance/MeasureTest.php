<?php

use App\Models\Measure;
use App\Models\Membership;
use App\Models\Organization;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->organization = Organization::factory()->create();
    Membership::factory()->for($this->user)->for($this->organization)->owner()->create();
});

test('guests cannot access measures', function () {
    $this->get(route('organizations.measures.index', $this->organization))
        ->assertRedirect(route('login'));
});

test('members can view measures index', function () {
    $this->actingAs($this->user)
        ->get(route('organizations.measures.index', $this->organization))
        ->assertOk();
});

test('members can view the create measure page', function () {
    $this->actingAs($this->user)
        ->get(route('organizations.measures.create', $this->organization))
        ->assertOk();
});

test('members can create a measure', function () {
    $this->actingAs($this->user)
        ->post(route('organizations.measures.store', $this->organization), [
            'name' => 'Firewall Config',
            'description' => 'Configure network firewall',
            'state' => 'not_started',
        ])
        ->assertRedirect();

    expect(Measure::where('name', 'Firewall Config')->first())->not->toBeNull();
});

test('measure name is required', function () {
    $this->actingAs($this->user)
        ->post(route('organizations.measures.store', $this->organization), [
            'name' => '',
            'state' => 'not_started',
        ])
        ->assertSessionHasErrors('name');
});

test('measure state must be valid', function () {
    $this->actingAs($this->user)
        ->post(route('organizations.measures.store', $this->organization), [
            'name' => 'Test',
            'state' => 'invalid',
        ])
        ->assertSessionHasErrors('state');
});

test('members can view a measure', function () {
    $measure = Measure::factory()->for($this->organization)->create();

    $this->actingAs($this->user)
        ->get(route('organizations.measures.show', [$this->organization, $measure]))
        ->assertOk();
});

test('members can update a measure', function () {
    $measure = Measure::factory()->for($this->organization)->create(['name' => 'Old']);

    $this->actingAs($this->user)
        ->put(route('organizations.measures.update', [$this->organization, $measure]), [
            'name' => 'Updated',
            'state' => 'implemented',
        ])
        ->assertRedirect();

    expect($measure->fresh()->name)->toBe('Updated');
});

test('members can delete a measure', function () {
    $measure = Measure::factory()->for($this->organization)->create();

    $this->actingAs($this->user)
        ->delete(route('organizations.measures.destroy', [$this->organization, $measure]))
        ->assertRedirect();

    expect(Measure::find($measure->id))->toBeNull();
});
