<?php

use App\Models\Document;
use App\Models\DocumentVersion;
use App\Models\Membership;
use App\Models\Organization;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->organization = Organization::factory()->create();
    Membership::factory()->for($this->user)->for($this->organization)->owner()->create();
});

test('guests cannot access documents', function () {
    $this->get(route('organizations.documents.index', $this->organization))
        ->assertRedirect(route('login'));
});

test('members can view documents index', function () {
    $this->actingAs($this->user)
        ->get(route('organizations.documents.index', $this->organization))
        ->assertOk();
});

test('members can view the create document page', function () {
    $this->actingAs($this->user)
        ->get(route('organizations.documents.create', $this->organization))
        ->assertOk();
});

test('members can create a document', function () {
    $this->actingAs($this->user)
        ->post(route('organizations.documents.store', $this->organization), [
            'title' => 'Security Policy',
            'document_type' => 'policy',
            'classification' => 'internal',
        ])
        ->assertRedirect();

    expect(Document::where('title', 'Security Policy')->first())->not->toBeNull();
});

test('document title is required', function () {
    $this->actingAs($this->user)
        ->post(route('organizations.documents.store', $this->organization), [
            'title' => '',
            'document_type' => 'policy',
            'classification' => 'internal',
        ])
        ->assertSessionHasErrors('title');
});

test('members can view a document', function () {
    $document = Document::factory()->for($this->organization)->create();

    $this->actingAs($this->user)
        ->get(route('organizations.documents.show', [$this->organization, $document]))
        ->assertOk();
});

test('members can update a document', function () {
    $document = Document::factory()->for($this->organization)->create(['title' => 'Old']);

    $this->actingAs($this->user)
        ->put(route('organizations.documents.update', [$this->organization, $document]), [
            'title' => 'Updated',
            'document_type' => 'isms',
            'classification' => 'confidential',
        ])
        ->assertRedirect();

    expect($document->fresh()->title)->toBe('Updated');
});

test('members can delete a document', function () {
    $document = Document::factory()->for($this->organization)->create();

    $this->actingAs($this->user)
        ->delete(route('organizations.documents.destroy', [$this->organization, $document]))
        ->assertRedirect();

    expect(Document::find($document->id))->toBeNull();
});

test('members can create a document version', function () {
    $document = Document::factory()->for($this->organization)->create();

    $this->actingAs($this->user)
        ->post(route('organizations.documents.versions.store', [$this->organization, $document]), [
            'title' => 'Version 1',
            'content' => 'Document content here',
            'classification' => 'internal',
        ])
        ->assertRedirect();

    expect(DocumentVersion::where('title', 'Version 1')->first())
        ->not->toBeNull()
        ->and(DocumentVersion::where('title', 'Version 1')->first()->version_number)->toBe(1);
});

test('version numbers auto-increment', function () {
    $document = Document::factory()->for($this->organization)->create();
    DocumentVersion::factory()->for($document)->for($this->organization)->create(['version_number' => 1]);

    $this->actingAs($this->user)
        ->post(route('organizations.documents.versions.store', [$this->organization, $document]), [
            'title' => 'Version 2',
            'classification' => 'internal',
        ])
        ->assertRedirect();

    expect(DocumentVersion::where('title', 'Version 2')->first()->version_number)->toBe(2);
});

test('members can publish a document version', function () {
    $document = Document::factory()->for($this->organization)->create();
    $version = DocumentVersion::factory()->for($document)->for($this->organization)->create(['version_number' => 1]);

    $this->actingAs($this->user)
        ->post(route('organizations.documents.versions.publish', [$this->organization, $document, $version]))
        ->assertRedirect();

    expect($version->fresh()->status->value)->toBe('published')
        ->and($document->fresh()->current_published_version)->toBe(1);
});
