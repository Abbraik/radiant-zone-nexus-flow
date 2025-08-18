import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Settings, Eye, X, TrendingUp, Clock, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface RetuneSuggestionsProps {
  suggestions: Array<{
    id: string;
    suggestion_type: string;
    title: string;
    description: string;
    rationale: string;
    risk_score: number;
    confidence: number;
    proposed_changes: any;
    impact_level: string;
    created_at: string;
  }>;
  onPreview?: (suggestion: any) => void;
  onDismiss?: (suggestionId: string) => void;
  onGenerateNew?: () => void;
  isGenerating?: boolean;
}

export const RetuneSuggestionsPanel: React.FC<RetuneSuggestionsProps> = ({
  suggestions,
  onPreview,
  onDismiss,
  onGenerateNew,
  isGenerating = false
}) => {
  const getImpactColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'small': return 'bg-green-500/10 text-green-700 border-green-200';
      case 'medium': return 'bg-yellow-500/10 text-yellow-700 border-yellow-200';
      case 'large': return 'bg-red-500/10 text-red-700 border-red-200';
      default: return 'bg-gray-500/10 text-gray-700 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'band_adjustment': return '📊';
      case 'srt_change': return '⏱️';
      case 'asymmetry_tune': return '⚖️';
      default: return '🔧';
    }
  };

  const getRiskColor = (risk: number) => {
    if (risk <= 0.3) return 'text-green-600';
    if (risk <= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card className="shadow-sm hover:shadow-md transition-all">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-purple-500" />
              Retune Suggestions
              <Badge variant="outline">{suggestions.length} available</Badge>
            </CardTitle>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onGenerateNew}
              disabled={isGenerating}
              className="gap-2"
            >
              <TrendingUp className="h-4 w-4" />
              {isGenerating ? 'Generating...' : 'Generate New'}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {suggestions.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-muted-foreground mb-4">
                <Settings className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No suggestions available</p>
                <p className="text-sm">Generate new suggestions based on recent data</p>
              </div>
              <Button onClick={onGenerateNew} disabled={isGenerating}>
                Generate Suggestions
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {suggestions.map((suggestion, index) => (
                <motion.div
                  key={suggestion.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 border rounded-lg bg-card hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <span className="text-xl">{getTypeIcon(suggestion.suggestion_type)}</span>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm mb-1">{suggestion.title}</h4>
                        <p className="text-xs text-muted-foreground mb-2">
                          {suggestion.description}
                        </p>
                        
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getImpactColor(suggestion.impact_level)} variant="outline">
                            {suggestion.impact_level} impact
                          </Badge>
                          
                          <div className="flex items-center gap-1 text-xs">
                            <AlertCircle className="h-3 w-3" />
                            <span className={getRiskColor(suggestion.risk_score)}>
                              {Math.round(suggestion.risk_score * 100)}% risk
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-1">
                      {onPreview && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onPreview(suggestion)}
                          className="h-8 w-8 p-0"
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                      )}
                      {onDismiss && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDismiss(suggestion.id)}
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Confidence and Expected Changes */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Confidence</span>
                      <span className="font-medium">{Math.round(suggestion.confidence * 100)}%</span>
                    </div>
                    <Progress value={suggestion.confidence * 100} className="h-1" />
                    
                    <div className="text-xs text-muted-foreground mt-2 p-2 bg-muted/50 rounded">
                      <strong>Rationale:</strong> {suggestion.rationale}
                    </div>

                    {suggestion.proposed_changes && (
                      <div className="text-xs mt-2">
                        <strong className="text-muted-foreground">Proposed changes:</strong>
                        <div className="mt-1 space-y-1">
                          {Object.entries(suggestion.proposed_changes).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="text-muted-foreground capitalize">
                                {key.replace(/_/g, ' ')}:
                              </span>
                              <span className="font-mono text-xs">{String(value)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {onPreview && (
                    <div className="pt-3 border-t mt-3">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onPreview(suggestion)}
                        className="w-full gap-2"
                      >
                        <Eye className="h-3 w-3" />
                        Preview Changes
                      </Button>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};