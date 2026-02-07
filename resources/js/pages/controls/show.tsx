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

type Measure = {
    id: number;
    name: string;
    state: string;
};

type Audit = {
    id: number;
    name: string;
    state: string;
    scheduled_at: string | null;
};

type Control = {
    id: number;
    code: string;
    name: string;
    description: string | null;
    category: string | null;
    status: string;
    framework: { id: number; name: string } | null;
    measures: Measure[];
    audits: Audit[];
    created_at: string;
    updated_at: string;
};

function statusVariant(status: string) {
    switch (status) {
        case 'implemented':
        case 'active':
        case 'completed':
            return 'default';
        case 'in_progress':
            return 'secondary';
        case 'not_started':
        case 'draft':
        case 'planned':
            return 'outline';
        case 'rejected':
            return 'destructive';
        default:
            return 'outline';
    }
}

export default function ControlShow({
    organization,
    control,
}: {
    organization: Organization;
    control: Control;
}) {
    const { t } = useTrans();

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('Organizations'), href: '/organizations' },
        { title: organization.name, href: `/organizations/${organization.id}` },
        { title: t('Controls'), href: `/organizations/${organization.id}/controls` },
        { title: control.name, href: `/organizations/${organization.id}/controls/${control.id}` },
    ];

    const deleteForm = useForm({});

    function handleDelete() {
        if (window.confirm(t('Are you sure you want to delete this control?'))) {
            deleteForm.delete(`/organizations/${organization.id}/controls/${control.id}`);
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={control.name} />

            <div className="mx-auto w-full max-w-4xl space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <Heading
                        title={control.name}
                        description={control.description ?? undefined}
                    />
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href={`/organizations/${organization.id}/controls/${control.id}/edit`}>
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
                                <dt className="text-sm font-medium text-muted-foreground">{t('Code')}</dt>
                                <dd className="mt-1 font-mono text-sm">{control.code}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">{t('Category')}</dt>
                                <dd className="mt-1 text-sm">{control.category || '-'}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">{t('Framework')}</dt>
                                <dd className="mt-1 text-sm">
                                    {control.framework ? (
                                        <Link
                                            href={`/organizations/${organization.id}/frameworks/${control.framework.id}`}
                                            className="hover:underline"
                                        >
                                            {control.framework.name}
                                        </Link>
                                    ) : (
                                        '-'
                                    )}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">{t('Status')}</dt>
                                <dd className="mt-1">
                                    <Badge variant={statusVariant(control.status)}>
                                        {control.status}
                                    </Badge>
                                </dd>
                            </div>
                        </dl>
                    </CardContent>
                </Card>

                <h3 className="text-lg font-medium">{t('Measures')}</h3>
                {control.measures.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-8">
                            <p className="text-sm text-muted-foreground">
                                {t('No measures linked to this control.')}
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <Card>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>{t('Name')}</TableHead>
                                    <TableHead>{t('State')}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {control.measures.map((measure) => (
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
                                            <Badge variant={statusVariant(measure.state)}>
                                                {measure.state}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Card>
                )}

                <h3 className="text-lg font-medium">{t('Audits')}</h3>
                {control.audits.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-8">
                            <p className="text-sm text-muted-foreground">
                                {t('No audits linked to this control.')}
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <Card>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>{t('Name')}</TableHead>
                                    <TableHead>{t('State')}</TableHead>
                                    <TableHead>{t('Scheduled')}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {control.audits.map((audit) => (
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
                                            <Badge variant={statusVariant(audit.state)}>
                                                {audit.state}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {audit.scheduled_at ?? '-'}
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
