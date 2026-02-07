import { Head, Link, useForm } from '@inertiajs/react';
import { Upload } from 'lucide-react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTrans } from '@/hooks/use-trans';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Organization } from '@/types';

export default function FrameworkImport({
    organization,
}: {
    organization: Organization;
}) {
    const { t } = useTrans();

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('Organizations'), href: '/organizations' },
        { title: organization.name, href: `/organizations/${organization.id}` },
        { title: t('Frameworks'), href: `/organizations/${organization.id}/frameworks` },
        { title: t('Import'), href: `/organizations/${organization.id}/frameworks/import` },
    ];

    const { data, setData, post, processing, errors } = useForm<{
        name: string;
        version: string;
        file: File | null;
    }>({
        name: '',
        version: '1.0',
        file: null,
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post(`/organizations/${organization.id}/frameworks/import`);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('Import Framework')} />

            <div className="mx-auto w-full max-w-2xl space-y-6 p-6">
                <Heading
                    title={t('Import Framework')}
                    description={t('Import a framework and its controls from a CSV file')}
                />

                <Card>
                    <CardHeader>
                        <CardTitle>{t('CSV Format')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            {t('The CSV file should have the following columns: Control Code, Control Name, Category, Status, Description.')}
                            {' '}
                            {t('The first row is treated as a header and will be skipped.')}
                        </p>
                    </CardContent>
                </Card>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardContent className="space-y-4 pt-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">{t('Framework Name')}</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="version">{t('Version')}</Label>
                                <Input
                                    id="version"
                                    value={data.version}
                                    onChange={(e) => setData('version', e.target.value)}
                                />
                                <InputError message={errors.version} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="file">{t('CSV File')}</Label>
                                <Input
                                    id="file"
                                    type="file"
                                    accept=".csv,.txt"
                                    onChange={(e) => setData('file', e.target.files?.[0] ?? null)}
                                    required
                                />
                                <InputError message={errors.file} />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-4">
                        <Button variant="outline" asChild>
                            <Link href={`/organizations/${organization.id}/frameworks`}>
                                {t('Cancel')}
                            </Link>
                        </Button>
                        <Button type="submit" disabled={processing}>
                            <Upload className="mr-2 h-4 w-4" />
                            {t('Import')}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
