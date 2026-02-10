export interface SurvivorModel {
  name: string;
  imgs: { portrait: string; store: string };
  code: string;
  role: string; // <--- Asegúrate de añadir esta línea
  // ... resto de campos
}
