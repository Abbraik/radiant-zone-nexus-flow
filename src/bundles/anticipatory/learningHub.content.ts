import type { LangMode } from "./types.ui.lang";

export function getAnticipatoryLearningContent(mode: LangMode) {
  if (mode === "general") {
    return {
      title: "Early Warning Guide",
      sections: [
        {
          title: "What is Early Warning?",
          content: `Early warning systems spot problems before they become serious. Like weather alerts that help you prepare for storms.

**Key Benefits:**
• More time to prepare and respond
• Prevent small problems from growing
• Reduce damage and costs
• Better resource planning

**When to Use:**
• Problems develop gradually over time
• Warning signs can be detected
• Response actions take time to implement
• Prevention is better than reaction`
        },
        {
          title: "How Early Warning Works",
          content: `**The Warning Process:**
1. **Watch** - Monitor key indicators continuously
2. **Detect** - Spot unusual patterns or changes
3. **Analyze** - Determine if it's a real threat
4. **Warn** - Alert people who need to act
5. **Respond** - Take protective actions

**Key Components:**
• **Indicators** - What to watch (like temperature, complaints)
• **Thresholds** - When to worry (above/below certain levels)
• **Lead Time** - How much advance notice you get
• **Response Plans** - What to do when warned`
        },
        {
          title: "Setting Up Effective Warnings",
          content: `**Choose Good Indicators:**
• Reliable and consistent data
• Early enough to be useful
• Clearly linked to the problem
• Practical to monitor regularly

**Set Smart Thresholds:**
• Not too sensitive (false alarms)
• Not too insensitive (miss real problems)
• Adjust based on experience
• Consider seasonal patterns

**Prepare Response Plans:**
• Clear actions for each warning level
• Assign responsibilities in advance
• Pre-position resources when possible
• Practice and test regularly

**Common Mistakes:**
• Too many false alarms (cry wolf effect)
• Warnings come too late to help
• No clear action plan
• Ignoring warnings when they come`
        }
      ]
    };
  }

  return {
    title: "Anticipatory Capacity Technical Framework",
    sections: [
      {
        title: "Early Warning System Architecture",
        content: `Anticipatory capacity implements predictive analytics and risk monitoring for proactive system management.

**System Components:**
• **Sensor Networks** - Multi-modal data collection
• **Signal Processing** - Noise filtering, trend extraction
• **Pattern Recognition** - ML-based anomaly detection
• **Risk Quantification** - Probabilistic threat assessment
• **Decision Support** - Automated alert generation

**Data Pipeline Architecture:**
• Real-time streaming ingestion
• Feature engineering and transformation
• Model inference and scoring
• Alert routing and escalation`
      },
      {
        title: "Predictive Modeling Techniques",
        content: `**Time Series Forecasting:**
• ARIMA, GARCH models
• State-space representations
• Neural network approaches (LSTM, GRU)
• Ensemble methods

**Risk Channel Modeling:**
• Multivariate analysis
• Cross-correlation detection
• Lead-lag relationship identification
• Regime change detection

**Scenario Generation:**
• Monte Carlo simulation
• Stress testing frameworks
• Sensitivity analysis
• Waterfall decomposition
• Tornado chart analysis`
      },
      {
        title: "Operational Implementation",
        content: `**Threshold Optimization:**
• ROC curve analysis
• False positive/negative trade-offs
• Dynamic threshold adaptation
• Multi-level warning systems

**Buffer Adequacy Assessment:**
• Inventory optimization models
• Just-in-time vs. safety stock
• Multi-echelon supply chains
• Shelf-life management

**Backtesting & Validation:**
• Historical simulation
• Walk-forward analysis
• Performance metrics (precision, recall)
• Model degradation monitoring`
      }
    ]
  };
}