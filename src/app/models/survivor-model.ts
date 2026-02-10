export interface SurvivorModel {
  imgs: {
    portrait: string;
    store: string;
  };
  number: number;
  name: string;
  code: string;
  licensed: boolean;
  difficulty: string;
  role: string;
  nationality: string;
  dlc: string;
  perks_names: string[];
  perks_ids: number[];
  overview: string;
  backstory: string;
  perks?: Perk[]; // Opcional porque puede que no siempre venga
  story?: string; // Alias para backstory o overview
}

export interface Perk {
  name: string;
  description: string;
  img?: string;
}
