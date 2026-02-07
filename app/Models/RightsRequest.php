<?php

namespace App\Models;

use App\Concerns\BelongsToOrganization;
use App\Concerns\LogsActivity;
use App\Enums\RightsRequestState;
use App\Enums\RightsRequestType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RightsRequest extends Model
{
    /** @use HasFactory<\Database\Factories\RightsRequestFactory> */
    use BelongsToOrganization, HasFactory, LogsActivity;

    protected $guarded = [];

    /**
     * @return array<string, mixed>
     */
    protected function casts(): array
    {
        return [
            'request_type' => RightsRequestType::class,
            'request_state' => RightsRequestState::class,
            'deadline' => 'datetime',
        ];
    }

    public function getActivityName(): string
    {
        return $this->data_subject ?? (string) $this->getKey();
    }
}
