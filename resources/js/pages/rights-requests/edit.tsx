import { Head, useForm } from '@inertiajs/react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Organization } from '@/types';

type RightsRequest = {
    id: number;
    request_type: string;
    request_state: string;
    data_subject: string | null;
    contact: string | null;
    details: string | null;
    deadline: string | null;
    action_taken: string | null;
    created_at: string;
    updated_at: string;
};

export default function RightsRequestEdit({
    organization,
    rightsRequest,
}: {
    organization: Organization;
    rightsRequest: RightsRequest;
}) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Organizations', href: '/organizations' },
        { title: organization.name, href: `/organizations/${organization.id}` },
        { title: 'Rights Requests', href: `/organizations/${organization.id}/rights-requests` },
        { title: rightsRequest.data_subject ?? `Request #${rightsRequest.id}`, href: `/organizations/${organization.id}/rights-requests/${rightsRequest.id}` },
        { title: 'Edit', href: `/organizations/${organization.id}/rights-requests/${rightsRequest.id}/edit` },
    ];

    const { data, setData, put, processing, errors } = useForm({
        request_type: rightsRequest.request_type,
        request_state: rightsRequest.request_state,
        data_subject: rightsRequest.data_subject ?? '',
        contact: rightsRequest.contact ?? '',
        details: rightsRequest.details ?? '',
        deadline: rightsRequest.deadline ?? '',
        action_taken: rightsRequest.action_taken ?? '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        put(`/organizations/${organization.id}/rights-requests/${rightsRequest.id}`);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${rightsRequest.data_subject ?? 'Rights Request'}`} />

            <div className="mx-auto w-full max-w-2xl space-y-6 p-6">
                <Heading
                    title="Edit Rights Request"
                    description="Update rights request details"
                />

                <Card>
                    <CardContent className="pt-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid gap-2">
                                <Label htmlFor="request_type">Request Type</Label>
                                <Select
                                    value={data.request_type}
                                    onValueChange={(value) => setData('request_type', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select request type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="access">Access</SelectItem>
                                        <SelectItem value="deletion">Deletion</SelectItem>
                                        <SelectItem value="portability">Portability</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.request_type} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="request_state">State</Label>
                                <Select
                                    value={data.request_state}
                                    onValueChange={(value) => setData('request_state', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select state" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="todo">To Do</SelectItem>
                                        <SelectItem value="in_progress">In Progress</SelectItem>
                                        <SelectItem value="done">Done</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.request_state} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="data_subject">Data Subject</Label>
                                <Input
                                    id="data_subject"
                                    value={data.data_subject}
                                    onChange={(e) => setData('data_subject', e.target.value)}
                                    placeholder="Name of the data subject"
                                />
                                <InputError message={errors.data_subject} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="contact">Contact</Label>
                                <Input
                                    id="contact"
                                    value={data.contact}
                                    onChange={(e) => setData('contact', e.target.value)}
                                    placeholder="Email or phone number"
                                />
                                <InputError message={errors.contact} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="details">Details</Label>
                                <textarea
                                    id="details"
                                    value={data.details}
                                    onChange={(e) => setData('details', e.target.value)}
                                    placeholder="Describe the request..."
                                    rows={4}
                                    className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                />
                                <InputError message={errors.details} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="deadline">Deadline</Label>
                                <Input
                                    id="deadline"
                                    type="date"
                                    value={data.deadline}
                                    onChange={(e) => setData('deadline', e.target.value)}
                                />
                                <InputError message={errors.deadline} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="action_taken">Action Taken</Label>
                                <textarea
                                    id="action_taken"
                                    value={data.action_taken}
                                    onChange={(e) => setData('action_taken', e.target.value)}
                                    placeholder="Describe the actions taken..."
                                    rows={4}
                                    className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                />
                                <InputError message={errors.action_taken} />
                            </div>

                            <div className="flex justify-end">
                                <Button type="submit" disabled={processing}>
                                    Save Changes
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
