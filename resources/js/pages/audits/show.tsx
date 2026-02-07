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
import { useTrans } from '@/hooks/use-trans';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Organization } from '@/types';

type Control = {
    id: number;
    code: string;
    name: string;
    status: string;
};

type Audit = {
    id: number;
    name: string;
    description: string | null;
    state: string;
    scheduled_at: string | null;
    completed_at: string | null;
    controls: Control[];
    created_at: string;
    updated_at: string;
};

function stateVariant(state: string) {
    switch (state) {
        case 'completed':
        case 'implemented':
        case 'active':
            return 'default';
        case 'in_progress':
            return 'secondary';
        case 'planned':
        case 'draft':
        case 'not_started':
            return 'outline';
        case 'cancelled':
        case 'rejected':
            return 'destructive';
        default:
            return 'outline';
    }
}

export default function AuditShow({
    organization,
    audit,
}: {
    organization: Organization;
    audit: Audit;
}) {
    const { t } = useTrans();

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('Organizations'), href: '/organizations' },
        { title: organization.name, href: `/organizations/${organization.id}` },
        { title: t('Audits'), href: `/organizations/${organization.id}/audits` },
        { title: audit.name, href: `/organizations/${organization.id}/audits/${audit.id}` },
    ];

    const deleteForm = useForm({});

    function handleDelete() {
        if (window.confirm(t('Are you sure you want to delete this audit?'))) {
            deleteForm.delete(`/organizations/${organization.id}/audits/${audit.id}`);
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={audit.name} />

            <div className="mx-auto w-full max-w-4xl space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <Heading
                        title={audit.name}
                        description={audit.description ?? undefined}
                    />
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href={`/organizations/${organization.id}/audits/${audit.id}/edit`}>
                                <Pencil className="mr-2 h-4 w-4" />
                                {t('Edit')}
                            </Link>
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={deleteForm.processing}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            {t('Delete')}
                        </Button>
                    </div>
                </div>

                <Card>
                    <CardContent className="pt-6">
                        <dl className="grid gap-4 sm:grid-cols-4">
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">{t('State')}</dt>
                                <dd className="mt-1">
                                    <Badge variant={stateVariant(audit.state)}>
                                        {audit.state}
                                    </Badge>
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">{t('Scheduled')}</dt>
                                <dd className="mt-1 text-sm">{audit.scheduled_at ?? '-'}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">{t('Completed')}</dt>
                                <dd className="mt-1 text-sm">{audit.completed_at ?? '-'}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">{t('Controls')}</dt>
                                <dd className="mt-1 text-sm">{audit.controls.length}</dd>
                            </div>
                        </dl>
                    </CardContent>
                </Card>

                <h3 className="text-lg font-medium">{t('Linked Controls')}</h3>
                {audit.controls.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-8">
                            <p className="text-sm text-muted-foreground">
                                {t('No controls linked to this audit.')}
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <Card>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>{t('Code')}</TableHead>
                                    <TableHead>{t('Name')}</TableHead>
                                    <TableHead>{t('Status')}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {audit.controls.map((control) => (
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
            </div>
        </AppLayout>
    );
}
