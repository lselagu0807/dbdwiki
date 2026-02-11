import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// Añadimos catchError y of para manejar los fallos individuales
import { Observable, map, forkJoin, switchMap, catchError, of } from 'rxjs';
import { Perk } from '../models/survivor-perks';

@Injectable({
    providedIn: 'root',
})
export class Service {
    private url = "https://cyberluis.com/dba/api";

    constructor(private http: HttpClient) { }

    getSurvivors(): Observable<any[]> {
        return this.http.get<any>(this.url + "/survivor").pipe(
            map(res => res.data || [])
        );
    }

    // Modificado para atrapar errores 404
    getSurvivorPerksByCode(code: string): Observable<any[]> {
        return this.http.get<any>(`${this.url}/survivor/${code}/perk`).pipe(
            map(res => res.data || []),
            catchError(error => {
                // Si la Nancy (o cualquier otro) da 404, devolvemos array vacío
                console.warn(`Error 404 en perks de: ${code}. Saltando...`);
                return of([]);
            })
        );
    }

    getAllSurvivorPerks(): Observable<Perk[]> {
        return this.getSurvivors().pipe(
            switchMap(survivors => {
                const requests = survivors.map(s => this.getSurvivorPerksByCode(s.code));
                return forkJoin(requests);
            }),
            map(allPerksArrays => {
                return allPerksArrays.flat();
            })
        );
    }

    // También lo aplicamos a los Killers por si acaso ocurre lo mismo
    getKillerPerksByCode(code: string): Observable<any[]> {
        return this.http.get<any>(`${this.url}/killer/${code}/perk`).pipe(
            map(res => res.data || []),
            catchError(() => of([]))
        );
    }

    getKillers(): Observable<any[]> {
        return this.http.get<any[]>(this.url + "/killer");
    }

    getItems(): Observable<any[]> {
        return this.http.get<any[]>(this.url + "/item");
    }

    getAddonsByItemCode(itemCode: string): Observable<any[]> {
        return this.http.get<any>(`${this.url}/item/${itemCode}/addon`).pipe(
            map(res => res.data || []),
            catchError(() => of([]))
        );
    }
}
