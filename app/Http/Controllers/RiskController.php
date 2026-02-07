<?php

namespace App\Http\Controllers;

use App\Http\Requests\Risk\StoreRiskRequest;
use App\Http\Requests\Risk\UpdateRiskRequest;
use App\Models\Organization;
use App\Models\Risk;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class RiskController extends Controller
{
    public function index(Organization $organization): Response
    {
        return Inertia::render('risks/index', [
            'organization' => $organization,
            'risks' => Risk::query()
                ->forOrganization($organization)
                ->withCount('measures')
                ->orderBy('name')
                ->get(),
        ]);
    }

    public function create(Organization $organization): Response
    {
        return Inertia::render('risks/create', [
            'organization' => $organization,
        ]);
    }

    public function store(StoreRiskRequest $request, Organization $organization): RedirectResponse
    {
        $organization->risks()->create($request->validated());

        return to_route('organizations.risks.index', $organization);
    }

    public function show(Organization $organization, Risk $risk): Response
    {
        return Inertia::render('risks/show', [
            'organization' => $organization,
            'risk' => $risk->load('measures'),
        ]);
    }

    public function edit(Organization $organization, Risk $risk): Response
    {
        return Inertia::render('risks/edit', [
            'organization' => $organization,
            'risk' => $risk,
        ]);
    }

    public function update(UpdateRiskRequest $request, Organization $organization, Risk $risk): RedirectResponse
    {
        $risk->update($request->validated());

        return to_route('organizations.risks.show', [$organization, $risk]);
    }

    public function destroy(Organization $organization, Risk $risk): RedirectResponse
    {
        $risk->delete();

        return to_route('organizations.risks.index', $organization);
    }
}
