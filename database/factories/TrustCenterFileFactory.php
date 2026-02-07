<?php

namespace Database\Factories;

use App\Enums\TrustCenterVisibility;
use App\Models\TrustCenter;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TrustCenterFile>
 */
class TrustCenterFileFactory extends Factory
{
    public function definition(): array
    {
        return [
            'trust_center_id' => TrustCenter::factory(),
            'name' => fake()->words(2, true),
            'category' => fake()->randomElement(['Security', 'Compliance', 'Certifications']),
            'file_path' => 'trust-center-files/'.fake()->uuid().'.pdf',
            'visibility' => TrustCenterVisibility::Public,
        ];
    }
}
