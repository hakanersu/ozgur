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
import { useTrans } from '@/hooks/use-trans';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Organization } from '@/types';

type PersonOption = {
    id: number;
    full_name: string;
};

type Task = {
    id: number;
    name: string;
    description: string | null;
    state: string;
    deadline: string | null;
    assigned_to_id: number | null;
    created_at: string;
    updated_at: string;
};

export default function TaskEdit({
    organization,
    task,
    people,
}: {
    organization: Organization;
    task: Task;
    people: PersonOption[];
}) {
    const { t } = useTrans();

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('Organizations'), href: '/organizations' },
        { title: organization.name, href: `/organizations/${organization.id}` },
        { title: t('Tasks'), href: `/organizations/${organization.id}/tasks` },
        { title: task.name, href: `/organizations/${organization.id}/tasks/${task.id}` },
        { title: t('Edit'), href: `/organizations/${organization.id}/tasks/${task.id}/edit` },
    ];

    const { data, setData, put, processing, errors } = useForm({
        name: task.name,
        description: task.description ?? '',
        state: task.state,
        deadline: task.deadline ?? '',
        assigned_to_id: task.assigned_to_id ? String(task.assigned_to_id) : '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        put(`/organizations/${organization.id}/tasks/${task.id}`);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${t('Edit')} ${task.name}`} />

            <div className="mx-auto w-full max-w-2xl space-y-6 p-6">
                <Heading
                    title={t('Edit Task')}
                    description={t('Update task details')}
                />

                <Card>
                    <CardContent className="pt-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid gap-2">
                                <Label htmlFor="name">{t('Name')}</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="description">{t('Description')}</Label>
                                <textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows={4}
                                    className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                />
                                <InputError message={errors.description} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="state">{t('State')}</Label>
                                    <Select
                                        value={data.state}
                                        onValueChange={(value) => setData('state', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder={t('Select state')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="todo">{t('Todo')}</SelectItem>
                                            <SelectItem value="done">{t('Done')}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.state} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="deadline">{t('Deadline')}</Label>
                                    <Input
                                        id="deadline"
                                        type="date"
                                        value={data.deadline}
                                        onChange={(e) => setData('deadline', e.target.value)}
                                    />
                                    <InputError message={errors.deadline} />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="assigned_to_id">{t('Assigned To')}</Label>
                                <Select
                                    value={data.assigned_to_id}
                                    onValueChange={(value) => setData('assigned_to_id', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={t('Select a person (optional)')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {people.map((person) => (
                                            <SelectItem key={person.id} value={String(person.id)}>
                                                {person.full_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.assigned_to_id} />
                            </div>

                            <div className="flex justify-end">
                                <Button type="submit" disabled={processing}>
                                    {t('Save Changes')}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
