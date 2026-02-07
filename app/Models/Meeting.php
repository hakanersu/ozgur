<?php

namespace App\Models;

use App\Concerns\BelongsToOrganization;
use App\Concerns\LogsActivity;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Meeting extends Model
{
    use BelongsToOrganization, HasFactory, LogsActivity;

    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'date' => 'datetime',
        ];
    }

    public function attendees(): BelongsToMany
    {
        return $this->belongsToMany(People::class, 'meeting_attendees')->withTimestamps();
    }
}
