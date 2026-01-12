import { useEffect, useCallback } from 'react';

type KeyHandler = () => void;

interface KeyboardShortcut {
    key: string;
    ctrlKey?: boolean;
    metaKey?: boolean;
    shiftKey?: boolean;
    handler: KeyHandler;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            for (const shortcut of shortcuts) {
                const ctrlOrMeta = shortcut.ctrlKey || shortcut.metaKey;
                const isCtrlOrMetaPressed = event.ctrlKey || event.metaKey;

                if (
                    event.key.toLowerCase() === shortcut.key.toLowerCase() &&
                    (!ctrlOrMeta || isCtrlOrMetaPressed) &&
                    (!shortcut.shiftKey || event.shiftKey)
                ) {
                    event.preventDefault();
                    shortcut.handler();
                    break;
                }
            }
        },
        [shortcuts]
    );

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);
}
