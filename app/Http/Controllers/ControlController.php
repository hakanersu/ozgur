<?php

namespace App\Http\Controllers;

use App\Http\Requests\Control\StoreControlRequest;
use App\Http\Requests\Control\UpdateControlRequest;
use App\Models\Control;
use App\Models\Organization;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ControlController extends Controller
{
    public function index(Request $request, Organization $organization): Response
    {
        $query = Control::query()
            ->forOrganization($organization)
            ->with('framework:id,name')
            ->withCount('measures')
            ->orderBy('code');

        if ($search = $request->query('search')) {
            $query->where('name', 'like', "%{$search}%");
        }

        return Inertia::render('controls/index', [
            'organization' => $organization,
            'controls' => $query->get(),
            'filters' => [
                'search' => $search ?? '',
            ],
        ]);
    }

    public function create(Organization $organization): Response
    {
        return Inertia::render('controls/create', [
            'organization' => $organization,
            'frameworks' => $organization->frameworks()->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(StoreControlRequest $request, Organization $organization): RedirectResponse
    {
        $organization->controls()->create($request->validated());

        return to_route('organizations.controls.index', $organization);
    }

    public function show(Organization $organization, Control $control): Response
    {
        return Inertia::render('controls/show', [
            'organization' => $organization,
            'control' => $control->load(['framework:id,name', 'measures', 'audits']),
        ]);
    }

    public function edit(Organization $organization, Control $control): Response
    {
        return Inertia::render('controls/edit', [
            'organization' => $organization,
            'control' => $control,
            'frameworks' => $organization->frameworks()->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function update(UpdateControlRequest $request, Organization $organization, Control $control): RedirectResponse
    {
        $control->update($request->validated());

        return to_route('organizations.controls.show', [$organization, $control]);
    }

    public function destroy(Organization $organization, Control $control): RedirectResponse
    {
        $control->delete();

        return to_route('organizations.controls.index', $organization);
    }
}
