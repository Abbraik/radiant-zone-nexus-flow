import React from 'react';
import { motion } from 'framer-motion';
import { Target, ArrowRight, TrendingUp, Calendar, Gauge, MapPin } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';

interface ActTaskPopupProps {
  onComplete: () => void;
}

export const ActTaskPopup: React.FC<ActTaskPopupProps> = ({ onComplete }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="p-8 bg-gradient-to-br from-teal-500/10 to-blue-600/10 border-teal-500/30 shadow-2xl">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <div className="p-3 bg-teal-500/20 rounded-full">
              <Target className="h-8 w-8 text-teal-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Strategic Context Review</h2>
              <p className="text-gray-300">Review Think Zone outputs before building your intervention bundle</p>
            </div>
          </div>
          
          {/* Context Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Think Zone Outputs */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-teal-300 flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                From Think Zone
              </h3>
              
              <div className="space-y-3">
                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium text-gray-300">Tension Signal</span>
                    <Badge variant="outline" className="text-xs">Active</Badge>
                  </div>
                  <div className="text-white font-semibold">Population Growth Rate</div>
                  <div className="text-sm text-gray-400 mt-1">Current breach: 2.8% (target: 2.1%)</div>
                </div>

                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium text-gray-300">DE-Band Configuration</span>
                    <Badge variant="outline" className="text-xs bg-orange-500/20 text-orange-300">Breach</Badge>
                  </div>
                  <div className="text-white font-semibold">65-85% Optimal Range</div>
                  <div className="text-sm text-gray-400 mt-1">Current: 58% (below threshold)</div>
                  <div className="mt-2">
                    <Progress value={58} className="h-2" />
                  </div>
                </div>

                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium text-gray-300">SRT Horizon</span>
                    <Badge variant="outline" className="text-xs">18 months</Badge>
                  </div>
                  <div className="text-white font-semibold">Strategic Response Time</div>
                  <div className="text-sm text-gray-400 mt-1">Recommended intervention duration</div>
                </div>

                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium text-gray-300">Leverage Point</span>
                    <Badge variant="outline" className="text-xs bg-purple-500/20 text-purple-300">High Impact</Badge>
                  </div>
                  <div className="text-white font-semibold">Education & Healthcare Systems</div>
                  <div className="text-sm text-gray-400 mt-1">Focus on structural interventions</div>
                </div>
              </div>
            </div>

            {/* Right Column - Goals & Progress */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-blue-300 flex items-center gap-2">
                <Gauge className="h-5 w-5" />
                Goal Progress & Constraints
              </h3>
              
              <div className="space-y-4">
                {/* Primary Goal */}
                <div className="p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/30">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-sm font-medium text-blue-300">Primary Goal</span>
                    <span className="text-lg font-bold text-white">68%</span>
                  </div>
                  <div className="text-white font-semibold mb-2">Balance Population & Development</div>
                  <Progress value={68} className="h-3 mb-2" />
                  <div className="text-sm text-gray-400">Target: Sustainable demographic transition by 2026</div>
                </div>

                {/* Resource Constraints */}
                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <h4 className="text-white font-medium mb-3">Resource Constraints</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">Available Budget</span>
                      <span className="text-sm text-green-400">$2.4M allocated</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">Team Capacity</span>
                      <span className="text-sm text-yellow-400">75% utilized</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">Timeline Buffer</span>
                      <span className="text-sm text-blue-400">3 months</span>
                    </div>
                  </div>
                </div>

                {/* AI Suggestions */}
                <div className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/30">
                  <h4 className="text-purple-300 font-medium mb-2 flex items-center gap-2">
                    🤖 AI Recommendations
                  </h4>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Prioritize education access initiatives</li>
                    <li>• Combine family planning with economic programs</li>
                    <li>• Phase healthcare infrastructure improvements</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline Context */}
          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <Calendar className="h-5 w-5 text-orange-400" />
              <h4 className="text-white font-medium">Timeline Context</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Think Sprint Completed:</span>
                <div className="text-white font-medium">3 days ago</div>
              </div>
              <div>
                <span className="text-gray-400">Recommended Start:</span>
                <div className="text-white font-medium">Within 1 week</div>
              </div>
              <div>
                <span className="text-gray-400">Monitor Handoff:</span>
                <div className="text-white font-medium">After bundle publish</div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-center pt-4">
            <Button 
              onClick={onComplete} 
              size="lg"
              className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white px-8 py-3 text-lg font-semibold"
            >
              Start Bundle Assembly
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default ActTaskPopup;