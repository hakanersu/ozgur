import { Head, Link, useForm } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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

    const deleteForm = useForm({});

    function handleDelete() {
        if (window.confirm(t('Are you sure you want to delete this document?'))) {
            deleteForm.delete(`/organizations/${organization.id}/documents/${document.id}`);
        }
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
                    <Button size="sm" asChild>
                        <Link href={`/organizations/${organization.id}/documents/${document.id}/versions/create`}>
                            <Plus className="mr-2 h-4 w-4" />
                            {t('New Version')}
                        </Link>
                    </Button>
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
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {document.versions.map((version) => (
                                    <TableRow key={version.id}>
                                        <TableCell className="font-mono text-sm">
                                            v{version.version_number}
                                        </TableCell>
                                        <TableCell>{version.title}</TableCell>
                                        <TableCell>
                                            <Badge variant={statusVariant(version.status)}>
                                                {version.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {version.published_at ?? '-'}
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
