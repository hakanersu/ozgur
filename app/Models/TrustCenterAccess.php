<?php

namespace App\Models;

use App\Enums\TrustCenterAccessState;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TrustCenterAccess extends Model
{
    /** @use HasFactory<\Database\Factories\TrustCenterAccessFactory> */
    use HasFactory;

    protected $guarded = [];

    /**
     * @return array<string, mixed>
     */
    protected function casts(): array
    {
        return [
            'state' => TrustCenterAccessState::class,
            'has_accepted_nda' => 'boolean',
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
