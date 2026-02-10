<?php

use App\Filament\Resources\OrganizationResource\Pages\CreateOrganization;
use App\Filament\Resources\OrganizationResource\Pages\EditOrganization;
use App\Filament\Resources\OrganizationResource\Pages\ListOrganizations;
use App\Models\Membership;
use App\Models\Organization;
use App\Models\User;
use Filament\Facades\Filament;

use function Pest\Livewire\livewire;

beforeEach(function () {
    Filament::setCurrentPanel('admin');
    $this->admin = User::factory()->admin()->create();
    $this->actingAs($this->admin);
});

it('can list organizations', function () {
    $organizations = Organization::factory()->count(3)->create();

    livewire(ListOrganizations::class)
        ->assertOk()
        ->assertCanSeeTableRecords($organizations);
});

it('can render the create page', function () {
    livewire(CreateOrganization::class)
        ->assertOk();
});

it('can create an organization', function () {
    $newOrg = Organization::factory()->make();

    livewire(CreateOrganization::class)
        ->fillForm([
            'name' => $newOrg->name,
            'slug' => $newOrg->slug,
        ])
        ->call('create')
        ->assertHasNoFormErrors();

    $this->assertDatabaseHas(Organization::class, [
        'name' => $newOrg->name,
        'slug' => $newOrg->slug,
    ]);
});

it('can render the edit page', function () {
    $organization = Organization::factory()->create();
    Membership::factory()->owner()->create([
        'user_id' => $this->admin->id,
        'organization_id' => $organization->id,
    ]);

    livewire(EditOrganization::class, ['record' => $organization->getRouteKey()])
        ->assertOk();
});

it('can update an organization', function () {
    $organization = Organization::factory()->create();
    Membership::factory()->owner()->create([
        'user_id' => $this->admin->id,
        'organization_id' => $organization->id,
    ]);
    $newData = Organization::factory()->make();

    livewire(EditOrganization::class, ['record' => $organization->getRouteKey()])
        ->fillForm([
            'name' => $newData->name,
            'slug' => $newData->slug,
        ])
        ->call('save')
        ->assertHasNoFormErrors();

    $this->assertDatabaseHas(Organization::class, [
        'id' => $organization->id,
        'name' => $newData->name,
        'slug' => $newData->slug,
    ]);
});
