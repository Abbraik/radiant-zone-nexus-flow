import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/lang/language.context";
import { fmt } from "@/lib/lang/language.formatters";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function PostAdoptionReview() {
  const { t, x } = useLang();

  // Mock data - in real implementation, this would come from props
  const mockData = {
    effect: 0.23,
    confidence: 0.85,
    method: "its",
    beforePeriod: "2024-01-01 to 2024-01-15",
    afterPeriod: "2024-01-16 to 2024-01-30",
    comparisonGroup: "Similar regions (n=3)",
    conclusion: "Moderate positive impact with high confidence"
  };

  const EffectIcon = mockData.effect > 0.1 ? TrendingUp : 
                    mockData.effect < -0.1 ? TrendingDown : Minus;

  return (
    <div className="grid gap-4">
      <Card className="rounded-2xl border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">{t("concept.post_adoption")}</CardTitle>
          <CardDescription>
            {x("concept.post_adoption") || "Review the impact after implementing changes"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Method Badge */}
          <div className="flex items-center gap-2">
            <Badge variant="outline">{t(`concept.${mockData.method}`)}</Badge>
            <span className="text-sm text-muted-foreground">
              {x(`concept.${mockData.method}`)}
            </span>
          </div>

          {/* Effect Size */}
          <div className="rounded-lg bg-muted/50 p-4">
            <div className="flex items-center gap-3">
              <EffectIcon className={`h-6 w-6 ${mockData.effect > 0.1 ? 'text-green-600' : mockData.effect < -0.1 ? 'text-red-600' : 'text-muted-foreground'}`} />
              <div>
                <h4 className="text-sm font-medium">
                  {t("metric.effect")} <span className="text-muted-foreground">({t("concept.confidence")})</span>
                </h4>
                <p className="text-lg font-semibold">
                  {fmt(mockData.effect, { kind: "percent", decimals: 1 })} 
                  <span className="text-sm font-normal text-muted-foreground ml-2">
                    {fmt(mockData.confidence, { kind: "percent", decimals: 0 })} confident
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Time Periods */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h5 className="text-sm font-medium">Before Period</h5>
              <p className="text-sm text-muted-foreground">{mockData.beforePeriod}</p>
            </div>
            <div className="space-y-2">
              <h5 className="text-sm font-medium">After Period</h5>
              <p className="text-sm text-muted-foreground">{mockData.afterPeriod}</p>
            </div>
          </div>

          {/* Comparison */}
          <div className="space-y-2">
            <h5 className="text-sm font-medium">{t("concept.did")}</h5>
            <p className="text-sm text-muted-foreground">{mockData.comparisonGroup}</p>
          </div>

          {/* Conclusion */}
          <div className="rounded-lg border bg-card p-4">
            <h5 className="text-sm font-medium mb-2">Conclusion</h5>
            <p className="text-sm">{mockData.conclusion}</p>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button size="sm">Save Learning Note</Button>
            <Button variant="outline" size="sm">Export Report</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}