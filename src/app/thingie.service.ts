
// thingie.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Thingie } from './thingie.model';

@Injectable({
  providedIn: 'root'
})
export class ThingieService {
  private apiUrl = 'http://processor/api/thingie';

  constructor(private http: HttpClient) {}

  processThingie(thingie: Thingie): Observable<any> {
    return this.http.post<any>(this.apiUrl, thingie);
  }
}

