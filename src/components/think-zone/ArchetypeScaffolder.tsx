import React from 'react';
import { CLDNode, CLDLink, CLDModel, CLDNodeType } from '../../types/cld';
import { LoopArchetype } from './LoopBrowser';

interface ArchetypePattern {
  nodes: Omit<CLDNode, 'id'>[];
  links: Omit<CLDLink, 'id' | 'sourceId' | 'targetId'>[];
  layout: 'circular' | 'linear' | 'hierarchical';
}

const archetypePatterns: Record<string, ArchetypePattern> = {
  'limits-to-growth': {
    nodes: [
      { label: 'Population', type: 'stock', position: { x: 200, y: 100 }, value: 1000 },
      { label: 'Birth Rate', type: 'flow', position: { x: 100, y: 100 } },
      { label: 'Resource Consumption', type: 'auxiliary', position: { x: 300, y: 200 } },
      { label: 'Available Resources', type: 'stock', position: { x: 400, y: 300 }, value: 5000 },
      { label: 'Carrying Capacity', type: 'auxiliary', position: { x: 300, y: 400 } },
      { label: 'Death Rate', type: 'flow', position: { x: 300, y: 100 } }
    ],
    links: [
      { polarity: 'positive', strength: 0.8 },
      { polarity: 'positive', strength: 0.7 },
      { polarity: 'negative', strength: 0.6 },
      { polarity: 'negative', strength: 0.9, delay: 2 },
      { polarity: 'positive', strength: 0.5 },
      { polarity: 'negative', strength: 0.8 }
    ],
    layout: 'circular'
  },
  'fixes-that-fail': {
    nodes: [
      { label: 'Problem Symptom', type: 'auxiliary', position: { x: 200, y: 100 } },
      { label: 'Quick Fix', type: 'flow', position: { x: 100, y: 200 } },
      { label: 'Fundamental Solution', type: 'auxiliary', position: { x: 300, y: 200 } },
      { label: 'Capability for Fundamental Solution', type: 'stock', position: { x: 400, y: 300 }, value: 50 },
      { label: 'Unintended Consequences', type: 'auxiliary', position: { x: 100, y: 300 } }
    ],
    links: [
      { polarity: 'negative', strength: 0.8 },
      { polarity: 'negative', strength: 0.6, delay: 1 },
      { polarity: 'positive', strength: 0.7 },
      { polarity: 'positive', strength: 0.9, delay: 3 },
      { polarity: 'negative', strength: 0.5 }
    ],
    layout: 'circular'
  },
  'tragedy-of-commons': {
    nodes: [
      { label: 'Individual Use', type: 'flow', position: { x: 150, y: 100 } },
      { label: 'Total Use', type: 'auxiliary', position: { x: 300, y: 100 } },
      { label: 'Resource Quality', type: 'stock', position: { x: 400, y: 200 }, value: 100 },
      { label: 'Individual Benefit', type: 'auxiliary', position: { x: 200, y: 300 } },
      { label: 'Pressure to Use More', type: 'auxiliary', position: { x: 100, y: 200 } }
    ],
    links: [
      { polarity: 'positive', strength: 0.9 },
      { polarity: 'negative', strength: 0.8, delay: 2 },
      { polarity: 'positive', strength: 0.7 },
      { polarity: 'positive', strength: 0.6 },
      { polarity: 'negative', strength: 0.5, delay: 1 }
    ],
    layout: 'circular'
  },
  'success-to-successful': {
    nodes: [
      { label: 'Performance', type: 'auxiliary', position: { x: 200, y: 100 } },
      { label: 'Resources Allocated', type: 'flow', position: { x: 350, y: 150 } },
      { label: 'Capability', type: 'stock', position: { x: 400, y: 250 }, value: 75 },
      { label: 'Investment Priority', type: 'auxiliary', position: { x: 200, y: 300 } }
    ],
    links: [
      { polarity: 'positive', strength: 0.9 },
      { polarity: 'positive', strength: 0.8 },
      { polarity: 'positive', strength: 0.7, delay: 1 },
      { polarity: 'positive', strength: 0.8 }
    ],
    layout: 'circular'
  },
  'growth-underinvestment': {
    nodes: [
      { label: 'Demand', type: 'auxiliary', position: { x: 150, y: 100 } },
      { label: 'Performance Standard', type: 'auxiliary', position: { x: 300, y: 100 } },
      { label: 'Capacity', type: 'stock', position: { x: 400, y: 200 }, value: 200 },
      { label: 'Performance', type: 'auxiliary', position: { x: 300, y: 300 } },
      { label: 'Investment in Capacity', type: 'flow', position: { x: 150, y: 250 } }
    ],
    links: [
      { polarity: 'positive', strength: 0.8 },
      { polarity: 'positive', strength: 0.7 },
      { polarity: 'negative', strength: 0.9, delay: 1 },
      { polarity: 'positive', strength: 0.6, delay: 2 },
      { polarity: 'negative', strength: 0.5 }
    ],
    layout: 'circular'
  }
};

export class ArchetypeScaffolder {
  static generateModel(archetype: LoopArchetype): CLDModel {
    const pattern = archetypePatterns[archetype.id];
    if (!pattern) {
      throw new Error(`No pattern found for archetype: ${archetype.id}`);
    }

    // Generate unique IDs for nodes and links
    const nodeIds = pattern.nodes.map((_, index) => `node-${archetype.id}-${index}`);
    const linkIds = pattern.links.map((_, index) => `link-${archetype.id}-${index}`);

    // Create nodes with generated IDs
    const nodes: CLDNode[] = pattern.nodes.map((node, index) => ({
      id: nodeIds[index],
      ...node,
      color: this.getNodeColor(node.type),
      category: archetype.category,
      metadata: {
        archetypeId: archetype.id,
        archetypeName: archetype.name,
        isTemplate: true
      }
    }));

    // Create links with generated IDs and proper source/target references
    const links: CLDLink[] = pattern.links.map((link, index) => {
      const sourceIndex = index;
      const targetIndex = (index + 1) % nodes.length; // Connect in sequence, last to first
      
      return {
        id: linkIds[index],
        sourceId: nodeIds[sourceIndex],
        targetId: nodeIds[targetIndex],
        ...link,
        lineType: 'curved',
        metadata: {
          archetypeId: archetype.id,
          isTemplate: true
        }
      };
    });

    // Apply layout adjustments
    const adjustedNodes = this.applyLayout(nodes, pattern.layout);

    return {
      id: `model-${archetype.id}-${Date.now()}`,
      name: `${archetype.name} Model`,
      description: `Auto-generated causal loop model based on ${archetype.name} archetype`,
      nodes: adjustedNodes,
      links,
      metadata: {
        archetypeId: archetype.id,
        archetypeName: archetype.name,
        isFromTemplate: true,
        createdAt: new Date().toISOString()
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  private static getNodeColor(type: CLDNodeType): string {
    const colors = {
      stock: 'hsl(var(--primary))',
      flow: 'hsl(var(--secondary))',
      auxiliary: 'hsl(var(--accent))',
      constant: 'hsl(var(--muted))'
    };
    return colors[type];
  }

  private static applyLayout(nodes: CLDNode[], layout: 'circular' | 'linear' | 'hierarchical'): CLDNode[] {
    const nodeCount = nodes.length;
    const centerX = 400;
    const centerY = 300;
    const radius = 120;

    return nodes.map((node, index) => {
      let position = node.position;

      switch (layout) {
        case 'circular':
          const angle = (2 * Math.PI * index) / nodeCount;
          position = {
            x: centerX + radius * Math.cos(angle),
            y: centerY + radius * Math.sin(angle)
          };
          break;
        case 'linear':
          position = {
            x: 100 + (index * 150),
            y: centerY
          };
          break;
        case 'hierarchical':
          const level = Math.floor(index / 3);
          const positionInLevel = index % 3;
          position = {
            x: 200 + (positionInLevel * 200),
            y: 100 + (level * 150)
          };
          break;
      }

      return { ...node, position };
    });
  }

  static getAvailableVariables(archetypeId: string): string[] {
    const archetype = archetypePatterns[archetypeId];
    return archetype ? archetype.nodes.map(node => node.label) : [];
  }

  static getTypicalDelays(archetypeId: string): Array<{ from: string; to: string; delay: number }> {
    const archetype = archetypePatterns[archetypeId];
    if (!archetype) return [];

    return archetype.links
      .map((link, index) => ({
        from: archetype.nodes[index]?.label || '',
        to: archetype.nodes[(index + 1) % archetype.nodes.length]?.label || '',
        delay: link.delay || 0
      }))
      .filter(item => item.delay > 0);
  }
}