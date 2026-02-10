<?php

use App\Filament\Resources\AuditResource\Pages\ListAudits;
use App\Models\Audit;
use App\Models\User;
use Filament\Facades\Filament;

use function Pest\Livewire\livewire;

beforeEach(function () {
    Filament::setCurrentPanel('admin');
    $this->actingAs(User::factory()->admin()->create());
});

it('can list audits', function () {
    $audits = Audit::factory()->count(3)->create();

    livewire(ListAudits::class)
        ->assertOk()
        ->assertCanSeeTableRecords($audits);
});
