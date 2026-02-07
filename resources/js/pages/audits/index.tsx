import { Head, Link } from '@inertiajs/react';
import { ClipboardList, Plus } from 'lucide-react';
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
    filters,
}: {
    organization: Organization;
    audits: Audit[];
    filters: { search: string };
}) {
    const { t } = useTrans();

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('Organizations'), href: '/organizations' },
        { title: organization.name, href: `/organizations/${organization.id}` },
        { title: t('Audits'), href: `/organizations/${organization.id}/audits` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('Audits')} />

            <div className="mx-auto w-full max-w-4xl space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <Heading
                        title={t('Audits')}
                        description={t('Schedule and track compliance audits')}
                    />
                    <Button asChild>
                        <Link href={`/organizations/${organization.id}/audits/create`}>
                            <Plus className="mr-2 h-4 w-4" />
                            {t('New Audit')}
                        </Link>
                    </Button>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex-1">
                        <SearchInput
                            value={filters.search}
                            placeholder={t('Search audits...')}
                        />
                    </div>
                </div>

                {audits.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <ClipboardList className="mb-4 h-12 w-12 text-muted-foreground" />
                            <h3 className="mb-2 text-lg font-medium">{t('No audits yet')}</h3>
                            <p className="mb-4 text-sm text-muted-foreground">
                                {t('Create your first audit to start tracking compliance reviews.')}
                            </p>
                            <Button asChild>
                                <Link href={`/organizations/${organization.id}/audits/create`}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    {t('Create Audit')}
                                </Link>
                            </Button>
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
                                    <TableHead className="text-right">{t('Controls')}</TableHead>
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
