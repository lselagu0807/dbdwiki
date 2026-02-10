import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class Service {
  private url = "https://cyberluis.com/dba/api/survivor";

  constructor(private http: HttpClient) { }

  getPersonajes(): Observable<any[]> {
    return this.http.get<any[]>(this.url);
  }
}
