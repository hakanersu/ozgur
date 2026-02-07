import { Head, Link, useForm } from '@inertiajs/react';
import { Pencil, Trash2 } from 'lucide-react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Organization } from '@/types';

type Task = {
    id: number;
    name: string;
    description: string | null;
    state: string;
    deadline: string | null;
    assigned_to: { id: number; full_name: string } | null;
    measure: { id: number; name: string } | null;
    created_at: string;
    updated_at: string;
};

function stateVariant(state: string) {
    switch (state) {
        case 'done':
            return 'default';
        case 'todo':
            return 'outline';
        default:
            return 'outline';
    }
}

export default function TaskShow({
    organization,
    task,
}: {
    organization: Organization;
    task: Task;
}) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Organizations', href: '/organizations' },
        { title: organization.name, href: `/organizations/${organization.id}` },
        { title: 'Tasks', href: `/organizations/${organization.id}/tasks` },
        { title: task.name, href: `/organizations/${organization.id}/tasks/${task.id}` },
    ];

    const deleteForm = useForm({});

    function handleDelete() {
        if (window.confirm('Are you sure you want to delete this task?')) {
            deleteForm.delete(`/organizations/${organization.id}/tasks/${task.id}`);
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={task.name} />

            <div className="mx-auto w-full max-w-4xl space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <Heading
                        title={task.name}
                        description={task.description ?? undefined}
                    />
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href={`/organizations/${organization.id}/tasks/${task.id}/edit`}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                            </Link>
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={deleteForm.processing}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                        </Button>
                    </div>
                </div>

                <Card>
                    <CardContent className="pt-6">
                        <dl className="grid gap-4 sm:grid-cols-4">
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">State</dt>
                                <dd className="mt-1">
                                    <Badge variant={stateVariant(task.state)}>
                                        {task.state}
                                    </Badge>
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">Deadline</dt>
                                <dd className="mt-1 text-sm">{task.deadline || '-'}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">Assigned To</dt>
                                <dd className="mt-1 text-sm">
                                    {task.assigned_to ? (
                                        <Link
                                            href={`/organizations/${organization.id}/people/${task.assigned_to.id}`}
                                            className="hover:underline"
                                        >
                                            {task.assigned_to.full_name}
                                        </Link>
                                    ) : (
                                        '-'
                                    )}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">Linked Measure</dt>
                                <dd className="mt-1 text-sm">
                                    {task.measure ? (
                                        <Link
                                            href={`/organizations/${organization.id}/measures/${task.measure.id}`}
                                            className="hover:underline"
                                        >
                                            {task.measure.name}
                                        </Link>
                                    ) : (
                                        '-'
                                    )}
                                </dd>
                            </div>
                        </dl>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
