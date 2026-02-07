import { usePage } from '@inertiajs/react';
import type { SharedData } from '@/types';

export function useTrans() {
    const { translations } = usePage<SharedData>().props;

    const t = (key: string): string => {
        return (translations as Record<string, string>)?.[key] ?? key;
    };

    return { t };
}
