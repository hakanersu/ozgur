<?php

namespace App\Http\Controllers;

use App\Enums\TrustCenterAccessState;
use App\Enums\TrustCenterVisibility;
use App\Http\Requests\TrustCenter\RequestAccessRequest;
use App\Models\TrustCenter;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PublicTrustCenterController extends Controller
{
    public function show(TrustCenter $trustCenter): Response|RedirectResponse
    {
        if (! $trustCenter->is_active) {
            abort(404);
        }

        $trustCenter->load(['organization', 'references']);

        $publicFiles = $trustCenter->files()
            ->where('visibility', TrustCenterVisibility::Public)
            ->get();

        return Inertia::render('trust-center/public/show', [
            'trustCenter' => $trustCenter,
            'organization' => $trustCenter->organization,
            'references' => $trustCenter->references,
            'files' => $publicFiles,
        ]);
    }

    public function requestAccess(RequestAccessRequest $request, TrustCenter $trustCenter): RedirectResponse
    {
        if (! $trustCenter->is_active) {
            abort(404);
        }

        $trustCenter->accesses()->create([
            'email' => $request->validated('email'),
            'name' => $request->validated('name'),
            'company' => $request->validated('company'),
            'state' => TrustCenterAccessState::Requested,
        ]);

        return back()->with('success', 'Access request submitted successfully.');
    }
}
