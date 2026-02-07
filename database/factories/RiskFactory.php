<?php

namespace Database\Factories;

use App\Enums\RiskTreatment;
use App\Models\Organization;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Risk>
 */
class RiskFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'organization_id' => Organization::factory(),
            'name' => fake()->sentence(3),
            'description' => fake()->paragraph(),
            'category' => fake()->randomElement(['Operational', 'Strategic', 'Compliance', 'Financial']),
            'probability' => fake()->numberBetween(1, 5),
            'impact' => fake()->numberBetween(1, 5),
            'treatment' => RiskTreatment::Mitigated,
        ];
    }
}
