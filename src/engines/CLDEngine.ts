import { LoopData, LoopNode, LoopEdge } from '@/types/loop-registry';
import { CLDNode, CLDLink, CLDModel } from '@/types/cld';

interface AtlasNode {
  id: string;
  label: string;
  kind: string;
  meta?: Record<string, any>;
}

interface AtlasEdge {
  id: string;
  from_node: string;
  to_node: string;
  polarity: number;
  weight?: number;
  note?: string;
}

interface AtlasLoop {
  nodes?: AtlasNode[];
  edges?: AtlasEdge[];
  [key: string]: any;
}

/**
 * CLD Engine - Converts Atlas loop data to CLD format and provides layout algorithms
 */
export class CLDEngine {
  /**
   * Extract Atlas CLD data from a loop's raw data
   */
  static extractAtlasData(loop: LoopData): AtlasLoop | null {
    // Try to find Atlas data in metadata or other fields
    const metadata = loop.metadata as any;
    
    // Look for Atlas data in common places
    if (metadata?.atlas_data) {
      return metadata.atlas_data;
    }
    
    // If the loop has nodes/edges directly in metadata
    if (metadata?.nodes && metadata?.edges) {
      return {
        nodes: metadata.nodes,
        edges: metadata.edges
      };
    }
    
    // Check if loop has direct nodes/edges properties
    if (loop.nodes && loop.edges) {
      return {
        nodes: loop.nodes.map((node: any) => ({
          id: node.id,
          label: node.label,
          kind: node.kind || 'aux',
          meta: node.meta || {}
        })),
        edges: loop.edges.map((edge: any) => ({
          id: edge.id,
          from_node: edge.from_node,
          to_node: edge.to_node,
          polarity: edge.polarity,
          weight: edge.weight,
          note: edge.note
        }))
      };
    }
    
    // Try to extract from other common formats
    if (metadata?.structure) {
      const structure = metadata.structure;
      if (structure.nodes && structure.edges) {
        return {
          nodes: structure.nodes,
          edges: structure.edges
        };
      }
    }
    
    // Check if it's stored in the controller field (some loops store data there)
    if (loop.controller && typeof loop.controller === 'object') {
      const controller = loop.controller as any;
      if (controller.nodes && controller.edges) {
        return {
          nodes: controller.nodes,
          edges: controller.edges
        };
      }
    }
    
    return null;
  }

  /**
   * Convert Atlas nodes to LoopNode format with automatic positioning
   */
  static convertToLoopNodes(atlasNodes: AtlasNode[]): LoopNode[] {
    const positions = this.generateCircularLayout(atlasNodes.length, 300, 200);
    
    return atlasNodes.map((node, index) => ({
      id: node.id,
      label: node.label,
      kind: node.kind as any,
      domain: this.inferDomain(node.kind, node.label) as 'population' | 'resource' | 'products' | 'social' | 'institution',
      meta: {
        ...node.meta,
        position: positions[index]
      }
    }));
  }

  /**
   * Convert Atlas edges to LoopEdge format
   */
  static convertToLoopEdges(atlasEdges: AtlasEdge[]): LoopEdge[] {
    return atlasEdges.map(edge => ({
      id: edge.id,
      from_node: edge.from_node,
      to_node: edge.to_node,
      polarity: (edge.polarity === 1 ? 1 : -1) as 1 | -1,
      weight: edge.weight || 1.0,
      delay_ms: 0,
      note: edge.note
    }));
  }

  /**
   * Convert to full CLD model format
   */
  static convertToCLDModel(loop: LoopData, atlasData: AtlasLoop): CLDModel {
    const nodes = this.convertToCLDNodes(atlasData.nodes || []);
    const links = this.convertToCLDLinks(atlasData.edges || []);
    
    return {
      id: loop.id,
      name: loop.name,
      description: loop.notes,
      nodes,
      links,
      metadata: loop.metadata,
      createdAt: new Date(loop.created_at),
      updatedAt: new Date(loop.updated_at)
    };
  }

  /**
   * Convert Atlas nodes to CLD node format
   */
  static convertToCLDNodes(atlasNodes: AtlasNode[]): CLDNode[] {
    const positions = this.generateCircularLayout(atlasNodes.length, 300, 200);
    
    return atlasNodes.map((node, index) => ({
      id: node.id,
      label: node.label,
      type: this.mapKindToType(node.kind),
      position: positions[index],
      category: this.inferDomain(node.kind, node.label),
      color: this.getNodeColor(node.kind),
      metadata: node.meta
    }));
  }

  /**
   * Convert Atlas edges to CLD link format
   */
  static convertToCLDLinks(atlasEdges: AtlasEdge[]): CLDLink[] {
    return atlasEdges.map(edge => ({
      id: edge.id,
      sourceId: edge.from_node,
      targetId: edge.to_node,
      polarity: edge.polarity === 1 ? 'positive' : 'negative',
      strength: edge.weight || 1.0,
      label: edge.note,
      metadata: { weight: edge.weight }
    }));
  }

  /**
   * Generate circular layout for nodes
   */
  static generateCircularLayout(nodeCount: number, centerX = 300, centerY = 200, radius = 150): Array<{x: number, y: number}> {
    if (nodeCount === 0) return [];
    if (nodeCount === 1) return [{ x: centerX, y: centerY }];
    
    const positions: Array<{x: number, y: number}> = [];
    const angleStep = (2 * Math.PI) / nodeCount;
    
    for (let i = 0; i < nodeCount; i++) {
      const angle = i * angleStep - Math.PI / 2; // Start from top
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      positions.push({ x: Math.round(x), y: Math.round(y) });
    }
    
    return positions;
  }

  /**
   * Generate force-directed layout for better node distribution
   */
  static generateForceLayout(
    nodes: AtlasNode[], 
    edges: AtlasEdge[], 
    width = 600, 
    height = 400,
    iterations = 100
  ): Array<{x: number, y: number}> {
    if (nodes.length === 0) return [];
    
    // Initialize random positions
    let positions = nodes.map(() => ({
      x: Math.random() * width * 0.8 + width * 0.1,
      y: Math.random() * height * 0.8 + height * 0.1,
      vx: 0,
      vy: 0
    }));
    
    const nodeMap = new Map(nodes.map((node, i) => [node.id, i]));
    
    // Run force simulation
    for (let iter = 0; iter < iterations; iter++) {
      // Reset forces
      positions.forEach(pos => {
        pos.vx = 0;
        pos.vy = 0;
      });
      
      // Repulsion between all nodes
      for (let i = 0; i < positions.length; i++) {
        for (let j = i + 1; j < positions.length; j++) {
          const dx = positions[j].x - positions[i].x;
          const dy = positions[j].y - positions[i].y;
          const dist = Math.sqrt(dx * dx + dy * dy) + 0.1;
          const force = 1000 / (dist * dist);
          
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;
          
          positions[i].vx -= fx;
          positions[i].vy -= fy;
          positions[j].vx += fx;
          positions[j].vy += fy;
        }
      }
      
      // Attraction along edges
      edges.forEach(edge => {
        const fromIdx = nodeMap.get(edge.from_node);
        const toIdx = nodeMap.get(edge.to_node);
        
        if (fromIdx !== undefined && toIdx !== undefined) {
          const dx = positions[toIdx].x - positions[fromIdx].x;
          const dy = positions[toIdx].y - positions[fromIdx].y;
          const dist = Math.sqrt(dx * dx + dy * dy) + 0.1;
          const force = dist * 0.01;
          
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;
          
          positions[fromIdx].vx += fx;
          positions[fromIdx].vy += fy;
          positions[toIdx].vx -= fx;
          positions[toIdx].vy -= fy;
        }
      });
      
      // Apply forces and center attraction
      positions.forEach(pos => {
        // Center attraction
        const centerX = width / 2;
        const centerY = height / 2;
        const centerForce = 0.001;
        
        pos.vx += (centerX - pos.x) * centerForce;
        pos.vy += (centerY - pos.y) * centerForce;
        
        // Apply velocity with damping
        pos.x += pos.vx * 0.5;
        pos.y += pos.vy * 0.5;
        
        // Keep in bounds
        pos.x = Math.max(50, Math.min(width - 50, pos.x));
        pos.y = Math.max(50, Math.min(height - 50, pos.y));
      });
    }
    
    return positions.map(pos => ({ x: Math.round(pos.x), y: Math.round(pos.y) }));
  }

  /**
   * Map Atlas node kind to CLD node type
   */
  static mapKindToType(kind: string): 'stock' | 'flow' | 'auxiliary' | 'constant' {
    switch (kind.toLowerCase()) {
      case 'stock': return 'stock';
      case 'flow': return 'flow';
      case 'indicator':
      case 'aux':
      case 'auxiliary': return 'auxiliary';
      case 'constant': return 'constant';
      default: return 'auxiliary';
    }
  }

  /**
   * Infer domain from node kind and label
   */
  static inferDomain(kind: string, label: string): 'population' | 'resource' | 'products' | 'social' | 'institution' {
    const labelLower = label.toLowerCase();
    
    if (labelLower.includes('population') || labelLower.includes('demographic')) return 'population';
    if (labelLower.includes('resource') || labelLower.includes('capacity')) return 'resource';
    if (labelLower.includes('product') || labelLower.includes('output')) return 'products';
    if (labelLower.includes('social') || labelLower.includes('trust') || labelLower.includes('community')) return 'social';
    if (labelLower.includes('institution') || labelLower.includes('policy') || labelLower.includes('governance')) return 'institution';
    
    // Default based on kind
    switch (kind.toLowerCase()) {
      case 'actor': return 'social';
      case 'indicator': return 'institution'; // Map indicators to institution as fallback
      default: return 'social'; // Safe fallback to social
    }
  }

  /**
   * Get color for node based on kind
   */
  static getNodeColor(kind: string): string {
    switch (kind.toLowerCase()) {
      case 'stock': return '#3b82f6';
      case 'flow': return '#22c55e';
      case 'auxiliary':
      case 'aux': return '#eab308';
      case 'actor': return '#a855f7';
      case 'indicator': return '#ef4444';
      case 'constant': return '#6b7280';
      default: return '#6b7280';
    }
  }

  /**
   * Check if loop has CLD structure data available
   */
  static hasStructureData(loop: LoopData): boolean {
    const atlasData = this.extractAtlasData(loop);
    return !!(atlasData?.nodes && atlasData.nodes.length > 0);
  }

  /**
   * Generate a simple demo structure for loops without data
   */
  static generateDemoStructure(loop: LoopData): AtlasLoop {
    // Create a simple demo structure based on loop metadata
    const nodes = [
      {
        id: 'node1',
        label: 'System State',
        kind: 'stock',
        meta: {}
      },
      {
        id: 'node2', 
        label: 'Action',
        kind: 'flow',
        meta: {}
      },
      {
        id: 'node3',
        label: 'Feedback',
        kind: 'aux',
        meta: {}
      }
    ];

    const edges = [
      {
        id: 'edge1',
        from_node: 'node1',
        to_node: 'node2',
        polarity: 1,
        weight: 1.0
      },
      {
        id: 'edge2',
        from_node: 'node2',
        to_node: 'node3',
        polarity: 1,
        weight: 1.0
      },
      {
        id: 'edge3',
        from_node: 'node3',
        to_node: 'node1',
        polarity: -1,
        weight: 1.0
      }
    ];

    return {
      nodes,
      edges
    };
  }

  /**
   * Get structure statistics
   */
  static getStructureStats(loop: LoopData) {
    const atlasData = this.extractAtlasData(loop);
    
    if (!atlasData) {
      return {
        nodeCount: 0,
        edgeCount: 0,
        avgConnections: 0,
        isolatedNodes: 0,
        reinforcingLinks: 0,
        balancingLinks: 0
      };
    }
    
    const nodes = atlasData.nodes || [];
    const edges = atlasData.edges || [];
    
    const connectedNodeIds = new Set([
      ...edges.map(e => e.from_node),
      ...edges.map(e => e.to_node)
    ]);
    
    const isolatedNodes = nodes.filter(node => !connectedNodeIds.has(node.id)).length;
    const reinforcingLinks = edges.filter(e => e.polarity === 1).length;
    const balancingLinks = edges.filter(e => e.polarity === -1).length;
    
    return {
      nodeCount: nodes.length,
      edgeCount: edges.length,
      avgConnections: nodes.length > 0 ? edges.length / nodes.length : 0,
      isolatedNodes,
      reinforcingLinks,
      balancingLinks
    };
  }
}
