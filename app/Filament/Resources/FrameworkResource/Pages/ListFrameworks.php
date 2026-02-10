<?php

namespace App\Filament\Resources\FrameworkResource\Pages;

use App\Filament\Resources\FrameworkResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListFrameworks extends ListRecords
{
    protected static string $resource = FrameworkResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
