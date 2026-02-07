import { router } from '@inertiajs/react';
import { Search, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';

export default function SearchInput({
    value = '',
    placeholder = 'Search...',
}: {
    value?: string;
    placeholder?: string;
}) {
    const [search, setSearch] = useState(value);
    const debounceRef = useRef<ReturnType<typeof setTimeout>>();

    useEffect(() => {
        setSearch(value);
    }, [value]);

    function handleChange(newValue: string) {
        setSearch(newValue);

        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            router.get(
                window.location.pathname,
                newValue ? { search: newValue } : {},
                { preserveState: true, replace: true },
            );
        }, 300);
    }

    return (
        <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
                value={search}
                onChange={(e) => handleChange(e.target.value)}
                placeholder={placeholder}
                className="pl-9 pr-9"
            />
            {search && (
                <button
                    type="button"
                    onClick={() => handleChange('')}
                    className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
                >
                    <X className="h-4 w-4" />
                </button>
            )}
        </div>
    );
}
