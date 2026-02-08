export type * from './auth';
export type * from './navigation';
export type * from './ui';

import type { Auth } from './auth';

export type Organization = {
    id: number;
    name: string;
    slug: string;
    logo_path: string | null;
    memberships_count?: number;
    created_at: string;
    updated_at: string;
};

export type Membership = {
    id: number;
    user_id: number;
    organization_id: number;
    role: 'owner' | 'admin' | 'member';
    user?: {
        id: number;
        name: string;
        email: string;
    };
    created_at: string;
    updated_at: string;
};

export type OrganizationInvitation = {
    id: number;
    organization_id: number;
    invited_by: number;
    email: string;
    role: 'owner' | 'admin' | 'member';
    token: string;
    expires_at: string;
    accepted_at: string | null;
    inviter?: {
        id: number;
        name: string;
    };
    created_at: string;
    updated_at: string;
};

export type AvailableLocale = {
    code: string;
    label: string;
};

export type SharedData = {
    name: string;
    auth: Auth;
    locale: string;
    availableLocales: AvailableLocale[];
    translations: Record<string, string>;
    sidebarOpen: boolean;
    currentOrganization: Organization | null;
    userOrganizations: Organization[];
    [key: string]: unknown;
};
