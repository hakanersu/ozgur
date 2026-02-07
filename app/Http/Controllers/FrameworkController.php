<?php

namespace App\Http\Controllers;

use App\Http\Requests\Framework\StoreFrameworkRequest;
use App\Http\Requests\Framework\UpdateFrameworkRequest;
use App\Models\Framework;
use App\Models\Organization;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FrameworkController extends Controller
{
    public function index(Request $request, Organization $organization): Response
    {
        $query = $organization->frameworks()
            ->withCount('controls')
            ->orderBy('name');

        if ($search = $request->query('search')) {
            $query->where('name', 'like', "%{$search}%");
        }

        return Inertia::render('frameworks/index', [
            'organization' => $organization,
            'frameworks' => $query->get(),
            'filters' => [
                'search' => $search ?? '',
            ],
        ]);
    }

    public function create(Organization $organization): Response
    {
        return Inertia::render('frameworks/create', [
            'organization' => $organization,
        ]);
    }

    public function store(StoreFrameworkRequest $request, Organization $organization): RedirectResponse
    {
        $organization->frameworks()->create($request->validated());

        return to_route('organizations.frameworks.index', $organization);
    }

    public function show(Organization $organization, Framework $framework): Response
    {
        return Inertia::render('frameworks/show', [
            'organization' => $organization,
            'framework' => $framework->load(['controls' => fn ($q) => $q->withCount('measures')]),
        ]);
    }

    public function edit(Organization $organization, Framework $framework): Response
    {
        return Inertia::render('frameworks/edit', [
            'organization' => $organization,
            'framework' => $framework,
        ]);
    }

    public function update(UpdateFrameworkRequest $request, Organization $organization, Framework $framework): RedirectResponse
    {
        $framework->update($request->validated());

        return to_route('organizations.frameworks.show', [$organization, $framework]);
    }

    public function destroy(Organization $organization, Framework $framework): RedirectResponse
    {
        $framework->delete();

        return to_route('organizations.frameworks.index', $organization);
    }
}
