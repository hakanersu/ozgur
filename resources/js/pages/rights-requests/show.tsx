import { Head, Link, useForm } from '@inertiajs/react';
import { Pencil, Trash2 } from 'lucide-react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Organization } from '@/types';

type RightsRequest = {
    id: number;
    request_type: string;
    request_state: string;
    data_subject: string | null;
    contact: string | null;
    details: string | null;
    deadline: string | null;
    action_taken: string | null;
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

export default function RightsRequestShow({
    organization,
    rightsRequest,
}: {
    organization: Organization;
    rightsRequest: RightsRequest;
}) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Organizations', href: '/organizations' },
        { title: organization.name, href: `/organizations/${organization.id}` },
        { title: 'Rights Requests', href: `/organizations/${organization.id}/rights-requests` },
        { title: rightsRequest.data_subject ?? `Request #${rightsRequest.id}`, href: `/organizations/${organization.id}/rights-requests/${rightsRequest.id}` },
    ];

    const deleteForm = useForm({});

    function handleDelete() {
        if (window.confirm('Are you sure you want to delete this rights request?')) {
            deleteForm.delete(`/organizations/${organization.id}/rights-requests/${rightsRequest.id}`);
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={rightsRequest.data_subject ?? `Rights Request #${rightsRequest.id}`} />

            <div className="mx-auto w-full max-w-4xl space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <Heading
                        title={rightsRequest.data_subject ?? `Rights Request #${rightsRequest.id}`}
                        description="Data subject rights request details"
                    />
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href={`/organizations/${organization.id}/rights-requests/${rightsRequest.id}/edit`}>
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
                                <dt className="text-sm font-medium text-muted-foreground">Request Type</dt>
                                <dd className="mt-1">
                                    <Badge variant="secondary">
                                        {formatLabel(rightsRequest.request_type)}
                                    </Badge>
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">State</dt>
                                <dd className="mt-1">
                                    <Badge variant={stateVariant(rightsRequest.request_state)}>
                                        {formatLabel(rightsRequest.request_state)}
                                    </Badge>
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">Data Subject</dt>
                                <dd className="mt-1 text-sm">{rightsRequest.data_subject || '-'}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">Contact</dt>
                                <dd className="mt-1 text-sm">{rightsRequest.contact || '-'}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">Deadline</dt>
                                <dd className="mt-1 text-sm">{rightsRequest.deadline || '-'}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">Created At</dt>
                                <dd className="mt-1 text-sm">{new Date(rightsRequest.created_at).toLocaleDateString()}</dd>
                            </div>
                            <div className="sm:col-span-3">
                                <dt className="text-sm font-medium text-muted-foreground">Details</dt>
                                <dd className="mt-1 text-sm whitespace-pre-line">{rightsRequest.details || '-'}</dd>
                            </div>
                            <div className="sm:col-span-3">
                                <dt className="text-sm font-medium text-muted-foreground">Action Taken</dt>
                                <dd className="mt-1 text-sm whitespace-pre-line">{rightsRequest.action_taken || '-'}</dd>
                            </div>
                        </dl>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
