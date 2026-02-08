import { Head } from '@inertiajs/react';
import TextLink from '@/components/text-link';
import { useTrans } from '@/hooks/use-trans';
import AuthLayout from '@/layouts/auth-layout';

export default function InvalidInvitation() {
    const { t } = useTrans();

    return (
        <AuthLayout
            title={t('Invalid Invitation')}
            description={t('This invitation link is invalid or has expired.')}
        >
            <Head title={t('Invalid Invitation')} />

            <div className="text-center text-sm text-muted-foreground">
                <TextLink href="/login">
                    {t('Go to login')}
                </TextLink>
            </div>
        </AuthLayout>
    );
}
