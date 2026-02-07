<?php

use App\Models\Asset;
use App\Models\Membership;
use App\Models\Organization;
use App\Models\People;
use App\Models\User;
use App\Models\Vendor;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->organization = Organization::factory()->create();
    Membership::factory()->for($this->user)->for($this->organization)->owner()->create();
});

test('guests cannot access assets', function () {
    $this->get(route('organizations.assets.index', $this->organization))
        ->assertRedirect(route('login'));
});

test('members can view assets index', function () {
    $this->actingAs($this->user)
        ->get(route('organizations.assets.index', $this->organization))
        ->assertOk();
});

test('members can view the create asset page', function () {
    $this->actingAs($this->user)
        ->get(route('organizations.assets.create', $this->organization))
        ->assertOk();
});

test('members can create an asset', function () {
    $owner = People::factory()->for($this->organization)->create();
    $vendors = Vendor::factory()->for($this->organization)->count(2)->create();

    $this->actingAs($this->user)
        ->post(route('organizations.assets.store', $this->organization), [
            'name' => 'Company Laptop',
            'amount' => 10,
            'owner_id' => $owner->id,
            'asset_type' => 'physical',
            'data_types_stored' => 'Employee records',
            'vendor_ids' => $vendors->pluck('id')->toArray(),
        ])
        ->assertRedirect();

    $asset = Asset::where('name', 'Company Laptop')->first();
    expect($asset)->not->toBeNull();
    expect($asset->vendors)->toHaveCount(2);
});

test('asset name is required', function () {
    $this->actingAs($this->user)
        ->post(route('organizations.assets.store', $this->organization), [
            'name' => '',
            'amount' => 5,
            'asset_type' => 'physical',
        ])
        ->assertSessionHasErrors('name');
});

test('asset_type must be a valid enum value', function () {
    $this->actingAs($this->user)
        ->post(route('organizations.assets.store', $this->organization), [
            'name' => 'Test Asset',
            'amount' => 5,
            'asset_type' => 'invalid_type',
        ])
        ->assertSessionHasErrors('asset_type');
});

test('members can view an asset', function () {
    $asset = Asset::factory()->for($this->organization)->create();

    $this->actingAs($this->user)
        ->get(route('organizations.assets.show', [$this->organization, $asset]))
        ->assertOk();
});

test('members can view the edit asset page', function () {
    $asset = Asset::factory()->for($this->organization)->create();

    $this->actingAs($this->user)
        ->get(route('organizations.assets.edit', [$this->organization, $asset]))
        ->assertOk();
});

test('members can update an asset', function () {
    $asset = Asset::factory()->for($this->organization)->create(['name' => 'Old']);

    $this->actingAs($this->user)
        ->put(route('organizations.assets.update', [$this->organization, $asset]), [
            'name' => 'Updated',
            'amount' => 20,
            'asset_type' => 'virtual',
        ])
        ->assertRedirect();

    expect($asset->fresh()->name)->toBe('Updated');
});

test('members can delete an asset', function () {
    $asset = Asset::factory()->for($this->organization)->create();

    $this->actingAs($this->user)
        ->delete(route('organizations.assets.destroy', [$this->organization, $asset]))
        ->assertRedirect();

    expect(Asset::find($asset->id))->toBeNull();
});
