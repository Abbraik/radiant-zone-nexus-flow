import React from 'react';
import { DigitalTwinPreview } from '../../modules/digitalTwin/components/DigitalTwinPreview';

interface DigitalTwinWidgetProps {
  task: any;
}

const DigitalTwinWidget: React.FC<DigitalTwinWidgetProps> = ({ task }) => {
  // Generate realistic sample data based on task
  const generateSampleData = () => {
    const tensions = ['low', 'medium', 'high'] as const;
    const tension = tensions[Math.floor(Math.random() * tensions.length)];
    
    return {
      srt: Math.random() * 0.5 + 0.2,
      tension,
      throughput: Array.from({length: 10}, (_, i) => 50 + Math.sin(i * 0.5) * 20 + Math.random() * 10),
      responseTime: Array.from({length: 10}, (_, i) => 1.5 + Math.cos(i * 0.3) * 0.8 + Math.random() * 0.3),
      resourceUtilization: Math.floor(60 + Math.random() * 35)
    };
  };

  const [data] = React.useState(generateSampleData);

  return (
    <div className="w-full">
      <DigitalTwinPreview
        data={data}
        width={400}
        height={300}
        className="w-full"
      />
    </div>
  );
};

export default DigitalTwinWidget;