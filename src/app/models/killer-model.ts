export interface KillerModel {
  status: string;
  results: number;
  data: KillerData[];
}

export interface KillerData {
  power: Power;
  imgs: Imgs;
  number: number;
  code: string;
  name: string;
  fullName: string;
  nationality: string;
  gender: string;
  licensed: boolean;
  dlc: string;
  difficulty: string;
  realm: string;
  powerAttackType: string;
  weapon: string;
  moveSpeed: string;
  terrorRadius: string;
  height: string;
  perks_names: string[];
  perks_ids: number[];
  overview: string;
  backstory: string;
}

export interface Power {
  powerId: number;
  powerName: string;
  powerCode: string;
}

export interface Imgs {
  portrait: string;
  store: string;
}
