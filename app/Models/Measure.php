<?php

namespace App\Models;

use App\Concerns\BelongsToOrganization;
use App\Concerns\LogsActivity;
use App\Enums\MeasureState;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Measure extends Model
{
    /** @use HasFactory<\Database\Factories\MeasureFactory> */
    use BelongsToOrganization, HasFactory, LogsActivity;

    protected $fillable = [
        'organization_id',
        'name',
        'description',
        'state',
    ];

    protected function casts(): array
    {
        return [
            'state' => MeasureState::class,
        ];
    }

    /**
     * @return BelongsToMany<Control, $this>
     */
    public function controls(): BelongsToMany
    {
        return $this->belongsToMany(Control::class, 'control_measure')->withTimestamps();
    }

    /**
     * @return BelongsToMany<Risk, $this>
     */
    public function risks(): BelongsToMany
    {
        return $this->belongsToMany(Risk::class, 'measure_risk')->withTimestamps();
    }

    /**
     * @return HasMany<Evidence, $this>
     */
    public function evidence(): HasMany
    {
        return $this->hasMany(Evidence::class);
    }
}
