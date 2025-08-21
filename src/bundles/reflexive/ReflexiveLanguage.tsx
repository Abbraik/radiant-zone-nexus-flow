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
import { reflexiveLearning } from './learningHub.content';

interface ReflexiveHeaderLanguageProps {
  mode: LangMode;
  onModeChange: (mode: LangMode) => void;
}

export const ReflexiveHeaderLanguage: React.FC<ReflexiveHeaderLanguageProps> = ({ mode, onModeChange }) => {
  const [showLearningHub, setShowLearningHub] = useState(false);
  const learningContent = reflexiveLearning;

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
                       {section.heading}
                     </CardTitle>
                   </CardHeader>
                   <CardContent>
                     <div className="space-y-3">
                       {"body" in section && section.body ? (
                         <p className="text-sm text-muted-foreground">{section.body}</p>
                       ) : null}
                       {"list" in section && Array.isArray((section as any).list) ? (
                         <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                           {(section as any).list.map((li: string, i: number) => <li key={i}>{li}</li>)}
                         </ul>
                       ) : null}
                       {"bullets" in section && Array.isArray((section as any).bullets) ? (
                         <div className="space-y-2">
                           {(section as any).bullets.map(([label, desc]: [string, string], i: number) => (
                             <div key={i} className="text-sm">
                               <span className="font-medium">{label}</span>
                               <span className="text-muted-foreground ml-2">— {desc}</span>
                             </div>
                           ))}
                         </div>
                       ) : null}
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