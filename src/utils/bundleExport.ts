import type { 
  EnhancedIntervention, 
  InterventionBundle,
  BundleDependency 
} from '../types/intervention';
import type { MetaSolveLayer } from '../types/metasolve';
import type { LoopLeverageContext } from '../types/levers';

export interface BundleExportData {
  metadata: {
    exportDate: string;
    exportVersion: string;
    bundleId: string;
    bundleName: string;
  };
  bundle: InterventionBundle;
  interventions: EnhancedIntervention[];
  dependencies: BundleDependency[];
  metaSolveConfig?: Partial<MetaSolveLayer>;
  loopContext?: LoopLeverageContext;
  statistics: BundleStatistics;
}

export interface BundleStatistics {
  totalInterventions: number;
  totalMicroTasks: number;
  totalBudget: number;
  averageComplexity: number;
  timelineWeeks: number;
  riskLevel: string;
  completionRate: number;
  criticalPathCount: number;
}

// Export bundle as JSON
export const exportBundleAsJSON = (bundleData: BundleExportData): void => {
  const jsonString = JSON.stringify(bundleData, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `${bundleData.metadata.bundleName.toLowerCase().replace(/\s+/g, '-')}-${bundleData.metadata.exportDate}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};

// Export bundle as CSV
export const exportBundleAsCSV = (bundleData: BundleExportData): void => {
  const csvData = [
    // Header
    [
      'Intervention ID',
      'Name',
      'Description',
      'Category',
      'Complexity',
      'Effort',
      'Impact',
      'Time to Impact',
      'Budget',
      'Status',
      'Micro Tasks',
      'Sub-Levers',
      'Created Date',
      'Last Modified'
    ],
    // Data rows
    ...bundleData.interventions.map(intervention => [
      intervention.id,
      intervention.name,
      intervention.description,
      intervention.category,
      intervention.complexity,
      intervention.effort,
      intervention.impact,
      intervention.timeToImpact,
      intervention.budget.totalBudget.toString(),
      intervention.status,
      intervention.microTasks.length.toString(),
      intervention.selectedSubLevers.length.toString(),
      intervention.createdAt.toISOString(),
      intervention.updatedAt.toISOString()
    ])
  ];

  const csvString = csvData.map(row => 
    row.map(cell => `"${cell?.toString().replace(/"/g, '""') || ''}"`)
      .join(',')
  ).join('\n');

  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `${bundleData.metadata.bundleName.toLowerCase().replace(/\s+/g, '-')}-interventions-${bundleData.metadata.exportDate}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};

// Generate PDF export data (would typically integrate with a PDF library)
export const generatePDFExportData = (bundleData: BundleExportData): string => {
  const { bundle, interventions, dependencies, metaSolveConfig, loopContext, statistics } = bundleData;

  return `
# Bundle Summary Report
**${bundle.name}**
Generated: ${bundleData.metadata.exportDate}

## Executive Summary
${bundle.description}

### Key Statistics
- **Total Interventions:** ${statistics.totalInterventions}
- **Total Budget:** $${statistics.totalBudget.toLocaleString()}
- **Timeline:** ${statistics.timelineWeeks} weeks
- **Risk Level:** ${statistics.riskLevel.toUpperCase()}
- **Completion Rate:** ${statistics.completionRate.toFixed(1)}%

## Loop Context
${loopContext ? `
**Loop Name:** ${loopContext.loopName}
**Loop Type:** ${loopContext.loopType}
**Leverage Point:** #${loopContext.leveragePointRank} - ${loopContext.leveragePointName}
**DE-Band Status:** ${loopContext.deBandStatus.toUpperCase()}
` : 'No loop context configured'}

## Interventions Overview
${interventions.map((intervention, index) => `
### ${index + 1}. ${intervention.name}
- **Category:** ${intervention.category}
- **Complexity:** ${intervention.complexity}
- **Budget:** $${intervention.budget.totalBudget.toLocaleString()}
- **Micro-tasks:** ${intervention.microTasks.length}
- **Status:** ${intervention.status}

${intervention.description}
`).join('\n')}

## MetaSolve Configuration
${metaSolveConfig ? `
### Institutional Owners (Meso Layer)
${metaSolveConfig.meso?.institutionalOwners?.map(owner => 
  `- **${owner.name}** (${owner.type}) - ${owner.role}`
).join('\n') || 'No institutional owners configured'}

### Frontline Units (Micro Layer)
${metaSolveConfig.micro?.frontlineUnits?.map(unit => 
  `- **${unit.name}** (${unit.type}) - ${unit.location}`
).join('\n') || 'No frontline units configured'}
` : 'No MetaSolve configuration available'}

## Dependencies
${dependencies.length > 0 ? dependencies.map(dep => {
  const fromIntervention = interventions.find(i => i.id === dep.fromInterventionId);
  const toIntervention = interventions.find(i => i.id === dep.toInterventionId);
  return `- **${fromIntervention?.name || 'Unknown'}** → **${toIntervention?.name || 'Unknown'}** (${dep.type})${dep.criticalPath ? ' [CRITICAL PATH]' : ''}`;
}).join('\n') : 'No dependencies configured'}

## Export Metadata
- **Export Date:** ${bundleData.metadata.exportDate}
- **Export Version:** ${bundleData.metadata.exportVersion}
- **Bundle ID:** ${bundleData.metadata.bundleId}
`;
};

// Export bundle as PDF (placeholder for PDF generation)
export const exportBundleAsPDF = (bundleData: BundleExportData): void => {
  const pdfContent = generatePDFExportData(bundleData);
  
  // For now, create a text file - in production would use a PDF library
  const blob = new Blob([pdfContent], { type: 'text/plain;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `${bundleData.metadata.bundleName.toLowerCase().replace(/\s+/g, '-')}-report-${bundleData.metadata.exportDate}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};

// Main export function
export const exportBundle = (
  format: 'pdf' | 'json' | 'csv',
  bundleName: string,
  interventions: EnhancedIntervention[],
  dependencies: BundleDependency[],
  metaSolveConfig?: Partial<MetaSolveLayer>,
  loopContext?: LoopLeverageContext
): void => {
  const exportDate = new Date().toISOString().split('T')[0];
  const bundleId = `bundle-${Date.now()}`;

  // Calculate statistics
  const statistics: BundleStatistics = {
    totalInterventions: interventions.length,
    totalMicroTasks: interventions.reduce((sum, int) => sum + int.microTasks.length, 0),
    totalBudget: interventions.reduce((sum, int) => sum + int.budget.totalBudget, 0),
    averageComplexity: interventions.reduce((sum, int) => {
      const complexityScore = int.complexity === 'High' ? 3 : int.complexity === 'Medium' ? 2 : 1;
      return sum + complexityScore;
    }, 0) / (interventions.length || 1),
    timelineWeeks: Math.max(...interventions.map(int => {
      const baseDuration = int.complexity === 'High' ? 8 : int.complexity === 'Medium' ? 4 : 2;
      return baseDuration + Math.ceil(int.microTasks.length / 4);
    })),
    riskLevel: interventions.some(int => int.complexity === 'High') ? 'high' : 
               interventions.some(int => int.complexity === 'Medium') ? 'medium' : 'low',
    completionRate: 0, // Would be calculated from actual task completion
    criticalPathCount: dependencies.filter(dep => dep.criticalPath).length
  };

  const bundleData: BundleExportData = {
    metadata: {
      exportDate,
      exportVersion: '1.0',
      bundleId,
      bundleName
    },
    bundle: {
      id: bundleId,
      name: bundleName,
      description: `Intervention bundle with ${interventions.length} interventions`,
      interventions,
      totalBudget: statistics.totalBudget,
      totalTimelineWeeks: statistics.timelineWeeks,
      riskLevel: statistics.riskLevel as any,
      dependencies,
      conflicts: [],
      status: 'draft',
      workflowStage: 'design',
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'current-user',
      owner: 'current-user',
      stakeholders: []
    },
    interventions,
    dependencies,
    metaSolveConfig,
    loopContext,
    statistics
  };

  switch (format) {
    case 'json':
      exportBundleAsJSON(bundleData);
      break;
    case 'csv':
      exportBundleAsCSV(bundleData);
      break;
    case 'pdf':
      exportBundleAsPDF(bundleData);
      break;
    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
};

export default {
  exportBundle,
  exportBundleAsJSON,
  exportBundleAsCSV,
  exportBundleAsPDF,
  generatePDFExportData
};