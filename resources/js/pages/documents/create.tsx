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

export default function DocumentCreate({
    organization,
}: {
    organization: Organization;
}) {
    const { t } = useTrans();

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('Organizations'), href: '/organizations' },
        { title: organization.name, href: `/organizations/${organization.id}` },
        { title: t('Documents'), href: `/organizations/${organization.id}/documents` },
        { title: t('Create'), href: `/organizations/${organization.id}/documents/create` },
    ];

    const { data, setData, post, processing, errors } = useForm({
        title: '',
        document_type: 'other',
        classification: 'internal',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post(`/organizations/${organization.id}/documents`);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('Create Document')} />

            <div className="mx-auto w-full max-w-2xl space-y-6 p-6">
                <Heading
                    title={t('Create Document')}
                    description={t('Add a new compliance document')}
                />

                <Card>
                    <CardContent className="pt-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid gap-2">
                                <Label htmlFor="title">{t('Title')}</Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    required
                                    placeholder={t('Information Security Policy')}
                                />
                                <InputError message={errors.title} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="document_type">{t('Document Type')}</Label>
                                <Select
                                    value={data.document_type}
                                    onValueChange={(value) => setData('document_type', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={t('Select type')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="other">{t('Other')}</SelectItem>
                                        <SelectItem value="isms">{t('ISMS')}</SelectItem>
                                        <SelectItem value="policy">{t('Policy')}</SelectItem>
                                        <SelectItem value="procedure">{t('Procedure')}</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.document_type} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="classification">{t('Classification')}</Label>
                                <Select
                                    value={data.classification}
                                    onValueChange={(value) => setData('classification', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={t('Select classification')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="public">{t('Public')}</SelectItem>
                                        <SelectItem value="internal">{t('Internal')}</SelectItem>
                                        <SelectItem value="confidential">{t('Confidential')}</SelectItem>
                                        <SelectItem value="secret">{t('Secret')}</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.classification} />
                            </div>

                            <div className="flex justify-end">
                                <Button type="submit" disabled={processing}>
                                    {t('Create Document')}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
