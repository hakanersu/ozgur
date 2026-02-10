<?php

use App\Filament\Resources\ControlResource\Pages\ListControls;
use App\Models\Control;
use App\Models\User;
use Filament\Facades\Filament;

use function Pest\Livewire\livewire;

beforeEach(function () {
    Filament::setCurrentPanel('admin');
    $this->actingAs(User::factory()->admin()->create());
});

it('can list controls', function () {
    $controls = Control::factory()->count(3)->create();

    livewire(ListControls::class)
        ->assertOk()
        ->assertCanSeeTableRecords($controls);
});
