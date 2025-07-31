// Six Universal Government Levers Framework
// Based on comprehensive policy taxonomy for systematic intervention design

export interface GovernmentLever {
  id: string;
  name: string;
  description: string;
  domain: string;
  icon: string;
  color: string;
  subLevers: SubLever[];
}

export interface SubLever {
  id: string;
  name: string;
  description: string;
  actionType: string;
  examples: string[];
  leverageAlignment: LeveragePointAlignment[];
  complexity: 'Low' | 'Medium' | 'High';
  timeToImpact: 'Short' | 'Medium' | 'Long';
}

export interface LeveragePointAlignment {
  leveragePointRank: number;
  effectivenessScore: number;
  applicableLoopTypes: ('Reinforcing' | 'Balancing')[];
  rationale: string;
}

export interface LoopLeverageContext {
  loopId: string;
  loopName: string;
  loopType: 'Reinforcing' | 'Balancing';
  leveragePointRank: number;
  leveragePointName: string;
  deBandStatus: 'red' | 'orange' | 'yellow' | 'green';
  recommendedLevers: string[]; // lever IDs
}

// Six Universal Government Levers Data
export const sixUniversalLevers: GovernmentLever[] = [
  {
    id: 'legal-institutional',
    name: 'Legal & Institutional',
    description: 'Laws, regulations, institutional structures, and governance frameworks',
    domain: 'Governance & Structure',
    icon: '⚖️',
    color: 'hsl(var(--accent))',
    subLevers: [
      {
        id: 'legislation',
        name: 'Legislation',
        description: 'Create, amend, or repeal laws and statutes',
        actionType: 'Regulatory',
        examples: [
          'Carbon pricing legislation',
          'Digital privacy laws',
          'Procurement transparency acts'
        ],
        leverageAlignment: [
          {
            leveragePointRank: 2,
            effectivenessScore: 95,
            applicableLoopTypes: ['Reinforcing', 'Balancing'],
            rationale: 'Directly changes system structure and rules'
          },
          {
            leveragePointRank: 3,
            effectivenessScore: 85,
            applicableLoopTypes: ['Balancing'],
            rationale: 'Establishes new power distributions'
          }
        ],
        complexity: 'High',
        timeToImpact: 'Long'
      },
      {
        id: 'regulatory-standards',
        name: 'Regulatory Standards',
        description: 'Set technical standards, compliance requirements, and operational guidelines',
        actionType: 'Standards',
        examples: [
          'Emission standards for vehicles',
          'Building safety codes',
          'Data security protocols'
        ],
        leverageAlignment: [
          {
            leveragePointRank: 4,
            effectivenessScore: 80,
            applicableLoopTypes: ['Balancing'],
            rationale: 'Constrains system behavior within acceptable bounds'
          }
        ],
        complexity: 'Medium',
        timeToImpact: 'Medium'
      },
      {
        id: 'institutional-design',
        name: 'Institutional Design',
        description: 'Create, restructure, or eliminate institutions and agencies',
        actionType: 'Structural',
        examples: [
          'Establish environmental protection agency',
          'Merge overlapping departments',
          'Create independent oversight bodies'
        ],
        leverageAlignment: [
          {
            leveragePointRank: 2,
            effectivenessScore: 90,
            applicableLoopTypes: ['Reinforcing', 'Balancing'],
            rationale: 'Changes fundamental system architecture'
          }
        ],
        complexity: 'High',
        timeToImpact: 'Long'
      }
    ]
  },
  {
    id: 'economic-fiscal',
    name: 'Economic & Fiscal',
    description: 'Financial incentives, disincentives, and resource allocation mechanisms',
    domain: 'Financial & Economic',
    icon: '💰',
    color: 'hsl(var(--primary))',
    subLevers: [
      {
        id: 'taxation',
        name: 'Taxation',
        description: 'Implement taxes, fees, or financial penalties',
        actionType: 'Financial Disincentive',
        examples: [
          'Carbon tax',
          'Congestion pricing',
          'Sugar tax on beverages'
        ],
        leverageAlignment: [
          {
            leveragePointRank: 6,
            effectivenessScore: 75,
            applicableLoopTypes: ['Balancing'],
            rationale: 'Creates negative feedback to discourage unwanted behavior'
          }
        ],
        complexity: 'Medium',
        timeToImpact: 'Short'
      },
      {
        id: 'subsidies-grants',
        name: 'Subsidies & Grants',
        description: 'Provide financial support for desired activities',
        actionType: 'Financial Incentive',
        examples: [
          'Electric vehicle rebates',
          'Green energy subsidies',
          'Small business grants'
        ],
        leverageAlignment: [
          {
            leveragePointRank: 6,
            effectivenessScore: 70,
            applicableLoopTypes: ['Reinforcing'],
            rationale: 'Creates positive feedback to encourage desired behavior'
          }
        ],
        complexity: 'Low',
        timeToImpact: 'Short'
      },
      {
        id: 'market-mechanisms',
        name: 'Market Mechanisms',
        description: 'Create or modify market structures and trading systems',
        actionType: 'Market Design',
        examples: [
          'Cap-and-trade systems',
          'Feed-in tariffs',
          'Prediction markets for policy outcomes'
        ],
        leverageAlignment: [
          {
            leveragePointRank: 5,
            effectivenessScore: 85,
            applicableLoopTypes: ['Reinforcing', 'Balancing'],
            rationale: 'Changes rules governing system flows'
          }
        ],
        complexity: 'High',
        timeToImpact: 'Medium'
      }
    ]
  },
  {
    id: 'information-communications',
    name: 'Information & Communications',
    description: 'Information sharing, transparency, education, and narrative shaping',
    domain: 'Knowledge & Influence',
    icon: '📢',
    color: 'hsl(var(--info))',
    subLevers: [
      {
        id: 'public-education',
        name: 'Public Education',
        description: 'Educate citizens and stakeholders about issues and solutions',
        actionType: 'Knowledge Transfer',
        examples: [
          'Climate change awareness campaigns',
          'Financial literacy programs',
          'Public health education'
        ],
        leverageAlignment: [
          {
            leveragePointRank: 1,
            effectivenessScore: 85,
            applicableLoopTypes: ['Reinforcing', 'Balancing'],
            rationale: 'Changes paradigms and mental models'
          }
        ],
        complexity: 'Medium',
        timeToImpact: 'Long'
      },
      {
        id: 'transparency-disclosure',
        name: 'Transparency & Disclosure',
        description: 'Require or provide access to information',
        actionType: 'Information Access',
        examples: [
          'Corporate carbon footprint reporting',
          'Government spending transparency',
          'Food nutrition labeling'
        ],
        leverageAlignment: [
          {
            leveragePointRank: 7,
            effectivenessScore: 65,
            applicableLoopTypes: ['Balancing'],
            rationale: 'Provides information flows that enable better decision-making'
          }
        ],
        complexity: 'Low',
        timeToImpact: 'Medium'
      },
      {
        id: 'narrative-framing',
        name: 'Narrative & Framing',
        description: 'Shape public discourse and cultural narratives',
        actionType: 'Cultural Influence',
        examples: [
          'Reframe climate action as economic opportunity',
          'Position health as national security issue',
          'Promote civic duty messaging'
        ],
        leverageAlignment: [
          {
            leveragePointRank: 1,
            effectivenessScore: 90,
            applicableLoopTypes: ['Reinforcing', 'Balancing'],
            rationale: 'Transforms fundamental beliefs and worldviews'
          }
        ],
        complexity: 'High',
        timeToImpact: 'Long'
      }
    ]
  },
  {
    id: 'physical-infrastructure',
    name: 'Physical Infrastructure',
    description: 'Built environment, logistics systems, and physical constraints',
    domain: 'Physical Systems',
    icon: '🏗️',
    color: 'hsl(var(--warning))',
    subLevers: [
      {
        id: 'transport-infrastructure',
        name: 'Transport Infrastructure',
        description: 'Build, modify, or remove transportation systems',
        actionType: 'Physical Construction',
        examples: [
          'Bike lane networks',
          'Public transit expansion',
          'Electric vehicle charging stations'
        ],
        leverageAlignment: [
          {
            leveragePointRank: 8,
            effectivenessScore: 70,
            applicableLoopTypes: ['Reinforcing', 'Balancing'],
            rationale: 'Changes physical constraints and flows'
          }
        ],
        complexity: 'High',
        timeToImpact: 'Long'
      },
      {
        id: 'digital-infrastructure',
        name: 'Digital Infrastructure',
        description: 'Build, maintain, or regulate digital systems and networks',
        actionType: 'Digital Construction',
        examples: [
          'Broadband expansion',
          'Digital government services',
          'Smart city sensor networks'
        ],
        leverageAlignment: [
          {
            leveragePointRank: 7,
            effectivenessScore: 75,
            applicableLoopTypes: ['Reinforcing'],
            rationale: 'Enables new information flows and feedback loops'
          }
        ],
        complexity: 'High',
        timeToImpact: 'Medium'
      },
      {
        id: 'space-design',
        name: 'Space & Urban Design',
        description: 'Design physical spaces to influence behavior',
        actionType: 'Environmental Design',
        examples: [
          'Pedestrian-friendly urban design',
          'Green spaces in cities',
          'Nudge architecture in public buildings'
        ],
        leverageAlignment: [
          {
            leveragePointRank: 9,
            effectivenessScore: 60,
            applicableLoopTypes: ['Balancing'],
            rationale: 'Shapes parameters and constraints of system behavior'
          }
        ],
        complexity: 'Medium',
        timeToImpact: 'Long'
      }
    ]
  },
  {
    id: 'social-cultural',
    name: 'Social & Cultural',
    description: 'Social norms, cultural practices, and community engagement',
    domain: 'Social Systems',
    icon: '👥',
    color: 'hsl(var(--success))',
    subLevers: [
      {
        id: 'community-engagement',
        name: 'Community Engagement',
        description: 'Facilitate participation in decision-making and implementation',
        actionType: 'Participatory',
        examples: [
          'Citizen assemblies on climate policy',
          'Participatory budgeting',
          'Community-led renewable energy projects'
        ],
        leverageAlignment: [
          {
            leveragePointRank: 3,
            effectivenessScore: 80,
            applicableLoopTypes: ['Reinforcing', 'Balancing'],
            rationale: 'Redistributes power and enables self-organization'
          }
        ],
        complexity: 'Medium',
        timeToImpact: 'Medium'
      },
      {
        id: 'social-norms',
        name: 'Social Norms',
        description: 'Influence collective behaviors and social expectations',
        actionType: 'Behavioral',
        examples: [
          'Anti-smoking campaigns',
          'Promote recycling as social norm',
          'Normalize sustainable consumption'
        ],
        leverageAlignment: [
          {
            leveragePointRank: 1,
            effectivenessScore: 75,
            applicableLoopTypes: ['Reinforcing'],
            rationale: 'Changes cultural paradigms that drive behavior'
          }
        ],
        complexity: 'High',
        timeToImpact: 'Long'
      },
      {
        id: 'collaboration-networks',
        name: 'Collaboration Networks',
        description: 'Foster connections and partnerships between stakeholders',
        actionType: 'Network Building',
        examples: [
          'Public-private partnerships',
          'Cross-sector climate alliances',
          'Innovation hubs and clusters'
        ],
        leverageAlignment: [
          {
            leveragePointRank: 4,
            effectivenessScore: 70,
            applicableLoopTypes: ['Reinforcing'],
            rationale: 'Changes network structure and information flows'
          }
        ],
        complexity: 'Medium',
        timeToImpact: 'Medium'
      }
    ]
  },
  {
    id: 'technology-innovation',
    name: 'Technology & Innovation',
    description: 'Research, development, deployment, and adoption of new technologies',
    domain: 'Innovation Systems',
    icon: '🔬',
    color: 'hsl(var(--destructive))',
    subLevers: [
      {
        id: 'research-development',
        name: 'Research & Development',
        description: 'Fund and direct scientific research and technological development',
        actionType: 'Innovation Investment',
        examples: [
          'Clean energy research grants',
          'Medical research initiatives',
          'AI safety research programs'
        ],
        leverageAlignment: [
          {
            leveragePointRank: 1,
            effectivenessScore: 95,
            applicableLoopTypes: ['Reinforcing'],
            rationale: 'Creates paradigm shifts through new technologies'
          }
        ],
        complexity: 'High',
        timeToImpact: 'Long'
      },
      {
        id: 'technology-deployment',
        name: 'Technology Deployment',
        description: 'Support large-scale adoption and implementation of technologies',
        actionType: 'Scaling',
        examples: [
          'Smart grid deployment',
          'Digital health system rollout',
          'Autonomous vehicle testing zones'
        ],
        leverageAlignment: [
          {
            leveragePointRank: 8,
            effectivenessScore: 80,
            applicableLoopTypes: ['Reinforcing', 'Balancing'],
            rationale: 'Changes system parameters and material flows'
          }
        ],
        complexity: 'High',
        timeToImpact: 'Medium'
      },
      {
        id: 'innovation-ecosystem',
        name: 'Innovation Ecosystem',
        description: 'Create conditions for innovation and entrepreneurship',
        actionType: 'Ecosystem Building',
        examples: [
          'Startup incubators and accelerators',
          'Regulatory sandboxes',
          'Innovation procurement programs'
        ],
        leverageAlignment: [
          {
            leveragePointRank: 2,
            effectivenessScore: 85,
            applicableLoopTypes: ['Reinforcing'],
            rationale: 'Changes system structure to enable continuous innovation'
          }
        ],
        complexity: 'Medium',
        timeToImpact: 'Medium'
      }
    ]
  }
];

// Helper functions for leverage recommendations
export const getRecommendedLevers = (
  leveragePointRank: number,
  loopType: 'Reinforcing' | 'Balancing'
): GovernmentLever[] => {
  return sixUniversalLevers
    .map(lever => ({
      lever,
      score: Math.max(
        ...lever.subLevers
          .flatMap(subLever => 
            subLever.leverageAlignment
              .filter(alignment => 
                alignment.leveragePointRank === leveragePointRank &&
                alignment.applicableLoopTypes.includes(loopType)
              )
              .map(alignment => alignment.effectivenessScore)
          )
      )
    }))
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(item => item.lever);
};

export const getSubLeversByLever = (leverId: string): SubLever[] => {
  const lever = sixUniversalLevers.find(l => l.id === leverId);
  return lever?.subLevers || [];
};

export const getSubLeverById = (subLeverId: string): SubLever | undefined => {
  for (const lever of sixUniversalLevers) {
    const subLever = lever.subLevers.find(sl => sl.id === subLeverId);
    if (subLever) return subLever;
  }
  return undefined;
};