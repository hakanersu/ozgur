<?php

namespace Database\Factories;

use App\Enums\AuditState;
use App\Models\Organization;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Audit>
 */
class AuditFactory extends Factory
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
            'state' => AuditState::NotStarted,
            'scheduled_at' => fake()->dateTimeBetween('+1 week', '+3 months'),
            'completed_at' => null,
        ];
    }

    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'state' => AuditState::Completed,
            'completed_at' => now(),
        ]);
    }
}
