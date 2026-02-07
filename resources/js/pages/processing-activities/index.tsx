import { Head, Link } from '@inertiajs/react';
import { Fingerprint, Plus } from 'lucide-react';
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

type ProcessingActivity = {
    id: number;
    name: string;
    lawful_basis: string | null;
    role: string | null;
    international_transfers: boolean;
    dpia_needed: string | null;
    created_at: string;
    updated_at: string;
};

function lawfulBasisLabel(basis: string): string {
    return basis.replace(/_/g, ' ');
}

export default function ProcessingActivitiesIndex({
    organization,
    processingActivities,
    filters,
}: {
    organization: Organization;
    processingActivities: ProcessingActivity[];
    filters: { search: string };
}) {
    const { t } = useTrans();

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('Organizations'), href: '/organizations' },
        { title: organization.name, href: `/organizations/${organization.id}` },
        { title: t('Processing Activities'), href: `/organizations/${organization.id}/processing-activities` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('Processing Activities')} />

            <div className="mx-auto w-full max-w-4xl space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <Heading
                        title={t('Processing Activities')}
                        description={t('Manage data processing activities and their lawful bases')}
                    />
                    <Button asChild>
                        <Link href={`/organizations/${organization.id}/processing-activities/create`}>
                            <Plus className="mr-2 h-4 w-4" />
                            {t('New Activity')}
                        </Link>
                    </Button>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex-1">
                        <SearchInput
                            value={filters.search}
                            placeholder={t('Search processing activities...')}
                        />
                    </div>
                </div>

                {processingActivities.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <Fingerprint className="mb-4 h-12 w-12 text-muted-foreground" />
                            <h3 className="mb-2 text-lg font-medium">{t('No processing activities yet')}</h3>
                            <p className="mb-4 text-sm text-muted-foreground">
                                {t('Create your first processing activity to start documenting data processing.')}
                            </p>
                            <Button asChild>
                                <Link href={`/organizations/${organization.id}/processing-activities/create`}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    {t('Create Activity')}
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
                                    <TableHead>{t('Lawful Basis')}</TableHead>
                                    <TableHead>{t('Role')}</TableHead>
                                    <TableHead>{t('International Transfers')}</TableHead>
                                    <TableHead>{t('DPIA Needed')}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {processingActivities.map((activity) => (
                                    <TableRow key={activity.id}>
                                        <TableCell>
                                            <Link
                                                href={`/organizations/${organization.id}/processing-activities/${activity.id}`}
                                                className="font-medium hover:underline"
                                            >
                                                {activity.name}
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                                            {activity.lawful_basis ? (
                                                <Badge variant="secondary">
                                                    {lawfulBasisLabel(activity.lawful_basis)}
                                                </Badge>
                                            ) : (
                                                '-'
                                            )}
                                        </TableCell>
                                        <TableCell>{activity.role ?? '-'}</TableCell>
                                        <TableCell>{activity.international_transfers ? t('Yes') : t('No')}</TableCell>
                                        <TableCell>{activity.dpia_needed === 'needed' ? t('Yes') : t('No')}</TableCell>
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
