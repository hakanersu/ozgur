import { Head, Link, useForm } from '@inertiajs/react';
import { Pencil, Trash2 } from 'lucide-react';
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

type Evidence = {
    id: number;
    name: string;
    type: string;
    created_at: string;
};

type Control = {
    id: number;
    code: string;
    name: string;
    status: string;
};

type Risk = {
    id: number;
    name: string;
    category: string | null;
    treatment: string;
};

type Measure = {
    id: number;
    name: string;
    description: string | null;
    state: string;
    evidence: Evidence[];
    controls: Control[];
    risks: Risk[];
    created_at: string;
    updated_at: string;
};

function stateVariant(state: string) {
    switch (state) {
        case 'implemented':
        case 'active':
        case 'completed':
            return 'default';
        case 'in_progress':
            return 'secondary';
        case 'not_started':
        case 'planned':
        case 'draft':
            return 'outline';
        case 'rejected':
            return 'destructive';
        default:
            return 'outline';
    }
}

export default function MeasureShow({
    organization,
    measure,
}: {
    organization: Organization;
    measure: Measure;
}) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Organizations', href: '/organizations' },
        { title: organization.name, href: `/organizations/${organization.id}` },
        { title: 'Measures', href: `/organizations/${organization.id}/measures` },
        { title: measure.name, href: `/organizations/${organization.id}/measures/${measure.id}` },
    ];

    const deleteForm = useForm({});

    function handleDelete() {
        if (window.confirm('Are you sure you want to delete this measure?')) {
            deleteForm.delete(`/organizations/${organization.id}/measures/${measure.id}`);
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={measure.name} />

            <div className="mx-auto w-full max-w-4xl space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <Heading
                        title={measure.name}
                        description={measure.description ?? undefined}
                    />
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href={`/organizations/${organization.id}/measures/${measure.id}/edit`}>
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
                        <dl className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">State</dt>
                                <dd className="mt-1">
                                    <Badge variant={stateVariant(measure.state)}>
                                        {measure.state}
                                    </Badge>
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">Created</dt>
                                <dd className="mt-1 text-sm">{measure.created_at}</dd>
                            </div>
                        </dl>
                    </CardContent>
                </Card>

                <h3 className="text-lg font-medium">Evidence</h3>
                {measure.evidence.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-8">
                            <p className="text-sm text-muted-foreground">
                                No evidence attached to this measure.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <Card>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Created</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {measure.evidence.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">{item.name}</TableCell>
                                        <TableCell>{item.type}</TableCell>
                                        <TableCell>{item.created_at}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Card>
                )}

                <h3 className="text-lg font-medium">Linked Controls</h3>
                {measure.controls.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-8">
                            <p className="text-sm text-muted-foreground">
                                No controls linked to this measure.
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
                                {measure.controls.map((control) => (
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
                                            <Badge variant={stateVariant(control.status)}>
                                                {control.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Card>
                )}

                <h3 className="text-lg font-medium">Linked Risks</h3>
                {measure.risks.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-8">
                            <p className="text-sm text-muted-foreground">
                                No risks linked to this measure.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <Card>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Treatment</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {measure.risks.map((risk) => (
                                    <TableRow key={risk.id}>
                                        <TableCell>
                                            <Link
                                                href={`/organizations/${organization.id}/risks/${risk.id}`}
                                                className="font-medium hover:underline"
                                            >
                                                {risk.name}
                                            </Link>
                                        </TableCell>
                                        <TableCell>{risk.category ?? '-'}</TableCell>
                                        <TableCell>
                                            <Badge variant={stateVariant(risk.treatment)}>
                                                {risk.treatment}
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
