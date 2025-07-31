import React from 'react';
import { CLDNode, CLDLink, CLDModel, CLDNodeType } from '../../types/cld';
import { LoopArchetype } from './LoopBrowser';

interface ArchetypePattern {
  nodes: Omit<CLDNode, 'id'>[];
  links: Omit<CLDLink, 'id' | 'sourceId' | 'targetId'>[];
  layout: 'circular' | 'linear' | 'hierarchical';
}

const archetypePatterns: Record<string, ArchetypePattern> = {
  'population-development-loop': {
    nodes: [
      { label: 'Population Size', type: 'stock', position: { x: 200, y: 100 }, value: 1000 },
      { label: 'Resource Market Efficiency', type: 'auxiliary', position: { x: 350, y: 150 } },
      { label: 'Economic Growth', type: 'auxiliary', position: { x: 400, y: 250 } },
      { label: 'Social Outcomes', type: 'auxiliary', position: { x: 300, y: 350 } },
      { label: 'Population Characteristics', type: 'auxiliary', position: { x: 150, y: 300 } }
    ],
    links: [
      { polarity: 'positive', strength: 0.8 },
      { polarity: 'positive', strength: 0.7 },
      { polarity: 'positive', strength: 0.6 },
      { polarity: 'positive', strength: 0.8 },
      { polarity: 'positive', strength: 0.7 }
    ],
    layout: 'circular'
  },
  'natural-population-growth': {
    nodes: [
      { label: 'Fertility Rate', type: 'auxiliary', position: { x: 200, y: 100 } },
      { label: 'Population Size', type: 'stock', position: { x: 350, y: 150 }, value: 1000 },
      { label: 'Marriage Rates', type: 'auxiliary', position: { x: 400, y: 250 } },
      { label: 'Birth Rates', type: 'flow', position: { x: 300, y: 350 } },
      { label: 'Age Structure', type: 'auxiliary', position: { x: 150, y: 300 } }
    ],
    links: [
      { polarity: 'positive', strength: 0.9 },
      { polarity: 'positive', strength: 0.8 },
      { polarity: 'positive', strength: 0.7 },
      { polarity: 'positive', strength: 0.8, delay: 1 },
      { polarity: 'positive', strength: 0.6 }
    ],
    layout: 'circular'
  },
  'population-resource-market': {
    nodes: [
      { label: 'Population Growth', type: 'auxiliary', position: { x: 200, y: 100 } },
      { label: 'Resource Market', type: 'auxiliary', position: { x: 350, y: 150 } },
      { label: 'Capital Structure', type: 'stock', position: { x: 400, y: 250 }, value: 500 },
      { label: 'Economic Stability', type: 'auxiliary', position: { x: 300, y: 350 } },
      { label: 'Infrastructure Investment', type: 'flow', position: { x: 150, y: 300 } }
    ],
    links: [
      { polarity: 'positive', strength: 0.8 },
      { polarity: 'positive', strength: 0.7 },
      { polarity: 'positive', strength: 0.6 },
      { polarity: 'positive', strength: 0.8, delay: 2 },
      { polarity: 'positive', strength: 0.7 }
    ],
    layout: 'circular'
  },
  'economic-population-growth': {
    nodes: [
      { label: 'Economic Model', type: 'auxiliary', position: { x: 200, y: 100 } },
      { label: 'Labor Demand', type: 'auxiliary', position: { x: 350, y: 150 } },
      { label: 'Population Composition', type: 'auxiliary', position: { x: 400, y: 250 } },
      { label: 'Migration', type: 'flow', position: { x: 300, y: 350 } },
      { label: 'External Labor', type: 'stock', position: { x: 150, y: 300 }, value: 200 }
    ],
    links: [
      { polarity: 'positive', strength: 0.8 },
      { polarity: 'positive', strength: 0.9 },
      { polarity: 'positive', strength: 0.7 },
      { polarity: 'positive', strength: 0.6, delay: 1 },
      { polarity: 'positive', strength: 0.8 }
    ],
    layout: 'circular'
  },
  'environmental-quality-loop': {
    nodes: [
      { label: 'Environmental Quality', type: 'stock', position: { x: 200, y: 100 }, value: 100 },
      { label: 'Economic Growth', type: 'auxiliary', position: { x: 350, y: 150 } },
      { label: 'Health Outcomes', type: 'auxiliary', position: { x: 400, y: 250 } },
      { label: 'Population Characteristics', type: 'auxiliary', position: { x: 300, y: 350 } },
      { label: 'Resource Demand', type: 'auxiliary', position: { x: 150, y: 300 } }
    ],
    links: [
      { polarity: 'negative', strength: 0.8 },
      { polarity: 'negative', strength: 0.7, delay: 2 },
      { polarity: 'negative', strength: 0.6 },
      { polarity: 'negative', strength: 0.8 },
      { polarity: 'negative', strength: 0.7 }
    ],
    layout: 'circular'
  },
  'production-process-loop': {
    nodes: [
      { label: 'Market Demand', type: 'auxiliary', position: { x: 200, y: 100 } },
      { label: 'Labor Resources', type: 'stock', position: { x: 350, y: 150 }, value: 1000 },
      { label: 'Income', type: 'flow', position: { x: 400, y: 250 } },
      { label: 'Purchasing Power', type: 'auxiliary', position: { x: 300, y: 350 } },
      { label: 'Production Output', type: 'auxiliary', position: { x: 150, y: 300 } }
    ],
    links: [
      { polarity: 'positive', strength: 0.9 },
      { polarity: 'positive', strength: 0.8 },
      { polarity: 'positive', strength: 0.7 },
      { polarity: 'positive', strength: 0.8 },
      { polarity: 'positive', strength: 0.6 }
    ],
    layout: 'circular'
  },
  'economic-stability-loop': {
    nodes: [
      { label: 'Population Size', type: 'stock', position: { x: 200, y: 100 }, value: 1000 },
      { label: 'Market Demand', type: 'auxiliary', position: { x: 350, y: 150 } },
      { label: 'Economic Growth', type: 'auxiliary', position: { x: 400, y: 250 } },
      { label: 'Market Stability', type: 'auxiliary', position: { x: 300, y: 350 } },
      { label: 'Resource Efficiency', type: 'auxiliary', position: { x: 150, y: 300 } }
    ],
    links: [
      { polarity: 'positive', strength: 0.8 },
      { polarity: 'positive', strength: 0.7 },
      { polarity: 'positive', strength: 0.6 },
      { polarity: 'positive', strength: 0.8 },
      { polarity: 'positive', strength: 0.7 }
    ],
    layout: 'circular'
  },
  'global-influence-loop': {
    nodes: [
      { label: 'Global Trade', type: 'auxiliary', position: { x: 200, y: 100 } },
      { label: 'International Policies', type: 'auxiliary', position: { x: 350, y: 150 } },
      { label: 'Resource Prices', type: 'auxiliary', position: { x: 400, y: 250 } },
      { label: 'Local Development', type: 'auxiliary', position: { x: 300, y: 350 } },
      { label: 'Economic Stability', type: 'auxiliary', position: { x: 150, y: 300 } }
    ],
    links: [
      { polarity: 'positive', strength: 0.7 },
      { polarity: 'positive', strength: 0.6 },
      { polarity: 'negative', strength: 0.8, delay: 1 },
      { polarity: 'positive', strength: 0.7 },
      { polarity: 'negative', strength: 0.6 }
    ],
    layout: 'circular'
  },
  'social-outcomes-loop': {
    nodes: [
      { label: 'Social Outcomes', type: 'auxiliary', position: { x: 200, y: 100 } },
      { label: 'Education', type: 'auxiliary', position: { x: 350, y: 150 } },
      { label: 'Healthcare', type: 'auxiliary', position: { x: 400, y: 250 } },
      { label: 'Population Characteristics', type: 'auxiliary', position: { x: 300, y: 350 } },
      { label: 'Market Stability', type: 'auxiliary', position: { x: 150, y: 300 } }
    ],
    links: [
      { polarity: 'positive', strength: 0.8 },
      { polarity: 'positive', strength: 0.7 },
      { polarity: 'positive', strength: 0.8 },
      { polarity: 'positive', strength: 0.6, delay: 2 },
      { polarity: 'positive', strength: 0.7 }
    ],
    layout: 'circular'
  },
  'migration-economic-opportunities': {
    nodes: [
      { label: 'Migration Patterns', type: 'flow', position: { x: 200, y: 100 } },
      { label: 'Economic Opportunities', type: 'auxiliary', position: { x: 350, y: 150 } },
      { label: 'Labor Market', type: 'auxiliary', position: { x: 400, y: 250 } },
      { label: 'Economic Efficiency', type: 'auxiliary', position: { x: 300, y: 350 } },
      { label: 'Workforce Composition', type: 'auxiliary', position: { x: 150, y: 300 } }
    ],
    links: [
      { polarity: 'positive', strength: 0.9 },
      { polarity: 'positive', strength: 0.8 },
      { polarity: 'positive', strength: 0.7 },
      { polarity: 'positive', strength: 0.6 },
      { polarity: 'positive', strength: 0.8, delay: 1 }
    ],
    layout: 'circular'
  },
  'social-structure-loop': {
    nodes: [
      { label: 'Social Outcomes', type: 'auxiliary', position: { x: 200, y: 100 } },
      { label: 'Social Phenomena', type: 'auxiliary', position: { x: 350, y: 150 } },
      { label: 'Nuptiality', type: 'auxiliary', position: { x: 400, y: 250 } },
      { label: 'Population Growth', type: 'auxiliary', position: { x: 300, y: 350 } },
      { label: 'Cultural Changes', type: 'auxiliary', position: { x: 150, y: 300 } }
    ],
    links: [
      { polarity: 'positive', strength: 0.7 },
      { polarity: 'positive', strength: 0.6, delay: 1 },
      { polarity: 'positive', strength: 0.8 },
      { polarity: 'positive', strength: 0.7 },
      { polarity: 'positive', strength: 0.5, delay: 2 }
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