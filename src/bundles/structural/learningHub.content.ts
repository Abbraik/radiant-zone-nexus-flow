import type { LangMode } from "./types.ui.lang";

export function getStructuralLearningContent(mode: LangMode) {
  if (mode === "general") {
    return {
      title: "System Change Guide",
      sections: [
        {
          title: "What is System Change?",
          content: `System change means redesigning how things work at a fundamental level. It's like renovating a house rather than just redecorating.

**Key Benefits:**
• Fixes root causes of problems
• Creates lasting improvements
• Handles complex, interconnected issues
• Enables new capabilities

**When to Use:**
• Current system can't handle needs
• Problems keep coming back
• Multiple parts need to work together differently
• Long-term transformation is needed`
        },
        {
          title: "Types of System Changes",
          content: `**Rules and Governance** - Who decides what
• New approval processes
• Changed authority levels
• Updated policies and procedures
• Different oversight structures

**Work Processes** - How things get done
• Streamlined workflows
• New coordination methods
• Automated steps
• Different handoff points

**Market Design** - How resources are allocated
• Pricing mechanisms
• Bidding systems
• Permission structures
• Incentive alignment

**Standards and Integration** - How parts connect
• Common data formats
• Shared protocols
• Interface specifications
• Quality requirements`
        },
        {
          title: "Planning System Changes",
          content: `**Assessment Phase:**
• Map current system thoroughly
• Identify all stakeholders affected
• Understand existing constraints
• Document current problems

**Design Phase:**
• Define desired future state
• Design new processes and rules
• Plan transition steps
• Identify resource needs

**Implementation:**
• Start with pilot programs
• Build capability gradually
• Monitor and adjust continuously
• Communicate changes clearly

**Success Factors:**
• Strong leadership commitment
• Clear communication throughout
• Training for all affected people
• Patience for gradual adoption
• Willingness to adjust plans`
        }
      ]
    };
  }

  return {
    title: "Structural Capacity Technical Framework",
    sections: [
      {
        title: "Governance Architecture Design",
        content: `Structural capacity implements systematic approaches to institutional design and system architecture transformation.

**Governance Models:**
• **Hierarchical** - Clear authority chains
• **Network** - Distributed decision-making
• **Market-based** - Price mechanisms
• **Hybrid** - Mixed governance modes

**Authority Delegation Frameworks:**
• Mandate specification protocols
• Delegation tree optimization
• Authority boundary definition
• Accountability mechanisms
• Budget envelope constraints`
      },
      {
        title: "Process Engineering & Standards",
        content: `**Business Process Reengineering:**
• Value stream mapping
• Process optimization algorithms
• Bottleneck identification
• RACI matrix construction
• SLA definition and monitoring

**Standards Development:**
• Technical specification frameworks
• Conformance testing protocols
• Interoperability requirements
• Version control and evolution
• Adoption lifecycle management

**Quality Assurance Systems:**
• ISO framework implementation
• Continuous improvement cycles
• Metrics and KPI design
• Audit and compliance frameworks`
      },
      {
        title: "Market Design & Mechanism Theory",
        content: `**Auction Theory Applications:**
• First-price vs. second-price auctions
• Reserve price optimization
• Bid aggregation mechanisms
• Multi-attribute auctions
• Dynamic pricing algorithms

**Permit and Resource Allocation:**
• Cap-and-trade systems
• Priority queuing mechanisms
• Resource allocation algorithms
• Fairness and efficiency trade-offs
• Strategic behavior considerations

**Platform Economics:**
• Network effects modeling
• Two-sided market design
• Platform governance structures
• API design and management
• Ecosystem development strategies`
      }
    ]
  };
}