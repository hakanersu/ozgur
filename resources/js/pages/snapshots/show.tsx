import { Head, useForm } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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

export default function SnapshotShow({
    organization,
    snapshot,
}: {
    organization: Organization;
    snapshot: Snapshot;
}) {
    const { t } = useTrans();

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('Organizations'), href: '/organizations' },
        { title: organization.name, href: `/organizations/${organization.id}` },
        { title: t('Snapshots'), href: `/organizations/${organization.id}/snapshots` },
        { title: snapshot.name, href: `/organizations/${organization.id}/snapshots/${snapshot.id}` },
    ];

    const deleteForm = useForm({});

    function handleDelete() {
        if (window.confirm(t('Are you sure you want to delete this snapshot?'))) {
            deleteForm.delete(`/organizations/${organization.id}/snapshots/${snapshot.id}`);
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={snapshot.name} />

            <div className="mx-auto w-full max-w-4xl space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <Heading title={snapshot.name} />
                    <div className="flex gap-2">
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
                        <dl className="grid gap-4 sm:grid-cols-3">
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">{t('Type')}</dt>
                                <dd className="mt-1">
                                    <Badge variant="secondary">
                                        {formatLabel(snapshot.type)}
                                    </Badge>
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">{t('Created At')}</dt>
                                <dd className="mt-1 text-sm">{snapshot.created_at}</dd>
                            </div>
                            <div className="sm:col-span-3">
                                <dt className="text-sm font-medium text-muted-foreground">{t('Description')}</dt>
                                <dd className="mt-1 text-sm">{snapshot.description || '-'}</dd>
                            </div>
                        </dl>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
