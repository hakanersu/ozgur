<?php

namespace App\Models;

use App\Concerns\BelongsToOrganization;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TransferImpactAssessment extends Model
{
    /** @use HasFactory<\Database\Factories\TransferImpactAssessmentFactory> */
    use BelongsToOrganization, HasFactory;

    protected $guarded = [];

    /**
     * @return BelongsTo<ProcessingActivity, $this>
     */
    public function processingActivity(): BelongsTo
    {
        return $this->belongsTo(ProcessingActivity::class);
    }
}
