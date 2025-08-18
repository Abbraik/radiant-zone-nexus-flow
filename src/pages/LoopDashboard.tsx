import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Activity, RefreshCw, Play } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoopScorecard } from '@/components/scorecards/LoopScorecard';
import { useScorecard } from '@/hooks/useScorecard';

const LoopDashboard: React.FC = () => {
  const { getAllScorecards, runHeartbeat } = useScorecard();
  const { data: scorecards, isLoading, refetch } = getAllScorecards;
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    scale: '',
  });

  const filteredScorecards = (scorecards || []).filter(scorecard => {
    const matchesSearch = scorecard.loop_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filters.status || (
      filters.status === 'breached' ? scorecard.breach_count > 0 :
      filters.status === 'fatigued' ? scorecard.fatigue_score >= 3 :
      filters.status === 'in-band' ? scorecard.breach_count === 0 && scorecard.fatigue_score < 3 :
      true
    );
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: scorecards?.length || 0,
    breached: scorecards?.filter(s => s.breach_count > 0).length || 0,
    fatigued: scorecards?.filter(s => s.fatigue_score >= 3).length || 0,
    healthy: scorecards?.filter(s => s.breach_count === 0 && s.fatigue_score < 3).length || 0,
  };

  const handleRunHeartbeat = () => {
    runHeartbeat.mutate();
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
            <h1 className="text-3xl font-bold text-foreground">Loop Dashboard</h1>
            <p className="text-muted-foreground">
              Monitor equilibrium scorecards and system health across all loops
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => refetch()}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button 
              onClick={handleRunHeartbeat}
              disabled={runHeartbeat.isPending}
              className="flex items-center gap-2"
            >
              <Play className="h-4 w-4" />
              {runHeartbeat.isPending ? 'Running...' : 'Run Heartbeat'}
            </Button>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Loops</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <Activity className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Breached</p>
                  <p className="text-2xl font-bold text-red-600">{stats.breached}</p>
                </div>
                <Badge variant="destructive" className="h-8 w-8 rounded-full p-0 flex items-center justify-center">
                  !
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Fatigued</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.fatigued}</p>
                </div>
                <Badge variant="secondary" className="h-8 w-8 rounded-full p-0 flex items-center justify-center">
                  ~
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Healthy</p>
                  <p className="text-2xl font-bold text-green-600">{stats.healthy}</p>
                </div>
                <Badge variant="default" className="h-8 w-8 rounded-full p-0 flex items-center justify-center">
                  ✓
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
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
            <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Status</SelectItem>
                <SelectItem value="in-band">In-Band</SelectItem>
                <SelectItem value="breached">Breached</SelectItem>
                <SelectItem value="fatigued">Fatigued</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Scorecards Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredScorecards.map((scorecard, index) => (
            <motion.div
              key={scorecard.loop_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <LoopScorecard scorecard={scorecard} />
            </motion.div>
          ))}
        </motion.div>

        {filteredScorecards.length === 0 && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center py-12"
          >
            <div className="text-muted-foreground">
              {searchTerm || filters.status ? 
                'No loops match your search criteria.' : 
                'No loop scorecards found. Create some loops to get started.'
              }
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default LoopDashboard;