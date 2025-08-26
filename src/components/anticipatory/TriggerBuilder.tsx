import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Zap, Code, Save, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export function TriggerBuilder() {
  const [dslText, setDslText] = useState("");
  const [triggerName, setTriggerName] = useState("");
  const [authority, setAuthority] = useState("");
  const [actionRef, setActionRef] = useState("");
  const [windowHours, setWindowHours] = useState("24");
  const [validDays, setValidDays] = useState("30");
  
  const queryClient = useQueryClient();

  // Fetch available templates
  const { data: templates } = useQuery({
    queryKey: ['trigger_templates'],
    queryFn: async () => {
      const { data } = await supabase
        .from('trigger_templates')
        .select('*')
        .order('created_at', { ascending: false });
      return data || [];
    }
  });

  // Fetch risk channels
  const { data: channels } = useQuery({
    queryKey: ['risk_channels'],
    queryFn: async () => {
      const { data } = await supabase
        .from('risk_channels')
        .select('*')
        .order('title');
      return data || [];
    }
  });

  // Create trigger mutation
  const createTrigger = useMutation({
    mutationFn: async (triggerData: any) => {
      const { data, error } = await supabase
        .from('antic_trigger_rules')
        .insert(triggerData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Trigger rule created successfully!");
      queryClient.invalidateQueries({ queryKey: ['antic_trigger_rules'] });
      // Reset form
      setDslText("");
      setTriggerName("");
      setAuthority("");
      setActionRef("");
      setWindowHours("24");
      setValidDays("30");
    },
    onError: (error) => {
      toast.error("Failed to create trigger rule");
      console.error(error);
    }
  });

  const handleTemplateSelect = (templateKey: string) => {
    const template = templates?.find(t => t.template_key === templateKey);
    if (template) {
      setDslText(template.dsl);
      setTriggerName(`${template.title} - Custom`);
    }
  };

  const validateAndPreview = () => {
    try {
      // Simple DSL validation - just check basic syntax
      if (!dslText.includes('IF') || !dslText.includes('THEN')) {
        throw new Error('DSL must contain IF...THEN structure');
      }
      
      toast.success("DSL validation successful!", {
        description: "Basic syntax validation passed"
      });
      
      // Create a simple AST structure for the database
      return {
        ast: {
          condition: { type: 'expr', expr: { type: 'custom', raw: dslText } },
          persistence: parseInt(windowHours),
          action: { type: 'start', templateKey: actionRef, capacity: 'responsive' },
          options: {}
        }
      };
    } catch (error) {
      toast.error("DSL validation failed", {
        description: error instanceof Error ? error.message : "Invalid DSL syntax"
      });
      return null;
    }
  };

  const handleSubmit = async () => {
    if (!triggerName || !dslText || !authority || !actionRef) {
      toast.error("Please fill in all required fields");
      return;
    }

    const compiled = validateAndPreview();
    if (!compiled) return;

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + parseInt(validDays));

    const triggerData = {
      name: triggerName,
      expr_raw: dslText,
      expr_ast: compiled.ast,
      window_hours: parseInt(windowHours),
      authority,
      action_ref: actionRef,
      valid_from: new Date().toISOString(),
      expires_at: expiresAt.toISOString(),
      created_by: (await supabase.auth.getUser()).data.user?.id || 'system',
      org_id: (await supabase.auth.getUser()).data.user?.id || 'system'
    };

    createTrigger.mutate(triggerData);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Trigger Builder</h2>
        <p className="text-muted-foreground">
          Create and configure early warning trigger rules using DSL
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              DSL Configuration
            </CardTitle>
            <CardDescription>
              Define trigger logic using the Domain Specific Language
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Template (Optional)</Label>
              <Select onValueChange={handleTemplateSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a template to start with" />
                </SelectTrigger>
                <SelectContent>
                  {templates?.map(template => (
                    <SelectItem key={template.template_key} value={template.template_key}>
                      {template.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dsl">DSL Expression *</Label>
              <Textarea
                id="dsl"
                placeholder="IF indicator >= threshold FOR duration THEN START action IN capacity..."
                value={dslText}
                onChange={(e) => setDslText(e.target.value)}
                className="min-h-[100px] font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Example: IF childcare_wait_days {'>='} 30 FOR 14d THEN START containment_pack IN responsive
              </p>
            </div>

            <Button 
              variant="outline" 
              onClick={validateAndPreview}
              disabled={!dslText}
              className="w-full"
            >
              <Zap className="h-4 w-4 mr-2" />
              Validate DSL
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Trigger Details</CardTitle>
            <CardDescription>
              Configure trigger metadata and parameters
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Trigger Name *</Label>
              <Input
                id="name"
                placeholder="e.g. Childcare Overload Alert"
                value={triggerName}
                onChange={(e) => setTriggerName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="authority">Authority *</Label>
              <Input
                id="authority"
                placeholder="e.g. Health + Education"
                value={authority}
                onChange={(e) => setAuthority(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="action">Action Reference *</Label>
              <Input
                id="action"
                placeholder="e.g. containment_pack_childcare"
                value={actionRef}
                onChange={(e) => setActionRef(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="window">Window (hours)</Label>
                <Input
                  id="window"
                  type="number"
                  value={windowHours}
                  onChange={(e) => setWindowHours(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="valid">Valid for (days)</Label>
                <Input
                  id="valid"
                  type="number"
                  value={validDays}
                  onChange={(e) => setValidDays(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Available Risk Channels */}
      <Card>
        <CardHeader>
          <CardTitle>Available Risk Channels</CardTitle>
          <CardDescription>
            These channels are available for use in your trigger expressions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {channels?.length ? (
            <div className="flex flex-wrap gap-2">
              {channels.map(channel => (
                <Badge key={channel.channel_key} variant="outline" className="cursor-pointer">
                  {channel.channel_key}
                </Badge>
              ))}
            </div>
          ) : (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                No risk channels available. These will be created when you seed demo data.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button 
          onClick={handleSubmit}
          disabled={createTrigger.isPending || !triggerName || !dslText || !authority || !actionRef}
          size="lg"
        >
          <Save className="h-4 w-4 mr-2" />
          {createTrigger.isPending ? "Creating..." : "Create Trigger Rule"}
        </Button>
      </div>
    </div>
  );
}