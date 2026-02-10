<?php

namespace App\Filament\Resources;

use App\Enums\ControlStatus;
use App\Filament\Resources\ControlResource\Pages;
use App\Models\Control;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class ControlResource extends Resource
{
    protected static ?string $model = Control::class;

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-adjustments-horizontal';

    protected static string|\UnitEnum|null $navigationGroup = 'Compliance';

    protected static ?int $navigationSort = 2;

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('organization_id')
                    ->relationship('organization', 'name')
                    ->searchable()
                    ->preload()
                    ->required(),
                Select::make('framework_id')
                    ->relationship('framework', 'name')
                    ->searchable()
                    ->preload()
                    ->required(),
                TextInput::make('name')
                    ->required()
                    ->maxLength(255),
                TextInput::make('code')
                    ->maxLength(255),
                TextInput::make('category')
                    ->maxLength(255),
                Select::make('status')
                    ->options(ControlStatus::class)
                    ->required(),
                Textarea::make('description')
                    ->maxLength(65535)
                    ->columnSpanFull(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('organization.name')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('framework.name')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('name')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('code')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('status')
                    ->badge()
                    ->color(fn (ControlStatus $state): string => match ($state) {
                        ControlStatus::NotStarted => 'gray',
                        ControlStatus::InProgress => 'warning',
                        ControlStatus::Implemented => 'success',
                        ControlStatus::NotApplicable => 'danger',
                    }),
                TextColumn::make('measures_count')
                    ->counts('measures')
                    ->label('Measures')
                    ->sortable(),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                SelectFilter::make('organization')
                    ->relationship('organization', 'name')
                    ->searchable()
                    ->preload(),
                SelectFilter::make('framework')
                    ->relationship('framework', 'name')
                    ->searchable()
                    ->preload(),
                SelectFilter::make('status')
                    ->options(ControlStatus::class),
            ])
            ->recordActions([
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListControls::route('/'),
            'create' => Pages\CreateControl::route('/create'),
            'edit' => Pages\EditControl::route('/{record}/edit'),
        ];
    }
}
