import { Head, Link } from '@inertiajs/react';
import { Camera, Plus } from 'lucide-react';
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

type Snapshot = {
    id: number;
    name: string;
    description: string | null;
    type: string;
    created_at: string;
};

function formatLabel(value: string) {
    return value
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

export default function SnapshotsIndex({
    organization,
    snapshots,
    filters,
}: {
    organization: Organization;
    snapshots: Snapshot[];
    filters: { search: string };
}) {
    const { t } = useTrans();

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('Organizations'), href: '/organizations' },
        { title: organization.name, href: `/organizations/${organization.id}` },
        { title: t('Snapshots'), href: `/organizations/${organization.id}/snapshots` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('Snapshots')} />

            <div className="mx-auto w-full max-w-4xl space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <Heading
                        title={t('Snapshots')}
                        description={t('Point-in-time snapshots of your compliance data')}
                    />
                    <Button asChild>
                        <Link href={`/organizations/${organization.id}/snapshots/create`}>
                            <Plus className="mr-2 h-4 w-4" />
                            {t('New Snapshot')}
                        </Link>
                    </Button>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex-1">
                        <SearchInput
                            value={filters.search}
                            placeholder={t('Search snapshots...')}
                        />
                    </div>
                </div>

                {snapshots.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <Camera className="mb-4 h-12 w-12 text-muted-foreground" />
                            <h3 className="mb-2 text-lg font-medium">{t('No snapshots yet')}</h3>
                            <p className="mb-4 text-sm text-muted-foreground">
                                {t('Create your first snapshot to capture a point-in-time record.')}
                            </p>
                            <Button asChild>
                                <Link href={`/organizations/${organization.id}/snapshots/create`}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    {t('Create Snapshot')}
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
                                    <TableHead>{t('Type')}</TableHead>
                                    <TableHead>{t('Description')}</TableHead>
                                    <TableHead>{t('Created At')}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {snapshots.map((snapshot) => (
                                    <TableRow key={snapshot.id}>
                                        <TableCell>
                                            <Link
                                                href={`/organizations/${organization.id}/snapshots/${snapshot.id}`}
                                                className="font-medium hover:underline"
                                            >
                                                {snapshot.name}
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">
                                                {formatLabel(snapshot.type)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="max-w-xs truncate">
                                            {snapshot.description || '-'}
                                        </TableCell>
                                        <TableCell>
                                            {snapshot.created_at}
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
