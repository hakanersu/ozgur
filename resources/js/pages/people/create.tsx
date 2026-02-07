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

export default function PersonCreate({
    organization,
}: {
    organization: Organization;
}) {
    const { t } = useTrans();

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('Organizations'), href: '/organizations' },
        { title: organization.name, href: `/organizations/${organization.id}` },
        { title: t('People'), href: `/organizations/${organization.id}/people` },
        { title: t('Create'), href: `/organizations/${organization.id}/people/create` },
    ];

    const { data, setData, post, processing, errors } = useForm({
        full_name: '',
        primary_email: '',
        kind: 'employee',
        position: '',
        contract_start_date: '',
        contract_end_date: '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post(`/organizations/${organization.id}/people`);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('Create Person')} />

            <div className="mx-auto w-full max-w-2xl space-y-6 p-6">
                <Heading
                    title={t('Create Person')}
                    description={t('Add a new person to your organization')}
                />

                <Card>
                    <CardContent className="pt-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid gap-2">
                                <Label htmlFor="full_name">{t('Full Name')}</Label>
                                <Input
                                    id="full_name"
                                    value={data.full_name}
                                    onChange={(e) => setData('full_name', e.target.value)}
                                    required
                                    placeholder={t('John Doe')}
                                />
                                <InputError message={errors.full_name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="primary_email">{t('Email')}</Label>
                                <Input
                                    id="primary_email"
                                    type="email"
                                    value={data.primary_email}
                                    onChange={(e) => setData('primary_email', e.target.value)}
                                    placeholder={t('john@example.com')}
                                />
                                <InputError message={errors.primary_email} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="kind">{t('Kind')}</Label>
                                <Select
                                    value={data.kind}
                                    onValueChange={(value) => setData('kind', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={t('Select kind')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="employee">{t('Employee')}</SelectItem>
                                        <SelectItem value="contractor">{t('Contractor')}</SelectItem>
                                        <SelectItem value="service_account">{t('Service Account')}</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.kind} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="position">{t('Position')}</Label>
                                <Input
                                    id="position"
                                    value={data.position}
                                    onChange={(e) => setData('position', e.target.value)}
                                    placeholder={t('Software Engineer')}
                                />
                                <InputError message={errors.position} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="contract_start_date">{t('Contract Start Date')}</Label>
                                    <Input
                                        id="contract_start_date"
                                        type="date"
                                        value={data.contract_start_date}
                                        onChange={(e) => setData('contract_start_date', e.target.value)}
                                    />
                                    <InputError message={errors.contract_start_date} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="contract_end_date">{t('Contract End Date')}</Label>
                                    <Input
                                        id="contract_end_date"
                                        type="date"
                                        value={data.contract_end_date}
                                        onChange={(e) => setData('contract_end_date', e.target.value)}
                                    />
                                    <InputError message={errors.contract_end_date} />
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Button type="submit" disabled={processing}>
                                    {t('Create Person')}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
