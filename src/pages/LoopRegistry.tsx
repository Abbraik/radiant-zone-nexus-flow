import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, Plus, Eye, Edit, GitBranch, Share2, Tag } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLoopRegistry } from '@/hooks/useLoopRegistry';
import { LoopData } from '@/types/loop-registry';

const LoopRegistry: React.FC = () => {
  const navigate = useNavigate();
  const { searchLoops, createLoop, publishLoop } = useLoopRegistry();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    loop_type: '',
    scale: '',
    status: '',
  });

  const loops = searchLoops.data || [];

  const filteredLoops = loops.filter(loop => {
    const matchesSearch = loop.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filters.loop_type || loop.loop_type === filters.loop_type;
    const matchesScale = !filters.scale || loop.scale === filters.scale;
    const matchesStatus = !filters.status || loop.status === filters.status;
    
    return matchesSearch && matchesType && matchesScale && matchesStatus;
  });

  const handleCreateNew = () => {
    createLoop.mutate({
      name: 'New Loop',
      loop_type: 'reactive',
      scale: 'micro',
    }, {
      onSuccess: (data) => {
        navigate(`/registry/${data.id}`);
      }
    });
  };

  const getLoopTypeColor = (type: string) => {
    switch (type) {
      case 'reactive': return 'bg-blue-100 text-blue-800';
      case 'structural': return 'bg-green-100 text-green-800';
      case 'perceptual': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getScaleColor = (scale: string) => {
    switch (scale) {
      case 'micro': return 'bg-orange-100 text-orange-800';
      case 'meso': return 'bg-yellow-100 text-yellow-800';
      case 'macro': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-foreground">Loop Registry</h1>
            <p className="text-muted-foreground">
              Discover, manage, and share system dynamics loops
            </p>
          </div>
          <Button onClick={handleCreateNew} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create New Loop
          </Button>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search loops..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={filters.loop_type} onValueChange={(value) => setFilters(prev => ({ ...prev, loop_type: value }))}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="reactive">Reactive</SelectItem>
                <SelectItem value="structural">Structural</SelectItem>
                <SelectItem value="perceptual">Perceptual</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.scale} onValueChange={(value) => setFilters(prev => ({ ...prev, scale: value }))}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Scale" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Scales</SelectItem>
                <SelectItem value="micro">Micro</SelectItem>
                <SelectItem value="meso">Meso</SelectItem>
                <SelectItem value="macro">Macro</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Loop Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredLoops.map((loop, index) => (
            <motion.div
              key={loop.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
                      {loop.name}
                    </CardTitle>
                    <div className="flex gap-1">
                      <Badge className={getLoopTypeColor(loop.loop_type)}>
                        {loop.loop_type}
                      </Badge>
                      <Badge className={getScaleColor(loop.scale)}>
                        {loop.scale}
                      </Badge>
                    </div>
                  </div>
                  
                  {loop.notes && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {loop.notes}
                    </p>
                  )}
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                    <div className="flex items-center gap-2">
                      <GitBranch className="h-3 w-3" />
                      v{loop.version}
                    </div>
                    <div className="flex items-center gap-2">
                      <Tag className="h-3 w-3" />
                      {loop.node_count || 0} nodes
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge variant={loop.status === 'published' ? 'default' : 'secondary'}>
                      {loop.status}
                    </Badge>
                    
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => navigate(`/registry/${loop.id}`)}
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => navigate(`/registry/${loop.id}?tab=edit`)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      {loop.status === 'draft' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => publishLoop.mutate(loop.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Share2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {filteredLoops.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center py-12"
          >
            <div className="text-muted-foreground">
              {searchTerm || Object.values(filters).some(v => v) ? 
                'No loops match your search criteria.' : 
                'No loops found. Create your first loop to get started.'
              }
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default LoopRegistry;