<?php

namespace App\Filament\Widgets;

use App\Models\Framework;
use App\Models\Organization;
use App\Models\OrganizationInvitation;
use App\Models\Risk;
use App\Models\Task;
use App\Models\User;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsOverviewWidget extends BaseWidget
{
    protected static ?int $sort = 1;

    protected function getStats(): array
    {
        return [
            Stat::make('Total Users', User::query()->count()),
            Stat::make('Organizations', Organization::query()->count()),
            Stat::make('Frameworks', Framework::query()->count()),
            Stat::make('Risks', Risk::query()->count()),
            Stat::make('Open Tasks', Task::query()->where('state', 'todo')->count()),
            Stat::make('Pending Invitations', OrganizationInvitation::query()
                ->whereNull('accepted_at')
                ->where('expires_at', '>', now())
                ->count()),
        ];
    }
}
