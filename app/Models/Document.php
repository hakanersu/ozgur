<?php

namespace App\Models;

use App\Concerns\BelongsToOrganization;
use App\Concerns\LogsActivity;
use App\Enums\DocumentClassification;
use App\Enums\DocumentType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Document extends Model
{
    use BelongsToOrganization, HasFactory, LogsActivity, SoftDeletes;

    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'document_type' => DocumentType::class,
            'classification' => DocumentClassification::class,
        ];
    }

    public function versions(): HasMany
    {
        return $this->hasMany(DocumentVersion::class);
    }

    public function controls(): BelongsToMany
    {
        return $this->belongsToMany(Control::class);
    }
}
