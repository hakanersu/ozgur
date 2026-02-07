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
import { useTrans } from '@/hooks/use-trans';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Organization } from '@/types';

export default function VendorCreate({
    organization,
}: {
    organization: Organization;
}) {
    const { t } = useTrans();

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('Organizations'), href: '/organizations' },
        { title: organization.name, href: `/organizations/${organization.id}` },
        { title: t('Vendors'), href: `/organizations/${organization.id}/vendors` },
        { title: t('Create'), href: `/organizations/${organization.id}/vendors/create` },
    ];

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        category: 'other',
        legal_name: '',
        headquarter_address: '',
        website_url: '',
        privacy_policy_url: '',
        sla_url: '',
        dpa_url: '',
        status_page_url: '',
        security_page_url: '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post(`/organizations/${organization.id}/vendors`);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('Add Vendor')} />

            <div className="mx-auto w-full max-w-2xl space-y-6 p-6">
                <Heading
                    title={t('Add Vendor')}
                    description={t('Register a new third-party vendor')}
                />

                <Card>
                    <CardContent className="pt-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid gap-2">
                                <Label htmlFor="name">{t('Name')}</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                    placeholder={t('Acme Inc.')}
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="description">{t('Description')}</Label>
                                <textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder={t('Describe the vendor and services provided...')}
                                    rows={4}
                                    className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                />
                                <InputError message={errors.description} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="category">{t('Category')}</Label>
                                <Select
                                    value={data.category}
                                    onValueChange={(value) => setData('category', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={t('Select category')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="analytics">{t('Analytics')}</SelectItem>
                                        <SelectItem value="cloud_monitoring">{t('Cloud Monitoring')}</SelectItem>
                                        <SelectItem value="cloud_provider">{t('Cloud Provider')}</SelectItem>
                                        <SelectItem value="collaboration">{t('Collaboration')}</SelectItem>
                                        <SelectItem value="customer_support">{t('Customer Support')}</SelectItem>
                                        <SelectItem value="data_storage">{t('Data Storage')}</SelectItem>
                                        <SelectItem value="document_management">{t('Document Management')}</SelectItem>
                                        <SelectItem value="employee_management">{t('Employee Management')}</SelectItem>
                                        <SelectItem value="engineering">{t('Engineering')}</SelectItem>
                                        <SelectItem value="finance">{t('Finance')}</SelectItem>
                                        <SelectItem value="identity_provider">{t('Identity Provider')}</SelectItem>
                                        <SelectItem value="it">{t('IT')}</SelectItem>
                                        <SelectItem value="marketing">{t('Marketing')}</SelectItem>
                                        <SelectItem value="office_operations">{t('Office Operations')}</SelectItem>
                                        <SelectItem value="other">{t('Other')}</SelectItem>
                                        <SelectItem value="password_management">{t('Password Management')}</SelectItem>
                                        <SelectItem value="product_and_design">{t('Product and Design')}</SelectItem>
                                        <SelectItem value="professional_services">{t('Professional Services')}</SelectItem>
                                        <SelectItem value="recruiting">{t('Recruiting')}</SelectItem>
                                        <SelectItem value="sales">{t('Sales')}</SelectItem>
                                        <SelectItem value="security">{t('Security')}</SelectItem>
                                        <SelectItem value="version_control">{t('Version Control')}</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.category} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="legal_name">{t('Legal Name')}</Label>
                                <Input
                                    id="legal_name"
                                    value={data.legal_name}
                                    onChange={(e) => setData('legal_name', e.target.value)}
                                    placeholder={t('Acme Corporation Ltd.')}
                                />
                                <InputError message={errors.legal_name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="headquarter_address">{t('Headquarter Address')}</Label>
                                <Input
                                    id="headquarter_address"
                                    value={data.headquarter_address}
                                    onChange={(e) => setData('headquarter_address', e.target.value)}
                                    placeholder={t('123 Main St, City, Country')}
                                />
                                <InputError message={errors.headquarter_address} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="website_url">{t('Website URL')}</Label>
                                <Input
                                    id="website_url"
                                    type="url"
                                    value={data.website_url}
                                    onChange={(e) => setData('website_url', e.target.value)}
                                    placeholder="https://example.com"
                                />
                                <InputError message={errors.website_url} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="privacy_policy_url">{t('Privacy Policy URL')}</Label>
                                <Input
                                    id="privacy_policy_url"
                                    type="url"
                                    value={data.privacy_policy_url}
                                    onChange={(e) => setData('privacy_policy_url', e.target.value)}
                                    placeholder="https://example.com/privacy"
                                />
                                <InputError message={errors.privacy_policy_url} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="sla_url">{t('SLA URL')}</Label>
                                <Input
                                    id="sla_url"
                                    type="url"
                                    value={data.sla_url}
                                    onChange={(e) => setData('sla_url', e.target.value)}
                                    placeholder="https://example.com/sla"
                                />
                                <InputError message={errors.sla_url} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="dpa_url">{t('DPA URL')}</Label>
                                <Input
                                    id="dpa_url"
                                    type="url"
                                    value={data.dpa_url}
                                    onChange={(e) => setData('dpa_url', e.target.value)}
                                    placeholder="https://example.com/dpa"
                                />
                                <InputError message={errors.dpa_url} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="status_page_url">{t('Status Page URL')}</Label>
                                <Input
                                    id="status_page_url"
                                    type="url"
                                    value={data.status_page_url}
                                    onChange={(e) => setData('status_page_url', e.target.value)}
                                    placeholder="https://status.example.com"
                                />
                                <InputError message={errors.status_page_url} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="security_page_url">{t('Security Page URL')}</Label>
                                <Input
                                    id="security_page_url"
                                    type="url"
                                    value={data.security_page_url}
                                    onChange={(e) => setData('security_page_url', e.target.value)}
                                    placeholder="https://example.com/security"
                                />
                                <InputError message={errors.security_page_url} />
                            </div>

                            <div className="flex justify-end">
                                <Button type="submit" disabled={processing}>
                                    {t('Add Vendor')}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
