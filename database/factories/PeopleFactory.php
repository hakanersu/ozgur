<?php

namespace Database\Factories;

use App\Enums\PeopleKind;
use App\Models\Organization;
use Illuminate\Database\Eloquent\Factories\Factory;

class PeopleFactory extends Factory
{
    public function definition(): array
    {
        return [
            'organization_id' => Organization::factory(),
            'full_name' => fake()->name(),
            'primary_email' => fake()->unique()->safeEmail(),
            'kind' => PeopleKind::Employee,
            'position' => fake()->jobTitle(),
        ];
    }

    public function contractor(): static
    {
        return $this->state(fn () => ['kind' => PeopleKind::Contractor]);
    }
}
