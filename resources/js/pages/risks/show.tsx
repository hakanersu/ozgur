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

type Measure = {
    id: number;
    name: string;
    state: string;
};

type Risk = {
    id: number;
    name: string;
    description: string | null;
    category: string | null;
    probability: number;
    impact: number;
    treatment: string;
    measures: Measure[];
    created_at: string;
    updated_at: string;
};

function treatmentVariant(treatment: string) {
    switch (treatment) {
        case 'mitigate':
        case 'accept':
            return 'default';
        case 'transfer':
            return 'secondary';
        case 'avoid':
            return 'outline';
        default:
            return 'outline';
    }
}

function stateVariant(state: string) {
    switch (state) {
        case 'implemented':
        case 'active':
            return 'default';
        case 'in_progress':
            return 'secondary';
        case 'not_started':
            return 'outline';
        default:
            return 'outline';
    }
}

export default function RiskShow({
    organization,
    risk,
}: {
    organization: Organization;
    risk: Risk;
}) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Organizations', href: '/organizations' },
        { title: organization.name, href: `/organizations/${organization.id}` },
        { title: 'Risks', href: `/organizations/${organization.id}/risks` },
        { title: risk.name, href: `/organizations/${organization.id}/risks/${risk.id}` },
    ];

    const deleteForm = useForm({});

    function handleDelete() {
        if (window.confirm('Are you sure you want to delete this risk?')) {
            deleteForm.delete(`/organizations/${organization.id}/risks/${risk.id}`);
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={risk.name} />

            <div className="mx-auto w-full max-w-4xl space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <Heading
                        title={risk.name}
                        description={risk.description ?? undefined}
                    />
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href={`/organizations/${organization.id}/risks/${risk.id}/edit`}>
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
                                <dt className="text-sm font-medium text-muted-foreground">Category</dt>
                                <dd className="mt-1 text-sm">{risk.category || '-'}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">Probability</dt>
                                <dd className="mt-1 text-sm">{risk.probability} / 5</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">Impact</dt>
                                <dd className="mt-1 text-sm">{risk.impact} / 5</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">Treatment</dt>
                                <dd className="mt-1">
                                    <Badge variant={treatmentVariant(risk.treatment)}>
                                        {risk.treatment}
                                    </Badge>
                                </dd>
                            </div>
                        </dl>
                    </CardContent>
                </Card>

                <h3 className="text-lg font-medium">Linked Measures</h3>
                {risk.measures.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-8">
                            <p className="text-sm text-muted-foreground">
                                No measures linked to this risk.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <Card>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>State</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {risk.measures.map((measure) => (
                                    <TableRow key={measure.id}>
                                        <TableCell>
                                            <Link
                                                href={`/organizations/${organization.id}/measures/${measure.id}`}
                                                className="font-medium hover:underline"
                                            >
                                                {measure.name}
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={stateVariant(measure.state)}>
                                                {measure.state}
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
