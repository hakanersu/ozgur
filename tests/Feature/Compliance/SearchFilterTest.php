<?php

use App\Models\Asset;
use App\Models\Audit;
use App\Models\Control;
use App\Models\Document;
use App\Models\Framework;
use App\Models\Measure;
use App\Models\Meeting;
use App\Models\Membership;
use App\Models\Organization;
use App\Models\People;
use App\Models\ProcessingActivity;
use App\Models\RightsRequest;
use App\Models\Risk;
use App\Models\Snapshot;
use App\Models\Task;
use App\Models\User;
use App\Models\Vendor;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->organization = Organization::factory()->create();
    Membership::factory()->for($this->user)->for($this->organization)->owner()->create();
    $this->actingAs($this->user);
});

// --- Frameworks ---

it('can search frameworks by name', function () {
    Framework::factory()->for($this->organization)->create(['name' => 'SOC 2']);
    Framework::factory()->for($this->organization)->create(['name' => 'ISO 27001']);

    $response = $this->get(route('organizations.frameworks.index', $this->organization).'?search=SOC');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->has('frameworks', 1)
        ->where('frameworks.0.name', 'SOC 2')
        ->where('filters.search', 'SOC')
    );
});

it('returns empty results when searching frameworks with no match', function () {
    Framework::factory()->for($this->organization)->create(['name' => 'SOC 2']);

    $response = $this->get(route('organizations.frameworks.index', $this->organization).'?search=NIST');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->has('frameworks', 0)
    );
});

it('returns all frameworks when no search is provided', function () {
    Framework::factory()->for($this->organization)->count(3)->create();

    $response = $this->get(route('organizations.frameworks.index', $this->organization));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->has('frameworks', 3)
        ->where('filters.search', '')
    );
});

// --- Controls ---

it('can search controls by name', function () {
    $framework = Framework::factory()->for($this->organization)->create();
    Control::factory()->for($this->organization)->for($framework)->create(['name' => 'Access Control']);
    Control::factory()->for($this->organization)->for($framework)->create(['name' => 'Data Encryption']);

    $response = $this->get(route('organizations.controls.index', $this->organization).'?search=Access');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->has('controls', 1)
        ->where('controls.0.name', 'Access Control')
    );
});

// --- Measures ---

it('can search measures by name', function () {
    Measure::factory()->for($this->organization)->create(['name' => 'Firewall Configuration']);
    Measure::factory()->for($this->organization)->create(['name' => 'Backup Policy']);

    $response = $this->get(route('organizations.measures.index', $this->organization).'?search=Firewall');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->has('measures', 1)
        ->where('measures.0.name', 'Firewall Configuration')
    );
});

// --- Risks ---

it('can search risks by name', function () {
    Risk::factory()->for($this->organization)->create(['name' => 'Data Breach']);
    Risk::factory()->for($this->organization)->create(['name' => 'Server Downtime']);

    $response = $this->get(route('organizations.risks.index', $this->organization).'?search=Breach');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->has('risks', 1)
        ->where('risks.0.name', 'Data Breach')
    );
});

// --- Audits ---

it('can search audits by name', function () {
    Audit::factory()->for($this->organization)->create(['name' => 'Annual Security Audit']);
    Audit::factory()->for($this->organization)->create(['name' => 'Compliance Review']);

    $response = $this->get(route('organizations.audits.index', $this->organization).'?search=Security');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->has('audits', 1)
        ->where('audits.0.name', 'Annual Security Audit')
    );
});

// --- Documents ---

it('can search documents by title', function () {
    Document::factory()->for($this->organization)->create(['title' => 'Security Policy']);
    Document::factory()->for($this->organization)->create(['title' => 'Privacy Notice']);

    $response = $this->get(route('organizations.documents.index', $this->organization).'?search=Security');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->has('documents', 1)
        ->where('documents.0.title', 'Security Policy')
    );
});

// --- Vendors ---

it('can search vendors by name', function () {
    Vendor::factory()->for($this->organization)->create(['name' => 'Acme Corp']);
    Vendor::factory()->for($this->organization)->create(['name' => 'Beta Inc']);

    $response = $this->get(route('organizations.vendors.index', $this->organization).'?search=Acme');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->has('vendors', 1)
        ->where('vendors.0.name', 'Acme Corp')
    );
});

// --- People ---

it('can search people by full name', function () {
    People::factory()->for($this->organization)->create(['full_name' => 'John Doe']);
    People::factory()->for($this->organization)->create(['full_name' => 'Jane Smith']);

    $response = $this->get(route('organizations.people.index', $this->organization).'?search=John');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->has('people', 1)
        ->where('people.0.full_name', 'John Doe')
    );
});

// --- Tasks ---

it('can search tasks by name', function () {
    Task::factory()->for($this->organization)->create(['name' => 'Review Access Logs']);
    Task::factory()->for($this->organization)->create(['name' => 'Update Firewall Rules']);

    $response = $this->get(route('organizations.tasks.index', $this->organization).'?search=Review');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->has('tasks', 1)
        ->where('tasks.0.name', 'Review Access Logs')
    );
});

// --- Meetings ---

it('can search meetings by name', function () {
    Meeting::factory()->for($this->organization)->create(['name' => 'Security Review']);
    Meeting::factory()->for($this->organization)->create(['name' => 'Team Standup']);

    $response = $this->get(route('organizations.meetings.index', $this->organization).'?search=Security');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->has('meetings', 1)
        ->where('meetings.0.name', 'Security Review')
    );
});

// --- Assets ---

it('can search assets by name', function () {
    Asset::factory()->for($this->organization)->create(['name' => 'Production Server']);
    Asset::factory()->for($this->organization)->create(['name' => 'Office Laptop']);

    $response = $this->get(route('organizations.assets.index', $this->organization).'?search=Production');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->has('assets', 1)
        ->where('assets.0.name', 'Production Server')
    );
});

// --- Snapshots ---

it('can search snapshots by name', function () {
    Snapshot::factory()->for($this->organization)->create(['name' => 'Q1 2024 Snapshot']);
    Snapshot::factory()->for($this->organization)->create(['name' => 'Q2 2024 Snapshot']);

    $response = $this->get(route('organizations.snapshots.index', $this->organization).'?search=Q1');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->has('snapshots', 1)
        ->where('snapshots.0.name', 'Q1 2024 Snapshot')
    );
});

// --- Processing Activities ---

it('can search processing activities by name', function () {
    ProcessingActivity::factory()->for($this->organization)->create(['name' => 'Customer Data Processing']);
    ProcessingActivity::factory()->for($this->organization)->create(['name' => 'Employee Onboarding']);

    $response = $this->get(route('organizations.processing-activities.index', $this->organization).'?search=Customer');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->has('processingActivities', 1)
        ->where('processingActivities.0.name', 'Customer Data Processing')
    );
});

// --- Rights Requests ---

it('can search rights requests by data subject', function () {
    RightsRequest::factory()->for($this->organization)->create(['data_subject' => 'John Doe']);
    RightsRequest::factory()->for($this->organization)->create(['data_subject' => 'Jane Smith']);

    $response = $this->get(route('organizations.rights-requests.index', $this->organization).'?search=John');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->has('rightsRequests', 1)
        ->where('rightsRequests.0.data_subject', 'John Doe')
    );
});
