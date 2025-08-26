import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const PublicDossier: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: dossier, isLoading } = useQuery({
    queryKey: ['public-dossier', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('v_public_dossier')
        .select('*')
        .eq('public_slug', slug)
        .single();
        
      if (error) throw error;
      return data;
    },
    enabled: !!slug
  });

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!dossier) {
    return <div className="p-8">Dossier not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">{dossier.title}</h1>
        <div className="flex items-center justify-center gap-2">
          <Badge>Version {dossier.version}</Badge>
          {dossier.horizon_tag && <Badge variant="outline">{dossier.horizon_tag}</Badge>}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{dossier.summary}</p>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {(dossier.components as any[])?.map((component: any, index: number) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="capitalize">{component.kind}</CardTitle>
            </CardHeader>
            <CardContent>
              <h4 className="font-semibold mb-2">{component.title}</h4>
              <div className="text-sm text-muted-foreground">
                {typeof component.content === 'object' 
                  ? JSON.stringify(component.content, null, 2)
                  : String(component.content)
                }
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};