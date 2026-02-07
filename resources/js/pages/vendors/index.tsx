import { Head, Link } from '@inertiajs/react';
import { Building2, Plus } from 'lucide-react';
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
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Organization } from '@/types';

type Vendor = {
    id: number;
    name: string;
    category: string;
    website_url: string | null;
    contacts_count: number;
    risk_assessments_count: number;
    created_at: string;
};

function formatCategory(category: string) {
    return category
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

export default function VendorsIndex({
    organization,
    vendors,
}: {
    organization: Organization;
    vendors: Vendor[];
}) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Organizations', href: '/organizations' },
        { title: organization.name, href: `/organizations/${organization.id}` },
        { title: 'Vendors', href: `/organizations/${organization.id}/vendors` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Vendors" />

            <div className="mx-auto w-full max-w-4xl space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <Heading
                        title="Vendors"
                        description="Manage third-party vendors and their risk assessments"
                    />
                    <Button asChild>
                        <Link href={`/organizations/${organization.id}/vendors/create`}>
                            <Plus className="mr-2 h-4 w-4" />
                            New Vendor
                        </Link>
                    </Button>
                </div>

                {vendors.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <Building2 className="mb-4 h-12 w-12 text-muted-foreground" />
                            <h3 className="mb-2 text-lg font-medium">No vendors yet</h3>
                            <p className="mb-4 text-sm text-muted-foreground">
                                Add your first vendor to start tracking third-party risks.
                            </p>
                            <Button asChild>
                                <Link href={`/organizations/${organization.id}/vendors/create`}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Vendor
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
                                    <TableHead>Category</TableHead>
                                    <TableHead>Website</TableHead>
                                    <TableHead className="text-right">Contacts</TableHead>
                                    <TableHead className="text-right">Risk Assessments</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {vendors.map((vendor) => (
                                    <TableRow key={vendor.id}>
                                        <TableCell>
                                            <Link
                                                href={`/organizations/${organization.id}/vendors/${vendor.id}`}
                                                className="font-medium hover:underline"
                                            >
                                                {vendor.name}
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">
                                                {formatCategory(vendor.category)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {vendor.website_url ? (
                                                <a
                                                    href={vendor.website_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm hover:underline"
                                                >
                                                    {vendor.website_url}
                                                </a>
                                            ) : (
                                                '-'
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {vendor.contacts_count}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {vendor.risk_assessments_count}
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
