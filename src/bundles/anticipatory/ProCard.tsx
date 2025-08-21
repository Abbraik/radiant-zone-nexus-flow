import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function ProCard(props: React.PropsWithChildren<{title?: string; subtitle?: string; right?: React.ReactNode; className?: string;}>) {
  return (
    <Card className={cn("rounded-2xl border bg-card shadow-sm", props.className)}>
      {(props.title || props.subtitle || props.right) && (
        <CardHeader className="py-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              {props.title ? <CardTitle className="text-base leading-tight">{props.title}</CardTitle> : null}
              {props.subtitle ? <CardDescription className="mt-0.5">{props.subtitle}</CardDescription> : null}
            </div>
            {props.right ? <div className="ml-auto">{props.right}</div> : null}
          </div>
        </CardHeader>
      )}
      <CardContent className="pt-0">{props.children}</CardContent>
    </Card>
  );
}

export function ProSection(props: React.PropsWithChildren<{title: string; right?: React.ReactNode; className?: string;}>) {
  return (
    <div className={cn("rounded-2xl border bg-background p-3", props.className)}>
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">{props.title}</div>
        {props.right}
      </div>
      <div className="mt-2">{props.children}</div>
    </div>
  );
}