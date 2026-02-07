<?php

namespace Database\Factories;

use App\Enums\VendorCategory;
use App\Models\Organization;
use Illuminate\Database\Eloquent\Factories\Factory;

class VendorFactory extends Factory
{
    public function definition(): array
    {
        return [
            'organization_id' => Organization::factory(),
            'name' => fake()->company(),
            'description' => fake()->sentence(),
            'category' => fake()->randomElement(VendorCategory::cases()),
            'website_url' => fake()->url(),
        ];
    }
}
