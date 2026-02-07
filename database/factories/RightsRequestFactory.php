<?php

namespace Database\Factories;

use App\Enums\RightsRequestState;
use App\Enums\RightsRequestType;
use App\Models\Organization;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\RightsRequest>
 */
class RightsRequestFactory extends Factory
{
    public function definition(): array
    {
        return [
            'organization_id' => Organization::factory(),
            'request_type' => RightsRequestType::Access,
            'request_state' => RightsRequestState::Todo,
            'data_subject' => fake()->name(),
            'contact' => fake()->email(),
            'details' => fake()->paragraph(),
            'deadline' => fake()->dateTimeBetween('+1 week', '+1 month'),
        ];
    }
}
