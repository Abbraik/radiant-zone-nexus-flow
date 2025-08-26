import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ExternalLink, Clock, Shield, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ShareData {
  share_id: string;
  kind: string;
  entity_id: string;
  redaction_profile: 'public' | 'partner' | 'internal';
  expires_at: string | null;
  created_at: string;
  is_valid: boolean;
  entity_data?: any;
}

export const ShareView: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [shareData, setShareData] = useState<ShareData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  
  useEffect(() => {
    if (!token) return;
    
    loadShareData();
  }, [token]);
  
  const loadShareData = async () => {
    try {
      // Get share info from public view
      const { data: share } = await supabase
        .from('public_shares')
        .select('*')
        .eq('token', token)
        .single();
        
      if (!share) {
        setError('Share not found or has been revoked');
        return;
      }
      
      if (!share.is_valid) {
        setError('This share link has expired or been revoked');
        return;
      }
      
      // For demo purposes, we'll use mock data
      // In production, this would fetch the actual entity data with redaction applied
      const mockEntityData = generateMockData(share.kind, share.redaction_profile as 'public' | 'partner' | 'internal');
      
      setShareData({
        ...share,
        redaction_profile: share.redaction_profile as 'public' | 'partner' | 'internal',
        entity_data: mockEntityData
      });
      
    } catch (err) {
      console.error('Failed to load share:', err);
      setError('Failed to load shared content');
    } finally {
      setLoading(false);
    }
  };
  
  const generateMockData = (kind: string, profile: 'public' | 'partner' | 'internal') => {
    const baseData = {
      status_banner: {
        title: 'System Status Update',
        status: 'Monitoring',
        priority: 'Medium',
        lastUpdated: '2025-08-26T10:30:00Z',
        description: 'Current system performance within normal parameters',
        metrics: { response_time: '150ms', availability: '99.8%' }
      },
      decision_note: {
        title: 'Resource Allocation Decision',
        decision: 'Approved with conditions',
        rationale: 'Based on analysis of current capacity and projected needs',
        implementationDate: '2025-09-01',
        reviewDate: '2025-12-01'
      },
      learning_deck: {
        title: 'Incident Response Review',
        verdict: 'Successful with improvements needed',
        keyLessons: ['Response time met target', 'Communication gaps identified'],
        recommendations: ['Update escalation procedures', 'Enhance monitoring alerts']
      },
      readiness_plan: {
        title: 'Emergency Response Readiness',
        preparationLevel: 'High',
        triggersArmed: 3,
        resourcesPrepositioned: true,
        lastReview: '2025-08-20'
      },
      public_dossier: {
        title: 'Policy Implementation Summary',
        status: 'Published',
        effectiveDate: '2025-09-15',
        summary: 'New guidelines for service delivery improvements'
      }
    };
    
    let data = { ...baseData[kind as keyof typeof baseData] };
    
    // Apply redaction based on profile
    if (profile === 'public') {
      // Redact sensitive information for public sharing
      if ('lastUpdated' in data) data.lastUpdated = 'Recently';
      if ('metrics' in data && data.metrics) data.metrics = { response_time: '[REDACTED]', availability: 'Good' };
    } else if (profile === 'partner') {
      // Moderate redaction for partners
      if ('metrics' in data && data.metrics) data.metrics = { ...data.metrics, response_time: '~150ms' };
    }
    // Internal shows full data
    
    return data;
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const getKindLabel = (kind: string) => {
    const labels = {
      status_banner: 'Status Banner',
      decision_note: 'Decision Note',
      learning_deck: 'Learning Deck',
      readiness_plan: 'Readiness Plan',
      public_dossier: 'Public Dossier'
    };
    return labels[kind as keyof typeof labels] || kind;
  };
  
  const getProfileIcon = (profile: string) => {
    switch (profile) {
      case 'public': return <Shield className="h-4 w-4" />;
      case 'partner': return <ExternalLink className="h-4 w-4" />;
      case 'internal': return <Clock className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-background-secondary flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
          <p className="text-foreground-subtle">Loading shared content...</p>
        </div>
      </div>
    );
  }
  
  if (error || !shareData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-background-secondary flex items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <AlertTriangle className="h-12 w-12 text-destructive mx-auto" />
              <h1 className="text-xl font-semibold">Content Not Available</h1>
              <p className="text-foreground-subtle">
                {error || 'The shared content you\'re looking for could not be found.'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background-secondary">
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-2xl font-bold">Shared Content</h1>
            <Badge variant="outline" className="flex items-center gap-1">
              {getProfileIcon(shareData.redaction_profile)}
              {shareData.redaction_profile}
            </Badge>
          </div>
          <p className="text-foreground-subtle">
            {getKindLabel(shareData.kind)} • Shared on {formatDate(shareData.created_at)}
          </p>
          
          {shareData.expires_at && (
            <Alert>
              <Clock className="h-4 w-4" />
              <AlertDescription>
                This link expires on {formatDate(shareData.expires_at)}
              </AlertDescription>
            </Alert>
          )}
        </div>
        
        {/* Content */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{shareData.entity_data.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Render content based on kind */}
            {shareData.kind === 'status_banner' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant={shareData.entity_data.status === 'Monitoring' ? 'secondary' : 'default'}>
                    {shareData.entity_data.status}
                  </Badge>
                  <Badge variant="outline">{shareData.entity_data.priority} Priority</Badge>
                </div>
                <p>{shareData.entity_data.description}</p>
                {shareData.entity_data.metrics && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="text-sm text-foreground-subtle">Response Time</div>
                      <div className="font-semibold">{shareData.entity_data.metrics.response_time}</div>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="text-sm text-foreground-subtle">Availability</div>
                      <div className="font-semibold">{shareData.entity_data.metrics.availability}</div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {shareData.kind === 'decision_note' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant="default">{shareData.entity_data.decision}</Badge>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Rationale</h4>
                  <p>{shareData.entity_data.rationale}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium text-sm text-foreground-subtle">Implementation</h5>
                    <p>{formatDate(shareData.entity_data.implementationDate)}</p>
                  </div>
                  <div>
                    <h5 className="font-medium text-sm text-foreground-subtle">Review</h5>
                    <p>{formatDate(shareData.entity_data.reviewDate)}</p>
                  </div>
                </div>
              </div>
            )}
            
            {shareData.kind === 'learning_deck' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant="default">{shareData.entity_data.verdict}</Badge>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Key Lessons</h4>
                  <ul className="space-y-1">
                    {shareData.entity_data.keyLessons.map((lesson: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>{lesson}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Recommendations</h4>
                  <ul className="space-y-1">
                    {shareData.entity_data.recommendations.map((rec: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            
            {/* Add other content type renderers as needed */}
          </CardContent>
        </Card>
        
        {/* Footer */}
        <div className="text-center space-y-2 text-sm text-foreground-subtle">
          <div className="flex items-center justify-center gap-4">
            <span>Workspace-5C System</span>
            <span>•</span>
            <span>Version 1.0</span>
            <span>•</span>
            <span>{formatDate(shareData.created_at)}</span>
          </div>
          <p className="italic">
            For information purposes only. Content subject to change without notice.
          </p>
        </div>
      </div>
    </div>
  );
};