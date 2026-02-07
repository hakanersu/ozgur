<?php

namespace App\Http\Controllers;

use App\Http\Requests\Measure\StoreMeasureRequest;
use App\Http\Requests\Measure\UpdateMeasureRequest;
use App\Models\Measure;
use App\Models\Organization;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MeasureController extends Controller
{
    public function index(Request $request, Organization $organization): Response
    {
        $query = Measure::query()
            ->forOrganization($organization)
            ->withCount(['controls', 'evidence'])
            ->orderBy('name');

        if ($search = $request->query('search')) {
            $query->where('name', 'like', "%{$search}%");
        }

        return Inertia::render('measures/index', [
            'organization' => $organization,
            'measures' => $query->get(),
            'filters' => [
                'search' => $search ?? '',
            ],
        ]);
    }

    public function create(Organization $organization): Response
    {
        return Inertia::render('measures/create', [
            'organization' => $organization,
        ]);
    }

    public function store(StoreMeasureRequest $request, Organization $organization): RedirectResponse
    {
        $organization->measures()->create($request->validated());

        return to_route('organizations.measures.index', $organization);
    }

    public function show(Organization $organization, Measure $measure): Response
    {
        return Inertia::render('measures/show', [
            'organization' => $organization,
            'measure' => $measure->load(['controls', 'evidence', 'risks']),
        ]);
    }

    public function edit(Organization $organization, Measure $measure): Response
    {
        return Inertia::render('measures/edit', [
            'organization' => $organization,
            'measure' => $measure,
        ]);
    }

    public function update(UpdateMeasureRequest $request, Organization $organization, Measure $measure): RedirectResponse
    {
        $measure->update($request->validated());

        return to_route('organizations.measures.show', [$organization, $measure]);
    }

    public function destroy(Organization $organization, Measure $measure): RedirectResponse
    {
        $measure->delete();

        return to_route('organizations.measures.index', $organization);
    }
}
