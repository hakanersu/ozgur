import { Head, Link } from '@inertiajs/react';
import { Box, Plus } from 'lucide-react';
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
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Organization } from '@/types';

type Asset = {
    id: number;
    name: string;
    amount: number;
    asset_type: string;
    owner: {
        id: number;
        full_name: string;
    };
    vendors_count: number;
    created_at: string;
};

function formatLabel(value: string) {
    return value
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

export default function AssetsIndex({
    organization,
    assets,
    filters,
}: {
    organization: Organization;
    assets: Asset[];
    filters: { search: string };
}) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Organizations', href: '/organizations' },
        { title: organization.name, href: `/organizations/${organization.id}` },
        { title: 'Assets', href: `/organizations/${organization.id}/assets` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Assets" />

            <div className="mx-auto w-full max-w-4xl space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <Heading
                        title="Assets"
                        description="Manage your organization's assets and data inventory"
                    />
                    <Button asChild>
                        <Link href={`/organizations/${organization.id}/assets/create`}>
                            <Plus className="mr-2 h-4 w-4" />
                            New Asset
                        </Link>
                    </Button>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex-1">
                        <SearchInput
                            value={filters.search}
                            placeholder="Search assets..."
                        />
                    </div>
                </div>

                {assets.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <Box className="mb-4 h-12 w-12 text-muted-foreground" />
                            <h3 className="mb-2 text-lg font-medium">No assets yet</h3>
                            <p className="mb-4 text-sm text-muted-foreground">
                                Add your first asset to start tracking your data inventory.
                            </p>
                            <Button asChild>
                                <Link href={`/organizations/${organization.id}/assets/create`}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Asset
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <Card>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                    <TableHead>Owner</TableHead>
                                    <TableHead className="text-right">Vendors</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {assets.map((asset) => (
                                    <TableRow key={asset.id}>
                                        <TableCell>
                                            <Link
                                                href={`/organizations/${organization.id}/assets/${asset.id}`}
                                                className="font-medium hover:underline"
                                            >
                                                {asset.name}
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">
                                                {formatLabel(asset.asset_type)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {asset.amount}
                                        </TableCell>
                                        <TableCell>
                                            {asset.owner.full_name}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {asset.vendors_count}
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
