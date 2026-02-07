<?php

namespace Database\Factories;

use App\Enums\BusinessImpact;
use App\Enums\DataSensitivity;
use App\Models\Organization;
use App\Models\Vendor;
use Illuminate\Database\Eloquent\Factories\Factory;

class VendorRiskAssessmentFactory extends Factory
{
    public function definition(): array
    {
        return [
            'vendor_id' => Vendor::factory(),
            'organization_id' => Organization::factory(),
            'expires_at' => fake()->dateTimeBetween('+1 month', '+1 year'),
            'data_sensitivity' => fake()->randomElement(DataSensitivity::cases()),
            'business_impact' => fake()->randomElement(BusinessImpact::cases()),
            'notes' => fake()->paragraph(),
        ];
    }
}
