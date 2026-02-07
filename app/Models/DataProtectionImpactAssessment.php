<?php

namespace App\Models;

use App\Concerns\BelongsToOrganization;
use App\Enums\ResidualRisk;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DataProtectionImpactAssessment extends Model
{
    /** @use HasFactory<\Database\Factories\DataProtectionImpactAssessmentFactory> */
    use BelongsToOrganization, HasFactory;

    protected $guarded = [];

    /**
     * @return array<string, mixed>
     */
    protected function casts(): array
    {
        return [
            'residual_risk' => ResidualRisk::class,
        ];
    }

    /**
     * @return BelongsTo<ProcessingActivity, $this>
     */
    public function processingActivity(): BelongsTo
    {
        return $this->belongsTo(ProcessingActivity::class);
    }
}
