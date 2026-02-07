import { Head, useForm } from '@inertiajs/react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTrans } from '@/hooks/use-trans';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Organization } from '@/types';

export default function OrganizationEdit({
    organization,
}: {
    organization: Organization;
}) {
    const { t } = useTrans();

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('Organizations'), href: '/organizations' },
        {
            title: organization.name,
            href: `/organizations/${organization.id}`,
        },
        {
            title: t('Edit'),
            href: `/organizations/${organization.id}/edit`,
        },
    ];

    const { data, setData, put, processing, errors } = useForm({
        name: organization.name,
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        put(`/organizations/${organization.id}`);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${t('Edit')} ${organization.name}`} />

            <div className="mx-auto w-full max-w-2xl space-y-6 p-6">
                <Heading
                    title={t('Edit Organization')}
                    description={t('Update organization settings')}
                />

                <Card>
                    <CardContent className="pt-6">
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-6"
                        >
                            <div className="grid gap-2">
                                <Label htmlFor="name">
                                    {t('Organization Name')}
                                </Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    required
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="flex justify-end">
                                <Button
                                    type="submit"
                                    disabled={processing}
                                >
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
