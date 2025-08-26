import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useLangMode } from '@/hooks/useLangMode';
import { label, masterDict, labelBoth } from '@/i18n/labels';

interface LanguageToggleProps {
  className?: string;
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({ className }) => {
  const { langMode, setLangMode, isUrlOverride } = useLangMode();
  
  const toggleMode = () => {
    const newMode = langMode === 'general' ? 'expert' : 'general';
    setLangMode(newMode);
  };
  
  const currentLabel = langMode === 'general' ? 'Simple terms' : 'Expert terms';
  const otherLabel = langMode === 'general' ? 'Expert terms' : 'Simple terms';
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          onClick={toggleMode}
          className={`relative px-3 py-1 text-xs font-medium transition-all duration-200 ${className}`}
        >
          <span className="flex items-center gap-2">
            {currentLabel}
            <span className="text-foreground-subtle">|</span>
            <span className="text-foreground-subtle">{otherLabel}</span>
          </span>
          {isUrlOverride && (
            <span className="absolute -top-1 -right-1 h-2 w-2 bg-primary rounded-full" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Switch to {otherLabel}</p>
        {isUrlOverride && <p className="text-xs text-foreground-subtle mt-1">URL override active</p>}
      </TooltipContent>
    </Tooltip>
  );
};

/**
 * Tooltip component that shows alternate language term on hover
 */
interface TermTooltipProps {
  termKey: string;
  children: React.ReactNode;
  dict?: Record<string, any>;
}

export const TermTooltip: React.FC<TermTooltipProps> = ({ 
  termKey, 
  children, 
  dict = masterDict 
}) => {
  const { langMode } = useLangMode();
  const { general, expert } = labelBoth(dict, termKey);
  
  const alternateLabel = langMode === 'general' ? expert : general;
  
  if (general === expert) {
    return <>{children}</>;
  }
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="cursor-help border-b border-dotted border-foreground-subtle/30">
          {children}
        </span>
      </TooltipTrigger>
      <TooltipContent>
        <p className="text-xs">
          <span className="text-foreground-subtle">
            {langMode === 'general' ? 'Expert term:' : 'Simple term:'}
          </span>{' '}
          {alternateLabel}
        </p>
      </TooltipContent>
    </Tooltip>
  );
};