import { Head, useForm, usePage } from '@inertiajs/react';
import { ExternalLink, FileText } from 'lucide-react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTrans } from '@/hooks/use-trans';
import type { Organization } from '@/types';

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

type TrustCenter = {
    id: number;
    slug: string;
    title: string;
    description: string | null;
    brand_color: string | null;
    logo_path: string | null;
    organization: { name: string };
};

function groupFilesByCategory(files: TrustCenterFile[]) {
    return files.reduce<Record<string, TrustCenterFile[]>>((groups, file) => {
        const category = file.category || 'Other';
        if (!groups[category]) {
            groups[category] = [];
        }
        groups[category].push(file);
        return groups;
    }, {});
}

export default function PublicTrustCenterShow({
    trustCenter,
    organization,
    references,
    files,
}: {
    trustCenter: TrustCenter;
    organization: Organization;
    references: TrustCenterReference[];
    files: TrustCenterFile[];
}) {
    const { t } = useTrans();
    const page = usePage();
    const flash = (page.props as Record<string, unknown>).success as string | undefined;

    const form = useForm({
        email: '',
        name: '',
        company: '',
    });

    function handleRequestAccess(e: React.FormEvent) {
        e.preventDefault();
        form.post(`/trust/${trustCenter.slug}/request-access`, {
            onSuccess: () => form.reset(),
        });
    }

    const groupedFiles = groupFilesByCategory(files);

    return (
        <>
            <Head title={trustCenter.title || `${organization.name} Trust Center`} />

            <div className="bg-background min-h-screen">
                <header className="border-b">
                    <div className="mx-auto max-w-4xl px-6 py-4">
                        <h1 className="text-xl font-semibold">
                            {trustCenter.title || `${organization.name} Trust Center`}
                        </h1>
                    </div>
                </header>

                <main className="mx-auto max-w-4xl space-y-8 p-6">
                    {/* Description */}
                    {trustCenter.description && (
                        <section>
                            <p className="text-muted-foreground">{trustCenter.description}</p>
                        </section>
                    )}

                    {/* References */}
                    {references.length > 0 && (
                        <section>
                            <h2 className="mb-4 text-lg font-medium">{t('References')}</h2>
                            <Card>
                                <CardContent className="divide-y pt-6">
                                    {references.map((reference) => (
                                        <div key={reference.id} className="py-3 first:pt-0 last:pb-0">
                                            <a
                                                href={reference.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 font-medium hover:underline"
                                            >
                                                {reference.name}
                                                <ExternalLink className="h-3.5 w-3.5" />
                                            </a>
                                            {reference.description && (
                                                <p className="mt-1 text-sm text-muted-foreground">
                                                    {reference.description}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </section>
                    )}

                    {/* Files */}
                    {files.length > 0 && (
                        <section>
                            <h2 className="mb-4 text-lg font-medium">{t('Documents')}</h2>
                            {Object.entries(groupedFiles).map(([category, categoryFiles]) => (
                                <div key={category} className="mb-4">
                                    <h3 className="mb-2 text-sm font-medium text-muted-foreground">
                                        {category}
                                    </h3>
                                    <Card>
                                        <CardContent className="divide-y pt-6">
                                            {categoryFiles.map((file) => (
                                                <div
                                                    key={file.id}
                                                    className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                                                >
                                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                                    <a
                                                        href={`/storage/${file.file_path}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-sm font-medium hover:underline"
                                                    >
                                                        {file.name}
                                                    </a>
                                                </div>
                                            ))}
                                        </CardContent>
                                    </Card>
                                </div>
                            ))}
                        </section>
                    )}

                    {/* Request Access */}
                    <section>
                        <h2 className="mb-4 text-lg font-medium">{t('Request Access')}</h2>
                        <Card>
                            <CardContent className="pt-6">
                                {flash && (
                                    <div className="mb-4 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200">
                                        {flash}
                                    </div>
                                )}
                                <form onSubmit={handleRequestAccess} className="space-y-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="access_email">{t('Email')}</Label>
                                        <Input
                                            id="access_email"
                                            type="email"
                                            value={form.data.email}
                                            onChange={(e) => form.setData('email', e.target.value)}
                                            required
                                            placeholder="you@example.com"
                                        />
                                        <InputError message={form.errors.email} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="access_name">{t('Name')}</Label>
                                        <Input
                                            id="access_name"
                                            value={form.data.name}
                                            onChange={(e) => form.setData('name', e.target.value)}
                                            required
                                            placeholder={t('Your full name')}
                                        />
                                        <InputError message={form.errors.name} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="access_company">{t('Company')}</Label>
                                        <Input
                                            id="access_company"
                                            value={form.data.company}
                                            onChange={(e) => form.setData('company', e.target.value)}
                                            placeholder={t('Your company name')}
                                        />
                                        <InputError message={form.errors.company} />
                                    </div>
                                    <div className="flex justify-end">
                                        <Button type="submit" disabled={form.processing}>
                                            {t('Request Access')}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </section>
                </main>
            </div>
        </>
    );
}
