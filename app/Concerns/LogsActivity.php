<?php

namespace App\Concerns;

use App\Models\ActivityLog;
use Illuminate\Support\Facades\Auth;

trait LogsActivity
{
    public static function bootLogsActivity(): void
    {
        static::created(function ($model): void {
            static::recordActivity($model, 'created');
        });

        static::updated(function ($model): void {
            if ($model->wasChanged()) {
                static::recordActivity($model, 'updated', $model->getChanges());
            }
        });

        static::deleted(function ($model): void {
            static::recordActivity($model, 'deleted');
        });
    }

    protected static function recordActivity($model, string $event, ?array $changes = null): void
    {
        if (! $model->organization_id) {
            return;
        }

        $filteredChanges = $changes;
        if ($filteredChanges) {
            unset($filteredChanges['updated_at']);
        }

        ActivityLog::create([
            'organization_id' => $model->organization_id,
            'user_id' => Auth::id(),
            'event' => $event,
            'subject_type' => $model->getMorphClass(),
            'subject_id' => $model->getKey(),
            'subject_name' => $model->getActivityName(),
            'changes' => $filteredChanges ?: null,
        ]);
    }

    public function getActivityName(): string
    {
        return $this->name ?? $this->title ?? $this->full_name ?? (string) $this->getKey();
    }
}
