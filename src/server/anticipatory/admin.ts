import { createClient } from "@supabase/supabase-js";

export function supaWithUser(jwt: string) {
  return createClient(
    process.env.SUPABASE_URL!, 
    process.env.SUPABASE_ANON_KEY!, 
    { 
      global: { 
        headers: { 
          Authorization: `Bearer ${jwt}` 
        } 
      }
    }
  );
}

export async function seedOrg(jwt: string, org_id: string, with_mock = true) {
  const sb = supaWithUser(jwt);
  const { data, error } = await sb.functions.invoke("admin-seed-org", { 
    body: { org_id, with_mock }
  });
  if (error) throw error; 
  return data;
}

export async function seedPlaybooksAndTriggers(jwt: string, org_id: string, also_backtests = true) {
  const sb = supaWithUser(jwt);
  const { data, error } = await sb.functions.invoke("admin-seed-playbooks-triggers", { 
    body: { org_id, also_backtests }
  });
  if (error) throw error; 
  return data;
}

export async function seedDemoBacktests(jwt: string, org_id: string, horizon = "P180D") {
  const sb = supaWithUser(jwt);
  const { data, error } = await sb.functions.invoke("admin-backtest-seeded", { 
    body: { org_id, horizon }
  });
  if (error) throw error; 
  return data;
}

export async function importIndicatorsJSON(jwt: string, org_id: string, payload: any[]) {
  const sb = supaWithUser(jwt);
  const { data, error } = await sb.functions.invoke("admin-import-indicators", { 
    body: { org_id, mode: "json", json: payload }
  });
  if (error) throw error; 
  return data;
}

export async function importIndicatorsCSV(
  jwt: string, 
  org_id: string, 
  csv: string, 
  csv_map: {
    loop_col: string;
    ind_col: string;
    time_col: string;
    value_col: string;
    lower_col?: string;
    upper_col?: string;
  }
) {
  const sb = supaWithUser(jwt);
  const { data, error } = await sb.functions.invoke("admin-import-indicators", { 
    body: { org_id, mode: "csv", csv, csv_map }
  });
  if (error) throw error; 
  return data;
}

export async function generateMock(jwt: string, org_id: string, episodes: any[]) {
  const sb = supaWithUser(jwt);
  const { data, error } = await sb.functions.invoke("admin-generate-mock", { 
    body: { org_id, episodes }
  });
  if (error) throw error; 
  return data;
}

// Full seeding chain helper
export async function seedFullAnticipatoryOrg(jwt: string, org_id: string) {
  console.log('Starting full anticipatory org seeding...');
  
  // Step 1: Basic org + mock indicators
  await seedOrg(jwt, org_id, true);
  console.log('✓ Basic org seeded');
  
  // Step 2: Playbooks, triggers, and backtests
  await seedPlaybooksAndTriggers(jwt, org_id, true);
  console.log('✓ Playbooks, triggers, and backtests seeded');
  
  console.log('🎉 Full anticipatory org seeding completed!');
  return { success: true };
}