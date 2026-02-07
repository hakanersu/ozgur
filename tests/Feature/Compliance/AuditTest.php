<?php

use App\Models\Audit;
use App\Models\Membership;
use App\Models\Organization;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->organization = Organization::factory()->create();
    Membership::factory()->for($this->user)->for($this->organization)->owner()->create();
});

test('guests cannot access audits', function () {
    $this->get(route('organizations.audits.index', $this->organization))
        ->assertRedirect(route('login'));
});

test('members can view audits index', function () {
    $this->actingAs($this->user)
        ->get(route('organizations.audits.index', $this->organization))
        ->assertOk();
});

test('members can view the create audit page', function () {
    $this->actingAs($this->user)
        ->get(route('organizations.audits.create', $this->organization))
        ->assertOk();
});

test('members can create an audit', function () {
    $this->actingAs($this->user)
        ->post(route('organizations.audits.store', $this->organization), [
            'name' => 'Q1 Security Audit',
            'description' => 'Quarterly security review',
            'state' => 'not_started',
            'scheduled_at' => '2026-03-01',
        ])
        ->assertRedirect();

    expect(Audit::where('name', 'Q1 Security Audit')->first())->not->toBeNull();
});

test('audit name is required', function () {
    $this->actingAs($this->user)
        ->post(route('organizations.audits.store', $this->organization), [
            'name' => '',
            'state' => 'not_started',
        ])
        ->assertSessionHasErrors('name');
});

test('audit state must be valid', function () {
    $this->actingAs($this->user)
        ->post(route('organizations.audits.store', $this->organization), [
            'name' => 'Test',
            'state' => 'invalid',
        ])
        ->assertSessionHasErrors('state');
});

test('members can view an audit', function () {
    $audit = Audit::factory()->for($this->organization)->create();

    $this->actingAs($this->user)
        ->get(route('organizations.audits.show', [$this->organization, $audit]))
        ->assertOk();
});

test('members can update an audit', function () {
    $audit = Audit::factory()->for($this->organization)->create(['name' => 'Old']);

    $this->actingAs($this->user)
        ->put(route('organizations.audits.update', [$this->organization, $audit]), [
            'name' => 'Updated',
            'state' => 'completed',
        ])
        ->assertRedirect();

    expect($audit->fresh()->name)->toBe('Updated');
});

test('members can delete an audit', function () {
    $audit = Audit::factory()->for($this->organization)->create();

    $this->actingAs($this->user)
        ->delete(route('organizations.audits.destroy', [$this->organization, $audit]))
        ->assertRedirect();

    expect(Audit::find($audit->id))->toBeNull();
});
