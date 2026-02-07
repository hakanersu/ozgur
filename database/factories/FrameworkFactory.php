<?php

namespace Database\Factories;

use App\Enums\FrameworkStatus;
use App\Models\Organization;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Framework>
 */
class FrameworkFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'organization_id' => Organization::factory(),
            'name' => fake()->randomElement(['SOC-2', 'ISO 27001', 'GDPR', 'HIPAA', 'PCI DSS']),
            'description' => fake()->sentence(),
            'version' => fake()->randomElement(['1.0', '2.0', '2022']),
            'status' => FrameworkStatus::Draft,
        ];
    }

    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => FrameworkStatus::Active,
        ]);
    }
}
