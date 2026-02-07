<?php

use App\Models\Membership;
use App\Models\Organization;
use App\Models\Risk;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->organization = Organization::factory()->create();
    Membership::factory()->for($this->user)->for($this->organization)->owner()->create();
});

test('guests cannot access risks', function () {
    $this->get(route('organizations.risks.index', $this->organization))
        ->assertRedirect(route('login'));
});

test('members can view risks index', function () {
    $this->actingAs($this->user)
        ->get(route('organizations.risks.index', $this->organization))
        ->assertOk();
});

test('members can view the create risk page', function () {
    $this->actingAs($this->user)
        ->get(route('organizations.risks.create', $this->organization))
        ->assertOk();
});

test('members can create a risk', function () {
    $this->actingAs($this->user)
        ->post(route('organizations.risks.store', $this->organization), [
            'name' => 'Data Breach',
            'description' => 'Unauthorized access to sensitive data',
            'category' => 'Security',
            'probability' => 3,
            'impact' => 5,
            'treatment' => 'mitigated',
        ])
        ->assertRedirect();

    expect(Risk::where('name', 'Data Breach')->first())->not->toBeNull();
});

test('risk name is required', function () {
    $this->actingAs($this->user)
        ->post(route('organizations.risks.store', $this->organization), [
            'name' => '',
            'probability' => 3,
            'impact' => 3,
            'treatment' => 'mitigated',
        ])
        ->assertSessionHasErrors('name');
});

test('risk probability must be between 1 and 5', function () {
    $this->actingAs($this->user)
        ->post(route('organizations.risks.store', $this->organization), [
            'name' => 'Test',
            'probability' => 6,
            'impact' => 3,
            'treatment' => 'mitigated',
        ])
        ->assertSessionHasErrors('probability');
});

test('members can view a risk', function () {
    $risk = Risk::factory()->for($this->organization)->create();

    $this->actingAs($this->user)
        ->get(route('organizations.risks.show', [$this->organization, $risk]))
        ->assertOk();
});

test('members can update a risk', function () {
    $risk = Risk::factory()->for($this->organization)->create(['name' => 'Old']);

    $this->actingAs($this->user)
        ->put(route('organizations.risks.update', [$this->organization, $risk]), [
            'name' => 'Updated',
            'probability' => 2,
            'impact' => 4,
            'treatment' => 'accepted',
        ])
        ->assertRedirect();

    expect($risk->fresh()->name)->toBe('Updated');
});

test('members can delete a risk', function () {
    $risk = Risk::factory()->for($this->organization)->create();

    $this->actingAs($this->user)
        ->delete(route('organizations.risks.destroy', [$this->organization, $risk]))
        ->assertRedirect();

    expect(Risk::find($risk->id))->toBeNull();
});
