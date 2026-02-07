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

export default function RiskCreate({
    organization,
}: {
    organization: Organization;
}) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Organizations', href: '/organizations' },
        { title: organization.name, href: `/organizations/${organization.id}` },
        { title: 'Risks', href: `/organizations/${organization.id}/risks` },
        { title: 'Create', href: `/organizations/${organization.id}/risks/create` },
    ];

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        category: '',
        probability: '3',
        impact: '3',
        treatment: 'mitigate',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post(`/organizations/${organization.id}/risks`);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Risk" />

            <div className="mx-auto w-full max-w-2xl space-y-6 p-6">
                <Heading
                    title="Create Risk"
                    description="Register a new organizational risk"
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
                                    placeholder="Data breach risk"
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="description">Description</Label>
                                <textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Describe the risk..."
                                    rows={4}
                                    className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                />
                                <InputError message={errors.description} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="category">Category</Label>
                                <Input
                                    id="category"
                                    value={data.category}
                                    onChange={(e) => setData('category', e.target.value)}
                                    placeholder="Operational"
                                />
                                <InputError message={errors.category} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="probability">Probability (1-5)</Label>
                                    <Select
                                        value={data.probability}
                                        onValueChange={(value) => setData('probability', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select probability" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">1 - Very Low</SelectItem>
                                            <SelectItem value="2">2 - Low</SelectItem>
                                            <SelectItem value="3">3 - Medium</SelectItem>
                                            <SelectItem value="4">4 - High</SelectItem>
                                            <SelectItem value="5">5 - Very High</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.probability} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="impact">Impact (1-5)</Label>
                                    <Select
                                        value={data.impact}
                                        onValueChange={(value) => setData('impact', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select impact" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">1 - Negligible</SelectItem>
                                            <SelectItem value="2">2 - Minor</SelectItem>
                                            <SelectItem value="3">3 - Moderate</SelectItem>
                                            <SelectItem value="4">4 - Major</SelectItem>
                                            <SelectItem value="5">5 - Critical</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.impact} />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="treatment">Treatment</Label>
                                <Select
                                    value={data.treatment}
                                    onValueChange={(value) => setData('treatment', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select treatment" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="mitigate">Mitigate</SelectItem>
                                        <SelectItem value="accept">Accept</SelectItem>
                                        <SelectItem value="transfer">Transfer</SelectItem>
                                        <SelectItem value="avoid">Avoid</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.treatment} />
                            </div>

                            <div className="flex justify-end">
                                <Button type="submit" disabled={processing}>
                                    Create Risk
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
