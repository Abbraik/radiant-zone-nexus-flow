import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { History, Download, Eye, Copy, GitBranch } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface VersionsReadOnlyProps {
  loopId?: string;
}

// Mock version data
const mockVersions = [
  {
    id: '1',
    version: 3,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    changes: ['Added 2 nodes', 'Updated metadata', 'Fixed edge polarities'],
    payload: {
      loop: { name: 'Customer Satisfaction Loop v3' },
      nodes: [{ id: '1', label: 'Customer Input' }],
      edges: []
    }
  },
  {
    id: '2',
    version: 2,
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    changes: ['Initial structure', 'Added basic nodes'],
    payload: {
      loop: { name: 'Customer Satisfaction Loop v2' },
      nodes: [],
      edges: []
    }
  },
  {
    id: '3',
    version: 1,
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    changes: ['Initial version'],
    payload: {
      loop: { name: 'Customer Satisfaction Loop v1' },
      nodes: [],
      edges: []
    }
  }
];

export const VersionsReadOnly: React.FC<VersionsReadOnlyProps> = ({ loopId }) => {
  const [selectedVersion, setSelectedVersion] = useState<any>(null);
  const [showDiff, setShowDiff] = useState(false);

  const handleExportVersion = (version: any) => {
    const blob = new Blob([JSON.stringify(version.payload, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `loop-v${version.version}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
  };

  const handleRestoreAsDraft = (version: any) => {
    // This would create a new draft pre-filled with the version data
    console.log('Restore as draft:', version);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Version History</h2>
        <Badge variant="outline">Read Only</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="w-5 h-5" />
            Published Versions ({mockVersions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockVersions.map((version, index) => (
              <div
                key={version.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <Badge variant={index === 0 ? 'default' : 'secondary'}>
                      v{version.version}
                    </Badge>
                    {index === 0 && (
                      <Badge variant="outline">Latest</Badge>
                    )}
                    <span className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(version.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  
                  <div className="mt-2">
                    <div className="text-sm text-muted-foreground">
                      Changes: {version.changes.join(', ')}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedVersion(version)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Version {version.version} Details</DialogTitle>
                      </DialogHeader>
                      <ScrollArea className="h-96">
                        <pre className="text-xs bg-muted p-4 rounded-lg overflow-x-auto">
                          {JSON.stringify(version.payload, null, 2)}
                        </pre>
                      </ScrollArea>
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleExportVersion(version)}
                  >
                    <Download className="w-4 h-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopyId(version.id)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRestoreAsDraft(version)}
                  >
                    Restore as Draft
                  </Button>
                </div>
              </div>
            ))}

            {mockVersions.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No published versions yet</p>
                <p className="text-sm">Publish your loop to create the first version</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Version Comparison */}
      {mockVersions.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Version Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4 text-muted-foreground">
              <p>Version diff viewer coming soon</p>
              <p className="text-sm">Compare changes between any two versions</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Version Timeline Visualization */}
      <Card>
        <CardHeader>
          <CardTitle>Version Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div className="absolute left-8 top-4 bottom-4 w-0.5 bg-border"></div>
            <div className="space-y-6">
              {mockVersions.map((version, index) => (
                <div key={version.id} className="relative flex items-center gap-4">
                  <div className={`w-4 h-4 rounded-full border-2 bg-background ${
                    index === 0 ? 'border-primary' : 'border-muted-foreground'
                  }`}></div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Version {version.version}</span>
                      {index === 0 && <Badge variant="outline">Current</Badge>}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(version.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};