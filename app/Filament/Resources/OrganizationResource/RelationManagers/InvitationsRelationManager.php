<?php

namespace App\Filament\Resources\OrganizationResource\RelationManagers;

use App\Enums\OrganizationRole;
use App\Models\OrganizationInvitation;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class InvitationsRelationManager extends RelationManager
{
    protected static string $relationship = 'invitations';

    public function table(Table $table): Table
    {
        return $table
            ->columns([
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
                    ->label('Invited By'),
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
                TextColumn::make('expires_at')
                    ->dateTime()
                    ->sortable(),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable(),
            ])
            ->recordActions([
                DeleteAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
