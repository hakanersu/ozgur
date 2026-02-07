<?php

use App\Models\Membership;
use App\Models\Organization;
use App\Models\User;
use App\Models\Vendor;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->organization = Organization::factory()->create();
    Membership::factory()->for($this->user)->for($this->organization)->owner()->create();
});

test('any user can view any vendors', function () {
    expect($this->user->can('viewAny', Vendor::class))->toBeTrue();
});

test('any user can create vendors', function () {
    expect($this->user->can('create', Vendor::class))->toBeTrue();
});

test('members can view a vendor in their organization', function () {
    $vendor = Vendor::factory()->for($this->organization)->create();

    expect($this->user->can('view', $vendor))->toBeTrue();
});

test('non-members cannot view a vendor', function () {
    $otherUser = User::factory()->create();
    $vendor = Vendor::factory()->for($this->organization)->create();

    expect($otherUser->can('view', $vendor))->toBeFalse();
});

test('members can update a vendor in their organization', function () {
    $vendor = Vendor::factory()->for($this->organization)->create();

    expect($this->user->can('update', $vendor))->toBeTrue();
});

test('non-members cannot update a vendor', function () {
    $otherUser = User::factory()->create();
    $vendor = Vendor::factory()->for($this->organization)->create();

    expect($otherUser->can('update', $vendor))->toBeFalse();
});

test('members can delete a vendor in their organization', function () {
    $vendor = Vendor::factory()->for($this->organization)->create();

    expect($this->user->can('delete', $vendor))->toBeTrue();
});

test('non-members cannot delete a vendor', function () {
    $otherUser = User::factory()->create();
    $vendor = Vendor::factory()->for($this->organization)->create();

    expect($otherUser->can('delete', $vendor))->toBeFalse();
});
