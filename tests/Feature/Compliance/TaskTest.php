<?php

use App\Models\Membership;
use App\Models\Organization;
use App\Models\People;
use App\Models\Task;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->organization = Organization::factory()->create();
    Membership::factory()->for($this->user)->for($this->organization)->owner()->create();
});

test('guests cannot access tasks', function () {
    $this->get(route('organizations.tasks.index', $this->organization))
        ->assertRedirect(route('login'));
});

test('members can view tasks index', function () {
    $this->actingAs($this->user)
        ->get(route('organizations.tasks.index', $this->organization))
        ->assertOk();
});

test('members can view the create task page', function () {
    $this->actingAs($this->user)
        ->get(route('organizations.tasks.create', $this->organization))
        ->assertOk();
});

test('members can create a task', function () {
    $this->actingAs($this->user)
        ->post(route('organizations.tasks.store', $this->organization), [
            'name' => 'Review access controls',
            'state' => 'todo',
        ])
        ->assertRedirect();

    expect(Task::where('name', 'Review access controls')->first())->not->toBeNull();
});

test('members can create a task with an assignee', function () {
    $person = People::factory()->for($this->organization)->create();

    $this->actingAs($this->user)
        ->post(route('organizations.tasks.store', $this->organization), [
            'name' => 'Assigned task',
            'state' => 'todo',
            'assigned_to_id' => $person->id,
        ])
        ->assertRedirect();

    expect(Task::where('name', 'Assigned task')->first()->assigned_to_id)->toBe($person->id);
});

test('task name is required', function () {
    $this->actingAs($this->user)
        ->post(route('organizations.tasks.store', $this->organization), [
            'name' => '',
            'state' => 'todo',
        ])
        ->assertSessionHasErrors('name');
});

test('task state must be valid', function () {
    $this->actingAs($this->user)
        ->post(route('organizations.tasks.store', $this->organization), [
            'name' => 'Test',
            'state' => 'invalid',
        ])
        ->assertSessionHasErrors('state');
});

test('members can view a task', function () {
    $task = Task::factory()->for($this->organization)->create();

    $this->actingAs($this->user)
        ->get(route('organizations.tasks.show', [$this->organization, $task]))
        ->assertOk();
});

test('non-members cannot view a task', function () {
    $otherUser = User::factory()->create();
    $task = Task::factory()->for($this->organization)->create();

    $this->actingAs($otherUser)
        ->get(route('organizations.tasks.show', [$this->organization, $task]))
        ->assertForbidden();
});

test('members can edit a task', function () {
    $task = Task::factory()->for($this->organization)->create();

    $this->actingAs($this->user)
        ->get(route('organizations.tasks.edit', [$this->organization, $task]))
        ->assertOk();
});

test('members can update a task', function () {
    $task = Task::factory()->for($this->organization)->create(['name' => 'Old Task']);

    $this->actingAs($this->user)
        ->put(route('organizations.tasks.update', [$this->organization, $task]), [
            'name' => 'New Task',
            'state' => 'done',
        ])
        ->assertRedirect();

    expect($task->fresh()->name)->toBe('New Task');
});

test('members can delete a task', function () {
    $task = Task::factory()->for($this->organization)->create();

    $this->actingAs($this->user)
        ->delete(route('organizations.tasks.destroy', [$this->organization, $task]))
        ->assertRedirect();

    expect(Task::find($task->id))->toBeNull();
});
