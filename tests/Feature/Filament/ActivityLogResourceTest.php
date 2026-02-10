<?php

use App\Filament\Resources\ActivityLogResource\Pages\ListActivityLogs;
use App\Models\ActivityLog;
use App\Models\User;
use Filament\Facades\Filament;

use function Pest\Livewire\livewire;

beforeEach(function () {
    Filament::setCurrentPanel('admin');
    $this->actingAs(User::factory()->admin()->create());
});

it('can list activity logs', function () {
    $logs = ActivityLog::factory()->count(3)->create();

    livewire(ListActivityLogs::class)
        ->assertOk()
        ->assertCanSeeTableRecords($logs);
});
