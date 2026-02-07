<?php

namespace App\Http\Controllers;

use App\Http\Requests\Vendor\StoreVendorRiskAssessmentRequest;
use App\Models\Organization;
use App\Models\Vendor;
use App\Models\VendorRiskAssessment;
use Illuminate\Http\RedirectResponse;

class VendorRiskAssessmentController extends Controller
{
    public function store(StoreVendorRiskAssessmentRequest $request, Organization $organization, Vendor $vendor): RedirectResponse
    {
        $data = $request->validated();
        $data['organization_id'] = $organization->id;

        $vendor->riskAssessments()->create($data);

        return to_route('organizations.vendors.show', [$organization, $vendor]);
    }

    public function destroy(Organization $organization, Vendor $vendor, VendorRiskAssessment $assessment): RedirectResponse
    {
        $assessment->delete();

        return to_route('organizations.vendors.show', [$organization, $vendor]);
    }
}
