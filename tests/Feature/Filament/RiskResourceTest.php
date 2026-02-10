<?php

use App\Filament\Resources\RiskResource\Pages\ListRisks;
use App\Models\Risk;
use App\Models\User;
use Filament\Facades\Filament;

use function Pest\Livewire\livewire;

beforeEach(function () {
    Filament::setCurrentPanel('admin');
    $this->actingAs(User::factory()->admin()->create());
});

it('can list risks', function () {
    $risks = Risk::factory()->count(3)->create();

    livewire(ListRisks::class)
        ->assertOk()
        ->assertCanSeeTableRecords($risks);
});
