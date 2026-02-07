<?php

namespace Database\Factories;

use App\Enums\MeasureState;
use App\Models\Organization;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Measure>
 */
class MeasureFactory extends Factory
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
            'state' => MeasureState::NotStarted,
        ];
    }

    public function implemented(): static
    {
        return $this->state(fn (array $attributes) => [
            'state' => MeasureState::Implemented,
        ]);
    }
}
