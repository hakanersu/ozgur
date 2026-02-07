<?php

namespace App\Models;

use App\Concerns\BelongsToOrganization;
use App\Enums\AssetType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Asset extends Model
{
    /** @use HasFactory<\Database\Factories\AssetFactory> */
    use BelongsToOrganization, HasFactory;

    protected $guarded = [];

    /**
     * @return array<string, mixed>
     */
    protected function casts(): array
    {
        return [
            'asset_type' => AssetType::class,
        ];
    }

    /**
     * @return BelongsTo<People, $this>
     */
    public function owner(): BelongsTo
    {
        return $this->belongsTo(People::class, 'owner_id');
    }

    /**
     * @return BelongsToMany<Vendor, $this>
     */
    public function vendors(): BelongsToMany
    {
        return $this->belongsToMany(Vendor::class)->withTimestamps();
    }
}
