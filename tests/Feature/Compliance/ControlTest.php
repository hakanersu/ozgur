<?php

use App\Models\Control;
use App\Models\Framework;
use App\Models\Membership;
use App\Models\Organization;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->organization = Organization::factory()->create();
    Membership::factory()->for($this->user)->for($this->organization)->owner()->create();
    $this->framework = Framework::factory()->for($this->organization)->create();
});

test('guests cannot access controls', function () {
    $this->get(route('organizations.controls.index', $this->organization))
        ->assertRedirect(route('login'));
});

test('members can view controls index', function () {
    $this->actingAs($this->user)
        ->get(route('organizations.controls.index', $this->organization))
        ->assertOk();
});

test('members can view the create control page', function () {
    $this->actingAs($this->user)
        ->get(route('organizations.controls.create', $this->organization))
        ->assertOk();
});

test('members can create a control', function () {
    $this->actingAs($this->user)
        ->post(route('organizations.controls.store', $this->organization), [
            'framework_id' => $this->framework->id,
            'name' => 'Access Control',
            'code' => 'A.9.1',
            'category' => 'Security',
            'status' => 'not_started',
        ])
        ->assertRedirect();

    expect(Control::where('name', 'Access Control')->first())->not->toBeNull();
});

test('control name is required', function () {
    $this->actingAs($this->user)
        ->post(route('organizations.controls.store', $this->organization), [
            'framework_id' => $this->framework->id,
            'name' => '',
            'status' => 'not_started',
        ])
        ->assertSessionHasErrors('name');
});

test('control framework_id must exist', function () {
    $this->actingAs($this->user)
        ->post(route('organizations.controls.store', $this->organization), [
            'framework_id' => 9999,
            'name' => 'Test',
            'status' => 'not_started',
        ])
        ->assertSessionHasErrors('framework_id');
});

test('members can view a control', function () {
    $control = Control::factory()->for($this->organization)->for($this->framework)->create();

    $this->actingAs($this->user)
        ->get(route('organizations.controls.show', [$this->organization, $control]))
        ->assertOk();
});

test('members can update a control', function () {
    $control = Control::factory()->for($this->organization)->for($this->framework)->create(['name' => 'Old']);

    $this->actingAs($this->user)
        ->put(route('organizations.controls.update', [$this->organization, $control]), [
            'name' => 'Updated',
            'status' => 'implemented',
        ])
        ->assertRedirect();

    expect($control->fresh()->name)->toBe('Updated');
});

test('members can delete a control', function () {
    $control = Control::factory()->for($this->organization)->for($this->framework)->create();

    $this->actingAs($this->user)
        ->delete(route('organizations.controls.destroy', [$this->organization, $control]))
        ->assertRedirect();

    expect(Control::find($control->id))->toBeNull();
});
