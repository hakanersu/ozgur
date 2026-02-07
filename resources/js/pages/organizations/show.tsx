import { Head, Link } from '@inertiajs/react';
import {
    Box,
    Building2,
    CalendarDays,
    CheckSquare,
    ClipboardCheck,
    FileText,
    Fingerprint,
    Globe,
    Scale,
    Settings,
    Shield,
    ShieldAlert,
    ShieldCheck,
    UserCircle,
    Users,
} from 'lucide-react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Organization } from '@/types';

type Stats = {
    frameworks: number;
    controls: number;
    measures: number;
    risks: number;
    audits: number;
    documents: number;
    vendors: number;
    people: number;
    tasks: number;
    meetings: number;
    assets: number;
    processing_activities: number;
    rights_requests: number;
};

export default function OrganizationShow({
    organization,
    stats,
}: {
    organization: Organization;
    stats: Stats;
}) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Organizations', href: '/organizations' },
        {
            title: organization.name,
            href: `/organizations/${organization.id}`,
        },
    ];

    const prefix = `/organizations/${organization.id}`;

    const modules = [
        { title: 'Frameworks', count: stats.frameworks, icon: Shield, href: `${prefix}/frameworks` },
        { title: 'Controls', count: stats.controls, icon: ClipboardCheck, href: `${prefix}/controls` },
        { title: 'Measures', count: stats.measures, icon: ClipboardCheck, href: `${prefix}/measures` },
        { title: 'Risks', count: stats.risks, icon: ShieldAlert, href: `${prefix}/risks` },
        { title: 'Audits', count: stats.audits, icon: Scale, href: `${prefix}/audits` },
        { title: 'Documents', count: stats.documents, icon: FileText, href: `${prefix}/documents` },
        { title: 'Vendors', count: stats.vendors, icon: Building2, href: `${prefix}/vendors` },
        { title: 'People', count: stats.people, icon: UserCircle, href: `${prefix}/people` },
        { title: 'Tasks', count: stats.tasks, icon: CheckSquare, href: `${prefix}/tasks` },
        { title: 'Meetings', count: stats.meetings, icon: CalendarDays, href: `${prefix}/meetings` },
        { title: 'Assets', count: stats.assets, icon: Box, href: `${prefix}/assets` },
        { title: 'Processing Activities', count: stats.processing_activities, icon: Fingerprint, href: `${prefix}/processing-activities` },
        { title: 'Rights Requests', count: stats.rights_requests, icon: ShieldCheck, href: `${prefix}/rights-requests` },
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
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href={`${prefix}/trust-center`}>
                                <Globe className="mr-2 h-4 w-4" />
                                Trust Center
                            </Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href={`${prefix}/edit`}>
                                <Settings className="mr-2 h-4 w-4" />
                                Settings
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {modules.map((module) => (
                        <Link key={module.title} href={module.href}>
                            <Card className="transition-colors hover:bg-muted/50">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">
                                        {module.title}
                                    </CardTitle>
                                    <module.icon className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{module.count}</div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>

                <Link href={`${prefix}/members`}>
                    <Card className="transition-colors hover:bg-muted/50">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Members
                            </CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{organization.memberships_count}</div>
                        </CardContent>
                    </Card>
                </Link>
            </div>
        </AppLayout>
    );
}
