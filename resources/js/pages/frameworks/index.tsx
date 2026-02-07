import { Head, Link } from '@inertiajs/react';
import { Plus, Shield, Upload } from 'lucide-react';
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
    filters,
}: {
    organization: Organization;
    frameworks: Framework[];
    filters: { search: string };
}) {
    const { t } = useTrans();

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('Organizations'), href: '/organizations' },
        { title: organization.name, href: `/organizations/${organization.id}` },
        { title: t('Frameworks'), href: `/organizations/${organization.id}/frameworks` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('Frameworks')} />

            <div className="mx-auto w-full max-w-4xl space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <Heading
                        title={t('Frameworks')}
                        description={t('Manage compliance frameworks and their controls')}
                    />
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href={`/organizations/${organization.id}/frameworks/import`}>
                                <Upload className="mr-2 h-4 w-4" />
                                {t('Import')}
                            </Link>
                        </Button>
                        <Button asChild>
                            <Link href={`/organizations/${organization.id}/frameworks/create`}>
                                <Plus className="mr-2 h-4 w-4" />
                                {t('New Framework')}
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex-1">
                        <SearchInput
                            value={filters.search}
                            placeholder={t('Search frameworks...')}
                        />
                    </div>
                </div>

                {frameworks.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <Shield className="mb-4 h-12 w-12 text-muted-foreground" />
                            <h3 className="mb-2 text-lg font-medium">{t('No frameworks yet')}</h3>
                            <p className="mb-4 text-sm text-muted-foreground">
                                {t('Create your first framework to start organizing compliance controls.')}
                            </p>
                            <Button asChild>
                                <Link href={`/organizations/${organization.id}/frameworks/create`}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    {t('Create Framework')}
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
                                    <TableHead>{t('Version')}</TableHead>
                                    <TableHead>{t('Status')}</TableHead>
                                    <TableHead className="text-right">{t('Controls')}</TableHead>
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
