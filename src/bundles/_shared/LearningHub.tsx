import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { useLang } from "@/lib/lang/language.context";

export type LearnSection = {
  id: string;
  title: string;
  summary: string;
  bullets?: string[];
  rich?: React.ReactNode;  // optional extra UI (e.g., mini chart legend)
};

export type LearnContent = {
  purpose: LearnSection;
  workflows: LearnSection[];
  components: LearnSection[];     // each major panel + what it does
  handoffs: LearnSection;
  outputs: LearnSection;
  glossaryKeys?: string[];        // keys that map to the language dictionary
};

export function LearningHub({ title, subtitle, content }: {
  title: string; subtitle?: string; content: LearnContent;
}) {
  const { t, x, mode } = useLang();
  const subtle = "text-muted-foreground";
  return (
    <div className="grid gap-4">
      <Card className="rounded-2xl border bg-card shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{title}</CardTitle>
          {subtitle && <CardDescription>{subtitle}</CardDescription>}
        </CardHeader>
        <CardContent className="text-sm">
          <p>{content.purpose.summary}</p>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border bg-card shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Workflows</CardTitle>
          <CardDescription>How you typically use this capacity</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="w-full">
            {content.workflows.map(w => (
              <AccordionItem key={w.id} value={w.id}>
                <AccordionTrigger className="text-sm">{w.title}</AccordionTrigger>
                <AccordionContent className="text-sm">
                  <p className={subtle}>{w.summary}</p>
                  {w.bullets && (
                    <ul className="mt-2 list-disc list-inside space-y-1">
                      {w.bullets.map((b,i)=><li key={i}>{b}</li>)}
                    </ul>
                  )}
                  {w.rich}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border bg-card shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Components & what they do</CardTitle>
          <CardDescription>Panels, dashboards, drawers</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="w-full">
            {content.components.map(c => (
              <AccordionItem key={c.id} value={c.id}>
                <AccordionTrigger className="text-sm">{c.title}</AccordionTrigger>
                <AccordionContent className="text-sm">
                  <p className={subtle}>{c.summary}</p>
                  {c.bullets && (
                    <ul className="mt-2 list-disc list-inside space-y-1">
                      {c.bullets.map((b,i)=><li key={i}>{b}</li>)}
                    </ul>
                  )}
                  {c.rich}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        <Card className="rounded-2xl border bg-card shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Handoffs</CardTitle>
            <CardDescription>Where results go next</CardDescription>
          </CardHeader>
          <CardContent className="text-sm">
            <p className={subtle}>{content.handoffs.summary}</p>
            {content.handoffs.bullets && (
              <ul className="mt-2 list-disc list-inside space-y-1">
                {content.handoffs.bullets.map((b,i)=><li key={i}>{b}</li>)}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl border bg-card shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Expected Outputs</CardTitle>
            <CardDescription>What this capacity produces</CardDescription>
          </CardHeader>
          <CardContent className="text-sm">
            <p className={subtle}>{content.outputs.summary}</p>
            {content.outputs.bullets && (
              <ul className="mt-2 list-disc list-inside space-y-1">
                {content.outputs.bullets.map((b,i)=><li key={i}>{b}</li>)}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      {content.glossaryKeys?.length ? (
        <Card className="rounded-2xl border bg-card shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Glossary ({mode === "general" ? "Plain terms" : "Expert terms"})</CardTitle>
            <CardDescription>Quick meanings</CardDescription>
          </CardHeader>
          <CardContent className="text-sm">
            <ul className="space-y-1">
              {content.glossaryKeys.map(k => (
                <li key={k}>
                  <span className="font-medium">{t(k)}</span>
                  {x(k) && <span className="text-muted-foreground"> — {x(k)}</span>}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}