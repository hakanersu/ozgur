<?php

namespace App\Models;

use App\Concerns\BelongsToOrganization;
use App\Enums\ControlStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Control extends Model
{
    /** @use HasFactory<\Database\Factories\ControlFactory> */
    use BelongsToOrganization, HasFactory;

    protected $fillable = [
        'organization_id',
        'framework_id',
        'name',
        'description',
        'code',
        'category',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'status' => ControlStatus::class,
        ];
    }

    /**
     * @return BelongsTo<Framework, $this>
     */
    public function framework(): BelongsTo
    {
        return $this->belongsTo(Framework::class);
    }

    /**
     * @return BelongsToMany<Measure, $this>
     */
    public function measures(): BelongsToMany
    {
        return $this->belongsToMany(Measure::class, 'control_measure')->withTimestamps();
    }

    /**
     * @return BelongsToMany<Audit, $this>
     */
    public function audits(): BelongsToMany
    {
        return $this->belongsToMany(Audit::class, 'audit_control')->withTimestamps();
    }

    /**
     * @return BelongsToMany<Document, $this>
     */
    public function documents(): BelongsToMany
    {
        return $this->belongsToMany(Document::class)->withTimestamps();
    }
}
