<?php

namespace Database\Factories;

use App\Enums\ControlStatus;
use App\Models\Framework;
use App\Models\Organization;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Control>
 */
class ControlFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'organization_id' => Organization::factory(),
            'framework_id' => Framework::factory(),
            'name' => fake()->sentence(3),
            'description' => fake()->paragraph(),
            'code' => strtoupper(fake()->bothify('CC-##.#')),
            'category' => fake()->randomElement(['Access Control', 'Security', 'Availability', 'Privacy']),
            'status' => ControlStatus::NotStarted,
        ];
    }

    public function implemented(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => ControlStatus::Implemented,
        ]);
    }
}
