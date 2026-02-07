<?php

namespace App\Http\Controllers;

use App\Http\Requests\Document\StoreDocumentVersionRequest;
use App\Models\Document;
use App\Models\DocumentVersion;
use App\Models\Organization;
use Illuminate\Http\RedirectResponse;

class DocumentVersionController extends Controller
{
    public function store(StoreDocumentVersionRequest $request, Organization $organization, Document $document): RedirectResponse
    {
        $nextVersion = $document->versions()->max('version_number') + 1;

        $data = $request->validated();
        $data['organization_id'] = $organization->id;
        $data['version_number'] = $nextVersion;

        $document->versions()->create($data);

        return to_route('organizations.documents.show', [$organization, $document]);
    }

    public function publish(Organization $organization, Document $document, DocumentVersion $version): RedirectResponse
    {
        $version->update([
            'status' => 'published',
            'published_at' => now(),
        ]);

        $document->update(['current_published_version' => $version->version_number]);

        return to_route('organizations.documents.show', [$organization, $document]);
    }

    public function destroy(Organization $organization, Document $document, DocumentVersion $version): RedirectResponse
    {
        $version->delete();

        return to_route('organizations.documents.show', [$organization, $document]);
    }
}
