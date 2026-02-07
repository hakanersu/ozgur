import { Head, useForm } from '@inertiajs/react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTrans } from '@/hooks/use-trans';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

export default function OrganizationCreate() {
    const { t } = useTrans();
    const { data, setData, post, processing, errors } = useForm({
        name: '',
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('Organizations'), href: '/organizations' },
        { title: t('Create'), href: '/organizations/create' },
    ];

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post('/organizations');
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('Create Organization')} />

            <div className="mx-auto w-full max-w-2xl space-y-6 p-6">
                <Heading
                    title={t('Create Organization')}
                    description={t('Set up a new compliance organization')}
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
                                    placeholder="Acme Corp"
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="flex justify-end">
                                <Button
                                    type="submit"
                                    disabled={processing}
                                >
                                    {t('Create Organization')}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
