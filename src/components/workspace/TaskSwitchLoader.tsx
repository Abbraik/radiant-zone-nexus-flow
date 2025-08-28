import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, Zap, Clock, ArrowRight } from 'lucide-react';

interface TaskSwitchLoaderProps {
  message?: string;
  taskTitle?: string;
}

export const TaskSwitchLoader: React.FC<TaskSwitchLoaderProps> = ({
  message = "Switching tasks...",
  taskTitle
}) => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center relative overflow-hidden">
      {/* Animated background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/5 rounded-full blur-2xl animate-pulse delay-500" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative z-10 text-center max-w-md mx-auto px-8"
      >
        {/* Main loading spinner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="relative">
            {/* Outer ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, ease: "linear", repeat: Infinity }}
              className="w-20 h-20 mx-auto"
            >
              <div className="w-full h-full border-4 border-teal-500/20 border-t-teal-400 rounded-full" />
            </motion.div>
            
            {/* Inner ring */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 1.5, ease: "linear", repeat: Infinity }}
              className="absolute inset-2 w-16 h-16"
            >
              <div className="w-full h-full border-2 border-blue-500/20 border-b-blue-400 rounded-full" />
            </motion.div>

            {/* Center icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Zap className="w-6 h-6 text-teal-400" />
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Loading text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <h2 className="text-2xl font-semibold text-white mb-2">
            {message}
          </h2>
          
          {taskTitle && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-center gap-2 text-gray-300"
            >
              <Clock className="w-4 h-4" />
              <span className="text-sm">{taskTitle}</span>
              <ArrowRight className="w-4 h-4" />
            </motion.div>
          )}

          {/* Progress dots */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center gap-2 mt-6"
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 1, 0.3]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
                className="w-2 h-2 bg-teal-400 rounded-full"
              />
            ))}
          </motion.div>
        </motion.div>

        {/* Glass panel with additional info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 p-4 bg-glass/20 backdrop-blur-20 rounded-xl border border-white/10"
        >
          <p className="text-sm text-gray-400">
            Preparing your 5C workspace environment
          </p>
          <div className="flex items-center justify-center gap-2 mt-2 text-xs text-gray-500">
            <span>Loading capacity bundle</span>
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Loader2 className="w-3 h-3" />
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};