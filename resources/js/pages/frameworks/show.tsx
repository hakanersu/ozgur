import { Head, Link, useForm } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import Heading from '@/components/heading';
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

type Control = {
    id: number;
    code: string;
    name: string;
    status: string;
};

type Framework = {
    id: number;
    name: string;
    version: string;
    status: string;
    description: string | null;
    controls: Control[];
    created_at: string;
    updated_at: string;
};

function statusVariant(status: string) {
    switch (status) {
        case 'active':
        case 'implemented':
            return 'default';
        case 'draft':
        case 'not_started':
            return 'outline';
        case 'in_progress':
            return 'secondary';
        case 'archived':
            return 'secondary';
        default:
            return 'outline';
    }
}

export default function FrameworkShow({
    organization,
    framework,
}: {
    organization: Organization;
    framework: Framework;
}) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Organizations', href: '/organizations' },
        { title: organization.name, href: `/organizations/${organization.id}` },
        { title: 'Frameworks', href: `/organizations/${organization.id}/frameworks` },
        { title: framework.name, href: `/organizations/${organization.id}/frameworks/${framework.id}` },
    ];

    const deleteForm = useForm({});

    function handleDelete() {
        if (window.confirm('Are you sure you want to delete this framework?')) {
            deleteForm.delete(`/organizations/${organization.id}/frameworks/${framework.id}`);
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={framework.name} />

            <div className="mx-auto w-full max-w-4xl space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <Heading
                        title={framework.name}
                        description={framework.description ?? undefined}
                    />
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href={`/organizations/${organization.id}/frameworks/${framework.id}/edit`}>
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
                        <dl className="grid gap-4 sm:grid-cols-3">
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">Version</dt>
                                <dd className="mt-1 text-sm">{framework.version || '-'}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">Status</dt>
                                <dd className="mt-1">
                                    <Badge variant={statusVariant(framework.status)}>
                                        {framework.status}
                                    </Badge>
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">Controls</dt>
                                <dd className="mt-1 text-sm">{framework.controls.length}</dd>
                            </div>
                        </dl>
                    </CardContent>
                </Card>

                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Controls</h3>
                    <Button size="sm" asChild>
                        <Link href={`/organizations/${organization.id}/controls/create`}>
                            <Plus className="mr-2 h-4 w-4" />
                            New Control
                        </Link>
                    </Button>
                </div>

                {framework.controls.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <p className="text-sm text-muted-foreground">
                                No controls linked to this framework yet.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <Card>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Code</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {framework.controls.map((control) => (
                                    <TableRow key={control.id}>
                                        <TableCell className="font-mono text-sm">
                                            {control.code}
                                        </TableCell>
                                        <TableCell>
                                            <Link
                                                href={`/organizations/${organization.id}/controls/${control.id}`}
                                                className="font-medium hover:underline"
                                            >
                                                {control.name}
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={statusVariant(control.status)}>
                                                {control.status}
                                            </Badge>
                                        </TableCell>
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
