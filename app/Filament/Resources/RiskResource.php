<?php

namespace App\Filament\Resources;

use App\Enums\RiskTreatment;
use App\Filament\Resources\RiskResource\Pages;
use App\Models\Risk;
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

class RiskResource extends Resource
{
    protected static ?string $model = Risk::class;

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-exclamation-triangle';

    protected static string|\UnitEnum|null $navigationGroup = 'Compliance';

    protected static ?int $navigationSort = 3;

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('organization_id')
                    ->relationship('organization', 'name')
                    ->searchable()
                    ->preload()
                    ->required(),
                TextInput::make('name')
                    ->required()
                    ->maxLength(255),
                Textarea::make('description')
                    ->maxLength(65535)
                    ->columnSpanFull(),
                TextInput::make('category')
                    ->maxLength(255),
                TextInput::make('probability')
                    ->numeric()
                    ->minValue(1)
                    ->maxValue(5)
                    ->required(),
                TextInput::make('impact')
                    ->numeric()
                    ->minValue(1)
                    ->maxValue(5)
                    ->required(),
                Select::make('treatment')
                    ->options(RiskTreatment::class)
                    ->required(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('organization.name')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('name')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('probability')
                    ->sortable(),
                TextColumn::make('impact')
                    ->sortable(),
                TextColumn::make('treatment')
                    ->badge()
                    ->color(fn (RiskTreatment $state): string => match ($state) {
                        RiskTreatment::Mitigated => 'success',
                        RiskTreatment::Accepted => 'warning',
                        RiskTreatment::Avoided => 'info',
                        RiskTreatment::Transferred => 'gray',
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
                SelectFilter::make('treatment')
                    ->options(RiskTreatment::class),
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
            'index' => Pages\ListRisks::route('/'),
            'create' => Pages\CreateRisk::route('/create'),
            'edit' => Pages\EditRisk::route('/{record}/edit'),
        ];
    }
}
