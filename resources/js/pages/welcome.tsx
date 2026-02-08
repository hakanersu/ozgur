import { Head, Link, usePage } from '@inertiajs/react';
import { useTrans } from '@/hooks/use-trans';
import { dashboard, login, register } from '@/routes';
import type { SharedData } from '@/types';
import AppLogoIcon from '@/components/app-logo-icon';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Shield,
    AlertTriangle,
    ClipboardCheck,
    Building2,
    Eye,
    Globe,
    CheckCircle,
    ArrowRight,
} from 'lucide-react';

function LandingNav({
    auth,
    appName,
    canRegister,
}: {
    auth: SharedData['auth'];
    appName: string;
    canRegister: boolean;
}) {
    const { t } = useTrans();

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
                <Link href="/" className="flex items-center">
                    <AppLogoIcon className="size-16 fill-foreground" />
                    <span className="text-lg font-semibold">{appName}</span>
                </Link>
                <nav className="flex items-center gap-2">
                    {auth.user ? (
                        <Button asChild>
                            <Link href={dashboard()}>{t('Dashboard')}</Link>
                        </Button>
                    ) : (
                        <>
                            <Button variant="ghost" asChild>
                                <Link href={login()}>{t('Log in')}</Link>
                            </Button>
                            {canRegister && (
                                <Button asChild>
                                    <Link href={register()}>{t('Register')}</Link>
                                </Button>
                            )}
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}

function HeroSection({ canRegister }: { canRegister: boolean }) {
    const { t } = useTrans();

    return (
        <section className="flex flex-col items-center px-4 py-20 text-center sm:px-6 md:py-32">
            <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                {t('Simplify Compliance, Strengthen Trust')}
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
                {t('Manage frameworks, risks, audits, and vendors — all in one platform.')}
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                {canRegister && (
                    <Button size="lg" asChild>
                        <Link href={register()}>
                            {t('Get Started')}
                            <ArrowRight />
                        </Link>
                    </Button>
                )}
                <Button size="lg" variant="outline" asChild>
                    <a href="#features">{t('Learn More')}</a>
                </Button>
            </div>
        </section>
    );
}

function SocialProofStrip() {
    const { t } = useTrans();

    const frameworks = ['ISO 27001', 'GDPR', 'SOC 2', 'KVKK', 'NIST', 'HIPAA'];

    return (
        <section className="border-y bg-muted/50 py-8">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <p className="mb-4 text-center text-sm font-medium text-muted-foreground">
                    {t('Supported Frameworks')}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                    {frameworks.map((framework) => (
                        <Badge key={framework} variant="outline" className="px-3 py-1 text-sm">
                            {framework}
                        </Badge>
                    ))}
                </div>
            </div>
        </section>
    );
}

function FeaturesGrid() {
    const { t } = useTrans();

    const features = [
        {
            icon: Shield,
            title: t('Frameworks & Controls'),
            description: t('Map controls to compliance frameworks and track implementation status across your organization.'),
        },
        {
            icon: AlertTriangle,
            title: t('Risk Management'),
            description: t('Identify, assess, and mitigate risks with a structured risk register and treatment plans.'),
        },
        {
            icon: ClipboardCheck,
            title: t('Audit Management'),
            description: t('Plan and track audits end-to-end with findings, evidence collection, and remediation tracking.'),
        },
        {
            icon: Building2,
            title: t('Vendor Management'),
            description: t('Assess and monitor third-party risks with vendor assessments and continuous oversight.'),
        },
        {
            icon: Eye,
            title: t('Privacy & GDPR'),
            description: t('Manage processing activities, DPIAs, data subject rights requests, and cross-border transfers.'),
        },
        {
            icon: Globe,
            title: t('Trust Center'),
            description: t('Share your compliance posture with stakeholders through a public trust portal.'),
        },
    ];

    return (
        <section id="features" className="py-20 sm:py-28">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
                    {t('Everything You Need')}
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
                    {t('A complete platform for managing your compliance program from start to finish.')}
                </p>
                <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature) => (
                        <Card key={feature.title} className="transition-shadow hover:shadow-md">
                            <CardHeader>
                                <feature.icon className="size-10 text-primary" />
                                <CardTitle className="mt-2">{feature.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">{feature.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}

function HowItWorks() {
    const { t } = useTrans();

    const steps = [
        {
            number: '1',
            title: t('Set Up Your Organization'),
            description: t('Create your organization and invite team members to collaborate.'),
        },
        {
            number: '2',
            title: t('Map Your Compliance'),
            description: t('Import frameworks, define controls, and assign measures across your program.'),
        },
        {
            number: '3',
            title: t('Monitor & Report'),
            description: t('Track risks, run audits, and share your compliance posture via Trust Center.'),
        },
    ];

    return (
        <section className="border-y bg-muted/50 py-20 sm:py-28">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
                    {t('How It Works')}
                </h2>
                <div className="mt-12 grid gap-8 sm:grid-cols-3">
                    {steps.map((step) => (
                        <div key={step.number} className="flex flex-col items-center text-center">
                            <div className="flex size-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                                {step.number}
                            </div>
                            <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
                            <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function BenefitsSection() {
    const { t } = useTrans();

    const benefits = [
        t('Centralized document management'),
        t('Team collaboration & role-based access'),
        t('Activity logging & audit trail'),
        t('Evidence collection & attachments'),
        t('Task tracking & assignments'),
        t('Multi-framework support'),
    ];

    return (
        <section className="py-20 sm:py-28">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <div className="grid items-center gap-12 lg:grid-cols-2">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            {t('Everything you need for compliance management')}
                        </h2>
                        <p className="mt-4 text-muted-foreground">
                            {t('Streamline your entire compliance workflow with tools designed for modern organizations.')}
                        </p>
                    </div>
                    <ul className="grid gap-3 sm:grid-cols-2">
                        {benefits.map((benefit) => (
                            <li key={benefit} className="flex items-start gap-2">
                                <CheckCircle className="mt-0.5 size-5 shrink-0 text-primary" />
                                <span className="text-sm">{benefit}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
}

function CtaBanner({ canRegister }: { canRegister: boolean }) {
    const { t } = useTrans();

    return (
        <section className="py-16">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <Card className="bg-primary text-primary-foreground">
                    <CardContent className="flex flex-col items-center gap-6 py-12 text-center">
                        <h2 className="text-2xl font-bold sm:text-3xl">
                            {t('Ready to simplify your compliance journey?')}
                        </h2>
                        {canRegister && (
                            <Button size="lg" variant="secondary" asChild>
                                <Link href={register()}>
                                    {t('Start Free')}
                                    <ArrowRight />
                                </Link>
                            </Button>
                        )}
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}

function LandingFooter({ appName, canRegister }: { appName: string; canRegister: boolean }) {
    const { t } = useTrans();

    return (
        <footer className="border-t py-8">
            <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
                <div className="flex items-center gap-2">
                    <AppLogoIcon className="size-5 fill-foreground" />
                    <span className="text-sm text-muted-foreground">
                        &copy; {new Date().getFullYear()} {appName}. {t('All rights reserved.')}
                    </span>
                </div>
                <nav className="flex items-center gap-4 text-sm text-muted-foreground">
                    <Link href={login()} className="hover:text-foreground">
                        {t('Log in')}
                    </Link>
                    {canRegister && (
                        <Link href={register()} className="hover:text-foreground">
                            {t('Register')}
                        </Link>
                    )}
                </nav>
            </div>
        </footer>
    );
}

export default function Welcome({ canRegister = true }: { canRegister?: boolean }) {
    const { auth, name } = usePage<SharedData>().props;
    const { t } = useTrans();

    return (
        <>
            <Head title={t('Welcome')}>
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700" rel="stylesheet" />
            </Head>
            <div className="min-h-screen bg-background text-foreground">
                <LandingNav auth={auth} appName={name} canRegister={canRegister} />
                <HeroSection canRegister={canRegister} />
                <SocialProofStrip />
                <FeaturesGrid />
                <HowItWorks />
                <BenefitsSection />
                <CtaBanner canRegister={canRegister} />
                <LandingFooter appName={name} canRegister={canRegister} />
            </div>
        </>
    );
}
