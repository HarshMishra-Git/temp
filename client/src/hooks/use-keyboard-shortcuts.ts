import { useEffect } from 'react';

type ShortcutHandler = (e: KeyboardEvent) => void;

interface ShortcutMap {
  [key: string]: {
    handler: ShortcutHandler;
    description: string;
  };
}

export function useKeyboardShortcuts(shortcuts: ShortcutMap) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = `${e.ctrlKey ? 'Ctrl+' : ''}${e.shiftKey ? 'Shift+' : ''}${e.key.toUpperCase()}`;
      
      const shortcut = shortcuts[key];
      if (shortcut) {
        e.preventDefault();
        shortcut.handler(e);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);

  return Object.entries(shortcuts).reduce((acc, [key, { description }]) => {
    acc[key] = description;
    return acc;
  }, {} as Record<string, string>);
}
