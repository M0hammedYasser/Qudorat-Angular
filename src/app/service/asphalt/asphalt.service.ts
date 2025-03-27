import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {SieveAnalysis} from "../../model/sieve-analysis";
import {environment} from "../../../environments/environment";
import {Asphalt} from "../../model/asphalt";

@Injectable({
  providedIn: 'root'
})
export class AsphaltService {

  constructor(private http: HttpClient) { }

  findAll(){
    return this.http.get<Asphalt[]>(`${environment.url}asphalt`);
  }

  findById(id: number) {
    return this.http.get<Asphalt>(`${environment.url}asphalt/${id}`);
  }

  insert(asphalt: Asphalt) {
    return this.http.post<Asphalt>(`${environment.url}asphalt`, asphalt);
  }

  update(asphalt: Asphalt , id: number) {
    return this.http.put<Asphalt>(`${environment.url}asphalt/${id}`, asphalt);
  }

  delete(id: number) {
    return this.http.delete<Asphalt>(`${environment.url}asphalt/${id}`);
  }
}
