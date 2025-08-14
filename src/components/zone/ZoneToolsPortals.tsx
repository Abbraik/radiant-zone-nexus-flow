import React from 'react';
import IndicatorEditorTool from '@/components/tools/think/IndicatorEditorTool';
import BandsHeatmapTool from '@/components/tools/think/BandsHeatmapTool';
import RELBoardTool from '@/components/tools/monitor/RELBoardTool';
import ShipPanelTool from '@/components/tools/act/ShipPanelTool';

export default function ZoneToolsPortals({ zone }:{ zone:'think'|'monitor'|'act' }){
  // Render overlays for the zone (no DOM unless opened)
  if(zone==='think') return (<><IndicatorEditorTool/><BandsHeatmapTool/></>);
  if(zone==='monitor') return (<><RELBoardTool/></>);
  if(zone==='act') return (<><ShipPanelTool/></>);
  return null;
}
