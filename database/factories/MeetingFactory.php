<?php

namespace Database\Factories;

use App\Models\Organization;
use Illuminate\Database\Eloquent\Factories\Factory;

class MeetingFactory extends Factory
{
    public function definition(): array
    {
        return [
            'organization_id' => Organization::factory(),
            'name' => fake()->sentence(3),
            'date' => fake()->dateTimeBetween('-1 month', '+1 month'),
            'minutes' => fake()->paragraphs(2, true),
        ];
    }
}
