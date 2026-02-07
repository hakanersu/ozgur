<?php

namespace App\Models;

use App\Concerns\BelongsToOrganization;
use App\Concerns\LogsActivity;
use App\Enums\AssessmentNeeded;
use App\Enums\LawfulBasis;
use App\Enums\ProcessingRole;
use App\Enums\SpecialOrCriminalData;
use App\Enums\TransferSafeguard;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class ProcessingActivity extends Model
{
    /** @use HasFactory<\Database\Factories\ProcessingActivityFactory> */
    use BelongsToOrganization, HasFactory, LogsActivity;

    protected $guarded = [];

    /**
     * @return array<string, mixed>
     */
    protected function casts(): array
    {
        return [
            'special_or_criminal_data' => SpecialOrCriminalData::class,
            'lawful_basis' => LawfulBasis::class,
            'transfer_safeguards' => TransferSafeguard::class,
            'dpia_needed' => AssessmentNeeded::class,
            'tia_needed' => AssessmentNeeded::class,
            'role' => ProcessingRole::class,
            'international_transfers' => 'boolean',
            'last_review_date' => 'datetime',
            'next_review_date' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<People, $this>
     */
    public function dataProtectionOfficer(): BelongsTo
    {
        return $this->belongsTo(People::class, 'data_protection_officer_id');
    }

    /**
     * @return HasOne<DataProtectionImpactAssessment, $this>
     */
    public function dpia(): HasOne
    {
        return $this->hasOne(DataProtectionImpactAssessment::class);
    }

    /**
     * @return HasOne<TransferImpactAssessment, $this>
     */
    public function tia(): HasOne
    {
        return $this->hasOne(TransferImpactAssessment::class);
    }
}
