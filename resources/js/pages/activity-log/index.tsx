import { Head, Link } from '@inertiajs/react';
import { Activity } from 'lucide-react';
import Heading from '@/components/heading';
import SearchInput from '@/components/search-input';
import { Badge } from '@/components/ui/badge';
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

type ActivityLogEntry = {
    id: number;
    event: string;
    subject_type: string;
    subject_id: number;
    subject_name: string;
    changes: Record<string, unknown> | null;
    user: { id: number; name: string } | null;
    created_at: string;
};

type PaginatedData<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    next_page_url: string | null;
    prev_page_url: string | null;
};

function eventVariant(event: string) {
    switch (event) {
        case 'created':
            return 'default';
        case 'updated':
            return 'secondary';
        case 'deleted':
            return 'destructive';
        default:
            return 'outline';
    }
}

function formatSubjectType(type: string) {
    return type.replace('App\\Models\\', '');
}

function formatDate(date: string) {
    return new Date(date).toLocaleString();
}

export default function ActivityLogIndex({
    organization,
    logs,
    filters,
}: {
    organization: Organization;
    logs: PaginatedData<ActivityLogEntry>;
    filters: { search: string };
}) {
    const { t } = useTrans();

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('Organizations'), href: '/organizations' },
        { title: organization.name, href: `/organizations/${organization.id}` },
        { title: t('Activity Log'), href: `/organizations/${organization.id}/activity-log` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('Activity Log')} />

            <div className="mx-auto w-full max-w-4xl space-y-6 p-6">
                <Heading
                    title={t('Activity Log')}
                    description={t('Track changes to compliance entities')}
                />

                <div className="flex items-center gap-4">
                    <div className="flex-1">
                        <SearchInput
                            value={filters.search}
                            placeholder={t('Search activity...')}
                        />
                    </div>
                </div>

                {logs.data.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <Activity className="mb-4 h-12 w-12 text-muted-foreground" />
                            <h3 className="mb-2 text-lg font-medium">{t('No activity yet')}</h3>
                            <p className="text-sm text-muted-foreground">
                                {t('Activity will appear here as changes are made.')}
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        <Card>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>{t('Event')}</TableHead>
                                        <TableHead>{t('Entity')}</TableHead>
                                        <TableHead>{t('Name')}</TableHead>
                                        <TableHead>{t('User')}</TableHead>
                                        <TableHead>{t('Date')}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {logs.data.map((log) => (
                                        <TableRow key={log.id}>
                                            <TableCell>
                                                <Badge variant={eventVariant(log.event)}>
                                                    {log.event}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {formatSubjectType(log.subject_type)}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {log.subject_name}
                                            </TableCell>
                                            <TableCell>{log.user?.name ?? t('System')}</TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {formatDate(log.created_at)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Card>

                        {logs.last_page > 1 && (
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-muted-foreground">
                                    {t('Showing')} {logs.data.length} {t('of')} {logs.total} {t('entries')}
                                </p>
                                <div className="flex gap-2">
                                    {logs.prev_page_url && (
                                        <Link
                                            href={logs.prev_page_url}
                                            className="rounded-md border px-3 py-1 text-sm hover:bg-muted"
                                        >
                                            {t('Previous')}
                                        </Link>
                                    )}
                                    {logs.next_page_url && (
                                        <Link
                                            href={logs.next_page_url}
                                            className="rounded-md border px-3 py-1 text-sm hover:bg-muted"
                                        >
                                            {t('Next')}
                                        </Link>
                                    )}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </AppLayout>
    );
}
