<?php

namespace App\Http\Controllers;

use App\Http\Requests\Vendor\StoreVendorContactRequest;
use App\Models\Organization;
use App\Models\Vendor;
use App\Models\VendorContact;
use Illuminate\Http\RedirectResponse;

class VendorContactController extends Controller
{
    public function store(StoreVendorContactRequest $request, Organization $organization, Vendor $vendor): RedirectResponse
    {
        $data = $request->validated();
        $data['organization_id'] = $organization->id;

        $vendor->contacts()->create($data);

        return to_route('organizations.vendors.show', [$organization, $vendor]);
    }

    public function destroy(Organization $organization, Vendor $vendor, VendorContact $contact): RedirectResponse
    {
        $contact->delete();

        return to_route('organizations.vendors.show', [$organization, $vendor]);
    }
}
