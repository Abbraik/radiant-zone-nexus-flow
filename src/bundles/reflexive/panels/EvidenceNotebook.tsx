import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLang } from "@/lib/lang/language.context";
import { FileText, Camera, Link, Upload } from "lucide-react";

export default function EvidenceNotebook() {
  const { t } = useLang();
  const [noteTitle, setNoteTitle] = React.useState("");
  const [noteContent, setNoteContent] = React.useState("");

  // Mock evidence entries
  const mockEvidence = [
    {
      id: "ev-001",
      title: "Wait Time Trend Analysis",
      type: "chart",
      date: "2024-01-20",
      loopCode: "MES-L10",
      actionId: "act-042"
    },
    {
      id: "ev-002",
      title: "Stakeholder Feedback Summary",
      type: "note", 
      date: "2024-01-19",
      loopCode: "MES-L10",
      actionId: "act-041"
    },
    {
      id: "ev-003",
      title: "Controller Settings Snapshot",
      type: "file",
      date: "2024-01-18", 
      loopCode: "MES-L10",
      actionId: "act-040"
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "chart": return <Camera className="h-4 w-4" />;
      case "note": return <FileText className="h-4 w-4" />;
      case "file": return <Upload className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "chart": return "Chart";
      case "note": return "Note";
      case "file": return "File";
      default: return "Evidence";
    }
  };

  return (
    <div className="grid gap-4">
      {/* Create New Evidence */}
      <Card className="rounded-2xl border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5" />
            Evidence Notebook
          </CardTitle>
          <CardDescription>
            Attach charts, notes, and files to keep a transparent trail of decisions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Quick Actions */}
          <div className="grid grid-cols-3 gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Snapshot Chart
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Add Note
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload File
            </Button>
          </div>

          {/* Add New Note Form */}
          <div className="space-y-3 p-4 rounded-lg border bg-muted/30">
            <Input
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              placeholder="Evidence title..."
            />
            <Textarea
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Add your observations, insights, or attach relevant information..."
              rows={3}
            />
            <div className="flex gap-2">
              <Button size="sm" disabled={!noteTitle.trim()}>Save Evidence</Button>
              <Button variant="outline" size="sm">Cancel</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Evidence History */}
      <Card className="rounded-2xl border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Recent Evidence</CardTitle>
          <CardDescription>Linked to loop actions and decisions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {mockEvidence.map((item) => (
            <div key={item.id} className="rounded-lg border bg-card p-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(item.type)}
                    <h6 className="font-medium">{item.title}</h6>
                    <Badge variant="outline" className="text-xs">
                      {getTypeBadge(item.type)}
                    </Badge>
                  </div>
                  <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{item.date}</span>
                    <div className="flex items-center gap-1">
                      <Link className="h-3 w-3" />
                      <span>{item.loopCode}</span>
                    </div>
                    <span>Action: {item.actionId}</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  View
                </Button>
              </div>
            </div>
          ))}
          
          {mockEvidence.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No evidence recorded yet</p>
              <p className="text-sm">Start by taking a chart snapshot or adding a note</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}