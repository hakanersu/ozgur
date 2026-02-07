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

export default function AuditCreate({
    organization,
}: {
    organization: Organization;
}) {
    const { t } = useTrans();

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('Organizations'), href: '/organizations' },
        { title: organization.name, href: `/organizations/${organization.id}` },
        { title: t('Audits'), href: `/organizations/${organization.id}/audits` },
        { title: t('Create'), href: `/organizations/${organization.id}/audits/create` },
    ];

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        state: 'planned',
        scheduled_at: '',
        completed_at: '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post(`/organizations/${organization.id}/audits`);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('Create Audit')} />

            <div className="mx-auto w-full max-w-2xl space-y-6 p-6">
                <Heading
                    title={t('Create Audit')}
                    description={t('Schedule a new compliance audit')}
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
                                    placeholder={t('Q1 2026 Security Audit')}
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="description">{t('Description')}</Label>
                                <textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder={t('Describe the audit scope...')}
                                    rows={4}
                                    className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                />
                                <InputError message={errors.description} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="state">{t('State')}</Label>
                                <Select
                                    value={data.state}
                                    onValueChange={(value) => setData('state', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={t('Select state')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="planned">{t('Planned')}</SelectItem>
                                        <SelectItem value="in_progress">{t('In Progress')}</SelectItem>
                                        <SelectItem value="completed">{t('Completed')}</SelectItem>
                                        <SelectItem value="cancelled">{t('Cancelled')}</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.state} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="scheduled_at">{t('Scheduled Date')}</Label>
                                    <Input
                                        id="scheduled_at"
                                        type="date"
                                        value={data.scheduled_at}
                                        onChange={(e) => setData('scheduled_at', e.target.value)}
                                    />
                                    <InputError message={errors.scheduled_at} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="completed_at">{t('Completed Date')}</Label>
                                    <Input
                                        id="completed_at"
                                        type="date"
                                        value={data.completed_at}
                                        onChange={(e) => setData('completed_at', e.target.value)}
                                    />
                                    <InputError message={errors.completed_at} />
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Button type="submit" disabled={processing}>
                                    {t('Create Audit')}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
