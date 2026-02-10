import { Head, Link, router, useForm } from '@inertiajs/react';
import { Check, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useTrans } from '@/hooks/use-trans';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Organization } from '@/types';

type DocumentVersion = {
    id: number;
    version_number: number;
    title: string;
    status: string;
    published_at: string | null;
};

type Document = {
    id: number;
    title: string;
    document_type: string;
    classification: string;
    current_published_version: number | null;
    versions: DocumentVersion[];
    created_at: string;
    updated_at: string;
};

function classificationVariant(classification: string) {
    switch (classification) {
        case 'public':
            return 'default';
        case 'internal':
            return 'secondary';
        case 'confidential':
            return 'outline';
        case 'secret':
            return 'destructive';
        default:
            return 'outline';
    }
}

function statusVariant(status: string) {
    switch (status) {
        case 'published':
            return 'default';
        case 'draft':
            return 'outline';
        default:
            return 'outline';
    }
}

export default function DocumentShow({
    organization,
    document,
}: {
    organization: Organization;
    document: Document;
}) {
    const { t } = useTrans();

    function formatDocumentType(type: string) {
        switch (type) {
            case 'isms':
                return t('ISMS');
            case 'policy':
                return t('Policy');
            case 'procedure':
                return t('Procedure');
            case 'other':
                return t('Other');
            default:
                return type;
        }
    }

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('Organizations'), href: '/organizations' },
        { title: organization.name, href: `/organizations/${organization.id}` },
        { title: t('Documents'), href: `/organizations/${organization.id}/documents` },
        { title: document.title, href: `/organizations/${organization.id}/documents/${document.id}` },
    ];

    const [dialogOpen, setDialogOpen] = useState(false);
    const deleteForm = useForm({});
    const versionForm = useForm({
        title: '',
        classification: document.classification,
        content: '',
        changelog: '',
    });

    function handleDelete() {
        if (window.confirm(t('Are you sure you want to delete this document?'))) {
            deleteForm.delete(`/organizations/${organization.id}/documents/${document.id}`);
        }
    }

    function handleCreateVersion(e: React.FormEvent) {
        e.preventDefault();
        versionForm.post(`/organizations/${organization.id}/documents/${document.id}/versions`, {
            onSuccess: () => {
                setDialogOpen(false);
                versionForm.reset();
            },
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={document.title} />

            <div className="mx-auto w-full max-w-4xl space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <Heading
                        title={document.title}
                    />
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href={`/organizations/${organization.id}/documents/${document.id}/edit`}>
                                <Pencil className="mr-2 h-4 w-4" />
                                {t('Edit')}
                            </Link>
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={deleteForm.processing}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            {t('Delete')}
                        </Button>
                    </div>
                </div>

                <Card>
                    <CardContent className="pt-6">
                        <dl className="grid gap-4 sm:grid-cols-4">
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">{t('Type')}</dt>
                                <dd className="mt-1 text-sm">{formatDocumentType(document.document_type)}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">{t('Classification')}</dt>
                                <dd className="mt-1">
                                    <Badge variant={classificationVariant(document.classification)}>
                                        {document.classification}
                                    </Badge>
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">{t('Published Version')}</dt>
                                <dd className="mt-1 text-sm">{document.current_published_version ?? '-'}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">{t('Total Versions')}</dt>
                                <dd className="mt-1 text-sm">{document.versions.length}</dd>
                            </div>
                        </dl>
                    </CardContent>
                </Card>

                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">{t('Versions')}</h3>
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm">
                                <Plus className="mr-2 h-4 w-4" />
                                {t('New Version')}
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{t('Create New Version')}</DialogTitle>
                                <DialogDescription>
                                    {t('Add a new version to this document.')}
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleCreateVersion} className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="version-title">{t('Title')}</Label>
                                    <Input
                                        id="version-title"
                                        value={versionForm.data.title}
                                        onChange={(e) => versionForm.setData('title', e.target.value)}
                                        required
                                        placeholder={t('Version title')}
                                    />
                                    <InputError message={versionForm.errors.title} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="version-classification">{t('Classification')}</Label>
                                    <Select
                                        value={versionForm.data.classification}
                                        onValueChange={(value) => versionForm.setData('classification', value)}
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
                                    <InputError message={versionForm.errors.classification} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="version-content">{t('Content')}</Label>
                                    <textarea
                                        id="version-content"
                                        className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50"
                                        value={versionForm.data.content}
                                        onChange={(e) => versionForm.setData('content', e.target.value)}
                                        placeholder={t('Version content')}
                                        rows={4}
                                    />
                                    <InputError message={versionForm.errors.content} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="version-changelog">{t('Changelog')}</Label>
                                    <textarea
                                        id="version-changelog"
                                        className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[60px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50"
                                        value={versionForm.data.changelog}
                                        onChange={(e) => versionForm.setData('changelog', e.target.value)}
                                        placeholder={t('What changed in this version?')}
                                        rows={2}
                                    />
                                    <InputError message={versionForm.errors.changelog} />
                                </div>

                                <DialogFooter className="gap-2">
                                    <DialogClose asChild>
                                        <Button variant="secondary" type="button">
                                            {t('Cancel')}
                                        </Button>
                                    </DialogClose>
                                    <Button type="submit" disabled={versionForm.processing}>
                                        {t('Create Version')}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {document.versions.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <p className="text-sm text-muted-foreground">
                                {t('No versions created yet.')}
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <Card>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>{t('Version')}</TableHead>
                                    <TableHead>{t('Title')}</TableHead>
                                    <TableHead>{t('Status')}</TableHead>
                                    <TableHead>{t('Published At')}</TableHead>
                                    <TableHead className="text-right">{t('Actions')}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {document.versions.map((version) => (
                                    <TableRow key={version.id}>
                                        <TableCell className="font-mono text-sm">
                                            v{version.version_number}
                                        </TableCell>
                                        <TableCell>
                                            <Link
                                                href={`/organizations/${organization.id}/documents/${document.id}/versions/${version.id}`}
                                                className="hover:underline"
                                            >
                                                {version.title}
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={statusVariant(version.status)}>
                                                {version.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {version.published_at ?? '-'}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-1">
                                                {version.status !== 'published' && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => {
                                                            router.post(
                                                                `/organizations/${organization.id}/documents/${document.id}/versions/${version.id}/publish`,
                                                            );
                                                        }}
                                                    >
                                                        <Check className="mr-1 h-3 w-3" />
                                                        {t('Publish')}
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => {
                                                        if (window.confirm(t('Are you sure you want to delete this version?'))) {
                                                            router.delete(
                                                                `/organizations/${organization.id}/documents/${document.id}/versions/${version.id}`,
                                                            );
                                                        }
                                                    }}
                                                >
                                                    <Trash2 className="h-3 w-3 text-destructive" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
