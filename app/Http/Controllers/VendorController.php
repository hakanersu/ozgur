<?php

namespace App\Http\Controllers;

use App\Http\Requests\Vendor\StoreVendorRequest;
use App\Http\Requests\Vendor\UpdateVendorRequest;
use App\Models\Organization;
use App\Models\Vendor;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class VendorController extends Controller
{
    public function index(Request $request, Organization $organization): Response
    {
        $query = Vendor::query()
            ->forOrganization($organization)
            ->withCount(['contacts', 'riskAssessments'])
            ->orderBy('name');

        if ($search = $request->query('search')) {
            $query->where('name', 'like', "%{$search}%");
        }

        return Inertia::render('vendors/index', [
            'organization' => $organization,
            'vendors' => $query->get(),
            'filters' => [
                'search' => $search ?? '',
            ],
        ]);
    }

    public function create(Organization $organization): Response
    {
        return Inertia::render('vendors/create', [
            'organization' => $organization,
        ]);
    }

    public function store(StoreVendorRequest $request, Organization $organization): RedirectResponse
    {
        $organization->vendors()->create($request->validated());

        return to_route('organizations.vendors.index', $organization);
    }

    public function show(Organization $organization, Vendor $vendor): Response
    {
        return Inertia::render('vendors/show', [
            'organization' => $organization,
            'vendor' => $vendor->load(['contacts', 'riskAssessments']),
        ]);
    }

    public function edit(Organization $organization, Vendor $vendor): Response
    {
        return Inertia::render('vendors/edit', [
            'organization' => $organization,
            'vendor' => $vendor,
        ]);
    }

    public function update(UpdateVendorRequest $request, Organization $organization, Vendor $vendor): RedirectResponse
    {
        $vendor->update($request->validated());

        return to_route('organizations.vendors.show', [$organization, $vendor]);
    }

    public function destroy(Organization $organization, Vendor $vendor): RedirectResponse
    {
        $vendor->delete();

        return to_route('organizations.vendors.index', $organization);
    }
}
