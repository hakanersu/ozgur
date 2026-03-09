import { Head, router, useForm } from '@inertiajs/react';
import { ChevronLeft, Plus, Shield } from 'lucide-react';
import { useState } from 'react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

type FrameworkTemplate = {
    id: string;
    name: string;
    controls_count: number;
};

export default function FrameworkCreate({
    organization,
    templates,
}: {
    organization: Organization;
    templates: FrameworkTemplate[];
}) {
    const { t } = useTrans();
    const [mode, setMode] = useState<'select' | 'custom'>('select');
    const [importing, setImporting] = useState<string | null>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('Organizations'), href: '/organizations' },
        { title: organization.name, href: `/organizations/${organization.id}` },
        { title: t('Frameworks'), href: `/organizations/${organization.id}/frameworks` },
        { title: t('New Framework'), href: `/organizations/${organization.id}/frameworks/create` },
    ];

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        version: '',
        status: 'draft',
    });

    function handleImport(templateId: string) {
        setImporting(templateId);
        router.post(
            `/organizations/${organization.id}/frameworks/import-template`,
            { template_id: templateId },
            { onFinish: () => setImporting(null) },
        );
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post(`/organizations/${organization.id}/frameworks`);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('New Framework')} />

            <div className="mx-auto w-full max-w-4xl space-y-6 p-6">
                <Heading
                    title={t('New Framework')}
                    description={
                        mode === 'select'
                            ? t('Choose a template to get started with pre-built controls, or create a custom framework.')
                            : t('Define your own framework from scratch.')
                    }
                />

                {mode === 'select' ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {templates.map((template) => (
                            <Card
                                key={template.id}
                                className="cursor-pointer transition-colors hover:border-primary"
                                onClick={() => !importing && handleImport(template.id)}
                            >
                                <CardHeader className="pb-3">
                                    <div className="flex items-start gap-3">
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10">
                                            <Shield className="h-4 w-4 text-primary" />
                                        </div>
                                        <CardTitle className="text-sm leading-snug">
                                            {template.name}
                                        </CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <Badge variant="secondary">
                                        {template.controls_count} {t('controls')}
                                    </Badge>
                                    {importing === template.id && (
                                        <p className="mt-2 text-xs text-muted-foreground">
                                            {t('Importing...')}
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        ))}

                        <Card
                            className="cursor-pointer border-dashed transition-colors hover:border-primary"
                            onClick={() => setMode('custom')}
                        >
                            <CardHeader className="pb-3">
                                <div className="flex items-start gap-3">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border-2 border-dashed">
                                        <Plus className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <CardTitle className="text-sm leading-snug text-muted-foreground">
                                        {t('Custom Framework')}
                                    </CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-xs text-muted-foreground">
                                    {t('Create a framework from scratch')}
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                ) : (
                    <div className="max-w-2xl space-y-6">
                        <Button
                            variant="ghost"
                            className="-ml-2"
                            onClick={() => setMode('select')}
                        >
                            <ChevronLeft className="mr-1 h-4 w-4" />
                            {t('Back to templates')}
                        </Button>

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
                                            placeholder="ISO 27001"
                                        />
                                        <InputError message={errors.name} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="description">{t('Description')}</Label>
                                        <textarea
                                            id="description"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            placeholder={t('Describe the framework...')}
                                            rows={4}
                                            className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                        />
                                        <InputError message={errors.description} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="version">{t('Version')}</Label>
                                        <Input
                                            id="version"
                                            value={data.version}
                                            onChange={(e) => setData('version', e.target.value)}
                                            placeholder="2022"
                                        />
                                        <InputError message={errors.version} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="status">{t('Status')}</Label>
                                        <Select
                                            value={data.status}
                                            onValueChange={(value) => setData('status', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder={t('Select status')} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="draft">{t('Draft')}</SelectItem>
                                                <SelectItem value="active">{t('Active')}</SelectItem>
                                                <SelectItem value="archived">{t('Archived')}</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.status} />
                                    </div>

                                    <div className="flex justify-end">
                                        <Button type="submit" disabled={processing}>
                                            {t('Create Framework')}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
