<?php

namespace Database\Factories;

use App\Models\Organization;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ActivityLog>
 */
class ActivityLogFactory extends Factory
{
    public function definition(): array
    {
        return [
            'organization_id' => Organization::factory(),
            'user_id' => User::factory(),
            'event' => fake()->randomElement(['created', 'updated', 'deleted']),
            'subject_type' => 'App\\Models\\Risk',
            'subject_id' => fake()->randomNumber(),
            'subject_name' => fake()->words(3, true),
            'changes' => null,
        ];
    }
}
