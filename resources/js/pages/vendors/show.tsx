import { Head, Link, useForm } from '@inertiajs/react';
import { Pencil, Trash2 } from 'lucide-react';
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

type VendorContact = {
    id: number;
    full_name: string;
    email: string | null;
    phone: string | null;
    role: string | null;
};

type VendorRiskAssessment = {
    id: number;
    data_sensitivity: string;
    business_impact: string;
    expires_at: string | null;
    notes: string | null;
};

type Vendor = {
    id: number;
    name: string;
    description: string | null;
    category: string;
    legal_name: string | null;
    headquarter_address: string | null;
    website_url: string | null;
    privacy_policy_url: string | null;
    sla_url: string | null;
    dpa_url: string | null;
    status_page_url: string | null;
    security_page_url: string | null;
    certifications: string[] | null;
    countries: string[] | null;
    contacts: VendorContact[];
    risk_assessments: VendorRiskAssessment[];
    created_at: string;
    updated_at: string;
};

function formatCategory(category: string) {
    return category
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

function impactVariant(impact: string) {
    switch (impact) {
        case 'critical':
            return 'destructive';
        case 'high':
            return 'default';
        case 'medium':
            return 'secondary';
        case 'low':
        case 'none':
            return 'outline';
        default:
            return 'outline';
    }
}

export default function VendorShow({
    organization,
    vendor,
}: {
    organization: Organization;
    vendor: Vendor;
}) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Organizations', href: '/organizations' },
        { title: organization.name, href: `/organizations/${organization.id}` },
        { title: 'Vendors', href: `/organizations/${organization.id}/vendors` },
        { title: vendor.name, href: `/organizations/${organization.id}/vendors/${vendor.id}` },
    ];

    const deleteForm = useForm({});

    function handleDelete() {
        if (window.confirm('Are you sure you want to delete this vendor?')) {
            deleteForm.delete(`/organizations/${organization.id}/vendors/${vendor.id}`);
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={vendor.name} />

            <div className="mx-auto w-full max-w-4xl space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <Heading
                        title={vendor.name}
                        description={vendor.description ?? undefined}
                    />
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href={`/organizations/${organization.id}/vendors/${vendor.id}/edit`}>
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
                                <dt className="text-sm font-medium text-muted-foreground">Category</dt>
                                <dd className="mt-1">
                                    <Badge variant="secondary">
                                        {formatCategory(vendor.category)}
                                    </Badge>
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">Legal Name</dt>
                                <dd className="mt-1 text-sm">{vendor.legal_name || '-'}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">Headquarter Address</dt>
                                <dd className="mt-1 text-sm">{vendor.headquarter_address || '-'}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">Website</dt>
                                <dd className="mt-1 text-sm">
                                    {vendor.website_url ? (
                                        <a href={vendor.website_url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                            {vendor.website_url}
                                        </a>
                                    ) : '-'}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">Privacy Policy</dt>
                                <dd className="mt-1 text-sm">
                                    {vendor.privacy_policy_url ? (
                                        <a href={vendor.privacy_policy_url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                            View
                                        </a>
                                    ) : '-'}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">SLA</dt>
                                <dd className="mt-1 text-sm">
                                    {vendor.sla_url ? (
                                        <a href={vendor.sla_url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                            View
                                        </a>
                                    ) : '-'}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">DPA</dt>
                                <dd className="mt-1 text-sm">
                                    {vendor.dpa_url ? (
                                        <a href={vendor.dpa_url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                            View
                                        </a>
                                    ) : '-'}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">Status Page</dt>
                                <dd className="mt-1 text-sm">
                                    {vendor.status_page_url ? (
                                        <a href={vendor.status_page_url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                            View
                                        </a>
                                    ) : '-'}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">Security Page</dt>
                                <dd className="mt-1 text-sm">
                                    {vendor.security_page_url ? (
                                        <a href={vendor.security_page_url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                            View
                                        </a>
                                    ) : '-'}
                                </dd>
                            </div>
                        </dl>
                    </CardContent>
                </Card>

                {vendor.certifications && vendor.certifications.length > 0 && (
                    <Card>
                        <CardContent className="pt-6">
                            <h3 className="mb-3 text-sm font-medium text-muted-foreground">Certifications</h3>
                            <div className="flex flex-wrap gap-2">
                                {vendor.certifications.map((certification) => (
                                    <Badge key={certification} variant="outline">
                                        {certification}
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                <h3 className="text-lg font-medium">Contacts</h3>

                {vendor.contacts.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <p className="text-sm text-muted-foreground">
                                No contacts added yet.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <Card>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Phone</TableHead>
                                    <TableHead>Role</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {vendor.contacts.map((contact) => (
                                    <TableRow key={contact.id}>
                                        <TableCell className="font-medium">{contact.full_name}</TableCell>
                                        <TableCell>{contact.email || '-'}</TableCell>
                                        <TableCell>{contact.phone || '-'}</TableCell>
                                        <TableCell>{contact.role || '-'}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Card>
                )}

                <h3 className="text-lg font-medium">Risk Assessments</h3>

                {vendor.risk_assessments.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <p className="text-sm text-muted-foreground">
                                No risk assessments added yet.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <Card>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Data Sensitivity</TableHead>
                                    <TableHead>Business Impact</TableHead>
                                    <TableHead>Expires At</TableHead>
                                    <TableHead>Notes</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {vendor.risk_assessments.map((assessment) => (
                                    <TableRow key={assessment.id}>
                                        <TableCell>
                                            <Badge variant={impactVariant(assessment.data_sensitivity)}>
                                                {assessment.data_sensitivity}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={impactVariant(assessment.business_impact)}>
                                                {assessment.business_impact}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{assessment.expires_at || '-'}</TableCell>
                                        <TableCell className="max-w-xs truncate">
                                            {assessment.notes || '-'}
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
