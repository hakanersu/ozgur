<?php

namespace App\Filament\Widgets;

use App\Models\ActivityLog;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;

class LatestActivityWidget extends BaseWidget
{
    protected static ?int $sort = 2;

    protected int|string|array $columnSpan = 'full';

    public function table(Table $table): Table
    {
        return $table
            ->query(
                ActivityLog::query()
                    ->with(['user', 'organization'])
                    ->latest()
                    ->limit(10)
            )
            ->columns([
                TextColumn::make('organization.name')
                    ->label('Organization'),
                TextColumn::make('user.name')
                    ->label('User'),
                TextColumn::make('event')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'created' => 'success',
                        'updated' => 'warning',
                        'deleted' => 'danger',
                        default => 'gray',
                    }),
                TextColumn::make('subject_type')
                    ->label('Type')
                    ->formatStateUsing(fn (string $state): string => class_basename($state)),
                TextColumn::make('subject_name')
                    ->label('Subject'),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable(),
            ])
            ->paginated(false);
    }
}
