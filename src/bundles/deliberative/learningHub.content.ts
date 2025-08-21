import type { LangMode } from "./types.ui.lang";

export function getDeliberativeLearningContent(mode: LangMode) {
  if (mode === "general") {
    return {
      title: "Group Decision Guide",
      sections: [
        {
          title: "What is Group Decision Making?",
          content: `Group decision making brings together different perspectives to make better choices. It's about finding solutions everyone can support.

**Key Benefits:**
• Better decisions from diverse input
• Everyone feels heard and included
• Shared ownership of outcomes
• Reduced resistance to changes

**When to Use:**
• Complex problems with multiple factors
• Different viewpoints are valuable
• Buy-in from stakeholders is important
• Time allows for thorough discussion`
        },
        {
          title: "Running Effective Group Decisions",
          content: `**Before the Meeting:**
• Clearly define the decision needed
• Share background information early
• Identify who needs to be involved
• Set clear objectives and timeline

**During Discussion:**
• Start with facts and shared understanding
• Encourage all voices to be heard
• List pros and cons for each option
• Use structured comparison methods

**Common Pitfalls:**
• **Groupthink** - Everyone agrees too quickly
• **Analysis paralysis** - Too much discussion
• **Dominant voices** - Some people don't speak up
• **Hidden agendas** - Unstated motivations`
        },
        {
          title: "Decision Making Tools",
          content: `**Simple Voting** - Everyone picks their preference
• Good for clear options
• Quick and easy
• May not build consensus

**Pros and Cons Lists** - Compare good and bad points
• Helps see all aspects
• Easy to understand
• Can get too detailed

**Ranking Methods** - Order options by importance
• Forces prioritization
• Shows relative preferences
• Useful with many options

**Scoring Systems** - Rate each option on key factors
• More detailed analysis
• Weights important criteria
• Numbers help compare`
        }
      ]
    };
  }

  return {
    title: "Deliberative Capacity Technical Framework",
    sections: [
      {
        title: "Decision Science Foundations",
        content: `Deliberative capacity leverages structured analytical frameworks for multi-stakeholder decision processes.

**Core Methodologies:**
• **Multi-Criteria Decision Analysis (MCDA)**
• **Analytic Hierarchy Process (AHP)**
• **TOPSIS (Technique for Order Preference)**
• **ELECTRE methods**
• **Fuzzy logic approaches**

**Stakeholder Analysis:**
• Power-interest mapping
• Influence network analysis
• Coalition formation theory
• Preference aggregation mechanisms`
      },
      {
        title: "Formal Decision Models",
        content: `**Decision Matrix Construction:**
• Alternative identification
• Criteria weighting schemes
• Performance measurement scales
• Sensitivity analysis protocols

**Consensus Building Algorithms:**
• Delphi method iterations
• Nominal group technique
• Consensus measurement metrics
• Convergence detection

**Voting Theory Applications:**
• Arrow's impossibility theorem
• Condorcet methods
• Borda count variations
• Strategic voting considerations`
      },
      {
        title: "Process Design & Facilitation",
        content: `**Structured Deliberation Protocols:**
• Dialogue vs. debate frameworks
• Appreciative inquiry methods
• Systems thinking approaches
• Conflict transformation techniques

**Digital Deliberation Platforms:**
• Online consensus tools
• Real-time polling systems
• Collaborative filtering
• Argument mapping software

**Quality Assurance:**
• Process integrity metrics
• Bias detection mechanisms
• Participation equity measures
• Decision audit trails`
      }
    ]
  };
}