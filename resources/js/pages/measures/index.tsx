import { Head, Link } from '@inertiajs/react';
import { ClipboardCheck, Plus } from 'lucide-react';
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
    description: string | null;
    controls_count: number;
    evidence_count: number;
    created_at: string;
    updated_at: string;
};

function stateVariant(state: string) {
    switch (state) {
        case 'implemented':
        case 'active':
            return 'default';
        case 'in_progress':
            return 'secondary';
        case 'not_started':
        case 'planned':
            return 'outline';
        case 'rejected':
            return 'destructive';
        default:
            return 'outline';
    }
}

export default function MeasuresIndex({
    organization,
    measures,
}: {
    organization: Organization;
    measures: Measure[];
}) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Organizations', href: '/organizations' },
        { title: organization.name, href: `/organizations/${organization.id}` },
        { title: 'Measures', href: `/organizations/${organization.id}/measures` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Measures" />

            <div className="mx-auto w-full max-w-4xl space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <Heading
                        title="Measures"
                        description="Track compliance measures and their evidence"
                    />
                    <Button asChild>
                        <Link href={`/organizations/${organization.id}/measures/create`}>
                            <Plus className="mr-2 h-4 w-4" />
                            New Measure
                        </Link>
                    </Button>
                </div>

                {measures.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <ClipboardCheck className="mb-4 h-12 w-12 text-muted-foreground" />
                            <h3 className="mb-2 text-lg font-medium">No measures yet</h3>
                            <p className="mb-4 text-sm text-muted-foreground">
                                Create your first measure to track compliance actions.
                            </p>
                            <Button asChild>
                                <Link href={`/organizations/${organization.id}/measures/create`}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create Measure
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
                                    <TableHead className="text-right">Controls</TableHead>
                                    <TableHead className="text-right">Evidence</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {measures.map((measure) => (
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
                                        <TableCell className="text-right">
                                            {measure.controls_count}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {measure.evidence_count}
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
