<?php

namespace Database\Factories;

use App\Models\Organization;
use App\Models\ProcessingActivity;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TransferImpactAssessment>
 */
class TransferImpactAssessmentFactory extends Factory
{
    public function definition(): array
    {
        return [
            'organization_id' => Organization::factory(),
            'processing_activity_id' => ProcessingActivity::factory(),
            'data_subjects' => fake()->paragraph(),
            'legal_mechanism' => fake()->sentence(),
            'transfer' => fake()->paragraph(),
            'local_law_risk' => fake()->paragraph(),
            'supplementary_measures' => fake()->paragraph(),
        ];
    }
}
