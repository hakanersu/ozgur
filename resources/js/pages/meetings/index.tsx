import { Head, Link } from '@inertiajs/react';
import { CalendarDays, Plus } from 'lucide-react';
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
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Organization } from '@/types';

type Meeting = {
    id: number;
    name: string;
    date: string;
    attendees_count: number;
    created_at: string;
};

export default function MeetingsIndex({
    organization,
    meetings,
}: {
    organization: Organization;
    meetings: Meeting[];
}) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Organizations', href: '/organizations' },
        { title: organization.name, href: `/organizations/${organization.id}` },
        { title: 'Meetings', href: `/organizations/${organization.id}/meetings` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Meetings" />

            <div className="mx-auto w-full max-w-4xl space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <Heading
                        title="Meetings"
                        description="Track and manage organizational meetings"
                    />
                    <Button asChild>
                        <Link href={`/organizations/${organization.id}/meetings/create`}>
                            <Plus className="mr-2 h-4 w-4" />
                            New Meeting
                        </Link>
                    </Button>
                </div>

                {meetings.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <CalendarDays className="mb-4 h-12 w-12 text-muted-foreground" />
                            <h3 className="mb-2 text-lg font-medium">No meetings yet</h3>
                            <p className="mb-4 text-sm text-muted-foreground">
                                Schedule your first meeting to start tracking organizational discussions.
                            </p>
                            <Button asChild>
                                <Link href={`/organizations/${organization.id}/meetings/create`}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create Meeting
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <Card>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="text-right">Attendees</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {meetings.map((meeting) => (
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
                                        <TableCell className="text-right">
                                            {meeting.attendees_count}
                                        </TableCell>
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
