import { Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    Activity,
    Box,
    Building2,
    CalendarDays,
    Camera,
    CheckSquare,
    ClipboardCheck,
    FileText,
    Folder,
    Fingerprint,
    Globe,
    LayoutGrid,
    Scale,
    Shield,
    ShieldAlert,
    ShieldCheck,
    UserCircle,
    Users,
} from 'lucide-react';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useTrans } from '@/hooks/use-trans';
import type { NavItem, SharedData } from '@/types';
import AppLogo from './app-logo';

function useFooterNavItems(): NavItem[] {
    const { t } = useTrans();

    return [
        {
            title: t('Repository'),
            href: 'https://github.com/laravel/react-starter-kit',
            icon: Folder,
        },
        {
            title: t('Documentation'),
            href: 'https://laravel.com/docs/starter-kits#react',
            icon: BookOpen,
        },
    ];
}

function useMainNavItems(organizationId?: number): NavItem[] {
    const { t } = useTrans();

    if (!organizationId) {
        return [
            {
                title: t('Dashboard'),
                href: '/dashboard',
                icon: LayoutGrid,
            },
            {
                title: t('Organizations'),
                href: '/organizations',
                icon: Building2,
            },
        ];
    }

    const prefix = `/organizations/${organizationId}`;

    return [
        {
            title: t('Dashboard'),
            href: prefix,
            icon: LayoutGrid,
        },
        {
            title: t('Frameworks'),
            href: `${prefix}/frameworks`,
            icon: Shield,
        },
        {
            title: t('Measures'),
            href: `${prefix}/measures`,
            icon: ClipboardCheck,
        },
        {
            title: t('Risks'),
            href: `${prefix}/risks`,
            icon: ShieldAlert,
        },
        {
            title: t('Audits'),
            href: `${prefix}/audits`,
            icon: Scale,
        },
        {
            title: t('Documents'),
            href: `${prefix}/documents`,
            icon: FileText,
        },
        {
            title: t('Vendors'),
            href: `${prefix}/vendors`,
            icon: Building2,
        },
        {
            title: t('People'),
            href: `${prefix}/people`,
            icon: UserCircle,
        },
        {
            title: t('Tasks'),
            href: `${prefix}/tasks`,
            icon: CheckSquare,
        },
        {
            title: t('Meetings'),
            href: `${prefix}/meetings`,
            icon: CalendarDays,
        },
        {
            title: t('Assets'),
            href: `${prefix}/assets`,
            icon: Box,
        },
        {
            title: t('Snapshots'),
            href: `${prefix}/snapshots`,
            icon: Camera,
        },
        {
            title: t('Processing Activities'),
            href: `${prefix}/processing-activities`,
            icon: Fingerprint,
        },
        {
            title: t('Rights Requests'),
            href: `${prefix}/rights-requests`,
            icon: ShieldCheck,
        },
        {
            title: t('Trust Center'),
            href: `${prefix}/trust-center`,
            icon: Globe,
        },
        {
            title: t('Activity Log'),
            href: `${prefix}/activity-log`,
            icon: Activity,
        },
        {
            title: t('Members'),
            href: `${prefix}/members`,
            icon: Users,
        },
    ];
}

export function AppSidebar() {
    const { currentOrganization } = usePage<SharedData>().props;
    const mainNavItems = useMainNavItems(currentOrganization?.id);
    const footerNavItems = useFooterNavItems();

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
