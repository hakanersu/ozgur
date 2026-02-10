<?php

use App\Filament\Resources\VendorResource\Pages\ListVendors;
use App\Models\User;
use App\Models\Vendor;
use Filament\Facades\Filament;

use function Pest\Livewire\livewire;

beforeEach(function () {
    Filament::setCurrentPanel('admin');
    $this->actingAs(User::factory()->admin()->create());
});

it('can list vendors', function () {
    $vendors = Vendor::factory()->count(3)->create();

    livewire(ListVendors::class)
        ->assertOk()
        ->assertCanSeeTableRecords($vendors);
});
