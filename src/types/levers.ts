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
  complexity: 'Low' | 'Medium' | 'High' | 'Very High';
  timeToImpact: 'Immediate' | 'Short-term' | 'Medium-term' | 'Long-term';
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
    description: 'Define the foundational rules, powers, and structures of governance',
    domain: 'Governance',
    icon: '⚖️',
    color: 'hsl(var(--accent))',
    subLevers: [
      {
        id: 'legislation',
        name: 'Legislation',
        description: 'Enacting primary laws to define obligations, rights, and social or economic rules',
        actionType: 'Regulatory',
        examples: ['Civil rights laws', 'Taxation codes', 'Environmental statutes'],
        leverageAlignment: [
          {
            leveragePointRank: 1,
            effectivenessScore: 9,
            applicableLoopTypes: ['Reinforcing', 'Balancing'],
            rationale: 'Changes fundamental system paradigms'
          },
          {
            leveragePointRank: 2,
            effectivenessScore: 8,
            applicableLoopTypes: ['Reinforcing', 'Balancing'],
            rationale: 'Establishes system structure'
          }
        ],
        complexity: 'High',
        timeToImpact: 'Long-term'
      },
      {
        id: 'regulation',
        name: 'Regulation',
        description: 'Issuing secondary, often technical rules to operationalize laws through agencies',
        actionType: 'Operational',
        examples: ['Emissions caps by environmental authority', 'Safety standards', 'Quality controls'],
        leverageAlignment: [
          {
            leveragePointRank: 3,
            effectivenessScore: 7,
            applicableLoopTypes: ['Reinforcing', 'Balancing'],
            rationale: 'Shapes power distribution'
          },
          {
            leveragePointRank: 4,
            effectivenessScore: 6,
            applicableLoopTypes: ['Balancing'],
            rationale: 'Controls system rules'
          }
        ],
        complexity: 'Medium',
        timeToImpact: 'Medium-term'
      },
      {
        id: 'constitutional-rule-setting',
        name: 'Constitutional Rule-Setting',
        description: 'Designing or amending the basic legal framework that defines institutional power and citizen rights',
        actionType: 'Structural',
        examples: ['Amending term limits', 'Decentralizing authority', 'Constitutional conventions'],
        leverageAlignment: [
          {
            leveragePointRank: 1,
            effectivenessScore: 10,
            applicableLoopTypes: ['Reinforcing', 'Balancing'],
            rationale: 'Changes system paradigms'
          },
          {
            leveragePointRank: 2,
            effectivenessScore: 9,
            applicableLoopTypes: ['Reinforcing'],
            rationale: 'Restructures system power'
          }
        ],
        complexity: 'Very High',
        timeToImpact: 'Long-term'
      },
      {
        id: 'judicial-interpretation',
        name: 'Judicial Interpretation',
        description: 'Courts interpreting and applying laws, resolving ambiguities, and setting precedents',
        actionType: 'Interpretive',
        examples: ['Supreme Court rulings', 'Precedent setting', 'Legal clarifications'],
        leverageAlignment: [
          {
            leveragePointRank: 2,
            effectivenessScore: 8,
            applicableLoopTypes: ['Reinforcing', 'Balancing'],
            rationale: 'Interprets system structure'
          },
          {
            leveragePointRank: 3,
            effectivenessScore: 7,
            applicableLoopTypes: ['Balancing'],
            rationale: 'Shapes power distribution'
          }
        ],
        complexity: 'High',
        timeToImpact: 'Medium-term'
      },
      {
        id: 'electoral-system-design',
        name: 'Electoral System Design',
        description: 'Structuring how representatives are elected and how political accountability functions',
        actionType: 'Structural',
        examples: ['Proportional representation', 'Ranked-choice voting', 'Campaign finance reform'],
        leverageAlignment: [
          {
            leveragePointRank: 1,
            effectivenessScore: 9,
            applicableLoopTypes: ['Reinforcing', 'Balancing'],
            rationale: 'Changes system paradigms'
          },
          {
            leveragePointRank: 2,
            effectivenessScore: 8,
            applicableLoopTypes: ['Reinforcing'],
            rationale: 'Restructures power distribution'
          }
        ],
        complexity: 'High',
        timeToImpact: 'Long-term'
      }
    ]
  },
  {
    id: 'economic-fiscal',
    name: 'Economic & Fiscal',
    description: 'Manage public resources, shape market behavior, and drive economic outcomes',
    domain: 'Economics',
    icon: '💰',
    color: 'hsl(var(--primary))',
    subLevers: [
      {
        id: 'taxation-revenue',
        name: 'Taxation & Revenue Collection',
        description: 'Generating income through direct and indirect taxes',
        actionType: 'Financial',
        examples: ['Progressive income tax', 'VAT', 'Corporate tax'],
        leverageAlignment: [
          {
            leveragePointRank: 5,
            effectivenessScore: 6,
            applicableLoopTypes: ['Reinforcing', 'Balancing'],
            rationale: 'Creates financial feedback loops'
          },
          {
            leveragePointRank: 6,
            effectivenessScore: 5,
            applicableLoopTypes: ['Balancing'],
            rationale: 'Controls system flows'
          }
        ],
        complexity: 'Medium',
        timeToImpact: 'Short-term'
      },
      {
        id: 'public-expenditure',
        name: 'Public Expenditure Allocation',
        description: 'Disbursing government funds for services, infrastructure, or transfer payments',
        actionType: 'Financial',
        examples: ['Education funding', 'Defense spending', 'Healthcare allocation'],
        leverageAlignment: [
          {
            leveragePointRank: 6,
            effectivenessScore: 6,
            applicableLoopTypes: ['Reinforcing', 'Balancing'],
            rationale: 'Directs resource flows'
          },
          {
            leveragePointRank: 7,
            effectivenessScore: 5,
            applicableLoopTypes: ['Balancing'],
            rationale: 'Influences system parameters'
          }
        ],
        complexity: 'Medium',
        timeToImpact: 'Medium-term'
      },
      {
        id: 'market-incentivization',
        name: 'Market Incentivization',
        description: 'Influencing private behavior through subsidies, grants, or disincentives',
        actionType: 'Incentive',
        examples: ['Electric vehicle rebates', 'Carbon taxes', 'R&D grants'],
        leverageAlignment: [
          {
            leveragePointRank: 7,
            effectivenessScore: 5,
            applicableLoopTypes: ['Reinforcing', 'Balancing'],
            rationale: 'Creates behavioral incentives'
          },
          {
            leveragePointRank: 8,
            effectivenessScore: 4,
            applicableLoopTypes: ['Balancing'],
            rationale: 'Adjusts system parameters'
          }
        ],
        complexity: 'Medium',
        timeToImpact: 'Medium-term'
      },
      {
        id: 'monetary-influence',
        name: 'Monetary Influence',
        description: 'Adjusting interest rates and liquidity via central banks to stabilize or stimulate the economy',
        actionType: 'Financial',
        examples: ['Interest rate adjustments', 'Quantitative easing', 'Reserve requirements'],
        leverageAlignment: [
          {
            leveragePointRank: 8,
            effectivenessScore: 4,
            applicableLoopTypes: ['Reinforcing', 'Balancing'],
            rationale: 'Controls monetary flows'
          },
          {
            leveragePointRank: 9,
            effectivenessScore: 3,
            applicableLoopTypes: ['Balancing'],
            rationale: 'Influences system parameters'
          }
        ],
        complexity: 'High',
        timeToImpact: 'Short-term'
      },
      {
        id: 'public-asset-deployment',
        name: 'Public Asset Deployment',
        description: 'Leveraging land, sovereign wealth funds, or natural resources for economic purposes',
        actionType: 'Asset',
        examples: ['State property for housing', 'Sovereign wealth investment', 'Natural resource licensing'],
        leverageAlignment: [
          {
            leveragePointRank: 9,
            effectivenessScore: 3,
            applicableLoopTypes: ['Reinforcing', 'Balancing'],
            rationale: 'Deploys public assets'
          },
          {
            leveragePointRank: 10,
            effectivenessScore: 2,
            applicableLoopTypes: ['Balancing'],
            rationale: 'Modifies system parameters'
          }
        ],
        complexity: 'Medium',
        timeToImpact: 'Medium-term'
      }
    ]
  },
  {
    id: 'administrative-executive',
    name: 'Administrative & Executive',
    description: 'Translate policy into action through implementation, enforcement, and delivery',
    domain: 'Implementation',
    icon: '⚙️',
    color: 'hsl(var(--warning))',
    subLevers: [
      {
        id: 'service-delivery',
        name: 'Service Delivery',
        description: 'Providing direct public services such as health, education, transportation, and welfare',
        actionType: 'Operational',
        examples: ['Running hospitals', 'Operating schools', 'Public transportation'],
        leverageAlignment: [
          {
            leveragePointRank: 10,
            effectivenessScore: 3,
            applicableLoopTypes: ['Reinforcing', 'Balancing'],
            rationale: 'Delivers system outputs'
          },
          {
            leveragePointRank: 11,
            effectivenessScore: 2,
            applicableLoopTypes: ['Balancing'],
            rationale: 'Implements system functions'
          }
        ],
        complexity: 'Medium',
        timeToImpact: 'Medium-term'
      },
      {
        id: 'policy-implementation',
        name: 'Policy Implementation',
        description: 'Turning laws into functioning programs through administrative planning and coordination',
        actionType: 'Operational',
        examples: ['Universal basic income rollout', 'Healthcare reform implementation', 'Education policy execution'],
        leverageAlignment: [
          {
            leveragePointRank: 9,
            effectivenessScore: 4,
            applicableLoopTypes: ['Reinforcing', 'Balancing'],
            rationale: 'Executes system changes'
          },
          {
            leveragePointRank: 10,
            effectivenessScore: 3,
            applicableLoopTypes: ['Balancing'],
            rationale: 'Implements system operations'
          }
        ],
        complexity: 'High',
        timeToImpact: 'Medium-term'
      },
      {
        id: 'enforcement-compliance',
        name: 'Enforcement & Compliance Monitoring',
        description: 'Ensuring individuals and organizations follow rules through audits, fines, and policing',
        actionType: 'Enforcement',
        examples: ['Labor inspections', 'Environmental audits', 'Tax compliance monitoring'],
        leverageAlignment: [
          {
            leveragePointRank: 11,
            effectivenessScore: 2,
            applicableLoopTypes: ['Reinforcing', 'Balancing'],
            rationale: 'Enforces system rules'
          },
          {
            leveragePointRank: 12,
            effectivenessScore: 1,
            applicableLoopTypes: ['Balancing'],
            rationale: 'Maintains system parameters'
          }
        ],
        complexity: 'Medium',
        timeToImpact: 'Short-term'
      },
      {
        id: 'infrastructure-deployment',
        name: 'Infrastructure Deployment',
        description: 'Building or maintaining physical and digital infrastructure for public benefit',
        actionType: 'Infrastructure',
        examples: ['Road construction', 'Power grid expansion', 'Broadband infrastructure'],
        leverageAlignment: [
          {
            leveragePointRank: 8,
            effectivenessScore: 4,
            applicableLoopTypes: ['Reinforcing', 'Balancing'],
            rationale: 'Creates system infrastructure'
          },
          {
            leveragePointRank: 9,
            effectivenessScore: 3,
            applicableLoopTypes: ['Balancing'],
            rationale: 'Establishes system parameters'
          }
        ],
        complexity: 'High',
        timeToImpact: 'Long-term'
      },
      {
        id: 'crisis-response',
        name: 'Crisis Response Activation',
        description: 'Managing emergency response systems during disasters, pandemics, or security events',
        actionType: 'Emergency',
        examples: ['Earthquake response', 'COVID task forces', 'Emergency management'],
        leverageAlignment: [
          {
            leveragePointRank: 12,
            effectivenessScore: 1,
            applicableLoopTypes: ['Reinforcing', 'Balancing'],
            rationale: 'Manages system disruptions'
          },
          {
            leveragePointRank: 11,
            effectivenessScore: 2,
            applicableLoopTypes: ['Balancing'],
            rationale: 'Responds to system events'
          }
        ],
        complexity: 'High',
        timeToImpact: 'Immediate'
      },
      {
        id: 'operational-data-collection',
        name: 'Operational Data Collection',
        description: 'Gathering administrative data to monitor performance, adjust policies, or detect problems',
        actionType: 'Monitoring',
        examples: ['Hospital bed tracking', 'Performance monitoring', 'Administrative analytics'],
        leverageAlignment: [
          {
            leveragePointRank: 12,
            effectivenessScore: 1,
            applicableLoopTypes: ['Reinforcing', 'Balancing'],
            rationale: 'Monitors system performance'
          },
          {
            leveragePointRank: 11,
            effectivenessScore: 2,
            applicableLoopTypes: ['Balancing'],
            rationale: 'Provides system feedback'
          }
        ],
        complexity: 'Medium',
        timeToImpact: 'Short-term'
      }
    ]
  },
  {
    id: 'communicative-normative',
    name: 'Communicative & Normative',
    description: 'Shape beliefs, behaviors, social norms, and collective identity',
    domain: 'Communication',
    icon: '📢',
    color: 'hsl(var(--info))',
    subLevers: [
      {
        id: 'public-communication',
        name: 'Public Communication Campaigning',
        description: 'Promoting messages to influence public behavior or opinion',
        actionType: 'Communicative',
        examples: ['Anti-smoking campaigns', 'Vaccination drives', 'Public health messaging'],
        leverageAlignment: [
          {
            leveragePointRank: 10,
            effectivenessScore: 3,
            applicableLoopTypes: ['Reinforcing', 'Balancing'],
            rationale: 'Influences public behavior'
          },
          {
            leveragePointRank: 11,
            effectivenessScore: 2,
            applicableLoopTypes: ['Balancing'],
            rationale: 'Shapes system information flows'
          }
        ],
        complexity: 'Low',
        timeToImpact: 'Short-term'
      },
      {
        id: 'curriculum-symbol-design',
        name: 'Curriculum & Symbol Design',
        description: 'Defining educational content, national holidays, monuments, and symbols',
        actionType: 'Cultural',
        examples: ['National history curriculum', 'Civic education', 'National monuments'],
        leverageAlignment: [
          {
            leveragePointRank: 3,
            effectivenessScore: 7,
            applicableLoopTypes: ['Reinforcing', 'Balancing'],
            rationale: 'Shapes cultural paradigms'
          },
          {
            leveragePointRank: 4,
            effectivenessScore: 6,
            applicableLoopTypes: ['Reinforcing'],
            rationale: 'Influences system beliefs'
          }
        ],
        complexity: 'Medium',
        timeToImpact: 'Long-term'
      },
      {
        id: 'narrative-framing',
        name: 'Narrative Framing',
        description: 'Crafting narratives that provide meaning to laws, crises, or reforms',
        actionType: 'Narrative',
        examples: ['Climate policy as intergenerational justice', 'Economic reform messaging', 'Crisis communication'],
        leverageAlignment: [
          {
            leveragePointRank: 4,
            effectivenessScore: 6,
            applicableLoopTypes: ['Reinforcing', 'Balancing'],
            rationale: 'Frames system understanding'
          },
          {
            leveragePointRank: 5,
            effectivenessScore: 5,
            applicableLoopTypes: ['Reinforcing'],
            rationale: 'Shapes system narrative'
          }
        ],
        complexity: 'Medium',
        timeToImpact: 'Medium-term'
      },
      {
        id: 'information-disclosure',
        name: 'Information Disclosure',
        description: 'Publishing data, government plans, or decisions to increase transparency and accountability',
        actionType: 'Transparency',
        examples: ['Budget transparency portals', 'FOIA regimes', 'Open data initiatives'],
        leverageAlignment: [
          {
            leveragePointRank: 11,
            effectivenessScore: 2,
            applicableLoopTypes: ['Reinforcing', 'Balancing'],
            rationale: 'Increases system transparency'
          },
          {
            leveragePointRank: 12,
            effectivenessScore: 1,
            applicableLoopTypes: ['Balancing'],
            rationale: 'Provides system information'
          }
        ],
        complexity: 'Low',
        timeToImpact: 'Short-term'
      },
      {
        id: 'soft-power-messaging',
        name: 'Soft Power Messaging',
        description: 'Projecting values internationally through culture, media, or public diplomacy',
        actionType: 'Diplomatic',
        examples: ['Cultural festivals abroad', 'International media outlets', 'Cultural exchange programs'],
        leverageAlignment: [
          {
            leveragePointRank: 9,
            effectivenessScore: 3,
            applicableLoopTypes: ['Reinforcing', 'Balancing'],
            rationale: 'Projects system values'
          },
          {
            leveragePointRank: 10,
            effectivenessScore: 2,
            applicableLoopTypes: ['Balancing'],
            rationale: 'Influences external perceptions'
          }
        ],
        complexity: 'Medium',
        timeToImpact: 'Long-term'
      }
    ]
  },
  {
    id: 'behavioral-social',
    name: 'Behavioral & Social',
    description: 'Influence individual decisions and collective behavior without direct coercion',
    domain: 'Behavioral',
    icon: '👥',
    color: 'hsl(var(--success))',
    subLevers: [
      {
        id: 'behavioral-design',
        name: 'Behavioral Design (Nudging)',
        description: 'Structuring choice environments to guide decisions without restricting freedom',
        actionType: 'Behavioral',
        examples: ['Organ donation opt-out systems', 'Energy use comparisons', 'Choice architecture'],
        leverageAlignment: [
          {
            leveragePointRank: 7,
            effectivenessScore: 5,
            applicableLoopTypes: ['Reinforcing', 'Balancing'],
            rationale: 'Influences decision-making'
          },
          {
            leveragePointRank: 8,
            effectivenessScore: 4,
            applicableLoopTypes: ['Balancing'],
            rationale: 'Shapes behavioral parameters'
          }
        ],
        complexity: 'Medium',
        timeToImpact: 'Short-term'
      },
      {
        id: 'default-settings',
        name: 'Default Settings & Opt-Outs',
        description: 'Using pre-selected defaults to steer user behavior',
        actionType: 'Design',
        examples: ['Automatic retirement enrollment', 'Default privacy settings', 'Opt-out systems'],
        leverageAlignment: [
          {
            leveragePointRank: 8,
            effectivenessScore: 4,
            applicableLoopTypes: ['Reinforcing', 'Balancing'],
            rationale: 'Sets behavioral defaults'
          },
          {
            leveragePointRank: 9,
            effectivenessScore: 3,
            applicableLoopTypes: ['Balancing'],
            rationale: 'Configures system parameters'
          }
        ],
        complexity: 'Low',
        timeToImpact: 'Immediate'
      },
      {
        id: 'social-protection-structuring',
        name: 'Social Protection Structuring',
        description: 'Designing programs that not only protect, but also encourage certain life choices',
        actionType: 'Social',
        examples: ['Conditional cash transfers', 'Education incentives', 'Healthcare conditionality'],
        leverageAlignment: [
          {
            leveragePointRank: 6,
            effectivenessScore: 6,
            applicableLoopTypes: ['Reinforcing', 'Balancing'],
            rationale: 'Creates social incentives'
          },
          {
            leveragePointRank: 7,
            effectivenessScore: 5,
            applicableLoopTypes: ['Balancing'],
            rationale: 'Structures social flows'
          }
        ],
        complexity: 'Medium',
        timeToImpact: 'Medium-term'
      },
      {
        id: 'participatory-channels',
        name: 'Participatory Channel Creation',
        description: 'Enabling public input in policy or budgeting decisions',
        actionType: 'Participatory',
        examples: ['Participatory budgeting', 'Citizen juries', 'Public consultations'],
        leverageAlignment: [
          {
            leveragePointRank: 5,
            effectivenessScore: 6,
            applicableLoopTypes: ['Reinforcing', 'Balancing'],
            rationale: 'Enables public participation'
          },
          {
            leveragePointRank: 6,
            effectivenessScore: 5,
            applicableLoopTypes: ['Balancing'],
            rationale: 'Creates participatory flows'
          }
        ],
        complexity: 'Medium',
        timeToImpact: 'Medium-term'
      },
      {
        id: 'recognition-identity',
        name: 'Recognition & Identity Policy',
        description: 'Formally recognizing marginalized or identity groups to foster inclusion',
        actionType: 'Recognition',
        examples: ['Indigenous status recognition', 'Same-sex partnership recognition', 'Minority rights'],
        leverageAlignment: [
          {
            leveragePointRank: 4,
            effectivenessScore: 6,
            applicableLoopTypes: ['Reinforcing', 'Balancing'],
            rationale: 'Recognizes group identities'
          },
          {
            leveragePointRank: 5,
            effectivenessScore: 5,
            applicableLoopTypes: ['Reinforcing'],
            rationale: 'Shapes social power dynamics'
          }
        ],
        complexity: 'Medium',
        timeToImpact: 'Long-term'
      }
    ]
  },
  {
    id: 'international-global',
    name: 'International & Global',
    description: 'Shape global relationships, assert sovereignty, and manage interdependence',
    domain: 'International',
    icon: '🌍',
    color: 'hsl(var(--destructive))',
    subLevers: [
      {
        id: 'treaty-negotiation',
        name: 'Treaty Negotiation & Ratification',
        description: 'Engaging in legally binding international commitments',
        actionType: 'Diplomatic',
        examples: ['Paris Climate Accord', 'WTO accession', 'Bilateral agreements'],
        leverageAlignment: [
          {
            leveragePointRank: 2,
            effectivenessScore: 8,
            applicableLoopTypes: ['Reinforcing', 'Balancing'],
            rationale: 'Creates international structures'
          },
          {
            leveragePointRank: 3,
            effectivenessScore: 7,
            applicableLoopTypes: ['Reinforcing'],
            rationale: 'Shapes global power dynamics'
          }
        ],
        complexity: 'Very High',
        timeToImpact: 'Long-term'
      },
      {
        id: 'foreign-aid-allocation',
        name: 'Foreign Aid Allocation',
        description: 'Transferring financial or material assistance to achieve strategic or humanitarian goals',
        actionType: 'Financial',
        examples: ['Disaster relief funding', 'Development grants', 'Humanitarian assistance'],
        leverageAlignment: [
          {
            leveragePointRank: 8,
            effectivenessScore: 4,
            applicableLoopTypes: ['Reinforcing', 'Balancing'],
            rationale: 'Provides international assistance'
          },
          {
            leveragePointRank: 9,
            effectivenessScore: 3,
            applicableLoopTypes: ['Balancing'],
            rationale: 'Influences global flows'
          }
        ],
        complexity: 'Medium',
        timeToImpact: 'Medium-term'
      },
      {
        id: 'trade-policy-adjustment',
        name: 'Trade Policy Adjustment',
        description: 'Structuring the terms of trade through tariffs, agreements, or embargoes',
        actionType: 'Economic',
        examples: ['Free trade agreements', 'Import sanctions', 'Export controls'],
        leverageAlignment: [
          {
            leveragePointRank: 5,
            effectivenessScore: 6,
            applicableLoopTypes: ['Reinforcing', 'Balancing'],
            rationale: 'Shapes trade flows'
          },
          {
            leveragePointRank: 6,
            effectivenessScore: 5,
            applicableLoopTypes: ['Balancing'],
            rationale: 'Controls economic flows'
          }
        ],
        complexity: 'High',
        timeToImpact: 'Medium-term'
      },
      {
        id: 'cross-border-regulation',
        name: 'Cross-border Regulation Coordination',
        description: 'Harmonizing national laws and enforcement with international standards',
        actionType: 'Regulatory',
        examples: ['Global health protocols', 'Cybersecurity standards', 'Environmental coordination'],
        leverageAlignment: [
          {
            leveragePointRank: 3,
            effectivenessScore: 7,
            applicableLoopTypes: ['Reinforcing', 'Balancing'],
            rationale: 'Coordinates international rules'
          },
          {
            leveragePointRank: 4,
            effectivenessScore: 6,
            applicableLoopTypes: ['Balancing'],
            rationale: 'Harmonizes regulatory systems'
          }
        ],
        complexity: 'High',
        timeToImpact: 'Long-term'
      },
      {
        id: 'sanction-incentive-deployment',
        name: 'Sanction & Incentive Deployment',
        description: 'Using carrots and sticks to influence foreign behavior or compliance',
        actionType: 'Coercive',
        examples: ['Economic sanctions', 'Most-Favored Nation status', 'Trade incentives'],
        leverageAlignment: [
          {
            leveragePointRank: 7,
            effectivenessScore: 5,
            applicableLoopTypes: ['Reinforcing', 'Balancing'],
            rationale: 'Applies international pressure'
          },
          {
            leveragePointRank: 8,
            effectivenessScore: 4,
            applicableLoopTypes: ['Balancing'],
            rationale: 'Influences international behavior'
          }
        ],
        complexity: 'High',
        timeToImpact: 'Short-term'
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
  return lever ? lever.subLevers : [];
};

export const getSubLeverById = (subLeverId: string): SubLever | undefined => {
  for (const lever of sixUniversalLevers) {
    const subLever = lever.subLevers.find(sl => sl.id === subLeverId);
    if (subLever) return subLever;
  }
  return undefined;
};