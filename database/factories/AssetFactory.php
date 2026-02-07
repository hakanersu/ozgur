<?php

namespace Database\Factories;

use App\Enums\AssetType;
use App\Models\Organization;
use App\Models\People;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Asset>
 */
class AssetFactory extends Factory
{
    public function definition(): array
    {
        return [
            'organization_id' => Organization::factory(),
            'name' => fake()->words(3, true),
            'amount' => fake()->numberBetween(1, 50),
            'owner_id' => People::factory(),
            'asset_type' => AssetType::Physical,
            'data_types_stored' => fake()->sentence(),
        ];
    }
}
