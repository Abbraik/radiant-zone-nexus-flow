import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { BookOpen, Settings, Zap } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { LangMode } from './types.ui.lang';
import { getReflexiveLearningContent } from './learningHub.content';

interface ReflexiveHeaderLanguageProps {
  mode: LangMode;
  onModeChange: (mode: LangMode) => void;
}

export const ReflexiveHeaderLanguage: React.FC<ReflexiveHeaderLanguageProps> = ({ mode, onModeChange }) => {
  const [showLearningHub, setShowLearningHub] = useState(false);
  const learningContent = getReflexiveLearningContent(mode);

  return (
    <div className="flex items-center gap-3">
      {/* Language Toggle */}
      <div className="flex items-center bg-card border rounded-lg p-1">
        <Button
          variant={mode === 'general' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onModeChange('general')}
          className="text-xs px-3 py-1 h-auto"
        >
          General
        </Button>
        <Button
          variant={mode === 'expert' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onModeChange('expert')}
          className="text-xs px-3 py-1 h-auto"
        >
          Expert
        </Button>
      </div>

      {/* Learning Hub */}
      <Dialog open={showLearningHub} onOpenChange={setShowLearningHub}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Learn
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              {learningContent.title}
            </DialogTitle>
          </DialogHeader>
          
          <ScrollArea className="h-[60vh] pr-4">
            <div className="space-y-6">
              {learningContent.sections.map((section, index) => (
                <Card key={index}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none">
                      {section.content.split('\n\n').map((paragraph, pIndex) => (
                        <div key={pIndex} className="mb-4">
                          {paragraph.split('\n').map((line, lIndex) => (
                            <div key={lIndex}>
                              {line.startsWith('**') && line.endsWith('**') ? (
                                <h4 className="font-semibold text-sm mb-2 mt-4">
                                  {line.replace(/\*\*/g, '')}
                                </h4>
                              ) : line.startsWith('• ') ? (
                                <div className="ml-4 text-sm text-muted-foreground mb-1">
                                  {line.replace('• ', '• ')}
                                </div>
                              ) : line.match(/^\d+\./) ? (
                                <div className="ml-4 text-sm text-muted-foreground mb-1">
                                  {line}
                                </div>
                              ) : (
                                <p className="text-sm leading-relaxed">{line}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
      
      {/* Mode indicator */}
      <Badge variant="secondary" className="text-xs">
        {mode === 'general' ? 'Auto-Adjust' : 'Reflexive'}
      </Badge>
    </div>
  );
};