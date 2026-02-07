import { Head, Link } from '@inertiajs/react';
import {
    Building2,
    FileText,
    LayoutGrid,
    Settings,
    Shield,
    Users,
} from 'lucide-react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Organization } from '@/types';

export default function OrganizationShow({
    organization,
}: {
    organization: Organization;
}) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Organizations', href: '/organizations' },
        {
            title: organization.name,
            href: `/organizations/${organization.id}`,
        },
    ];

    const modules = [
        {
            title: 'Frameworks',
            description: 'Manage compliance frameworks and controls',
            icon: Shield,
            href: `/organizations/${organization.id}/frameworks`,
        },
        {
            title: 'Risks',
            description: 'Track and manage organizational risks',
            icon: LayoutGrid,
            href: `/organizations/${organization.id}/risks`,
        },
        {
            title: 'Documents',
            description: 'Manage compliance documents',
            icon: FileText,
            href: `/organizations/${organization.id}/documents`,
        },
        {
            title: 'Members',
            description: 'Manage team members and roles',
            icon: Users,
            href: `/organizations/${organization.id}/members`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={organization.name} />

            <div className="mx-auto w-full max-w-4xl space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <Heading
                        title={organization.name}
                        description={`${organization.memberships_count} ${organization.memberships_count === 1 ? 'member' : 'members'}`}
                    />
                    <Button variant="outline" asChild>
                        <Link
                            href={`/organizations/${organization.id}/edit`}
                        >
                            <Settings className="mr-2 h-4 w-4" />
                            Settings
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    {modules.map((module) => (
                        <Link key={module.title} href={module.href}>
                            <Card className="transition-colors hover:bg-muted/50">
                                <CardHeader className="flex flex-row items-center gap-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                        <module.icon className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-base">
                                            {module.title}
                                        </CardTitle>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            {module.description}
                                        </p>
                                    </div>
                                </CardHeader>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
