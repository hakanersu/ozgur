<?php

namespace App\Http\Controllers;

use App\Models\Framework;
use App\Models\Organization;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

class FrameworkExportController extends Controller
{
    public function export(Request $request, Organization $organization, Framework $framework): StreamedResponse
    {
        $framework->load('controls');

        $filename = str($framework->name)->slug().'-export.csv';

        return response()->streamDownload(function () use ($framework) {
            $handle = fopen('php://output', 'w');

            fputcsv($handle, ['Control Code', 'Control Name', 'Category', 'Status', 'Description']);

            foreach ($framework->controls as $control) {
                fputcsv($handle, [
                    $control->code,
                    $control->name,
                    $control->category,
                    $control->status?->value,
                    $control->description,
                ]);
            }

            fclose($handle);
        }, $filename, [
            'Content-Type' => 'text/csv',
        ]);
    }

    public function importForm(Organization $organization): \Inertia\Response
    {
        return \Inertia\Inertia::render('frameworks/import', [
            'organization' => $organization,
        ]);
    }

    public function import(Request $request, Organization $organization): \Illuminate\Http\RedirectResponse
    {
        $request->validate([
            'file' => ['required', 'file', 'mimes:csv,txt'],
            'name' => ['required', 'string', 'max:255'],
            'version' => ['nullable', 'string', 'max:255'],
        ]);

        $framework = $organization->frameworks()->create([
            'name' => $request->input('name'),
            'version' => $request->input('version', '1.0'),
            'status' => 'draft',
        ]);

        $handle = fopen($request->file('file')->getRealPath(), 'r');
        $header = fgetcsv($handle); // skip header row

        while (($row = fgetcsv($handle)) !== false) {
            if (count($row) < 2) {
                continue;
            }

            $framework->controls()->create([
                'organization_id' => $organization->id,
                'code' => $row[0] ?? '',
                'name' => $row[1] ?? '',
                'category' => $row[2] ?? null,
                'status' => 'not_implemented',
                'description' => $row[4] ?? null,
            ]);
        }

        fclose($handle);

        return to_route('organizations.frameworks.show', [$organization, $framework]);
    }
}
