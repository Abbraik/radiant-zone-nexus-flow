import type { LangMode } from "./types.ui.lang";

export function getReflexiveLearningContent(mode: LangMode) {
  if (mode === "general") {
    return {
      title: "Auto-Adjust Guide",
      sections: [
        {
          title: "What is Auto-Adjust?",
          content: `Auto-adjust systems automatically respond to changes without human intervention. Think of a thermostat that maintains room temperature or cruise control in a car.

**Key Benefits:**
• Instant response to changes
• Consistent performance
• Reduces manual workload
• Works 24/7 without breaks

**When to Use:**
• Repetitive adjustments needed
• Fast response required
• Clear target values exist
• Changes are predictable`
        },
        {
          title: "How Auto-Adjust Works",
          content: `**The Basic Cycle:**
1. **Monitor** - Constantly check current conditions
2. **Compare** - See how far off from target
3. **Adjust** - Make corrections automatically
4. **Repeat** - Keep monitoring and adjusting

**Common Problems:**
• **Goes too far** - System overcorrects
• **Back-and-forth swings** - Can't settle down
• **Too slow** - Takes too long to respond
• **Too aggressive** - Changes too quickly`
        },
        {
          title: "Getting the Settings Right",
          content: `**Response Strength** - How hard the system pushes back
• Too weak = slow response
• Too strong = overshooting

**Speed Settings** - How quickly adjustments happen
• Too fast = unstable swings
• Too slow = poor performance

**Dead Zone** - Small range where no action is taken
• Prevents constant tiny adjustments
• Saves energy and wear

**Tips for Success:**
• Start with gentle settings
• Test one change at a time
• Monitor for swinging behavior
• Allow time to stabilize`
        }
      ]
    };
  }

  return {
    title: "Reflexive Capacity Technical Guide",
    sections: [
      {
        title: "Control Theory Fundamentals",
        content: `Reflexive capacity implements closed-loop control systems with feedback mechanisms for autonomous system regulation.

**Core Components:**
• **Plant** - System under control
• **Sensor** - Measurement device
• **Controller** - Decision logic (PID)
• **Actuator** - Control element
• **Setpoint** - Reference signal

**Control Loop Characteristics:**
• **Rise time** - Speed to reach target
• **Settling time** - Time to stabilize
• **Overshoot** - Peak beyond setpoint
• **Steady-state error** - Final offset`
      },
      {
        title: "PID Controller Design",
        content: `**Proportional (P)** - Error-based response
• Kp gain determines immediate response
• Higher Kp = faster response, potential overshoot

**Integral (I)** - Accumulated error correction
• Ki eliminates steady-state error
• Risk of integral windup

**Derivative (D)** - Rate-based prediction
• Kd provides damping, reduces overshoot
• Sensitive to noise, needs filtering

**Tuning Methods:**
• Ziegler-Nichols
• Cohen-Coon
• Lambda tuning
• Model-based approaches`
      },
      {
        title: "Advanced Control Strategies",
        content: `**Cascade Control** - Multiple loop hierarchy
**Feedforward Control** - Disturbance compensation
**Model Predictive Control** - Optimization-based
**Adaptive Control** - Self-tuning parameters

**System Identification:**
• Step response analysis
• Frequency domain methods
• Black-box modeling
• Parameter estimation

**Performance Metrics:**
• ISE, IAE, ITAE criteria
• Robustness margins
• Disturbance rejection
• Noise sensitivity`
      }
    ]
  };
}