<?php

namespace App\Models;

use App\Concerns\BelongsToOrganization;
use App\Concerns\LogsActivity;
use App\Enums\TaskState;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Task extends Model
{
    use BelongsToOrganization, HasFactory, LogsActivity;

    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'state' => TaskState::class,
            'deadline' => 'date',
        ];
    }

    public function assignedTo(): BelongsTo
    {
        return $this->belongsTo(People::class, 'assigned_to_id');
    }

    public function measure(): BelongsTo
    {
        return $this->belongsTo(Measure::class);
    }
}
