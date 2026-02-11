export interface Perk {
  id: number;
  name: string;
  code: string;
  survivorCode: string;
  survivorName: string;
  description: string;
  icon: string;
}

export interface PerkResponse {
  status: string;
  results: number;
  data: Perk[];
}
