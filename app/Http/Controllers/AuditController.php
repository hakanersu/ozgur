<?php

namespace App\Http\Controllers;

use App\Http\Requests\Audit\StoreAuditRequest;
use App\Http\Requests\Audit\UpdateAuditRequest;
use App\Models\Audit;
use App\Models\Organization;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class AuditController extends Controller
{
    public function index(Organization $organization): Response
    {
        return Inertia::render('audits/index', [
            'organization' => $organization,
            'audits' => Audit::query()
                ->forOrganization($organization)
                ->withCount('controls')
                ->orderByDesc('scheduled_at')
                ->get(),
        ]);
    }

    public function create(Organization $organization): Response
    {
        return Inertia::render('audits/create', [
            'organization' => $organization,
        ]);
    }

    public function store(StoreAuditRequest $request, Organization $organization): RedirectResponse
    {
        $organization->audits()->create($request->validated());

        return to_route('organizations.audits.index', $organization);
    }

    public function show(Organization $organization, Audit $audit): Response
    {
        return Inertia::render('audits/show', [
            'organization' => $organization,
            'audit' => $audit->load('controls'),
        ]);
    }

    public function edit(Organization $organization, Audit $audit): Response
    {
        return Inertia::render('audits/edit', [
            'organization' => $organization,
            'audit' => $audit,
        ]);
    }

    public function update(UpdateAuditRequest $request, Organization $organization, Audit $audit): RedirectResponse
    {
        $audit->update($request->validated());

        return to_route('organizations.audits.show', [$organization, $audit]);
    }

    public function destroy(Organization $organization, Audit $audit): RedirectResponse
    {
        $audit->delete();

        return to_route('organizations.audits.index', $organization);
    }
}
