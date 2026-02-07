<?php

namespace App\Models;

use App\Concerns\BelongsToOrganization;
use App\Enums\BusinessImpact;
use App\Enums\DataSensitivity;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VendorRiskAssessment extends Model
{
    use BelongsToOrganization, HasFactory;

    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'data_sensitivity' => DataSensitivity::class,
            'business_impact' => BusinessImpact::class,
            'expires_at' => 'date',
        ];
    }

    public function vendor(): BelongsTo
    {
        return $this->belongsTo(Vendor::class);
    }
}
