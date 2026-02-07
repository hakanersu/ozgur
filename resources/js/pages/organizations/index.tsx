import { Head, Link } from '@inertiajs/react';
import { Building2, Plus, Users } from 'lucide-react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTrans } from '@/hooks/use-trans';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Organization } from '@/types';

export default function OrganizationsIndex({
    organizations,
}: {
    organizations: Organization[];
}) {
    const { t } = useTrans();

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('Organizations'), href: '/organizations' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('Organizations')} />

            <div className="mx-auto w-full max-w-4xl space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <Heading
                        title={t('Organizations')}
                        description={t('Manage your compliance organizations')}
                    />
                    <Button asChild>
                        <Link href="/organizations/create">
                            <Plus className="mr-2 h-4 w-4" />
                            {t('New Organization')}
                        </Link>
                    </Button>
                </div>

                {organizations.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <Building2 className="mb-4 h-12 w-12 text-muted-foreground" />
                            <h3 className="mb-2 text-lg font-medium">
                                {t('No organizations yet')}
                            </h3>
                            <p className="mb-4 text-sm text-muted-foreground">
                                {t('Create your first organization to get started with compliance management.')}
                            </p>
                            <Button asChild>
                                <Link href="/organizations/create">
                                    <Plus className="mr-2 h-4 w-4" />
                                    {t('Create Organization')}
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                        {organizations.map((org) => (
                            <Link
                                key={org.id}
                                href={`/organizations/${org.id}`}
                            >
                                <Card className="transition-colors hover:bg-muted/50">
                                    <CardHeader className="flex flex-row items-center gap-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                            <Building2 className="h-5 w-5 text-primary" />
                                        </div>
                                        <div className="flex-1">
                                            <CardTitle className="text-base">
                                                {org.name}
                                            </CardTitle>
                                            <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                                                <Users className="h-3.5 w-3.5" />
                                                <span>
                                                    {org.memberships_count}{' '}
                                                    {org.memberships_count === 1
                                                        ? t('member')
                                                        : t('members')}
                                                </span>
                                            </div>
                                        </div>
                                    </CardHeader>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
