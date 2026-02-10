<?php

use App\Filament\Resources\MembershipResource\Pages\ListMemberships;
use App\Models\Membership;
use App\Models\User;
use Filament\Facades\Filament;

use function Pest\Livewire\livewire;

beforeEach(function () {
    Filament::setCurrentPanel('admin');
    $this->actingAs(User::factory()->admin()->create());
});

it('can list memberships', function () {
    $memberships = Membership::factory()->count(3)->create();

    livewire(ListMemberships::class)
        ->assertOk()
        ->assertCanSeeTableRecords($memberships);
});
