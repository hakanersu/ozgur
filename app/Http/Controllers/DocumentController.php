<?php

namespace App\Http\Controllers;

use App\Http\Requests\Document\StoreDocumentRequest;
use App\Http\Requests\Document\UpdateDocumentRequest;
use App\Models\Document;
use App\Models\Organization;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DocumentController extends Controller
{
    public function index(Request $request, Organization $organization): Response
    {
        $query = Document::query()
            ->forOrganization($organization)
            ->withCount('versions')
            ->orderBy('title');

        if ($search = $request->query('search')) {
            $query->where('title', 'like', "%{$search}%");
        }

        return Inertia::render('documents/index', [
            'organization' => $organization,
            'documents' => $query->get(),
            'filters' => [
                'search' => $search ?? '',
            ],
        ]);
    }

    public function create(Organization $organization): Response
    {
        return Inertia::render('documents/create', [
            'organization' => $organization,
        ]);
    }

    public function store(StoreDocumentRequest $request, Organization $organization): RedirectResponse
    {
        $organization->documents()->create($request->validated());

        return to_route('organizations.documents.index', $organization);
    }

    public function show(Organization $organization, Document $document): Response
    {
        return Inertia::render('documents/show', [
            'organization' => $organization,
            'document' => $document->load(['versions' => fn ($q) => $q->orderByDesc('version_number'), 'controls']),
        ]);
    }

    public function edit(Organization $organization, Document $document): Response
    {
        return Inertia::render('documents/edit', [
            'organization' => $organization,
            'document' => $document,
        ]);
    }

    public function update(UpdateDocumentRequest $request, Organization $organization, Document $document): RedirectResponse
    {
        $document->update($request->validated());

        return to_route('organizations.documents.show', [$organization, $document]);
    }

    public function destroy(Organization $organization, Document $document): RedirectResponse
    {
        $document->delete();

        return to_route('organizations.documents.index', $organization);
    }
}
