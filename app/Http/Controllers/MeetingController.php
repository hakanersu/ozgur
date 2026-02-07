<?php

namespace App\Http\Controllers;

use App\Http\Requests\Meeting\StoreMeetingRequest;
use App\Http\Requests\Meeting\UpdateMeetingRequest;
use App\Models\Meeting;
use App\Models\Organization;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MeetingController extends Controller
{
    public function index(Request $request, Organization $organization): Response
    {
        $query = Meeting::query()
            ->forOrganization($organization)
            ->withCount('attendees')
            ->orderByDesc('date');

        if ($search = $request->query('search')) {
            $query->where('name', 'like', "%{$search}%");
        }

        return Inertia::render('meetings/index', [
            'organization' => $organization,
            'meetings' => $query->get(),
            'filters' => [
                'search' => $search ?? '',
            ],
        ]);
    }

    public function create(Organization $organization): Response
    {
        return Inertia::render('meetings/create', [
            'organization' => $organization,
            'people' => $organization->people()->orderBy('full_name')->get(['id', 'full_name']),
        ]);
    }

    public function store(StoreMeetingRequest $request, Organization $organization): RedirectResponse
    {
        $meeting = $organization->meetings()->create($request->safe()->except('attendee_ids'));

        if ($request->attendee_ids) {
            $meeting->attendees()->sync($request->attendee_ids);
        }

        return to_route('organizations.meetings.index', $organization);
    }

    public function show(Organization $organization, Meeting $meeting): Response
    {
        return Inertia::render('meetings/show', [
            'organization' => $organization,
            'meeting' => $meeting->load('attendees'),
        ]);
    }

    public function edit(Organization $organization, Meeting $meeting): Response
    {
        return Inertia::render('meetings/edit', [
            'organization' => $organization,
            'meeting' => $meeting->load('attendees'),
            'people' => $organization->people()->orderBy('full_name')->get(['id', 'full_name']),
        ]);
    }

    public function update(UpdateMeetingRequest $request, Organization $organization, Meeting $meeting): RedirectResponse
    {
        $meeting->update($request->safe()->except('attendee_ids'));
        $meeting->attendees()->sync($request->input('attendee_ids', []));

        return to_route('organizations.meetings.show', [$organization, $meeting]);
    }

    public function destroy(Organization $organization, Meeting $meeting): RedirectResponse
    {
        $meeting->delete();

        return to_route('organizations.meetings.index', $organization);
    }
}
