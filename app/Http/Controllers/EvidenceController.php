<?php

namespace App\Http\Controllers;

use App\Http\Requests\Evidence\StoreEvidenceRequest;
use App\Models\Evidence;
use App\Models\Measure;
use App\Models\Organization;
use Illuminate\Http\RedirectResponse;

class EvidenceController extends Controller
{
    public function store(StoreEvidenceRequest $request, Organization $organization, Measure $measure): RedirectResponse
    {
        $data = $request->validated();
        $data['organization_id'] = $organization->id;

        if ($request->hasFile('file')) {
            $data['file_path'] = $request->file('file')->store('evidence', 'public');
        }

        $measure->evidence()->create($data);

        return to_route('organizations.measures.show', [$organization, $measure]);
    }

    public function destroy(Organization $organization, Measure $measure, Evidence $evidence): RedirectResponse
    {
        $evidence->delete();

        return to_route('organizations.measures.show', [$organization, $measure]);
    }
}
