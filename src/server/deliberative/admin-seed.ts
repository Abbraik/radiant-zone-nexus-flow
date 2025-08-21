import { createClient } from "@supabase/supabase-js";

export type SeedTheme = "housing_ecology" | "external_demand";

export interface SeedDelibArgs {
  org_id: string;
  theme?: SeedTheme;
  with_frontier?: boolean;
  publish_dossier?: boolean;
  handoffs?: ("responsive"|"structural"|"reflexive")[];
}

export interface SeedDelibResult {
  ok: boolean;
  session_id: string;
  dossier_id?: string | null;
}

export async function seedDelibDemo(jwt: string, args: SeedDelibArgs): Promise<SeedDelibResult> {
  const sb = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      global: { headers: { Authorization: `Bearer ${jwt}` } }
    }
  );
  
  const { data, error } = await sb.functions.invoke("admin-seed-delib", { body: args });
  
  if (error) {
    throw new Error(`Failed to seed deliberative demo: ${error.message}`);
  }
  
  return data as SeedDelibResult;
}

/**
 * Convenience function to seed a housing ecology demo with full features
 */
export async function seedHousingEcologyDemo(jwt: string, org_id: string): Promise<SeedDelibResult> {
  return seedDelibDemo(jwt, {
    org_id,
    theme: "housing_ecology",
    with_frontier: true,
    publish_dossier: true,
    handoffs: ["responsive", "structural", "reflexive"]
  });
}

/**
 * Convenience function to seed an external demand demo with full features  
 */
export async function seedExternalDemandDemo(jwt: string, org_id: string): Promise<SeedDelibResult> {
  return seedDelibDemo(jwt, {
    org_id,
    theme: "external_demand", 
    with_frontier: true,
    publish_dossier: true,
    handoffs: ["responsive", "structural", "reflexive"]
  });
}

/**
 * Convenience function to seed a minimal demo (no frontier or dossier)
 */
export async function seedMinimalDemo(jwt: string, org_id: string, theme: SeedTheme = "housing_ecology"): Promise<SeedDelibResult> {
  return seedDelibDemo(jwt, {
    org_id,
    theme,
    with_frontier: false,
    publish_dossier: false
  });
}