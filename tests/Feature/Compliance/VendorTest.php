<?php

use App\Models\Membership;
use App\Models\Organization;
use App\Models\User;
use App\Models\Vendor;
use App\Models\VendorContact;
use App\Models\VendorRiskAssessment;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->organization = Organization::factory()->create();
    Membership::factory()->for($this->user)->for($this->organization)->owner()->create();
});

test('guests cannot access vendors', function () {
    $this->get(route('organizations.vendors.index', $this->organization))
        ->assertRedirect(route('login'));
});

test('members can view vendors index', function () {
    $this->actingAs($this->user)
        ->get(route('organizations.vendors.index', $this->organization))
        ->assertOk();
});

test('members can view the create vendor page', function () {
    $this->actingAs($this->user)
        ->get(route('organizations.vendors.create', $this->organization))
        ->assertOk();
});

test('members can create a vendor', function () {
    $this->actingAs($this->user)
        ->post(route('organizations.vendors.store', $this->organization), [
            'name' => 'AWS',
            'description' => 'Cloud provider',
            'category' => 'cloud_provider',
            'website_url' => 'https://aws.amazon.com',
        ])
        ->assertRedirect();

    expect(Vendor::where('name', 'AWS')->first())->not->toBeNull();
});

test('vendor name is required', function () {
    $this->actingAs($this->user)
        ->post(route('organizations.vendors.store', $this->organization), [
            'name' => '',
            'category' => 'cloud_provider',
        ])
        ->assertSessionHasErrors('name');
});

test('vendor category must be valid', function () {
    $this->actingAs($this->user)
        ->post(route('organizations.vendors.store', $this->organization), [
            'name' => 'Test',
            'category' => 'invalid',
        ])
        ->assertSessionHasErrors('category');
});

test('members can view a vendor', function () {
    $vendor = Vendor::factory()->for($this->organization)->create();

    $this->actingAs($this->user)
        ->get(route('organizations.vendors.show', [$this->organization, $vendor]))
        ->assertOk();
});

test('members can update a vendor', function () {
    $vendor = Vendor::factory()->for($this->organization)->create(['name' => 'Old']);

    $this->actingAs($this->user)
        ->put(route('organizations.vendors.update', [$this->organization, $vendor]), [
            'name' => 'Updated',
            'category' => 'security',
        ])
        ->assertRedirect();

    expect($vendor->fresh()->name)->toBe('Updated');
});

test('members can delete a vendor', function () {
    $vendor = Vendor::factory()->for($this->organization)->create();

    $this->actingAs($this->user)
        ->delete(route('organizations.vendors.destroy', [$this->organization, $vendor]))
        ->assertRedirect();

    expect(Vendor::find($vendor->id))->toBeNull();
});

test('members can add a contact to a vendor', function () {
    $vendor = Vendor::factory()->for($this->organization)->create();

    $this->actingAs($this->user)
        ->post(route('organizations.vendors.contacts.store', [$this->organization, $vendor]), [
            'full_name' => 'John Doe',
            'email' => 'john@example.com',
            'phone' => '+1234567890',
            'role' => 'Account Manager',
        ])
        ->assertRedirect();

    expect(VendorContact::where('full_name', 'John Doe')->first())->not->toBeNull();
});

test('members can delete a vendor contact', function () {
    $vendor = Vendor::factory()->for($this->organization)->create();
    $contact = VendorContact::factory()->for($vendor)->for($this->organization)->create();

    $this->actingAs($this->user)
        ->delete(route('organizations.vendors.contacts.destroy', [$this->organization, $vendor, $contact]))
        ->assertRedirect();

    expect(VendorContact::find($contact->id))->toBeNull();
});

test('members can add a risk assessment to a vendor', function () {
    $vendor = Vendor::factory()->for($this->organization)->create();

    $this->actingAs($this->user)
        ->post(route('organizations.vendors.risk-assessments.store', [$this->organization, $vendor]), [
            'data_sensitivity' => 'high',
            'business_impact' => 'critical',
            'expires_at' => '2027-01-01',
            'notes' => 'Critical vendor risk',
        ])
        ->assertRedirect();

    expect(VendorRiskAssessment::where('notes', 'Critical vendor risk')->first())->not->toBeNull();
});

test('members can delete a vendor risk assessment', function () {
    $vendor = Vendor::factory()->for($this->organization)->create();
    $assessment = VendorRiskAssessment::factory()->for($vendor)->for($this->organization)->create();

    $this->actingAs($this->user)
        ->delete(route('organizations.vendors.risk-assessments.destroy', [$this->organization, $vendor, $assessment]))
        ->assertRedirect();

    expect(VendorRiskAssessment::find($assessment->id))->toBeNull();
});
