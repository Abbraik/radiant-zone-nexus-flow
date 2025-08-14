import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

type Props = React.PropsWithChildren<{ className?: string; maxTilt?: number }>;

export default function ParallaxCard({ className='', maxTilt=6, children }:Props){
  const ref = useRef<HTMLDivElement|null>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useTransform(my, v =>  v * maxTilt);
  const ry = useTransform(mx, v => -v * maxTilt);
  const srx = useSpring(rx, { stiffness: 200, damping: 18 });
  const sry = useSpring(ry, { stiffness: 200, damping: 18 });

  function onMove(e: React.MouseEvent){
    const el = ref.current!;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left)/r.width - .5;
    const py = (e.clientY - r.top )/r.height- .5;
    mx.set(px); my.set(py);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={()=>{ mx.set(0); my.set(0); }}
      style={{ rotateX: srx, rotateY: sry, transformStyle: 'preserve-3d' }}
      className={className}
      whileHover={{ y: -2 }}
      transition={{ type:'spring', stiffness: 220, damping: 18 }}
    >
      {children}
    </motion.div>
  );
}