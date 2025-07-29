import React from 'react';
import { motion } from 'framer-motion';
import { Check, Circle } from 'lucide-react';

interface Step {
  id: string;
  title: string;
  completed: boolean;
  active: boolean;
}

interface SequentialProgressBarProps {
  steps: Step[];
  className?: string;
}

const SequentialProgressBar: React.FC<SequentialProgressBarProps> = ({ 
  steps, 
  className = '' 
}) => {
  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            {/* Step Circle */}
            <div className="flex flex-col items-center">
              <motion.div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300
                  ${step.completed 
                    ? 'bg-teal-500 border-teal-500' 
                    : step.active 
                      ? 'border-teal-500 bg-teal-500/20' 
                      : 'border-white/30 bg-white/5'
                  }
                `}
                initial={{ scale: 0.8 }}
                animate={{ 
                  scale: step.active ? 1.1 : 1,
                  boxShadow: step.active ? '0 0 20px rgba(20, 184, 166, 0.3)' : 'none'
                }}
                transition={{ duration: 0.3 }}
              >
                {step.completed ? (
                  <Check className="w-4 h-4 text-white" />
                ) : (
                  <Circle 
                    className={`w-3 h-3 ${
                      step.active ? 'text-teal-400' : 'text-white/50'
                    }`} 
                    fill="currentColor"
                  />
                )}
              </motion.div>
              
              {/* Step Title */}
              <motion.span
                className={`
                  text-xs mt-2 text-center max-w-20 transition-colors duration-300
                  ${step.active ? 'text-teal-300 font-medium' : 'text-gray-400'}
                `}
                animate={{ 
                  color: step.active ? '#7dd3fc' : step.completed ? '#ffffff' : '#9ca3af'
                }}
              >
                {step.title}
              </motion.span>
            </div>
            
            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className="flex-1 h-px bg-white/20 mx-2 relative">
                <motion.div
                  className="absolute left-0 top-0 h-full bg-teal-500"
                  initial={{ width: '0%' }}
                  animate={{ 
                    width: steps[index + 1].completed || steps[index + 1].active ? '100%' : '0%'
                  }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default SequentialProgressBar;