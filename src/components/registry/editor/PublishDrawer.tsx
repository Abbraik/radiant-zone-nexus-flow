import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle, XCircle, AlertTriangle, Upload, X } from 'lucide-react';

interface PublishDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  loopId?: string;
  onPublish: () => void;
}

// Mock lint results
const mockLintResults = [
  {
    id: '1',
    level: 'error',
    category: 'structure',
    message: 'Loop contains isolated nodes',
    details: 'Nodes "Feedback Node" and "Output Node" are not connected to the main graph',
    fixHint: 'Connect isolated nodes or remove them from the loop'
  },
  {
    id: '2',
    level: 'warning',
    category: 'indicators',
    message: 'Missing DE-Band configuration',
    details: 'Indicator "Customer Satisfaction" does not have DE-Band bounds configured',
    fixHint: 'Configure upper and lower bounds for the indicator'
  },
  {
    id: '3',
    level: 'info',
    category: 'metadata',
    message: 'Consider adding more tags',
    details: 'Loop has only 2 tags, consider adding more for better discoverability',
    fixHint: 'Add 3-5 descriptive tags related to the loop domain and purpose'
  },
  {
    id: '4',
    level: 'pass',
    category: 'metadata',
    message: 'All required metadata fields completed',
    details: 'Name, synopsis, type, motif, and layer are all properly set',
    fixHint: null
  }
];

export const PublishDrawer: React.FC<PublishDrawerProps> = ({
  isOpen,
  onClose,
  loopId,
  onPublish
}) => {
  const [rationale, setRationale] = useState('');
  const [isRunningLint, setIsRunningLint] = useState(false);
  const [lintResults, setLintResults] = useState(mockLintResults);

  const errorCount = lintResults.filter(r => r.level === 'error').length;
  const warningCount = lintResults.filter(r => r.level === 'warning').length;
  const passCount = lintResults.filter(r => r.level === 'pass').length;

  const canPublish = errorCount === 0 && rationale.length >= 120;

  const handleRunLint = async () => {
    setIsRunningLint(true);
    // Simulate lint check
    setTimeout(() => {
      setIsRunningLint(false);
    }, 2000);
  };

  const handlePublish = () => {
    if (canPublish) {
      onPublish();
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'pass':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-blue-500" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'pass':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[600px] sm:max-w-[600px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Publish Loop
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-100px)] mt-6">
          <div className="space-y-6">
            {/* Lint Results Summary */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Pre-publish Validation</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRunLint}
                    disabled={isRunningLint}
                  >
                    {isRunningLint ? 'Running...' : 'Run Lint'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm">{errorCount} Errors</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm">{warningCount} Warnings</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm">{passCount} Passed</span>
                  </div>
                </div>

                {errorCount > 0 && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-red-500" />
                      <span className="text-sm font-medium text-red-800">
                        Cannot publish with {errorCount} error(s)
                      </span>
                    </div>
                    <p className="text-xs text-red-600 mt-1">
                      Fix all errors before publishing
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Detailed Lint Results */}
            <Card>
              <CardHeader>
                <CardTitle>Validation Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <AnimatePresence>
                    {lintResults.map((result) => (
                      <motion.div
                        key={result.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`p-4 border rounded-lg ${getLevelColor(result.level)}`}
                      >
                        <div className="flex items-start gap-3">
                          {getLevelIcon(result.level)}
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{result.message}</span>
                              <Badge variant="outline" className="text-xs">
                                {result.category}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {result.details}
                            </p>
                            {result.fixHint && (
                              <p className="text-xs text-blue-600 mt-2">
                                💡 {result.fixHint}
                              </p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>

            {/* Publish Rationale */}
            <Card>
              <CardHeader>
                <CardTitle>Publication Rationale</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="rationale">
                      Describe the changes and rationale for this publication *
                    </Label>
                    <Textarea
                      id="rationale"
                      placeholder="Explain what changed in this version, why it's ready for publication, and how it improves upon the previous version..."
                      value={rationale}
                      onChange={(e) => setRationale(e.target.value)}
                      className="mt-1"
                      rows={4}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Minimum 120 characters required</span>
                      <span>{rationale.length}/500</span>
                    </div>
                  </div>

                  {rationale.length >= 120 && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-green-800">
                          Rationale meets minimum requirements
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Publication Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Publish Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">
                      What happens when you publish?
                    </h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Creates a new version snapshot</li>
                      <li>• Makes the loop visible in the public registry</li>
                      <li>• Increments the version number</li>
                      <li>• Sets status to "published"</li>
                      <li>• Enables sharing and referencing by other loops</li>
                    </ul>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={onClose}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handlePublish}
                      disabled={!canPublish}
                      className="flex-1"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Publish Loop
                    </Button>
                  </div>

                  {!canPublish && (
                    <p className="text-xs text-muted-foreground text-center">
                      {errorCount > 0 
                        ? 'Fix validation errors to enable publishing'
                        : 'Complete the rationale (120+ characters) to enable publishing'
                      }
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};