<?php

namespace Database\Factories;

use App\Enums\EvidenceState;
use App\Enums\EvidenceType;
use App\Models\Measure;
use App\Models\Organization;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Evidence>
 */
class EvidenceFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'measure_id' => Measure::factory(),
            'organization_id' => Organization::factory(),
            'name' => fake()->sentence(2),
            'type' => EvidenceType::Link,
            'url' => fake()->url(),
            'file_path' => null,
            'state' => EvidenceState::Requested,
        ];
    }

    public function fulfilled(): static
    {
        return $this->state(fn (array $attributes) => [
            'state' => EvidenceState::Fulfilled,
        ]);
    }

    public function file(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => EvidenceType::File,
            'url' => null,
            'file_path' => 'evidence/'.fake()->uuid().'.pdf',
        ]);
    }
}
