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
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Organization } from '@/types';

export default function DocumentCreate({
    organization,
}: {
    organization: Organization;
}) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Organizations', href: '/organizations' },
        { title: organization.name, href: `/organizations/${organization.id}` },
        { title: 'Documents', href: `/organizations/${organization.id}/documents` },
        { title: 'Create', href: `/organizations/${organization.id}/documents/create` },
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
            <Head title="Create Document" />

            <div className="mx-auto w-full max-w-2xl space-y-6 p-6">
                <Heading
                    title="Create Document"
                    description="Add a new compliance document"
                />

                <Card>
                    <CardContent className="pt-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid gap-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    required
                                    placeholder="Information Security Policy"
                                />
                                <InputError message={errors.title} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="document_type">Document Type</Label>
                                <Select
                                    value={data.document_type}
                                    onValueChange={(value) => setData('document_type', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="other">Other</SelectItem>
                                        <SelectItem value="isms">ISMS</SelectItem>
                                        <SelectItem value="policy">Policy</SelectItem>
                                        <SelectItem value="procedure">Procedure</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.document_type} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="classification">Classification</Label>
                                <Select
                                    value={data.classification}
                                    onValueChange={(value) => setData('classification', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select classification" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="public">Public</SelectItem>
                                        <SelectItem value="internal">Internal</SelectItem>
                                        <SelectItem value="confidential">Confidential</SelectItem>
                                        <SelectItem value="secret">Secret</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.classification} />
                            </div>

                            <div className="flex justify-end">
                                <Button type="submit" disabled={processing}>
                                    Create Document
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
