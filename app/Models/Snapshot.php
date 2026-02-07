<?php

namespace App\Models;

use App\Concerns\BelongsToOrganization;
use App\Concerns\LogsActivity;
use App\Enums\SnapshotType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Snapshot extends Model
{
    /** @use HasFactory<\Database\Factories\SnapshotFactory> */
    use BelongsToOrganization, HasFactory, LogsActivity;

    protected $guarded = [];

    /**
     * @return array<string, mixed>
     */
    protected function casts(): array
    {
        return [
            'type' => SnapshotType::class,
        ];
    }
}
