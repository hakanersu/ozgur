import { Head, useForm } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
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
import { useTrans } from '@/hooks/use-trans';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Membership, Organization, OrganizationInvitation } from '@/types';

const roleBadgeVariant = (role: string) => {
    switch (role) {
        case 'owner':
            return 'default' as const;
        case 'admin':
            return 'secondary' as const;
        default:
            return 'outline' as const;
    }
};

export default function MembersIndex({
    organization,
    memberships,
    invitations,
}: {
    organization: Organization;
    memberships: Membership[];
    invitations: OrganizationInvitation[];
}) {
    const { t } = useTrans();

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('Organizations'), href: '/organizations' },
        {
            title: organization.name,
            href: `/organizations/${organization.id}`,
        },
        {
            title: t('Members'),
            href: `/organizations/${organization.id}/members`,
        },
    ];

    const inviteForm = useForm({
        email: '',
        role: 'member',
    });

    function handleInvite(e: React.FormEvent) {
        e.preventDefault();
        inviteForm.post(`/organizations/${organization.id}/members`, {
            onSuccess: () => {
                inviteForm.reset();
            },
        });
    }

    const deleteForm = useForm({});

    function handleRemove(membershipId: number) {
        deleteForm.delete(
            `/organizations/${organization.id}/members/${membershipId}`,
        );
    }

    const cancelInvitationForm = useForm({});

    function handleCancelInvitation(invitationId: number) {
        cancelInvitationForm.delete(
            `/organizations/${organization.id}/invitations/${invitationId}`,
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${organization.name} - ${t('Members')}`} />

            <div className="mx-auto w-full max-w-4xl space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <Heading
                        title={t('Members')}
                        description={t('Manage organization members and their roles')}
                    />

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                {t('Invite Member')}
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{t('Invite Member')}</DialogTitle>
                            </DialogHeader>
                            <form
                                onSubmit={handleInvite}
                                className="space-y-4"
                            >
                                <div className="grid gap-2">
                                    <Label htmlFor="email">
                                        {t('Email Address')}
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={inviteForm.data.email}
                                        onChange={(e) =>
                                            inviteForm.setData(
                                                'email',
                                                e.target.value,
                                            )
                                        }
                                        required
                                        placeholder="user@example.com"
                                    />
                                    <InputError
                                        message={inviteForm.errors.email}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="role">{t('Role')}</Label>
                                    <Select
                                        value={inviteForm.data.role}
                                        onValueChange={(value) =>
                                            inviteForm.setData('role', value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="member">
                                                {t('Member')}
                                            </SelectItem>
                                            <SelectItem value="admin">
                                                {t('Admin')}
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError
                                        message={inviteForm.errors.role}
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <Button
                                        type="submit"
                                        disabled={inviteForm.processing}
                                    >
                                        {t('Send Invitation')}
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>{t('Name')}</TableHead>
                                    <TableHead>{t('Email')}</TableHead>
                                    <TableHead>{t('Role')}</TableHead>
                                    <TableHead className="w-[50px]" />
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {memberships.map((membership) => (
                                    <TableRow key={membership.id}>
                                        <TableCell className="font-medium">
                                            {membership.user?.name}
                                        </TableCell>
                                        <TableCell>
                                            {membership.user?.email}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={roleBadgeVariant(
                                                    membership.role,
                                                )}
                                            >
                                                {membership.role}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {membership.role !== 'owner' && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() =>
                                                        handleRemove(
                                                            membership.id,
                                                        )
                                                    }
                                                >
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {invitations.length > 0 && (
                    <>
                        <Heading
                            title={t('Pending Invitations')}
                            description={t('Invitations that have been sent but not yet accepted')}
                        />

                        <Card>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>{t('Email')}</TableHead>
                                            <TableHead>{t('Role')}</TableHead>
                                            <TableHead>{t('Invited By')}</TableHead>
                                            <TableHead className="w-[50px]" />
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {invitations.map((invitation) => (
                                            <TableRow key={invitation.id}>
                                                <TableCell className="font-medium">
                                                    {invitation.email}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={roleBadgeVariant(
                                                            invitation.role,
                                                        )}
                                                    >
                                                        {invitation.role}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {invitation.inviter?.name}
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() =>
                                                            handleCancelInvitation(
                                                                invitation.id,
                                                            )
                                                        }
                                                    >
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </>
                )}
            </div>
        </AppLayout>
    );
}
