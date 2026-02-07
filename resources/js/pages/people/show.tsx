import { Head, Link, useForm } from '@inertiajs/react';
import { Pencil, Trash2 } from 'lucide-react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
import type { BreadcrumbItem, Organization } from '@/types';

type Task = {
    id: number;
    name: string;
    state: string;
    deadline: string | null;
};

type Meeting = {
    id: number;
    name: string;
    date: string;
};

type Person = {
    id: number;
    full_name: string;
    primary_email: string | null;
    kind: string;
    position: string | null;
    contract_start_date: string | null;
    contract_end_date: string | null;
    tasks: Task[];
    meetings: Meeting[];
    created_at: string;
    updated_at: string;
};

function kindVariant(kind: string) {
    switch (kind) {
        case 'employee':
            return 'default';
        case 'contractor':
            return 'secondary';
        case 'service_account':
            return 'outline';
        default:
            return 'outline';
    }
}

function taskStateVariant(state: string) {
    switch (state) {
        case 'done':
            return 'default';
        case 'todo':
            return 'outline';
        default:
            return 'outline';
    }
}

export default function PersonShow({
    organization,
    person,
}: {
    organization: Organization;
    person: Person;
}) {
    const { t } = useTrans();

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('Organizations'), href: '/organizations' },
        { title: organization.name, href: `/organizations/${organization.id}` },
        { title: t('People'), href: `/organizations/${organization.id}/people` },
        { title: person.full_name, href: `/organizations/${organization.id}/people/${person.id}` },
    ];

    const deleteForm = useForm({});

    function handleDelete() {
        if (window.confirm(t('Are you sure you want to delete this person?'))) {
            deleteForm.delete(`/organizations/${organization.id}/people/${person.id}`);
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={person.full_name} />

            <div className="mx-auto w-full max-w-4xl space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <Heading
                        title={person.full_name}
                        description={person.position ?? undefined}
                    />
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href={`/organizations/${organization.id}/people/${person.id}/edit`}>
                                <Pencil className="mr-2 h-4 w-4" />
                                {t('Edit')}
                            </Link>
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={deleteForm.processing}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            {t('Delete')}
                        </Button>
                    </div>
                </div>

                <Card>
                    <CardContent className="pt-6">
                        <dl className="grid gap-4 sm:grid-cols-4">
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">{t('Email')}</dt>
                                <dd className="mt-1 text-sm">{person.primary_email || '-'}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">{t('Kind')}</dt>
                                <dd className="mt-1">
                                    <Badge variant={kindVariant(person.kind)}>
                                        {person.kind}
                                    </Badge>
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">{t('Contract Start')}</dt>
                                <dd className="mt-1 text-sm">{person.contract_start_date || '-'}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">{t('Contract End')}</dt>
                                <dd className="mt-1 text-sm">{person.contract_end_date || '-'}</dd>
                            </div>
                        </dl>
                    </CardContent>
                </Card>

                <h3 className="text-lg font-medium">{t('Assigned Tasks')}</h3>
                {person.tasks.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-8">
                            <p className="text-sm text-muted-foreground">
                                {t('No tasks assigned to this person.')}
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <Card>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>{t('Name')}</TableHead>
                                    <TableHead>{t('State')}</TableHead>
                                    <TableHead>{t('Deadline')}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {person.tasks.map((task) => (
                                    <TableRow key={task.id}>
                                        <TableCell>
                                            <Link
                                                href={`/organizations/${organization.id}/tasks/${task.id}`}
                                                className="font-medium hover:underline"
                                            >
                                                {task.name}
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={taskStateVariant(task.state)}>
                                                {task.state}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{task.deadline ?? '-'}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Card>
                )}

                <h3 className="text-lg font-medium">{t('Attended Meetings')}</h3>
                {person.meetings.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-8">
                            <p className="text-sm text-muted-foreground">
                                {t('No meetings attended by this person.')}
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <Card>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>{t('Name')}</TableHead>
                                    <TableHead>{t('Date')}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {person.meetings.map((meeting) => (
                                    <TableRow key={meeting.id}>
                                        <TableCell>
                                            <Link
                                                href={`/organizations/${organization.id}/meetings/${meeting.id}`}
                                                className="font-medium hover:underline"
                                            >
                                                {meeting.name}
                                            </Link>
                                        </TableCell>
                                        <TableCell>{meeting.date}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
