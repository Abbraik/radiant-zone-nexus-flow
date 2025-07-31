import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, Lightbulb, RefreshCw, Check } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';

interface MacroVision {
  text: string;
  characterCount: number;
  isValid: boolean;
}

interface MacroVisionCaptureProps {
  loopArchetype?: string;
  tensionSignal?: string;
  onVisionChange: (vision: MacroVision) => void;
  initialVision?: string;
}

const visionExamples = {
  'limits-to-growth': [
    "Achieve sustainable population growth within planetary boundaries by 2035",
    "Balance resource consumption with regeneration capacity across all sectors",
    "Create resilient communities that thrive within ecological limits"
  ],
  'fixes-that-fail': [
    "Build fundamental problem-solving capabilities instead of quick fixes",
    "Develop systemic solutions that address root causes, not symptoms",
    "Create sustainable interventions with positive long-term outcomes"
  ],
  'tragedy-of-commons': [
    "Establish collaborative governance for shared resources by 2030",
    "Create incentive structures that align individual and collective good",
    "Build community stewardship of common pool resources"
  ],
  'success-to-successful': [
    "Distribute success benefits equitably across all stakeholders",
    "Create inclusive growth that empowers underperforming sectors",
    "Balance resource allocation to prevent winner-takes-all dynamics"
  ],
  'growth-underinvestment': [
    "Invest in capacity building to support sustainable long-term growth",
    "Align performance standards with adequate infrastructure investment",
    "Create resilient systems that scale capacity with demand"
  ],
  'default': [
    "Create positive systemic change that benefits all stakeholders",
    "Build resilient and adaptive governance for complex challenges",
    "Achieve sustainable outcomes through evidence-based interventions"
  ]
};

const tensionSpecificExamples = {
  'air-quality': [
    "Achieve WHO air quality standards in all major cities by 2030",
    "Reduce air pollution to protect public health and environment",
    "Create clean air through sustainable transportation and industry"
  ],
  'employment-rate': [
    "Provide meaningful employment opportunities for all young people",
    "Create inclusive job markets that support career development",
    "Build skills-based economy with full youth employment by 2028"
  ],
  'housing-affordability': [
    "Ensure affordable housing access for all income levels by 2030",
    "Create sustainable housing markets that serve community needs",
    "Balance housing costs with median incomes across all regions"
  ],
  'citizen-trust': [
    "Rebuild public trust in government through transparency and accountability",
    "Create responsive governance that serves citizen needs effectively",
    "Establish trustworthy institutions through participatory democracy"
  ]
};

export const MacroVisionCapture: React.FC<MacroVisionCaptureProps> = ({
  loopArchetype,
  tensionSignal,
  onVisionChange,
  initialVision = ""
}) => {
  const [vision, setVision] = useState<MacroVision>({
    text: initialVision,
    characterCount: initialVision.length,
    isValid: initialVision.length > 0 && initialVision.length <= 120
  });

  const [showExamples, setShowExamples] = useState(true);
  const [currentExampleSet, setCurrentExampleSet] = useState(0);

  const maxCharacters = 120;
  const minCharacters = 10;

  // Get relevant examples based on context
  const getRelevantExamples = () => {
    if (tensionSignal && tensionSpecificExamples[tensionSignal as keyof typeof tensionSpecificExamples]) {
      return tensionSpecificExamples[tensionSignal as keyof typeof tensionSpecificExamples];
    }
    if (loopArchetype && visionExamples[loopArchetype as keyof typeof visionExamples]) {
      return visionExamples[loopArchetype as keyof typeof visionExamples];
    }
    return visionExamples.default;
  };

  const examples = getRelevantExamples();

  useEffect(() => {
    onVisionChange(vision);
  }, [vision, onVisionChange]);

  const handleVisionChange = (text: string) => {
    const newVision: MacroVision = {
      text,
      characterCount: text.length,
      isValid: text.length >= minCharacters && text.length <= maxCharacters
    };
    setVision(newVision);
  };

  const handleExampleSelect = (example: string) => {
    handleVisionChange(example);
    setShowExamples(false);
  };

  const getCharacterCountColor = () => {
    if (vision.characterCount > maxCharacters) return "text-red-600";
    if (vision.characterCount > maxCharacters * 0.9) return "text-yellow-600";
    if (vision.characterCount < minCharacters) return "text-gray-500";
    return "text-green-600";
  };

  const getGuidanceMessage = () => {
    if (vision.characterCount === 0) {
      return "Start with a clear, actionable goal statement";
    }
    if (vision.characterCount < minCharacters) {
      return "Add more detail to create a meaningful vision";
    }
    if (vision.characterCount > maxCharacters) {
      return "Simplify your vision to fit within the character limit";
    }
    if (!vision.text.toLowerCase().includes("by") && !vision.text.toLowerCase().includes("through")) {
      return "Consider adding a timeframe or method (e.g., 'by 2030' or 'through collaboration')";
    }
    return "Great! Your macro vision is clear and concise";
  };

  const rotateExamples = () => {
    setCurrentExampleSet((prev) => (prev + 1) % examples.length);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Macro Vision Capture</h3>
          {vision.isValid && <Check className="h-4 w-4 text-green-600" />}
        </div>
        <p className="text-sm text-muted-foreground">
          Define the high-level goal this loop supports in 120 characters or less
        </p>
      </div>

      {/* Context Indicators */}
      {(loopArchetype || tensionSignal) && (
        <div className="flex gap-2">
          {loopArchetype && (
            <Badge variant="outline" className="text-xs">
              {loopArchetype} loop
            </Badge>
          )}
          {tensionSignal && (
            <Badge variant="outline" className="text-xs">
              {tensionSignal} signal
            </Badge>
          )}
        </div>
      )}

      {/* Vision Input */}
      <Card className="p-4 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Macro Vision Statement</label>
            <div className={`text-sm font-medium ${getCharacterCountColor()}`}>
              {vision.characterCount}/{maxCharacters}
            </div>
          </div>
          
          <Textarea
            placeholder="What high-level goal does this loop support? (e.g., 'Achieve net-zero emissions by 2030 through sustainable policy frameworks')"
            value={vision.text}
            onChange={(e) => handleVisionChange(e.target.value)}
            className="min-h-[80px] resize-none"
            maxLength={maxCharacters + 10} // Allow slight overage for warning
          />
          
          <div className="flex items-start gap-2">
            <div className={`flex-1 text-xs ${vision.isValid ? 'text-green-600' : 'text-muted-foreground'}`}>
              {getGuidanceMessage()}
            </div>
          </div>
        </div>

        {/* Character Progress Bar */}
        <div className="space-y-1">
          <div className="w-full bg-muted rounded-full h-1">
            <div 
              className={`h-1 rounded-full transition-all duration-300 ${
                vision.characterCount > maxCharacters 
                  ? 'bg-red-500' 
                  : vision.characterCount > maxCharacters * 0.9 
                    ? 'bg-yellow-500' 
                    : 'bg-green-500'
              }`}
              style={{ 
                width: `${Math.min((vision.characterCount / maxCharacters) * 100, 100)}%` 
              }}
            />
          </div>
        </div>
      </Card>

      {/* Examples Section */}
      {showExamples && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <Card className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-amber-500" />
                <h4 className="font-medium text-sm">Vision Examples</h4>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={rotateExamples}
                  className="text-xs"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  More Examples
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowExamples(false)}
                  className="text-xs"
                >
                  Hide
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              {examples.slice(currentExampleSet, currentExampleSet + 3).map((example, index) => (
                <motion.div
                  key={`${currentExampleSet}-${index}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div 
                    className="p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted transition-colors group"
                    onClick={() => handleExampleSelect(example)}
                  >
                    <div className="flex items-start justify-between">
                      <p className="text-sm flex-1">{example}</p>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Badge variant="outline" className="text-xs">
                          {example.length} chars
                        </Badge>
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                          <Target className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="text-xs text-muted-foreground">
              Click any example to use it as your vision statement. You can then edit it to fit your specific context.
            </div>
          </Card>
        </motion.div>
      )}

      {/* Vision Quality Indicators */}
      {vision.text.length > 0 && (
        <Card className="p-4">
          <h4 className="font-medium text-sm mb-3">Vision Quality Check</h4>
          <div className="space-y-2">
            {[
              { 
                check: vision.characterCount >= minCharacters && vision.characterCount <= maxCharacters,
                label: "Appropriate length"
              },
              { 
                check: vision.text.toLowerCase().includes("by") || vision.text.toLowerCase().includes("through") || vision.text.toLowerCase().includes("via"),
                label: "Includes method or timeframe"
              },
              { 
                check: /\d{4}/.test(vision.text),
                label: "Contains target year" 
              },
              { 
                check: vision.text.split(" ").length <= 20,
                label: "Concise phrasing"
              }
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${item.check ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span className={`text-xs ${item.check ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Hidden Examples Toggle */}
      {!showExamples && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowExamples(true)}
          className="w-full"
        >
          <Lightbulb className="h-3 w-3 mr-2" />
          Show Vision Examples
        </Button>
      )}
    </div>
  );
};