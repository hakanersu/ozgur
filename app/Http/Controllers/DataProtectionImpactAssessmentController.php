<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProcessingActivity\StoreDpiaRequest;
use App\Models\DataProtectionImpactAssessment;
use App\Models\Organization;
use App\Models\ProcessingActivity;
use Illuminate\Http\RedirectResponse;

class DataProtectionImpactAssessmentController extends Controller
{
    public function store(StoreDpiaRequest $request, Organization $organization, ProcessingActivity $processingActivity): RedirectResponse
    {
        $processingActivity->dpia()->create([
            'organization_id' => $organization->id,
            ...$request->validated(),
        ]);

        return to_route('organizations.processing-activities.show', [$organization, $processingActivity]);
    }

    public function destroy(Organization $organization, ProcessingActivity $processingActivity, DataProtectionImpactAssessment $dpia): RedirectResponse
    {
        $dpia->delete();

        return to_route('organizations.processing-activities.show', [$organization, $processingActivity]);
    }
}
