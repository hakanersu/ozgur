<?php

namespace App\Models;

use App\Concerns\BelongsToOrganization;
use App\Concerns\LogsActivity;
use App\Enums\AuditState;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Audit extends Model
{
    /** @use HasFactory<\Database\Factories\AuditFactory> */
    use BelongsToOrganization, HasFactory, LogsActivity;

    protected $fillable = [
        'organization_id',
        'name',
        'description',
        'state',
        'scheduled_at',
        'completed_at',
    ];

    protected function casts(): array
    {
        return [
            'state' => AuditState::class,
            'scheduled_at' => 'datetime',
            'completed_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsToMany<Control, $this>
     */
    public function controls(): BelongsToMany
    {
        return $this->belongsToMany(Control::class, 'audit_control')->withTimestamps();
    }
}
