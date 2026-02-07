<?php

use App\Models\Membership;
use App\Models\Organization;
use App\Models\TrustCenter;
use App\Models\TrustCenterAccess;
use App\Models\TrustCenterReference;
use App\Models\User;

beforeEach(function () {
    $this->withoutVite();
    $this->user = User::factory()->create();
    $this->organization = Organization::factory()->create();
    Membership::factory()->for($this->user)->for($this->organization)->owner()->create();
    $this->trustCenter = TrustCenter::factory()->for($this->organization)->create();
});

test('guests cannot access trust center', function () {
    $this->get(route('organizations.trust-center.show', $this->organization))
        ->assertRedirect(route('login'));
});

test('members can view trust center settings', function () {
    $this->actingAs($this->user)
        ->get(route('organizations.trust-center.show', $this->organization))
        ->assertOk();
});

test('members can update trust center settings', function () {
    $this->actingAs($this->user)
        ->put(route('organizations.trust-center.update', $this->organization), [
            'slug' => 'new-slug',
            'title' => 'Updated Trust Center',
            'is_active' => true,
        ])
        ->assertRedirect();

    expect($this->trustCenter->fresh())
        ->slug->toBe('new-slug')
        ->title->toBe('Updated Trust Center')
        ->is_active->toBeTrue();
});

test('slug must be alpha_dash', function () {
    $this->actingAs($this->user)
        ->put(route('organizations.trust-center.update', $this->organization), [
            'slug' => 'invalid slug with spaces',
        ])
        ->assertSessionHasErrors('slug');
});

test('members can create a reference', function () {
    $this->actingAs($this->user)
        ->post(route('organizations.trust-center.references.store', $this->organization), [
            'name' => 'Acme Corp',
            'description' => 'A trusted partner',
            'url' => 'https://acme.com',
            'rank' => 1,
        ])
        ->assertRedirect();

    expect(TrustCenterReference::where('name', 'Acme Corp')->first())->not->toBeNull();
});

test('reference name is required', function () {
    $this->actingAs($this->user)
        ->post(route('organizations.trust-center.references.store', $this->organization), [
            'name' => '',
            'url' => 'https://acme.com',
        ])
        ->assertSessionHasErrors('name');
});

test('members can delete a reference', function () {
    $reference = TrustCenterReference::factory()->for($this->trustCenter)->create();

    $this->actingAs($this->user)
        ->delete(route('organizations.trust-center.references.destroy', [$this->organization, $reference]))
        ->assertRedirect();

    expect(TrustCenterReference::find($reference->id))->toBeNull();
});

test('members can update access state', function () {
    $access = TrustCenterAccess::factory()->for($this->trustCenter)->create();

    $this->actingAs($this->user)
        ->put(route('organizations.trust-center.accesses.update', [$this->organization, $access]), [
            'state' => 'granted',
        ])
        ->assertRedirect();

    expect($access->fresh()->state->value)->toBe('granted');
});

test('members can delete an access', function () {
    $access = TrustCenterAccess::factory()->for($this->trustCenter)->create();

    $this->actingAs($this->user)
        ->delete(route('organizations.trust-center.accesses.destroy', [$this->organization, $access]))
        ->assertRedirect();

    expect(TrustCenterAccess::find($access->id))->toBeNull();
});
