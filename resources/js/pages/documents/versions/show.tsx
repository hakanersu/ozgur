import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Printer, Save } from 'lucide-react';
import TiptapEditor from '@/components/tiptap-editor';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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

type DocumentVersion = {
    id: number;
    version_number: number;
    title: string;
    content: string | null;
    classification: string;
    changelog: string | null;
    status: string;
    published_at: string | null;
};

type Document = {
    id: number;
    title: string;
};

export default function VersionShow({
    organization,
    document,
    version,
}: {
    organization: Organization;
    document: Document;
    version: DocumentVersion;
}) {
    const { t } = useTrans();

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('Organizations'), href: '/organizations' },
        { title: organization.name, href: `/organizations/${organization.id}` },
        { title: t('Documents'), href: `/organizations/${organization.id}/documents` },
        { title: document.title, href: `/organizations/${organization.id}/documents/${document.id}` },
        { title: `v${version.version_number}`, href: `/organizations/${organization.id}/documents/${document.id}/versions/${version.id}` },
    ];

    const form = useForm({
        title: version.title,
        content: version.content ?? '',
        classification: version.classification,
        changelog: version.changelog ?? '',
    });

    function handleSave(e: React.FormEvent) {
        e.preventDefault();
        form.put(`/organizations/${organization.id}/documents/${document.id}/versions/${version.id}`);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${version.title} - v${version.version_number}`} />

            <form onSubmit={handleSave} className="flex h-full flex-col">
                {/* Top bar */}
                <div className="print:hidden flex items-center justify-between border-b px-4 py-2">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href={`/organizations/${organization.id}/documents/${document.id}`}>
                                <ArrowLeft className="size-4" />
                                {t('Back')}
                            </Link>
                        </Button>

                        <div className="flex items-center gap-2">
                            <Input
                                value={form.data.title}
                                onChange={(e) => form.setData('title', e.target.value)}
                                className="h-8 w-64 text-sm font-medium"
                                placeholder={t('Version title')}
                            />
                            <InputError message={form.errors.title} />
                        </div>

                        <Badge variant={version.status === 'published' ? 'default' : 'outline'}>
                            {version.status}
                        </Badge>

                        <span className="text-sm text-muted-foreground">v{version.version_number}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2">
                            <Label htmlFor="classification" className="sr-only">{t('Classification')}</Label>
                            <Select
                                value={form.data.classification}
                                onValueChange={(value) => form.setData('classification', value)}
                            >
                                <SelectTrigger className="h-8 w-32 text-xs">
                                    <SelectValue placeholder={t('Classification')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="public">{t('Public')}</SelectItem>
                                    <SelectItem value="internal">{t('Internal')}</SelectItem>
                                    <SelectItem value="confidential">{t('Confidential')}</SelectItem>
                                    <SelectItem value="secret">{t('Secret')}</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={form.errors.classification} />
                        </div>

                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => window.print()}
                        >
                            <Printer className="size-4" />
                            {t('Print')}
                        </Button>

                        <Button type="submit" size="sm" disabled={form.processing}>
                            <Save className="size-4" />
                            {form.processing ? t('Saving...') : t('Save')}
                        </Button>
                    </div>
                </div>

                {/* Editor area */}
                <div className="flex-1 overflow-y-auto bg-muted/30 print:bg-white">
                    <div className="mx-auto max-w-4xl py-8 print:py-0">
                        <div className="rounded-lg border bg-card shadow-sm print:border-0 print:shadow-none">
                            <TiptapEditor
                                content={form.data.content}
                                onChange={(html) => form.setData('content', html)}
                                placeholder={t('Start writing your document...')}
                            />
                        </div>
                        <InputError message={form.errors.content} className="mt-2 px-4" />
                    </div>
                </div>
            </form>
        </AppLayout>
    );
}
