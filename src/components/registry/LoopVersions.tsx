import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GitBranch, Download, Eye, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { LoopVersion } from '@/types/loop-registry';
import { formatDistanceToNow } from 'date-fns';

interface LoopVersionsProps {
  loopId: string;
}

export const LoopVersions: React.FC<LoopVersionsProps> = ({ loopId }) => {
  const { data: versions, isLoading } = useQuery({
    queryKey: ['loop-versions', loopId],
    queryFn: async (): Promise<LoopVersion[]> => {
      const { data, error } = await supabase
        .from('loop_versions')
        .select('*')
        .eq('loop_id', loopId)
        .order('version', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  const handleDownloadVersion = (version: LoopVersion) => {
    const blob = new Blob([JSON.stringify(version.payload, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `loop_v${version.version}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleViewVersion = (version: LoopVersion) => {
    // Here you could open a modal to view the version details
    console.log('View version:', version);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-muted-foreground">Loading version history...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <GitBranch className="h-5 w-5" />
            Version History
          </h2>
          <p className="text-muted-foreground">
            Track changes and snapshots of this loop over time
          </p>
        </div>
        <Badge variant="outline" className="flex items-center gap-1">
          <GitBranch className="h-3 w-3" />
          {versions?.length || 0} versions
        </Badge>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-4"
      >
        {versions && versions.length > 0 ? (
          versions.map((version, index) => (
            <motion.div
              key={version.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant={index === 0 ? 'default' : 'secondary'}>
                        v{version.version}
                        {index === 0 && ' (current)'}
                      </Badge>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(new Date(version.created_at), { addSuffix: true })}
                      </div>
                    </div>
                    
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleViewVersion(version)}
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDownloadVersion(version)}
                        className="h-8 w-8 p-0"
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Name:</span>
                      <div className="font-medium">{version.payload.name}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Type:</span>
                      <div className="font-medium">{version.payload.loop_type}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Scale:</span>
                      <div className="font-medium">{version.payload.scale}</div>
                    </div>
                  </div>
                  
                  {version.payload.notes && (
                    <div className="mt-3 pt-3 border-t">
                      <span className="text-muted-foreground text-sm">Notes:</span>
                      <p className="text-sm mt-1 line-clamp-2">
                        {version.payload.notes}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <GitBranch className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium mb-2">No Version History</h3>
              <p className="text-muted-foreground">
                Versions will appear here when the loop is published
              </p>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  );
};