import React from 'react';
import { seedOnce } from '@/services/datasource/mock/seeds';

export default function DemoBootstrap(){
  React.useEffect(()=>{ seedOnce(); },[]);
  return null; // headless bootstrapper
}
