<?php

use App\Models\Membership;
use App\Models\Organization;
use App\Models\RightsRequest;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->organization = Organization::factory()->create();
    Membership::factory()->for($this->user)->for($this->organization)->owner()->create();
});

test('guests cannot access rights requests', function () {
    $this->get(route('organizations.rights-requests.index', $this->organization))
        ->assertRedirect(route('login'));
});

test('members can view rights requests index', function () {
    $this->actingAs($this->user)
        ->get(route('organizations.rights-requests.index', $this->organization))
        ->assertOk();
});

test('members can view the create rights request page', function () {
    $this->actingAs($this->user)
        ->get(route('organizations.rights-requests.create', $this->organization))
        ->assertOk();
});

test('members can create a rights request', function () {
    $this->actingAs($this->user)
        ->post(route('organizations.rights-requests.store', $this->organization), [
            'request_type' => 'access',
            'request_state' => 'todo',
            'data_subject' => 'John Doe',
            'contact' => 'john@example.com',
            'details' => 'Request for data access',
        ])
        ->assertRedirect();

    expect(RightsRequest::where('data_subject', 'John Doe')->first())->not->toBeNull();
});

test('rights request type is required', function () {
    $this->actingAs($this->user)
        ->post(route('organizations.rights-requests.store', $this->organization), [
            'request_type' => '',
            'request_state' => 'todo',
        ])
        ->assertSessionHasErrors('request_type');
});

test('rights request type must be valid', function () {
    $this->actingAs($this->user)
        ->post(route('organizations.rights-requests.store', $this->organization), [
            'request_type' => 'invalid',
            'request_state' => 'todo',
        ])
        ->assertSessionHasErrors('request_type');
});

test('rights request state must be valid', function () {
    $this->actingAs($this->user)
        ->post(route('organizations.rights-requests.store', $this->organization), [
            'request_type' => 'access',
            'request_state' => 'invalid',
        ])
        ->assertSessionHasErrors('request_state');
});

test('members can view a rights request', function () {
    $rightsRequest = RightsRequest::factory()->for($this->organization)->create();

    $this->actingAs($this->user)
        ->get(route('organizations.rights-requests.show', [$this->organization, $rightsRequest]))
        ->assertOk();
});

test('members can edit a rights request', function () {
    $rightsRequest = RightsRequest::factory()->for($this->organization)->create();

    $this->actingAs($this->user)
        ->get(route('organizations.rights-requests.edit', [$this->organization, $rightsRequest]))
        ->assertOk();
});

test('members can update a rights request', function () {
    $rightsRequest = RightsRequest::factory()->for($this->organization)->create(['data_subject' => 'Old']);

    $this->actingAs($this->user)
        ->put(route('organizations.rights-requests.update', [$this->organization, $rightsRequest]), [
            'request_type' => 'deletion',
            'request_state' => 'in_progress',
            'data_subject' => 'Updated',
        ])
        ->assertRedirect();

    expect($rightsRequest->fresh()->data_subject)->toBe('Updated');
});

test('members can delete a rights request', function () {
    $rightsRequest = RightsRequest::factory()->for($this->organization)->create();

    $this->actingAs($this->user)
        ->delete(route('organizations.rights-requests.destroy', [$this->organization, $rightsRequest]))
        ->assertRedirect();

    expect(RightsRequest::find($rightsRequest->id))->toBeNull();
});

test('non-members cannot view a rights request', function () {
    $otherUser = User::factory()->create();
    $rightsRequest = RightsRequest::factory()->for($this->organization)->create();

    $this->actingAs($otherUser)
        ->get(route('organizations.rights-requests.show', [$this->organization, $rightsRequest]))
        ->assertForbidden();
});
