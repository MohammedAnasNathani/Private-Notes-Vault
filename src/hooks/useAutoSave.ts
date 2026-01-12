import { useEffect, useRef, useCallback } from 'react';

interface AutoSaveOptions {
    data: { title: string; content: string };
    onSave: (title: string, content: string) => Promise<void>;
    delay?: number;
    enabled?: boolean;
}

export function useAutoSave({ data, onSave, delay = 2000, enabled = true }: AutoSaveOptions) {
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const lastSavedRef = useRef<string>('');
    const isSavingRef = useRef(false);

    const save = useCallback(async () => {
        const currentData = JSON.stringify(data);

        if (currentData === lastSavedRef.current || isSavingRef.current) {
            return;
        }

        if (!data.title.trim() || !data.content.trim()) {
            return;
        }

        isSavingRef.current = true;
        try {
            await onSave(data.title.trim(), data.content.trim());
            lastSavedRef.current = currentData;
        } catch (error) {
            console.error('Auto-save failed:', error);
        } finally {
            isSavingRef.current = false;
        }
    }, [data, onSave]);

    useEffect(() => {
        if (!enabled) return;

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            save();
        }, delay);

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [data, delay, enabled, save]);

    return { save };
}
