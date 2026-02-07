<?php

use App\Models\DataProtectionImpactAssessment;
use App\Models\Membership;
use App\Models\Organization;
use App\Models\ProcessingActivity;
use App\Models\TransferImpactAssessment;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->organization = Organization::factory()->create();
    Membership::factory()->for($this->user)->for($this->organization)->owner()->create();
});

test('guests cannot access processing activities', function () {
    $this->get(route('organizations.processing-activities.index', $this->organization))
        ->assertRedirect(route('login'));
});

test('members can view processing activities index', function () {
    $this->actingAs($this->user)
        ->get(route('organizations.processing-activities.index', $this->organization))
        ->assertOk();
});

test('members can view the create processing activity page', function () {
    $this->actingAs($this->user)
        ->get(route('organizations.processing-activities.create', $this->organization))
        ->assertOk();
});

test('members can create a processing activity', function () {
    $this->actingAs($this->user)
        ->post(route('organizations.processing-activities.store', $this->organization), [
            'name' => 'Customer Data Processing',
            'lawful_basis' => 'consent',
            'special_or_criminal_data' => 'no',
            'role' => 'controller',
            'dpia_needed' => 'not_needed',
            'tia_needed' => 'not_needed',
            'international_transfers' => false,
        ])
        ->assertRedirect();

    expect(ProcessingActivity::where('name', 'Customer Data Processing')->first())->not->toBeNull();
});

test('processing activity name is required', function () {
    $this->actingAs($this->user)
        ->post(route('organizations.processing-activities.store', $this->organization), [
            'name' => '',
            'lawful_basis' => 'consent',
            'special_or_criminal_data' => 'no',
            'role' => 'controller',
            'dpia_needed' => 'not_needed',
            'tia_needed' => 'not_needed',
            'international_transfers' => false,
        ])
        ->assertSessionHasErrors('name');
});

test('processing activity lawful basis must be valid', function () {
    $this->actingAs($this->user)
        ->post(route('organizations.processing-activities.store', $this->organization), [
            'name' => 'Test',
            'lawful_basis' => 'invalid',
            'special_or_criminal_data' => 'no',
            'role' => 'controller',
            'dpia_needed' => 'not_needed',
            'tia_needed' => 'not_needed',
            'international_transfers' => false,
        ])
        ->assertSessionHasErrors('lawful_basis');
});

test('members can view a processing activity', function () {
    $processingActivity = ProcessingActivity::factory()->for($this->organization)->create();

    $this->actingAs($this->user)
        ->get(route('organizations.processing-activities.show', [$this->organization, $processingActivity]))
        ->assertOk();
});

test('members can edit a processing activity', function () {
    $processingActivity = ProcessingActivity::factory()->for($this->organization)->create();

    $this->actingAs($this->user)
        ->get(route('organizations.processing-activities.edit', [$this->organization, $processingActivity]))
        ->assertOk();
});

test('members can update a processing activity', function () {
    $processingActivity = ProcessingActivity::factory()->for($this->organization)->create(['name' => 'Old']);

    $this->actingAs($this->user)
        ->put(route('organizations.processing-activities.update', [$this->organization, $processingActivity]), [
            'name' => 'Updated',
            'lawful_basis' => 'consent',
            'special_or_criminal_data' => 'no',
            'role' => 'controller',
            'dpia_needed' => 'not_needed',
            'tia_needed' => 'not_needed',
            'international_transfers' => false,
        ])
        ->assertRedirect();

    expect($processingActivity->fresh()->name)->toBe('Updated');
});

test('members can delete a processing activity', function () {
    $processingActivity = ProcessingActivity::factory()->for($this->organization)->create();

    $this->actingAs($this->user)
        ->delete(route('organizations.processing-activities.destroy', [$this->organization, $processingActivity]))
        ->assertRedirect();

    expect(ProcessingActivity::find($processingActivity->id))->toBeNull();
});

test('non-members cannot view a processing activity', function () {
    $otherUser = User::factory()->create();
    $processingActivity = ProcessingActivity::factory()->for($this->organization)->create();

    $this->actingAs($otherUser)
        ->get(route('organizations.processing-activities.show', [$this->organization, $processingActivity]))
        ->assertForbidden();
});

test('members can create a DPIA for a processing activity', function () {
    $processingActivity = ProcessingActivity::factory()->for($this->organization)->create();

    $this->actingAs($this->user)
        ->post(route('organizations.processing-activities.dpia.store', [$this->organization, $processingActivity]), [
            'description' => 'DPIA description',
            'necessity_and_proportionality' => 'Necessary for compliance',
            'potential_risk' => 'Data breach risk',
            'mitigations' => 'Encryption and access controls',
            'residual_risk' => 'low',
        ])
        ->assertRedirect();

    expect(DataProtectionImpactAssessment::where('description', 'DPIA description')->first())->not->toBeNull();
});

test('members can create a TIA for a processing activity', function () {
    $processingActivity = ProcessingActivity::factory()->for($this->organization)->create();

    $this->actingAs($this->user)
        ->post(route('organizations.processing-activities.tia.store', [$this->organization, $processingActivity]), [
            'data_subjects' => 'EU customers',
            'legal_mechanism' => 'Standard contractual clauses',
            'transfer' => 'EU to US',
            'local_law_risk' => 'Moderate risk',
            'supplementary_measures' => 'Additional encryption',
        ])
        ->assertRedirect();

    expect(TransferImpactAssessment::where('data_subjects', 'EU customers')->first())->not->toBeNull();
});
