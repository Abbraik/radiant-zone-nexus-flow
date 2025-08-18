import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  FileText, 
  Plus, 
  ExternalLink,
  Target,
  Lightbulb,
  Database,
  AlertCircle
} from 'lucide-react';

interface LoopDocsEditorProps {
  purpose: string;
  onChange: (purpose: string) => void;
  readonly?: boolean;
}

interface DocumentSection {
  id: string;
  title: string;
  content: string;
  type: 'purpose' | 'assumptions' | 'evidence' | 'references';
}

export const LoopDocsEditor: React.FC<LoopDocsEditorProps> = ({
  purpose,
  onChange,
  readonly = false
}) => {
  const [assumptions, setAssumptions] = useState('');
  const [evidenceLinks, setEvidenceLinks] = useState<string[]>([]);
  const [newEvidenceLink, setNewEvidenceLink] = useState('');
  const [dataReferences, setDataReferences] = useState<string[]>([]);
  const [newDataReference, setNewDataReference] = useState('');
  const [notes, setNotes] = useState('');

  // Add evidence link
  const handleAddEvidenceLink = () => {
    if (newEvidenceLink.trim() && !evidenceLinks.includes(newEvidenceLink.trim())) {
      setEvidenceLinks([...evidenceLinks, newEvidenceLink.trim()]);
      setNewEvidenceLink('');
    }
  };

  // Remove evidence link
  const handleRemoveEvidenceLink = (link: string) => {
    setEvidenceLinks(evidenceLinks.filter(l => l !== link));
  };

  // Add data reference
  const handleAddDataReference = () => {
    if (newDataReference.trim() && !dataReferences.includes(newDataReference.trim())) {
      setDataReferences([...dataReferences, newDataReference.trim()]);
      setNewDataReference('');
    }
  };

  // Remove data reference
  const handleRemoveDataReference = (ref: string) => {
    setDataReferences(dataReferences.filter(r => r !== ref));
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          <h3 className="font-semibold">Documentation</h3>
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          Purpose, assumptions, evidence, and data references
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Purpose Section */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Target className="h-4 w-4" />
              Purpose & Objectives
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">
                What is the purpose of this loop? What problem does it address?
              </label>
              <Textarea
                value={purpose}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Describe the loop's purpose, the problem it addresses, and the desired outcomes..."
                className="min-h-[100px] text-sm"
                disabled={readonly}
              />
            </div>
            
            {purpose.trim() && (
              <div className="text-xs text-muted-foreground">
                {purpose.trim().split(' ').length} words
              </div>
            )}
          </CardContent>
        </Card>

        {/* Assumptions Section */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Key Assumptions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">
                What assumptions underlie this loop model?
              </label>
              <Textarea
                value={assumptions}
                onChange={(e) => setAssumptions(e.target.value)}
                placeholder="List key assumptions about relationships, behaviors, constraints, and context..."
                className="min-h-[80px] text-sm"
                disabled={readonly}
              />
            </div>
            
            {assumptions.trim() && (
              <div className="flex items-center gap-2 text-xs">
                <AlertCircle className="h-3 w-3 text-amber-500" />
                <span className="text-muted-foreground">
                  Consider testing these assumptions during implementation
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Evidence Links Section */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              Evidence & References
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {!readonly && (
              <div className="flex gap-2">
                <Input
                  value={newEvidenceLink}
                  onChange={(e) => setNewEvidenceLink(e.target.value)}
                  placeholder="https://example.com/research-paper"
                  className="text-sm h-8"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddEvidenceLink()}
                />
                <Button
                  size="sm"
                  onClick={handleAddEvidenceLink}
                  disabled={!newEvidenceLink.trim()}
                  className="h-8 px-3"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            )}
            
            {evidenceLinks.length > 0 ? (
              <div className="space-y-2">
                {evidenceLinks.map((link, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-accent/20 rounded border">
                    <ExternalLink className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                    <a 
                      href={link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline flex-1 truncate"
                    >
                      {link}
                    </a>
                    {!readonly && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRemoveEvidenceLink(link)}
                        className="h-6 w-6 p-0 text-destructive"
                      >
                        ×
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <ExternalLink className="h-6 w-6 mx-auto mb-2 opacity-50" />
                <p className="text-xs">No evidence links added</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Data References Section */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Database className="h-4 w-4" />
              Data References
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {!readonly && (
              <div className="flex gap-2">
                <Input
                  value={newDataReference}
                  onChange={(e) => setNewDataReference(e.target.value)}
                  placeholder="table.column or api.endpoint"
                  className="text-sm h-8"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddDataReference()}
                />
                <Button
                  size="sm"
                  onClick={handleAddDataReference}
                  disabled={!newDataReference.trim()}
                  className="h-8 px-3"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            )}
            
            {dataReferences.length > 0 ? (
              <div className="space-y-2">
                {dataReferences.map((ref, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-accent/20 rounded border">
                    <Database className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                    <code className="text-xs bg-muted px-1 py-0.5 rounded flex-1 truncate">
                      {ref}
                    </code>
                    {!readonly && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRemoveDataReference(ref)}
                        className="h-6 w-6 p-0 text-destructive"
                      >
                        ×
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <Database className="h-6 w-6 mx-auto mb-2 opacity-50" />
                <p className="text-xs">No data references specified</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Additional Notes Section */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Additional Notes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">
                Any additional context, constraints, or implementation notes
              </label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Implementation considerations, known limitations, future enhancements..."
                className="min-h-[80px] text-sm"
                disabled={readonly}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="border-t border-border p-3 bg-accent/10">
        <div className="text-xs text-muted-foreground">
          <div className="flex items-center justify-between">
            <span>Documentation completeness</span>
            <div className="flex items-center gap-2">
              {purpose.trim() && <Badge variant="secondary" className="text-xs">Purpose ✓</Badge>}
              {assumptions.trim() && <Badge variant="secondary" className="text-xs">Assumptions ✓</Badge>}
              {evidenceLinks.length > 0 && <Badge variant="secondary" className="text-xs">Evidence ✓</Badge>}
              {dataReferences.length > 0 && <Badge variant="secondary" className="text-xs">Data ✓</Badge>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};