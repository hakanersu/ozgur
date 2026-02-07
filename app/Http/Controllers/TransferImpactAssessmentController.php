<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProcessingActivity\StoreTiaRequest;
use App\Models\Organization;
use App\Models\ProcessingActivity;
use App\Models\TransferImpactAssessment;
use Illuminate\Http\RedirectResponse;

class TransferImpactAssessmentController extends Controller
{
    public function store(StoreTiaRequest $request, Organization $organization, ProcessingActivity $processingActivity): RedirectResponse
    {
        $processingActivity->tia()->create([
            'organization_id' => $organization->id,
            ...$request->validated(),
        ]);

        return to_route('organizations.processing-activities.show', [$organization, $processingActivity]);
    }

    public function destroy(Organization $organization, ProcessingActivity $processingActivity, TransferImpactAssessment $tia): RedirectResponse
    {
        $tia->delete();

        return to_route('organizations.processing-activities.show', [$organization, $processingActivity]);
    }
}
