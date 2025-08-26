import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, Play, Wrench, Users, FileText, HelpCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { label, masterDict } from '@/i18n/labels';
import { useLangMode } from '@/hooks/useLangMode';
import { TermTooltip } from '@/components/ui/language-toggle';

interface LearningHubDrawerProps {
  capacity: 'responsive' | 'reflexive' | 'deliberative' | 'anticipatory' | 'structural';
  isOpen: boolean;
  onClose: () => void;
}

interface LearningHubContent {
  hub_id: string;
  capacity: string;
  version: string;
  mdx_content: string;
  updated_at: string;
  author: string;
}

// Sample content structure (will be replaced by actual MDX)
const sampleContent = {
  responsive: {
    purpose: "Quick response handles immediate issues that need urgent attention. When something goes wrong, this is your first line of defense.",
    bullets: [
      "Stop immediate harm or disruption",
      "Stabilize the situation quickly",
      "Buy time for deeper solutions"
    ],
    workflows: [
      { name: "Containment (30 days)", link: "/workspace-5c/responsive/checkpoint?template=containment_pack", description: "Quick fix for urgent issues" },
      { name: "Incident Response", link: "/workspace-5c/responsive/sprint?template=incident", description: "Emergency response protocol" },
      { name: "Status Update", link: "/workspace-5c/responsive/status", description: "Communicate current situation" }
    ],
    components: [
      { name: "Checkpoint Console", purpose: "Track progress", usage: "Monitor task completion and handoffs" },
      { name: "Status Banner", purpose: "Show current state", usage: "Display situation summary to stakeholders" },
      { name: "Quick Actions", purpose: "Fast responses", usage: "One-click common actions" }
    ],
    handoffs: [
      { to: "Reflexive", when: "After immediate crisis is contained", what: "Learning and improvement needs" },
      { to: "Deliberative", when: "Multiple stakeholders need to decide", what: "Complex decision requirements" }
    ],
    outputs: [
      { name: "Status Banner", description: "Real-time situation summary", location: "Dashboard header" },
      { name: "Incident Report", description: "What happened and actions taken", location: "Reports section" }
    ]
  },
  reflexive: {
    purpose: "Auto-adjust learns from what happened and tunes the system to work better next time. It's about continuous improvement.",
    bullets: [
      "Learn from past experiences",
      "Adjust system parameters automatically",
      "Prevent similar issues recurring"
    ],
    workflows: [
      { name: "Learning Review", link: "/workspace-5c/reflexive/learning?template=review", description: "Analyze what worked and what didn't" },
      { name: "Controller Tuning", link: "/workspace-5c/reflexive/tuning", description: "Adjust system parameters" },
      { name: "Adaptation Planning", link: "/workspace-5c/reflexive/adapt", description: "Plan system improvements" }
    ],
    components: [
      { name: "Learning Deck", purpose: "Capture lessons", usage: "Document insights and improvements" },
      { name: "Verdict Panel", purpose: "Make assessments", usage: "Evaluate success and failures" },
      { name: "Tuning Controls", purpose: "Adjust settings", usage: "Fine-tune system parameters" }
    ],
    handoffs: [
      { to: "Structural", when: "System-wide changes needed", what: "Fundamental design improvements" },
      { to: "Anticipatory", when: "Patterns suggest future risks", what: "Early warning requirements" }
    ],
    outputs: [
      { name: "Learning Deck", description: "Lessons learned summary", location: "Knowledge base" },
      { name: "Tuning Report", description: "Parameter adjustments made", location: "System logs" }
    ]
  },
  deliberative: {
    purpose: "Group decision brings together different perspectives to make important choices. When multiple people need to agree, this is how it happens.",
    bullets: [
      "Include diverse viewpoints",
      "Make transparent decisions",
      "Build consensus and buy-in"
    ],
    workflows: [
      { name: "Decision Session", link: "/workspace-5c/deliberative/session?template=standard", description: "Structured group decision-making" },
      { name: "Options Analysis", link: "/workspace-5c/deliberative/options", description: "Compare different choices" },
      { name: "Consensus Building", link: "/workspace-5c/deliberative/consensus", description: "Reach agreement" }
    ],
    components: [
      { name: "Decision Matrix", purpose: "Compare options", usage: "Score choices against criteria" },
      { name: "Mandate Gate", purpose: "Check permissions", usage: "Ensure authority to act" },
      { name: "Participation Panel", purpose: "Manage involvement", usage: "Track who needs to participate" }
    ],
    handoffs: [
      { to: "Responsive", when: "Decision made, action needed", what: "Implementation requirements" },
      { to: "Structural", when: "Decision requires system changes", what: "Policy or process updates" }
    ],
    outputs: [
      { name: "Decision Note", description: "What was decided and why", location: "Decision registry" },
      { name: "Public Dossier", description: "Shareable decision summary", location: "Public records" }
    ]
  },
  anticipatory: {
    purpose: "Early warning watches for problems before they happen. It's about being prepared and catching issues early.",
    bullets: [
      "Spot problems before they grow",
      "Prepare responses in advance",
      "Monitor warning signals"
    ],
    workflows: [
      { name: "Watchpoint Setup", link: "/workspace-5c/anticipatory/watchpoints?template=new", description: "Configure monitoring" },
      { name: "Trigger Rules", link: "/workspace-5c/anticipatory/triggers", description: "Set up automatic alerts" },
      { name: "Scenario Planning", link: "/workspace-5c/anticipatory/scenarios", description: "Prepare for what-if situations" }
    ],
    components: [
      { name: "Alert Dashboard", purpose: "Monitor warnings", usage: "Track system health indicators" },
      { name: "Trigger Builder", purpose: "Create alerts", usage: "Set up automated responses" },
      { name: "Readiness Panel", purpose: "Prepare actions", usage: "Pre-position resources" }
    ],
    handoffs: [
      { to: "Responsive", when: "Warning triggers fire", what: "Immediate action needs" },
      { to: "Deliberative", when: "Major risk decisions needed", what: "Strategic response choices" }
    ],
    outputs: [
      { name: "Readiness Plan", description: "Prepared responses for different scenarios", location: "Response library" },
      { name: "Alert History", description: "Record of warnings and outcomes", location: "Monitoring logs" }
    ]
  },
  structural: {
    purpose: "System change redesigns how things work fundamentally. When the current way isn't working, this creates a better way.",
    bullets: [
      "Change underlying systems",
      "Fix root causes permanently",
      "Design better processes"
    ],
    workflows: [
      { name: "System Design", link: "/workspace-5c/structural/design?template=new", description: "Design new processes" },
      { name: "Mandate Review", link: "/workspace-5c/structural/mandate", description: "Check decision-making authority" },
      { name: "Implementation Plan", link: "/workspace-5c/structural/implement", description: "Roll out changes" }
    ],
    components: [
      { name: "Design Canvas", purpose: "Map systems", usage: "Visualize processes and relationships" },
      { name: "Authority Matrix", purpose: "Track permissions", usage: "Manage decision-making rights" },
      { name: "Change Timeline", purpose: "Plan rollout", usage: "Sequence implementation steps" }
    ],
    handoffs: [
      { to: "Deliberative", when: "Stakeholder agreement needed", what: "Design approval requirements" },
      { to: "Anticipatory", when: "New system needs monitoring", what: "Warning system updates" }
    ],
    outputs: [
      { name: "Public Dossier", description: "New system documentation", location: "Policy library" },
      { name: "Implementation Guide", description: "How to use the new system", location: "Training materials" }
    ]
  }
};

export const LearningHubDrawer: React.FC<LearningHubDrawerProps> = ({
  capacity,
  isOpen,
  onClose
}) => {
  const { langMode } = useLangMode();
  const [content, setContent] = useState<LearningHubContent | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Load content from database
  useEffect(() => {
    if (!isOpen) return;
    
    async function loadContent() {
      setLoading(true);
      try {
        const { data } = await supabase
          .from('learning_hubs')
          .select('*')
          .eq('capacity', capacity)
          .eq('active', true)
          .order('version', { ascending: false })
          .limit(1)
          .single();
          
        if (data) {
          setContent(data);
        }
      } catch (error) {
        console.warn('Failed to load learning hub content:', error);
        // Content will fall back to sample content
      } finally {
        setLoading(false);
      }
    }
    
    loadContent();
  }, [capacity, isOpen]);
  
  // Get content (database or sample)
  const capacityContent = sampleContent[capacity];
  const capacityLabel = label(masterDict, capacity.toUpperCase(), langMode);
  
  const handleWorkflowClick = (link: string) => {
    window.location.href = link;
    onClose();
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-2xl bg-background border-l shadow-2xl z-50 overflow-hidden"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-6 w-6 text-primary" />
                  <div>
                    <h2 className="text-xl font-semibold">
                      <TermTooltip termKey="LEARNING_HUB">
                        {label(masterDict, 'LEARNING_HUB', langMode)}
                      </TermTooltip>
                    </h2>
                    <p className="text-sm text-foreground-subtle">
                      {capacityLabel} Capacity
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              {/* Content */}
              <ScrollArea className="flex-1 p-6">
                <Tabs defaultValue="purpose" className="w-full">
                  <TabsList className="grid w-full grid-cols-6 mb-6">
                    <TabsTrigger value="purpose" className="text-xs">
                      <TermTooltip termKey="PURPOSE">Purpose</TermTooltip>
                    </TabsTrigger>
                    <TabsTrigger value="workflows" className="text-xs">
                      <TermTooltip termKey="WORKFLOWS">Workflows</TermTooltip>
                    </TabsTrigger>
                    <TabsTrigger value="components" className="text-xs">
                      <TermTooltip termKey="COMPONENTS">Tools</TermTooltip>
                    </TabsTrigger>
                    <TabsTrigger value="handoffs" className="text-xs">Handoffs</TabsTrigger>
                    <TabsTrigger value="outputs" className="text-xs">Outputs</TabsTrigger>
                    <TabsTrigger value="examples" className="text-xs">Examples</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="purpose" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          <TermTooltip termKey="PURPOSE">
                            What this does
                          </TermTooltip>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-foreground-subtle leading-relaxed">
                          {capacityContent.purpose}
                        </p>
                        <div className="space-y-2">
                          <h4 className="font-medium">Key functions:</h4>
                          <ul className="space-y-1">
                            {capacityContent.bullets.map((bullet, index) => (
                              <li key={index} className="flex items-start gap-2 text-sm">
                                <span className="text-primary mt-1">•</span>
                                <span>{bullet}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="workflows" className="space-y-4">
                    <div className="space-y-3">
                      <h3 className="font-medium">
                        <TermTooltip termKey="WORKFLOWS">Step-by-step guides</TermTooltip>
                      </h3>
                      {capacityContent.workflows.map((workflow, index) => (
                        <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow"
                              onClick={() => handleWorkflowClick(workflow.link)}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <Play className="h-4 w-4 text-primary" />
                                  <span className="font-medium">{workflow.name}</span>
                                </div>
                                <p className="text-sm text-foreground-subtle">
                                  {workflow.description}
                                </p>
                              </div>
                              <ExternalLink className="h-4 w-4 text-foreground-subtle" />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="components" className="space-y-4">
                    <div className="space-y-3">
                      <h3 className="font-medium">
                        <TermTooltip termKey="COMPONENTS">Available tools</TermTooltip>
                      </h3>
                      {capacityContent.components.map((component, index) => (
                        <Card key={index}>
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <Wrench className="h-5 w-5 text-primary mt-0.5" />
                              <div className="space-y-1">
                                <span className="font-medium">{component.name}</span>
                                <p className="text-sm text-foreground-subtle">
                                  <strong>Purpose:</strong> {component.purpose}
                                </p>
                                <p className="text-sm text-foreground-subtle">
                                  <strong>Usage:</strong> {component.usage}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="handoffs" className="space-y-4">
                    <div className="space-y-3">
                      <h3 className="font-medium">When to pass work to other teams</h3>
                      {capacityContent.handoffs.map((handoff, index) => (
                        <Card key={index}>
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <Users className="h-5 w-5 text-primary mt-0.5" />
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">Pass to {handoff.to}</span>
                                  <Badge variant="outline">{handoff.to}</Badge>
                                </div>
                                <p className="text-sm text-foreground-subtle">
                                  <strong>When:</strong> {handoff.when}
                                </p>
                                <p className="text-sm text-foreground-subtle">
                                  <strong>What to pass:</strong> {handoff.what}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="outputs" className="space-y-4">
                    <div className="space-y-3">
                      <h3 className="font-medium">
                        <TermTooltip termKey="EXPECTED_OUTPUTS">What you'll produce</TermTooltip>
                      </h3>
                      {capacityContent.outputs.map((output, index) => (
                        <Card key={index}>
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <FileText className="h-5 w-5 text-primary mt-0.5" />
                              <div className="space-y-1">
                                <span className="font-medium">{output.name}</span>
                                <p className="text-sm text-foreground-subtle">
                                  {output.description}
                                </p>
                                <p className="text-xs text-foreground-subtle">
                                  <strong>Location:</strong> {output.location}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="examples" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Real-world examples</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="p-3 bg-muted rounded-lg">
                            <h4 className="font-medium text-sm mb-2">Fertility Support (FER-L01)</h4>
                            <p className="text-xs text-foreground-subtle">
                              Using {capacityLabel} capacity to address childcare waiting lists
                            </p>
                          </div>
                          <div className="p-3 bg-muted rounded-lg">
                            <h4 className="font-medium text-sm mb-2">Labour Market (LAB-L01)</h4>
                            <p className="text-xs text-foreground-subtle">
                              Applying {capacityLabel} approach to job placement delays
                            </p>
                          </div>
                          <div className="p-3 bg-muted rounded-lg">
                            <h4 className="font-medium text-sm mb-2">Social Cohesion (SOC-L01)</h4>
                            <p className="text-xs text-foreground-subtle">
                              {capacityLabel} methods for community trust issues
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </ScrollArea>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};