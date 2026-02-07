import { Head, Link } from '@inertiajs/react';
import { Plus, Shield } from 'lucide-react';
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

type Framework = {
    id: number;
    name: string;
    version: string;
    status: string;
    description: string | null;
    controls_count: number;
    created_at: string;
    updated_at: string;
};

function statusVariant(status: string) {
    switch (status) {
        case 'active':
            return 'default';
        case 'draft':
            return 'outline';
        case 'archived':
            return 'secondary';
        default:
            return 'outline';
    }
}

export default function FrameworksIndex({
    organization,
    frameworks,
}: {
    organization: Organization;
    frameworks: Framework[];
}) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Organizations', href: '/organizations' },
        { title: organization.name, href: `/organizations/${organization.id}` },
        { title: 'Frameworks', href: `/organizations/${organization.id}/frameworks` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Frameworks" />

            <div className="mx-auto w-full max-w-4xl space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <Heading
                        title="Frameworks"
                        description="Manage compliance frameworks and their controls"
                    />
                    <Button asChild>
                        <Link href={`/organizations/${organization.id}/frameworks/create`}>
                            <Plus className="mr-2 h-4 w-4" />
                            New Framework
                        </Link>
                    </Button>
                </div>

                {frameworks.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <Shield className="mb-4 h-12 w-12 text-muted-foreground" />
                            <h3 className="mb-2 text-lg font-medium">No frameworks yet</h3>
                            <p className="mb-4 text-sm text-muted-foreground">
                                Create your first framework to start organizing compliance controls.
                            </p>
                            <Button asChild>
                                <Link href={`/organizations/${organization.id}/frameworks/create`}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create Framework
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
                                    <TableHead>Version</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Controls</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {frameworks.map((framework) => (
                                    <TableRow key={framework.id}>
                                        <TableCell>
                                            <Link
                                                href={`/organizations/${organization.id}/frameworks/${framework.id}`}
                                                className="font-medium hover:underline"
                                            >
                                                {framework.name}
                                            </Link>
                                        </TableCell>
                                        <TableCell>{framework.version}</TableCell>
                                        <TableCell>
                                            <Badge variant={statusVariant(framework.status)}>
                                                {framework.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {framework.controls_count}
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
