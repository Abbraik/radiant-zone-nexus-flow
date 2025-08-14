import * as Dialog from '@radix-ui/react-dialog';
import { motion } from 'framer-motion';
import React from 'react';

const spring = { type: 'spring' as const, stiffness: 260, damping: 22, mass: 0.9 };

export function Overlay(){
  return (
    <Dialog.Overlay asChild>
      <motion.div
        className="glass-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: .18 }}
      />
    </Dialog.Overlay>
  );
}

export function Content({ className='', children }:{ className?: string; children: React.ReactNode }){
  return (
    <Dialog.Content asChild>
      <motion.div
        className={className}
        initial={{ opacity: 0, scale: .98, y: 10 }}
        animate={{ opacity: 1, scale: 1,  y: 0  }}
        exit={{    opacity: 0, scale: .98, y: 8  }}
        transition={spring}
      >
        {children}
      </motion.div>
    </Dialog.Content>
  );
}