import { Head, Link, useForm } from '@inertiajs/react';
import { Pencil, Trash2 } from 'lucide-react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Organization } from '@/types';

type Asset = {
    id: number;
    name: string;
    amount: number;
    asset_type: string;
    data_types_stored: string | null;
    owner: {
        id: number;
        full_name: string;
    };
    vendors: {
        id: number;
        name: string;
    }[];
    created_at: string;
};

function formatLabel(value: string) {
    return value
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

export default function AssetShow({
    organization,
    asset,
}: {
    organization: Organization;
    asset: Asset;
}) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Organizations', href: '/organizations' },
        { title: organization.name, href: `/organizations/${organization.id}` },
        { title: 'Assets', href: `/organizations/${organization.id}/assets` },
        { title: asset.name, href: `/organizations/${organization.id}/assets/${asset.id}` },
    ];

    const deleteForm = useForm({});

    function handleDelete() {
        if (window.confirm('Are you sure you want to delete this asset?')) {
            deleteForm.delete(`/organizations/${organization.id}/assets/${asset.id}`);
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={asset.name} />

            <div className="mx-auto w-full max-w-4xl space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <Heading title={asset.name} />
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href={`/organizations/${organization.id}/assets/${asset.id}/edit`}>
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
                                <dt className="text-sm font-medium text-muted-foreground">Asset Type</dt>
                                <dd className="mt-1">
                                    <Badge variant="secondary">
                                        {formatLabel(asset.asset_type)}
                                    </Badge>
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">Amount</dt>
                                <dd className="mt-1 text-sm">{asset.amount}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">Owner</dt>
                                <dd className="mt-1 text-sm">{asset.owner.full_name}</dd>
                            </div>
                            <div className="sm:col-span-3">
                                <dt className="text-sm font-medium text-muted-foreground">Data Types Stored</dt>
                                <dd className="mt-1 text-sm">{asset.data_types_stored || '-'}</dd>
                            </div>
                            <div className="sm:col-span-3">
                                <dt className="text-sm font-medium text-muted-foreground">Vendors</dt>
                                <dd className="mt-1">
                                    {asset.vendors.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {asset.vendors.map((vendor) => (
                                                <Badge key={vendor.id} variant="outline">
                                                    {vendor.name}
                                                </Badge>
                                            ))}
                                        </div>
                                    ) : (
                                        <span className="text-sm">-</span>
                                    )}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">Created At</dt>
                                <dd className="mt-1 text-sm">{asset.created_at}</dd>
                            </div>
                        </dl>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
