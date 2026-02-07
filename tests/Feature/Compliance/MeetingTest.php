<?php

use App\Models\Meeting;
use App\Models\Membership;
use App\Models\Organization;
use App\Models\People;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->organization = Organization::factory()->create();
    Membership::factory()->for($this->user)->for($this->organization)->owner()->create();
});

test('guests cannot access meetings', function () {
    $this->get(route('organizations.meetings.index', $this->organization))
        ->assertRedirect(route('login'));
});

test('members can view meetings index', function () {
    $this->actingAs($this->user)
        ->get(route('organizations.meetings.index', $this->organization))
        ->assertOk();
});

test('members can view the create meeting page', function () {
    $this->actingAs($this->user)
        ->get(route('organizations.meetings.create', $this->organization))
        ->assertOk();
});

test('members can create a meeting', function () {
    $this->actingAs($this->user)
        ->post(route('organizations.meetings.store', $this->organization), [
            'name' => 'Security Review',
            'date' => '2026-03-15',
        ])
        ->assertRedirect();

    expect(Meeting::where('name', 'Security Review')->first())->not->toBeNull();
});

test('members can create a meeting with attendees', function () {
    $people = People::factory()->for($this->organization)->count(2)->create();

    $this->actingAs($this->user)
        ->post(route('organizations.meetings.store', $this->organization), [
            'name' => 'Team Sync',
            'date' => '2026-03-15',
            'attendee_ids' => $people->pluck('id')->toArray(),
        ])
        ->assertRedirect();

    $meeting = Meeting::where('name', 'Team Sync')->first();
    expect($meeting)->not->toBeNull();
    expect($meeting->attendees)->toHaveCount(2);
});

test('meeting name is required', function () {
    $this->actingAs($this->user)
        ->post(route('organizations.meetings.store', $this->organization), [
            'name' => '',
            'date' => '2026-03-15',
        ])
        ->assertSessionHasErrors('name');
});

test('meeting date is required', function () {
    $this->actingAs($this->user)
        ->post(route('organizations.meetings.store', $this->organization), [
            'name' => 'Test',
            'date' => '',
        ])
        ->assertSessionHasErrors('date');
});

test('meeting attendee_ids must reference valid people', function () {
    $this->actingAs($this->user)
        ->post(route('organizations.meetings.store', $this->organization), [
            'name' => 'Test',
            'date' => '2026-03-15',
            'attendee_ids' => [999],
        ])
        ->assertSessionHasErrors('attendee_ids.0');
});

test('members can view a meeting', function () {
    $meeting = Meeting::factory()->for($this->organization)->create();

    $this->actingAs($this->user)
        ->get(route('organizations.meetings.show', [$this->organization, $meeting]))
        ->assertOk();
});

test('non-members cannot view a meeting', function () {
    $otherUser = User::factory()->create();
    $meeting = Meeting::factory()->for($this->organization)->create();

    $this->actingAs($otherUser)
        ->get(route('organizations.meetings.show', [$this->organization, $meeting]))
        ->assertForbidden();
});

test('members can edit a meeting', function () {
    $meeting = Meeting::factory()->for($this->organization)->create();

    $this->actingAs($this->user)
        ->get(route('organizations.meetings.edit', [$this->organization, $meeting]))
        ->assertOk();
});

test('members can update a meeting', function () {
    $meeting = Meeting::factory()->for($this->organization)->create(['name' => 'Old Meeting']);

    $this->actingAs($this->user)
        ->put(route('organizations.meetings.update', [$this->organization, $meeting]), [
            'name' => 'New Meeting',
            'date' => '2026-04-01',
        ])
        ->assertRedirect();

    expect($meeting->fresh()->name)->toBe('New Meeting');
});

test('members can update a meeting with attendees', function () {
    $meeting = Meeting::factory()->for($this->organization)->create();
    $people = People::factory()->for($this->organization)->count(2)->create();

    $this->actingAs($this->user)
        ->put(route('organizations.meetings.update', [$this->organization, $meeting]), [
            'name' => $meeting->name,
            'date' => $meeting->date->format('Y-m-d'),
            'attendee_ids' => $people->pluck('id')->toArray(),
        ])
        ->assertRedirect();

    expect($meeting->fresh()->attendees)->toHaveCount(2);
});

test('members can delete a meeting', function () {
    $meeting = Meeting::factory()->for($this->organization)->create();

    $this->actingAs($this->user)
        ->delete(route('organizations.meetings.destroy', [$this->organization, $meeting]))
        ->assertRedirect();

    expect(Meeting::find($meeting->id))->toBeNull();
});
