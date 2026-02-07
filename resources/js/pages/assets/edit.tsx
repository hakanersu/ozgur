import { Head, useForm } from '@inertiajs/react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
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

type Person = {
    id: number;
    full_name: string;
};

type Vendor = {
    id: number;
    name: string;
};

type Asset = {
    id: number;
    name: string;
    amount: number;
    asset_type: string;
    data_types_stored: string | null;
    owner_id: number;
    vendors: { id: number }[];
    created_at: string;
};

export default function AssetEdit({
    organization,
    asset,
    people,
    vendors,
}: {
    organization: Organization;
    asset: Asset;
    people: Person[];
    vendors: Vendor[];
}) {
    const { t } = useTrans();

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('Organizations'), href: '/organizations' },
        { title: organization.name, href: `/organizations/${organization.id}` },
        { title: t('Assets'), href: `/organizations/${organization.id}/assets` },
        { title: asset.name, href: `/organizations/${organization.id}/assets/${asset.id}` },
        { title: t('Edit'), href: `/organizations/${organization.id}/assets/${asset.id}/edit` },
    ];

    const { data, setData, put, processing, errors } = useForm({
        name: asset.name,
        amount: String(asset.amount),
        owner_id: String(asset.owner_id),
        asset_type: asset.asset_type,
        data_types_stored: asset.data_types_stored ?? '',
        vendor_ids: asset.vendors.map((v: { id: number }) => v.id),
    });

    function toggleVendor(vendorId: number) {
        const currentIds = [...data.vendor_ids];
        const index = currentIds.indexOf(vendorId);
        if (index === -1) {
            currentIds.push(vendorId);
        } else {
            currentIds.splice(index, 1);
        }
        setData('vendor_ids', currentIds);
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        put(`/organizations/${organization.id}/assets/${asset.id}`);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${t('Edit')} ${asset.name}`} />

            <div className="mx-auto w-full max-w-2xl space-y-6 p-6">
                <Heading
                    title={t('Edit Asset')}
                    description={t('Update asset details')}
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
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="amount">{t('Amount')}</Label>
                                <Input
                                    id="amount"
                                    type="number"
                                    value={data.amount}
                                    onChange={(e) => setData('amount', e.target.value)}
                                    required
                                    min="0"
                                />
                                <InputError message={errors.amount} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="owner_id">{t('Owner')}</Label>
                                <Select
                                    value={data.owner_id}
                                    onValueChange={(value) => setData('owner_id', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={t('Select owner')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {people.map((person) => (
                                            <SelectItem key={person.id} value={String(person.id)}>
                                                {person.full_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.owner_id} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="asset_type">{t('Asset Type')}</Label>
                                <Select
                                    value={data.asset_type}
                                    onValueChange={(value) => setData('asset_type', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={t('Select type')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="physical">{t('Physical')}</SelectItem>
                                        <SelectItem value="virtual">{t('Virtual')}</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.asset_type} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="data_types_stored">{t('Data Types Stored')}</Label>
                                <textarea
                                    id="data_types_stored"
                                    value={data.data_types_stored}
                                    onChange={(e) => setData('data_types_stored', e.target.value)}
                                    rows={4}
                                    className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                />
                                <InputError message={errors.data_types_stored} />
                            </div>

                            {vendors.length > 0 && (
                                <div className="grid gap-2">
                                    <Label>{t('Vendors')}</Label>
                                    <div className="space-y-2">
                                        {vendors.map((vendor) => (
                                            <div key={vendor.id} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`vendor-${vendor.id}`}
                                                    checked={data.vendor_ids.includes(vendor.id)}
                                                    onCheckedChange={() => toggleVendor(vendor.id)}
                                                />
                                                <Label
                                                    htmlFor={`vendor-${vendor.id}`}
                                                    className="text-sm font-normal"
                                                >
                                                    {vendor.name}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                    <InputError message={errors.vendor_ids} />
                                </div>
                            )}

                            <div className="flex justify-end">
                                <Button type="submit" disabled={processing}>
                                    {t('Save Changes')}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
