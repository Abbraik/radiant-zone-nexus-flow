import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link2, Plus, Search, ExternalLink } from 'lucide-react';
import { LoopNode } from '@/types/loop-registry';

interface SNLLinksEditorProps {
  loopId?: string;
  nodes: LoopNode[];
}

// Mock shared nodes data
const mockSharedNodes = [
  {
    id: '1',
    label: 'Customer Satisfaction',
    domain: 'social',
    descriptor: 'Overall customer satisfaction metric',
    usage_count: 5
  },
  {
    id: '2',
    label: 'Processing Capacity',
    domain: 'resource',
    descriptor: 'System processing capacity',
    usage_count: 3
  },
  {
    id: '3',
    label: 'Regulatory Framework',
    domain: 'institution',
    descriptor: 'Governing regulatory structure',
    usage_count: 8
  }
];

const roles = [
  { value: 'actor', label: 'Actor' },
  { value: 'system', label: 'System' },
  { value: 'bottleneck', label: 'Bottleneck' },
  { value: 'beneficiary', label: 'Beneficiary' }
];

const domains = [
  { value: 'population', label: 'Population', color: 'bg-blue-100 text-blue-800' },
  { value: 'resource', label: 'Resource', color: 'bg-green-100 text-green-800' },
  { value: 'products', label: 'Products', color: 'bg-purple-100 text-purple-800' },
  { value: 'social', label: 'Social', color: 'bg-orange-100 text-orange-800' },
  { value: 'institution', label: 'Institution', color: 'bg-gray-100 text-gray-800' }
];

export const SNLLinksEditor: React.FC<SNLLinksEditorProps> = ({ loopId, nodes }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [selectedSNL, setSelectedSNL] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>('actor');
  const [attachedSNLs, setAttachedSNLs] = useState<any[]>([]);

  const filteredSNLs = mockSharedNodes.filter(snl =>
    snl.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    snl.descriptor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAttachSNL = () => {
    if (selectedNode && selectedSNL) {
      const snl = mockSharedNodes.find(s => s.id === selectedSNL);
      const node = nodes.find(n => n.id === selectedNode);
      
      if (snl && node) {
        setAttachedSNLs(prev => [...prev, {
          nodeId: selectedNode,
          nodeName: node.label,
          snlId: selectedSNL,
          snlName: snl.label,
          role: selectedRole,
          domain: snl.domain
        }]);
        
        setSelectedNode(null);
        setSelectedSNL(null);
      }
    }
  };

  const handleDetachSNL = (index: number) => {
    setAttachedSNLs(prev => prev.filter((_, i) => i !== index));
  };

  const getDomainColor = (domain: string) => {
    return domains.find(d => d.value === domain)?.color || 'bg-gray-100 text-gray-800';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Shared Nodes Library (SNL) Links</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create New SNL
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attach SNL Section */}
        <Card>
          <CardHeader>
            <CardTitle>Link Node to SNL</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Select Node</label>
              <Select value={selectedNode || ''} onValueChange={setSelectedNode}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Choose a node from your loop" />
                </SelectTrigger>
                <SelectContent>
                  {nodes.map((node) => (
                    <SelectItem key={node.id} value={node.id}>
                      <div className="flex items-center gap-2">
                        <span>{node.label}</span>
                        <Badge variant="outline">{node.kind}</Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Search Shared Nodes</label>
              <div className="relative mt-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="max-h-48 overflow-y-auto border rounded-lg">
              {filteredSNLs.map((snl) => (
                <div
                  key={snl.id}
                  className={`p-3 border-b last:border-b-0 cursor-pointer transition-colors ${
                    selectedSNL === snl.id
                      ? 'bg-primary/10 border-primary'
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setSelectedSNL(snl.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{snl.label}</span>
                        <Badge className={getDomainColor(snl.domain)}>
                          {snl.domain}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {snl.descriptor}
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Used by {snl.usage_count} loops
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <label className="text-sm font-medium">Role</label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleAttachSNL}
              disabled={!selectedNode || !selectedSNL}
              className="w-full"
            >
              <Link2 className="w-4 h-4 mr-2" />
              Attach to SNL
            </Button>
          </CardContent>
        </Card>

        {/* Attached SNLs */}
        <Card>
          <CardHeader>
            <CardTitle>Current SNL Links ({attachedSNLs.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {attachedSNLs.length > 0 ? (
              <div className="space-y-3">
                {attachedSNLs.map((link, index) => (
                  <div
                    key={index}
                    className="p-3 border rounded-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{link.nodeName}</span>
                          <span className="text-muted-foreground">→</span>
                          <span className="font-medium">{link.snlName}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">{link.role}</Badge>
                          <Badge className={getDomainColor(link.domain)}>
                            {link.domain}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDetachSNL(index)}
                        >
                          Detach
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Link2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No SNL links attached</p>
                <p className="text-sm">Link nodes to shared concepts for cross-loop connections</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Related Loops Preview */}
      {attachedSNLs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Related Loops via SNL</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4 text-muted-foreground">
              <p>Related loops visualization coming soon</p>
              <p className="text-sm">This will show other loops connected via shared nodes</p>
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};