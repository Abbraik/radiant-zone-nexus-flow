// Registry UI Types - separate from domain types to avoid circular imports

export interface RegistryFilters {
  loop_type: string[];
  motif: string[];
  layer: string[];
  status: string[];
  tags: string[];
  atlas_codes: string[];
  has_snl: boolean;
  has_de_band: boolean;
  has_srt: boolean;
}

export type ViewMode = 'cards' | 'table';
export type SortOption = 'updated' | 'name' | 'nodes' | 'indicators';

export const defaultFilters: RegistryFilters = {
  loop_type: [],
  motif: [],
  layer: [],
  status: [],
  tags: [],
  atlas_codes: [],
  has_snl: false,
  has_de_band: false,
  has_srt: false,
};