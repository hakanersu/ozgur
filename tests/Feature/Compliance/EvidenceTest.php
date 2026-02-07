<?php

use App\Models\Evidence;
use App\Models\Measure;
use App\Models\Membership;
use App\Models\Organization;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->organization = Organization::factory()->create();
    Membership::factory()->for($this->user)->for($this->organization)->owner()->create();
    $this->measure = Measure::factory()->for($this->organization)->create();
});

test('members can store link evidence', function () {
    $this->actingAs($this->user)
        ->post(route('organizations.measures.evidence.store', [$this->organization, $this->measure]), [
            'name' => 'Security Policy Doc',
            'type' => 'link',
            'url' => 'https://example.com/policy.pdf',
            'state' => 'fulfilled',
        ])
        ->assertRedirect();

    expect(Evidence::where('name', 'Security Policy Doc')->first())->not->toBeNull();
});

test('members can store file evidence', function () {
    Storage::fake('public');

    $this->actingAs($this->user)
        ->post(route('organizations.measures.evidence.store', [$this->organization, $this->measure]), [
            'name' => 'Uploaded Evidence',
            'type' => 'file',
            'file' => UploadedFile::fake()->create('evidence.pdf', 1024),
            'state' => 'fulfilled',
        ])
        ->assertRedirect();

    $evidence = Evidence::where('name', 'Uploaded Evidence')->first();

    expect($evidence)->not->toBeNull()
        ->and($evidence->file_path)->not->toBeNull();
});

test('evidence name is required', function () {
    $this->actingAs($this->user)
        ->post(route('organizations.measures.evidence.store', [$this->organization, $this->measure]), [
            'name' => '',
            'type' => 'link',
            'url' => 'https://example.com',
            'state' => 'fulfilled',
        ])
        ->assertSessionHasErrors('name');
});

test('members can delete evidence', function () {
    $evidence = Evidence::factory()->for($this->organization)->for($this->measure)->create();

    $this->actingAs($this->user)
        ->delete(route('organizations.measures.evidence.destroy', [$this->organization, $this->measure, $evidence]))
        ->assertRedirect();

    expect(Evidence::find($evidence->id))->toBeNull();
});
