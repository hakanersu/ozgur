<?php

namespace Database\Factories;

use App\Enums\AssessmentNeeded;
use App\Enums\LawfulBasis;
use App\Enums\ProcessingRole;
use App\Enums\SpecialOrCriminalData;
use App\Models\Organization;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ProcessingActivity>
 */
class ProcessingActivityFactory extends Factory
{
    public function definition(): array
    {
        return [
            'organization_id' => Organization::factory(),
            'name' => fake()->sentence(3),
            'purpose' => fake()->sentence(),
            'lawful_basis' => LawfulBasis::LegitimateInterest,
            'special_or_criminal_data' => SpecialOrCriminalData::No,
            'role' => ProcessingRole::Controller,
            'dpia_needed' => AssessmentNeeded::NotNeeded,
            'tia_needed' => AssessmentNeeded::NotNeeded,
            'international_transfers' => false,
        ];
    }
}
