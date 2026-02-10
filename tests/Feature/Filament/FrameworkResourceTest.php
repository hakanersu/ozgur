<?php

use App\Filament\Resources\FrameworkResource\Pages\ListFrameworks;
use App\Models\Framework;
use App\Models\User;
use Filament\Facades\Filament;

use function Pest\Livewire\livewire;

beforeEach(function () {
    Filament::setCurrentPanel('admin');
    $this->actingAs(User::factory()->admin()->create());
});

it('can list frameworks', function () {
    $frameworks = Framework::factory()->count(3)->create();

    livewire(ListFrameworks::class)
        ->assertOk()
        ->assertCanSeeTableRecords($frameworks);
});

it('can search frameworks by name', function () {
    $frameworks = Framework::factory()->count(3)->create();

    livewire(ListFrameworks::class)
        ->searchTable($frameworks->first()->name)
        ->assertCanSeeTableRecords($frameworks->where('name', $frameworks->first()->name))
        ->assertCanNotSeeTableRecords($frameworks->where('name', '!=', $frameworks->first()->name));
});
