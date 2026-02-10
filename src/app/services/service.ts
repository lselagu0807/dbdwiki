import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Service {
  private url = "https://cyberluis.com/dba/api";

  private survivors = [];

  constructor(private http: HttpClient) { }

  getSurvivors(): Observable<any[]> {
    return this.http.get<any>(this.url + "/survivor").pipe(
      map(res => res.data || []) // <--- Esto extrae los 31 supervivientes
    );
  }

  getSurvivorPerksByCode(code: string): Observable<any[]> {
    // Usamos la ruta que aparece en tu captura para ir directo al grano
    return this.http.get<any>(`${this.url}/survivor/${code}/perk`).pipe(
      map(res => {
        // Según tu captura, los datos vienen dentro de 'data'
        return res.data || [];
      })
    );
  }


  getKillers(): Observable<any[]> {
    return this.http.get<any[]>(this.url + "/killer");
  }

  getKillerPerksByCode(code: string): Observable<any[]> {
    // Usamos la ruta que aparece en tu captura para ir directo al grano
    return this.http.get<any>(`${this.url}/killer/${code}/perk`).pipe(
      map(res => {
        // Según tu captura, los datos vienen dentro de 'data'
        return res.data || [];
      })
    );
  }

  getItems(): Observable<any[]> {
    return this.http.get<any[]>(this.url + "/item");
  }

  getAddonsByItemCode(itemCode: string): Observable<any[]> {
    // Siguiendo la estructura de tu API: /item/{code}/addon
    return this.http.get<any>(`${this.url}/item/${itemCode}/addon`).pipe(
      map(res => {
        // Accedemos a 'data' que es donde viene el array de addons en tus JSON
        // Si no hay datos, devolvemos un array vacío para que no pete el *ngFor
        return res.data || [];
      })
    );
  }

}
