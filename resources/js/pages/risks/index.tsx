import { Head, Link } from '@inertiajs/react';
import { AlertTriangle, Plus } from 'lucide-react';
import Heading from '@/components/heading';
import SearchInput from '@/components/search-input';
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
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Organization } from '@/types';

type Risk = {
    id: number;
    name: string;
    category: string | null;
    probability: number;
    impact: number;
    treatment: string;
    description: string | null;
    measures_count: number;
    created_at: string;
    updated_at: string;
};

function treatmentVariant(treatment: string) {
    switch (treatment) {
        case 'mitigate':
        case 'accept':
            return 'default';
        case 'transfer':
            return 'secondary';
        case 'avoid':
            return 'outline';
        case 'rejected':
            return 'destructive';
        default:
            return 'outline';
    }
}

export default function RisksIndex({
    organization,
    risks,
    filters,
}: {
    organization: Organization;
    risks: Risk[];
    filters: { search: string };
}) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Organizations', href: '/organizations' },
        { title: organization.name, href: `/organizations/${organization.id}` },
        { title: 'Risks', href: `/organizations/${organization.id}/risks` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Risks" />

            <div className="mx-auto w-full max-w-4xl space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <Heading
                        title="Risks"
                        description="Track and manage organizational risks"
                    />
                    <Button asChild>
                        <Link href={`/organizations/${organization.id}/risks/create`}>
                            <Plus className="mr-2 h-4 w-4" />
                            New Risk
                        </Link>
                    </Button>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex-1">
                        <SearchInput
                            value={filters.search}
                            placeholder="Search risks..."
                        />
                    </div>
                </div>

                {risks.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <AlertTriangle className="mb-4 h-12 w-12 text-muted-foreground" />
                            <h3 className="mb-2 text-lg font-medium">No risks yet</h3>
                            <p className="mb-4 text-sm text-muted-foreground">
                                Create your first risk to start tracking organizational threats.
                            </p>
                            <Button asChild>
                                <Link href={`/organizations/${organization.id}/risks/create`}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create Risk
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
                                    <TableHead>Category</TableHead>
                                    <TableHead>Probability</TableHead>
                                    <TableHead>Impact</TableHead>
                                    <TableHead>Treatment</TableHead>
                                    <TableHead className="text-right">Measures</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {risks.map((risk) => (
                                    <TableRow key={risk.id}>
                                        <TableCell>
                                            <Link
                                                href={`/organizations/${organization.id}/risks/${risk.id}`}
                                                className="font-medium hover:underline"
                                            >
                                                {risk.name}
                                            </Link>
                                        </TableCell>
                                        <TableCell>{risk.category ?? '-'}</TableCell>
                                        <TableCell>{risk.probability}</TableCell>
                                        <TableCell>{risk.impact}</TableCell>
                                        <TableCell>
                                            <Badge variant={treatmentVariant(risk.treatment)}>
                                                {risk.treatment}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {risk.measures_count}
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
