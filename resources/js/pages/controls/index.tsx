import { Head, Link } from '@inertiajs/react';
import { ListChecks, Plus } from 'lucide-react';
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
    category: string | null;
    framework: { id: number; name: string } | null;
    measures_count: number;
    created_at: string;
    updated_at: string;
};

function statusVariant(status: string) {
    switch (status) {
        case 'implemented':
        case 'active':
            return 'default';
        case 'in_progress':
            return 'secondary';
        case 'not_started':
        case 'draft':
            return 'outline';
        case 'rejected':
            return 'destructive';
        default:
            return 'outline';
    }
}

export default function ControlsIndex({
    organization,
    controls,
}: {
    organization: Organization;
    controls: Control[];
}) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Organizations', href: '/organizations' },
        { title: organization.name, href: `/organizations/${organization.id}` },
        { title: 'Controls', href: `/organizations/${organization.id}/controls` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Controls" />

            <div className="mx-auto w-full max-w-4xl space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <Heading
                        title="Controls"
                        description="Manage compliance controls across frameworks"
                    />
                    <Button asChild>
                        <Link href={`/organizations/${organization.id}/controls/create`}>
                            <Plus className="mr-2 h-4 w-4" />
                            New Control
                        </Link>
                    </Button>
                </div>

                {controls.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <ListChecks className="mb-4 h-12 w-12 text-muted-foreground" />
                            <h3 className="mb-2 text-lg font-medium">No controls yet</h3>
                            <p className="mb-4 text-sm text-muted-foreground">
                                Create your first control to track compliance requirements.
                            </p>
                            <Button asChild>
                                <Link href={`/organizations/${organization.id}/controls/create`}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create Control
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <Card>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Code</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Framework</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Measures</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {controls.map((control) => (
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
                                            {control.framework?.name ?? '-'}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={statusVariant(control.status)}>
                                                {control.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {control.measures_count}
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
