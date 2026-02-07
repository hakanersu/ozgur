<?php

namespace App\Models;

use App\Concerns\BelongsToOrganization;
use App\Enums\EvidenceState;
use App\Enums\EvidenceType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Evidence extends Model
{
    /** @use HasFactory<\Database\Factories\EvidenceFactory> */
    use BelongsToOrganization, HasFactory;

    protected $fillable = [
        'measure_id',
        'organization_id',
        'name',
        'type',
        'url',
        'file_path',
        'state',
    ];

    protected function casts(): array
    {
        return [
            'type' => EvidenceType::class,
            'state' => EvidenceState::class,
        ];
    }

    /**
     * @return BelongsTo<Measure, $this>
     */
    public function measure(): BelongsTo
    {
        return $this->belongsTo(Measure::class);
    }
}
