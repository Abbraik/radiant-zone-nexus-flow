// Helper functions for golden scenario display
export function getScenarioTitle(scenarioId: string): string {
  switch (scenarioId) {
    case 'fertility':
      return 'Fertility & Childcare Access • Responsive';
    case 'educator-pipeline':
      return 'Educator Pipeline • Deliberative';
    case 'labour-matching':
      return 'Labour Market Matching • Anticipatory';
    case 'social-cohesion':
      return 'Social Cohesion & Trust • Structural';
    default:
      return 'Unknown Scenario • Responsive';
  }
}

export function getScenarioPlaybookName(scenarioId: string): string {
  switch (scenarioId) {
    case 'fertility':
      return 'Childcare Capacity Surge';
    case 'educator-pipeline':
      return 'Educator Credential Acceleration';
    case 'labour-matching':
      return 'Skills Gap Response';
    case 'social-cohesion':
      return 'Service Reliability Recovery';
    default:
      return 'Generic Response Playbook';
  }
}

export function getScenarioRationale(scenarioData: any): string {
  switch (scenarioData.scenario_id) {
    case 'fertility':
      return `Address ${scenarioData.childcare?.wait_time_days || 25}-day wait times with mobile units and expanded hours`;
    case 'educator-pipeline':
      return `Accelerate credential processing from ${scenarioData.pipeline?.credential_processing_days || 45} days using fast-track pathways`;
    case 'labour-matching':
      return `Reduce job vacancy fill time from ${scenarioData.labour_market?.vacancy_fill_time_days || 35} days through skills matching`;
    case 'social-cohesion':
      return `Restore service reliability from ${(scenarioData.service_reliability?.outage_rate * 100).toFixed(1)}% outage rate`;
    default:
      return 'Implement targeted interventions based on current indicators';
  }
}

export function getScenarioTasks(scenarioData: any): Array<{title: string, description: string, capacity: string}> {
  switch (scenarioData.scenario_id) {
    case 'fertility':
      return [
        { 
          title: 'Deploy Mobile Childcare Units', 
          description: `Add ${scenarioData.childcare?.facilities?.length * 2 || 6} temporary slots in high-demand areas`, 
          capacity: 'responsive' 
        },
        { 
          title: 'Extend Operating Hours', 
          description: 'Open evening care 6-9pm at 3 facilities to reduce peak demand', 
          capacity: 'responsive' 
        },
        { 
          title: 'Emergency Subsidy Program', 
          description: `Fast-track ${scenarioData.recommendations?.length * 15 || 30} families through subsidy approval`, 
          capacity: 'responsive' 
        }
      ];
    case 'educator-pipeline':
      return [
        {
          title: 'Fast-track Credential Review',
          description: `Process ${scenarioData.pipeline?.certification_backlog || 28} pending certifications`,
          capacity: 'deliberative'
        },
        {
          title: 'Emergency Training Program',
          description: 'Launch 2-week intensive program for qualified candidates',
          capacity: 'deliberative'
        },
        {
          title: 'Interim Certificate Process',
          description: 'Enable provisional certification for experienced applicants',
          capacity: 'deliberative'
        }
      ];
    case 'labour-matching':
      return [
        {
          title: 'Skills Assessment Acceleration', 
          description: `Match ${scenarioData.labour_market?.job_postings?.length || 3} priority job postings`,
          capacity: 'anticipatory'
        },
        {
          title: 'Micro-credential Program',
          description: 'Launch rapid upskilling for high-demand roles',
          capacity: 'anticipatory'
        },
        {
          title: 'Employer Outreach Campaign',
          description: 'Connect unemployed candidates with flexible employers',
          capacity: 'anticipatory'
        }
      ];
    case 'social-cohesion':
      return [
        {
          title: 'Service Recovery Protocol',
          description: `Address ${scenarioData.service_reliability?.service_incidents?.length || 1} active service incidents`,
          capacity: 'structural'
        },
        {
          title: 'Community Communication Blitz',
          description: 'Proactive outreach to affected communities',
          capacity: 'structural'
        },
        {
          title: 'Trust Rebuilding Initiative',
          description: `Engage with ${scenarioData.community_trust?.community_feedback?.length || 2} community feedback themes`,
          capacity: 'structural'
        }
      ];
    default:
      return [
        { title: 'Generic Response Task 1', description: 'Standard intervention', capacity: 'responsive' },
        { title: 'Generic Response Task 2', description: 'Standard intervention', capacity: 'responsive' },
        { title: 'Generic Response Task 3', description: 'Standard intervention', capacity: 'responsive' }
      ];
  }
}