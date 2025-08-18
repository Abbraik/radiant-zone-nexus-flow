import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, TrendingDown, Minus, ExternalLink, BarChart3 } from 'lucide-react';
import { useMetaAlignment } from '@/hooks/useMetaAlignment';
import { format } from 'date-fns';

interface MetaLoopCompassProps {
  className?: string;
}

interface CompassVertex {
  id: 'population' | 'domains' | 'institutions';
  label: string;
  score: number;
  x: number;
  y: number;
}

export const MetaLoopCompass: React.FC<MetaLoopCompassProps> = ({ className }) => {
  const { data, isLoading, error } = useMetaAlignment();
  const [selectedVertex, setSelectedVertex] = useState<CompassVertex | null>(null);

  if (error) {
    return (
      <Card className={`bg-white/5 backdrop-blur-xl border border-white/20 p-6 ${className}`}>
        <div className="text-destructive text-sm">Failed to load alignment data</div>
      </Card>
    );
  }

  const vertices: CompassVertex[] = [
    { id: 'population', label: 'Population', score: data?.population_score || 0, x: 150, y: 40 },
    { id: 'domains', label: 'Domains', score: data?.domains_balance_score || 0, x: 80, y: 160 },
    { id: 'institutions', label: 'Institutions', score: data?.institutions_adaptivity_score || 0, x: 220, y: 160 }
  ];

  const centerX = 150;
  const centerY = 120;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getEdgeOpacity = (score1: number, score2: number) => {
    const avgScore = (score1 + score2) / 2;
    return Math.max(0.2, avgScore / 100);
  };

  return (
    <Card className={`bg-white/5 backdrop-blur-xl border border-white/20 p-6 h-full ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white drop-shadow-sm">Meta-Loop Compass</h3>
        <BarChart3 className="w-5 h-5 text-teal-300 drop-shadow-sm" />
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="w-full h-64 rounded-xl" />
          <div className="grid grid-cols-3 gap-4">
            <Skeleton className="h-16 rounded-xl" />
            <Skeleton className="h-16 rounded-xl" />
            <Skeleton className="h-16 rounded-xl" />
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* SVG Compass */}
          <div className="relative">
            <svg width="300" height="200" className="mx-auto">
              {/* Triangle edges */}
              {vertices.map((vertex1, i) => {
                const vertex2 = vertices[(i + 1) % vertices.length];
                const opacity = getEdgeOpacity(vertex1.score, vertex2.score);
                const strokeColor = opacity > 0.6 ? '#10B981' : opacity > 0.4 ? '#F59E0B' : '#EF4444';
                
                return (
                  <line
                    key={`edge-${i}`}
                    x1={vertex1.x}
                    y1={vertex1.y}
                    x2={vertex2.x}
                    y2={vertex2.y}
                    stroke={strokeColor}
                    strokeWidth={Math.max(1, opacity * 4)}
                    strokeOpacity={opacity}
                    className="drop-shadow-sm"
                  />
                );
              })}

              {/* Center alignment circle */}
              <circle
                cx={centerX}
                cy={centerY}
                r="30"
                fill="rgba(20, 184, 166, 0.2)"
                stroke="#14B8A6"
                strokeWidth="2"
                className="drop-shadow-lg"
              />

              {/* Vertices */}
              {vertices.map((vertex) => (
                <g key={vertex.id}>
                  <circle
                    cx={vertex.x}
                    cy={vertex.y}
                    r="20"
                    fill="rgba(255, 255, 255, 0.1)"
                    stroke="#14B8A6"
                    strokeWidth="2"
                    className="cursor-pointer hover:fill-white/20 transition-all duration-200 drop-shadow-lg"
                    onClick={() => setSelectedVertex(vertex)}
                  />
                  <text
                    x={vertex.x}
                    y={vertex.y - 30}
                    textAnchor="middle"
                    fill="white"
                    fontSize="12"
                    fontWeight="600"
                    className="drop-shadow-sm"
                  >
                    {vertex.label}
                  </text>
                  <text
                    x={vertex.x}
                    y={vertex.y + 5}
                    textAnchor="middle"
                    fill={vertex.score >= 70 ? '#10B981' : vertex.score >= 50 ? '#F59E0B' : '#EF4444'}
                    fontSize="14"
                    fontWeight="700"
                    className="drop-shadow-sm"
                  >
                    {vertex.score}
                  </text>
                </g>
              ))}

              {/* Center KPI */}
              <text
                x={centerX}
                y={centerY - 5}
                textAnchor="middle"
                fill="white"
                fontSize="10"
                fontWeight="500"
                className="drop-shadow-sm"
              >
                Overall
              </text>
              <text
                x={centerX}
                y={centerY + 8}
                textAnchor="middle"
                fill="#14B8A6"
                fontSize="16"
                fontWeight="700"
                className="drop-shadow-sm"
              >
                {data?.overall_alignment || 0}
              </text>
            </svg>

            {/* Vertex Details Panel */}
            {selectedVertex && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute top-0 right-0 bg-black/80 backdrop-blur-xl border border-white/20 rounded-xl p-4 w-64"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-white font-semibold">{selectedVertex.label}</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedVertex(null)}
                    className="text-white hover:bg-white/10"
                  >
                    ✕
                  </Button>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Score</span>
                    <span className={`font-semibold ${getScoreColor(selectedVertex.score)}`}>
                      {selectedVertex.score}/100
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Trend</span>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400 text-sm">+2.3%</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-3 text-teal-300 border-teal-400/30 hover:bg-teal-400/10"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Score Summary */}
          <div className="grid grid-cols-3 gap-4">
            {vertices.map((vertex) => (
              <div
                key={vertex.id}
                className="text-center p-3 rounded-xl bg-white/10 hover:bg-white/15 transition-all duration-200 border border-white/20 backdrop-blur-sm cursor-pointer"
                onClick={() => setSelectedVertex(vertex)}
              >
                <div className={`text-lg font-bold ${getScoreColor(vertex.score)}`}>
                  {vertex.score}
                </div>
                <div className="text-sm text-gray-200 font-medium">{vertex.label}</div>
              </div>
            ))}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-white/20">
            <div className="text-xs text-gray-400">
              Updated {data?.updated_at ? format(new Date(data.updated_at), 'MMM d, HH:mm') : 'Loading...'}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-teal-300 border-teal-400/30 hover:bg-teal-400/10"
              >
                Open Meta Review
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-teal-300 border-teal-400/30 hover:bg-teal-400/10"
              >
                View Drivers
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};