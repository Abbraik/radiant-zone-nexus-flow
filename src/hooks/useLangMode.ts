import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { LangMode } from '@/i18n/labels';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Language mode hook with user preferences and URL override
 * Reads from user profile + URL ?mode=general|expert, falls back to general
 */
export function useLangMode() {
  const [langMode, setLangMode] = useState<LangMode>('general');
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  
  // Get mode from URL parameter
  const urlMode = searchParams.get('mode') as LangMode;
  
  useEffect(() => {
    async function loadUserLanguageMode() {
      if (!user) {
        setLangMode('general');
        return;
      }
      
      // Check for URL override first
      if (urlMode && (urlMode === 'general' || urlMode === 'expert')) {
        setLangMode(urlMode);
        return;
      }
      
      try {
        // Load from user settings
        const { data: settings } = await supabase
          .from('user_settings')
          .select('lang_mode')
          .eq('user_id', user.id)
          .single();
          
        if (settings?.lang_mode) {
          setLangMode(settings.lang_mode as LangMode);
        }
      } catch (error) {
        console.warn('Failed to load user language mode:', error);
        setLangMode('general');
      }
    }
    
    loadUserLanguageMode();
  }, [user, urlMode]);
  
  // Update user settings when mode changes (but not for URL overrides)
  const updateLangMode = async (newMode: LangMode) => {
    setLangMode(newMode);
    
    if (!user || urlMode) return; // Don't persist if URL override is active
    
    try {
      await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          lang_mode: newMode
        });
    } catch (error) {
      console.error('Failed to update language mode:', error);
    }
  };
  
  // Set URL parameter for mode
  const setUrlMode = (mode: LangMode | null) => {
    const newParams = new URLSearchParams(searchParams);
    if (mode) {
      newParams.set('mode', mode);
    } else {
      newParams.delete('mode');
    }
    setSearchParams(newParams);
  };
  
  return {
    langMode,
    setLangMode: updateLangMode,
    setUrlMode,
    isUrlOverride: !!urlMode
  };
}