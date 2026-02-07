<?php

namespace Database\Factories;

use App\Enums\TaskState;
use App\Models\Organization;
use Illuminate\Database\Eloquent\Factories\Factory;

class TaskFactory extends Factory
{
    public function definition(): array
    {
        return [
            'organization_id' => Organization::factory(),
            'name' => fake()->sentence(3),
            'description' => fake()->paragraph(),
            'state' => TaskState::Todo,
            'deadline' => fake()->dateTimeBetween('+1 week', '+3 months'),
        ];
    }

    public function done(): static
    {
        return $this->state(fn () => ['state' => TaskState::Done]);
    }
}
