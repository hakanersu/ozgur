import { Head, Link } from '@inertiajs/react';
import { ClipboardList, Plus } from 'lucide-react';
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

type Audit = {
    id: number;
    name: string;
    state: string;
    description: string | null;
    scheduled_at: string | null;
    completed_at: string | null;
    controls_count: number;
    created_at: string;
    updated_at: string;
};

function stateVariant(state: string) {
    switch (state) {
        case 'completed':
            return 'default';
        case 'in_progress':
            return 'secondary';
        case 'planned':
        case 'draft':
            return 'outline';
        case 'cancelled':
            return 'destructive';
        default:
            return 'outline';
    }
}

export default function AuditsIndex({
    organization,
    audits,
}: {
    organization: Organization;
    audits: Audit[];
}) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Organizations', href: '/organizations' },
        { title: organization.name, href: `/organizations/${organization.id}` },
        { title: 'Audits', href: `/organizations/${organization.id}/audits` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Audits" />

            <div className="mx-auto w-full max-w-4xl space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <Heading
                        title="Audits"
                        description="Schedule and track compliance audits"
                    />
                    <Button asChild>
                        <Link href={`/organizations/${organization.id}/audits/create`}>
                            <Plus className="mr-2 h-4 w-4" />
                            New Audit
                        </Link>
                    </Button>
                </div>

                {audits.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <ClipboardList className="mb-4 h-12 w-12 text-muted-foreground" />
                            <h3 className="mb-2 text-lg font-medium">No audits yet</h3>
                            <p className="mb-4 text-sm text-muted-foreground">
                                Create your first audit to start tracking compliance reviews.
                            </p>
                            <Button asChild>
                                <Link href={`/organizations/${organization.id}/audits/create`}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create Audit
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
                                    <TableHead>Scheduled</TableHead>
                                    <TableHead className="text-right">Controls</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {audits.map((audit) => (
                                    <TableRow key={audit.id}>
                                        <TableCell>
                                            <Link
                                                href={`/organizations/${organization.id}/audits/${audit.id}`}
                                                className="font-medium hover:underline"
                                            >
                                                {audit.name}
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={stateVariant(audit.state)}>
                                                {audit.state}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {audit.scheduled_at ?? '-'}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {audit.controls_count}
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
