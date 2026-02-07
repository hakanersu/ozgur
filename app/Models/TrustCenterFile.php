<?php

namespace App\Models;

use App\Enums\TrustCenterVisibility;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TrustCenterFile extends Model
{
    /** @use HasFactory<\Database\Factories\TrustCenterFileFactory> */
    use HasFactory;

    protected $guarded = [];

    /**
     * @return array<string, mixed>
     */
    protected function casts(): array
    {
        return [
            'visibility' => TrustCenterVisibility::class,
        ];
    }

    /**
     * @return BelongsTo<TrustCenter, $this>
     */
    public function trustCenter(): BelongsTo
    {
        return $this->belongsTo(TrustCenter::class);
    }
}
