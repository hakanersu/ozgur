import { Head, Link, useForm } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Organization } from '@/types';

type Person = {
    id: number;
    name: string;
};

type Dpia = {
    id: number;
    description: string | null;
    necessity_and_proportionality: string | null;
    potential_risk: string | null;
    mitigations: string | null;
    residual_risk: string | null;
};

type Tia = {
    id: number;
    data_subjects: string | null;
    legal_mechanism: string | null;
    transfer: string | null;
    local_law_risk: string | null;
    supplementary_measures: string | null;
};

type ProcessingActivity = {
    id: number;
    name: string;
    purpose: string | null;
    data_subject_category: string | null;
    personal_data_category: string | null;
    special_or_criminal_data: string | null;
    consent_evidence_link: string | null;
    lawful_basis: string | null;
    recipients: string | null;
    location: string | null;
    international_transfers: boolean;
    transfer_safeguards: string | null;
    retention_period: string | null;
    security_measures: string | null;
    dpia_needed: string | null;
    tia_needed: string | null;
    last_review_date: string | null;
    next_review_date: string | null;
    role: string | null;
    data_protection_officer: Person | null;
    dpia: Dpia | null;
    tia: Tia | null;
    created_at: string;
    updated_at: string;
};

function formatLabel(value: string): string {
    return value.replace(/_/g, ' ');
}

function residualRiskVariant(risk: string) {
    switch (risk) {
        case 'low':
            return 'default' as const;
        case 'medium':
            return 'secondary' as const;
        case 'high':
            return 'destructive' as const;
        default:
            return 'outline' as const;
    }
}

export default function ProcessingActivityShow({
    organization,
    processingActivity,
}: {
    organization: Organization;
    processingActivity: ProcessingActivity;
}) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Organizations', href: '/organizations' },
        { title: organization.name, href: `/organizations/${organization.id}` },
        { title: 'Processing Activities', href: `/organizations/${organization.id}/processing-activities` },
        { title: processingActivity.name, href: `/organizations/${organization.id}/processing-activities/${processingActivity.id}` },
    ];

    const deleteForm = useForm({});
    const dpiaForm = useForm({});
    const tiaForm = useForm({});

    function handleDelete() {
        if (window.confirm('Are you sure you want to delete this processing activity?')) {
            deleteForm.delete(`/organizations/${organization.id}/processing-activities/${processingActivity.id}`);
        }
    }

    function handleCreateDpia(e: React.FormEvent) {
        e.preventDefault();
        dpiaForm.post(`/organizations/${organization.id}/processing-activities/${processingActivity.id}/dpia`);
    }

    function handleCreateTia(e: React.FormEvent) {
        e.preventDefault();
        tiaForm.post(`/organizations/${organization.id}/processing-activities/${processingActivity.id}/tia`);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={processingActivity.name} />

            <div className="mx-auto w-full max-w-4xl space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <Heading
                        title={processingActivity.name}
                        description={processingActivity.purpose ?? undefined}
                    />
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href={`/organizations/${organization.id}/processing-activities/${processingActivity.id}/edit`}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                            </Link>
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={deleteForm.processing}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                        </Button>
                    </div>
                </div>

                <Card>
                    <CardContent className="pt-6">
                        <dl className="grid gap-4 sm:grid-cols-3">
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">Purpose</dt>
                                <dd className="mt-1 text-sm">{processingActivity.purpose || '-'}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">Role</dt>
                                <dd className="mt-1 text-sm capitalize">{processingActivity.role || '-'}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">Lawful Basis</dt>
                                <dd className="mt-1">
                                    {processingActivity.lawful_basis ? (
                                        <Badge variant="secondary">
                                            {formatLabel(processingActivity.lawful_basis)}
                                        </Badge>
                                    ) : (
                                        <span className="text-sm">-</span>
                                    )}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">Data Subject Category</dt>
                                <dd className="mt-1 text-sm">{processingActivity.data_subject_category || '-'}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">Personal Data Category</dt>
                                <dd className="mt-1 text-sm">{processingActivity.personal_data_category || '-'}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">Special / Criminal Data</dt>
                                <dd className="mt-1 text-sm capitalize">{processingActivity.special_or_criminal_data || '-'}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">International Transfers</dt>
                                <dd className="mt-1 text-sm">{processingActivity.international_transfers ? 'Yes' : 'No'}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">Transfer Safeguards</dt>
                                <dd className="mt-1 text-sm">{processingActivity.transfer_safeguards ? formatLabel(processingActivity.transfer_safeguards) : '-'}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">Location</dt>
                                <dd className="mt-1 text-sm">{processingActivity.location || '-'}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">Retention Period</dt>
                                <dd className="mt-1 text-sm">{processingActivity.retention_period || '-'}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">Consent Evidence Link</dt>
                                <dd className="mt-1 text-sm">
                                    {processingActivity.consent_evidence_link ? (
                                        <a href={processingActivity.consent_evidence_link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                            {processingActivity.consent_evidence_link}
                                        </a>
                                    ) : '-'}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">Data Protection Officer</dt>
                                <dd className="mt-1 text-sm">
                                    {processingActivity.data_protection_officer ? (
                                        <Link
                                            href={`/organizations/${organization.id}/people/${processingActivity.data_protection_officer.id}`}
                                            className="hover:underline"
                                        >
                                            {processingActivity.data_protection_officer.name}
                                        </Link>
                                    ) : '-'}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">Last Review Date</dt>
                                <dd className="mt-1 text-sm">{processingActivity.last_review_date || '-'}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">Next Review Date</dt>
                                <dd className="mt-1 text-sm">{processingActivity.next_review_date || '-'}</dd>
                            </div>
                            <div className="sm:col-span-3">
                                <dt className="text-sm font-medium text-muted-foreground">Recipients</dt>
                                <dd className="mt-1 text-sm whitespace-pre-line">{processingActivity.recipients || '-'}</dd>
                            </div>
                            <div className="sm:col-span-3">
                                <dt className="text-sm font-medium text-muted-foreground">Security Measures</dt>
                                <dd className="mt-1 text-sm whitespace-pre-line">{processingActivity.security_measures || '-'}</dd>
                            </div>
                        </dl>
                    </CardContent>
                </Card>

                <h3 className="text-lg font-medium">Data Protection Impact Assessment (DPIA)</h3>
                {processingActivity.dpia ? (
                    <Card>
                        <CardContent className="pt-6">
                            <dl className="grid gap-4 sm:grid-cols-2">
                                <div className="sm:col-span-2">
                                    <dt className="text-sm font-medium text-muted-foreground">Description</dt>
                                    <dd className="mt-1 text-sm whitespace-pre-line">{processingActivity.dpia.description || '-'}</dd>
                                </div>
                                <div className="sm:col-span-2">
                                    <dt className="text-sm font-medium text-muted-foreground">Necessity & Proportionality</dt>
                                    <dd className="mt-1 text-sm whitespace-pre-line">{processingActivity.dpia.necessity_and_proportionality || '-'}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-muted-foreground">Potential Risk</dt>
                                    <dd className="mt-1 text-sm whitespace-pre-line">{processingActivity.dpia.potential_risk || '-'}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-muted-foreground">Residual Risk</dt>
                                    <dd className="mt-1">
                                        {processingActivity.dpia.residual_risk ? (
                                            <Badge variant={residualRiskVariant(processingActivity.dpia.residual_risk)}>
                                                {processingActivity.dpia.residual_risk}
                                            </Badge>
                                        ) : (
                                            <span className="text-sm">-</span>
                                        )}
                                    </dd>
                                </div>
                                <div className="sm:col-span-2">
                                    <dt className="text-sm font-medium text-muted-foreground">Mitigations</dt>
                                    <dd className="mt-1 text-sm whitespace-pre-line">{processingActivity.dpia.mitigations || '-'}</dd>
                                </div>
                            </dl>
                        </CardContent>
                    </Card>
                ) : (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-8">
                            <p className="mb-4 text-sm text-muted-foreground">
                                No DPIA has been created for this processing activity.
                            </p>
                            <form onSubmit={handleCreateDpia}>
                                <Button type="submit" disabled={dpiaForm.processing}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create DPIA
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                )}

                <h3 className="text-lg font-medium">Transfer Impact Assessment (TIA)</h3>
                {processingActivity.tia ? (
                    <Card>
                        <CardContent className="pt-6">
                            <dl className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <dt className="text-sm font-medium text-muted-foreground">Data Subjects</dt>
                                    <dd className="mt-1 text-sm whitespace-pre-line">{processingActivity.tia.data_subjects || '-'}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-muted-foreground">Legal Mechanism</dt>
                                    <dd className="mt-1 text-sm whitespace-pre-line">{processingActivity.tia.legal_mechanism || '-'}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-muted-foreground">Transfer</dt>
                                    <dd className="mt-1 text-sm whitespace-pre-line">{processingActivity.tia.transfer || '-'}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-muted-foreground">Local Law Risk</dt>
                                    <dd className="mt-1 text-sm whitespace-pre-line">{processingActivity.tia.local_law_risk || '-'}</dd>
                                </div>
                                <div className="sm:col-span-2">
                                    <dt className="text-sm font-medium text-muted-foreground">Supplementary Measures</dt>
                                    <dd className="mt-1 text-sm whitespace-pre-line">{processingActivity.tia.supplementary_measures || '-'}</dd>
                                </div>
                            </dl>
                        </CardContent>
                    </Card>
                ) : (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-8">
                            <p className="mb-4 text-sm text-muted-foreground">
                                No TIA has been created for this processing activity.
                            </p>
                            <form onSubmit={handleCreateTia}>
                                <Button type="submit" disabled={tiaForm.processing}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create TIA
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
