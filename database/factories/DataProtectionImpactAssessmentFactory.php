<?php

namespace Database\Factories;

use App\Models\Organization;
use App\Models\ProcessingActivity;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\DataProtectionImpactAssessment>
 */
class DataProtectionImpactAssessmentFactory extends Factory
{
    public function definition(): array
    {
        return [
            'organization_id' => Organization::factory(),
            'processing_activity_id' => ProcessingActivity::factory(),
            'description' => fake()->paragraph(),
            'necessity_and_proportionality' => fake()->paragraph(),
            'potential_risk' => fake()->paragraph(),
            'mitigations' => fake()->paragraph(),
        ];
    }
}
