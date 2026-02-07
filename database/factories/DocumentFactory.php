<?php

namespace Database\Factories;

use App\Enums\DocumentClassification;
use App\Enums\DocumentType;
use App\Models\Organization;
use Illuminate\Database\Eloquent\Factories\Factory;

class DocumentFactory extends Factory
{
    public function definition(): array
    {
        return [
            'organization_id' => Organization::factory(),
            'title' => fake()->sentence(3),
            'document_type' => fake()->randomElement(DocumentType::cases()),
            'classification' => fake()->randomElement(DocumentClassification::cases()),
        ];
    }

    public function policy(): static
    {
        return $this->state(fn () => ['document_type' => DocumentType::Policy]);
    }
}
