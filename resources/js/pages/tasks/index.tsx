import { Head, Link } from '@inertiajs/react';
import { CheckSquare, Plus } from 'lucide-react';
import Heading from '@/components/heading';
import SearchInput from '@/components/search-input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Organization } from '@/types';

type Task = {
    id: number;
    name: string;
    state: string;
    deadline: string | null;
    assigned_to: { id: number; full_name: string } | null;
    created_at: string;
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

export default function TasksIndex({
    organization,
    tasks,
    filters,
}: {
    organization: Organization;
    tasks: Task[];
    filters: { search: string };
}) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Organizations', href: '/organizations' },
        { title: organization.name, href: `/organizations/${organization.id}` },
        { title: 'Tasks', href: `/organizations/${organization.id}/tasks` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tasks" />

            <div className="mx-auto w-full max-w-4xl space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <Heading
                        title="Tasks"
                        description="Track and manage organizational tasks"
                    />
                    <Button asChild>
                        <Link href={`/organizations/${organization.id}/tasks/create`}>
                            <Plus className="mr-2 h-4 w-4" />
                            New Task
                        </Link>
                    </Button>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex-1">
                        <SearchInput
                            value={filters.search}
                            placeholder="Search tasks..."
                        />
                    </div>
                </div>

                {tasks.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <CheckSquare className="mb-4 h-12 w-12 text-muted-foreground" />
                            <h3 className="mb-2 text-lg font-medium">No tasks yet</h3>
                            <p className="mb-4 text-sm text-muted-foreground">
                                Create your first task to start tracking work items.
                            </p>
                            <Button asChild>
                                <Link href={`/organizations/${organization.id}/tasks/create`}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create Task
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <Card>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>State</TableHead>
                                    <TableHead>Assigned To</TableHead>
                                    <TableHead>Deadline</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {tasks.map((task) => (
                                    <TableRow key={task.id}>
                                        <TableCell>
                                            <Link
                                                href={`/organizations/${organization.id}/tasks/${task.id}`}
                                                className="font-medium hover:underline"
                                            >
                                                {task.name}
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={stateVariant(task.state)}>
                                                {task.state}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
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
                                        </TableCell>
                                        <TableCell>{task.deadline ?? '-'}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
