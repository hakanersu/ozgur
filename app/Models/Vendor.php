<?php

namespace App\Models;

use App\Concerns\BelongsToOrganization;
use App\Concerns\LogsActivity;
use App\Enums\VendorCategory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Vendor extends Model
{
    use BelongsToOrganization, HasFactory, LogsActivity;

    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'category' => VendorCategory::class,
            'certifications' => 'array',
            'countries' => 'array',
        ];
    }

    public function contacts(): HasMany
    {
        return $this->hasMany(VendorContact::class);
    }

    public function riskAssessments(): HasMany
    {
        return $this->hasMany(VendorRiskAssessment::class);
    }
}
