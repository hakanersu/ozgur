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
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Membership, Organization } from '@/types';

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
}: {
    organization: Organization;
    memberships: Membership[];
}) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Organizations', href: '/organizations' },
        {
            title: organization.name,
            href: `/organizations/${organization.id}`,
        },
        {
            title: 'Members',
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${organization.name} - Members`} />

            <div className="mx-auto w-full max-w-4xl space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <Heading
                        title="Members"
                        description="Manage organization members and their roles"
                    />

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Member
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add Member</DialogTitle>
                            </DialogHeader>
                            <form
                                onSubmit={handleInvite}
                                className="space-y-4"
                            >
                                <div className="grid gap-2">
                                    <Label htmlFor="email">
                                        Email Address
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
                                    <Label htmlFor="role">Role</Label>
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
                                                Member
                                            </SelectItem>
                                            <SelectItem value="admin">
                                                Admin
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
                                        Add Member
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
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Role</TableHead>
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
            </div>
        </AppLayout>
    );
}
