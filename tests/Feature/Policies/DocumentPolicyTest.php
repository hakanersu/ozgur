<?php

use App\Models\Document;
use App\Models\Membership;
use App\Models\Organization;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->organization = Organization::factory()->create();
    Membership::factory()->for($this->user)->for($this->organization)->owner()->create();
});

test('any user can view any documents', function () {
    expect($this->user->can('viewAny', Document::class))->toBeTrue();
});

test('any user can create documents', function () {
    expect($this->user->can('create', Document::class))->toBeTrue();
});

test('members can view a document in their organization', function () {
    $document = Document::factory()->for($this->organization)->create();

    expect($this->user->can('view', $document))->toBeTrue();
});

test('non-members cannot view a document', function () {
    $otherUser = User::factory()->create();
    $document = Document::factory()->for($this->organization)->create();

    expect($otherUser->can('view', $document))->toBeFalse();
});

test('members can update a document in their organization', function () {
    $document = Document::factory()->for($this->organization)->create();

    expect($this->user->can('update', $document))->toBeTrue();
});

test('non-members cannot update a document', function () {
    $otherUser = User::factory()->create();
    $document = Document::factory()->for($this->organization)->create();

    expect($otherUser->can('update', $document))->toBeFalse();
});

test('members can delete a document in their organization', function () {
    $document = Document::factory()->for($this->organization)->create();

    expect($this->user->can('delete', $document))->toBeTrue();
});

test('non-members cannot delete a document', function () {
    $otherUser = User::factory()->create();
    $document = Document::factory()->for($this->organization)->create();

    expect($otherUser->can('delete', $document))->toBeFalse();
});
