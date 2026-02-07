<?php

namespace App\Models;

use App\Concerns\BelongsToOrganization;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TrustCenter extends Model
{
    /** @use HasFactory<\Database\Factories\TrustCenterFactory> */
    use BelongsToOrganization, HasFactory;

    protected $guarded = [];

    /**
     * @return array<string, mixed>
     */
    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    /**
     * @return HasMany<TrustCenterReference, $this>
     */
    public function references(): HasMany
    {
        return $this->hasMany(TrustCenterReference::class)->orderBy('rank');
    }

    /**
     * @return HasMany<TrustCenterFile, $this>
     */
    public function files(): HasMany
    {
        return $this->hasMany(TrustCenterFile::class);
    }

    /**
     * @return HasMany<TrustCenterAccess, $this>
     */
    public function accesses(): HasMany
    {
        return $this->hasMany(TrustCenterAccess::class);
    }
}
