<?php

use App\Filament\Resources\OrganizationInvitationResource\Pages\ListOrganizationInvitations;
use App\Models\OrganizationInvitation;
use App\Models\User;
use Filament\Facades\Filament;

use function Pest\Livewire\livewire;

beforeEach(function () {
    Filament::setCurrentPanel('admin');
    $this->actingAs(User::factory()->admin()->create());
});

it('can list invitations', function () {
    $invitations = OrganizationInvitation::factory()->count(3)->create();

    livewire(ListOrganizationInvitations::class)
        ->assertOk()
        ->assertCanSeeTableRecords($invitations);
});

it('can search invitations by email', function () {
    $invitations = OrganizationInvitation::factory()->count(3)->create();

    livewire(ListOrganizationInvitations::class)
        ->searchTable($invitations->first()->email)
        ->assertCanSeeTableRecords($invitations->take(1))
        ->assertCanNotSeeTableRecords($invitations->skip(1));
});
