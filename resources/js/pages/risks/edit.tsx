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

type Risk = {
    id: number;
    name: string;
    description: string | null;
    category: string | null;
    probability: number;
    impact: number;
    treatment: string;
    created_at: string;
    updated_at: string;
};

export default function RiskEdit({
    organization,
    risk,
}: {
    organization: Organization;
    risk: Risk;
}) {
    const { t } = useTrans();

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('Organizations'), href: '/organizations' },
        { title: organization.name, href: `/organizations/${organization.id}` },
        { title: t('Risks'), href: `/organizations/${organization.id}/risks` },
        { title: risk.name, href: `/organizations/${organization.id}/risks/${risk.id}` },
        { title: t('Edit'), href: `/organizations/${organization.id}/risks/${risk.id}/edit` },
    ];

    const { data, setData, put, processing, errors } = useForm({
        name: risk.name,
        description: risk.description ?? '',
        category: risk.category ?? '',
        probability: String(risk.probability),
        impact: String(risk.impact),
        treatment: risk.treatment,
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        put(`/organizations/${organization.id}/risks/${risk.id}`);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${t('Edit')} ${risk.name}`} />

            <div className="mx-auto w-full max-w-2xl space-y-6 p-6">
                <Heading
                    title={t('Edit Risk')}
                    description={t('Update risk details')}
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
                                <Label htmlFor="description">{t('Description')}</Label>
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
                                <Label htmlFor="category">{t('Category')}</Label>
                                <Input
                                    id="category"
                                    value={data.category}
                                    onChange={(e) => setData('category', e.target.value)}
                                />
                                <InputError message={errors.category} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="probability">{t('Probability (1-5)')}</Label>
                                    <Select
                                        value={data.probability}
                                        onValueChange={(value) => setData('probability', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder={t('Select probability')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">{t('1 - Very Low')}</SelectItem>
                                            <SelectItem value="2">{t('2 - Low')}</SelectItem>
                                            <SelectItem value="3">{t('3 - Medium')}</SelectItem>
                                            <SelectItem value="4">{t('4 - High')}</SelectItem>
                                            <SelectItem value="5">{t('5 - Very High')}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.probability} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="impact">{t('Impact (1-5)')}</Label>
                                    <Select
                                        value={data.impact}
                                        onValueChange={(value) => setData('impact', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder={t('Select impact')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">{t('1 - Negligible')}</SelectItem>
                                            <SelectItem value="2">{t('2 - Minor')}</SelectItem>
                                            <SelectItem value="3">{t('3 - Moderate')}</SelectItem>
                                            <SelectItem value="4">{t('4 - Major')}</SelectItem>
                                            <SelectItem value="5">{t('5 - Critical')}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.impact} />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="treatment">{t('Treatment')}</Label>
                                <Select
                                    value={data.treatment}
                                    onValueChange={(value) => setData('treatment', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={t('Select treatment')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="mitigate">{t('Mitigate')}</SelectItem>
                                        <SelectItem value="accept">{t('Accept')}</SelectItem>
                                        <SelectItem value="transfer">{t('Transfer')}</SelectItem>
                                        <SelectItem value="avoid">{t('Avoid')}</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.treatment} />
                            </div>

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
