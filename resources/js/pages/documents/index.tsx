import { Head, Link } from '@inertiajs/react';
import { FileText, Plus } from 'lucide-react';
import Heading from '@/components/heading';
import SearchInput from '@/components/search-input';
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
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Organization } from '@/types';

type Document = {
    id: number;
    title: string;
    document_type: string;
    classification: string;
    current_published_version: number | null;
    versions_count: number;
    created_at: string;
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

function formatDocumentType(type: string) {
    switch (type) {
        case 'isms':
            return 'ISMS';
        case 'policy':
            return 'Policy';
        case 'procedure':
            return 'Procedure';
        case 'other':
            return 'Other';
        default:
            return type;
    }
}

export default function DocumentsIndex({
    organization,
    documents,
    filters,
}: {
    organization: Organization;
    documents: Document[];
    filters: { search: string };
}) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Organizations', href: '/organizations' },
        { title: organization.name, href: `/organizations/${organization.id}` },
        { title: 'Documents', href: `/organizations/${organization.id}/documents` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Documents" />

            <div className="mx-auto w-full max-w-4xl space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <Heading
                        title="Documents"
                        description="Manage compliance documents and their versions"
                    />
                    <Button asChild>
                        <Link href={`/organizations/${organization.id}/documents/create`}>
                            <Plus className="mr-2 h-4 w-4" />
                            New Document
                        </Link>
                    </Button>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex-1">
                        <SearchInput
                            value={filters.search}
                            placeholder="Search documents..."
                        />
                    </div>
                </div>

                {documents.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
                            <h3 className="mb-2 text-lg font-medium">No documents yet</h3>
                            <p className="mb-4 text-sm text-muted-foreground">
                                Create your first document to start managing compliance documentation.
                            </p>
                            <Button asChild>
                                <Link href={`/organizations/${organization.id}/documents/create`}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create Document
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <Card>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Classification</TableHead>
                                    <TableHead>Published Version</TableHead>
                                    <TableHead className="text-right">Versions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {documents.map((document) => (
                                    <TableRow key={document.id}>
                                        <TableCell>
                                            <Link
                                                href={`/organizations/${organization.id}/documents/${document.id}`}
                                                className="font-medium hover:underline"
                                            >
                                                {document.title}
                                            </Link>
                                        </TableCell>
                                        <TableCell>{formatDocumentType(document.document_type)}</TableCell>
                                        <TableCell>
                                            <Badge variant={classificationVariant(document.classification)}>
                                                {document.classification}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {document.current_published_version ?? '-'}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {document.versions_count}
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
