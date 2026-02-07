import { Head, Link } from '@inertiajs/react';
import { Plus, ShieldCheck } from 'lucide-react';
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

type RightsRequest = {
    id: number;
    request_type: string;
    request_state: string;
    data_subject: string | null;
    contact: string | null;
    deadline: string | null;
    created_at: string;
    updated_at: string;
};

function stateVariant(state: string) {
    switch (state) {
        case 'todo':
            return 'outline' as const;
        case 'in_progress':
            return 'secondary' as const;
        case 'done':
            return 'default' as const;
        default:
            return 'outline' as const;
    }
}

function formatLabel(value: string): string {
    return value.replace(/_/g, ' ');
}

export default function RightsRequestsIndex({
    organization,
    rightsRequests,
}: {
    organization: Organization;
    rightsRequests: RightsRequest[];
}) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Organizations', href: '/organizations' },
        { title: organization.name, href: `/organizations/${organization.id}` },
        { title: 'Rights Requests', href: `/organizations/${organization.id}/rights-requests` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Rights Requests" />

            <div className="mx-auto w-full max-w-4xl space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <Heading
                        title="Rights Requests"
                        description="Track and manage data subject rights requests"
                    />
                    <Button asChild>
                        <Link href={`/organizations/${organization.id}/rights-requests/create`}>
                            <Plus className="mr-2 h-4 w-4" />
                            New Request
                        </Link>
                    </Button>
                </div>

                {rightsRequests.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <ShieldCheck className="mb-4 h-12 w-12 text-muted-foreground" />
                            <h3 className="mb-2 text-lg font-medium">No rights requests yet</h3>
                            <p className="mb-4 text-sm text-muted-foreground">
                                Create your first rights request to start tracking data subject requests.
                            </p>
                            <Button asChild>
                                <Link href={`/organizations/${organization.id}/rights-requests/create`}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create Request
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <Card>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Data Subject</TableHead>
                                    <TableHead>Request Type</TableHead>
                                    <TableHead>State</TableHead>
                                    <TableHead>Deadline</TableHead>
                                    <TableHead>Created At</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {rightsRequests.map((request) => (
                                    <TableRow key={request.id}>
                                        <TableCell>
                                            <Link
                                                href={`/organizations/${organization.id}/rights-requests/${request.id}`}
                                                className="font-medium hover:underline"
                                            >
                                                {request.data_subject ?? '-'}
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">
                                                {formatLabel(request.request_type)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={stateVariant(request.request_state)}>
                                                {formatLabel(request.request_state)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{request.deadline ?? '-'}</TableCell>
                                        <TableCell>{new Date(request.created_at).toLocaleDateString()}</TableCell>
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
