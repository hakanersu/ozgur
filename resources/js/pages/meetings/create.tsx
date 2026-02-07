import { Head, useForm } from '@inertiajs/react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Organization } from '@/types';

type PersonOption = {
    id: number;
    full_name: string;
};

export default function MeetingCreate({
    organization,
    people,
}: {
    organization: Organization;
    people: PersonOption[];
}) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Organizations', href: '/organizations' },
        { title: organization.name, href: `/organizations/${organization.id}` },
        { title: 'Meetings', href: `/organizations/${organization.id}/meetings` },
        { title: 'Create', href: `/organizations/${organization.id}/meetings/create` },
    ];

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        date: '',
        minutes: '',
        attendee_ids: [] as number[],
    });

    function toggleAttendee(personId: number) {
        const current = data.attendee_ids;
        if (current.includes(personId)) {
            setData('attendee_ids', current.filter((id) => id !== personId));
        } else {
            setData('attendee_ids', [...current, personId]);
        }
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post(`/organizations/${organization.id}/meetings`);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Meeting" />

            <div className="mx-auto w-full max-w-2xl space-y-6 p-6">
                <Heading
                    title="Create Meeting"
                    description="Schedule a new organizational meeting"
                />

                <Card>
                    <CardContent className="pt-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                    placeholder="Monthly security review"
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="date">Date</Label>
                                <Input
                                    id="date"
                                    type="datetime-local"
                                    value={data.date}
                                    onChange={(e) => setData('date', e.target.value)}
                                    required
                                />
                                <InputError message={errors.date} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="minutes">Minutes</Label>
                                <textarea
                                    id="minutes"
                                    value={data.minutes}
                                    onChange={(e) => setData('minutes', e.target.value)}
                                    placeholder="Meeting minutes..."
                                    rows={6}
                                    className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                />
                                <InputError message={errors.minutes} />
                            </div>

                            {people.length > 0 && (
                                <div className="grid gap-2">
                                    <Label>Attendees</Label>
                                    <div className="grid gap-3 rounded-md border p-4">
                                        {people.map((person) => (
                                            <div key={person.id} className="flex items-center gap-2">
                                                <Checkbox
                                                    id={`attendee-${person.id}`}
                                                    checked={data.attendee_ids.includes(person.id)}
                                                    onCheckedChange={() => toggleAttendee(person.id)}
                                                />
                                                <Label
                                                    htmlFor={`attendee-${person.id}`}
                                                    className="cursor-pointer font-normal"
                                                >
                                                    {person.full_name}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                    <InputError message={errors.attendee_ids} />
                                </div>
                            )}

                            <div className="flex justify-end">
                                <Button type="submit" disabled={processing}>
                                    Create Meeting
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
