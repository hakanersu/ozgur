<?php

namespace Database\Factories;

use App\Enums\DocumentClassification;
use App\Enums\DocumentStatus;
use App\Models\Document;
use App\Models\Organization;
use Illuminate\Database\Eloquent\Factories\Factory;

class DocumentVersionFactory extends Factory
{
    public function definition(): array
    {
        return [
            'document_id' => Document::factory(),
            'organization_id' => Organization::factory(),
            'title' => fake()->sentence(3),
            'version_number' => 1,
            'classification' => fake()->randomElement(DocumentClassification::cases()),
            'content' => fake()->paragraphs(3, true),
            'status' => DocumentStatus::Draft,
        ];
    }

    public function published(): static
    {
        return $this->state(fn () => [
            'status' => DocumentStatus::Published,
            'published_at' => now(),
        ]);
    }
}
