import { get, set, push, uuid, KEYS } from './db';
import { sha256 } from '@/lib/hash';

// bump SEED_VERSION when you change seed content
const SEED_FLAG = 'seed:version';
const SEED_VERSION = 5;

function isoMonthsAgo(n:number){ const d=new Date(); d.setMonth(d.getMonth()-n); return d.toISOString(); }
function isoWeeksAgo(n:number){ const d=new Date(); d.setDate(d.getDate()-7*n); return d.toISOString(); }

export async function seedOnce() {
  const current = await get<number|undefined>(SEED_FLAG, undefined);
  if (current === SEED_VERSION) return;

  // 1) Indicators (targets + bands)
  const indicators = [
    { name:'Unemployment Rate (%)', target:4.0, bandL:3.5, bandU:4.5, freq:'monthly' },
    { name:'Rent CPI (YoY %)',       target:2.0, bandL:1.0, bandU:3.0, freq:'monthly' },
    { name:'Clinic Wait P90 (days)', target:7.0, bandL:0.0, bandU:10.0, freq:'weekly' },
    { name:'Retail Energy CPI (YoY %)', target:2.0, bandL:1.0, bandU:3.0, freq:'monthly' },
    { name:'Benefits Processing P50 (days)', target:10.0, bandL:0.0, bandU:14.0, freq:'weekly' },
  ].map(x => ({ id: uuid(), ...x }));

  await set(KEYS.indicators, indicators);

  // 2) Time series values (last point sets the band status)
  // NOTE: our mock band logic marks 'hard' if value is outside [L,U]
  const [unemp, rent, wait, energy, proc] = indicators;

  await set(KEYS.values(unemp.id), [
    { ts: isoMonthsAgo(5), value: 4.1 },
    { ts: isoMonthsAgo(4), value: 4.3 },
    { ts: isoMonthsAgo(3), value: 4.6 }, // soft→nearing hard
    { ts: isoMonthsAgo(2), value: 4.8 }, // hard (>4.5)
    { ts: isoMonthsAgo(1), value: 4.9 }, // hard
    { ts: isoMonthsAgo(0), value: 5.0 }, // hard (latest)
  ]);

  await set(KEYS.values(rent.id), [
    { ts: isoMonthsAgo(5), value: 2.1 },
    { ts: isoMonthsAgo(4), value: 2.4 },
    { ts: isoMonthsAgo(3), value: 2.7 },
    { ts: isoMonthsAgo(2), value: 2.9 },
    { ts: isoMonthsAgo(1), value: 3.2 }, // hard (>3.0)
    { ts: isoMonthsAgo(0), value: 3.4 }, // hard (latest)
  ]);

  await set(KEYS.values(wait.id), [
    { ts: isoWeeksAgo(5), value: 6.5 },
    { ts: isoWeeksAgo(4), value: 7.5 }, // soft
    { ts: isoWeeksAgo(3), value: 9.0 }, // soft
    { ts: isoWeeksAgo(2), value: 10.5 }, // hard (>10)
    { ts: isoWeeksAgo(1), value: 11.0 }, // hard
    { ts: isoWeeksAgo(0), value: 11.2 }, // hard (latest)
  ]);

  await set(KEYS.values(energy.id), [
    { ts: isoMonthsAgo(5), value: 1.8 },
    { ts: isoMonthsAgo(4), value: 2.2 },
    { ts: isoMonthsAgo(3), value: 2.5 },
    { ts: isoMonthsAgo(2), value: 2.7 },
    { ts: isoMonthsAgo(1), value: 2.9 },
    { ts: isoMonthsAgo(0), value: 2.6 }, // soft (inside band)
  ]);

  await set(KEYS.values(proc.id), [
    { ts: isoWeeksAgo(5), value: 9 },
    { ts: isoWeeksAgo(4), value: 10 },
    { ts: isoWeeksAgo(3), value: 11 },  // soft but inside band U=14
    { ts: isoWeeksAgo(2), value: 12 },
    { ts: isoWeeksAgo(1), value: 10 },
    { ts: isoWeeksAgo(0), value: 9 },   // in-band (latest)
  ]);

  // 3) REL tickets (so REL Board isn't empty)
  const rels = [
    { id: uuid(), indicatorId: unemp.id, breachClass:'Hard', stage:'think',    openedAt: isoWeeksAgo(1) },
    { id: uuid(), indicatorId: wait.id,  breachClass:'Hard', stage:'act',      openedAt: isoWeeksAgo(2) },
    { id: uuid(), indicatorId: rent.id,  breachClass:'Hard', stage:'monitor',  openedAt: isoWeeksAgo(2) },
  ];
  await set(KEYS.rels, rels);

  // demo gate for a fictional bundle item
  await push(KEYS.gate, {
    itemId: 'demo-item-1',
    authority:4, capacity:4, data:4, leverFit:4, safeguards:3, participation:4,
    outcome: 'ALLOW', createdAt: new Date().toISOString()
  });

  // 4) Transparency Packs (hashed; both timely and late)
  const opened0 = new Date(rels[0].openedAt).getTime();
  const opened1 = new Date(rels[1].openedAt).getTime();
  // timely: 48h after open
  const p0 = {
    id: uuid(), refType:'rel', refId: rels[0].id, type:'short',
    url:'/packs/REL-0-short-v1.pdf',
    publishedAt: new Date(opened0 + 48*3600*1000).toISOString(),
    hash: ''
  };
  p0.hash = await sha256(JSON.stringify(p0));
  await push(KEYS.packs, p0);
  // late update: 7 days after open (Full)
  const p1 = {
    id: uuid(), refType:'rel', refId: rels[0].id, type:'full',
    url:'/packs/REL-0-full-v2.pdf',
    publishedAt: new Date(opened0 + 7*24*3600*1000).toISOString(),
    hash: ''
  };
  p1.hash = await sha256(JSON.stringify(p1));
  await push(KEYS.packs, p1);
  // late short for second REL (to affect score)
  const p2 = {
    id: uuid(), refType:'rel', refId: rels[1].id, type:'short',
    url:'/packs/REL-1-short-v1.pdf',
    publishedAt: new Date(opened1 + 6*24*3600*1000).toISOString(),
    hash: ''
  };
  p2.hash = await sha256(JSON.stringify(p2));
  await push(KEYS.packs, p2);

  // 4b) One Meta-REL + Full pack (timely) so the meta tab isn't empty
  const meta = { id: uuid(), openedAt: isoWeeksAgo(3), mlhi: 65, mismatchPct: 0.18, conflicts: [], sequence: [] };
  await push(KEYS.meta, meta as any);
  const pMeta = {
    id: uuid(), refType:'meta', refId: meta.id, type:'full',
    url:'/packs/META-0-full.pdf',
    publishedAt: new Date(new Date(meta.openedAt).getTime() + 60*3600*1000).toISOString(),
    hash: ''
  };
  pMeta.hash = await sha256(JSON.stringify(pMeta));
  await push(KEYS.packs, pMeta);

  // 5) Participation (compressed & overdue) to demo Ship guard
  const overdueDue = new Date(); overdueDue.setDate(overdueDue.getDate()-3);
  await push(KEYS.participation, {
    relId: rels[1].id, method:'Panel', sampleSize:30,
    compliance:'Compressed', compressed:true, fullPackDue: overdueDue.toISOString().slice(0,10)
  });
  await set(KEYS.debt, { overdue: 1, items: [rels[1].id] });

  // 6) Gate Stacks library (macro→meso→micro steps)
  const stacks = [
    {
      id: uuid(), code:'E-1', title:'Rapid Re-employment', domain:'employment',
      description:'Drive quick return-to-work via hiring credits and activation.',
      equity:'Prioritize long-term unemployed; youth; single parents.',
      steps:[
        { arc:'P_to_R', actor:'Unemployed workers', level:'macro', note:'Outreach; activation' },
        { arc:'R_to_PS', actor:'Employment services', level:'meso', note:'Intake; case mgmt' },
        { arc:'PS_to_S', actor:'Labor ministry', level:'micro', note:'Incentives; hiring credit' },
      ]
    },
    {
      id: uuid(), code:'H-1', title:'Rent Pressure Relief', domain:'housing',
      description:'Mitigate short-run rent spikes with targeted rebates.',
      equity:'Low-income renters; families; seniors.',
      steps:[
        { arc:'P_to_R', actor:'Rent-burdened households', level:'macro' },
        { arc:'R_to_PS', actor:'Housing support agency', level:'meso' },
        { arc:'PS_to_S', actor:'Treasury', level:'micro', note:'Temporary rebate' },
      ]
    },
    {
      id: uuid(), code:'HE-1', title:'Clinic Throughput Boost', domain:'health',
      description:'Cut waits with extended hours and tele-triage.',
      equity:'Low-access regions.',
      steps:[
        { arc:'P_to_R', actor:'Patients', level:'macro' },
        { arc:'R_to_PS', actor:'Clinics', level:'meso', note:'Tele-triage' },
        { arc:'PS_to_S', actor:'Health ministry', level:'micro', note:'Extended hours funding' },
      ]
    },
    {
      id: uuid(), code:'EN-1', title:'Retail Energy Cushion', domain:'energy',
      description:'Cap bill shocks with time-limited subsidy.',
      equity:'Low-income households.',
      steps:[
        { arc:'P_to_R', actor:'Households', level:'macro' },
        { arc:'R_to_PS', actor:'Utilities', level:'meso' },
        { arc:'PS_to_S', actor:'Energy regulator', level:'micro', note:'Bill credit' },
      ]
    },
    {
      id: uuid(), code:'DP-1', title:'Digital Service Reliability', domain:'digital',
      description:'Stabilize core citizen services; SLOs & rollback playbooks.',
      equity:'Accessibility and language support.',
      steps:[
        { arc:'P_to_R', actor:'Users', level:'macro', note:'Bug triage' },
        { arc:'R_to_PS', actor:'Service teams', level:'meso', note:'SLO monitors' },
        { arc:'PS_to_S', actor:'Digital office', level:'micro', note:'Rollback guardrails' },
      ]
    },
  ];
  await set(KEYS.stacks, stacks as any);

  // 6b) Pre-apply one stack to demo item so Ship guard sees arcs
  const demoItem = 'demo-item-1';
  const st = stacks[0]; // E-1
  const applied = st.steps.map(s=>({ ...s, itemId: demoItem, stackId: st.id, stackCode: st.code }));
  await set(KEYS.applied(demoItem), applied as any);

  // mark done
  await set(SEED_FLAG, SEED_VERSION);
}
