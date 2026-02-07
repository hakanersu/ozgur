<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProcessingActivity\StoreProcessingActivityRequest;
use App\Http\Requests\ProcessingActivity\UpdateProcessingActivityRequest;
use App\Models\Organization;
use App\Models\ProcessingActivity;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProcessingActivityController extends Controller
{
    public function index(Request $request, Organization $organization): Response
    {
        $query = ProcessingActivity::query()
            ->forOrganization($organization)
            ->with('dataProtectionOfficer:id,full_name')
            ->orderBy('name');

        if ($search = $request->query('search')) {
            $query->where('name', 'like', "%{$search}%");
        }

        return Inertia::render('processing-activities/index', [
            'organization' => $organization,
            'processingActivities' => $query->get(),
            'filters' => [
                'search' => $search ?? '',
            ],
        ]);
    }

    public function create(Organization $organization): Response
    {
        return Inertia::render('processing-activities/create', [
            'organization' => $organization,
            'people' => $organization->people()->orderBy('full_name')->get(['id', 'full_name']),
        ]);
    }

    public function store(StoreProcessingActivityRequest $request, Organization $organization): RedirectResponse
    {
        $organization->processingActivities()->create($request->validated());

        return to_route('organizations.processing-activities.index', $organization);
    }

    public function show(Organization $organization, ProcessingActivity $processingActivity): Response
    {
        return Inertia::render('processing-activities/show', [
            'organization' => $organization,
            'processingActivity' => $processingActivity->load(['dataProtectionOfficer:id,full_name', 'dpia', 'tia']),
        ]);
    }

    public function edit(Organization $organization, ProcessingActivity $processingActivity): Response
    {
        return Inertia::render('processing-activities/edit', [
            'organization' => $organization,
            'processingActivity' => $processingActivity,
            'people' => $organization->people()->orderBy('full_name')->get(['id', 'full_name']),
        ]);
    }

    public function update(UpdateProcessingActivityRequest $request, Organization $organization, ProcessingActivity $processingActivity): RedirectResponse
    {
        $processingActivity->update($request->validated());

        return to_route('organizations.processing-activities.show', [$organization, $processingActivity]);
    }

    public function destroy(Organization $organization, ProcessingActivity $processingActivity): RedirectResponse
    {
        $processingActivity->delete();

        return to_route('organizations.processing-activities.index', $organization);
    }
}
