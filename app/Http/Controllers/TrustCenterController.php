<?php

namespace App\Http\Controllers;

use App\Http\Requests\TrustCenter\StoreTrustCenterFileRequest;
use App\Http\Requests\TrustCenter\StoreTrustCenterReferenceRequest;
use App\Http\Requests\TrustCenter\UpdateTrustCenterAccessRequest;
use App\Http\Requests\TrustCenter\UpdateTrustCenterRequest;
use App\Models\Organization;
use App\Models\TrustCenterAccess;
use App\Models\TrustCenterFile;
use App\Models\TrustCenterReference;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class TrustCenterController extends Controller
{
    public function show(Organization $organization): Response
    {
        $trustCenter = $organization->trustCenter;

        if (! $trustCenter) {
            $trustCenter = $organization->trustCenter()->create([
                'slug' => $organization->slug,
                'title' => $organization->name.' Trust Center',
            ]);
        }

        $trustCenter->load(['references', 'files', 'accesses']);

        return Inertia::render('trust-center/show', [
            'organization' => $organization,
            'trustCenter' => $trustCenter,
        ]);
    }

    public function update(UpdateTrustCenterRequest $request, Organization $organization): RedirectResponse
    {
        $trustCenter = $organization->trustCenter;

        $trustCenter->update($request->validated());

        return to_route('organizations.trust-center.show', $organization);
    }

    public function storeReference(StoreTrustCenterReferenceRequest $request, Organization $organization): RedirectResponse
    {
        $organization->trustCenter->references()->create($request->validated());

        return to_route('organizations.trust-center.show', $organization);
    }

    public function destroyReference(Organization $organization, TrustCenterReference $reference): RedirectResponse
    {
        $reference->delete();

        return to_route('organizations.trust-center.show', $organization);
    }

    public function storeFile(StoreTrustCenterFileRequest $request, Organization $organization): RedirectResponse
    {
        $path = $request->file('file')->store('trust-center-files', 'public');

        $organization->trustCenter->files()->create([
            'name' => $request->validated('name'),
            'category' => $request->validated('category'),
            'file_path' => $path,
            'visibility' => $request->validated('visibility'),
        ]);

        return to_route('organizations.trust-center.show', $organization);
    }

    public function destroyFile(Organization $organization, TrustCenterFile $file): RedirectResponse
    {
        $file->delete();

        return to_route('organizations.trust-center.show', $organization);
    }

    public function updateAccess(UpdateTrustCenterAccessRequest $request, Organization $organization, TrustCenterAccess $access): RedirectResponse
    {
        $access->update($request->validated());

        return to_route('organizations.trust-center.show', $organization);
    }

    public function destroyAccess(Organization $organization, TrustCenterAccess $access): RedirectResponse
    {
        $access->delete();

        return to_route('organizations.trust-center.show', $organization);
    }
}
