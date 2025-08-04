import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Download, 
  Share, 
  FileText, 
  BarChart3, 
  Link,
  Mail,
  Calendar,
  Settings,
  Filter
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';

interface ExportOptions {
  format: 'pdf' | 'csv' | 'xlsx' | 'json';
  scope: 'current-view' | 'selected-loop' | 'all-loops' | 'custom';
  includeCharts: boolean;
  includeTimeSeries: boolean;
  includeRecommendations: boolean;
  timeRange: 'last-24h' | 'last-7d' | 'last-30d' | 'custom';
}

interface ShareOptions {
  type: 'deep-link' | 'snapshot' | 'scheduled';
  permissions: 'view' | 'comment' | 'edit';
  expiry: 'never' | '24h' | '7d' | '30d';
  recipients: string[];
}

export function ExportSharePanel() {
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'pdf',
    scope: 'current-view',
    includeCharts: true,
    includeTimeSeries: false,
    includeRecommendations: true,
    timeRange: 'last-7d'
  });

  const [shareOptions, setShareOptions] = useState<ShareOptions>({
    type: 'deep-link',
    permissions: 'view',
    expiry: '7d',
    recipients: []
  });

  const [isExporting, setIsExporting] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsExporting(false);
  };

  const handleShare = async () => {
    setIsSharing(true);
    // Simulate share process
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSharing(false);
  };

  const generateDeepLink = () => {
    const baseUrl = window.location.origin;
    const params = new URLSearchParams({
      view: 'monitor',
      layout: 'grid',
      timestamp: Date.now().toString()
    });
    return `${baseUrl}/monitor?${params.toString()}`;
  };

  return (
    <div className="flex space-x-2">
      {/* Export Dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="glass-secondary border-border/50">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-lg glass border-border/50">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Download className="h-5 w-5" />
              <span>Export Dashboard</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Export Format */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Format</label>
              <Select 
                value={exportOptions.format} 
                onValueChange={(value: any) => setExportOptions(prev => ({ ...prev, format: value }))}
              >
                <SelectTrigger className="glass-secondary border-border/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass border-border/50">
                  <SelectItem value="pdf">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4" />
                      <span>PDF Report</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="csv">
                    <div className="flex items-center space-x-2">
                      <BarChart3 className="h-4 w-4" />
                      <span>CSV Data</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="xlsx">Excel Workbook</SelectItem>
                  <SelectItem value="json">JSON Data</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Export Scope */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Scope</label>
              <Select 
                value={exportOptions.scope} 
                onValueChange={(value: any) => setExportOptions(prev => ({ ...prev, scope: value }))}
              >
                <SelectTrigger className="glass-secondary border-border/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass border-border/50">
                  <SelectItem value="current-view">Current View</SelectItem>
                  <SelectItem value="selected-loop">Selected Loop</SelectItem>
                  <SelectItem value="all-loops">All Loops</SelectItem>
                  <SelectItem value="custom">Custom Selection</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Export Options */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Include</label>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Charts & Visualizations</span>
                  <Switch 
                    checked={exportOptions.includeCharts}
                    onCheckedChange={(checked) => setExportOptions(prev => ({ ...prev, includeCharts: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Time Series Data</span>
                  <Switch 
                    checked={exportOptions.includeTimeSeries}
                    onCheckedChange={(checked) => setExportOptions(prev => ({ ...prev, includeTimeSeries: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">AI Recommendations</span>
                  <Switch 
                    checked={exportOptions.includeRecommendations}
                    onCheckedChange={(checked) => setExportOptions(prev => ({ ...prev, includeRecommendations: checked }))}
                  />
                </div>
              </div>
            </div>

            <Separator />

            <Button 
              onClick={handleExport} 
              disabled={isExporting}
              className="w-full"
            >
              {isExporting ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="mr-2"
                >
                  <Settings className="h-4 w-4" />
                </motion.div>
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              {isExporting ? 'Exporting...' : 'Export Dashboard'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Share Dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="glass-secondary border-border/50">
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-lg glass border-border/50">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Share className="h-5 w-5" />
              <span>Share Dashboard</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Share Type */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Share Type</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'deep-link', label: 'Deep Link', icon: Link },
                  { value: 'snapshot', label: 'Snapshot', icon: FileText },
                  { value: 'scheduled', label: 'Scheduled', icon: Calendar }
                ].map(({ value, label, icon: Icon }) => (
                  <Button
                    key={value}
                    variant={shareOptions.type === value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setShareOptions(prev => ({ ...prev, type: value as any }))}
                    className="flex flex-col items-center p-3 h-auto"
                  >
                    <Icon className="h-4 w-4 mb-1" />
                    <span className="text-xs">{label}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Permissions */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Permissions</label>
              <Select 
                value={shareOptions.permissions} 
                onValueChange={(value: any) => setShareOptions(prev => ({ ...prev, permissions: value }))}
              >
                <SelectTrigger className="glass-secondary border-border/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass border-border/50">
                  <SelectItem value="view">View Only</SelectItem>
                  <SelectItem value="comment">View & Comment</SelectItem>
                  <SelectItem value="edit">Full Edit Access</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Link Expiry */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Link Expiry</label>
              <Select 
                value={shareOptions.expiry} 
                onValueChange={(value: any) => setShareOptions(prev => ({ ...prev, expiry: value }))}
              >
                <SelectTrigger className="glass-secondary border-border/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass border-border/50">
                  <SelectItem value="never">Never Expires</SelectItem>
                  <SelectItem value="24h">24 Hours</SelectItem>
                  <SelectItem value="7d">7 Days</SelectItem>
                  <SelectItem value="30d">30 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Generated Link Preview */}
            {shareOptions.type === 'deep-link' && (
              <div className="p-3 rounded-lg glass-secondary">
                <label className="text-xs text-muted-foreground block mb-1">Generated Link</label>
                <div className="flex items-center space-x-2">
                  <code className="text-xs bg-muted/20 px-2 py-1 rounded flex-1 truncate">
                    {generateDeepLink()}
                  </code>
                  <Button size="sm" variant="outline" className="text-xs h-7">
                    Copy
                  </Button>
                </div>
              </div>
            )}

            <Separator />

            <div className="flex space-x-2">
              <Button 
                onClick={handleShare} 
                disabled={isSharing}
                className="flex-1"
              >
                {isSharing ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="mr-2"
                  >
                    <Settings className="h-4 w-4" />
                  </motion.div>
                ) : (
                  <Share className="h-4 w-4 mr-2" />
                )}
                {isSharing ? 'Sharing...' : 'Generate Share Link'}
              </Button>
              
              <Button variant="outline" size="sm" className="px-3">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}