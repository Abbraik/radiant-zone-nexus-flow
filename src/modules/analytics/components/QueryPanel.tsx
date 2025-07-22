import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Search, TrendingUp, Calendar, Filter } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { Badge } from '../../../components/ui/badge';
import { useAnalytics } from '../hooks/useAnalytics';

export const QueryPanel: React.FC = () => {
  const [query, setQuery] = useState('');
  const { executeQuery, recentQueries, isLoading } = useAnalytics();

  const suggestedQueries = [
    "Show TRI completion rates this month",
    "Average task cycle time by zone",
    "Bundle publish success rate",
    "Tension escalation patterns",
    "Top performing loops last quarter"
  ];

  const handleQuery = async () => {
    if (query.trim()) {
      await executeQuery(query);
    }
  };

  return (
    <Card className="p-4 bg-glass/70 backdrop-blur-20 border-white/10">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="h-5 w-5 text-blue-400" />
        <h3 className="text-lg font-semibold text-white">Analytics Query</h3>
      </div>

      {/* Query Input */}
      <div className="flex gap-2 mb-4">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask about your data... e.g., 'Show completion rates this week'"
          className="flex-1 bg-white/10 border-white/20 text-white placeholder-gray-400"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleQuery();
            }
          }}
        />
        <Button
          onClick={handleQuery}
          disabled={!query.trim() || isLoading}
          className="bg-blue-500 hover:bg-blue-600"
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>

      {/* Suggested Queries */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-300 mb-2">Suggested Queries</h4>
        <div className="space-y-2">
          {suggestedQueries.map((suggestion, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setQuery(suggestion)}
              className="w-full text-left p-2 text-xs text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors"
            >
              {suggestion}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Recent Queries */}
      {recentQueries.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-2">Recent Queries</h4>
          <div className="space-y-1">
            {recentQueries.slice(0, 3).map((recent, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-white/5 rounded-lg"
              >
                <span className="text-xs text-gray-300 truncate">
                  {recent.query}
                </span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs border-green-500/50 text-green-300">
                    {recent.executionTime}ms
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuery(recent.query)}
                    className="h-6 w-6 p-0"
                  >
                    <Search className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};