import { useEffect, useCallback } from 'react';

export interface KeyboardNavigationOptions {
  enabled?: boolean;
  preventDefault?: boolean;
  stopPropagation?: boolean;
}

export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  action: () => void;
  description?: string;
}

export const useKeyboardNavigation = (
  shortcuts: KeyboardShortcut[],
  options: KeyboardNavigationOptions = {}
) => {
  const {
    enabled = true,
    preventDefault = true,
    stopPropagation = true
  } = options;

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    const matchingShortcut = shortcuts.find(shortcut => {
      const keyMatches = event.key.toLowerCase() === shortcut.key.toLowerCase();
      const ctrlMatches = !!shortcut.ctrlKey === event.ctrlKey;
      const shiftMatches = !!shortcut.shiftKey === event.shiftKey;
      const altMatches = !!shortcut.altKey === event.altKey;

      return keyMatches && ctrlMatches && shiftMatches && altMatches;
    });

    if (matchingShortcut) {
      if (preventDefault) event.preventDefault();
      if (stopPropagation) event.stopPropagation();
      matchingShortcut.action();
    }
  }, [shortcuts, enabled, preventDefault, stopPropagation]);

  useEffect(() => {
    if (enabled) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [handleKeyDown, enabled]);

  return {
    shortcuts: shortcuts.map(shortcut => ({
      ...shortcut,
      displayKey: `${shortcut.ctrlKey ? 'Ctrl+' : ''}${shortcut.shiftKey ? 'Shift+' : ''}${shortcut.altKey ? 'Alt+' : ''}${shortcut.key.toUpperCase()}`
    }))
  };
};

// Hook for focus management within components
export const useFocusManagement = () => {
  const focusFirst = useCallback((container: HTMLElement | null) => {
    if (!container) return;
    
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    if (firstElement) {
      firstElement.focus();
    }
  }, []);

  const focusLast = useCallback((container: HTMLElement | null) => {
    if (!container) return;
    
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
    if (lastElement) {
      lastElement.focus();
    }
  }, []);

  const trapFocus = useCallback((container: HTMLElement | null) => {
    if (!container) return () => {};

    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    
    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  }, []);

  return {
    focusFirst,
    focusLast,
    trapFocus
  };
};

// Common keyboard shortcuts for Act Zone
export const ACT_ZONE_SHORTCUTS: Record<string, KeyboardShortcut[]> = {
  global: [
    {
      key: 'Escape',
      action: () => {
        // Close any open modals/panels
        const event = new CustomEvent('act-zone-escape');
        document.dispatchEvent(event);
      },
      description: 'Close modals and panels'
    },
    {
      key: '?',
      action: () => {
        // Show keyboard shortcuts help
        const event = new CustomEvent('act-zone-help');
        document.dispatchEvent(event);
      },
      description: 'Show keyboard shortcuts'
    }
  ],
  
  navigation: [
    {
      key: 'Tab',
      action: () => {
        // Default tab behavior - no custom action needed
      },
      description: 'Navigate between elements'
    },
    {
      key: 'Enter',
      action: () => {
        // Activate focused element
      },
      description: 'Activate focused element'
    },
    {
      key: 'Space',
      action: () => {
        // Activate buttons/checkboxes
      },
      description: 'Activate buttons and toggles'
    }
  ],

  intervention: [
    {
      key: 'n',
      ctrlKey: true,
      action: () => {
        const event = new CustomEvent('act-zone-new-intervention');
        document.dispatchEvent(event);
      },
      description: 'Create new intervention'
    },
    {
      key: 'e',
      ctrlKey: true,
      action: () => {
        const event = new CustomEvent('act-zone-edit-intervention');
        document.dispatchEvent(event);
      },
      description: 'Edit selected intervention'
    },
    {
      key: 'Delete',
      action: () => {
        const event = new CustomEvent('act-zone-delete-intervention');
        document.dispatchEvent(event);
      },
      description: 'Delete selected intervention'
    }
  ],

  bundle: [
    {
      key: 's',
      ctrlKey: true,
      action: () => {
        const event = new CustomEvent('act-zone-save-bundle');
        document.dispatchEvent(event);
      },
      description: 'Save bundle'
    },
    {
      key: 'p',
      ctrlKey: true,
      action: () => {
        const event = new CustomEvent('act-zone-publish-bundle');
        document.dispatchEvent(event);
      },
      description: 'Publish bundle'
    },
    {
      key: 'v',
      ctrlKey: true,
      action: () => {
        const event = new CustomEvent('act-zone-validate-bundle');
        document.dispatchEvent(event);
      },
      description: 'Validate bundle'
    }
  ],

  view: [
    {
      key: '1',
      ctrlKey: true,
      action: () => {
        const event = new CustomEvent('act-zone-switch-view', { detail: 'recommendations' });
        document.dispatchEvent(event);
      },
      description: 'Focus recommendation pane'
    },
    {
      key: '2',
      ctrlKey: true,
      action: () => {
        const event = new CustomEvent('act-zone-switch-view', { detail: 'levers' });
        document.dispatchEvent(event);
      },
      description: 'Focus lever selector'
    },
    {
      key: '3',
      ctrlKey: true,
      action: () => {
        const event = new CustomEvent('act-zone-switch-view', { detail: 'metasolve' });
        document.dispatchEvent(event);
      },
      description: 'Focus MetaSolve config'
    },
    {
      key: '4',
      ctrlKey: true,
      action: () => {
        const event = new CustomEvent('act-zone-switch-view', { detail: 'simulation' });
        document.dispatchEvent(event);
      },
      description: 'Focus impact simulation'
    }
  ]
};

export default useKeyboardNavigation;