import { Head, useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { useTrans } from '@/hooks/use-trans';
import AuthLayout from '@/layouts/auth-layout';

type Invitation = {
    token: string;
    email: string;
    organization_name: string;
    role: string;
};

type Props = {
    invitation: Invitation;
    userExists: boolean;
};

export default function AcceptInvitation({ invitation, userExists }: Props) {
    const { t } = useTrans();

    const form = useForm({
        name: '',
        password: '',
        password_confirmation: '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        form.post(`/invitations/${invitation.token}/accept`);
    }

    return (
        <AuthLayout
            title={t('Organization Invitation')}
            description={t('You have been invited to join :organization.', { organization: invitation.organization_name })}
        >
            <Head title={t('Accept Invitation')} />

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label>{t('Email')}</Label>
                        <Input
                            type="email"
                            value={invitation.email}
                            disabled
                        />
                    </div>

                    {!userExists && (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="name">{t('Name')}</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={form.data.name}
                                    onChange={(e) => form.setData('name', e.target.value)}
                                    required
                                    autoFocus
                                    placeholder={t('Full name')}
                                />
                                <InputError message={form.errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">{t('Password')}</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={form.data.password}
                                    onChange={(e) => form.setData('password', e.target.value)}
                                    required
                                    placeholder={t('Password')}
                                />
                                <InputError message={form.errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">{t('Confirm password')}</Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    value={form.data.password_confirmation}
                                    onChange={(e) => form.setData('password_confirmation', e.target.value)}
                                    required
                                    placeholder={t('Confirm password')}
                                />
                                <InputError message={form.errors.password_confirmation} />
                            </div>
                        </>
                    )}

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={form.processing}
                    >
                        {form.processing && <Spinner />}
                        {userExists ? t('Accept Invitation') : t('Accept & Create Account')}
                    </Button>
                </div>
            </form>
        </AuthLayout>
    );
}
