<?php

namespace App\Http\Controllers;

use App\Http\Requests\Framework\StoreFrameworkRequest;
use App\Http\Requests\Framework\UpdateFrameworkRequest;
use App\Models\Control;
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
            'templates' => $this->loadTemplates(),
        ]);
    }

    public function store(StoreFrameworkRequest $request, Organization $organization): RedirectResponse
    {
        $organization->frameworks()->create($request->validated());

        return to_route('organizations.frameworks.index', $organization);
    }

    public function importTemplate(Request $request, Organization $organization): RedirectResponse
    {
        $templateId = $request->input('template_id');
        $templates = $this->loadTemplates(withControls: true);
        $template = collect($templates)->firstWhere('id', $templateId);

        abort_unless($template !== null, 404);

        $framework = $organization->frameworks()->create([
            'name' => $template['name'],
            'version' => $template['id'],
            'status' => 'active',
        ]);

        $now = now()->toDateTimeString();
        $controls = array_map(fn ($c) => [
            'organization_id' => $organization->id,
            'framework_id' => $framework->id,
            'code' => $c['id'],
            'name' => $c['name'],
            'description' => $c['description'] ?? null,
            'status' => 'not_started',
            'created_at' => $now,
            'updated_at' => $now,
        ], $template['controls']);

        foreach (array_chunk($controls, 200) as $chunk) {
            Control::insert($chunk);
        }

        return to_route('organizations.frameworks.show', [$organization, $framework]);
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

    private function loadTemplates(bool $withControls = false): array
    {
        $path = database_path('data/frameworks');
        $templates = [];

        foreach (glob("{$path}/*.json") as $file) {
            $data = json_decode(file_get_contents($file), true);
            $entry = [
                'id' => $data['id'],
                'name' => $data['name'],
                'controls_count' => count($data['controls']),
            ];

            if ($withControls) {
                $entry['controls'] = $data['controls'];
            }

            $templates[] = $entry;
        }

        usort($templates, fn ($a, $b) => strcmp($a['name'], $b['name']));

        return $templates;
    }
}
