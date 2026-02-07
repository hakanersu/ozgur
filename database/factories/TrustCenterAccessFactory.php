<?php

namespace Database\Factories;

use App\Enums\TrustCenterAccessState;
use App\Models\TrustCenter;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TrustCenterAccess>
 */
class TrustCenterAccessFactory extends Factory
{
    public function definition(): array
    {
        return [
            'trust_center_id' => TrustCenter::factory(),
            'email' => fake()->unique()->safeEmail(),
            'name' => fake()->name(),
            'company' => fake()->company(),
            'state' => TrustCenterAccessState::Requested,
        ];
    }

    public function granted(): static
    {
        return $this->state(fn () => ['state' => TrustCenterAccessState::Granted]);
    }
}
