<?php

namespace App\Models;

use App\Concerns\BelongsToOrganization;
use App\Concerns\LogsActivity;
use App\Enums\FrameworkStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Framework extends Model
{
    /** @use HasFactory<\Database\Factories\FrameworkFactory> */
    use BelongsToOrganization, HasFactory, LogsActivity;

    protected $fillable = [
        'organization_id',
        'name',
        'description',
        'version',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'status' => FrameworkStatus::class,
        ];
    }

    /**
     * @return HasMany<Control, $this>
     */
    public function controls(): HasMany
    {
        return $this->hasMany(Control::class);
    }
}
