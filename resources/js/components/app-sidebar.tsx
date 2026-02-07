import { Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    Building2,
    CalendarDays,
    CheckSquare,
    ClipboardCheck,
    FileText,
    Folder,
    Fingerprint,
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
import type { NavItem, SharedData } from '@/types';
import AppLogo from './app-logo';

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

function getMainNavItems(organizationId?: number): NavItem[] {
    if (!organizationId) {
        return [
            {
                title: 'Dashboard',
                href: '/dashboard',
                icon: LayoutGrid,
            },
            {
                title: 'Organizations',
                href: '/organizations',
                icon: Building2,
            },
        ];
    }

    const prefix = `/organizations/${organizationId}`;

    return [
        {
            title: 'Dashboard',
            href: prefix,
            icon: LayoutGrid,
        },
        {
            title: 'Frameworks',
            href: `${prefix}/frameworks`,
            icon: Shield,
        },
        {
            title: 'Measures',
            href: `${prefix}/measures`,
            icon: ClipboardCheck,
        },
        {
            title: 'Risks',
            href: `${prefix}/risks`,
            icon: ShieldAlert,
        },
        {
            title: 'Audits',
            href: `${prefix}/audits`,
            icon: Scale,
        },
        {
            title: 'Documents',
            href: `${prefix}/documents`,
            icon: FileText,
        },
        {
            title: 'Vendors',
            href: `${prefix}/vendors`,
            icon: Building2,
        },
        {
            title: 'People',
            href: `${prefix}/people`,
            icon: UserCircle,
        },
        {
            title: 'Tasks',
            href: `${prefix}/tasks`,
            icon: CheckSquare,
        },
        {
            title: 'Meetings',
            href: `${prefix}/meetings`,
            icon: CalendarDays,
        },
        {
            title: 'Processing Activities',
            href: `${prefix}/processing-activities`,
            icon: Fingerprint,
        },
        {
            title: 'Rights Requests',
            href: `${prefix}/rights-requests`,
            icon: ShieldCheck,
        },
        {
            title: 'Members',
            href: `${prefix}/members`,
            icon: Users,
        },
    ];
}

export function AppSidebar() {
    const { currentOrganization } = usePage<SharedData>().props;
    const mainNavItems = getMainNavItems(currentOrganization?.id);

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
