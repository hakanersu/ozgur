<?php

use App\Models\Membership;
use App\Models\Organization;
use App\Models\People;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->organization = Organization::factory()->create();
    Membership::factory()->for($this->user)->for($this->organization)->owner()->create();
});

test('guests cannot access people', function () {
    $this->get(route('organizations.people.index', $this->organization))
        ->assertRedirect(route('login'));
});

test('members can view people index', function () {
    $this->actingAs($this->user)
        ->get(route('organizations.people.index', $this->organization))
        ->assertOk();
});

test('members can view the create people page', function () {
    $this->actingAs($this->user)
        ->get(route('organizations.people.create', $this->organization))
        ->assertOk();
});

test('members can create a person', function () {
    $this->actingAs($this->user)
        ->post(route('organizations.people.store', $this->organization), [
            'full_name' => 'Jane Doe',
            'primary_email' => 'jane@example.com',
            'kind' => 'employee',
        ])
        ->assertRedirect();

    expect(People::where('full_name', 'Jane Doe')->first())->not->toBeNull();
});

test('person full_name is required', function () {
    $this->actingAs($this->user)
        ->post(route('organizations.people.store', $this->organization), [
            'full_name' => '',
            'primary_email' => 'jane@example.com',
            'kind' => 'employee',
        ])
        ->assertSessionHasErrors('full_name');
});

test('person primary_email must be valid', function () {
    $this->actingAs($this->user)
        ->post(route('organizations.people.store', $this->organization), [
            'full_name' => 'Jane Doe',
            'primary_email' => 'not-an-email',
            'kind' => 'employee',
        ])
        ->assertSessionHasErrors('primary_email');
});

test('person kind must be valid', function () {
    $this->actingAs($this->user)
        ->post(route('organizations.people.store', $this->organization), [
            'full_name' => 'Jane Doe',
            'primary_email' => 'jane@example.com',
            'kind' => 'invalid',
        ])
        ->assertSessionHasErrors('kind');
});

test('members can view a person', function () {
    $person = People::factory()->for($this->organization)->create();

    $this->actingAs($this->user)
        ->get(route('organizations.people.show', [$this->organization, $person]))
        ->assertOk();
});

test('non-members cannot view a person', function () {
    $otherUser = User::factory()->create();
    $person = People::factory()->for($this->organization)->create();

    $this->actingAs($otherUser)
        ->get(route('organizations.people.show', [$this->organization, $person]))
        ->assertForbidden();
});

test('members can edit a person', function () {
    $person = People::factory()->for($this->organization)->create();

    $this->actingAs($this->user)
        ->get(route('organizations.people.edit', [$this->organization, $person]))
        ->assertOk();
});

test('members can update a person', function () {
    $person = People::factory()->for($this->organization)->create(['full_name' => 'Old Name']);

    $this->actingAs($this->user)
        ->put(route('organizations.people.update', [$this->organization, $person]), [
            'full_name' => 'New Name',
            'primary_email' => 'new@example.com',
            'kind' => 'employee',
        ])
        ->assertRedirect();

    expect($person->fresh()->full_name)->toBe('New Name');
});

test('members can delete a person', function () {
    $person = People::factory()->for($this->organization)->create();

    $this->actingAs($this->user)
        ->delete(route('organizations.people.destroy', [$this->organization, $person]))
        ->assertRedirect();

    expect(People::find($person->id))->toBeNull();
});
