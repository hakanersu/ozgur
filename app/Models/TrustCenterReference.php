<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TrustCenterReference extends Model
{
    /** @use HasFactory<\Database\Factories\TrustCenterReferenceFactory> */
    use HasFactory;

    protected $guarded = [];

    /**
     * @return BelongsTo<TrustCenter, $this>
     */
    public function trustCenter(): BelongsTo
    {
        return $this->belongsTo(TrustCenter::class);
    }
}
