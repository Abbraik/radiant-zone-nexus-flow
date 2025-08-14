import { get, set, push, uuid, KEYS } from './db';

// bump SEED_VERSION when you change seed content
const SEED_FLAG = 'seed:version';
const SEED_VERSION = 3;

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

  // 4) One Transparency Pack (Short) linked to the first REL
  const pack = {
    id: uuid(),
    refType: 'rel',
    refId: rels[0].id,
    type: 'short',
    url: '/packs/REL-demo-short.pdf',
    hash: 'demo-hash-placeholder',
    publishedAt: new Date().toISOString(),
  };
  await push(KEYS.packs, pack);

  // 5) Participation (compressed & overdue) to demo Ship guard
  const overdueDue = new Date(); overdueDue.setDate(overdueDue.getDate()-3);
  await push(KEYS.participation, {
    relId: rels[1].id, method:'Panel', sampleSize:30,
    compliance:'Compressed', compressed:true, fullPackDue: overdueDue.toISOString().slice(0,10)
  });
  await set(KEYS.debt, { overdue: 1, items: [rels[1].id] });

  // mark done
  await set(SEED_FLAG, SEED_VERSION);
}
