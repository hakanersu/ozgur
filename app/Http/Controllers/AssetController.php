<?php

namespace App\Http\Controllers;

use App\Http\Requests\Asset\StoreAssetRequest;
use App\Http\Requests\Asset\UpdateAssetRequest;
use App\Models\Asset;
use App\Models\Organization;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AssetController extends Controller
{
    public function index(Request $request, Organization $organization): Response
    {
        $query = Asset::query()
            ->forOrganization($organization)
            ->with('owner:id,full_name')
            ->withCount('vendors')
            ->orderBy('name');

        if ($search = $request->query('search')) {
            $query->where('name', 'like', "%{$search}%");
        }

        return Inertia::render('assets/index', [
            'organization' => $organization,
            'assets' => $query->get(),
            'filters' => [
                'search' => $search ?? '',
            ],
        ]);
    }

    public function create(Organization $organization): Response
    {
        return Inertia::render('assets/create', [
            'organization' => $organization,
            'people' => $organization->people()->orderBy('full_name')->get(['id', 'full_name']),
            'vendors' => $organization->vendors()->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(StoreAssetRequest $request, Organization $organization): RedirectResponse
    {
        $asset = $organization->assets()->create($request->safe()->except('vendor_ids'));

        if ($request->validated('vendor_ids')) {
            $asset->vendors()->sync($request->validated('vendor_ids'));
        }

        return to_route('organizations.assets.index', $organization);
    }

    public function show(Organization $organization, Asset $asset): Response
    {
        return Inertia::render('assets/show', [
            'organization' => $organization,
            'asset' => $asset->load(['owner:id,full_name', 'vendors:id,name']),
        ]);
    }

    public function edit(Organization $organization, Asset $asset): Response
    {
        return Inertia::render('assets/edit', [
            'organization' => $organization,
            'asset' => $asset->load('vendors:id'),
            'people' => $organization->people()->orderBy('full_name')->get(['id', 'full_name']),
            'vendors' => $organization->vendors()->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function update(UpdateAssetRequest $request, Organization $organization, Asset $asset): RedirectResponse
    {
        $asset->update($request->safe()->except('vendor_ids'));

        $asset->vendors()->sync($request->validated('vendor_ids') ?? []);

        return to_route('organizations.assets.show', [$organization, $asset]);
    }

    public function destroy(Organization $organization, Asset $asset): RedirectResponse
    {
        $asset->delete();

        return to_route('organizations.assets.index', $organization);
    }
}
