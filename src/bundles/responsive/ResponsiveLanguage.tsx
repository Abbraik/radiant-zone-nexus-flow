import * as React from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { HelpCircle } from "lucide-react";
import type { LangMode } from "./types.ui.lang";
import { responsiveLearning } from "./learningHub.content";

type Props = {
  mode: LangMode;
  onModeChange: (m: LangMode)=>void;
};

export function ResponsiveHeaderLanguage({ mode, onModeChange }: Props){
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex items-center gap-3">
      {/* Language toggle */}
      <div className="flex items-center gap-2 rounded-xl border bg-background px-3 py-1.5">
        <span className="text-xs text-muted-foreground">Language</span>
        <div className="flex items-center gap-2">
          <span className={`text-xs ${mode==="general"?"font-medium":""}`}>General</span>
          <Switch checked={mode==="expert"} onCheckedChange={(v)=>onModeChange(v?"expert":"general")} />
          <span className={`text-xs ${mode==="expert"?"font-medium":""}`}>Expert</span>
        </div>
      </div>

      {/* Learning Hub */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1">
            <HelpCircle className="h-4 w-4" />
            Learn
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[560px] max-w-[90vw] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{responsiveLearning.title}</SheetTitle>
            <SheetDescription className="text-sm">Guidance for purpose, workflows, components, handoffs, and outputs.</SheetDescription>
          </SheetHeader>

          <div className="mt-4 space-y-5">
            {responsiveLearning.sections.map((s, idx)=>(
              <section key={idx} className="rounded-2xl border bg-card p-4">
                <h4 className="text-sm font-semibold">{s.heading}</h4>
                {"body" in s && s.body ? <p className="mt-2 text-sm text-muted-foreground">{s.body}</p> : null}
                {"list" in s && Array.isArray((s as any).list) ? (
                  <ul className="mt-2 list-disc list-inside text-sm text-muted-foreground space-y-1">
                    {(s as any).list.map((li:string, i:number)=> <li key={i}>{li}</li>)}
                  </ul>
                ) : null}
                {"bullets" in s && Array.isArray((s as any).bullets) ? (
                  <ul className="mt-2 text-sm text-muted-foreground space-y-2">
                    {(s as any).bullets.map(([title, desc]: [string,string], i:number)=>(
                      <li key={i}>
                        <span className="font-medium text-foreground">{title} — </span>
                        <span>{desc}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}