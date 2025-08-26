import React, { useState } from 'react';
import { Share2, Copy, Check, Eye, EyeOff, Calendar, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { label, masterDict } from '@/i18n/labels';
import { useLangMode } from '@/hooks/useLangMode';

type ShareKind = 'status_banner' | 'decision_note' | 'learning_deck' | 'readiness_plan' | 'public_dossier';
type RedactionProfile = 'public' | 'partner' | 'internal';

interface ShareButtonProps {
  kind: ShareKind;
  entityId: string;
  entityTitle: string;
  entityData: any;
  className?: string;
}

interface ShareRecord {
  share_id: string;
  token: string;
  redaction_profile: RedactionProfile;
  expires_at: string | null;
  created_at: string;
}

const redactionProfiles: Record<RedactionProfile, { label: string; description: string; icon: React.ReactNode }> = {
  public: {
    label: 'Public',
    description: 'Safe for anyone - names, precise data, and sensitive details hidden',
    icon: <Eye className="h-4 w-4" />
  },
  partner: {
    label: 'Partner',
    description: 'For trusted partners - dates and regions shown, but no personal info',
    icon: <EyeOff className="h-4 w-4" />
  },
  internal: {
    label: 'Internal',
    description: 'Full content for internal use - requires authentication',
    icon: <Eye className="h-4 w-4" />
  }
};

export const ShareButton: React.FC<ShareButtonProps> = ({
  kind,
  entityId,
  entityTitle,
  entityData,
  className
}) => {
  const { user } = useAuth();
  const { langMode } = useLangMode();
  const [isCreating, setIsCreating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<RedactionProfile>('public');
  const [expiryDays, setExpiryDays] = useState<number | null>(null);
  const [shareUrl, setShareUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [activeShares, setActiveShares] = useState<ShareRecord[]>([]);
  
  // Load existing shares
  React.useEffect(() => {
    if (!user) return;
    
    loadActiveShares();
  }, [user, entityId]);
  
  const loadActiveShares = async () => {
    if (!user) return;
    
    try {
      const { data } = await supabase
        .from('shares')
        .select('share_id, token, redaction_profile, expires_at, created_at')
        .eq('entity_id', entityId)
        .eq('kind', kind)
        .is('revoked_at', null)
        .order('created_at', { ascending: false });
        
      if (data) {
        setActiveShares(data as ShareRecord[]);
      }
    } catch (error) {
      console.error('Failed to load shares:', error);
    }
  };
  
  const createShare = async () => {
    if (!user) return;
    
    setIsCreating(true);
    try {
      const expiresAt = expiryDays ? new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000).toISOString() : null;
      
      const { data, error } = await supabase
        .from('shares')
        .insert({
          kind,
          entity_id: entityId,
          redaction_profile: selectedProfile,
          expires_at: expiresAt,
          created_by: user.id
        })
        .select('token')
        .single();
        
      if (error) throw error;
      
      const url = `${window.location.origin}/share/${data.token}`;
      setShareUrl(url);
      
      // Copy to clipboard
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      
      toast({
        title: "Share link created",
        description: "Link copied to clipboard"
      });
      
      loadActiveShares();
    } catch (error) {
      console.error('Failed to create share:', error);
      toast({
        title: "Failed to create share",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };
  
  const revokeShare = async (shareId: string) => {
    try {
      await supabase
        .from('shares')
        .update({ revoked_at: new Date().toISOString() })
        .eq('share_id', shareId);
        
      toast({
        title: "Share revoked",
        description: "Link is no longer accessible"
      });
      
      loadActiveShares();
    } catch (error) {
      console.error('Failed to revoke share:', error);
      toast({
        title: "Failed to revoke share",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };
  
  const copyShareUrl = async (token: string) => {
    const url = `${window.location.origin}/share/${token}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
    toast({
      title: "Link copied",
      description: "Share URL copied to clipboard"
    });
  };
  
  const getRedactedPreview = (profile: RedactionProfile) => {
    // Mock redaction logic - would be more sophisticated in practice
    const redacted = { ...entityData };
    
    if (profile === 'public') {
      // Hide sensitive data for public sharing
      if (redacted.assignee) redacted.assignee = 'Team Member';
      if (redacted.created_by) redacted.created_by = 'Staff';
      if (redacted.cost) redacted.cost = '[REDACTED]';
      if (redacted.precise_timestamp) redacted.precise_timestamp = 'This week';
    } else if (profile === 'partner') {
      // Moderate redaction for partners
      if (redacted.cost) redacted.cost = '~$' + Math.round(redacted.cost / 1000) + 'k';
    }
    // Internal profile shows full data
    
    return redacted;
  };
  
  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className={className}>
            <Share2 className="h-4 w-4 mr-2" />
            {label(masterDict, 'SHARE', langMode)}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Share Options</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {Object.entries(redactionProfiles).map(([profile, config]) => (
            <DialogTrigger key={profile} asChild>
              <DropdownMenuItem
                onClick={() => setSelectedProfile(profile as RedactionProfile)}
                className="cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  {config.icon}
                  <div>
                    <div className="font-medium">{config.label}</div>
                    <div className="text-xs text-foreground-subtle">
                      {config.description}
                    </div>
                  </div>
                </div>
              </DropdownMenuItem>
            </DialogTrigger>
          ))}
          
          {activeShares.length > 0 && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Active Shares</DropdownMenuLabel>
              {activeShares.map((share) => (
                <DropdownMenuItem key={share.share_id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {redactionProfiles[share.redaction_profile].label}
                    </Badge>
                    <span className="text-xs text-foreground-subtle">
                      {new Date(share.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        copyShareUrl(share.token);
                      }}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        revokeShare(share.share_id);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </DropdownMenuItem>
              ))}
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Share {entityTitle}
          </DialogTitle>
          <DialogDescription>
            Create a secure, shareable link with {redactionProfiles[selectedProfile].label.toLowerCase()} privacy settings
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Privacy Level */}
          <div className="space-y-3">
            <Label>Privacy Level</Label>
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              {redactionProfiles[selectedProfile].icon}
              <div>
                <div className="font-medium">{redactionProfiles[selectedProfile].label}</div>
                <div className="text-sm text-foreground-subtle">
                  {redactionProfiles[selectedProfile].description}
                </div>
              </div>
            </div>
          </div>
          
          {/* Expiry */}
          <div className="space-y-3">
            <Label>Link Expiry (optional)</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="Days"
                value={expiryDays || ''}
                onChange={(e) => setExpiryDays(e.target.value ? parseInt(e.target.value) : null)}
                className="w-24"
              />
              <span className="text-sm text-foreground-subtle">days from now</span>
            </div>
          </div>
          
          {/* Preview */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Preview ({redactionProfiles[selectedProfile].label})</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
              >
                {showPreview ? 'Hide' : 'Show'} Preview
              </Button>
            </div>
            
            {showPreview && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">{entityTitle}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-foreground-subtle font-mono">
                    <pre>{JSON.stringify(getRedactedPreview(selectedProfile), null, 2)}</pre>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* Actions */}
          <div className="flex items-center justify-between pt-4">
            <div className="text-sm text-foreground-subtle">
              Links can be revoked anytime
            </div>
            <div className="flex items-center gap-2">
              {shareUrl && (
                <div className="flex items-center gap-2">
                  <Input
                    value={shareUrl}
                    readOnly
                    className="w-64 text-xs"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyShareUrl(shareUrl.split('/').pop() || '')}
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              )}
              <Button
                onClick={createShare}
                disabled={isCreating}
              >
                {isCreating ? 'Creating...' : shareUrl ? 'Create New' : 'Create Share Link'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};