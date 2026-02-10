<?php

namespace App\Filament\Resources;

use App\Enums\FrameworkStatus;
use App\Filament\Resources\FrameworkResource\Pages;
use App\Models\Framework;
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

class FrameworkResource extends Resource
{
    protected static ?string $model = Framework::class;

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-shield-check';

    protected static string|\UnitEnum|null $navigationGroup = 'Compliance';

    protected static ?int $navigationSort = 1;

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
                TextInput::make('version')
                    ->maxLength(255),
                Select::make('status')
                    ->options(FrameworkStatus::class)
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
                TextColumn::make('version')
                    ->sortable(),
                TextColumn::make('status')
                    ->badge()
                    ->color(fn (FrameworkStatus $state): string => match ($state) {
                        FrameworkStatus::Draft => 'gray',
                        FrameworkStatus::Active => 'success',
                        FrameworkStatus::Archived => 'danger',
                    }),
                TextColumn::make('controls_count')
                    ->counts('controls')
                    ->label('Controls')
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
                SelectFilter::make('status')
                    ->options(FrameworkStatus::class),
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
            'index' => Pages\ListFrameworks::route('/'),
            'create' => Pages\CreateFramework::route('/create'),
            'edit' => Pages\EditFramework::route('/{record}/edit'),
        ];
    }
}
