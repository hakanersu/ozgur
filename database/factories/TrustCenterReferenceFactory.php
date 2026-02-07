<?php

namespace Database\Factories;

use App\Models\TrustCenter;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TrustCenterReference>
 */
class TrustCenterReferenceFactory extends Factory
{
    public function definition(): array
    {
        return [
            'trust_center_id' => TrustCenter::factory(),
            'name' => fake()->words(3, true),
            'description' => fake()->sentence(),
            'url' => fake()->url(),
            'rank' => fake()->numberBetween(0, 10),
        ];
    }
}
