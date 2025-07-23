import React from 'react';
import { motion } from 'framer-motion';
import { Wifi, Smartphone, Download, Globe } from 'lucide-react';
import { OfflinePWAPanel } from '../modules/offline/components/OfflinePWAPanel';

const OfflinePage: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(true);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background-secondary to-background-tertiary" />
      
      {/* Hero Section */}
      <div className="relative z-10 pt-20 pb-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-6"
          >
            <div className="flex items-center gap-4">
              <Wifi className="h-16 w-16 text-success" />
              <Smartphone className="h-12 w-12 text-primary animate-pulse" />
              <Globe className="h-14 w-14 text-accent" />
            </div>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl font-bold text-foreground mb-4"
          >
            Offline & Progressive Web App
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-foreground-subtle max-w-2xl mx-auto"
          >
            Work anywhere, anytime. Install as a mobile app, sync offline changes, 
            and maintain productivity even without internet connectivity.
          </motion.p>
        </div>
      </div>

      {/* Offline PWA Panel */}
      <OfflinePWAPanel 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
      />
    </div>
  );
};

export default OfflinePage;