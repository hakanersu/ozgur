<?php

namespace App\Filament\Resources\ControlResource\Pages;

use App\Filament\Resources\ControlResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListControls extends ListRecords
{
    protected static string $resource = ControlResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
