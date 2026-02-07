<?php

namespace App\Http\Controllers;

use App\Http\Requests\Task\StoreTaskRequest;
use App\Http\Requests\Task\UpdateTaskRequest;
use App\Models\Organization;
use App\Models\Task;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class TaskController extends Controller
{
    public function index(Organization $organization): Response
    {
        return Inertia::render('tasks/index', [
            'organization' => $organization,
            'tasks' => Task::query()
                ->forOrganization($organization)
                ->with('assignedTo:id,full_name')
                ->orderByDesc('created_at')
                ->get(),
        ]);
    }

    public function create(Organization $organization): Response
    {
        return Inertia::render('tasks/create', [
            'organization' => $organization,
            'people' => $organization->people()->orderBy('full_name')->get(['id', 'full_name']),
        ]);
    }

    public function store(StoreTaskRequest $request, Organization $organization): RedirectResponse
    {
        $organization->tasks()->create($request->validated());

        return to_route('organizations.tasks.index', $organization);
    }

    public function show(Organization $organization, Task $task): Response
    {
        return Inertia::render('tasks/show', [
            'organization' => $organization,
            'task' => $task->load(['assignedTo', 'measure']),
        ]);
    }

    public function edit(Organization $organization, Task $task): Response
    {
        return Inertia::render('tasks/edit', [
            'organization' => $organization,
            'task' => $task,
            'people' => $organization->people()->orderBy('full_name')->get(['id', 'full_name']),
        ]);
    }

    public function update(UpdateTaskRequest $request, Organization $organization, Task $task): RedirectResponse
    {
        $task->update($request->validated());

        return to_route('organizations.tasks.show', [$organization, $task]);
    }

    public function destroy(Organization $organization, Task $task): RedirectResponse
    {
        $task->delete();

        return to_route('organizations.tasks.index', $organization);
    }
}
