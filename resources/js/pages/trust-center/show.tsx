import { Head, router, useForm } from '@inertiajs/react';
import { ExternalLink, Trash2 } from 'lucide-react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
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
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Organization } from '@/types';

type TrustCenterReference = {
    id: number;
    name: string;
    description: string | null;
    url: string;
    logo_url: string | null;
    rank: number;
};

type TrustCenterFile = {
    id: number;
    name: string;
    category: string;
    file_path: string;
    visibility: 'none' | 'private' | 'public';
};

type TrustCenterAccess = {
    id: number;
    email: string;
    name: string;
    company: string | null;
    state: 'requested' | 'granted' | 'rejected' | 'revoked';
    has_accepted_nda: boolean;
    created_at: string;
};

type TrustCenter = {
    id: number;
    is_active: boolean;
    slug: string;
    title: string;
    description: string | null;
    brand_color: string | null;
    logo_path: string | null;
    nda_file_path: string | null;
    references: TrustCenterReference[];
    files: TrustCenterFile[];
    accesses: TrustCenterAccess[];
};

function visibilityVariant(visibility: string) {
    switch (visibility) {
        case 'public':
            return 'default' as const;
        case 'private':
            return 'secondary' as const;
        case 'none':
        default:
            return 'outline' as const;
    }
}

function accessStateVariant(state: string) {
    switch (state) {
        case 'granted':
            return 'default' as const;
        case 'rejected':
            return 'destructive' as const;
        case 'revoked':
            return 'secondary' as const;
        case 'requested':
        default:
            return 'outline' as const;
    }
}

export default function TrustCenterShow({
    organization,
    trustCenter,
}: {
    organization: Organization;
    trustCenter: TrustCenter;
}) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Organizations', href: '/organizations' },
        { title: organization.name, href: `/organizations/${organization.id}` },
        { title: 'Trust Center', href: `/organizations/${organization.id}/trust-center` },
    ];

    const baseUrl = `/organizations/${organization.id}/trust-center`;

    const settingsForm = useForm({
        is_active: trustCenter.is_active,
        slug: trustCenter.slug,
        title: trustCenter.title,
        description: trustCenter.description ?? '',
        brand_color: trustCenter.brand_color ?? '#000000',
    });

    function handleSettingsSubmit(e: React.FormEvent) {
        e.preventDefault();
        settingsForm.put(baseUrl);
    }

    const referenceForm = useForm({
        name: '',
        description: '',
        url: '',
        rank: 0,
    });

    function handleReferenceSubmit(e: React.FormEvent) {
        e.preventDefault();
        referenceForm.post(`${baseUrl}/references`, {
            onSuccess: () => referenceForm.reset(),
        });
    }

    function handleReferenceDelete(referenceId: number) {
        if (window.confirm('Are you sure you want to delete this reference?')) {
            router.delete(`${baseUrl}/references/${referenceId}`);
        }
    }

    const fileForm = useForm<{
        name: string;
        category: string;
        file: File | null;
        visibility: string;
    }>({
        name: '',
        category: '',
        file: null,
        visibility: 'public',
    });

    function handleFileSubmit(e: React.FormEvent) {
        e.preventDefault();
        fileForm.post(`${baseUrl}/files`, {
            forceFormData: true,
            onSuccess: () => fileForm.reset(),
        });
    }

    function handleFileDelete(fileId: number) {
        if (window.confirm('Are you sure you want to delete this file?')) {
            router.delete(`${baseUrl}/files/${fileId}`);
        }
    }

    function handleAccessUpdate(accessId: number, state: string) {
        router.put(`${baseUrl}/accesses/${accessId}`, { state });
    }

    function handleAccessDelete(accessId: number) {
        if (window.confirm('Are you sure you want to delete this access record?')) {
            router.delete(`${baseUrl}/accesses/${accessId}`);
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Trust Center" />

            <div className="mx-auto w-full max-w-4xl space-y-8 p-6">
                <Heading
                    title="Trust Center"
                    description="Manage your organization's public trust center"
                />

                {/* Settings Section */}
                <Card>
                    <CardContent className="pt-6">
                        <h3 className="mb-4 text-lg font-medium">Settings</h3>
                        <form onSubmit={handleSettingsSubmit} className="space-y-6">
                            <div className="flex items-center gap-3">
                                <Checkbox
                                    id="is_active"
                                    checked={settingsForm.data.is_active}
                                    onCheckedChange={(checked) =>
                                        settingsForm.setData('is_active', checked === true)
                                    }
                                />
                                <Label htmlFor="is_active">Active</Label>
                                <InputError message={settingsForm.errors.is_active} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="slug">Slug</Label>
                                <Input
                                    id="slug"
                                    value={settingsForm.data.slug}
                                    onChange={(e) => settingsForm.setData('slug', e.target.value)}
                                    required
                                />
                                <InputError message={settingsForm.errors.slug} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    value={settingsForm.data.title}
                                    onChange={(e) => settingsForm.setData('title', e.target.value)}
                                    required
                                />
                                <InputError message={settingsForm.errors.title} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="description">Description</Label>
                                <textarea
                                    id="description"
                                    value={settingsForm.data.description}
                                    onChange={(e) => settingsForm.setData('description', e.target.value)}
                                    rows={4}
                                    className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                />
                                <InputError message={settingsForm.errors.description} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="brand_color">Brand Color</Label>
                                <div className="flex items-center gap-3">
                                    <input
                                        id="brand_color"
                                        type="color"
                                        value={settingsForm.data.brand_color}
                                        onChange={(e) => settingsForm.setData('brand_color', e.target.value)}
                                        className="h-10 w-14 cursor-pointer rounded border p-1"
                                    />
                                    <Input
                                        value={settingsForm.data.brand_color}
                                        onChange={(e) => settingsForm.setData('brand_color', e.target.value)}
                                        className="max-w-32"
                                    />
                                </div>
                                <InputError message={settingsForm.errors.brand_color} />
                            </div>

                            <div className="flex justify-end">
                                <Button type="submit" disabled={settingsForm.processing}>
                                    Save Settings
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* References Section */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium">References</h3>

                    {trustCenter.references.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <p className="text-sm text-muted-foreground">
                                    No references added yet.
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>URL</TableHead>
                                        <TableHead>Rank</TableHead>
                                        <TableHead className="w-[50px]" />
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {trustCenter.references.map((reference) => (
                                        <TableRow key={reference.id}>
                                            <TableCell className="font-medium">{reference.name}</TableCell>
                                            <TableCell>
                                                <a
                                                    href={reference.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1 hover:underline"
                                                >
                                                    {reference.url}
                                                    <ExternalLink className="h-3 w-3" />
                                                </a>
                                            </TableCell>
                                            <TableCell>{reference.rank}</TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleReferenceDelete(reference.id)}
                                                >
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Card>
                    )}

                    <Card>
                        <CardContent className="pt-6">
                            <h4 className="mb-4 text-sm font-medium">Add Reference</h4>
                            <form onSubmit={handleReferenceSubmit} className="space-y-4">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="ref_name">Name</Label>
                                        <Input
                                            id="ref_name"
                                            value={referenceForm.data.name}
                                            onChange={(e) => referenceForm.setData('name', e.target.value)}
                                            required
                                        />
                                        <InputError message={referenceForm.errors.name} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="ref_url">URL</Label>
                                        <Input
                                            id="ref_url"
                                            type="url"
                                            value={referenceForm.data.url}
                                            onChange={(e) => referenceForm.setData('url', e.target.value)}
                                            required
                                        />
                                        <InputError message={referenceForm.errors.url} />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="ref_description">Description</Label>
                                    <textarea
                                        id="ref_description"
                                        value={referenceForm.data.description}
                                        onChange={(e) => referenceForm.setData('description', e.target.value)}
                                        rows={2}
                                        className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                    />
                                    <InputError message={referenceForm.errors.description} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="ref_rank">Rank</Label>
                                    <Input
                                        id="ref_rank"
                                        type="number"
                                        value={referenceForm.data.rank}
                                        onChange={(e) => referenceForm.setData('rank', parseInt(e.target.value) || 0)}
                                        className="max-w-32"
                                    />
                                    <InputError message={referenceForm.errors.rank} />
                                </div>
                                <div className="flex justify-end">
                                    <Button type="submit" disabled={referenceForm.processing}>
                                        Add Reference
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* Files Section */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Files</h3>

                    {trustCenter.files.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <p className="text-sm text-muted-foreground">
                                    No files added yet.
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Visibility</TableHead>
                                        <TableHead className="w-[50px]" />
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {trustCenter.files.map((file) => (
                                        <TableRow key={file.id}>
                                            <TableCell className="font-medium">{file.name}</TableCell>
                                            <TableCell>{file.category}</TableCell>
                                            <TableCell>
                                                <Badge variant={visibilityVariant(file.visibility)}>
                                                    {file.visibility}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleFileDelete(file.id)}
                                                >
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Card>
                    )}

                    <Card>
                        <CardContent className="pt-6">
                            <h4 className="mb-4 text-sm font-medium">Add File</h4>
                            <form onSubmit={handleFileSubmit} className="space-y-4">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="file_name">Name</Label>
                                        <Input
                                            id="file_name"
                                            value={fileForm.data.name}
                                            onChange={(e) => fileForm.setData('name', e.target.value)}
                                            required
                                        />
                                        <InputError message={fileForm.errors.name} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="file_category">Category</Label>
                                        <Input
                                            id="file_category"
                                            value={fileForm.data.category}
                                            onChange={(e) => fileForm.setData('category', e.target.value)}
                                            required
                                        />
                                        <InputError message={fileForm.errors.category} />
                                    </div>
                                </div>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="file_upload">File</Label>
                                        <Input
                                            id="file_upload"
                                            type="file"
                                            onChange={(e) => fileForm.setData('file', e.target.files?.[0] ?? null)}
                                            required
                                        />
                                        <InputError message={fileForm.errors.file} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="file_visibility">Visibility</Label>
                                        <Select
                                            value={fileForm.data.visibility}
                                            onValueChange={(value) => fileForm.setData('visibility', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select visibility" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="none">None</SelectItem>
                                                <SelectItem value="private">Private</SelectItem>
                                                <SelectItem value="public">Public</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <InputError message={fileForm.errors.visibility} />
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <Button type="submit" disabled={fileForm.processing}>
                                        Add File
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* Access Requests Section */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Access Requests</h3>

                    {trustCenter.accesses.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <p className="text-sm text-muted-foreground">
                                    No access requests yet.
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Company</TableHead>
                                        <TableHead>State</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead className="w-[150px]" />
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {trustCenter.accesses.map((access) => (
                                        <TableRow key={access.id}>
                                            <TableCell className="font-medium">{access.name}</TableCell>
                                            <TableCell>{access.email}</TableCell>
                                            <TableCell>{access.company || '-'}</TableCell>
                                            <TableCell>
                                                <Badge variant={accessStateVariant(access.state)}>
                                                    {access.state}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {new Date(access.created_at).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex gap-1">
                                                    {access.state === 'requested' && (
                                                        <>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleAccessUpdate(access.id, 'granted')}
                                                            >
                                                                Grant
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleAccessUpdate(access.id, 'rejected')}
                                                            >
                                                                Reject
                                                            </Button>
                                                        </>
                                                    )}
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleAccessDelete(access.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4 text-destructive" />
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
            </div>
        </AppLayout>
    );
}
