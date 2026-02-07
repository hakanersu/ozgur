import { Head, useForm } from '@inertiajs/react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
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

type Person = {
    id: number;
    name: string;
};

export default function ProcessingActivityCreate({
    organization,
    people,
}: {
    organization: Organization;
    people: Person[];
}) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Organizations', href: '/organizations' },
        { title: organization.name, href: `/organizations/${organization.id}` },
        { title: 'Processing Activities', href: `/organizations/${organization.id}/processing-activities` },
        { title: 'Create', href: `/organizations/${organization.id}/processing-activities/create` },
    ];

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        purpose: '',
        data_subject_category: '',
        personal_data_category: '',
        special_or_criminal_data: '',
        consent_evidence_link: '',
        lawful_basis: '',
        recipients: '',
        location: '',
        international_transfers: false,
        transfer_safeguards: '',
        retention_period: '',
        security_measures: '',
        dpia_needed: '',
        tia_needed: '',
        last_review_date: '',
        next_review_date: '',
        role: '',
        data_protection_officer_id: '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post(`/organizations/${organization.id}/processing-activities`);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Processing Activity" />

            <div className="mx-auto w-full max-w-2xl space-y-6 p-6">
                <Heading
                    title="Create Processing Activity"
                    description="Register a new data processing activity"
                />

                <Card>
                    <CardContent className="pt-6">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div>
                                <h3 className="mb-4 text-sm font-medium text-muted-foreground uppercase tracking-wide">Basic Info</h3>
                                <div className="space-y-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Name</Label>
                                        <Input
                                            id="name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            required
                                            placeholder="Customer data processing"
                                        />
                                        <InputError message={errors.name} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="purpose">Purpose</Label>
                                        <Input
                                            id="purpose"
                                            value={data.purpose}
                                            onChange={(e) => setData('purpose', e.target.value)}
                                            placeholder="Purpose of processing"
                                        />
                                        <InputError message={errors.purpose} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="role">Role</Label>
                                        <Select
                                            value={data.role}
                                            onValueChange={(value) => setData('role', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="controller">Controller</SelectItem>
                                                <SelectItem value="processor">Processor</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.role} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="data_protection_officer_id">Data Protection Officer</Label>
                                        <Select
                                            value={data.data_protection_officer_id}
                                            onValueChange={(value) => setData('data_protection_officer_id', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select DPO (optional)" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {people.map((person) => (
                                                    <SelectItem key={person.id} value={String(person.id)}>
                                                        {person.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.data_protection_officer_id} />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="mb-4 text-sm font-medium text-muted-foreground uppercase tracking-wide">Data Categories</h3>
                                <div className="space-y-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="data_subject_category">Data Subject Category</Label>
                                        <Input
                                            id="data_subject_category"
                                            value={data.data_subject_category}
                                            onChange={(e) => setData('data_subject_category', e.target.value)}
                                            placeholder="e.g. Customers, Employees"
                                        />
                                        <InputError message={errors.data_subject_category} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="personal_data_category">Personal Data Category</Label>
                                        <Input
                                            id="personal_data_category"
                                            value={data.personal_data_category}
                                            onChange={(e) => setData('personal_data_category', e.target.value)}
                                            placeholder="e.g. Name, Email, Address"
                                        />
                                        <InputError message={errors.personal_data_category} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="special_or_criminal_data">Special or Criminal Data</Label>
                                        <Select
                                            value={data.special_or_criminal_data}
                                            onValueChange={(value) => setData('special_or_criminal_data', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select option" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="yes">Yes</SelectItem>
                                                <SelectItem value="no">No</SelectItem>
                                                <SelectItem value="possible">Possible</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.special_or_criminal_data} />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="mb-4 text-sm font-medium text-muted-foreground uppercase tracking-wide">Legal Basis & Processing</h3>
                                <div className="space-y-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="lawful_basis">Lawful Basis</Label>
                                        <Select
                                            value={data.lawful_basis}
                                            onValueChange={(value) => setData('lawful_basis', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select lawful basis" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="legitimate_interest">Legitimate Interest</SelectItem>
                                                <SelectItem value="consent">Consent</SelectItem>
                                                <SelectItem value="contractual_necessity">Contractual Necessity</SelectItem>
                                                <SelectItem value="legal_obligation">Legal Obligation</SelectItem>
                                                <SelectItem value="vital_interests">Vital Interests</SelectItem>
                                                <SelectItem value="public_task">Public Task</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.lawful_basis} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="consent_evidence_link">Consent Evidence Link</Label>
                                        <Input
                                            id="consent_evidence_link"
                                            value={data.consent_evidence_link}
                                            onChange={(e) => setData('consent_evidence_link', e.target.value)}
                                            placeholder="https://..."
                                        />
                                        <InputError message={errors.consent_evidence_link} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="recipients">Recipients</Label>
                                        <textarea
                                            id="recipients"
                                            value={data.recipients}
                                            onChange={(e) => setData('recipients', e.target.value)}
                                            placeholder="List recipients of the data..."
                                            rows={3}
                                            className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                        />
                                        <InputError message={errors.recipients} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="retention_period">Retention Period</Label>
                                        <Input
                                            id="retention_period"
                                            value={data.retention_period}
                                            onChange={(e) => setData('retention_period', e.target.value)}
                                            placeholder="e.g. 5 years"
                                        />
                                        <InputError message={errors.retention_period} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="security_measures">Security Measures</Label>
                                        <textarea
                                            id="security_measures"
                                            value={data.security_measures}
                                            onChange={(e) => setData('security_measures', e.target.value)}
                                            placeholder="Describe the security measures in place..."
                                            rows={3}
                                            className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                        />
                                        <InputError message={errors.security_measures} />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="mb-4 text-sm font-medium text-muted-foreground uppercase tracking-wide">Location & Transfers</h3>
                                <div className="space-y-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="location">Location</Label>
                                        <Input
                                            id="location"
                                            value={data.location}
                                            onChange={(e) => setData('location', e.target.value)}
                                            placeholder="e.g. EU, US, Global"
                                        />
                                        <InputError message={errors.location} />
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Checkbox
                                            id="international_transfers"
                                            checked={data.international_transfers}
                                            onCheckedChange={(checked) => setData('international_transfers', checked === true)}
                                        />
                                        <Label htmlFor="international_transfers">International Transfers</Label>
                                        <InputError message={errors.international_transfers} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="transfer_safeguards">Transfer Safeguards</Label>
                                        <Select
                                            value={data.transfer_safeguards}
                                            onValueChange={(value) => setData('transfer_safeguards', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select safeguard" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="standard_contractual_clauses">Standard Contractual Clauses</SelectItem>
                                                <SelectItem value="binding_corporate_rules">Binding Corporate Rules</SelectItem>
                                                <SelectItem value="adequacy_decision">Adequacy Decision</SelectItem>
                                                <SelectItem value="derogations">Derogations</SelectItem>
                                                <SelectItem value="codes_of_conduct">Codes of Conduct</SelectItem>
                                                <SelectItem value="certification_mechanisms">Certification Mechanisms</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.transfer_safeguards} />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="mb-4 text-sm font-medium text-muted-foreground uppercase tracking-wide">Assessments & Review</h3>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="dpia_needed">DPIA Needed</Label>
                                            <Select
                                                value={data.dpia_needed}
                                                onValueChange={(value) => setData('dpia_needed', value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select option" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="needed">Needed</SelectItem>
                                                    <SelectItem value="not_needed">Not Needed</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <InputError message={errors.dpia_needed} />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="tia_needed">TIA Needed</Label>
                                            <Select
                                                value={data.tia_needed}
                                                onValueChange={(value) => setData('tia_needed', value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select option" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="needed">Needed</SelectItem>
                                                    <SelectItem value="not_needed">Not Needed</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <InputError message={errors.tia_needed} />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="last_review_date">Last Review Date</Label>
                                            <Input
                                                id="last_review_date"
                                                type="date"
                                                value={data.last_review_date}
                                                onChange={(e) => setData('last_review_date', e.target.value)}
                                            />
                                            <InputError message={errors.last_review_date} />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="next_review_date">Next Review Date</Label>
                                            <Input
                                                id="next_review_date"
                                                type="date"
                                                value={data.next_review_date}
                                                onChange={(e) => setData('next_review_date', e.target.value)}
                                            />
                                            <InputError message={errors.next_review_date} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Button type="submit" disabled={processing}>
                                    Create Activity
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
