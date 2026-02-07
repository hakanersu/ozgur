<?php

namespace App\Http\Controllers;

use App\Enums\OrganizationRole;
use App\Http\Requests\Organization\StoreOrganizationRequest;
use App\Http\Requests\Organization\UpdateOrganizationRequest;
use App\Models\Organization;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrganizationController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('organizations/index', [
            'organizations' => $request->user()
                ->organizations()
                ->withCount('memberships')
                ->orderBy('name')
                ->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('organizations/create');
    }

    public function store(StoreOrganizationRequest $request): RedirectResponse
    {
        $organization = Organization::create($request->validated());

        $organization->memberships()->create([
            'user_id' => $request->user()->id,
            'role' => OrganizationRole::Owner,
        ]);

        return to_route('organizations.show', $organization);
    }

    public function show(Organization $organization): Response
    {
        $this->authorize('view', $organization);

        return Inertia::render('organizations/show', [
            'organization' => $organization->loadCount('memberships'),
            'stats' => [
                'frameworks' => $organization->frameworks()->count(),
                'controls' => $organization->controls()->count(),
                'measures' => $organization->measures()->count(),
                'risks' => $organization->risks()->count(),
                'audits' => $organization->audits()->count(),
                'documents' => $organization->documents()->count(),
                'vendors' => $organization->vendors()->count(),
                'people' => $organization->people()->count(),
                'tasks' => $organization->tasks()->count(),
                'meetings' => $organization->meetings()->count(),
                'assets' => $organization->assets()->count(),
                'processing_activities' => $organization->processingActivities()->count(),
                'rights_requests' => $organization->rightsRequests()->count(),
            ],
        ]);
    }

    public function edit(Organization $organization): Response
    {
        $this->authorize('update', $organization);

        return Inertia::render('organizations/edit', [
            'organization' => $organization,
        ]);
    }

    public function update(UpdateOrganizationRequest $request, Organization $organization): RedirectResponse
    {
        $organization->update($request->validated());

        return to_route('organizations.show', $organization);
    }

    public function destroy(Organization $organization): RedirectResponse
    {
        $this->authorize('delete', $organization);

        $organization->delete();

        return to_route('organizations.index');
    }
}
