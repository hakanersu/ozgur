<?php

namespace Database\Seeders;

use App\Enums\ControlStatus;
use App\Enums\FrameworkStatus;
use App\Models\Control;
use App\Models\Framework;
use App\Models\Organization;
use Illuminate\Database\Seeder;

class FrameworkSeeder extends Seeder
{
    public function run(): void
    {
        $organization = Organization::firstOrCreate(
            ['slug' => 'demo'],
            ['name' => 'Demo Organization'],
        );

        $dataDir = database_path('data/frameworks');

        foreach (glob("{$dataDir}/*.json") as $file) {
            $data = json_decode(file_get_contents($file), true);

            $framework = Framework::firstOrCreate(
                [
                    'organization_id' => $organization->id,
                    'name' => $data['name'],
                ],
                [
                    'version' => $data['id'],
                    'status' => FrameworkStatus::Active,
                ],
            );

            foreach ($data['controls'] as $control) {
                Control::firstOrCreate(
                    [
                        'organization_id' => $organization->id,
                        'framework_id' => $framework->id,
                        'code' => $control['id'],
                    ],
                    [
                        'name' => $control['name'],
                        'description' => $control['description'] ?? null,
                        'status' => ControlStatus::NotStarted,
                    ],
                );
            }
        }
    }
}
