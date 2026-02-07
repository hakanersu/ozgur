<?php

namespace App\Http\Controllers;

use App\Http\Requests\Snapshot\StoreSnapshotRequest;
use App\Models\Organization;
use App\Models\Snapshot;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SnapshotController extends Controller
{
    public function index(Request $request, Organization $organization): Response
    {
        $query = Snapshot::query()
            ->forOrganization($organization)
            ->orderByDesc('created_at');

        if ($search = $request->query('search')) {
            $query->where('name', 'like', "%{$search}%");
        }

        return Inertia::render('snapshots/index', [
            'organization' => $organization,
            'snapshots' => $query->get(),
            'filters' => [
                'search' => $search ?? '',
            ],
        ]);
    }

    public function create(Organization $organization): Response
    {
        return Inertia::render('snapshots/create', [
            'organization' => $organization,
        ]);
    }

    public function store(StoreSnapshotRequest $request, Organization $organization): RedirectResponse
    {
        $organization->snapshots()->create($request->validated());

        return to_route('organizations.snapshots.index', $organization);
    }

    public function show(Organization $organization, Snapshot $snapshot): Response
    {
        return Inertia::render('snapshots/show', [
            'organization' => $organization,
            'snapshot' => $snapshot,
        ]);
    }

    public function destroy(Organization $organization, Snapshot $snapshot): RedirectResponse
    {
        $snapshot->delete();

        return to_route('organizations.snapshots.index', $organization);
    }
}
