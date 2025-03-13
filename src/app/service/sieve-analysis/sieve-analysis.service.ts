import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Test} from "../../model/test";
import {environment} from "../../../environments/environment";
import {Project} from "../../model/project";
import {SieveAnalysis} from "../../model/sieve-analysis";

@Injectable({
  providedIn: 'root'
})
export class SieveAnalysisService {

  constructor(private http: HttpClient) { }

  findAll(){
    return this.http.get<SieveAnalysis[]>(`${environment.url}sieve-analysis`);
  }

  findById(id: number) {
    return this.http.get<SieveAnalysis>(`${environment.url}sieve-analysis/${id}`);
  }

  insert(sieveAnalysis: SieveAnalysis) {
    return this.http.post<SieveAnalysis>(`${environment.url}sieve-analysis`, sieveAnalysis);
  }

  update(sieveAnalysis: SieveAnalysis , id: number) {
    return this.http.put<SieveAnalysis>(`${environment.url}sieve-analysis/${id}`, sieveAnalysis);
  }

  delete(id: number) {
    return this.http.delete<SieveAnalysis>(`${environment.url}sieve-analysis/${id}`);
  }
}
