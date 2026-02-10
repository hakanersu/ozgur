<?php

namespace App\Filament\Resources\ControlResource\Pages;

use App\Filament\Resources\ControlResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditControl extends EditRecord
{
    protected static string $resource = ControlResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
