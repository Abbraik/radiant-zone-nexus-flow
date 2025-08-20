import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Eye, 
  Edit, 
  Download, 
  Calendar,
  Network,
  Target,
  Clock,
  MoreHorizontal
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LoopData } from '@/types/loop-registry';
import { ViewMode } from '@/types/registry-ui';
import { formatDistanceToNow } from 'date-fns';

interface RegistryResultsProps {
  data: LoopData[];
  isLoading: boolean;
  viewMode: ViewMode;
  onExport: (loopId: string) => void;
  totalCount: number;
}

const getLoopTypeColor = (type: string) => {
  const colors = {
    reactive: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    structural: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    perceptual: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    anticipatory: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
  };
  return colors[type as keyof typeof colors] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
};

const getScaleColor = (scale: string) => {
  const colors = {
    micro: 'bg-green-500/20 text-green-300 border-green-500/30',
    meso: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    macro: 'bg-red-500/20 text-red-300 border-red-500/30',
    meta: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
  };
  return colors[scale as keyof typeof colors] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
};

// Helper function to get the actual layer for display
const getDisplayLayer = (loop: LoopData): string => {
  const loopCode = loop.metadata?.loop_code || '';
  if (loopCode.startsWith('META-')) return 'meta';
  if (loopCode.startsWith('MAC-')) return 'macro';
  if (loopCode.startsWith('MES-')) return 'meso';
  if (loopCode.startsWith('MIC-')) return 'micro';
  return loop.scale; // fallback to scale if no loop code
};

const getStatusColor = (status: string) => {
  const colors = {
    draft: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
    published: 'bg-green-500/20 text-green-300 border-green-500/30'
  };
  return colors[status as keyof typeof colors] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
};

const LoadingSkeleton: React.FC<{ viewMode: ViewMode }> = ({ viewMode }) => {
  if (viewMode === 'cards') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="glass-secondary">
            <CardHeader className="pb-3">
              <Skeleton className="h-4 w-3/4" />
              <div className="flex gap-2 mt-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-16" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-2/3" />
                <div className="flex justify-between items-center mt-4">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-16 w-full" />
      ))}
    </div>
  );
};

const LoopCard: React.FC<{ 
  loop: LoopData; 
  onExport: (id: string) => void; 
  index: number;
}> = ({ loop, onExport, index }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      layout
    >
      <Card className="glass-secondary hover:glass transition-all duration-200 cursor-pointer group h-full">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <h3 
              className="font-semibold text-foreground group-hover:text-primary transition-colors cursor-pointer"
              onClick={() => navigate(`/registry/${loop.id}`)}
            >
              {loop.name}
            </h3>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/registry/${loop.id}`);
                }}
                className="h-7 w-7 p-0"
              >
                <Eye className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/registry/${loop.id}/edit`);
                }}
                className="h-7 w-7 p-0"
              >
                <Edit className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onExport(loop.id);
                }}
                className="h-7 w-7 p-0"
              >
                <Download className="w-3 h-3" />
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-1 mt-2">
            <Badge className={getLoopTypeColor(loop.loop_type)}>
              {loop.loop_type}
            </Badge>
            <Badge className={getScaleColor(getDisplayLayer(loop))}>
              {getDisplayLayer(loop)}
            </Badge>
            <Badge className={getStatusColor(loop.status)}>
              {loop.status}
            </Badge>
          </div>
        </CardHeader>

        <CardContent>
          {loop.notes && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {loop.notes}
            </p>
          )}

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Network className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                {loop.node_count || 0} nodes
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                v{loop.version}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              {formatDistanceToNow(new Date(loop.updated_at), { addSuffix: true })}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/registry/${loop.id}`)}
              className="text-xs"
            >
              Open
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const LoopTableRow: React.FC<{ 
  loop: LoopData; 
  onExport: (id: string) => void; 
}> = ({ loop, onExport }) => {
  const navigate = useNavigate();

  return (
    <TableRow 
      className="cursor-pointer hover:bg-muted/5 group"
      onClick={() => navigate(`/registry/${loop.id}`)}
    >
      <TableCell>
        <div>
          <div className="font-medium text-foreground">{loop.name}</div>
          {loop.notes && (
            <div className="text-sm text-muted-foreground line-clamp-1 mt-1">
              {loop.notes}
            </div>
          )}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-1">
          <Badge className={getLoopTypeColor(loop.loop_type)}>
            {loop.loop_type}
          </Badge>
          <Badge className={getScaleColor(getDisplayLayer(loop))}>
            {getDisplayLayer(loop)}
          </Badge>
        </div>
      </TableCell>
      <TableCell>
        <Badge className={getStatusColor(loop.status)}>
          {loop.status}
        </Badge>
      </TableCell>
      <TableCell>{loop.node_count || 0}</TableCell>
      <TableCell>v{loop.version}</TableCell>
      <TableCell>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Calendar className="w-3 h-3" />
          {formatDistanceToNow(new Date(loop.updated_at), { addSuffix: true })}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/registry/${loop.id}`);
            }}
            className="h-7 w-7 p-0"
          >
            <Eye className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/registry/${loop.id}/edit`);
            }}
            className="h-7 w-7 p-0"
          >
            <Edit className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onExport(loop.id);
            }}
            className="h-7 w-7 p-0"
          >
            <Download className="w-3 h-3" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export const RegistryResults: React.FC<RegistryResultsProps> = ({
  data,
  isLoading,
  viewMode,
  onExport,
  totalCount
}) => {
  if (isLoading) {
    return <LoadingSkeleton viewMode={viewMode} />;
  }

  if (viewMode === 'cards') {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {totalCount} loop{totalCount !== 1 ? 's' : ''} found
          </p>
        </div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={viewMode}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {data.map((loop, index) => (
              <LoopCard
                key={loop.id}
                loop={loop}
                onExport={onExport}
                index={index}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {totalCount} loop{totalCount !== 1 ? 's' : ''} found
        </p>
      </div>

      <Card className="glass-secondary">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type & Scale</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Nodes</TableHead>
              <TableHead>Version</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence mode="wait">
              {data.map((loop) => (
                <LoopTableRow
                  key={loop.id}
                  loop={loop}
                  onExport={onExport}
                />
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};