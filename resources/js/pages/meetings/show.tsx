import { Head, Link, useForm } from '@inertiajs/react';
import { Pencil, Trash2 } from 'lucide-react';
import Heading from '@/components/heading';
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

type Attendee = {
    id: number;
    full_name: string;
    primary_email: string | null;
};

type Meeting = {
    id: number;
    name: string;
    date: string;
    minutes: string | null;
    attendees: Attendee[];
    created_at: string;
    updated_at: string;
};

export default function MeetingShow({
    organization,
    meeting,
}: {
    organization: Organization;
    meeting: Meeting;
}) {
    const { t } = useTrans();

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('Organizations'), href: '/organizations' },
        { title: organization.name, href: `/organizations/${organization.id}` },
        { title: t('Meetings'), href: `/organizations/${organization.id}/meetings` },
        { title: meeting.name, href: `/organizations/${organization.id}/meetings/${meeting.id}` },
    ];

    const deleteForm = useForm({});

    function handleDelete() {
        if (window.confirm(t('Are you sure you want to delete this meeting?'))) {
            deleteForm.delete(`/organizations/${organization.id}/meetings/${meeting.id}`);
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={meeting.name} />

            <div className="mx-auto w-full max-w-4xl space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <Heading
                        title={meeting.name}
                    />
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href={`/organizations/${organization.id}/meetings/${meeting.id}/edit`}>
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
                        <dl className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">{t('Date')}</dt>
                                <dd className="mt-1 text-sm">{meeting.date}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">{t('Attendees')}</dt>
                                <dd className="mt-1 text-sm">{meeting.attendees.length}</dd>
                            </div>
                        </dl>
                    </CardContent>
                </Card>

                {meeting.minutes && (
                    <>
                        <h3 className="text-lg font-medium">{t('Minutes')}</h3>
                        <Card>
                            <CardContent className="pt-6">
                                <div className="whitespace-pre-wrap text-sm">{meeting.minutes}</div>
                            </CardContent>
                        </Card>
                    </>
                )}

                <h3 className="text-lg font-medium">{t('Attendees')}</h3>
                {meeting.attendees.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-8">
                            <p className="text-sm text-muted-foreground">
                                {t('No attendees for this meeting.')}
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <Card>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>{t('Name')}</TableHead>
                                    <TableHead>{t('Email')}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {meeting.attendees.map((attendee) => (
                                    <TableRow key={attendee.id}>
                                        <TableCell>
                                            <Link
                                                href={`/organizations/${organization.id}/people/${attendee.id}`}
                                                className="font-medium hover:underline"
                                            >
                                                {attendee.full_name}
                                            </Link>
                                        </TableCell>
                                        <TableCell>{attendee.primary_email ?? '-'}</TableCell>
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
