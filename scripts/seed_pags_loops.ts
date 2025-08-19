// scripts/seed_pags_loops.ts
// ts-node scripts/seed_pags_loops.ts
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const sb = createClient(supabaseUrl, supabaseKey);

type Domain = 'population'|'resource'|'product'|'social'|'institution';

type Payload = {
  schema: 'pags.loop.v1',
  loop: {
    name: string,
    loop_type: 'reactive'|'structural'|'perceptual'|'meta'|string,
    motif: 'B'|'R'|'N'|'C'|'T',
    layer: 'meta'|'macro'|'meso'|'micro',
    default_leverage: 'N'|'P'|'S',
    tags: string[],
    nodes: any[],
    edges: any[],
    indicators: any[],
    srt: any,
    snl_links: {label:string, domain:Domain, role:string}[]
  },
  cascades: any[],
  meta: any
};

function srt(windowStart='2025-01-01', windowEnd='2025-12-31', horizonDays=30, cadence='biweekly') {
  return { window_start: windowStart, window_end: windowEnd, reflex_horizon: `P${horizonDays}D`, cadence };
}
function band(lower:number, upper:number, asym=0) { return { lower, upper, asymmetry: asym }; }
function indicator(id:string, name:string, kind:'state'|'flow'|'rate'|'composite', unit:string, lower:number, upper:number, asym=0) {
  return { id, name, kind, unit, de_band: band(lower, upper, asym) };
}
function node(id:string, label:string, kind:'stock'|'flow'|'aux'|'actor'|'indicator', indicator_ref?:string) {
  const n:any = { id, label, kind };
  if (indicator_ref) n.indicator_ref = indicator_ref;
  return n;
}
function edge(from:string, to:string, polarity:1|-1, delay_ms=0, weight=0.5, note='') {
  return { from, to, polarity, delay_ms, weight, note };
}
function loop(
  name:string, loop_type:'reactive'|'structural'|'perceptual'|'meta'|string, motif:'B'|'R'|'N'|'C'|'T',
  layer:'meta'|'macro'|'meso'|'micro', default_leverage:'N'|'P'|'S',
  tags:string[], nodes:any[], edges:any[], indicators:any[], snl_links:any[], cascades:any[]=[]
): Payload {
  return {
    schema: 'pags.loop.v1',
    loop: { name, loop_type, motif, layer, default_leverage, tags, nodes, edges, indicators, srt: srt(), snl_links },
    cascades, meta: { notes: '' }
  };
}

// ––––– SNL set –––––
const SNL: Array<{label:string, domain:Domain, descriptor:string}> = [
  { label:'Residents', domain:'population', descriptor:'People living in jurisdiction' },
  { label:'SMEs', domain:'population', descriptor:'Small & medium enterprises' },
  { label:'Developers', domain:'institution', descriptor:'Property developers' },
  { label:'Permitting Authority', domain:'institution', descriptor:'Municipal permitting department' },
  { label:'Finance Ministry', domain:'institution', descriptor:'Budget & fiscal' },
  { label:'Grid Operator', domain:'institution', descriptor:'Electricity transmission operator' },
  { label:'Electricity Supply', domain:'resource', descriptor:'Available electrical energy' },
  { label:'Hospitals', domain:'institution', descriptor:'Secondary/tertiary care' },
  { label:'Clinics', domain:'institution', descriptor:'Primary care clinics' },
  { label:'Water Utility', domain:'institution', descriptor:'Municipal water authority' },
  { label:'Public Works', domain:'institution', descriptor:'Infrastructure maintenance' },
  { label:'Transport Authority', domain:'institution', descriptor:'Transit planning & ops' },
  { label:'Bus Operators', domain:'institution', descriptor:'Bus companies' },
  { label:'Ride-hailing Platforms', domain:'institution', descriptor:'Private mobility platforms' },
  { label:'Commercial Banks', domain:'institution', descriptor:'Banks & lenders' },
  { label:'Procurement Office', domain:'institution', descriptor:'Central procurement' },
  { label:'Ports Authority', domain:'institution', descriptor:'Maritime port operator' },
  { label:'Tourism Board', domain:'institution', descriptor:'Visitor economy' },
  { label:'Air Quality Monitors', domain:'product', descriptor:'AQI sensor network' },
  { label:'Data Exchange Platform', domain:'product', descriptor:'Gov data platform' },
];

// Idempotent SNL upsert
async function upsertSNL() {
  for (const s of SNL) {
    const { error } = await sb.rpc('upsert_snl', {
      label: s.label, domain: s.domain, descriptor: s.descriptor, meta: {}
    });
    if (error) console.error('SNL upsert error for', s.label, error.message);
  }
}

// ––––– Loop definitions –––––

// 0) META layer — Supervisory Control (Meta-Loop)
const META = loop(
  'Meta-Loop Supervisory Control',
  'meta', 'B', 'meta', 'N',
  ['control','tri','bands','srt','nps','memory'],
  [
    node('N1','Error Signal (DE-Band Breach)','indicator','I1'),
    node('N2','TRI Slope','indicator','I2'),
    node('N3','Mode Selection','aux'),
    node('N4','N→P→S Escalation Gate','aux'),
    node('N5','Reflex Memory','stock'),
  ],
  [
    edge('N1','N3',1,0,0.7,'Breaches raise urgency to switch mode'),
    edge('N2','N3',1,0,0.6,'Negative slope -> switch'),
    edge('N3','N4',1,0,0.5,'Chosen mode constrained by minimal escalation'),
    edge('N3','N5',1,0,0.5,'All decisions logged to memory'),
    edge('N5','N3',-1,0,0.3,'Memory reduces oscillatory switching'),
  ],
  [
    indicator('I1','Breach Severity Index','rate','z-score',0.0,1.5,0.0),
    indicator('I2','TRI Trend','rate','Δ per window',-0.2,0.2,0.0),
  ],
  [ {label:'Data Exchange Platform', domain:'product', role:'system'} ],
  []
);

// MACRO layer
const MACRO = [
  loop('Affordable Housing Availability','reactive','B','macro','N',['housing','affordability'],
    [
      node('N1','Affordable Units','stock','I1'),
      node('N2','New Starts','flow'),
      node('N3','Median Rent-to-Income','indicator','I2'),
      node('N4','Permit Approvals','aux'),
    ],
    [
      edge('N4','N2',1), edge('N2','N1',1), edge('N1','N3',-1), edge('N3','N4',-1,'Rent pressure pushes approvals')
    ],
    [ indicator('I1','Affordable Units','state','units',20000,60000,0.1), indicator('I2','Median Rent-to-Income','rate','%',25,35,0.2) ],
    [ {label:'Residents',domain:'population',role:'beneficiary'}, {label:'Developers',domain:'institution',role:'actor'}, {label:'Finance Ministry',domain:'institution',role:'funder'} ],
    []
  ),
  loop('Heatwave Power Demand Surge','reactive','R','macro','N',['energy','resilience'],
    [
      node('N1','Cooling Demand','stock'),
      node('N2','Peak Load','indicator','I1'),
      node('N3','Demand Response','aux'),
      node('N4','Outage Incidents','indicator','I2'),
    ],
    [ edge('N1','N2',1), edge('N2','N4',1), edge('N3','N2',-1), edge('N4','N3',1) ],
    [ indicator('I1','Peak Load','state','MW',7000,9500,0.0), indicator('I2','Outage Incidents','rate','count/day',0,3,0.0) ],
    [ {label:'Grid Operator',domain:'institution',role:'actor'}, {label:'Electricity Supply',domain:'resource',role:'system'}, {label:'Residents',domain:'population',role:'beneficiary'} ],
    []
  ),
  loop('Food Price Inflation','reactive','R','macro','P',['prices','inflation'],
    [
      node('N1','Food CPI','indicator','I1'),
      node('N2','Import Costs','aux'),
      node('N3','Retail Markup','aux'),
      node('N4','Household Demand','aux'),
    ],
    [ edge('N2','N1',1), edge('N3','N1',1), edge('N1','N4',-1), edge('N4','N3',1) ],
    [ indicator('I1','Food CPI (YoY)','rate','%',2,8,0.2) ],
    [ {label:'Finance Ministry',domain:'institution',role:'actor'}, {label:'Residents',domain:'population',role:'beneficiary'} ],
    []
  ),
  loop('SME Credit Access','perceptual','R','macro','P',['finance','sme'],
    [
      node('N1','Approved SME Loans','indicator','I1'),
      node('N2','Application Volume','aux'),
      node('N3','Default Rate','indicator','I2'),
      node('N4','Credit Scoring Coverage','indicator','I3'),
    ],
    [ edge('N2','N1',1), edge('N4','N1',1), edge('N3','N1',-1), edge('N1','N2',1) ],
    [
      indicator('I1','Approved SME Loans','state','loans/qtr',2000,6000,0.0),
      indicator('I2','SME Default Rate','rate','%',1,6,0.0),
      indicator('I3','Credit Scoring Coverage','rate','%',40,90,0.0),
    ],
    [ {label:'SMEs',domain:'population',role:'beneficiary'}, {label:'Commercial Banks',domain:'institution',role:'actor'}, {label:'Finance Ministry',domain:'institution',role:'funder'} ],
    []
  ),
];

// MESO layer
const MESO = [
  loop('Housing Approvals Throughput','structural','C','meso','P',['housing','permits','backlog'],
    [
      node('N1','Applications In Queue','stock'),
      node('N2','Permitting Throughput','flow'),
      node('N3','Processing Capacity','aux'),
      node('N4','Average Approval Time','indicator','I1'),
      node('N5','Digital Submission Rate','indicator','I2'),
    ],
    [
      edge('N3','N2',1), edge('N2','N1',-1), edge('N1','N4',1),
      edge('N5','N3',1), edge('N4','N5',-1,'Long waits drive digital')
    ],
    [ indicator('I1','Average Approval Time','state','days',20,45,0.2), indicator('I2','Digital Submission Rate','rate','%',40,90,0.0) ],
    [ {label:'Permitting Authority',domain:'institution',role:'actor'}, {label:'Developers',domain:'institution',role:'beneficiary'}, {label:'Data Exchange Platform',domain:'product',role:'system'} ],
    []
  ),
  loop('Construction Capacity Feedback','structural','R','meso','P',['construction','labor'],
    [
      node('N1','Skilled Labor Pool','stock'),
      node('N2','Project Starts','flow'),
      node('N3','Wages','aux'),
      node('N4','Training Intake','aux'),
      node('N5','Completion Rate','indicator','I1'),
    ],
    [ edge('N1','N2',1), edge('N2','N1',-1,'Attrition'), edge('N2','N5',1), edge('N3','N4',1), edge('N2','N3',1) ],
    [ indicator('I1','Completion Rate','rate','%/qtr',60,90,0.0) ],
    [ {label:'Developers',domain:'institution',role:'actor'}, {label:'Public Works',domain:'institution',role:'system'}, {label:'SMEs',domain:'population',role:'beneficiary'} ],
    []
  ),
  loop('Public Transport Reliability','reactive','B','meso','P',['transport','buses'],
    [
      node('N1','On-time Performance','indicator','I1'),
      node('N2','Fleet Health','aux'),
      node('N3','Dedicated Lanes','aux'),
      node('N4','Ridership','indicator','I2'),
    ],
    [ edge('N2','N1',1), edge('N3','N1',1), edge('N1','N4',1), edge('N4','N2',1) ],
    [ indicator('I1','On-time Performance','rate','%',75,95,0.0), indicator('I2','Ridership','state','trips/day',500000,900000,0.1) ],
    [ {label:'Transport Authority',domain:'institution',role:'actor'}, {label:'Bus Operators',domain:'institution',role:'system'}, {label:'Residents',domain:'population',role:'beneficiary'} ],
    []
  ),
  loop('Road Congestion Feedback','reactive','R','meso','N',['transport','traffic'],
    [ node('N1','Peak Travel Time Index','indicator','I1'), node('N2','Car Trip Demand','aux'), node('N3','Public Transport Attractiveness','aux') ],
    [ edge('N2','N1',1), edge('N3','N2',-1), edge('N1','N3',-1) ],
    [ indicator('I1','Peak Travel Time Index','state','ratio',1.2,1.6,0.2) ],
    [ {label:'Residents',domain:'population',role:'actor'}, {label:'Transport Authority',domain:'institution',role:'system'}, {label:'Ride-hailing Platforms',domain:'institution',role:'actor'} ],
    []
  ),
  loop('Primary Care Access Buffer','reactive','B','meso','N',['health','primary-care'],
    [
      node('N1','Available PC Slots','stock','I1'),
      node('N2','Daily Bookings','flow'),
      node('N3','No-Show Rate','aux'),
      node('N4','Telehealth Uptake','indicator','I2'),
    ],
    [ edge('N1','N2',1), edge('N2','N1',-1), edge('N4','N1',1), edge('N3','N1',-1) ],
    [ indicator('I1','Available PC Slots','state','slots/day',300,800,0.1), indicator('I2','Telehealth Uptake','rate','%',10,60,0.0) ],
    [ {label:'Clinics',domain:'institution',role:'actor'}, {label:'Residents',domain:'population',role:'beneficiary'} ],
    []
  ),
  loop('Non-Revenue Water','structural','C','meso','P',['water','leakage'],
    [
      node('N1','Non-Revenue Water','indicator','I1'),
      node('N2','Pipe Condition','aux'),
      node('N3','Leak Repairs','flow'),
      node('N4','Pressure Management','aux'),
    ],
    [ edge('N2','N1',1), edge('N3','N2',-1), edge('N4','N1',-1), edge('N1','N3',1) ],
    [ indicator('I1','Non-Revenue Water','rate','%',10,25,0.0) ],
    [ {label:'Water Utility',domain:'institution',role:'actor'}, {label:'Public Works',domain:'institution',role:'system'}, {label:'Residents',domain:'population',role:'beneficiary'} ],
    []
  ),
  loop('Procurement Cycle Time','structural','C','meso','S',['procurement','governance'],
    [
      node('N1','Open RFPs','stock'),
      node('N2','Evaluation Throughput','flow'),
      node('N3','Cycle Time','indicator','I1'),
      node('N4','Standard Templates','aux'),
    ],
    [ edge('N4','N2',1), edge('N2','N1',-1), edge('N1','N3',1), edge('N3','N4',-1) ],
    [ indicator('I1','Median Procurement Cycle Time','state','days',45,120,0.3) ],
    [ {label:'Procurement Office',domain:'institution',role:'actor'}, {label:'Commercial Banks',domain:'institution',role:'system'} ],
    []
  ),
  loop('Digital Service Latency','reactive','B','meso','P',['digital','services'],
    [
      node('N1','Requests In System','stock'),
      node('N2','Throughput','flow'),
      node('N3','Median Latency','indicator','I1'),
      node('N4','Automation Share','indicator','I2'),
    ],
    [ edge('N2','N1',-1), edge('N1','N3',1), edge('N4','N2',1), edge('N3','N4',-1) ],
    [ indicator('I1','Median Latency','state','seconds',2,6,0.2), indicator('I2','Automation Share','rate','%',20,80,0.0) ],
    [ {label:'Data Exchange Platform',domain:'product',role:'system'}, {label:'Residents',domain:'population',role:'beneficiary'} ],
    []
  ),
  loop('Permits Digitalization Adoption','perceptual','R','meso','N',['digital','change'],
    [
      node('N1','Digital Modules Live','stock'),
      node('N2','User Satisfaction','indicator','I1'),
      node('N3','Adoption Rate','indicator','I2'),
      node('N4','Training & Comms','aux'),
    ],
    [ edge('N4','N3',1), edge('N3','N2',1), edge('N2','N4',1), edge('N3','N1',1) ],
    [ indicator('I1','User Satisfaction','rate','/5',3.5,4.6,0.0), indicator('I2','Adoption Rate','rate','%',30,90,0.0) ],
    [ {label:'Permitting Authority',domain:'institution',role:'actor'}, {label:'Residents',domain:'population',role:'beneficiary'}, {label:'Developers',domain:'institution',role:'beneficiary'} ],
    []
  ),
];

// MICRO layer
const MICRO = [
  loop('ER Wait Time Stabilization','reactive','B','micro','P',['health','emergency'],
    [
      node('N1','Patients in ER','stock'),
      node('N2','Service Rate','flow'),
      node('N3','Staff on Shift','aux'),
      node('N4','ER Wait Time','indicator','I1'),
      node('N5','Fast-Track Protocols','aux'),
    ],
    [ edge('N3','N2',1), edge('N2','N1',-1), edge('N1','N4',1), edge('N5','N2',1), edge('N4','N5',-1) ],
    [ indicator('I1','ER Wait Time','state','minutes',20,60,0.2) ],
    [ {label:'Hospitals',domain:'institution',role:'actor'}, {label:'Clinics',domain:'institution',role:'system'}, {label:'Residents',domain:'population',role:'beneficiary'} ],
    []
  ),
  loop('Cyber Incident Response','reactive','B','micro','P',['cyber','digital'],
    [
      node('N1','Incidents per week','indicator','I1'),
      node('N2','Patch Coverage','indicator','I2'),
      node('N3','Mean Time to Resolve','indicator','I3'),
      node('N4','Attack Surface','aux'),
    ],
    [ edge('N2','N1',-1), edge('N4','N1',1), edge('N1','N3',1), edge('N3','N2',-1) ],
    [
      indicator('I1','Incidents per week','rate','count',0,5,0.0),
      indicator('I2','Patch Coverage','rate','%',70,95,0.0),
      indicator('I3','MTTR','state','hours',2,12,0.2),
    ],
    [ {label:'Data Exchange Platform',domain:'product',role:'system'}, {label:'Procurement Office',domain:'institution',role:'actor'} ],
    []
  ),
  loop('Waste Collection Overflow','reactive','B','micro','N',['waste','services'],
    [
      node('N1','Waste Awaiting Pickup','stock'),
      node('N2','Collection Rate','flow'),
      node('N3','Fleet Availability','aux'),
      node('N4','Complaint Rate','indicator','I1'),
    ],
    [ edge('N3','N2',1), edge('N2','N1',-1), edge('N1','N4',1), edge('N4','N3',-1) ],
    [ indicator('I1','Complaints per 10k residents','rate','count',0,25,0.0) ],
    [ {label:'Public Works',domain:'institution',role:'actor'}, {label:'Residents',domain:'population',role:'beneficiary'} ],
    []
  ),
  loop('Air Quality Exposure','reactive','B','micro','N',['airquality','exposure'],
    [
      node('N1','PM2.5 Exposure Index','indicator','I1'),
      node('N2','Waste Burning Events','aux'),
      node('N3','Street Dust Resuspension','aux'),
      node('N4','Complaint Rate','indicator','I2'),
    ],
    [ edge('N2','N1',1), edge('N3','N1',1), edge('N4','N2',-1,'Complaints trigger enforcement') ],
    [
      indicator('I1','PM2.5 Exposure Index','state','µg/m³',5,35,0.2),
      indicator('I2','Air Quality Complaints','rate','count/day',0,20,0.0),
    ],
    [ {label:'Air Quality Monitors',domain:'product',role:'system'}, {label:'Public Works',domain:'institution',role:'actor'} ],
    []
  ),
];

// Glue together in order: Meta → Macro → Meso → Micro
const ALL: Payload[] = [ META, ...MACRO, ...MESO, ...MICRO ];

async function main() {
  console.log('Upserting Shared Nodes…');
  await upsertSNL();

  const results:any[] = [];
  for (const p of ALL) {
    // idempotent import by name: check if loop exists
    const { data: existing, error: findErr } = await sb
      .from('loops').select('id,name').eq('name', p.loop.name).maybeSingle();

    if (findErr) { console.error(findErr.message); continue; }

    let loopId: string|undefined = existing?.id;
    if (!loopId) {
      const { data, error } = await sb.rpc('import_loop', { payload: p, as_draft: true });
      if (error) { console.error('import_loop error', p.loop.name, error.message); continue; }
      loopId = data;
    } else {
      // Optional: re-import (update) by deleting draft and re-importing (skipped for safety)
      console.log('Exists:', p.loop.name);
    }

    // Try publish (will fail if lint checks block)
    const { data: pub, error: pubErr } = await sb.rpc('publish_loop', { loop_id: loopId });
    if (pubErr) {
      results.push({ name: p.loop.name, loop_id: loopId, published: false, reason: pubErr.message });
    } else {
      results.push({ name: p.loop.name, loop_id: loopId, published: true, version: pub?.version ?? null });
    }
  }
  console.table(results);
}

main().catch(e => { console.error(e); process.exit(1); });