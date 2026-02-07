import { Head, Link } from '@inertiajs/react';
import { ListChecks, Plus } from 'lucide-react';
import Heading from '@/components/heading';
import SearchInput from '@/components/search-input';
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
    filters,
}: {
    organization: Organization;
    controls: Control[];
    filters: { search: string };
}) {
    const { t } = useTrans();

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('Organizations'), href: '/organizations' },
        { title: organization.name, href: `/organizations/${organization.id}` },
        { title: t('Controls'), href: `/organizations/${organization.id}/controls` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('Controls')} />

            <div className="mx-auto w-full max-w-4xl space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <Heading
                        title={t('Controls')}
                        description={t('Manage compliance controls across frameworks')}
                    />
                    <Button asChild>
                        <Link href={`/organizations/${organization.id}/controls/create`}>
                            <Plus className="mr-2 h-4 w-4" />
                            {t('New Control')}
                        </Link>
                    </Button>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex-1">
                        <SearchInput
                            value={filters.search}
                            placeholder={t('Search controls...')}
                        />
                    </div>
                </div>

                {controls.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <ListChecks className="mb-4 h-12 w-12 text-muted-foreground" />
                            <h3 className="mb-2 text-lg font-medium">{t('No controls yet')}</h3>
                            <p className="mb-4 text-sm text-muted-foreground">
                                {t('Create your first control to track compliance requirements.')}
                            </p>
                            <Button asChild>
                                <Link href={`/organizations/${organization.id}/controls/create`}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    {t('Create Control')}
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <Card>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>{t('Code')}</TableHead>
                                    <TableHead>{t('Name')}</TableHead>
                                    <TableHead>{t('Framework')}</TableHead>
                                    <TableHead>{t('Status')}</TableHead>
                                    <TableHead className="text-right">{t('Measures')}</TableHead>
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
