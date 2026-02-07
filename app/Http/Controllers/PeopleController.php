<?php

namespace App\Http\Controllers;

use App\Http\Requests\People\StorePeopleRequest;
use App\Http\Requests\People\UpdatePeopleRequest;
use App\Models\Organization;
use App\Models\People;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PeopleController extends Controller
{
    public function index(Organization $organization): Response
    {
        return Inertia::render('people/index', [
            'organization' => $organization,
            'people' => People::query()
                ->forOrganization($organization)
                ->orderBy('full_name')
                ->get(),
        ]);
    }

    public function create(Organization $organization): Response
    {
        return Inertia::render('people/create', [
            'organization' => $organization,
        ]);
    }

    public function store(StorePeopleRequest $request, Organization $organization): RedirectResponse
    {
        $organization->people()->create($request->validated());

        return to_route('organizations.people.index', $organization);
    }

    public function show(Organization $organization, People $person): Response
    {
        return Inertia::render('people/show', [
            'organization' => $organization,
            'person' => $person->load(['tasks', 'meetings']),
        ]);
    }

    public function edit(Organization $organization, People $person): Response
    {
        return Inertia::render('people/edit', [
            'organization' => $organization,
            'person' => $person,
        ]);
    }

    public function update(UpdatePeopleRequest $request, Organization $organization, People $person): RedirectResponse
    {
        $person->update($request->validated());

        return to_route('organizations.people.show', [$organization, $person]);
    }

    public function destroy(Organization $organization, People $person): RedirectResponse
    {
        $person->delete();

        return to_route('organizations.people.index', $organization);
    }
}
