<?php

namespace App\Models;

use App\Concerns\BelongsToOrganization;
use App\Concerns\LogsActivity;
use App\Enums\RiskTreatment;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Risk extends Model
{
    /** @use HasFactory<\Database\Factories\RiskFactory> */
    use BelongsToOrganization, HasFactory, LogsActivity;

    protected $fillable = [
        'organization_id',
        'name',
        'description',
        'category',
        'probability',
        'impact',
        'treatment',
    ];

    protected function casts(): array
    {
        return [
            'probability' => 'integer',
            'impact' => 'integer',
            'treatment' => RiskTreatment::class,
        ];
    }

    /**
     * @return BelongsToMany<Measure, $this>
     */
    public function measures(): BelongsToMany
    {
        return $this->belongsToMany(Measure::class, 'measure_risk')->withTimestamps();
    }
}
