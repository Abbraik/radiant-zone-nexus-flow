// Helper functions to extract scenario-specific data from enriched payloads
export function getScenarioSpecificData(taskData: any, defaultValues: any) {
  const scenarioData = taskData?.payload;
  const isGoldenScenario = scenarioData?.scenario_id;
  
  if (!isGoldenScenario) {
    return defaultValues;
  }

  return {
    ...defaultValues,
    scenarioId: scenarioData.scenario_id,
    isGoldenScenario: true,
    scenarioData
  };
}

export function getDeliberativeScenarioData(taskData: any) {
  const scenarioData = taskData?.payload;
  if (!scenarioData?.scenario_id) return null;

  switch (scenarioData.scenario_id) {
    case 'educator-pipeline':
      return {
        title: 'Educator Credential Processing Reform',
        options: [
          {
            id: 'opt1',
            name: 'Fast-Track Certification',
            synopsis: `Expedite credential review to reduce ${scenarioData.pipeline?.credential_processing_days || 45} day backlog`,
            costs: { opex: 75000 },
            latencyDays: 30,
            authorityFlag: 'ok' as const
          },
          {
            id: 'opt2', 
            name: 'Interim Certificate Program',
            synopsis: 'Allow provisional certification for experienced candidates',
            costs: { capex: 200000, opex: 50000 },
            latencyDays: 14,
            authorityFlag: 'review' as const
          },
          {
            id: 'opt3',
            name: 'Digital Assessment Platform',
            synopsis: 'Automated screening and qualification verification',
            costs: { capex: 500000, opex: 100000 },
            latencyDays: 60,
            authorityFlag: 'ok' as const
          }
        ],
        criteria: [
          { id: 'crit1', label: 'Processing Speed', weight: 0.35, direction: 'maximize' as const },
          { id: 'crit2', label: 'Quality Assurance', weight: 0.25, direction: 'maximize' as const },
          { id: 'crit3', label: 'Cost Efficiency', weight: 0.20, direction: 'maximize' as const },
          { id: 'crit4', label: 'Regulatory Compliance', weight: 0.20, direction: 'maximize' as const }
        ]
      };
    case 'fertility':
      return {
        title: 'Childcare Capacity Enhancement',
        options: [
          {
            id: 'opt1',
            name: 'Mobile Childcare Units',
            synopsis: `Deploy temporary facilities to reduce ${scenarioData.childcare?.wait_time_days || 25} day wait times`,
            costs: { capex: 400000, opex: 150000 },
            latencyDays: 45,
            authorityFlag: 'ok' as const
          },
          {
            id: 'opt2',
            name: 'Extended Hours Program',
            synopsis: 'Expand operating hours at existing facilities',
            costs: { opex: 200000 },
            latencyDays: 21,
            authorityFlag: 'ok' as const
          },
          {
            id: 'opt3',
            name: 'Subsidy Acceleration',
            synopsis: 'Fast-track childcare subsidies for qualified families',
            costs: { opex: 300000 },
            latencyDays: 14,
            authorityFlag: 'review' as const
          }
        ],
        criteria: [
          { id: 'crit1', label: 'Wait Time Reduction', weight: 0.40, direction: 'maximize' as const },
          { id: 'crit2', label: 'Accessibility', weight: 0.25, direction: 'maximize' as const },
          { id: 'crit3', label: 'Implementation Speed', weight: 0.20, direction: 'maximize' as const },
          { id: 'crit4', label: 'Cost Effectiveness', weight: 0.15, direction: 'maximize' as const }
        ]
      };
    default:
      return null;
  }
}

export function getAnticipatoryScenarioData(taskData: any) {
  const scenarioData = taskData?.payload;
  if (!scenarioData?.scenario_id) return null;

  const baseEwsProb = scenarioData.context?.alert_level === 'high' ? 0.85 : 
                     scenarioData.context?.alert_level === 'medium' ? 0.65 : 0.45;

  switch (scenarioData.scenario_id) {
    case 'labour-matching':
      return {
        ewsProb: baseEwsProb,
        leadTimeDays: Math.ceil(scenarioData.labour_market?.vacancy_fill_time_days * 0.3) || 12,
        bufferAdequacy: Math.max(0.1, 1 - scenarioData.labour_market?.unemployment_rate * 5) || 0.35,
        watchboard: [
          {
            riskChannel: "SkillsMismatch" as const,
            ewsProb: scenarioData.labour_market?.skills_mismatch_index * 0.6 || 0.72,
            trend: scenarioData.context?.trending === 'increasing' ? 'up' as const : 'down' as const,
            leadTimeDays: 14,
            linkedLoops: [scenarioData.loop_code],
            bufferAdequacy: 0.28,
            series: generateTimeSeries(0.72, 5)
          },
          {
            riskChannel: "UnemploymentRise" as const,
            ewsProb: scenarioData.labour_market?.unemployment_rate * 10 || 0.78,
            trend: "up" as const,
            leadTimeDays: 21,
            linkedLoops: [scenarioData.loop_code, "LAB-L02"],
            bufferAdequacy: 0.35,
            series: generateTimeSeries(0.78, 5)
          }
        ],
        scenarios: [
          { id: "s1", name: "Skills Crisis", summary: "Major skills shortage in key sectors" },
          { id: "s2", name: "Economic Downturn", summary: "Rapid unemployment increase" }
        ]
      };
    default:
      return null;
  }
}

export function getStructuralScenarioData(taskData: any) {
  const scenarioData = taskData?.payload;
  if (!scenarioData?.scenario_id) return null;

  switch (scenarioData.scenario_id) {
    case 'social-cohesion':
      return {
        mission: 'Service Reliability & Trust Recovery',
        mandateChecks: [
          { 
            id: 'mandate1', 
            label: 'Service Level Compliance', 
            status: scenarioData.service_reliability?.outage_rate > 0.025 ? 'violated' : 'ok',
            note: `Current outage rate: ${(scenarioData.service_reliability?.outage_rate * 100).toFixed(1)}%`
          },
          {
            id: 'mandate2',
            label: 'Community Trust Threshold',
            status: scenarioData.community_trust?.trust_index < 0.6 ? 'violated' : 'ok', 
            note: `Trust index: ${(scenarioData.community_trust?.trust_index * 100).toFixed(0)}%`
          }
        ]
      };
    default:
      return null;
  }
}

export function getReflexiveScenarioData(taskData: any) {
  const scenarioData = taskData?.payload;
  if (!scenarioData?.scenario_id) return null;

  // Extract key metrics from scenario for reflexive tuning
  const primaryMetric = scenarioData.indicators ? Object.keys(scenarioData.indicators)[0] : 'primary';
  const primaryValue = scenarioData.indicators ? Object.values(scenarioData.indicators)[0] as number : 0.5;

  return {
    decision: {
      decisionId: `${scenarioData.scenario_id}-tuning`,
      severity: scenarioData.context?.alert_level === 'high' ? 0.9 : 
                scenarioData.context?.alert_level === 'medium' ? 0.65 : 0.4,
      loopCode: scenarioData.loop_code,
      indicator: primaryMetric,
      consent: { requireDeliberative: false, legitimacyGap: 0.1 },
      guardrails: { caps: ['max_adjustment: 0.15'] },
      srt: { horizon: "P7D", cadence: "daily" },
      scores: { 
        responsive: taskData?.tri?.r_value * 100 || 70, 
        reflexive: taskData?.tri?.i_value * 100 || 85, 
        deliberative: taskData?.tri?.t_value * 100 || 50,
        anticipatory: 40,
        structural: 30
      },
      order: ['reflexive', 'responsive', 'deliberative', 'anticipatory', 'structural'],
      primary: 'reflexive' as const,
      templateActions: []
    },
    reading: {
      loopCode: scenarioData.loop_code,
      indicator: primaryMetric,
      value: primaryValue,
      lower: primaryValue * 0.8,
      upper: primaryValue * 1.2,
      oscillation: 0.3,
      rmseRel: 0.2,
      dispersion: 0.25,
      slope: scenarioData.context?.trending === 'increasing' ? 0.05 : -0.03,
      persistencePk: 0.15,
      integralError: 0.08,
      dataPenalty: 0.0
    }
  };
}

// Helper function to generate time series data
function generateTimeSeries(baseValue: number, points: number) {
  return Array.from({ length: points }, (_, i) => ({
    t: new Date(Date.now() - (points - 1 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    v: Math.max(0, Math.min(1, baseValue + (Math.random() - 0.5) * 0.2))
  }));
}