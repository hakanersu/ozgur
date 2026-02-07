<?php

namespace App\Http\Controllers;

use App\Http\Requests\RightsRequest\StoreRightsRequestRequest;
use App\Http\Requests\RightsRequest\UpdateRightsRequestRequest;
use App\Models\Organization;
use App\Models\RightsRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RightsRequestController extends Controller
{
    public function index(Request $request, Organization $organization): Response
    {
        $query = RightsRequest::query()
            ->forOrganization($organization)
            ->orderByDesc('created_at');

        if ($search = $request->query('search')) {
            $query->where('data_subject', 'like', "%{$search}%");
        }

        return Inertia::render('rights-requests/index', [
            'organization' => $organization,
            'rightsRequests' => $query->get(),
            'filters' => [
                'search' => $search ?? '',
            ],
        ]);
    }

    public function create(Organization $organization): Response
    {
        return Inertia::render('rights-requests/create', [
            'organization' => $organization,
        ]);
    }

    public function store(StoreRightsRequestRequest $request, Organization $organization): RedirectResponse
    {
        $organization->rightsRequests()->create($request->validated());

        return to_route('organizations.rights-requests.index', $organization);
    }

    public function show(Organization $organization, RightsRequest $rightsRequest): Response
    {
        return Inertia::render('rights-requests/show', [
            'organization' => $organization,
            'rightsRequest' => $rightsRequest,
        ]);
    }

    public function edit(Organization $organization, RightsRequest $rightsRequest): Response
    {
        return Inertia::render('rights-requests/edit', [
            'organization' => $organization,
            'rightsRequest' => $rightsRequest,
        ]);
    }

    public function update(UpdateRightsRequestRequest $request, Organization $organization, RightsRequest $rightsRequest): RedirectResponse
    {
        $rightsRequest->update($request->validated());

        return to_route('organizations.rights-requests.show', [$organization, $rightsRequest]);
    }

    public function destroy(Organization $organization, RightsRequest $rightsRequest): RedirectResponse
    {
        $rightsRequest->delete();

        return to_route('organizations.rights-requests.index', $organization);
    }
}
