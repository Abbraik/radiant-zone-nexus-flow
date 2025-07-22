import { useState } from 'react';

export interface QueryResult {
  id: string;
  query: string;
  data: any;
  chart?: 'line' | 'bar' | 'pie' | 'table';
  executionTime: number;
  timestamp: Date;
}

export const useAnalytics = () => {
  const [recentQueries, setRecentQueries] = useState<QueryResult[]>([
    {
      id: '1',
      query: 'Show task completion rates last 7 days',
      data: { rate: '87%', trend: '+5%' },
      chart: 'line',
      executionTime: 234,
      timestamp: new Date()
    }
  ]);
  
  const [isLoading, setIsLoading] = useState(false);

  const executeQuery = async (query: string): Promise<QueryResult> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const result: QueryResult = {
      id: Date.now().toString(),
      query,
      data: generateMockData(query),
      chart: determineChartType(query),
      executionTime: Math.floor(Math.random() * 500) + 100,
      timestamp: new Date()
    };
    
    setRecentQueries(prev => [result, ...prev.slice(0, 9)]);
    setIsLoading(false);
    
    return result;
  };

  return {
    recentQueries,
    executeQuery,
    isLoading
  };
};

const generateMockData = (query: string) => {
  const q = query.toLowerCase();
  
  if (q.includes('completion') || q.includes('rate')) {
    return {
      rate: `${Math.floor(Math.random() * 20) + 80}%`,
      trend: `${Math.random() > 0.5 ? '+' : '-'}${Math.floor(Math.random() * 10)}%`,
      breakdown: {
        think: '92%',
        act: '85%',
        monitor: '78%',
        innovate: '88%'
      }
    };
  }
  
  if (q.includes('time') || q.includes('cycle')) {
    return {
      average: `${(Math.random() * 3 + 1).toFixed(1)}h`,
      median: `${(Math.random() * 2 + 1).toFixed(1)}h`,
      trend: `${Math.random() > 0.5 ? '+' : '-'}${Math.floor(Math.random() * 15)}%`
    };
  }
  
  if (q.includes('tension') || q.includes('escalation')) {
    return {
      total: Math.floor(Math.random() * 50) + 20,
      resolved: Math.floor(Math.random() * 40) + 15,
      pending: Math.floor(Math.random() * 10) + 5,
      critical: Math.floor(Math.random() * 5) + 1
    };
  }
  
  return {
    value: Math.floor(Math.random() * 100),
    trend: `${Math.random() > 0.5 ? '+' : '-'}${Math.floor(Math.random() * 20)}%`
  };
};

const determineChartType = (query: string): 'line' | 'bar' | 'pie' | 'table' => {
  const q = query.toLowerCase();
  
  if (q.includes('time') || q.includes('trend') || q.includes('over')) return 'line';
  if (q.includes('compare') || q.includes('by zone') || q.includes('breakdown')) return 'bar';
  if (q.includes('distribution') || q.includes('percentage')) return 'pie';
  
  return 'table';
};