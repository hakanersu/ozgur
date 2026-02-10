<?php

namespace App\Filament\Resources;

use App\Enums\OrganizationRole;
use App\Filament\Resources\OrganizationInvitationResource\Pages;
use App\Models\OrganizationInvitation;
use Filament\Resources\Resource;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class OrganizationInvitationResource extends Resource
{
    protected static ?string $model = OrganizationInvitation::class;

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-envelope';

    protected static string|\UnitEnum|null $navigationGroup = 'User Management';

    protected static ?int $navigationSort = 4;

    protected static ?string $navigationLabel = 'Invitations';

    public static function canCreate(): bool
    {
        return false;
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('organization.name')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('email')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('role')
                    ->badge()
                    ->color(fn (OrganizationRole $state): string => match ($state) {
                        OrganizationRole::Owner => 'danger',
                        OrganizationRole::Admin => 'warning',
                        OrganizationRole::Member => 'info',
                    }),
                TextColumn::make('inviter.name')
                    ->label('Invited By')
                    ->sortable(),
                TextColumn::make('expires_at')
                    ->dateTime()
                    ->sortable(),
                TextColumn::make('status')
                    ->badge()
                    ->getStateUsing(function (OrganizationInvitation $record): string {
                        if ($record->accepted_at) {
                            return 'accepted';
                        }

                        if ($record->isExpired()) {
                            return 'expired';
                        }

                        return 'pending';
                    })
                    ->color(fn (string $state): string => match ($state) {
                        'accepted' => 'success',
                        'expired' => 'danger',
                        'pending' => 'warning',
                    }),
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
                SelectFilter::make('role')
                    ->options(OrganizationRole::class),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListOrganizationInvitations::route('/'),
        ];
    }
}
