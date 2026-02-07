<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\Organization;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ActivityLogController extends Controller
{
    public function index(Request $request, Organization $organization): Response
    {
        $query = ActivityLog::query()
            ->forOrganization($organization)
            ->with('user:id,name')
            ->orderByDesc('created_at');

        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('subject_name', 'like', "%{$search}%")
                    ->orWhere('event', 'like', "%{$search}%")
                    ->orWhere('subject_type', 'like', "%{$search}%");
            });
        }

        return Inertia::render('activity-log/index', [
            'organization' => $organization,
            'logs' => $query->paginate(50)->withQueryString(),
            'filters' => [
                'search' => $search ?? '',
            ],
        ]);
    }
}
