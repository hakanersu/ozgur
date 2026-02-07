import { Head, useForm } from '@inertiajs/react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Organization } from '@/types';

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
    created_at: string;
    updated_at: string;
};

export default function VendorEdit({
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
        { title: 'Edit', href: `/organizations/${organization.id}/vendors/${vendor.id}/edit` },
    ];

    const { data, setData, put, processing, errors } = useForm({
        name: vendor.name,
        description: vendor.description ?? '',
        category: vendor.category,
        legal_name: vendor.legal_name ?? '',
        headquarter_address: vendor.headquarter_address ?? '',
        website_url: vendor.website_url ?? '',
        privacy_policy_url: vendor.privacy_policy_url ?? '',
        sla_url: vendor.sla_url ?? '',
        dpa_url: vendor.dpa_url ?? '',
        status_page_url: vendor.status_page_url ?? '',
        security_page_url: vendor.security_page_url ?? '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        put(`/organizations/${organization.id}/vendors/${vendor.id}`);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${vendor.name}`} />

            <div className="mx-auto w-full max-w-2xl space-y-6 p-6">
                <Heading
                    title="Edit Vendor"
                    description="Update vendor details"
                />

                <Card>
                    <CardContent className="pt-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="description">Description</Label>
                                <textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows={4}
                                    className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                />
                                <InputError message={errors.description} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="category">Category</Label>
                                <Select
                                    value={data.category}
                                    onValueChange={(value) => setData('category', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="analytics">Analytics</SelectItem>
                                        <SelectItem value="cloud_monitoring">Cloud Monitoring</SelectItem>
                                        <SelectItem value="cloud_provider">Cloud Provider</SelectItem>
                                        <SelectItem value="collaboration">Collaboration</SelectItem>
                                        <SelectItem value="customer_support">Customer Support</SelectItem>
                                        <SelectItem value="data_storage">Data Storage</SelectItem>
                                        <SelectItem value="document_management">Document Management</SelectItem>
                                        <SelectItem value="employee_management">Employee Management</SelectItem>
                                        <SelectItem value="engineering">Engineering</SelectItem>
                                        <SelectItem value="finance">Finance</SelectItem>
                                        <SelectItem value="identity_provider">Identity Provider</SelectItem>
                                        <SelectItem value="it">IT</SelectItem>
                                        <SelectItem value="marketing">Marketing</SelectItem>
                                        <SelectItem value="office_operations">Office Operations</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                        <SelectItem value="password_management">Password Management</SelectItem>
                                        <SelectItem value="product_and_design">Product and Design</SelectItem>
                                        <SelectItem value="professional_services">Professional Services</SelectItem>
                                        <SelectItem value="recruiting">Recruiting</SelectItem>
                                        <SelectItem value="sales">Sales</SelectItem>
                                        <SelectItem value="security">Security</SelectItem>
                                        <SelectItem value="version_control">Version Control</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.category} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="legal_name">Legal Name</Label>
                                <Input
                                    id="legal_name"
                                    value={data.legal_name}
                                    onChange={(e) => setData('legal_name', e.target.value)}
                                />
                                <InputError message={errors.legal_name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="headquarter_address">Headquarter Address</Label>
                                <Input
                                    id="headquarter_address"
                                    value={data.headquarter_address}
                                    onChange={(e) => setData('headquarter_address', e.target.value)}
                                />
                                <InputError message={errors.headquarter_address} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="website_url">Website URL</Label>
                                <Input
                                    id="website_url"
                                    type="url"
                                    value={data.website_url}
                                    onChange={(e) => setData('website_url', e.target.value)}
                                />
                                <InputError message={errors.website_url} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="privacy_policy_url">Privacy Policy URL</Label>
                                <Input
                                    id="privacy_policy_url"
                                    type="url"
                                    value={data.privacy_policy_url}
                                    onChange={(e) => setData('privacy_policy_url', e.target.value)}
                                />
                                <InputError message={errors.privacy_policy_url} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="sla_url">SLA URL</Label>
                                <Input
                                    id="sla_url"
                                    type="url"
                                    value={data.sla_url}
                                    onChange={(e) => setData('sla_url', e.target.value)}
                                />
                                <InputError message={errors.sla_url} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="dpa_url">DPA URL</Label>
                                <Input
                                    id="dpa_url"
                                    type="url"
                                    value={data.dpa_url}
                                    onChange={(e) => setData('dpa_url', e.target.value)}
                                />
                                <InputError message={errors.dpa_url} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="status_page_url">Status Page URL</Label>
                                <Input
                                    id="status_page_url"
                                    type="url"
                                    value={data.status_page_url}
                                    onChange={(e) => setData('status_page_url', e.target.value)}
                                />
                                <InputError message={errors.status_page_url} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="security_page_url">Security Page URL</Label>
                                <Input
                                    id="security_page_url"
                                    type="url"
                                    value={data.security_page_url}
                                    onChange={(e) => setData('security_page_url', e.target.value)}
                                />
                                <InputError message={errors.security_page_url} />
                            </div>

                            <div className="flex justify-end">
                                <Button type="submit" disabled={processing}>
                                    Save Changes
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
