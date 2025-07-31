import { useState, useEffect, useMemo } from 'react';
import { SubLever, LeveragePoint, PerformanceMetric } from '../types/analytics';

// Mock data for sub-lever metrics
const mockSubLevers: SubLever[] = [
  {
    id: 'sub-lever-1',
    name: 'Tax Credit Optimization',
    category: 'fiscal',
    description: 'Optimize tax credit allocation for renewable energy adoption',
    targetImpact: 85,
    currentImpact: 78,
    projectedImpact: 82,
    confidenceLevel: 92,
    lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
  {
    id: 'sub-lever-2',
    name: 'Regulatory Framework Update',
    category: 'regulatory',
    description: 'Streamline environmental compliance processes',
    targetImpact: 70,
    currentImpact: 58,
    projectedImpact: 65,
    confidenceLevel: 78,
    lastUpdated: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
  },
  {
    id: 'sub-lever-3',
    name: 'Digital Infrastructure',
    category: 'technological',
    description: 'Enhance digital service delivery capabilities',
    targetImpact: 90,
    currentImpact: 88,
    projectedImpact: 89,
    confidenceLevel: 95,
    lastUpdated: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
  },
];

const mockLeveragePoints: LeveragePoint[] = [
  {
    id: 'leverage-1',
    name: 'Economic & Fiscal Policy',
    rank: 3,
    category: 'Policy',
    subLevers: [mockSubLevers[0]],
    effectivenessScore: 82,
    implementationComplexity: 65,
  },
  {
    id: 'leverage-2',
    name: 'Regulatory Systems',
    rank: 4,
    category: 'Governance',
    subLevers: [mockSubLevers[1]],
    effectivenessScore: 68,
    implementationComplexity: 78,
  },
  {
    id: 'leverage-3',
    name: 'Information & Technology',
    rank: 5,
    category: 'Infrastructure',
    subLevers: [mockSubLevers[2]],
    effectivenessScore: 91,
    implementationComplexity: 45,
  },
];

const mockPerformanceMetrics: PerformanceMetric[] = [
  {
    id: 'metric-1',
    subLeverId: 'sub-lever-1',
    metricName: 'Adoption Rate',
    value: 78,
    target: 85,
    unit: '%',
    timestamp: new Date(),
    trend: 'improving',
    benchmarkComparison: {
      internal: 78,
      industry: 72,
      bestPractice: 88,
    },
  },
  {
    id: 'metric-2',
    subLeverId: 'sub-lever-1',
    metricName: 'Processing Time',
    value: 12,
    target: 10,
    unit: 'days',
    timestamp: new Date(),
    trend: 'declining',
    benchmarkComparison: {
      internal: 12,
      industry: 15,
      bestPractice: 8,
    },
  },
  {
    id: 'metric-3',
    subLeverId: 'sub-lever-2',
    metricName: 'Compliance Rate',
    value: 58,
    target: 70,
    unit: '%',
    timestamp: new Date(),
    trend: 'stable',
    benchmarkComparison: {
      internal: 58,
      industry: 62,
      bestPractice: 85,
    },
  },
  {
    id: 'metric-4',
    subLeverId: 'sub-lever-3',
    metricName: 'Digital Service Uptake',
    value: 88,
    target: 90,
    unit: '%',
    timestamp: new Date(),
    trend: 'improving',
    benchmarkComparison: {
      internal: 88,
      industry: 75,
      bestPractice: 92,
    },
  },
];

interface UseSubLeverMetricsResult {
  subLevers: SubLever[];
  leveragePoints: LeveragePoint[];
  performanceMetrics: PerformanceMetric[];
  selectedSubLever: SubLever | null;
  isLoading: boolean;
  error: string | null;
  refreshData: () => void;
  selectSubLever: (subLever: SubLever) => void;
  getMetricsForSubLever: (subLeverId: string) => PerformanceMetric[];
  calculatePerformanceGap: (subLever: SubLever) => number;
  getImpactTrend: (subLever: SubLever) => 'improving' | 'declining' | 'stable';
}

export const useSubLeverMetrics = (interventionId?: string): UseSubLeverMetricsResult => {
  const [selectedSubLever, setSelectedSubLever] = useState<SubLever | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState(Date.now());

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLastRefresh(Date.now());
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const subLevers = useMemo(() => {
    // In a real implementation, filter by interventionId
    return mockSubLevers.map(lever => ({
      ...lever,
      // Simulate slight variations in real-time data
      currentImpact: lever.currentImpact + (Math.random() - 0.5) * 2,
      lastUpdated: new Date(lastRefresh - Math.random() * 60 * 60 * 1000),
    }));
  }, [lastRefresh]);

  const leveragePoints = useMemo(() => {
    return mockLeveragePoints;
  }, []);

  const performanceMetrics = useMemo(() => {
    return mockPerformanceMetrics.map(metric => ({
      ...metric,
      value: metric.value + (Math.random() - 0.5) * (metric.value * 0.1),
      timestamp: new Date(lastRefresh - Math.random() * 30 * 60 * 1000),
    }));
  }, [lastRefresh]);

  const refreshData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setLastRefresh(Date.now());
    } catch (err) {
      setError('Failed to refresh data');
    } finally {
      setIsLoading(false);
    }
  };

  const selectSubLever = (subLever: SubLever) => {
    setSelectedSubLever(subLever);
  };

  const getMetricsForSubLever = (subLeverId: string): PerformanceMetric[] => {
    return performanceMetrics.filter(metric => metric.subLeverId === subLeverId);
  };

  const calculatePerformanceGap = (subLever: SubLever): number => {
    return subLever.targetImpact - subLever.currentImpact;
  };

  const getImpactTrend = (subLever: SubLever): 'improving' | 'declining' | 'stable' => {
    const gap = calculatePerformanceGap(subLever);
    const projectedGap = subLever.targetImpact - subLever.projectedImpact;
    
    if (projectedGap < gap) return 'improving';
    if (projectedGap > gap) return 'declining';
    return 'stable';
  };

  return {
    subLevers,
    leveragePoints,
    performanceMetrics,
    selectedSubLever,
    isLoading,
    error,
    refreshData,
    selectSubLever,
    getMetricsForSubLever,
    calculatePerformanceGap,
    getImpactTrend,
  };
};