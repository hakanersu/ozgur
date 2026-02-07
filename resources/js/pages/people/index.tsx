import { Head, Link } from '@inertiajs/react';
import { Plus, Users } from 'lucide-react';
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
import { useTrans } from '@/hooks/use-trans';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Organization } from '@/types';

type Person = {
    id: number;
    full_name: string;
    primary_email: string | null;
    kind: string;
    position: string | null;
    contract_end_date: string | null;
    created_at: string;
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

export default function PeopleIndex({
    organization,
    people,
    filters,
}: {
    organization: Organization;
    people: Person[];
    filters: { search: string };
}) {
    const { t } = useTrans();

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('Organizations'), href: '/organizations' },
        { title: organization.name, href: `/organizations/${organization.id}` },
        { title: t('People'), href: `/organizations/${organization.id}/people` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('People')} />

            <div className="mx-auto w-full max-w-4xl space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <Heading
                        title={t('People')}
                        description={t('Manage people in your organization')}
                    />
                    <Button asChild>
                        <Link href={`/organizations/${organization.id}/people/create`}>
                            <Plus className="mr-2 h-4 w-4" />
                            {t('New Person')}
                        </Link>
                    </Button>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex-1">
                        <SearchInput
                            value={filters.search}
                            placeholder={t('Search people...')}
                        />
                    </div>
                </div>

                {people.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <Users className="mb-4 h-12 w-12 text-muted-foreground" />
                            <h3 className="mb-2 text-lg font-medium">{t('No people yet')}</h3>
                            <p className="mb-4 text-sm text-muted-foreground">
                                {t('Add your first person to start tracking organizational members.')}
                            </p>
                            <Button asChild>
                                <Link href={`/organizations/${organization.id}/people/create`}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    {t('Add Person')}
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <Card>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>{t('Name')}</TableHead>
                                    <TableHead>{t('Email')}</TableHead>
                                    <TableHead>{t('Kind')}</TableHead>
                                    <TableHead>{t('Position')}</TableHead>
                                    <TableHead>{t('Contract End')}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {people.map((person) => (
                                    <TableRow key={person.id}>
                                        <TableCell>
                                            <Link
                                                href={`/organizations/${organization.id}/people/${person.id}`}
                                                className="font-medium hover:underline"
                                            >
                                                {person.full_name}
                                            </Link>
                                        </TableCell>
                                        <TableCell>{person.primary_email ?? '-'}</TableCell>
                                        <TableCell>
                                            <Badge variant={kindVariant(person.kind)}>
                                                {person.kind}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{person.position ?? '-'}</TableCell>
                                        <TableCell>{person.contract_end_date ?? '-'}</TableCell>
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
